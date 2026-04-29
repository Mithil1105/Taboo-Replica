import { getSupabaseClient } from "@/lib/supabase/client";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  ok: boolean;
  deckId: string;
}

export async function createDeckOrder(deckId: string): Promise<CreateOrderResponse> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke<CreateOrderResponse>(
    "razorpay-create-order",
    { body: { deckId } }
  );
  if (error) throw new Error(error.message || "Failed to create order.");
  if (!data) throw new Error("Empty response from create-order.");
  return data;
}

export async function verifyDeckPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke<VerifyPaymentResponse>(
    "razorpay-verify-payment",
    { body: payload }
  );
  if (error) throw new Error(error.message || "Failed to verify payment.");
  if (!data?.ok) throw new Error("Payment verification failed.");
  return data;
}
