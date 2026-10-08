import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background, Caption, Hud, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { byId, src } from '../lib/assets'
import { C, SANS } from '../lib/theme'
import { easeIn, easeInOut, tween } from '../lib/anim'

const PICKS = ['g01', 'g02', 'g05'].map(byId)
const W = 340, H = 440

function Chip({ text, show, accent }: { text: string; show: number; accent?: boolean }) {
  return (
    <div style={{ padding: '7px 16px', borderRadius: 999, fontFamily: SANS, fontSize: 19, fontWeight: 500, whiteSpace: 'nowrap', color: accent ? '#fff' : C.text,
      background: accent ? C.blue : 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)', opacity: show, transform: `translateY(${(1 - show) * 14}px) scale(${0.8 + show * 0.2})` }}>{text}</div>
  )
}

export function Intake() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const gather = tween(frame, 160, 186, 0, 1, easeIn)
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 45]} tint="#0d1838" />
      <Hud index={4} label="CAPTURE" />
      {PICKS.map((g, i) => {
        const x = (i - 1) * 470
        const enter = spring({ frame: frame - i * 5, fps, config: { damping: 15, stiffness: 90 } })
        const s0 = 22 + i * 9
        const scan = tween(frame, s0, s0 + 32, 0, 1, easeInOut)
        const scanning = frame > s0 && frame < s0 + 34
        const box = tween(frame, s0 + 26, s0 + 36, 0, 1)
        const cut = spring({ frame: frame - (s0 + 42), fps, config: { damping: 10, stiffness: 120 } })
        const dim = tween(frame, s0 + 40, s0 + 52, 0, 1)
        const chips = [g.category, g.color, g.seasons.join('·') || g.styles[0]].filter(Boolean)
        const done = spring({ frame: frame - (118 + i * 6), fps, config: { damping: 9, stiffness: 160 } })
        const fx = x + (0 - x) * gather, fy = -30 + (330 - -30) * gather
        return (
          <div key={g.id}>
            <At x={x} y={-30 + (1 - enter) * 300} z={4}>
              <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', position: 'relative', background: '#fff', boxShadow: '0 30px 80px rgba(0,0,0,.5)',
                transform: `rotate(${(1 - enter) * (i - 1) * 12 + (i - 1) * 2}deg) scale(${1 - dim * 0.08})`, opacity: enter * (1 - dim * 0.72) * (1 - gather) }}>
                <Img src={src(g.source!)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, height: `${scan * 100}%`, background: 'linear-gradient(180deg, rgba(59,147,240,.0), rgba(59,147,240,.28))', opacity: scanning ? 1 : 0 }} />
                {scanning && <div style={{ position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 3, background: '#cfe6ff', boxShadow: '0 0 18px 4px #3b93f0' }} />}
                {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], k) => (
                  <div key={k} style={{ position: 'absolute', width: 34, height: 34, left: cx ? undefined : 40, right: cx ? 40 : undefined, top: cy ? undefined : 50, bottom: cy ? 50 : undefined, opacity: box * (1 - dim),
                    borderColor: '#3b93f0', borderStyle: 'solid', borderWidth: `${cy ? 0 : 4}px ${cx ? 4 : 0}px ${cy ? 4 : 0}px ${cx ? 0 : 4}px`, borderRadius: 6, transform: `scale(${1.4 - box * 0.4})` }} />
                ))}
              </div>
            </At>
            <At x={fx} y={fy - cut * 20} z={8}>
              <div style={{ transform: `scale(${cut * (1 - gather * 0.85)}) rotate(${(1 - cut) * -8}deg)`, opacity: Math.min(1, cut * 3) * (1 - gather * 0.6) }}>
                <Sticker g={g} size={290} style={{ filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.55)) drop-shadow(0 0 24px rgba(59,147,240,.35))' }} />
              </div>
            </At>
            <At x={x} y={250} z={9}>
              <div style={{ display: 'flex', gap: 10, opacity: 1 - gather }}>
                {chips.map((c, k) => <Chip key={k} text={c} show={tween(frame, s0 + 56 + k * 5, s0 + 66 + k * 5, 0, 1)} />)}
              </div>
            </At>
            <At x={x + 140} y={-230} z={10}>
              <div style={{ transform: `scale(${done * (1 - gather)})`, opacity: done > 0.01 ? 1 : 0 }}>
                <Chip text="✓ 已入柜" show={1} accent />
              </div>
            </At>
          </div>
        )
      })}
      <At x={0} y={330} z={20}>
        <div style={{ transform: `scale(${tween(frame, 150, 165, 0, 1)})` }}>
          <Bloub size={120} cues={[{ at: 0, state: 'idle' }, { at: 5.6, state: 'burst' }]} />
        </div>
      </At>
      <At x={-770} y={330} z={20}>
        <div style={{ opacity: tween(frame, 150, 160, 1, 0) }}>
          <Bloub size={100} cues={[{ at: 0, state: 'thinking', repeat: true }, { at: 3.3, state: 'notify' }]} />
        </div>
      </At>
      <Caption text="随手一拍：抠图、识别、入柜，一气呵成。" from={12} until={184} />
    </AbsoluteFill>
  )
}
