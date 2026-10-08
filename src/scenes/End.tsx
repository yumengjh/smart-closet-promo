import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { At, Background } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { src } from '../lib/assets'
import { C, MONO, SANS } from '../lib/theme'
import { easeInOut, tween } from '../lib/anim'

export function End() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const ring = tween(frame, 0, 40, 0, 1, easeInOut)
  const logo = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 90 } })
  const word = spring({ frame: frame - 22, fps, config: { damping: 16 } })
  const pill = spring({ frame: frame - 34, fps, config: { damping: 16 } })
  const orbit = tween(frame, 0, 64, 0, 1, easeInOut)
  const a = -Math.PI / 2 + orbit * Math.PI * 2.25
  const fade = tween(frame, 168, 210, 1, 0)
  const R = 330
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Background glowAt={[50, 42]} intensity={1.3} />
      <At y={-70}>
        <svg width={R * 2 + 20} height={R * 2 + 20} style={{ overflow: 'visible' }}>
          <circle cx={R + 10} cy={R + 10} r={R} fill="none" stroke="rgba(160,200,255,.22)" strokeWidth={1.5} strokeDasharray={Math.PI * 2 * R} strokeDashoffset={Math.PI * 2 * R * (1 - ring)} transform={`rotate(-90 ${R + 10} ${R + 10})`} />
          <circle cx={R + 10} cy={R + 10} r={R * 0.78} fill="none" stroke="rgba(201,167,255,.14)" strokeWidth={1} strokeDasharray="4 10" opacity={ring} transform={`rotate(${frame * 0.3} ${R + 10} ${R + 10})`} />
        </svg>
      </At>
      <At y={-110}>
        <Img src={src('yuda-logo.png')} style={{ width: 340, transform: `scale(${logo * (1 + frame * 0.0006)})`, filter: 'drop-shadow(0 20px 60px rgba(59,147,240,.5))' }} />
      </At>
      <At x={Math.cos(a) * R * (1 - orbit * 0.35) + orbit * 30} y={-70 + Math.sin(a) * R * (1 - orbit * 0.35) + orbit * 10} z={10}>
        <Bloub size={110 - orbit * 20} cues={[{ at: 0, state: 'comet' }, { at: 2.2, state: 'wink' }, { at: 3.3, state: 'idle', repeat: true }]} />
      </At>
      <At y={150}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 92, letterSpacing: 18, color: C.cream, opacity: word, transform: `translateY(${(1 - word) * 30}px)`, whiteSpace: 'nowrap' }}>鱼搭</div>
      </At>
      <At y={225}>
        <div style={{ fontFamily: SANS, fontSize: 28, letterSpacing: 10, color: C.dim, opacity: word, whiteSpace: 'nowrap' }}>你的 AI 数字衣柜</div>
      </At>
      <At y={305}>
        <div style={{ padding: '12px 30px', borderRadius: 999, background: '#fff', color: '#14204a', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, transform: `scale(${pill})`, boxShadow: '0 10px 40px rgba(59,147,240,.45)', whiteSpace: 'nowrap' }}>
          收录 · 搭配 · 上身
        </div>
      </At>
      <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 14, letterSpacing: 4, color: 'rgba(210,222,255,.35)', opacity: pill }}>
        MUSIC · “UPBEAT BACKGROUND MUSIC (RISE)” BY BOMBINSOUND / PIXABAY
      </div>
    </AbsoluteFill>
  )
}
