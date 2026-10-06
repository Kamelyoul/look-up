// CLIP vision tower, loaded with Transformers.js. Runs in the browser
// (WebAssembly, on the user's own device) and in Node (for scripts/eval.ts).
// Only the image encoder is downloaded: the text side was precomputed.

import {
  AutoProcessor,
  CLIPVisionModelWithProjection,
  RawImage,
  type Processor,
  type PreTrainedModel,
} from '@huggingface/transformers';

export const MODEL_ID = 'Xenova/clip-vit-base-patch16';
/** 8-bit quantised weights: about a quarter of the fp32 download. */
export const DTYPE = 'q8' as const;

export interface VisionEncoder {
  embed(image: RawImage): Promise<Float32Array>;
}

export async function loadVisionEncoder(
  modelId: string = MODEL_ID,
  onProgress?: (info: unknown) => void,
): Promise<VisionEncoder> {
  const processor: Processor = await AutoProcessor.from_pretrained(modelId, {
    progress_callback: onProgress,
  });
  const model: PreTrainedModel = await CLIPVisionModelWithProjection.from_pretrained(modelId, {
    dtype: DTYPE,
    progress_callback: onProgress,
  });
  return {
    async embed(image: RawImage) {
      const inputs = await processor(image);
      const { image_embeds } = await model(inputs);
      return new Float32Array(image_embeds.data as Float32Array);
    },
  };
}

export { RawImage };
