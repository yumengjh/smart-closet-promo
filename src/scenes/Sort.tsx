import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { At, Background, Caption, Hud, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { GROUPS, garments, groupOf } from '../lib/assets'
import { C, SANS } from '../lib/theme'
import { easeInOut, range, tween } from '../lib/anim'

type P = { x: number; y: number; s: number }
const N = garments.length

const byHue = [...garments].sort((a, b) => (a.hue < 0 ? 999 + (255 - a.light) : a.hue) - (b.hue < 0 ? 999 + (255 - b.light) : b.hue))
const colorPos = new Map<string, P>()
byHue.forEach((g, i) => {
  const cols = 12, cell = 124
  const c = i % cols, r = Math.floor(i / cols)
  colorPos.set(g.id, { x: (c - (cols - 1) / 2) * cell + 60, y: (r - 1) * cell + 30, s: 104 })
})

const groupPos = new Map<string, P>()
const groupLabel: { name: string; x: number; n: number }[] = []
{
  const cell = 100, gap = 70
  const blocks = GROUPS.map(name => ({ name, items: garments.filter(g => groupOf(g) === name) })).filter(b => b.items.length)
  const cols = blocks.map(b => Math.ceil(b.items.length / 4))
  const width = cols.reduce((a, c) => a + c * cell, 0) + gap * (blocks.length - 1)
  let x = -width / 2 + 60
  blocks.forEach((b, bi) => {
    b.items.forEach((g, i) => groupPos.set(g.id, { x: x + (Math.floor(i / 4) + 0.5) * cell, y: (i % 4 - 1.5) * cell + 50, s: 86 }))
    groupLabel.push({ name: b.name, x: x + (cols[bi] * cell) / 2, n: b.items.length })
    x += cols[bi] * cell + gap
  })
}

const mix = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t })

function Tabs({ active, show }: { active: number; show: number }) {
  const labels = ['按颜色', '按品类', '按季节']
  return (
    <div style={{ position: 'absolute', top: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: show, transform: `translateY(${(1 - show) * -20}px)` }}>
      <div style={{ display: 'flex', gap: 6, padding: 6, borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 6, left: 6 + active * 126, width: 120, height: 46, borderRadius: 999, background: C.blue, boxShadow: '0 4px 24px rgba(59,147,240,.6)' }} />
        {labels.map(l => <div key={l} style={{ position: 'relative', width: 120, height: 46, display: 'grid', placeItems: 'center', fontFamily: SANS, fontSize: 21, fontWeight: 500, color: '#fff' }}>{l}</div>)}
      </div>
    </div>
  )
}

export function Sort() {
  const frame = useCurrentFrame()
  const rot = frame * 0.014
  const bloubMove = tween(frame, 66, 96, 0, 1, easeInOut)
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 50]} />
      <Hud index={3} label="ORGANIZE" />
      {garments.map((g, i) => {
        const outer = i < 22
        const k = outer ? i / 22 : (i - 22) / (N - 22)
        const a = k * Math.PI * 2 + (outer ? rot : -rot * 1.3)
        const R = outer ? 340 : 215
        const ring: P = { x: Math.cos(a) * R, y: Math.sin(a) * R * 0.92, s: outer ? 92 : 78 }
        const enter = tween(frame, i * 0.8, i * 0.8 + 16, 0, 1)
        const d = range(`sd${i}`, 0, 14)
        const t1 = tween(frame, 70 + d, 96 + d, 0, 1, easeInOut)
        const t2 = tween(frame, 130 + d, 156 + d, 0, 1, easeInOut)
        let p = mix(ring, colorPos.get(g.id)!, t1)
        p = mix(p, groupPos.get(g.id)!, t2)
        const moving = Math.sin(t1 * Math.PI) + Math.sin(t2 * Math.PI)
        return (
          <At key={g.id} x={p.x * enter} y={p.y * enter} z={10}>
            <Sticker g={g} size={p.s} style={{ opacity: enter, transform: `scale(${0.6 + enter * 0.4}) rotate(${(1 - t1) * Math.sin(a) * 14}deg)`, filter: `blur(${moving * 2.5}px) drop-shadow(0 8px 16px rgba(0,0,0,.45))` }} />
          </At>
        )
      })}
      {groupLabel.map((l, i) => {
        const o = tween(frame, 150 + i * 3, 162 + i * 3, 0, 1)
        return (
          <At key={l.name} x={l.x} y={-215} z={12}>
            <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: '#fff', opacity: o, transform: `translateY(${(1 - o) * 12}px)`, whiteSpace: 'nowrap' }}>
              {l.name}<span style={{ color: C.blue, fontSize: 18, marginLeft: 6 }}>{l.n}</span>
            </div>
          </At>
        )
      })}
      <At x={-770 * bloubMove} y={330 * bloubMove} z={20}>
        <Bloub size={150 - bloubMove * 50} cues={[{ at: 0, state: 'orbit' }, { at: 2.3, state: 'comet' }, { at: 4.4, state: 'wide' }, { at: 5.6, state: 'idle', repeat: true }]} />
      </At>
      <Tabs active={tween(frame, 126, 142, 0, 1, easeInOut)} show={tween(frame, 60, 74, 0, 1)} />
      <Caption text="按颜色、按品类，一秒整理好。" from={10} until={184} />
    </AbsoluteFill>
  )
}
