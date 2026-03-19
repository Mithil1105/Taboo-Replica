import sharp from "sharp";
import toIco from "to-ico";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcLogo = join(root, "src", "images", "applogo.png");
const publicDir = join(root, "public");

async function generateIcons() {
  await mkdir(publicDir, { recursive: true });

  const logo = sharp(srcLogo);

  // Favicon PNGs
  await logo.clone().resize(32, 32).toFile(join(publicDir, "favicon-32x32.png"));
  await logo.clone().resize(16, 16).toFile(join(publicDir, "favicon-16x16.png"));

  // PWA icons
  await logo.clone().resize(192, 192).toFile(join(publicDir, "icon-192.png"));
  await logo.clone().resize(512, 512).toFile(join(publicDir, "icon-512.png"));

  // Apple touch icon (180x180)
  await logo.clone().resize(180, 180).toFile(join(publicDir, "apple-touch-icon.png"));

  // favicon.ico (multi-size)
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      logo
        .clone()
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = await toIco(pngBuffers);
  await writeFile(join(publicDir, "favicon.ico"), icoBuffer);

  // og-image.png (1200x630) - logo centered on branded background #0f172a
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoSize = 400;
  const logoBuffer = await logo
    .clone()
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  const ogImage = sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 3,
      background: { r: 15, g: 23, b: 42 },
    },
  })
    .composite([{ input: logoBuffer, top: (ogHeight - logoSize) / 2, left: (ogWidth - logoSize) / 2 }])
    .png();

  await ogImage.toFile(join(publicDir, "og-image.png"));

  console.log("Generated: favicon.ico, favicon-16x16.png, favicon-32x32.png, icon-192.png, icon-512.png, apple-touch-icon.png, og-image.png");
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
