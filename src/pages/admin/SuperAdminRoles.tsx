import { FormEvent, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AccountRole } from "@/lib/auth/AuthProvider";

interface RoleRow {
  user_id: string;
  role: AccountRole;
  updated_at: string;
}

export default function SuperAdminRoles() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<AccountRole>("regular");

  const load = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("app_user_roles")
      .select("user_id, role, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    setRows((data ?? []) as RoleRow[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = userId.trim();
    if (!trimmed) return;
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("app_user_roles")
      .upsert({ user_id: trimmed, role }, { onConflict: "user_id" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Role updated.");
    setUserId("");
    await load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Account roles</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assign role</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="User UUID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="sm:col-span-2"
            />
            <Select value={role} onValueChange={(v) => setRole(v as AccountRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">regular</SelectItem>
                <SelectItem value="friend">friend</SelectItem>
                <SelectItem value="super_admin">super_admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="sm:col-span-3">
              <Button type="submit">Save role</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent role records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No role records yet.</p>}
          {rows.map((row) => (
            <div key={row.user_id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span className="font-mono text-xs">{row.user_id}</span>
              <span className="font-medium">{row.role}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
