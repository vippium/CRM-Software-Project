// tools/generate-docs.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import puppeteer from "puppeteer";
import { swaggerSpec } from "../swagger.js";

async function run() {
  const outDir = path.resolve(process.cwd(), "docs");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const swaggerJsonPath = path.join(outDir, "openapi.json");
  fs.writeFileSync(swaggerJsonPath, JSON.stringify(swaggerSpec, null, 2));
  console.log("Wrote OpenAPI JSON to", swaggerJsonPath);

  const htmlOut = path.join(outDir, "api-docs.html");
  console.log("Bundling static HTML with redoc-cli...");
  try {
    execSync(
      `npx redoc-cli bundle "${swaggerJsonPath}" -o "${htmlOut}" --options.nativeScrollbars`,
      {
        stdio: "inherit",
      }
    );
    console.log("HTML generated at", htmlOut);
  } catch (err) {
    console.error("redoc-cli bundle failed", err);
    process.exit(1);
  }

  const pdfOut = path.join(outDir, "api-docs.pdf");
  console.log("Launching headless Chromium to render PDF...");
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("file://" + htmlOut, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfOut,
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "12mm", right: "12mm" },
  });
  await browser.close();
  console.log("PDF generated at", pdfOut);
}

run().catch((err) => {
  console.error("Error generating docs:", err);
  process.exit(1);
});
