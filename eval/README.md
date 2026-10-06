# Evaluation

Reproduce:

```bash
node scripts/fetch-eval-images.ts 12                          # 11 sky categories x 12 photos
node scripts/fetch-eval-images.ts 12 "Lawns,Living rooms"     # 24 negatives, merged in
npm run eval                                                  # shipped model (CLIP ViT-B/16)
node scripts/eval.ts Xenova/clip-vit-base-patch32             # comparison
```

**Data.** The test set comes from Wikimedia Commons: the first 12 JPEG photos (in category sort order) of each cloud category whose file name names that genus and no other, plus 12 photos each from *Lawns* and *Living rooms* as negatives. That makes 132 sky photos and 24 non-sky photos. Authors and licences are in `manifest.json`. The images are not committed. Commons labels are crowd-sourced, and many photos contain several genera, so treat these numbers as rough.

**Code path.** The browser and the evaluation run the same code: `src/vision.ts` (q8 ONNX weights through Transformers.js) and `src/classify.ts`.

## Results (2026-10-07)

| | ViT-B/16 (shipped) | ViT-B/32 |
|---|---|---|
| Top-1, 13 classes (chance 7.7%) | **43.2%** (57/132) | 40.2% (53/132) |
| Top-3 | 68.2% | 68.2% |
| Accuracy when the app says "confident" | 69.4% (25/36) | 83.9% (26/31) |
| Contrails | 11/12 | 12/12 |
| **Cumulonimbus (thunderstorm) as top guess** | **7/12** | 4/12 |
| **Thunderstorm photos that get a storm warning** (top guess, runner-up, or ≥ 10%) | **9/12** | 5/12 |
| Other sky photos with a storm warning (false alarms) | 10/120 | 16/120 |
| Sky photos wrongly rejected as "not the sky" | 0/132 | 0/132 |
| Non-sky photos correctly rejected | 22/24 | 24/24 |
| CPU time per image (Node, laptop) | ~370 ms | ~170 ms |
| Vision weights download (q8) | 87 MB | 89 MB |

**Scoring rule** (score of a class = best prompt, or mean over its prompts):

| | B/16 max | B/16 mean | B/32 max | B/32 mean |
|---|---|---|---|---|
| Top-1 on sky photos | **57** | 51 | 53 | 60 |
| Non-sky correctly rejected (of 24) | **22** | 18 | 24 | 22 |

The two rules swap places on sky accuracy depending on the model, and the gap is within the noise of a 132-photo set. "Max" is more consistent on the job it was chosen for: refusing photos that are not of the sky. The app ships **B/16 + max**. B/16 found 7 of 12 storm clouds against 4 for B/32. It also gives the storm warning on 9 of 12 storm photos against 5, with fewer false alarms (10 against 16). That is the one class where a miss matters (the app tells you to go indoors), and it is worth twice the CPU time. B/16's most frequent error is calling nimbostratus a cumulonimbus (5 of 12), which errs on the safe side.

Full per-image tables: `RESULTS-clip-vit-base-patch16.md` and `RESULTS-clip-vit-base-patch32.md`.

## What it is bad at

- The high, thin genera (cirrostratus 2/12, cirrocumulus 3/12) are mostly read as altocumulus.
- Stratocumulus: 1/12. It gets confused with nearly everything.
- As top guess it still misses 5 of 12 thunderstorm clouds, 2 of them as "clear sky". The extra warning line ("this could also be a thunderstorm cloud") brings coverage to 9 of 12, at the cost of 10 false alarms on 120 other skies. That is a trade-off we chose on purpose. **The app is a field guide, not a safety device. If you hear thunder, go inside.**
