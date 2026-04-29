import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountState {
  users: number;
  payments: number;
  unlocks: number;
  activeFriendGrants: number;
}

export default function SuperAdminOverview() {
  const [counts, setCounts] = useState<CountState>({
    users: 0,
    payments: 0,
    unlocks: 0,
    activeFriendGrants: 0,
  });

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseClient();
      const nowIso = new Date().toISOString();
      const [{ count: users }, { count: payments }, { count: unlocks }, { count: grants }] =
        await Promise.all([
          supabase.from("app_user_roles").select("*", { count: "exact", head: true }),
          supabase.from("payment_orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
          supabase.from("deck_unlocks").select("*", { count: "exact", head: true }),
          supabase
            .from("friend_deck_grants")
            .select("*", { count: "exact", head: true })
            .is("revoked_at", null)
            .lte("starts_at", nowIso)
            .gte("expires_at", nowIso),
        ]);

      setCounts({
        users: users ?? 0,
        payments: payments ?? 0,
        unlocks: unlocks ?? 0,
        activeFriendGrants: grants ?? 0,
      });
    };
    void run();
  }, []);

  const items = [
    { label: "Role records", value: counts.users },
    { label: "Paid orders", value: counts.payments },
    { label: "Lifetime unlocks", value: counts.unlocks },
    { label: "Active friend grants", value: counts.activeFriendGrants },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
