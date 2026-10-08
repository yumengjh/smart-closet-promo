import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background, Caption, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { garments } from '../lib/assets'
import { easeIn, range, tween } from '../lib/anim'

const HIT = 24 // first downbeat at 0.8s

export function Hello() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const line = tween(frame, 0, 18, 0, 1)
  const lineOut = tween(frame, 18, HIT, 1, 0, easeIn)
  const pop = spring({ frame: frame - HIT, fps, config: { damping: 11, stiffness: 120 } })
  const exit = tween(frame, 100, 120, 0, 1, easeIn)
  const items = [...garments, ...garments.slice(0, 12)]
  return (
    <AbsoluteFill>
      <Background intensity={tween(frame, HIT - 4, HIT + 10, 0, 1)} />
      {frame < HIT + 2 && (
        <At>
          <div style={{ width: 1500 * line * (0.3 + 0.7 * lineOut), height: 2, background: 'linear-gradient(90deg, transparent, #bcd9ff, #fff, #bcd9ff, transparent)', boxShadow: '0 0 24px #7fb6ff, 0 0 60px #3b93f0', opacity: line }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 14, height: 14, borderRadius: 7, transform: 'translate(-50%,-50%)', background: '#fff', boxShadow: '0 0 30px 10px #7fb6ff', opacity: line }} />
        </At>
      )}
      {items.map((g, i) => {
        const a = range(`a${i}`, 0, Math.PI * 2) + frame * 0.006 * (i % 2 ? 1 : -1)
        const r = range(`r${i}`, 260, 900)
        const depth = range(`z${i}`, 0.45, 1.15)
        const delay = range(`d${i}`, 0, 6)
        const p = spring({ frame: frame - HIT - delay, fps, config: { damping: 14, stiffness: 70, mass: 0.8 } })
        const speed = Math.max(0, 1 - p) * 14
        const fly = 1 + exit * (2.5 + depth * 2)
        const x = Math.cos(a) * r * 1.25 * p * fly
        const y = Math.sin(a) * r * 0.62 * p * fly
        const blur = Math.abs(depth - 0.95) * 5 + speed + exit * 10
        return (
          <At key={i} x={x} y={y + Math.sin(frame / 20 + i) * 8} z={depth * 10}>
            <Sticker g={g} size={140 * depth * (1 + exit)} style={{ opacity: Math.min(1, p * 2) * (1 - exit * 0.6), filter: `blur(${blur}px) drop-shadow(0 10px 22px rgba(0,0,0,.45))`, transform: `rotate(${range(`t${i}`, -18, 18) + frame * 0.2 * (i % 3 - 1)}deg)` }} />
          </At>
        )
      })}
      <At z={20}>
        <div style={{ transform: `scale(${pop * (1 - exit * 0.4)})`, opacity: frame < HIT ? 0 : 1 }}>
          <Bloub size={220} cues={[{ at: HIT / 30, state: 'swirl' }, { at: 1.9, state: 'wink' }, { at: 2.9, state: 'idle', repeat: true }]} />
        </div>
      </At>
      <Caption text="嗨！我是鱼搭，你的数字衣柜搭子。" from={HIT + 12} until={108} />
    </AbsoluteFill>
  )
}
