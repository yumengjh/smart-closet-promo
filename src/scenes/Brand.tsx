import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background, Caption, Hud } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { src } from '../lib/assets'
import { C, MONO, SANS } from '../lib/theme'
import { easeIn, tween } from '../lib/anim'

export function Brand() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const logo = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 110 } })
  const shine = tween(frame, 18, 52, -40, 140)
  const out = tween(frame, 86, 96, 0, 1, easeIn)
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 40]} />
      <Hud index={1} label="HELLO" />
      <At y={-230 - out * 60} z={5}>
        <div style={{ transform: `scale(${logo})`, opacity: 1 - out }}>
          <Img src={src('yuda-logo.png')} style={{ width: 230, filter: 'drop-shadow(0 12px 40px rgba(59,147,240,.45))' }} />
        </div>
      </At>
      <At y={10} z={6}>
        <div style={{ display: 'flex', gap: 24, transform: `scale(${1 + frame * 0.0012}) translateY(${-out * 40}px)`, opacity: 1 - out, filter: `blur(${out * 12}px)` }}>
          {['鱼', '搭'].map((ch, i) => {
            const p = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 13, stiffness: 140 } })
            return (
              <span key={ch} style={{
                fontFamily: SANS, fontWeight: 900, fontSize: 250, lineHeight: 1, letterSpacing: 8,
                transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * (i ? 10 : -10)}deg)`, opacity: Math.min(1, p * 1.6), display: 'inline-block',
                backgroundImage: `linear-gradient(105deg, ${C.cream} ${shine - 18}%, #ffffff ${shine - 4}%, #9fd0ff ${shine}%, #ffffff ${shine + 4}%, ${C.cream} ${shine + 18}%)`,
                WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 50px rgba(59,147,240,.35))',
              }}>{ch}</span>
            )
          })}
        </div>
      </At>
      <At y={190} z={6}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: tween(frame, 20, 60, 30, 14), color: C.dim, opacity: tween(frame, 20, 40, 0, 1) * (1 - out), whiteSpace: 'nowrap' }}>
          YUDA · AI DIGITAL CLOSET
        </div>
      </At>
      <At x={360} y={-150} z={8}>
        <div style={{ transform: `translate(${(1 - logo) * -360}px, ${(1 - logo) * 150}px) scale(${0.6 + logo * 0.4})`, opacity: 1 - out }}>
          <Bloub size={110} cues={[{ at: 0, state: 'idle' }, { at: 0.6, state: 'exclaim' }, { at: 2, state: 'idle', repeat: true }]} />
        </div>
      </At>
      <Caption text="拍一下，衣柜就自己整理好。" from={22} until={86} />
    </AbsoluteFill>
  )
}
