// Evaluate the zero-shot cloud classifier on the Wikimedia Commons set
// downloaded by scripts/fetch-eval-images.ts. Uses exactly the same code
// path as the browser (src/vision.ts + src/classify.ts), same q8 weights.
//   node scripts/eval.ts [modelId]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { loadVisionEncoder, RawImage, MODEL_ID } from '../src/vision.ts';
import { loadBank, rankClasses, decide, type EmbeddingFile } from '../src/classify.ts';
import { CLOUDS, type CloudId } from '../src/clouds.ts';

const modelId = process.argv[2] ?? MODEL_ID;
const slug = modelId.split('/').pop();
const bank = loadBank(JSON.parse(readFileSync(`src/data/embeddings-${slug}.json`, 'utf8')) as EmbeddingFile);
const manifest: { label: CloudId; file: string; title: string }[] = JSON.parse(
  readFileSync('eval/manifest.json', 'utf8'),
);

const encoder = await loadVisionEncoder(modelId);

// Embed every image once, then compare scoring rules on the same vectors.
const t0 = Date.now();
const embeddings: Float32Array[] = [];
for (const item of manifest) embeddings.push(await encoder.embed(await RawImage.read(item.file)));
const ms = (Date.now() - t0) / manifest.length;

const quick = (aggregate: 'max' | 'mean') => {
  let ok = 0;
  manifest.forEach((item, i) => {
    if (item.label === 'notsky') return;
    ok += rankClasses(embeddings[i], bank, aggregate)[0].id === item.label ? 1 : 0;
  });
  return ok;
};
const meanTop1 = quick('mean');

let stormShown = 0;
let stormN = 0;
let stormFalse = 0;
let rejected = 0;
let negatives = 0;
let top1 = 0;
let top3 = 0;
let notsky = 0;
let confident = 0;
let confidentRight = 0;
const per: Record<string, { n: number; ok: number }> = {};
const confusion: Record<string, Record<string, number>> = {};
const rows: string[] = [];
for (const [idx, item] of manifest.entries()) {
  const v = decide(rankClasses(embeddings[idx], bank, 'max'));
  const predicted = v.top.id;
  const ok = predicted === item.label;
  const inTop3 = v.ranking.slice(0, 3).some((r) => r.id === item.label);
  per[item.label] ??= { n: 0, ok: 0 };
  per[item.label].n++;
  per[item.label].ok += ok ? 1 : 0;
  confusion[item.label] ??= {};
  confusion[item.label][predicted] = (confusion[item.label][predicted] ?? 0) + 1;
  rows.push(`| ${item.label} | ${predicted} (${(v.top.p * 100).toFixed(0)}%) | ${ok ? 'yes' : inTop3 ? 'top-3' : 'no'} | ${item.title} |`);
  if (item.label === 'notsky') {
    negatives++;
    rejected += ok ? 1 : 0;
    continue;
  }
  if (item.label === 'cumulonimbus') {
    stormN++;
    stormShown += v.stormRisk ? 1 : 0;
  } else if (v.stormRisk) stormFalse++;
  top1 += ok ? 1 : 0;
  top3 += inTop3 ? 1 : 0;
  notsky += predicted === 'notsky' ? 1 : 0;
  if (v.kind === 'confident') {
    confident++;
    confidentRight += ok ? 1 : 0;
  }
}

const n = manifest.length - negatives;
const pct = (a: number, b: number) => (b ? `${((100 * a) / b).toFixed(1)}%` : 'n/a');
const lines = [
  `# Evaluation: ${modelId} (q8), zero-shot, ${n} sky photos + ${negatives} non-sky photos from Wikimedia Commons`,
  '',
  `Run: ${new Date().toISOString()} - Node ${process.version}, CPU, ${ms.toFixed(0)} ms/image`,
  '',
  `Chance level with ${CLOUDS.length} classes: ${pct(1, CLOUDS.length)}. Accuracy rows below are over the ${n} sky photos.`,
  '',
  `| Metric | Value |`,
  `|---|---|`,
  `| Top-1 accuracy (shipped rule: best prompt per class) | ${top1}/${n} = ${pct(top1, n)} |`,
  `| Top-1 accuracy (alternative: mean over prompts) | ${meanTop1}/${n} = ${pct(meanTop1, n)} |`,
  `| Top-3 accuracy | ${top3}/${n} = ${pct(top3, n)} |`,
  `| Answers flagged "confident" | ${confident}/${n} |`,
  `| Accuracy when confident | ${confidentRight}/${confident} = ${pct(confidentRight, confident)} |`,
  `| Sky photos wrongly rejected as "not the sky" | ${notsky}/${n} |`,
  `| Non-sky photos (lawns, living rooms) correctly rejected | ${rejected}/${negatives} |`,
  `| Thunderstorm photos that get the storm warning (top guess or warning line) | ${stormShown}/${stormN} |`,
  `| Other sky photos that also get the storm warning (false alarms) | ${stormFalse}/${n - stormN} |`,
  '',
  '## Per class (top-1)',
  '',
  '| Class | Correct | Most common predictions |',
  '|---|---|---|',
  ...Object.entries(per).map(([k, s]) => {
    const preds = Object.entries(confusion[k])
      .sort((a, b) => b[1] - a[1])
      .map(([p, c]) => `${p} x${c}`)
      .join(', ');
    return `| ${k} | ${s.ok}/${s.n} | ${preds} |`;
  }),
  '',
  '## Every image',
  '',
  '| Label (Commons category) | Prediction | Correct | File |',
  '|---|---|---|---|',
  ...rows,
  '',
  'Caveat: Commons category labels are crowd-sourced, not expert-verified, and many photos contain several genera.',
];
mkdirSync('eval', { recursive: true });
writeFileSync(`eval/RESULTS-${slug}.md`, lines.join('\n'));
console.log(lines.slice(0, 30).join('\n'));
