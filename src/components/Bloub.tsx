// SVG renderer adapted from jeremy-prt/bloub (MIT, see src/bloub/LICENSE),
// mirroring smart-closet's BloubAvatar but sampled per video frame.
import { useMemo } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { BotEngine, type BotFrame } from '../bloub/engine'
import { STATE_BY_ID, type StateId } from '../bloub/states'
import { SHAPE_BY_ID, mixHex } from '../bloub/skins'
import { EXPRESSION_BY_ID } from '../bloub/expressions'
import { DEMI_VIEWBOX as VB, RAYON as R } from '../bloub/repere'
import { NOTIF_BLUE } from '../bloub/decor'
import { C } from '../lib/theme'

export type Cue = { at: number; state: StateId; repeat?: boolean }
type Props = { cues: Cue[]; expression?: string; size?: number; glow?: number; style?: React.CSSProperties }

let serial = 0
export function Bloub({ cues, expression = 'heureux', size = 160, glow = 1, style }: Props) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const uid = useMemo(() => `bl${serial++}`, [])
  const t = frame / fps
  const f: BotFrame = useMemo(() => {
    const engine = new BotEngine(R, cues[0].state, SHAPE_BY_ID.get('cercle')!.radii, EXPRESSION_BY_ID.get(expression) ?? null)
    for (const [i, cue] of cues.entries()) {
      if (cue.at > t) break
      if (i > 0) engine.setState(cue.state, cue.at)
      const next = cues[i + 1]?.at ?? Infinity
      const dur = STATE_BY_ID.get(cue.state)!.duration
      if (cue.repeat) for (let k = cue.at + dur; k <= Math.min(t, next); k += dur) engine.reset(cue.state, k)
    }
    return engine.sample(Math.max(0, t))
  }, [t, cues, expression])
  const ink = C.blue, paper = '#ffffff'
  const dot = (d: BotFrame['dots'][number], key: string) => {
    const fill = d.color ?? (d.depth === undefined ? ink : mixHex(paper, ink, d.depth))
    return d.d
      ? <path key={key} d={d.d} fill={fill} opacity={d.opacity} transform={`translate(${d.x} ${d.y}) rotate(${d.rot ?? 0}) scale(${R})`} />
      : <circle key={key} cx={d.x} cy={d.y} r={d.r} fill={fill} opacity={d.opacity} />
  }
  return (
    <svg width={size} height={size} viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`} style={{ overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${size * 0.18 * glow}px rgba(59,147,240,.55))` : undefined, ...style }}>
      <defs>
        <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x={-VB} y={-VB} width={VB * 2} height={VB * 2}>
          <path d={f.bodyPath} fill="#fff" />
          {f.eyes.map((e, i) => <path key={i} d={e.d} transform={e.matrix} opacity={e.alpha} fill="#000" />)}
          {f.notch && <circle cx={f.notch.x} cy={f.notch.y} r={f.notch.r} fill="#000" />}
        </mask>
        {f.arcs.map(a => (
          <linearGradient key={a.id} id={`${uid}-${a.id}`} gradientUnits="userSpaceOnUse" x1={a.grad.x1} y1={a.grad.y1} x2={a.grad.x2} y2={a.grad.y2}>
            {a.grad.stops.map((c, i) => <stop key={i} offset={i / (a.grad.stops.length - 1)} stopColor={c} />)}
          </linearGradient>
        ))}
      </defs>
      <g fill="none" strokeLinecap="round">
        {f.arcs.map(a => <path key={`b${a.id}`} d={a.back} stroke={`url(#${uid}-${a.id})`} strokeWidth={a.width} opacity={a.opacity} />)}
      </g>
      {f.dotsBehind && <g>{f.dots.map((d, i) => dot(d, `pb${i}`))}</g>}
      <g opacity={f.bodyAlpha}>
        <path d={f.bodyPath} fill={paper} />
        <g mask={`url(#${uid}m)`}><rect x={-VB} y={-VB} width={VB * 2} height={VB * 2} fill={ink} /></g>
      </g>
      {!f.dotsBehind && <g>{f.dots.map((d, i) => dot(d, `pf${i}`))}</g>}
      {f.notif && <circle cx={f.notif.x} cy={f.notif.y} r={f.notif.r} fill={NOTIF_BLUE} />}
      <g fill="none" strokeLinecap="round">
        {f.arcs.map(a => <path key={`f${a.id}`} d={a.front} stroke={`url(#${uid}-${a.id})`} strokeWidth={a.width} opacity={a.opacity} />)}
      </g>
    </svg>
  )
}
