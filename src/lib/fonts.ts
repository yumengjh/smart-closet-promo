import { continueRender, delayRender, staticFile } from 'remotion'

// Local variable fonts (SIL OFL): no per-tab network requests while rendering.
const faces = [
  new FontFace('Noto Sans SC', `url(${staticFile('fonts/NotoSansSC.ttf')}) format('truetype')`, { weight: '100 900' }),
  new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono.ttf')}) format('truetype')`, { weight: '100 800' }),
]
const handle = delayRender('Loading fonts')
Promise.all(faces.map(f => f.load().then(() => document.fonts.add(f)))).then(() => continueRender(handle))
