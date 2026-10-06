// Sky log: what you saw, how long you looked up, how long the screen was on.
// Stored only in this browser's localStorage. Pure functions + an injectable
// storage so it can be unit-tested.

import type { CloudId } from './clouds.ts';

export type Observation = 'grew' | 'faded' | 'moved' | 'same' | 'skipped';

export interface LogEntry {
  at: string; // ISO date
  cloud: CloudId;
  confidence: number; // 0..1
  screenSeconds: number; // from opening the camera to pocketing the phone
  skySeconds: number; // from pocketing the phone to coming back
  observation: Observation;
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const STORAGE_KEY = 'look-up.journal.v1';
export const MAX_ENTRIES = 200;

function isEntry(x: unknown): x is LogEntry {
  if (!x || typeof x !== 'object') return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e.at === 'string' &&
    typeof e.cloud === 'string' &&
    typeof e.confidence === 'number' &&
    typeof e.screenSeconds === 'number' &&
    typeof e.skySeconds === 'number' &&
    typeof e.observation === 'string'
  );
}

export function readJournal(store: KeyValueStore): LogEntry[] {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function addEntry(store: KeyValueStore, entry: LogEntry): LogEntry[] {
  const next = [entry, ...readJournal(store)].slice(0, MAX_ENTRIES);
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep going, the log is a nicety */
  }
  return next;
}

export interface Totals {
  sessions: number;
  screenSeconds: number;
  skySeconds: number;
  /** Seconds looking up for every second looking at the screen. */
  ratio: number | null;
}

export function totals(entries: LogEntry[]): Totals {
  const screenSeconds = entries.reduce((s, e) => s + Math.max(0, e.screenSeconds), 0);
  const skySeconds = entries.reduce((s, e) => s + Math.max(0, e.skySeconds), 0);
  return {
    sessions: entries.length,
    screenSeconds,
    skySeconds,
    ratio: screenSeconds > 0 ? skySeconds / screenSeconds : null,
  };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m < 60) return rest ? `${m} min ${rest} s` : `${m} min`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h} h ${mm} min` : `${h} h`;
}
