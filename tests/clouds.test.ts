import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { CLOUDS, CLOUD_IDS, getCloud } from '../src/clouds.ts';
import { loadBank, type EmbeddingFile } from '../src/classify.ts';
import { MODEL_ID } from '../src/vision.ts';

describe('cloud knowledge base', () => {
  it('covers the 10 WMO genera plus contrail, clear and not-sky', () => {
    expect(CLOUD_IDS).toHaveLength(13);
    for (const g of ['cirrus', 'cirrocumulus', 'cirrostratus', 'altocumulus', 'altostratus', 'nimbostratus', 'stratocumulus', 'stratus', 'cumulus', 'cumulonimbus']) {
      expect(CLOUD_IDS).toContain(g);
    }
    expect(new Set(CLOUD_IDS).size).toBe(CLOUD_IDS.length);
  });

  it('gives every class prompts, a look-for hint and a mission', () => {
    for (const c of CLOUDS) {
      expect(c.prompts.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.lookFor.length, c.id).toBeGreaterThan(10);
      expect(c.mission.length, c.id).toBeGreaterThan(10);
    }
  });

  it('never sends people to watch a thunderstorm', () => {
    const cb = getCloud('cumulonimbus');
    expect(cb.danger).toBe(true);
    expect(cb.watchMinutes).toBe(0);
    expect(cb.mission.toLowerCase()).toContain('indoors');
  });

  it('throws on unknown ids', () => {
    expect(() => getCloud('nope' as never)).toThrow();
  });
});

describe('shipped embeddings', () => {
  const slug = MODEL_ID.split('/').pop();
  const file = JSON.parse(readFileSync(`src/data/embeddings-${slug}.json`, 'utf8')) as EmbeddingFile;

  it('were built for the model the app loads', () => {
    expect(file.model).toBe(MODEL_ID);
  });

  it('match the current prompts exactly (rebuild with `npm run embeddings` if this fails)', () => {
    const prompts = CLOUDS.flatMap((c) => c.prompts);
    const classes = CLOUDS.flatMap((c) => c.prompts.map(() => c.id));
    expect(file.prompts).toEqual(prompts);
    expect(file.classes).toEqual(classes);
  });

  it('decode to unit vectors', () => {
    const bank = loadBank(file);
    for (let r = 0; r < bank.classes.length; r++) {
      let s = 0;
      for (let i = 0; i < bank.dim; i++) s += bank.matrix[r * bank.dim + i] ** 2;
      expect(Math.sqrt(s)).toBeCloseTo(1, 4);
    }
  });
});
