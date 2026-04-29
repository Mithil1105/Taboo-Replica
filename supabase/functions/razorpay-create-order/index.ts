// Supabase Edge Function: razorpay-create-order
// Creates a Razorpay Order for a premium deck and persists a `payment_orders`
// row in `created` state. Requires an authenticated user.
//
// Secrets (set with `supabase secrets set`):
//   RAZORPAY_KEY_ID
//   RAZORPAY_KEY_SECRET
//   SUPABASE_URL              (provided by runtime)
//   SUPABASE_ANON_KEY         (provided by runtime)
//   SUPABASE_SERVICE_ROLE_KEY (provided by runtime)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, { status });
}

const DECK_PRICES_INR: Record<string, number> = {
  nsfw: 9900,
  nsfw2: 9900,
  bollywood2: 9900,
  hollywood2: 9900,
};

function getDeckPriceInr(deckId: string): number | null {
  return Object.prototype.hasOwnProperty.call(DECK_PRICES_INR, deckId)
    ? DECK_PRICES_INR[deckId]
    : null;
}

function getUserSupabase(req: Request) {
  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getAdminSupabase() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

interface CreateOrderBody {
  deckId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const deckId = body.deckId?.trim();
  if (!deckId) return errorResponse("deckId is required");

  const price = getDeckPriceInr(deckId);
  if (!price || price <= 0) {
    return errorResponse(`Deck "${deckId}" is not purchasable.`, 400);
  }

  const userClient = getUserSupabase(req);
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return errorResponse("Authentication required", 401);
  }
  const user = userData.user;

  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) {
    return errorResponse("Razorpay credentials are not configured.", 500);
  }

  const admin = getAdminSupabase();

  // Optional: short-circuit if user already owns the deck.
  const { data: existingUnlock } = await admin
    .from("deck_unlocks")
    .select("deck_id")
    .eq("user_id", user.id)
    .eq("deck_id", deckId)
    .maybeSingle();
  if (existingUnlock) {
    return errorResponse("Deck is already unlocked.", 409);
  }

  const receipt = `dk_${deckId}_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40);
  const orderResp = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: price,
      currency: "INR",
      receipt,
      notes: { deckId, userId: user.id },
    }),
  });

  if (!orderResp.ok) {
    const text = await orderResp.text();
    console.error("[razorpay-create-order] order create failed", orderResp.status, text);
    return errorResponse("Could not create Razorpay order.", 502);
  }

  const order = (await orderResp.json()) as { id: string; amount: number; currency: string };

  const { error: insertErr } = await admin.from("payment_orders").insert({
    user_id: user.id,
    deck_id: deckId,
    razorpay_order_id: order.id,
    amount: price,
    currency: "INR",
    status: "created",
  });
  if (insertErr) {
    console.error("[razorpay-create-order] insert payment_orders failed", insertErr);
    return errorResponse("Could not record order.", 500);
  }

  return jsonResponse({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  });
});
