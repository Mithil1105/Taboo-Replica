import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentRow {
  id: string;
  user_id: string;
  deck_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

function formatMoney(currency: string, amountMinor: number) {
  const value = amountMinor / 100;
  if (currency === "INR") return `₹${value.toLocaleString("en-IN")}`;
  return `${value.toLocaleString()} ${currency}`;
}

export default function SuperAdminPayments() {
  const [rows, setRows] = useState<PaymentRow[]>([]);

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("payment_orders")
        .select("id, user_id, deck_id, amount, currency, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      setRows((data ?? []) as PaymentRow[]);
    };
    void run();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payments</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No payments yet.</p>}
          {rows.map((row) => (
            <div key={row.id} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{row.deck_id}</span>
                <span>{formatMoney(row.currency, row.amount)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {row.status} · {new Date(row.created_at).toLocaleString()}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{row.user_id}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
