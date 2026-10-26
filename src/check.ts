export type Result = { url: string; ok: boolean; status: number | null; ms: number; error?: string };

/** Checks one URL: status code and response time, with a timeout. */
export async function checkUrl(url: string, fetchImpl: typeof fetch = fetch, timeoutMs = 10_000): Promise<Result> {
  const started = performance.now();
  try {
    const res = await fetchImpl(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
    return { url, ok: res.ok, status: res.status, ms: Math.round(performance.now() - started) };
  } catch (error) {
    return { url, ok: false, status: null, ms: Math.round(performance.now() - started), error: error instanceof Error ? error.message : String(error) };
  }
}

/** A Markdown report, readable in a terminal, a GitHub job summary or Discord. */
export function report(results: Result[], slowMs: number) {
  const lines = results.map((result) => {
    const state = !result.ok ? "🔴 down" : result.ms > slowMs ? "🟠 slow" : "🟢 up";
    return `| ${state} | ${result.url} | ${result.status ?? "–"} | ${result.ms} ms |`;
  });
  return ["| State | URL | Status | Time |", "| --- | --- | --- | --- |", ...lines].join("\n");
}
