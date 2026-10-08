// Music: "Upbeat Background Music - Version 1 (Rise)" by BombinSound, ~150 BPM.
// One beat = 0.4s = 12 frames; phrases land every 3.2s from the first hit at 0.8s.
export const FPS = 30
export const BEAT = 12
export const PHRASE = BEAT * 8

export const SCENES = {
  hello: 0,
  brand: 120,
  stats: 216,
  sort: 312,
  intake: 504,
  ask: 696,
  wear: 888,
  slam: 984,
  end: 1080,
} as const
export const TOTAL = 1290
