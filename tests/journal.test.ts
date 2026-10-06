import { describe, it, expect } from 'vitest';
import {
  addEntry,
  readJournal,
  totals,
  formatDuration,
  STORAGE_KEY,
  MAX_ENTRIES,
  type LogEntry,
  type KeyValueStore,
} from '../src/journal.ts';

function memoryStore(initial?: string): KeyValueStore {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(STORAGE_KEY, initial);
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
  };
}

const entry = (over: Partial<LogEntry> = {}): LogEntry => ({
  at: '2026-10-07T09:00:00.000Z',
  cloud: 'cumulus',
  confidence: 0.7,
  screenSeconds: 30,
  skySeconds: 300,
  observation: 'grew',
  ...over,
});

describe('journal storage', () => {
  it('starts empty and survives corrupt data', () => {
    expect(readJournal(memoryStore())).toEqual([]);
    expect(readJournal(memoryStore('{not json'))).toEqual([]);
    expect(readJournal(memoryStore('{"a":1}'))).toEqual([]);
    expect(readJournal(memoryStore('[{"at":1}]'))).toEqual([]);
  });

  it('adds newest first and persists', () => {
    const s = memoryStore();
    addEntry(s, entry({ cloud: 'cirrus' }));
    addEntry(s, entry({ cloud: 'stratus' }));
    expect(readJournal(s).map((e) => e.cloud)).toEqual(['stratus', 'cirrus']);
  });

  it('caps the log size', () => {
    const s = memoryStore();
    for (let i = 0; i < MAX_ENTRIES + 5; i++) addEntry(s, entry());
    expect(readJournal(s)).toHaveLength(MAX_ENTRIES);
  });

  it('keeps working when storage throws', () => {
    const s: KeyValueStore = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(addEntry(s, entry())).toHaveLength(1);
  });
});

describe('totals', () => {
  it('sums screen and sky time and computes the ratio', () => {
    const t = totals([entry(), entry({ screenSeconds: 10, skySeconds: 100 })]);
    expect(t).toEqual({ sessions: 2, screenSeconds: 40, skySeconds: 400, ratio: 10 });
  });

  it('has no ratio without screen time', () => {
    expect(totals([]).ratio).toBeNull();
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0 s'],
    [42.4, '42 s'],
    [60, '1 min'],
    [61, '1 min 1 s'],
    [3600, '1 h'],
    [3725, '1 h 2 min'],
    [-5, '0 s'],
  ])('%s -> %s', (s, out) => {
    expect(formatDuration(s)).toBe(out);
  });
});
