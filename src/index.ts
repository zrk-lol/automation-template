import { appendFileSync } from "node:fs";
import { checkUrl, report } from "./check.js";
import { alertDiscord } from "./notify.js";

const urls = (process.env["URLS"] ?? "").split(",").map((url) => url.trim()).filter(Boolean);
if (!urls.length) throw new Error("URLS is empty (see .env.example)");
const slowMs = Number(process.env["SLOW_MS"] ?? 3000);

const results = await Promise.all(urls.map((url) => checkUrl(url)));
const markdown = report(results, slowMs);
console.log(markdown);
// In GitHub Actions, the report also shows on the run's summary page.
if (process.env["GITHUB_STEP_SUMMARY"]) appendFileSync(process.env["GITHUB_STEP_SUMMARY"], `${markdown}\n`);

const down = results.filter((result) => !result.ok);
const webhook = process.env["DISCORD_WEBHOOK_URL"];
if (webhook) await alertDiscord(webhook, down);
process.exitCode = down.length ? 1 : 0;
