import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background, Caption, Hud, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { baseline, byId, ootds, src } from '../lib/assets'
import { C, SANS } from '../lib/theme'
import { easeIn, easeInOut, tween } from '../lib/anim'
import { OUTFIT } from './Ask'

const CW = 340, CH = 530

function Card({ file, label, style }: { file: string; label: string; style?: React.CSSProperties }) {
  return (
    <div style={{ width: CW, height: CH, borderRadius: 30, overflow: 'hidden', position: 'relative', background: '#e9edf3', boxShadow: '0 40px 90px rgba(0,0,0,.55)', ...style }}>
      <Img src={src(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 16, bottom: 16, padding: '6px 14px', borderRadius: 999, background: 'rgba(10,16,34,.72)', color: '#fff', fontFamily: SANS, fontSize: 18, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export function Wear() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 100 } })
  const fly = tween(frame, 16, 34, 0, 1, easeIn)
  const flash = tween(frame, 32, 36, 0, 1) * tween(frame, 36, 48, 1, 0)
  const swap = tween(frame, 35, 42, 0, 1)
  const split = tween(frame, 50, 68, 0, 1, easeInOut)
  const second = spring({ frame: frame - 54, fps, config: { damping: 14, stiffness: 100 } })
  const second2 = ootds[1]
  const dress = second2?.wears[0] ? byId(second2.wears[0]) : null
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 50]} tint="#16123a" glow="#9a7bff" />
      <Hud index={6} label="TRY ON" />
      {[OUTFIT.top, OUTFIT.bottom].map((g, i) => {
        const start = { x: -560, y: i ? 120 : -110 }
        const x = start.x + (40 - start.x) * fly - split * 200
        const y = start.y + (0 - start.y) * fly
        return (
          <At key={g.id} x={x} y={y} z={20}>
            <Sticker g={g} size={250 * (1 - fly * 0.8)} style={{ opacity: 1 - tween(frame, 30, 36, 0, 1), filter: `blur(${fly * 6}px) drop-shadow(0 10px 20px rgba(0,0,0,.5))` }} />
          </At>
        )
      })}
      <At x={40 - split * 230} y={0} z={10}>
        <div style={{ position: 'relative', transform: `translateX(${(1 - enter) * 500}px) rotate(${(1 - enter) * 8 - split * 4}deg)`, opacity: enter }}>
          <Card file={baseline.file} label="基准人物" />
          <Card file={ootds[0].file} label="OOTD · 今日穿搭" style={{ position: 'absolute', inset: 0, opacity: swap }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: 'linear-gradient(120deg, transparent 20%, #fff 50%, transparent 80%)', opacity: flash, mixBlendMode: 'screen' }} />
        </div>
      </At>
      {second2 && (
        <At x={40 + 230 - (1 - second) * 0 + split * 0} y={0} z={9}>
          <div style={{ position: 'relative', transform: `translateX(${(1 - second) * 700}px) rotate(${(1 - second) * 10 + 4 * second}deg)`, opacity: second }}>
            <Card file={second2.file} label="OOTD · 周末甜一点" />
            {dress && <div style={{ position: 'absolute', right: -60, top: -50, transform: `scale(${second}) rotate(10deg)` }}><Sticker g={dress} size={150} /></div>}
          </div>
        </At>
      )}
      <At x={-600} y={-300} z={30}>
        <div style={{ opacity: tween(frame, 0, 8, 0, 1) }}>
          <Bloub size={96} cues={[{ at: 0, state: 'idle' }, { at: 1.1, state: 'wide' }, { at: 1.9, state: 'wink' }]} />
        </div>
      </At>
      <At x={-560} y={-210} z={30}>
        <div style={{ fontFamily: SANS, fontSize: 20, color: C.dim, opacity: tween(frame, 8, 16, 0, 1) * tween(frame, 26, 32, 1, 0), whiteSpace: 'nowrap' }}>换上这一套 →</div>
      </At>
      <Caption text="穿在你身上的样子，提前看见。" from={8} until={90} />
    </AbsoluteFill>
  )
}
