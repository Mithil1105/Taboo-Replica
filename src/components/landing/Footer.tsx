import { Link } from "react-router-dom";
import { ROUTES } from "@/content/siteConfig";
import { SITE_NAME, SITE_TAGLINE } from "@/content/siteConfig";
import appLogo from "@/images/applogo.png";
import { cn } from "@/lib/utils";

const footerLinks = [
  { to: ROUTES.home, label: "Home" },
  { to: ROUTES.howToPlay, label: "How to Play" },
  { to: ROUTES.gameModes, label: "Game Modes" },
  { to: ROUTES.faq, label: "FAQ" },
  { to: ROUTES.about, label: "About" },
  { to: ROUTES.contact, label: "Contact" },
  { to: ROUTES.play, label: "Start Playing" },
] as const;

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border/80 bg-muted/30 py-12 md:py-16",
        className
      )}
      role="contentinfo"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to={ROUTES.home} className="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors">
              <img src={appLogo} alt="" className="h-8 w-8 rounded-lg" aria-hidden />
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE_TAGLINE}
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {footerLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 border-t border-border/80 pt-8 text-center text-sm text-muted-foreground">
          © {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
