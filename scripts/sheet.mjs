// Tile extracted frames (out/frames/<seconds>.png) into one labelled contact sheet.
import fs from 'node:fs'
import sharp from 'sharp'
const dir = process.argv[2] ?? 'out/frames', W = 480, H = 270, cols = 5
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort((a, b) => parseFloat(a) - parseFloat(b))
const comps = []
for (const [i, f] of files.entries()) {
  const left = (i % cols) * W, top = Math.floor(i / cols) * H
  comps.push({ input: await sharp(`${dir}/${f}`).resize(W, H).toBuffer(), left, top })
  comps.push({ input: Buffer.from(`<svg width="80" height="26"><rect width="80" height="26" fill="#000a"/><text x="6" y="19" font-size="16" fill="#ff0">${parseFloat(f)}s</text></svg>`), left, top })
}
await sharp({ create: { width: W * cols, height: H * Math.ceil(files.length / cols), channels: 3, background: '#000' } }).composite(comps).jpeg({ quality: 85 }).toFile(process.argv[3] ?? 'out/sheet.jpg')
