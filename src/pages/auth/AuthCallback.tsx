import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const next = params.get("next") || "/";

    if (!isSupabaseConfigured) {
      navigate(next, { replace: true });
      return;
    }

    const code = params.get("code");
    const supabase = getSupabaseClient();

    const finish = async () => {
      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        }
      } catch {
        /* fall through; auth listener will pick up if hash flow */
      } finally {
        navigate(next, { replace: true });
      }
    };

    void finish();
  }, [navigate, params]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
