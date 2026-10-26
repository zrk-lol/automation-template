import type { Result } from "./check.js";

/** Sends one Discord message listing the sites that are down. */
export async function alertDiscord(webhookUrl: string, down: Result[], fetchImpl: typeof fetch = fetch) {
  if (!down.length) return false;
  const content = ["**Sites down**", ...down.map((result) => `• ${result.url} — ${result.status ?? result.error ?? "no answer"}`)].join("\n");
  const res = await fetchImpl(webhookUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) });
  return res.ok;
}
