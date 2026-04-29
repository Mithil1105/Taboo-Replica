import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/content/siteConfig";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";
  const auth = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [signupPendingEmail, setSignupPendingEmail] = useState<string | null>(null);
  const [resendInSeconds, setResendInSeconds] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendInSeconds <= 0) return;
    const t = window.setInterval(() => {
      setResendInSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendInSeconds]);

  const handleResendVerification = async () => {
    if (!auth.configured) {
      toast.error("Authentication is not configured.");
      return;
    }
    if (resending || resendInSeconds > 0) return;
    const emailToResend = signupPendingEmail ?? email;
    if (!emailToResend) {
      toast.error("Please enter your email first.");
      return;
    }

    setResending(true);
    setInfo(null);
    try {
      const { error } = await auth.resendVerificationEmail(emailToResend);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Verification email resent.");
      setInfo("Verification email resent. Please check your inbox.");
      setResendInSeconds(60);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.configured) {
      toast.error("Authentication is not configured. Set Supabase env vars.");
      return;
    }
    setSubmitting(true);
    setInfo(null);
    if (tab === "signin") {
      setSignupPendingEmail(null);
      setResendInSeconds(0);
    }
    try {
      if (tab === "signin") {
        const { error } = await auth.signInWithPassword(email, password);
        if (error) {
          toast.error(error);
        } else {
          toast.success("Signed in.");
          navigate(next, { replace: true });
        }
      } else {
        const trimmedName = fullName.trim();
        if (!trimmedName) {
          toast.error("Please enter your name.");
          return;
        }
        setSignupPendingEmail(null);
        setResendInSeconds(0);
        const { error, needsConfirm } = await auth.signUpWithPassword(email, password, trimmedName);
        if (error) {
          toast.error(error);
        } else if (needsConfirm) {
          setSignupPendingEmail(email);
          setResendInSeconds(60);
          setInfo("Check your email for a confirmation link, then sign in.");
        } else {
          setSignupPendingEmail(null);
          setResendInSeconds(0);
          toast.success("Account created.");
          navigate(next, { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (!auth.configured) {
      toast.error("Authentication is not configured.");
      return;
    }
    setSubmitting(true);
    const { error } = await auth.signInWithGoogle(next);
    if (error) {
      toast.error(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign in"
        description="Sign in or create an Anathema account to unlock premium decks."
        canonicalUrl="/login"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8">
              <div className="mb-6 space-y-1 text-center">
                <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
                <p className="text-sm text-muted-foreground">
                  You only need an account to unlock premium decks. Pass &amp; Play and Local Multiplayer work without signing in.
                </p>
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {tab === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Name</Label>
                      <Input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        minLength={2}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={tab === "signin" ? "current-password" : "new-password"}
                      minLength={6}
                      required
                    />
                  </div>
                  {info && (
                    <p className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">{info}</p>
                  )}
                {tab === "signup" && signupPendingEmail && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={handleResendVerification}
                      disabled={resending || resendInSeconds > 0}
                    >
                      {resending
                        ? "Resending..."
                        : resendInSeconds > 0
                          ? `Resend in ${resendInSeconds}s`
                          : "Resend verification"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">If you don’t see it, check spam.</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={submitting || (tab === "signup" && signupPendingEmail === email)}
                >
                    {tab === "signin" ? "Sign in" : "Create account"}
                  </Button>
                </form>
              </Tabs>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleGoogle}
                disabled={submitting}
              >
                <GoogleIcon />
                <span className="ml-2">Continue with Google</span>
              </Button>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                <Link to={ROUTES.home} className="underline-offset-2 hover:underline">
                  Back to home
                </Link>
              </p>
            </div>
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
