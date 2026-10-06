import './style.css';
import embeddingsFile from './data/embeddings-clip-vit-base-patch16.json';
import { getCloud } from './clouds.ts';
import { loadBank, rankClasses, decide, type EmbeddingFile, type Verdict } from './classify.ts';
import { addEntry, readJournal, totals, formatDuration, type Observation } from './journal.ts';
import type { VisionEncoder } from './vision.ts';

const bank = loadBank(embeddingsFile as EmbeddingFile);
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const statusEl = $('status');
const progressEl = $<HTMLProgressElement>('progress');
const resultEl = $('result');
const awayEl = $('away');
const debrief = $<HTMLDialogElement>('debrief');

// Optional link to the source code, set at build time: VITE_REPO_URL=https://github.com/...
const repoUrl = import.meta.env.VITE_REPO_URL as string | undefined;
if (repoUrl && /^https:\/\//.test(repoUrl)) {
  const a = document.createElement('a');
  a.href = repoUrl;
  a.rel = 'noopener';
  a.textContent = 'Source code';
  $('repo-link').append(a, '.');
}

// The store may be unavailable (private mode, blocked storage): fall back to memory.
const memory = new Map<string, string>();
const store = {
  getItem: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return memory.get(k) ?? null;
    }
  },
  setItem: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      memory.set(k, v);
    }
  },
};

// ---------- model loading (once, then cached by the browser for offline use)

let encoderPromise: Promise<VisionEncoder> | null = null;
const fileProgress = new Map<string, { loaded: number; total: number }>();

function onProgress(info: unknown) {
  const i = info as { status?: string; file?: string; loaded?: number; total?: number };
  if (i.status === 'progress' && i.file && i.total) {
    fileProgress.set(i.file, { loaded: i.loaded ?? 0, total: i.total });
    let loaded = 0;
    let total = 0;
    for (const f of fileProgress.values()) {
      loaded += f.loaded;
      total += f.total;
    }
    progressEl.hidden = false;
    progressEl.value = Math.round((100 * loaded) / total);
    statusEl.textContent = `Downloading the model once: ${(loaded / 1e6).toFixed(0)} / ${(total / 1e6).toFixed(0)} MB. After this it works offline.`;
  }
}

function getEncoder(): Promise<VisionEncoder> {
  if (!encoderPromise) {
    statusEl.textContent = 'Loading the model…';
    encoderPromise = import('./vision.ts')
      .then((m) => m.loadVisionEncoder(m.MODEL_ID, onProgress))
      .then((enc) => {
        progressEl.hidden = true;
        statusEl.textContent = 'Model ready. It is stored on this device, so it also works with no signal.';
        return enc;
      })
      .catch((err) => {
        encoderPromise = null;
        progressEl.hidden = true;
        statusEl.textContent = `Could not load the model (${String(err?.message ?? err)}). Check your connection for the first load and try again.`;
        throw err;
      });
  }
  return encoderPromise;
}

$('prepare').addEventListener('click', () => {
  getEncoder().catch(() => undefined);
});

// ---------- reading the sky

let sessionStart = 0; // when the user reached for the camera
let current: { verdict: Verdict } | null = null;

for (const id of ['camera', 'gallery']) {
  const input = $<HTMLInputElement>(id);
  input.addEventListener('click', () => {
    sessionStart = Date.now();
  });
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!sessionStart) sessionStart = Date.now();
    await readSky(file);
  });
}

async function readSky(file: File) {
  resultEl.hidden = false;
  resultEl.className = 'card';
  resultEl.innerHTML = `<p class="thinking">Reading the sky…</p>`;
  try {
    const encoder = await getEncoder();
    const { RawImage } = await import('./vision.ts');
    const image = await RawImage.fromBlob(file);
    const t0 = performance.now();
    const embedding = await encoder.embed(image);
    const ms = performance.now() - t0;
    const verdict = decide(rankClasses(embedding, bank));
    current = { verdict };
    renderVerdict(verdict, URL.createObjectURL(file), ms);
    statusEl.textContent = '';
  } catch (err) {
    resultEl.innerHTML = `<p>Something went wrong: ${escapeHtml(String((err as Error)?.message ?? err))}</p>`;
  }
}

function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

function renderVerdict(v: Verdict, photoUrl: string, ms: number) {
  const c = getCloud(v.top.id);
  const alt = getCloud(v.runnerUp.id);
  resultEl.classList.toggle('danger', !!c.danger);
  let heading: string;
  if (v.kind === 'notsky') heading = `<h2>That's not the sky.</h2>`;
  else if (v.kind === 'unsure')
    heading = `<h2>${c.name} <span class="or">or maybe ${alt.name}</span></h2>
      <p class="conf">I'm torn (${pct(v.top.p)} vs ${pct(v.runnerUp.p)}). Skies often hold several cloud types at once.</p>`;
  else heading = `<h2>${c.name}</h2><p class="conf">${pct(v.top.p)} sure · ${c.level !== 'n/a' ? `${c.level} cloud` : ''}</p>`;

  const canWatch = v.kind !== 'notsky' && !c.danger;
  const cb = v.ranking.find((r) => r.id === 'cumulonimbus');
  const stormLine =
    v.stormRisk && !c.danger && v.kind !== 'notsky'
      ? `<p class="storm">This could also be a thunderstorm cloud (${pct(cb?.p ?? 0)}). If it is tall and dark, or you hear thunder, go indoors instead.</p>`
      : '';
  resultEl.innerHTML = `
    <img class="photo" src="${photoUrl}" alt="Your sky photo" />
    ${heading}
    ${stormLine}
    <dl>
      <dt>Check with your own eyes</dt><dd>${escapeHtml(c.lookFor)}</dd>
      <dt>What it usually means</dt><dd>${escapeHtml(c.sky)}</dd>
      <dt>${c.danger ? 'Do this now' : 'Your mission'}</dt><dd>${escapeHtml(c.mission)}</dd>
    </dl>
    ${canWatch ? `<button class="btn primary" id="go" type="button">Put the phone away (${c.watchMinutes} min)</button>` : ''}
    <details class="why"><summary>How sure is the model?</summary>
      <ol>${v.ranking
        .slice(0, 4)
        .map((r) => `<li>${getCloud(r.id).name}: ${pct(r.p)}</li>`)
        .join('')}</ol>
      <p>Computed on this device in ${Math.round(ms)} ms. Nothing was uploaded.</p>
    </details>`;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (canWatch) $('go').addEventListener('click', () => goOutside(c.watchMinutes));
}

// ---------- phone away: the actual point of the app

let awayStart = 0;
let backAt = 0;
let tick: number | undefined;
let chimed = false;

function goOutside(minutes: number) {
  if (!current) return;
  const c = getCloud(current.verdict.top.id);
  awayStart = Date.now();
  chimed = false;
  $('away-mission').textContent = c.mission;
  awayEl.hidden = false;
  document.body.classList.add('is-away');
  const update = () => {
    const s = (Date.now() - awayStart) / 1000;
    $('away-clock').textContent = formatDuration(s);
    if (!chimed && minutes > 0 && s >= minutes * 60) {
      chimed = true;
      $('away-title').textContent = 'Time. Look once more, then come back.';
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {
        /* not supported */
      }
    }
  };
  update();
  tick = window.setInterval(update, 1000);
}

$('back').addEventListener('click', () => {
  backAt = Date.now();
  window.clearInterval(tick);
  awayEl.hidden = true;
  document.body.classList.remove('is-away');
  $('away-title').textContent = 'Phone down. Eyes up.';
  debrief.showModal();
});

// Explicit handlers rather than the dialog's 'close' event, which browsers may
// defer while the page is hidden (the phone was just in a pocket).
for (const btn of debrief.querySelectorAll<HTMLButtonElement>('button[value]')) {
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    debrief.close();
    logObservation(btn.value as Observation);
  });
}
debrief.addEventListener('cancel', (ev) => {
  ev.preventDefault();
  debrief.close();
  logObservation('skipped');
});

function logObservation(observation: Observation) {
  if (!current) return;
  addEntry(store, {
    at: new Date(backAt).toISOString(),
    cloud: current.verdict.top.id,
    confidence: current.verdict.top.p,
    screenSeconds: Math.max(1, (awayStart - sessionStart) / 1000),
    skySeconds: (backAt - awayStart) / 1000,
    observation,
  });
  sessionStart = 0;
  current = null;
  resultEl.hidden = true;
  renderJournal();
  $('journal').scrollIntoView({ behavior: 'smooth' });
}

// ---------- the log

const OBS_TEXT: Record<Observation, string> = {
  grew: 'it grew',
  faded: 'it faded',
  moved: 'it moved on',
  same: 'nothing changed',
  skipped: '',
};

function renderJournal() {
  const entries = readJournal(store);
  $('journal').hidden = entries.length === 0;
  if (!entries.length) return;
  const t = totals(entries);
  $('totals').innerHTML =
    `${formatDuration(t.skySeconds)} looking up, ${formatDuration(t.screenSeconds)} looking at this screen` +
    (t.ratio === null
      ? ''
      : t.ratio >= 1
        ? ` <strong>(${t.ratio >= 10 ? Math.round(t.ratio) : t.ratio.toFixed(1)}× more sky than screen)</strong>`
        : ' <strong>(still more screen than sky: next time, look a little longer)</strong>');
  $('entries').innerHTML = entries
    .slice(0, 20)
    .map((e) => {
      const d = new Date(e.at);
      const when = d.toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      const obs = OBS_TEXT[e.observation] ? `, ${OBS_TEXT[e.observation]}` : '';
      return `<li><span>${when}</span> ${getCloud(e.cloud).name}${obs} · ${formatDuration(e.skySeconds)} up / ${formatDuration(e.screenSeconds)} screen</li>`;
    })
    .join('');
}

renderJournal();

// ---------- offline app shell

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then(async () => {
        // The very first visit loads the hashed JS/CSS before the worker is in
        // control, so put them in the shell cache explicitly.
        const urls = performance
          .getEntriesByType('resource')
          .map((e) => e.name)
          .filter((u) => u.startsWith(`${location.origin}/assets/`));
        const cache = await caches.open('look-up-shell-v2');
        await cache.addAll([...new Set(urls)]);
      })
      .catch(() => undefined);
  });
}
