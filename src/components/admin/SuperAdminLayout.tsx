import { Link, NavLink, Outlet } from "react-router-dom";
import { Shield, Users, KeyRound, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/content/siteConfig";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/super-admin", label: "Overview", icon: Shield, end: true },
  { to: "/super-admin/roles", label: "Roles", icon: Users },
  { to: "/super-admin/friends", label: "Friend Access", icon: KeyRound },
  { to: "/super-admin/payments", label: "Payments", icon: CreditCard },
];

export function SuperAdminLayout() {
  const { role } = useAuth();
  if (role !== "super_admin") {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Super Admin access is required for this section.
        </p>
        <Button asChild>
          <Link to={ROUTES.home}>Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/80 bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Super Admin</h1>
            <p className="text-xs text-muted-foreground">
              Manage account roles, friend access, and premium operations
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={ROUTES.home}>Back to site</Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
