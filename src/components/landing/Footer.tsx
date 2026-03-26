import { Link } from "react-router-dom";
import { ROUTES } from "@/content/siteConfig";
import { SITE_NAME, SITE_TAGLINE } from "@/content/siteConfig";
import appLogo from "@/images/applogo.png";
import { cn } from "@/lib/utils";

const productLinks = [
  { to: ROUTES.home, label: "Home" },
  { to: ROUTES.howToPlay, label: "How to Play" },
  { to: ROUTES.gameModes, label: "Game Modes" },
  { to: ROUTES.faq, label: "FAQ" },
  { to: ROUTES.about, label: "About" },
  { to: ROUTES.contact, label: "Contact" },
  { to: ROUTES.play, label: "Start Playing" },
] as const;

const legalLinks = [
  { to: ROUTES.terms, label: "Terms of Service" },
  { to: ROUTES.privacy, label: "Privacy Policy" },
  { to: ROUTES.cookies, label: "Cookie Policy" },
] as const;

function FooterColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: readonly { to: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      <nav aria-label={ariaLabel}>
        <ul className="space-y-3">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border/80 bg-muted/30",
        className
      )}
      role="contentinfo"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Branding */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                to={ROUTES.home}
                className="inline-flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
              >
                <img src={appLogo} alt="" className="h-9 w-9 rounded-lg" aria-hidden />
                {SITE_NAME}
              </Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                {SITE_TAGLINE}
              </p>
            </div>

            {/* Product links */}
            <FooterColumn
              title="Product"
              links={productLinks}
              ariaLabel="Product navigation"
            />

            {/* Legal links */}
            <FooterColumn
              title="Legal"
              links={legalLinks}
              ariaLabel="Legal and compliance"
            />
          </div>
        </div>

        {/* Bottom bar: copyright + legal quick links */}
        <div className="border-t border-border/80 py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <p className="text-sm text-muted-foreground">
                © {year} {SITE_NAME}. All rights reserved.
              </p>
              <a href="https://clustrmaps.com/site/1c9k1" title="ClustrMaps" target="_blank" rel="noopener noreferrer" className="w-2 opacity-20 hover:opacity-100 transition-opacity">
                <img src="//www.clustrmaps.com/map_v2.png?d=Y38fR2MA0CRIxwT7yc6gda-6w3ny0GPHuvnCA5Vto-Y&cl=ffffff" alt="Map" className="w-full h-auto" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm order-1 sm:order-2">
              {legalLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
