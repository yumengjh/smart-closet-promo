import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion'
import './lib/fonts'
import { SCENES, TOTAL } from './lib/timing'
import { Hello } from './scenes/Hello'
import { Brand } from './scenes/Brand'
import { Stats } from './scenes/Stats'
import { Sort } from './scenes/Sort'
import { Intake } from './scenes/Intake'
import { Ask, PROMPT } from './scenes/Ask'
import { Wear } from './scenes/Wear'
import { Slam } from './scenes/Slam'
import { End } from './scenes/End'

const order = [
  [Hello, SCENES.hello], [Brand, SCENES.brand], [Stats, SCENES.stats], [Sort, SCENES.sort], [Intake, SCENES.intake],
  [Ask, SCENES.ask], [Wear, SCENES.wear], [Slam, SCENES.slam], [End, SCENES.end],
] as const

// Sound effects are smart-closet's own @foleyjs cues (soft theme), rendered offline to WAV.
type Sfx = [frame: number, cue: string, volume?: number]
const typing: Sfx[] = Array.from({ length: Math.ceil([...PROMPT].length / 2) }, (_, i) => [SCENES.ask + 14 + i * 6, 'tap', 0.35])
const SFX: Sfx[] = [
  [0, 'rise', 0.8], [24, 'whoosh'], [30, 'sparkle', 0.6],
  [122, 'pop'], [128, 'chime', 0.7],
  [216, 'swoosh', 0.7], [266, 'swoosh', 0.7],
  [312, 'glide', 0.7], [382, 'whoosh', 0.8], [442, 'whoosh', 0.8],
  [504, 'swoosh', 0.7], [568, 'pop'], [577, 'pop'], [586, 'pop'], [622, 'ready', 0.6], [628, 'ready', 0.6], [634, 'ready', 0.6], [664, 'bubble'], [672, 'complete', 0.8],
  [696, 'swoosh', 0.7], ...typing, [762, 'on', 0.7], [776, 'sparkle', 0.6], [808, 'chime', 0.7], [824, 'whoosh', 0.8], [849, 'success', 0.8],
  [888, 'swoosh', 0.7], [904, 'whoosh', 0.8], [920, 'sparkle'], [942, 'swoosh', 0.7],
  [984, 'thock'], [985, 'whoosh', 0.8], [1008, 'thock'], [1009, 'whoosh', 0.8], [1032, 'thock'], [1033, 'whoosh', 0.8], [1062, 'ping', 0.6],
  [1080, 'rise', 0.7], [1086, 'bell', 0.6], [1102, 'chime', 0.6], [1146, 'sparkle', 0.7],
]

export function Promo() {
  return (
    <AbsoluteFill style={{ background: '#03050c' }}>
      {order.map(([Scene, from], i) => (
        <Sequence key={i} from={from} durationInFrames={(order[i + 1]?.[1] ?? TOTAL) - from}>
          <Scene />
        </Sequence>
      ))}
      <Audio src={staticFile('music/rise.mp3')} volume={f => interpolate(f, [0, 6, TOTAL - 70, TOTAL], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      {SFX.map(([at, cue, volume = 1], i) => (
        <Sequence key={`s${i}`} from={at} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${cue}.wav`)} volume={volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
