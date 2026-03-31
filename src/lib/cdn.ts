import type { CdnItemData, CdnNpcData } from "../types";

const CDN_BASE = "https://cdn.projectgorgon.com";
const VERSION_URL = "https://client.projectgorgon.com/fileversion.txt";
const CACHE_PREFIX = "pgfavor_";
const DEFAULT_VERSION = "458";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

function getCached<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded - ignore
  }
}

async function getVersion(): Promise<string> {
  try {
    const res = await fetch(VERSION_URL);
    if (res.ok) {
      const text = await res.text();
      return text.trim();
    }
  } catch {
    // fallback
  }
  return DEFAULT_VERSION;
}

async function fetchCdnCached<T>(version: string, file: string): Promise<T> {
  const key = CACHE_PREFIX + version + "_" + file;
  const cached = getCached<T>(key);
  if (cached) return cached;

  const url = `${CDN_BASE}/v${version}/data/${file}`;
  const data = await fetchJson<T>(url);
  setCache(key, data);
  return data;
}

export interface CdnResult {
  items: Record<string, CdnItemData>;
  npcs: Record<string, CdnNpcData>;
  version: string;
}

export async function loadCdnData(): Promise<CdnResult> {
  const version = await getVersion();

  const [rawItems, rawNpcs] = await Promise.all([
    fetchCdnCached<Record<string, CdnItemData>>(version, "items.json"),
    fetchCdnCached<Record<string, CdnNpcData>>(version, "npcs.json"),
  ]);

  return { items: rawItems, npcs: rawNpcs, version };
}
