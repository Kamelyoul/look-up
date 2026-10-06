// Precompute CLIP text embeddings for every prompt in src/clouds.ts.
// Run once at build time (node >= 22.18 strips the TypeScript types):
//   node scripts/build-embeddings.ts [modelId]
// Output: src/data/embeddings-<model>.json, which the app ships instead of
// the ~60 MB text encoder.

import { writeFileSync, mkdirSync } from 'node:fs';
import { AutoTokenizer, CLIPTextModelWithProjection } from '@huggingface/transformers';
import { CLOUDS, type CloudId } from '../src/clouds.ts';
import { l2normalize, float32ToBase64, type EmbeddingFile } from '../src/classify.ts';
import { MODEL_ID, DTYPE } from '../src/vision.ts';

const modelId = process.argv[2] ?? MODEL_ID;
const tokenizer = await AutoTokenizer.from_pretrained(modelId);
const textModel = await CLIPTextModelWithProjection.from_pretrained(modelId, { dtype: DTYPE });

const prompts: string[] = [];
const classes: CloudId[] = [];
for (const c of CLOUDS) {
  for (const p of c.prompts) {
    prompts.push(p);
    classes.push(c.id);
  }
}

const inputs = tokenizer(prompts, { padding: true, truncation: true });
const { text_embeds } = await textModel(inputs);
const [n, dim] = text_embeds.dims as [number, number];
const raw = text_embeds.data as Float32Array;
const matrix = new Float32Array(n * dim);
for (let r = 0; r < n; r++) matrix.set(l2normalize(raw.subarray(r * dim, (r + 1) * dim)), r * dim);

const out: EmbeddingFile = { model: modelId, dim, classes, prompts, data: float32ToBase64(matrix) };
mkdirSync('src/data', { recursive: true });
const slug = modelId.split('/').pop();
const path = `src/data/embeddings-${slug}.json`;
writeFileSync(path, JSON.stringify(out));
console.log(`Wrote ${n} prompt embeddings (${dim}-d) for ${new Set(classes).size} classes to ${path}`);
