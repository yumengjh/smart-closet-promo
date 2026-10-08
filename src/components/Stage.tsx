import { AbsoluteFill, Img, useCurrentFrame } from 'remotion'
import { C, MONO, SANS } from '../lib/theme'
import { tween } from '../lib/anim'
import { src, type Garment } from '../lib/assets'

/** Positions children by their centre, relative to the frame centre. */
export function At({ x = 0, y = 0, z = 0, children, style }: { x?: number; y?: number; z?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', left: 960 + x, top: 540 + y, transform: 'translate(-50%,-50%)', zIndex: Math.round(z), ...style }}>
      {children}
    </div>
  )
}

export function Background({ tint = C.navy, glow = C.blue, glowAt = [50, 46], intensity = 1 }: { tint?: string; glow?: string; glowAt?: [number, number]; intensity?: number }) {
  const frame = useCurrentFrame()
  const drift = Math.sin(frame / 50) * 2
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 75% at ${glowAt[0] + drift}% ${glowAt[1]}%, ${tint} 0%, ${C.ink} 72%)` }} />
      <AbsoluteFill style={{ opacity: 0.32 * intensity, background: `radial-gradient(circle 420px at ${glowAt[0] - drift}% ${glowAt[1]}%, ${glow}, transparent 70%)`, filter: 'blur(30px)' }} />
      <AbsoluteFill style={{ opacity: 0.18, background: `radial-gradient(circle 520px at 82% 88%, ${C.lilac}, transparent 70%)`, filter: 'blur(40px)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)' }} />
    </AbsoluteFill>
  )
}

export function Caption({ text, from = 6, until = Infinity }: { text: string; from?: number; until?: number }) {
  const frame = useCurrentFrame()
  const chars = [...text]
  const out = tween(frame, until, until + 8, 1, 0)
  return (
    <div style={{ position: 'absolute', bottom: 74, width: '100%', textAlign: 'center', fontFamily: SANS, fontSize: 30, fontWeight: 500, letterSpacing: 1.5, color: C.text, opacity: out, textShadow: '0 2px 18px rgba(0,0,0,.6)' }}>
      {chars.map((c, i) => {
        const p = tween(frame, from + i * 0.9, from + i * 0.9 + 10, 0, 1)
        return <span key={i} style={{ opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 10}px)`, filter: `blur(${(1 - p) * 6}px)`, whiteSpace: 'pre' }}>{c}</span>
      })}
    </div>
  )
}

export function Hud({ index, label }: { index: number; label: string }) {
  const frame = useCurrentFrame()
  const o = tween(frame, 0, 10, 0, 1)
  const s: React.CSSProperties = { position: 'absolute', fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: 'rgba(210,222,255,.42)', opacity: o }
  return (
    <>
      <div style={{ ...s, top: 40, left: 56 }}>YUDA · 鱼搭</div>
      <div style={{ ...s, top: 40, right: 56 }}>AI DIGITAL CLOSET</div>
      <div style={{ ...s, bottom: 40, left: 56 }}>{String(index).padStart(2, '0')} — {label}</div>
      <div style={{ ...s, bottom: 40, right: 56 }}>YUDA.CLOSET</div>
    </>
  )
}

export function Sticker({ g, size, style }: { g: Garment; size: number; style?: React.CSSProperties }) {
  const k = size / Math.max(g.w, g.h)
  return <Img src={src(g.file)} style={{ width: g.w * k, height: g.h * k, display: 'block', filter: 'drop-shadow(0 10px 22px rgba(0,0,0,.45))', ...style }} />
}
