import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type AccountRole = "regular" | "friend" | "super_admin";

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: AccountRole;
  loading: boolean;
  /** True only when Supabase env is missing — auth UI should hide. */
  configured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string; needsConfirm?: boolean }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AccountRole>("regular");
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  const resolveRole = async (nextSession: Session | null) => {
    if (!nextSession?.user || !isSupabaseConfigured) {
      setRole("regular");
      return;
    }

    const supabase = getSupabaseClient();
    const { data: rpcRole, error: rpcErr } = await supabase.rpc("get_my_account_role");
    if (!rpcErr && typeof rpcRole === "string") {
      const normalized = rpcRole as AccountRole;
      setRole(
        normalized === "super_admin" || normalized === "friend" || normalized === "regular"
          ? normalized
          : "regular"
      );
      return;
    }

    const { data, error } = await supabase
      .from("app_user_roles")
      .select("role")
      .eq("user_id", nextSession.user.id)
      .maybeSingle();
    if (error) {
      console.warn("[auth] role lookup failed; defaulting to regular", error.message);
      setRole("regular");
      return;
    }
    const nextRole = (data?.role as AccountRole | undefined) ?? "regular";
    setRole(nextRole);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      void resolveRole(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      void resolveRole(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: session?.user ?? null,
      session,
      role,
      loading,
      configured: isSupabaseConfigured,
      async signInWithPassword(email, password) {
        if (!isSupabaseConfigured) return { error: "Authentication is not configured." };
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      async signUpWithPassword(email, password, fullName) {
        if (!isSupabaseConfigured) return { error: "Authentication is not configured." };
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              name: fullName.trim(),
            },
          },
        });
        if (error) return { error: error.message };
        return { needsConfirm: !data.session };
      },
      async signInWithGoogle(redirectTo) {
        if (!isSupabaseConfigured) return { error: "Authentication is not configured." };
        const supabase = getSupabaseClient();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const callback = `${origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: callback },
        });
        return error ? { error: error.message } : {};
      },
      async resendVerificationEmail(email) {
        if (!isSupabaseConfigured) return { error: "Authentication is not configured." };
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        return error ? { error: error.message } : {};
      },
      async signOut() {
        if (!isSupabaseConfigured) return;
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
      },
      async refreshRole() {
        await resolveRole(session);
      },
    };
  }, [session, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
