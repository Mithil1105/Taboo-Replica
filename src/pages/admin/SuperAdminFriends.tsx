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
import decksRegistry from "@/data/decks.json";
import { getValidatedDecks } from "@/lib/deckValidation";
import type { DeckMeta } from "@/types";

interface GrantRow {
  id: string;
  grantee_user_id: string;
  deck_id: string;
  starts_at: string;
  expires_at: string;
  revoked_at: string | null;
}

const decks = getValidatedDecks(decksRegistry) as DeckMeta[];

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function SuperAdminFriends() {
  const [rows, setRows] = useState<GrantRow[]>([]);
  const [userId, setUserId] = useState("");
  const [deckId, setDeckId] = useState("nsfw");
  const [expiresOn, setExpiresOn] = useState(toDateInputValue(new Date(Date.now() + 7 * 86400000)));
  const [note, setNote] = useState("");

  const load = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("friend_deck_grants")
      .select("id, grantee_user_id, deck_id, starts_at, expires_at, revoked_at")
      .order("created_at", { ascending: false })
      .limit(50);
    setRows((data ?? []) as GrantRow[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const onGrant = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    const expiresAt = new Date(`${expiresOn}T23:59:59Z`).toISOString();
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be signed in.");
      return;
    }

    const { error } = await supabase.from("friend_deck_grants").insert({
      grantee_user_id: userId.trim(),
      deck_id: deckId,
      granted_by_user_id: user.id,
      note: note.trim() || null,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Friend access granted.");
    setUserId("");
    setNote("");
    await load();
  };

  const revoke = async (id: string) => {
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("friend_deck_grants")
      .update({ revoked_at: new Date().toISOString(), revoked_by_user_id: user.id })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Access revoked.");
    await load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Friend timeline access</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Grant access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onGrant} className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Friend user UUID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="sm:col-span-2"
            />
            <Select value={deckId} onValueChange={setDeckId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decks
                  .filter((d) => d.isPremium)
                  .map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
            <Input
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <Button type="submit">Grant friend access</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent grants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No grants yet.</p>}
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-2 rounded-md border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{row.deck_id}</p>
                <p className="font-mono text-xs text-muted-foreground">{row.grantee_user_id}</p>
                <p className="text-xs text-muted-foreground">expires {new Date(row.expires_at).toLocaleString()}</p>
              </div>
              {row.revoked_at ? (
                <span className="text-xs text-muted-foreground">revoked</span>
              ) : (
                <Button variant="outline" size="sm" onClick={() => revoke(row.id)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
