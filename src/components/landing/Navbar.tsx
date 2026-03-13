import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { ROUTES } from "@/content/siteConfig";
import { SITE_NAME } from "@/content/siteConfig";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: ROUTES.home, label: "Home" },
  { to: ROUTES.howToPlay, label: "How to Play" },
  { to: ROUTES.gameModes, label: "Game Modes" },
  { to: ROUTES.faq, label: "FAQ" },
  { to: ROUTES.about, label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
        <Link
          to={ROUTES.home}
          className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              activeClassName="text-primary font-medium"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {label}
            </NavLink>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Button asChild size="sm" className="rounded-xl font-semibold">
              <Link to={ROUTES.play}>Start Playing</Link>
            </Button>
          </div>
        </div>

        {/* Mobile: menu + CTA + theme */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Button asChild size="sm" className="rounded-xl font-semibold">
            <Link to={ROUTES.play}>Start</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground hover:bg-muted"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="text-left font-bold">{SITE_NAME}</SheetTitle>
              </SheetHeader>
              <ul className="mt-6 flex flex-col gap-1">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setOpen(false)}
                      activeClassName="text-primary font-medium bg-primary/10"
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
                <li className="mt-4 border-t border-border pt-4">
                  <Button asChild className="w-full rounded-xl font-semibold" size="lg">
                    <Link to={ROUTES.play} onClick={() => setOpen(false)}>
                      Start Playing
                    </Link>
                  </Button>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
