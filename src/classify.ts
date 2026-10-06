// Pure classification logic, no model code here, so it is unit-testable.
// The image embedding comes from CLIP's vision tower (src/vision.ts); the
// text embeddings were precomputed at build time (scripts/build-embeddings.ts).

import { CLOUD_IDS, type CloudId } from './clouds.ts';

export interface EmbeddingFile {
  model: string;
  dim: number;
  /** Class id of each prompt row, in order. */
  classes: CloudId[];
  prompts: string[];
  /** Base64 of a little-endian Float32Array, rows = prompts, L2-normalised. */
  data: string;
}

export interface PromptBank {
  model: string;
  dim: number;
  classes: CloudId[];
  matrix: Float32Array;
}

export interface Ranked {
  id: CloudId;
  p: number;
}

export interface Verdict {
  kind: 'confident' | 'unsure' | 'notsky';
  top: Ranked;
  runnerUp: Ranked;
  ranking: Ranked[];
  /** Thunderstorm cloud is the top guess, the runner-up, or above STORM_AT. */
  stormRisk: boolean;
}

/** CLIP's learned logit scale (exp(4.6052) = 100). */
export const LOGIT_SCALE = 100;
/** Below this top probability we say "I'm torn between A and B". */
export const CONFIDENT_AT = 0.45;
/** Warn about a possible thunderstorm cloud above this probability. */
export const STORM_AT = 0.1;

export function base64ToFloat32(b64: string): Float32Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

export function float32ToBase64(arr: Float32Array): string {
  const bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function loadBank(file: EmbeddingFile): PromptBank {
  const matrix = base64ToFloat32(file.data);
  if (matrix.length !== file.classes.length * file.dim) {
    throw new Error(
      `Embedding size mismatch: ${matrix.length} floats for ${file.classes.length} prompts x ${file.dim}`,
    );
  }
  return { model: file.model, dim: file.dim, classes: file.classes, matrix };
}

export function l2normalize(v: ArrayLike<number>): Float32Array {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const n = Math.sqrt(s) || 1;
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / n;
  return out;
}

export function softmax(xs: number[]): number[] {
  const m = Math.max(...xs);
  const e = xs.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
}

/**
 * Score every class against one image embedding.
 * Each class has several prompts; a class's score is its best-matching prompt
 * (max), which works better than averaging for heterogeneous classes such as
 * "not the sky" (grass, rooms, people, screens...).
 */
export function rankClasses(
  imageEmbedding: ArrayLike<number>,
  bank: PromptBank,
  aggregate: 'max' | 'mean' = 'max',
): Ranked[] {
  const img = l2normalize(imageEmbedding);
  if (img.length !== bank.dim) throw new Error(`Expected ${bank.dim}-d embedding, got ${img.length}`);
  const best = new Map<CloudId, number>();
  const sum = new Map<CloudId, { s: number; n: number }>();
  for (let r = 0; r < bank.classes.length; r++) {
    let dot = 0;
    const off = r * bank.dim;
    for (let i = 0; i < bank.dim; i++) dot += img[i] * bank.matrix[off + i];
    const id = bank.classes[r];
    const prev = best.get(id);
    if (prev === undefined || dot > prev) best.set(id, dot);
    const acc = sum.get(id) ?? { s: 0, n: 0 };
    acc.s += dot;
    acc.n += 1;
    sum.set(id, acc);
  }
  const score = (id: CloudId) => {
    if (aggregate === 'max') return best.get(id) as number;
    const acc = sum.get(id) as { s: number; n: number };
    return acc.s / acc.n;
  };
  const ids = CLOUD_IDS.filter((id) => best.has(id));
  const probs = softmax(ids.map((id) => LOGIT_SCALE * score(id)));
  return ids.map((id, i) => ({ id, p: probs[i] })).sort((a, b) => b.p - a.p);
}

export function decide(ranking: Ranked[]): Verdict {
  if (ranking.length < 2) throw new Error('Need at least two classes to decide');
  const [top, runnerUp] = ranking;
  let kind: Verdict['kind'];
  if (top.id === 'notsky') kind = 'notsky';
  else if (top.p >= CONFIDENT_AT) kind = 'confident';
  else kind = 'unsure';
  const cb = ranking.find((r) => r.id === 'cumulonimbus');
  const stormRisk =
    top.id === 'cumulonimbus' || runnerUp.id === 'cumulonimbus' || (cb !== undefined && cb.p >= STORM_AT);
  return { kind, top, runnerUp, ranking, stormRisk };
}
