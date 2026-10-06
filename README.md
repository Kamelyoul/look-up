# Look Up

**Point your phone at the sky. An open-weight model running on your phone names the clouds, tells you what they usually mean, and gives you a small thing to watch for. Then you put the phone away.**

Built for the [DEV Hacktoberfest Open-Source AI Challenge, Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05) (October 5 to 11, 2026). The project and this repository were created during the challenge window.

## What it does

1. **Read the sky**: take a photo of the sky (or pick one you already took).
2. [CLIP ViT-B/16](https://huggingface.co/openai/clip-vit-base-patch16) (open weights, MIT) runs **in the browser** through [Transformers.js](https://github.com/huggingface/transformers.js) and ONNX Runtime Web. It classifies the photo zero-shot into the 10 WMO cloud genera, plus *contrail*, *clear sky* and *not the sky*.
3. You get a card with what to check with your own eyes, what that cloud usually means for the next hours (hedged weather lore), and a **mission**: something to watch for in the real sky.
4. **Put the phone away**: a black screen counts the time until you come back. Lock the phone if you like.
5. A local **sky log** shows how long you looked up compared with how long you looked at the screen.

If it sees a cumulonimbus, the mission is not "watch it": it is "go indoors".

## Why open weights matter here

- **No signal needed.** Tap "Get ready for no signal" once on Wi-Fi. The weights (~90 MB at 8-bit) and the WASM runtime are cached by the browser, so it works on a hill with no reception.
- **Photos stay on the phone.** There is no server and no upload.
- **It costs nothing to run.** It is a static site with no API key and no per-request bill.
- **It can be inspected and changed.** The classes are just text prompts in [`src/clouds.ts`](src/clouds.ts). Change them, run `npm run embeddings`, and the classifier changes.

## How it works

- **Text tower at build time only.** `scripts/build-embeddings.ts` runs CLIP's text encoder over 43 prompts in Node and writes their L2-normalised embeddings (120 KB) to `src/data/`. The browser downloads only the vision encoder.
- **Classification** (`src/classify.ts`): cosine similarity between the image embedding and each prompt; a class's score is its **best** prompt (max, not mean, so the mixed "not the sky" class still works); softmax with CLIP's logit scale (100); "unsure" below 45 %.
- **Model loading** (`src/vision.ts`) uses the same code in Node and in the browser, so the evaluation measures the shipped pipeline.

## Evaluation

`scripts/fetch-eval-images.ts` downloads a small, reproducible test set from Wikimedia Commons: the first JPEG photos of each cloud category whose file name names that genus only. Authors and licences are listed in `eval/manifest.json`. The images themselves are not committed. `scripts/eval.ts` runs the shipped classifier over that set and writes `eval/RESULTS-*.md`.

See [`eval/`](eval/) for the numbers. In short: zero-shot CLIP is good at the obvious skies and genuinely confused between some neighbouring genera. The app says so ("I'm torn between…").

## Run it

```bash
npm install
npm run dev          # local dev server
npm test             # unit tests (vitest)
npm run build        # type-check + production build into dist/
# optional
npm run embeddings   # rebuild text embeddings after editing prompts
node scripts/fetch-eval-images.ts 12 && npm run eval
```

Deploy: any static host. On Vercel, import the repo and keep the defaults (Vite, `dist/`). Set `VITE_REPO_URL` to show a "Source code" link in the footer.

## Credits

- Model: OpenAI CLIP ViT-B/16 (MIT), ONNX export by [Xenova](https://huggingface.co/Xenova/clip-vit-base-patch16).
- Runtime: Transformers.js (Apache-2.0), ONNX Runtime Web (MIT).
- Cloud facts: WMO International Cloud Atlas genera; weather lore phrased as tendencies, not forecasts.
- Evaluation photos: Wikimedia Commons contributors (see `eval/manifest.json`).
- Built with the help of an AI coding agent (Claude Code); see the DEV post for details.

## Licence

MIT
