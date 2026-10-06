// Cloud knowledge base: the 10 WMO cloud genera, plus three "escape hatch"
// classes so the app can say "that's a contrail", "that's clear sky" or
// "that's not the sky at all" instead of forcing a wrong genus.
//
// `prompts` are fed to CLIP's text encoder at build time
// (scripts/build-embeddings.ts). Only the averaged embeddings ship to the
// browser, so the text model is never downloaded by users.

export type CloudId =
  | 'cirrus'
  | 'cirrocumulus'
  | 'cirrostratus'
  | 'altocumulus'
  | 'altostratus'
  | 'nimbostratus'
  | 'stratocumulus'
  | 'stratus'
  | 'cumulus'
  | 'cumulonimbus'
  | 'contrail'
  | 'clear'
  | 'notsky';

export interface CloudInfo {
  id: CloudId;
  name: string;
  /** Altitude band, for the card. */
  level: 'high' | 'middle' | 'low' | 'vertical' | 'n/a';
  /** One-line "how to recognise it with your own eyes". */
  lookFor: string;
  /** What it usually tells you about the next hours. Hedged on purpose. */
  sky: string;
  /** A small outdoor mission: the reason to put the phone away. */
  mission: string;
  /** Minutes the "look up" timer runs for this sky. */
  watchMinutes: number;
  /** True when the safe advice is "go inside", not "stay out". */
  danger?: boolean;
  prompts: string[];
}

export const CLOUDS: CloudInfo[] = [
  {
    id: 'cirrus',
    name: 'Cirrus',
    level: 'high',
    lookFor: 'Thin, white, hair-like wisps or "mares\' tails", very high up.',
    sky: 'Fair now. Cirrus that thicken and spread over the next hours often run ahead of a warm front: rain is possible within a day or so.',
    mission: 'Pick one wisp and watch which way its tail is combed. That is the wind direction kilometres above you.',
    watchMinutes: 5,
    prompts: [
      'a photo of cirrus clouds',
      'thin wispy white cirrus clouds high in a blue sky',
      "mares' tails, feathery streaks of ice crystal clouds",
      'delicate hair-like strands of cloud across a blue sky',
    ],
  },
  {
    id: 'cirrocumulus',
    name: 'Cirrocumulus',
    level: 'high',
    lookFor: 'Tiny white grains or ripples, like fish scales, with no shading.',
    sky: 'A "mackerel sky". Usually short-lived; when it comes with thickening high cloud, the weather can turn within a day.',
    mission: 'Hold your arm out: each little cloudlet should be smaller than your little fingernail. If they are thumb-sized, you are looking at altocumulus instead.',
    watchMinutes: 5,
    prompts: [
      'a photo of cirrocumulus clouds',
      'mackerel sky, tiny white ripples of cloud like fish scales',
      'small grainy white cloudlets in rows high in a blue sky',
    ],
  },
  {
    id: 'cirrostratus',
    name: 'Cirrostratus',
    level: 'high',
    lookFor: 'A thin milky veil over the whole sky; the sun still casts shadows and may wear a halo.',
    sky: 'A sun or moon halo in this veil is classic weather lore for rain within about a day, as a warm front approaches.',
    mission: 'Without looking at the sun directly, hide it behind your hand and look for a ring of light around it, about a hand-span wide at arm\'s length.',
    watchMinutes: 5,
    prompts: [
      'a photo of cirrostratus clouds',
      'a thin milky white veil of high cloud covering the sky',
      'a halo around the sun through a thin layer of cloud',
    ],
  },
  {
    id: 'altocumulus',
    name: 'Altocumulus',
    level: 'middle',
    lookFor: 'Rows or patches of puffy grey-and-white cloudlets, each about thumb-sized at arm\'s length.',
    sky: 'Usually settled. Tall, turret-shaped altocumulus on a warm, humid morning can hint at thunderstorms later in the day.',
    mission: 'Look for shading: altocumulus have a darker side. Find the darkest cloudlet and watch whether it grows or fades over five minutes.',
    watchMinutes: 5,
    prompts: [
      'a photo of altocumulus clouds',
      'rows of puffy grey and white cloudlets in the middle of the sky',
      'a sky full of patchy rounded clouds arranged in waves',
    ],
  },
  {
    id: 'altostratus',
    name: 'Altostratus',
    level: 'middle',
    lookFor: 'A grey or bluish sheet; the sun looks like it is behind frosted glass and casts no shadows.',
    sky: 'Often the thickening stage before steady rain or snow, sometimes within a few hours.',
    mission: 'Check your shadow. No shadow and a "watery" sun means the cloud has thickened from cirrostratus into altostratus.',
    watchMinutes: 3,
    prompts: [
      'a photo of altostratus clouds',
      'a uniform grey sheet of cloud with the sun dimly visible as through frosted glass',
      'an overcast grey-blue sky with a watery sun',
    ],
  },
  {
    id: 'nimbostratus',
    name: 'Nimbostratus',
    level: 'low',
    lookFor: 'A thick, dark grey, featureless layer with steady rain or snow falling from it.',
    sky: 'Rain is here, and it is the steady kind. It tends to last hours, not minutes.',
    mission: 'Rain walk: a jacket and ten minutes. Listen to how different surfaces sound under the rain.',
    watchMinutes: 10,
    prompts: [
      'a photo of nimbostratus clouds',
      'a dark grey featureless rainy sky with steady rain',
      'thick dark overcast cloud layer during continuous rain',
    ],
  },
  {
    id: 'stratocumulus',
    name: 'Stratocumulus',
    level: 'low',
    lookFor: 'Low, lumpy grey and white patches or rolls, with blue gaps between them.',
    sky: 'The most common cloud on Earth. Usually dry, maybe a light drizzle; the weather is unlikely to change fast.',
    mission: 'Watch one gap of blue between two lumps. Count how long it takes the gap to close or move a hand-width.',
    watchMinutes: 5,
    prompts: [
      'a photo of stratocumulus clouds',
      'low lumpy grey and white cloud patches with gaps of blue sky',
      'a layer of low rounded grey cloud rolls',
    ],
  },
  {
    id: 'stratus',
    name: 'Stratus',
    level: 'low',
    lookFor: 'A flat, low, grey blanket, sometimes hiding hilltops or tall buildings. Fog is stratus at ground level.',
    sky: 'Dull but harmless: at most a drizzle. Morning stratus often burns off by midday.',
    mission: 'Find something tall nearby and check whether its top is lost in the cloud. You are looking at the cloud base.',
    watchMinutes: 3,
    prompts: [
      'a photo of stratus clouds',
      'a flat featureless low grey cloud layer covering the sky',
      'low grey cloud and fog hiding the tops of hills',
    ],
  },
  {
    id: 'cumulus',
    name: 'Cumulus',
    level: 'low',
    lookFor: 'Detached, cotton-ball clouds with flat bases and bright, cauliflower tops.',
    sky: 'Fair-weather cumulus. If they keep growing taller through the afternoon, showers can follow.',
    mission: 'Pick one cumulus and watch it for five minutes. Is it growing upward, or fraying at the edges and evaporating?',
    watchMinutes: 5,
    prompts: [
      'a photo of cumulus clouds',
      'fluffy white cotton-ball cumulus clouds with flat bases in a blue sky',
      'puffy cauliflower-shaped white clouds on a sunny day',
    ],
  },
  {
    id: 'cumulonimbus',
    name: 'Cumulonimbus',
    level: 'vertical',
    lookFor: 'A huge, towering cloud, dark underneath, often with a flat anvil-shaped top.',
    sky: 'Thunderstorm cloud: lightning, heavy rain, hail and gusts are possible.',
    mission: 'Safety first. If you can hear thunder, you are close enough to be struck: go indoors and wait 30 minutes after the last thunder.',
    watchMinutes: 0,
    danger: true,
    prompts: [
      'a photo of a cumulonimbus cloud',
      'a huge towering thunderstorm cloud with an anvil top',
      'a dark storm cloud with heavy rain and lightning',
    ],
  },
  {
    id: 'contrail',
    name: 'Contrail',
    level: 'high',
    lookFor: 'Straight white lines left by aircraft.',
    sky: 'Short trails that vanish fast mean dry air up high. Trails that linger and spread mean moist air aloft, often the same air that grows cirrus.',
    mission: 'Watch a fresh trail for three minutes: does it vanish, stay thin, or spread into a cirrus-like sheet?',
    watchMinutes: 3,
    prompts: [
      'a photo of airplane contrails in the sky',
      'straight white condensation trails left by jet aircraft',
      'crossing white lines of contrails in a blue sky',
    ],
  },
  {
    id: 'clear',
    name: 'Clear sky',
    level: 'n/a',
    lookFor: 'No clouds to speak of.',
    sky: 'Settled for now. Clear evenings cool down fast.',
    mission: 'Find the bluest part of the sky. It is usually about 90 degrees away from the sun, which is where scattered sunlight is most polarised.',
    watchMinutes: 3,
    prompts: [
      'a photo of a clear blue sky with no clouds',
      'a cloudless deep blue sky',
      'an empty clear sky',
    ],
  },
  {
    id: 'notsky',
    name: 'Not the sky',
    level: 'n/a',
    lookFor: 'That does not look like the sky.',
    sky: 'I can only read skies. Point the camera up.',
    mission: 'Go outside, tilt the phone up so at least half the frame is sky, and try again.',
    watchMinutes: 0,
    prompts: [
      'a photo of grass and the ground',
      'a photo taken indoors of a room',
      'a photo of a person',
      'a photo of a street with buildings and cars',
      'a photo of a computer screen',
      'a photo of trees and plants',
    ],
  },
];

export const CLOUD_IDS: CloudId[] = CLOUDS.map((c) => c.id);

export function getCloud(id: CloudId): CloudInfo {
  const c = CLOUDS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown cloud id: ${id}`);
  return c;
}
