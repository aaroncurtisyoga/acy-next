/**
 * One-time import of a Mailchimp audience export into Resend.
 *
 * Usage:
 *   npx tsx scripts/import-subscribers.ts <path-to-mailchimp-export.csv>
 *
 * Expects RESEND_API_KEY and RESEND_SEGMENT_ID in the environment
 * (falls back to reading .env.local / .env from the repo root).
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { Resend } from "resend";

function loadEnvFallback() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}

/** Minimal CSV line parser that handles quoted fields with embedded commas. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error(
      "Usage: npx tsx scripts/import-subscribers.ts <path-to-export.csv>",
    );
    process.exit(1);
  }

  loadEnvFallback();
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    console.error("Missing RESEND_API_KEY or RESEND_SEGMENT_ID.");
    process.exit(1);
  }

  const lines = readFileSync(resolve(csvPath), "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const emailIdx = header.findIndex((h) => h.includes("email"));
  const firstIdx = header.findIndex((h) => h.includes("first name"));
  const lastIdx = header.findIndex((h) => h.includes("last name"));
  if (emailIdx === -1) {
    console.error("Could not find an email column in the CSV header.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line);
    const email = fields[emailIdx]?.trim();
    if (!email) continue;

    const { error } = await resend.contacts.create({
      email,
      firstName: firstIdx !== -1 ? fields[firstIdx]?.trim() : undefined,
      lastName: lastIdx !== -1 ? fields[lastIdx]?.trim() : undefined,
      segments: [{ id: segmentId }],
    });

    if (!error) {
      created++;
      console.log(`✓ ${email}`);
    } else if (/already exist/i.test(error.message)) {
      skipped++;
      console.log(`- ${email} (already exists)`);
    } else {
      failed++;
      console.error(`✗ ${email}: ${error.message}`);
    }

    // Stay under Resend's default rate limit (2 req/s)
    await sleep(600);
  }

  console.log(
    `\nDone. Created: ${created}, already existed: ${skipped}, failed: ${failed}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
