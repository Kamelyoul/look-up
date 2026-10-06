import { describe, it, expect } from 'vitest';
import {
  base64ToFloat32,
  float32ToBase64,
  l2normalize,
  softmax,
  loadBank,
  rankClasses,
  decide,
  CONFIDENT_AT,
  type PromptBank,
} from '../src/classify.ts';
import type { CloudId } from '../src/clouds.ts';

// A toy 4-d bank: each class "lives" on one axis.
function toyBank(): PromptBank {
  const classes: CloudId[] = ['cumulus', 'cumulus', 'cirrus', 'notsky', 'notsky'];
  const rows = [
    [1, 0, 0, 0],
    [0.9, 0.1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  const matrix = new Float32Array(rows.flatMap((r) => [...l2normalize(r)]));
  return { model: 'toy', dim: 4, classes, matrix };
}

describe('base64 round trip', () => {
  it('preserves float32 values', () => {
    const a = new Float32Array([0, 1.5, -2.25, 3.0e-7, 42]);
    expect([...base64ToFloat32(float32ToBase64(a))]).toEqual([...a]);
  });
});

describe('math helpers', () => {
  it('l2normalize makes unit vectors and survives zero vectors', () => {
    const v = l2normalize([3, 4]);
    expect(v[0]).toBeCloseTo(0.6);
    expect(v[1]).toBeCloseTo(0.8);
    expect([...l2normalize([0, 0])]).toEqual([0, 0]);
  });

  it('softmax sums to 1 and is stable for large logits', () => {
    const p = softmax([1000, 1001, 999]);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
    expect(p[1]).toBeGreaterThan(p[0]);
  });
});

describe('loadBank', () => {
  it('rejects a size mismatch', () => {
    const data = float32ToBase64(new Float32Array(7));
    expect(() => loadBank({ model: 'm', dim: 4, classes: ['cirrus', 'cumulus'], prompts: ['a', 'b'], data })).toThrow(/mismatch/);
  });
});

describe('rankClasses', () => {
  it('ranks the matching class first and returns one entry per class', () => {
    const r = rankClasses([0.95, 0.05, 0, 0], toyBank());
    expect(r.map((x) => x.id).sort()).toEqual(['cirrus', 'cumulus', 'notsky']);
    expect(r[0].id).toBe('cumulus');
    expect(r.reduce((s, x) => s + x.p, 0)).toBeCloseTo(1);
  });

  it('uses the best prompt of a class (max), so a mixed "not sky" class still wins', () => {
    // Matches only the second "notsky" prompt; averaging would have diluted it.
    expect(rankClasses([0, 0, 0, 1], toyBank())[0].id).toBe('notsky');
  });

  it('mean aggregation dilutes a heterogeneous class (why the app uses max)', () => {
    const img = [0.3, 0, 0, 1];
    const max = rankClasses(img, toyBank(), 'max').find((x) => x.id === 'notsky')!.p;
    const mean = rankClasses(img, toyBank(), 'mean').find((x) => x.id === 'notsky')!.p;
    expect(max).toBeGreaterThan(mean);
  });

  it('does not care about the embedding scale', () => {
    const a = rankClasses([2, 1, 0, 0], toyBank());
    const b = rankClasses([20, 10, 0, 0], toyBank());
    expect(a.map((x) => x.p)).toEqual(b.map((x) => x.p));
  });

  it('rejects embeddings of the wrong size', () => {
    expect(() => rankClasses([1, 0, 0], toyBank())).toThrow(/4-d/);
  });
});

describe('decide', () => {
  it('is confident when the top class clears the threshold', () => {
    const v = decide([
      { id: 'cumulus', p: CONFIDENT_AT + 0.1 },
      { id: 'cirrus', p: 0.2 },
    ]);
    expect(v.kind).toBe('confident');
    expect(v.top.id).toBe('cumulus');
    expect(v.runnerUp.id).toBe('cirrus');
  });

  it('admits doubt below the threshold', () => {
    expect(decide([{ id: 'altocumulus', p: 0.4 }, { id: 'cirrocumulus', p: 0.38 }]).kind).toBe('unsure');
  });

  it('says "not the sky" whatever the confidence', () => {
    expect(decide([{ id: 'notsky', p: 0.3 }, { id: 'stratus', p: 0.29 }]).kind).toBe('notsky');
  });

  it('flags a possible thunderstorm even when it is not the top guess', () => {
    expect(decide([{ id: 'nimbostratus', p: 0.5 }, { id: 'cumulonimbus', p: 0.2 }]).stormRisk).toBe(true);
    expect(
      decide([
        { id: 'cumulus', p: 0.6 },
        { id: 'altocumulus', p: 0.2 },
        { id: 'cumulonimbus', p: 0.12 },
      ]).stormRisk,
    ).toBe(true);
    expect(
      decide([
        { id: 'cirrus', p: 0.8 },
        { id: 'contrail', p: 0.15 },
        { id: 'cumulonimbus', p: 0.01 },
      ]).stormRisk,
    ).toBe(false);
  });

  it('needs two classes', () => {
    expect(() => decide([{ id: 'cumulus', p: 1 }])).toThrow();
  });
});
