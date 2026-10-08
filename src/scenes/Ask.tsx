import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background, Caption, Hud, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { byId } from '../lib/assets'
import { C, SANS } from '../lib/theme'
import { easeIn, easeInOut, tween } from '../lib/anim'

export const PROMPT = '周末出门逛逛，帮我搭一套休闲的'
export const OUTFIT = { top: byId('g00'), bottom: byId('g03') }
const CANDIDATES = ['g34', 'g12', 'g23', 'g00', 'g20', 'g04', 'g03', 'g21', 'g16', 'g26'].map(byId)
const WORDS = ['休闲', '春秋', '米色系', '格纹', '舒适', '周末']

export function SearchBar({ text, typed, show, glow = 0 }: { text: string; typed: number; show: number; glow?: number }) {
  const frame = useCurrentFrame()
  const shown = [...text].slice(0, Math.floor(typed)).join('')
  return (
    <div style={{ width: 860, height: 76, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 14px 0 30px', gap: 16,
      boxShadow: `0 20px 60px rgba(0,0,0,.45), 0 0 ${30 + glow * 40}px rgba(59,147,240,${0.35 + glow * 0.4})`, opacity: show, transform: `translateY(${(1 - show) * -40}px) scale(${0.9 + show * 0.1})` }}>
      <span style={{ color: C.blue, fontSize: 30 }}>✦</span>
      <span style={{ flex: 1, fontFamily: SANS, fontSize: 28, color: '#1b2440', whiteSpace: 'nowrap' }}>
        {shown}<span style={{ display: 'inline-block', width: 3, height: 30, marginLeft: 3, verticalAlign: -5, background: C.blue, opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }} />
      </span>
      <span style={{ padding: '10px 20px', borderRadius: 999, background: `linear-gradient(135deg, ${C.blue}, #8b7bff)`, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 20 }}>问鱼搭</span>
    </div>
  )
}

export function Ask() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const bar = spring({ frame, fps, config: { damping: 14 } })
  const pick = tween(frame, 112, 124, 0, 1)
  const toBoard = tween(frame, 128, 152, 0, 1, easeInOut)
  const board = spring({ frame: frame - 126, fps, config: { damping: 14, stiffness: 100 } })
  const label = tween(frame, 156, 168, 0, 1)
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 55]} tint="#120f33" glow="#6d7bff" />
      <Hud index={5} label="ASK YUDA" />
      <At y={-330} z={30}><SearchBar text={PROMPT} typed={tween(frame, 14, 62, 0, PROMPT.length, t => t)} show={bar} glow={tween(frame, 62, 70, 0, 1) * tween(frame, 80, 100, 1, 0)} /></At>
      {WORDS.map((w, i) => {
        const a = (i / WORDS.length) * Math.PI * 2 + 0.4 + frame * 0.004
        const o = tween(frame, 40 + i * 4, 52 + i * 4, 0, 1) * tween(frame, 96, 110, 1, 0)
        return (
          <At key={w} x={Math.cos(a) * 380} y={20 + Math.sin(a) * 190} z={5}>
            <div style={{ fontFamily: SANS, fontSize: 24, color: '#d7e4ff', padding: '8px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.05)', opacity: o, transform: `scale(${0.7 + o * 0.3})`, filter: `blur(${(1 - o) * 6}px)` }}>{w}</div>
          </At>
        )
      })}
      <At x={0} y={30} z={4}>
        <div style={{ width: 560, height: 600, borderRadius: 36, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', opacity: board, transform: `scale(${0.85 + board * 0.15})`,
          backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', boxShadow: '0 40px 100px rgba(0,0,0,.4)' }}>
          <div style={{ position: 'absolute', top: 20, left: 28, fontFamily: SANS, fontSize: 18, letterSpacing: 4, color: C.dim }}>搭台</div>
        </div>
      </At>
      {CANDIDATES.map((g, i) => {
        const chosen = g === OUTFIT.top || g === OUTFIT.bottom
        const a = Math.PI * (0.08 + (i / (CANDIDATES.length - 1)) * 0.84)
        const arc = { x: -Math.cos(a) * 640, y: 260 - Math.sin(a) * 300 }
        const target = g === OUTFIT.top ? { x: 0, y: -90 } : g === OUTFIT.bottom ? { x: 0, y: 170 } : arc
        const enter = spring({ frame: frame - 78 - i * 2.5, fps, config: { damping: 12, stiffness: 120 } })
        const t = chosen ? toBoard : 0
        const fall = chosen ? 0 : tween(frame, 116, 136, 0, 1, easeIn)
        const x = arc.x + (target.x - arc.x) * t
        const y = arc.y + (target.y - arc.y) * t + fall * 500
        const size = 120 + (chosen ? pick * 20 + t * 150 : 0)
        return (
          <At key={g.id} x={x} y={y} z={chosen ? 12 - (g === OUTFIT.top ? 0 : 1) : 6}>
            <div style={{ transform: `scale(${enter})`, opacity: chosen ? 1 : 1 - pick * 0.7 - fall * 0.3, borderRadius: 999, boxShadow: chosen ? `0 0 0 ${pick * (1 - t) * 4}px ${C.blue}, 0 0 ${pick * (1 - t) * 40}px ${C.blue}` : undefined, padding: 6 }}>
              <Sticker g={g} size={size} style={{ filter: `blur(${Math.sin(t * Math.PI) * 3 + fall * 4}px) drop-shadow(0 12px 22px rgba(0,0,0,.5))` }} />
            </div>
          </At>
        )
      })}
      <At x={tween(frame, 126, 150, 0, 380, easeInOut)} y={tween(frame, 126, 150, 20, 160, easeInOut)} z={20}>
        <div style={{ transform: `scale(${1 - tween(frame, 126, 150, 0, 0.3)})` }}>
          <Bloub size={150} cues={[{ at: 0, state: 'idle' }, { at: 0.7, state: 'thinking', repeat: true }, { at: 2.4, state: 'comet' }, { at: 4.3, state: 'orbit' }, { at: 5.1, state: 'burst' }]} />
        </div>
      </At>
      <At y={360} z={25}>
        <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 700, color: '#fff', opacity: label, transform: `translateY(${(1 - label) * 16}px)`, whiteSpace: 'nowrap' }}>
          米色格纹衬衫 <span style={{ color: C.blue }}>×</span> 浅灰长裤
        </div>
      </At>
      <Caption text="说出场合，鱼搭从你的衣柜里挑出一套。" from={20} until={184} />
    </AbsoluteFill>
  )
}
