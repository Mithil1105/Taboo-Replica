import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

// Load .env if present
const envPath = join(root, ".env");
if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^VITE_SITE_URL=(.+)$/);
    if (m) {
      process.env.VITE_SITE_URL = m[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }
}

const baseUrl = process.env.VITE_SITE_URL || "https://anathema.game";

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/how-to-play", priority: "0.9", changefreq: "monthly" },
  { path: "/game-modes", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/faq", priority: "0.9", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/play", priority: "0.95", changefreq: "weekly" },
  { path: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.5", changefreq: "yearly" },
];

const lastmod = new Date().toISOString().split("T")[0];

const urls = routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap);
console.log("Generated sitemap.xml with base URL:", baseUrl);
