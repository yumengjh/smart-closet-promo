import { AbsoluteFill, Img, Sequence, useCurrentFrame } from 'remotion'
import { At, Sticker } from '../components/Stage'
import { Bloub } from '../components/Bloub'
import { garments, ootds, src } from '../lib/assets'
import { SANS } from '../lib/theme'
import { range, tween } from '../lib/anim'
import { BEAT } from '../lib/timing'

function Word({ text, bg, mode }: { text: string; bg: string; mode: 'in' | 'ring' | 'rain' }) {
  const frame = useCurrentFrame()
  const punch = tween(frame, 0, 7, 1.7, 1)
  const blur = tween(frame, 0, 7, 24, 0)
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {garments.slice(0, 24).map((g, i) => {
        const a = range(`w${text}${i}`, 0, Math.PI * 2)
        let x = 0, y = 0, s = range(`ws${i}`, 70, 130), rot = range(`wr${i}`, -30, 30)
        if (mode === 'in') { const r = 1100 - frame * 38 - range(`wd${i}`, 0, 300); x = Math.cos(a) * Math.max(r, 380); y = Math.sin(a) * Math.max(r, 380) * 0.6 }
        if (mode === 'ring') { const b = (i / 24) * Math.PI * 2 + frame * 0.05; x = Math.cos(b) * 620; y = Math.sin(b) * 330 }
        if (mode === 'rain') { x = range(`wx${i}`, -900, 900); y = -620 + ((frame * range(`wv${i}`, 22, 40) + range(`wy${i}`, 0, 1300)) % 1300); rot += frame * 3 }
        return <At key={i} x={x} y={y}><Sticker g={g} size={s} style={{ transform: `rotate(${rot}deg)`, filter: `blur(${mode === 'in' ? 3 : 1.5}px) drop-shadow(0 8px 16px rgba(0,0,0,.25))`, opacity: 0.9 }} /></At>
      })}
      {mode === 'rain' && ootds.map((o, i) => (
        <At key={o.file} x={(i ? 1 : -1) * 520} y={20} z={2}>
          <Img src={src(o.file)} style={{ width: 230, borderRadius: 22, transform: `rotate(${(i ? 1 : -1) * 8}deg) scale(${tween(frame, 0, 10, 0.7, 1)})`, boxShadow: '0 30px 60px rgba(0,0,0,.35)' }} />
        </At>
      ))}
      <At z={5}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 300, letterSpacing: 30, color: '#fff', whiteSpace: 'nowrap', transform: `scale(${punch + frame * 0.004})`, filter: `blur(${blur}px)`, textShadow: '0 20px 80px rgba(0,0,0,.25)' }}>{text}</div>
      </At>
    </AbsoluteFill>
  )
}

export function Slam() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence durationInFrames={BEAT * 2}><Word text="收录" mode="in" bg="radial-gradient(circle at 50% 50%, #5fb0ff, #1f5fe0 70%)" /></Sequence>
      <Sequence from={BEAT * 2} durationInFrames={BEAT * 2}><Word text="搭配" mode="ring" bg="radial-gradient(circle at 50% 50%, #a48bff, #4b2bd6 70%)" /></Sequence>
      <Sequence from={BEAT * 4} durationInFrames={BEAT * 2}><Word text="上身" mode="rain" bg="radial-gradient(circle at 50% 50%, #ffb08a, #ff4f8b 75%)" /></Sequence>
      <Sequence from={BEAT * 6}>
        <AbsoluteFill style={{ background: '#03050c' }}>
          <At><div style={{ transform: `scale(${tween(frame - BEAT * 6, 0, 8, 0.4, 1)})` }}><Bloub size={90} cues={[{ at: 0, state: 'idle' }, { at: 0.25, state: 'wink' }]} /></div></At>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
