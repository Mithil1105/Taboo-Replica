// Supabase Edge Function: razorpay-verify-payment
// Verifies the Razorpay payment signature, marks the order paid, and inserts
// a deck_unlocks row for the calling user.
//
// Verification: hmacSHA256("<order_id>|<payment_id>", RAZORPAY_KEY_SECRET) === razorpay_signature
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

interface VerifyBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body: VerifyBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const orderId = body.razorpay_order_id?.trim();
  const paymentId = body.razorpay_payment_id?.trim();
  const signature = body.razorpay_signature?.trim();
  if (!orderId || !paymentId || !signature) {
    return errorResponse("Missing payment fields.");
  }

  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keySecret) {
    return errorResponse("Razorpay credentials are not configured.", 500);
  }

  const userClient = getUserSupabase(req);
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return errorResponse("Authentication required", 401);
  }
  const user = userData.user;

  const expected = await hmacSha256Hex(keySecret, `${orderId}|${paymentId}`);
  const valid = timingSafeEqualHex(expected, signature);

  const admin = getAdminSupabase();

  // Look up the order; ensure it belongs to this user.
  const { data: order, error: orderErr } = await admin
    .from("payment_orders")
    .select("id, user_id, deck_id, status")
    .eq("razorpay_order_id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return errorResponse("Order not found.", 404);
  }
  if (order.user_id !== user.id) {
    return errorResponse("Order does not belong to this user.", 403);
  }

  if (!valid) {
    await admin
      .from("payment_orders")
      .update({
        status: "failed",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      })
      .eq("id", order.id);
    return errorResponse("Signature verification failed.", 400);
  }

  // Idempotent if already paid.
  if (order.status !== "paid") {
    const { error: updErr } = await admin
      .from("payment_orders")
      .update({
        status: "paid",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      })
      .eq("id", order.id);
    if (updErr) {
      console.error("[razorpay-verify-payment] update order failed", updErr);
      return errorResponse("Could not finalize order.", 500);
    }
  }

  const { error: unlockErr } = await admin
    .from("deck_unlocks")
    .upsert(
      { user_id: user.id, deck_id: order.deck_id, order_id: order.id },
      { onConflict: "user_id,deck_id" }
    );
  if (unlockErr) {
    console.error("[razorpay-verify-payment] unlock insert failed", unlockErr);
    return errorResponse("Could not record unlock.", 500);
  }

  return jsonResponse({ ok: true, deckId: order.deck_id });
});
