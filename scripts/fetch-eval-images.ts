// Download a small, reproducible evaluation set from Wikimedia Commons:
// the first N JPEG photos of each cloud category (sorted by file name),
// as 480 px thumbnails, with author and licence recorded in eval/manifest.json.
// Images are NOT committed (see .gitignore); re-run this script to get them.
//   node scripts/fetch-eval-images.ts [perClass]

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import type { CloudId } from '../src/clouds.ts';

const PER_CLASS = Number(process.argv[2] ?? 12);
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'LookUpCloudEval/1.0 (open-source hackathon project; one-off evaluation)';

const CATEGORIES: Record<string, CloudId> = {
  'Cirrus clouds': 'cirrus',
  'Cirrocumulus clouds': 'cirrocumulus',
  'Cirrostratus clouds': 'cirrostratus',
  'Altocumulus clouds': 'altocumulus',
  'Altostratus clouds': 'altostratus',
  'Nimbostratus clouds': 'nimbostratus',
  'Stratocumulus clouds': 'stratocumulus',
  'Stratus clouds': 'stratus',
  'Cumulus clouds': 'cumulus',
  'Cumulonimbus clouds': 'cumulonimbus',
  Contrails: 'contrail',
  // Negatives: photos the app must refuse ("point me at the sky").
  Lawns: 'notsky',
  'Living rooms': 'notsky',
};

// Optional: only (re)fetch these categories and merge into the existing manifest.
//   node scripts/fetch-eval-images.ts 12 "Lawns,Living rooms"
const ONLY = process.argv[3]?.split(',').map((s) => s.trim());

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api(params: Record<string, string>): Promise<any> {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        /* rate-limited HTML page: back off */
      }
    }
    await sleep(5000 * (attempt + 1));
  }
  console.warn(`Commons API gave up (rate limit?): ${url}`);
  return null;
}

interface Member {
  title: string;
  ns: number;
}

async function members(cat: string, type: 'file' | 'subcat'): Promise<Member[]> {
  const d = await api({
    action: 'query',
    list: 'categorymembers',
    cmtitle: `Category:${cat}`,
    cmtype: type,
    cmlimit: '200',
    cmsort: 'sortkey',
  });
  await sleep(1000);
  return (d?.query?.categorymembers ?? []) as Member[];
}

// Commons categories are noisy (a monument photo with a wisp of cirrus gets
// tagged "Cirrus clouds"). Keep files whose *name* mentions this genus and
// no other genus, as a cheap proxy for "the cloud is the subject".
const KEYWORDS: Record<CloudId, string> = {
  cirrus: 'cirrus',
  cirrocumulus: 'cirrocumulus',
  cirrostratus: 'cirrostratus',
  altocumulus: 'altocumulus',
  altostratus: 'altostratus',
  nimbostratus: 'nimbostratus',
  stratocumulus: 'stratocumulus',
  stratus: 'stratus',
  cumulus: 'cumulus',
  cumulonimbus: 'cumulonimbus',
  contrail: 'contrail',
  clear: '',
  notsky: '',
};

function namesOnlyItsGenus(title: string, label: CloudId): boolean {
  const own = KEYWORDS[label];
  if (!own) return true; // negatives: any photo of the category
  let t = title.toLowerCase();
  if (!t.includes(own)) return false;
  t = t.split(own).join(' ');
  return !Object.entries(KEYWORDS).some(([id, kw]) => kw && id !== label && t.includes(kw));
}

let currentLabel: CloudId = 'cirrus';

async function filesFor(cat: string, need: number): Promise<string[]> {
  const isPhoto = (t: string) => /\.jpe?g$/i.test(t) && namesOnlyItsGenus(t, currentLabel);
  let files = (await members(cat, 'file')).map((m) => m.title).filter(isPhoto);
  if (files.length < need) {
    // e.g. "Cumulus clouds" keeps its photos in species subcategories.
    for (const sub of await members(cat, 'subcat')) {
      const name = sub.title.replace(/^Category:/, '');
      const more = (await members(name, 'file')).map((m) => m.title).filter(isPhoto);
      files = files.concat(more.slice(0, Math.ceil(need / 3)));
      if (files.length >= need * 2) break;
    }
  }
  return [...new Set(files)].slice(0, need);
}

interface ManifestEntry {
  label: CloudId;
  category: string;
  title: string;
  file: string;
  source: string;
  author: string;
  license: string;
}

const manifest: ManifestEntry[] = [];
if (ONLY && existsSync('eval/manifest.json')) {
  const previous: ManifestEntry[] = JSON.parse(readFileSync('eval/manifest.json', 'utf8'));
  manifest.push(...previous.filter((m) => !ONLY.includes(m.category)));
}
for (const [cat, label] of Object.entries(CATEGORIES)) {
  if (ONLY && !ONLY.includes(cat)) continue;
  currentLabel = label;
  const titles = await filesFor(cat, PER_CLASS);
  mkdirSync(`eval/images/${label}`, { recursive: true });
  for (const title of titles) {
    const d = await api({
      action: 'query',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '480',
    });
    await sleep(1000);
    if (!d) continue;
    const page: any = Object.values(d.query.pages)[0];
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) continue;
    const safe = title.replace(/^File:/, '').replace(/[^\w.-]+/g, '_').slice(0, 80);
    const file = `eval/images/${label}/${safe}`;
    if (!existsSync(file)) {
      const img = await fetch(info.thumburl, { headers: { 'User-Agent': UA } });
      if (!img.ok) continue;
      writeFileSync(file, Buffer.from(await img.arrayBuffer()));
      await sleep(300);
    }
    const meta = info.extmetadata ?? {};
    manifest.push({
      label,
      category: cat,
      title,
      file,
      source: info.descriptionurl,
      author: String(meta.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim(),
      license: String(meta.LicenseShortName?.value ?? ''),
    });
  }
  console.log(`${cat}: ${manifest.filter((m) => m.category === cat).length} images`);
}
writeFileSync('eval/manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Total: ${manifest.length} images -> eval/manifest.json`);
