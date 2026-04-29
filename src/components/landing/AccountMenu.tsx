import { Link, useLocation } from "react-router-dom";
import { LogOut, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AccountMenuProps {
  /** Mobile drawer onClose handler — called after navigation. */
  onNavigate?: () => void;
  /** Render a full-width variant for the mobile drawer. */
  variant?: "compact" | "full";
}

function getInitials(email: string | null | undefined): string {
  if (!email) return "?";
  const local = email.split("@")[0] || "";
  return local.slice(0, 2).toUpperCase() || "?";
}

export function AccountMenu({ onNavigate, variant = "compact" }: AccountMenuProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.configured) return null;

  const next = encodeURIComponent(location.pathname + location.search);

  if (!auth.user) {
    if (variant === "full") {
      return (
        <Button asChild className="w-full rounded-xl font-semibold" size="lg" variant="outline">
          <Link to={`/login?next=${next}`} onClick={onNavigate}>
            Sign in
          </Link>
        </Button>
      );
    }
    return (
      <Button asChild size="sm" variant="outline" className="rounded-xl font-semibold">
        <Link to={`/login?next=${next}`}>Sign in</Link>
      </Button>
    );
  }

  const initials = getInitials(auth.user.email);

  const handleSignOut = async () => {
    await auth.signOut();
    toast.success("Signed out.");
    onNavigate?.();
  };

  if (variant === "full") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{auth.user.email}</p>
            <p className="text-xs text-muted-foreground">
              {auth.role === "super_admin" ? "Signed in · super_admin" : "Signed in"}
            </p>
          </div>
        </div>
        {auth.role === "super_admin" && (
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to="/super-admin" onClick={onNavigate}>
              <Shield className="mr-2 h-4 w-4" /> Open Super Admin
            </Link>
          </Button>
        )}
        <Button onClick={handleSignOut} variant="outline" className="w-full rounded-xl">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary transition-colors hover:bg-primary/25"
        aria-label="Account menu"
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
          {auth.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs">
          <UserIcon className="mr-2 h-4 w-4" /> My decks (coming soon)
        </DropdownMenuItem>
        {auth.role === "super_admin" && (
          <DropdownMenuItem asChild>
            <Link to="/super-admin">
              <Shield className="mr-2 h-4 w-4" /> Super Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
