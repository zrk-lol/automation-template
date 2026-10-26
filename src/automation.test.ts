import { describe, expect, it } from "vitest";
import { checkUrl, report } from "./check.js";
import { alertDiscord } from "./notify.js";

const fakeFetch = (status: number | "fail") => (async () => {
  if (status === "fail") throw new Error("ECONNREFUSED");
  return new Response("", { status });
}) as unknown as typeof fetch;

describe("checkUrl", () => {
  it("reports up, down and unreachable sites", async () => {
    expect((await checkUrl("https://a", fakeFetch(200))).ok).toBe(true);
    expect((await checkUrl("https://b", fakeFetch(500))).ok).toBe(false);
    const failed = await checkUrl("https://c", fakeFetch("fail"));
    expect(failed).toMatchObject({ ok: false, status: null, error: "ECONNREFUSED" });
  });
});

describe("report", () => {
  it("marks slow and down sites", () => {
    const text = report([{ url: "a", ok: true, status: 200, ms: 50 }, { url: "b", ok: true, status: 200, ms: 5000 }, { url: "c", ok: false, status: 503, ms: 20 }], 3000);
    expect(text).toContain("🟢 up | a");
    expect(text).toContain("🟠 slow | b");
    expect(text).toContain("🔴 down | c");
  });
});

describe("alertDiscord", () => {
  it("sends nothing when every site is up", async () => {
    expect(await alertDiscord("https://hook", [], fakeFetch(204))).toBe(false);
  });
  it("posts the list of sites that are down", async () => {
    let sent = "";
    const capture = (async (_url: string, init: RequestInit) => { sent = String(init.body); return new Response(null, { status: 204 }); }) as typeof fetch;
    expect(await alertDiscord("https://hook", [{ url: "https://c", ok: false, status: 503, ms: 1 }], capture)).toBe(true);
    expect(sent).toContain("https://c");
  });
});
