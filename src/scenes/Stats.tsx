import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { At, Background, Caption, Hud, Sticker } from '../components/Stage'
import { garments, stats } from '../lib/assets'
import { C, SANS } from '../lib/theme'
import { easeInOut, tween } from '../lib/anim'

const COLS = 18, ROWS = 12, CELL = 128

function Count({ value, label, from, to }: { value: number; label: string; from: number; to: number }) {
  const frame = useCurrentFrame()
  const n = Math.round(tween(frame, from, from + 22, 0, value))
  const o = tween(frame, from, from + 6, 0, 1) * tween(frame, to - 6, to, 1, 0)
  const y = tween(frame, from, from + 12, 30, 0) + tween(frame, to - 6, to, 0, -30)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 168, lineHeight: 1, color: '#fff', letterSpacing: 4, textShadow: '0 8px 60px rgba(59,147,240,.7)', fontVariantNumeric: 'tabular-nums' }}>
        {n}<span style={{ fontSize: 72, color: '#bcd9ff', marginLeft: 8 }}>{label.slice(0, 1)}</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 28, letterSpacing: 8, color: C.dim, marginTop: 10 }}>{label.slice(1)}</div>
    </div>
  )
}

export function Stats() {
  const frame = useCurrentFrame()
  const flat = tween(frame, 46, 70, 0, 1, easeInOut)
  const tilt = 64 * (1 - flat)
  const scroll = frame * 5 * (1 - flat)
  const zoom = 1.25 - flat * 0.38
  return (
    <AbsoluteFill>
      <Background glowAt={[50, 30]} />
      <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: '50% 30%' }}>
        <div style={{
          position: 'absolute', left: 960 - (COLS * CELL) / 2, top: 540 - (ROWS * CELL) / 2 + 140 * (1 - flat), width: COLS * CELL, height: ROWS * CELL,
          transform: `rotateX(${tilt}deg) translateY(${scroll - 260 * (1 - flat)}px) scale(${zoom})`, transformOrigin: '50% 40%',
          display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const g = garments[(i * 7 + Math.floor(i / COLS) * 5) % garments.length]
            const row = Math.floor(i / COLS)
            const appear = tween(frame, row * 1.5, row * 1.5 + 12, 0, 1)
            return (
              <div key={i} style={{ width: CELL, height: CELL, display: 'grid', placeItems: 'center', opacity: appear }}>
                <div style={{ width: CELL - 14, height: CELL - 14, borderRadius: 26, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', display: 'grid', placeItems: 'center' }}>
                  <Sticker g={g} size={CELL - 30} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.4))' }} />
                </div>
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink} 0%, rgba(6,10,23,.94) 34%, rgba(6,10,23,.35) 62%, rgba(6,10,23,.8) 100%)`, opacity: 0.85 + flat * 0.15 }} />
      <Count value={stats.garments} label="件衣物，已全部入柜" from={2} to={48} />
      <Count value={stats.categories} label="类单品，自动识别归档" from={50} to={96} />
      <Hud index={2} label="WARDROBE" />
      <Caption text="衣柜里的每一件，都有了自己的位置。" from={8} until={88} />
    </AbsoluteFill>
  )
}
