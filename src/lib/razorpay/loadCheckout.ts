/**
 * Lazy-load the Razorpay Checkout script.
 * Returns the global Razorpay constructor once available, or throws on failure.
 */
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: { email?: string; name?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

let loadPromise: Promise<typeof window.Razorpay> | null = null;

export function loadRazorpayCheckout(): Promise<NonNullable<typeof window.Razorpay>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only run in the browser."));
  }
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  if (!loadPromise) {
    loadPromise = new Promise<typeof window.Razorpay>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Razorpay));
        existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay Checkout.")));
        return;
      }
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("Failed to load Razorpay Checkout."));
      };
      document.head.appendChild(script);
    });
  }
  return loadPromise.then((rzp) => {
    if (!rzp) throw new Error("Razorpay Checkout did not load.");
    return rzp;
  });
}
