import { Composition } from 'remotion'
import { Promo } from './Promo'
import { FPS, TOTAL } from './lib/timing'

export function Root() {
  return <Composition id="YudaPromo" component={Promo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
}
