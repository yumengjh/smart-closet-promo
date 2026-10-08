import { Easing, interpolate, random } from 'remotion'

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1)
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1)
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0)

/** Clamped interpolation between two frames, eased out by default. */
export function tween(frame: number, from: number, to: number, a: number, b: number, easing = easeOut) {
  return interpolate(frame, [from, to], [a, b], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing })
}

export const rand = (seed: string | number) => random(seed)
export const range = (seed: string | number, min: number, max: number) => min + random(seed) * (max - min)
