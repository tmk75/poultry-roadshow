import { fallbackSnapshot } from "./data.js";

export async function fetchTelemetry() {
  try {
    const res = await fetch("/api/telemetry", { cache: "no-store" });
    if (!res.ok) throw new Error("telemetry request failed");
    return await res.json();
  } catch {
    return fallbackSnapshot();
  }
}
