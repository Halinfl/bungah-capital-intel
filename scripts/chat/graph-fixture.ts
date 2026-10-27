/**
 * Read-only graph fixture for scripts: when BUNGAH_GRAPH_FIXTURE=<dir of the nightly export>
 * (Market/Asset/Signal/Radar/Finding .jsonl.gz), the chat's three graph reads come from that dump
 * instead of the database. Used on the box, which cannot reach Postgres on 5432. Never writes anything.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;
const DATE_KEYS = new Set(["createdAt", "updatedAt"]);

function load(dir: string, table: string): Row[] {
  const raw = zlib.gunzipSync(fs.readFileSync(path.join(dir, `${table}.jsonl.gz`))).toString("utf8");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const o = JSON.parse(l) as Row;
      for (const k of Object.keys(o)) if (DATE_KEYS.has(k) && typeof o[k] === "string") o[k] = new Date(o[k] as string);
      return o;
    });
}
const byCreatedDesc = (a: Row, b: Row) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime();

export function installGraphFixture(dir = process.env.BUNGAH_GRAPH_FIXTURE): boolean {
  if (!dir) return false;
  const markets = load(dir, "Market");
  const assets = load(dir, "Asset");
  const signals = load(dir, "Signal");
  const radars = load(dir, "Radar");
  const findings = load(dir, "Finding");
  const full = markets
    .map((m): Row => ({
      ...m,
      assets: assets.filter((a) => a.marketId === m.id),
      signals: signals.filter((s) => s.marketId === m.id).sort(byCreatedDesc),
    }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  const p = prisma as unknown as Record<string, Record<string, unknown>>;
  p.market.findMany = async () => structuredClone(full);
  p.signal.findMany = async () => structuredClone(signals.filter((s) => s.marketId == null).sort(byCreatedDesc));
  p.radar.findMany = async () =>
    structuredClone(radars.map((r) => ({ ...r, findings: findings.filter((f) => f.radarId === r.id).sort(byCreatedDesc).slice(0, 10) })));
  return true;
}
