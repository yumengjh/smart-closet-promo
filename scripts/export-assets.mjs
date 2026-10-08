// Export real wardrobe assets from the local smart-closet-server data into public/.
// Reads a copy of the H2 database so the running server is never touched.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const server = path.resolve(process.env.CLOSET_SERVER_DIR ?? '../smart-closet-server')
const web = path.resolve(process.env.CLOSET_WEB_DIR ?? '../smart-closet')
const data = path.join(server, 'data')
const out = path.resolve('public')
const h2 = fs.readdirSync(path.join(os.homedir(), '.m2/repository/com/h2database/h2')).sort().at(-1)
const h2Jar = path.join(os.homedir(), `.m2/repository/com/h2database/h2/${h2}/h2-${h2}.jar`)

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'yuda-promo-'))
fs.copyFileSync(path.join(data, 'db/closet.mv.db'), path.join(tmp, 'copy.mv.db'))
const sql = (file, query) => `CALL CSVWRITE('${path.join(tmp, file)}', '${query.replaceAll("'", "''")}');`
fs.writeFileSync(path.join(tmp, 'export.sql'), [
  sql('garments.csv', `SELECT g.ID, g.AUTOMATIC_JSON, g.OVERRIDES_JSON, d.JOB_ID DJOB, d.FILE_NAME DFILE, s.JOB_ID SJOB, s.FILE_NAME SFILE
    FROM GARMENT g LEFT JOIN IMAGE_ASSET d ON d.ID = g.DISPLAY_ASSET_ID LEFT JOIN IMAGE_ASSET s ON s.ID = g.SOURCE_ASSET_ID
    WHERE g.CLOSET_STATUS = 'ACTIVE' ORDER BY g.CREATED_AT_MS`),
  sql('renders.csv', `SELECT PURPOSE, MEDIA_ID, INPUT_JSON FROM IMAGE_RENDER_JOB WHERE STATUS = 'SUCCEEDED' ORDER BY CREATED_AT_MS`),
].join('\n'))
execFileSync('java', ['-cp', h2Jar, 'org.h2.tools.RunScript', '-url', `jdbc:h2:file:${tmp}/copy`, '-user', 'sa', '-script', path.join(tmp, 'export.sql')])

function csv(text) {
  const rows = []; let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else quoted = false } else field += c }
    else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const [head, ...body] = rows
  return body.map(r => Object.fromEntries(head.map((k, i) => [k, r[i]])))
}
const asset = (job, file) => [path.join(data, 'workflows', job ?? '', file ?? ''), path.join(data, job ?? '', file ?? '')].find(p => job && file && fs.existsSync(p))

for (const dir of ['garments', 'sources', 'person']) fs.rmSync(path.join(out, dir), { recursive: true, force: true })
for (const dir of ['garments', 'sources', 'person']) fs.mkdirSync(path.join(out, dir), { recursive: true })

async function dominant(file) {
  const { data: px, info } = await sharp(file).resize(48, 48, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let r = 0, g = 0, b = 0, n = 0
  for (let i = 0; i < px.length; i += info.channels) if (px[i + 3] > 200) { r += px[i]; g += px[i + 1]; b += px[i + 2]; n++ }
  return n ? [r / n, g / n, b / n].map(Math.round) : [128, 128, 128]
}
function hue([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (d < 18) return { hue: -1, light: max }
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { hue: (h * 60 + 360) % 360, light: max }
}

const garments = []
for (const row of csv(fs.readFileSync(path.join(tmp, 'garments.csv'), 'utf8'))) {
  const display = asset(row.DJOB, row.DFILE)
  if (!display) continue
  const auto = JSON.parse(row.AUTOMATIC_JSON || '{}').attributes ?? {}
  const overrides = JSON.parse(row.OVERRIDES_JSON || '{}')
  const value = key => [overrides[key]?.values ?? overrides[key], auto[key]?.values].find(v => Array.isArray(v) && v.length) ?? []
  const category = value('category')[0]
  if (!category) continue
  const id = `g${String(garments.length).padStart(2, '0')}`
  const trimmed = await sharp(display).trim({ threshold: 1 }).toBuffer()
  const info = await sharp(trimmed).resize(460, 460, { fit: 'inside' }).png().toFile(path.join(out, 'garments', `${id}.png`))
  const rgb = await dominant(path.join(out, 'garments', `${id}.png`))
  const source = asset(row.SJOB, row.SFILE)
  let sourceFile = null
  if (source && source !== display) {
    sourceFile = `sources/${id}.jpg`
    await sharp(source).resize(900, 900, { fit: 'inside' }).flatten({ background: '#ffffff' }).jpeg({ quality: 86 }).toFile(path.join(out, sourceFile))
  }
  garments.push({ id, garmentId: row.ID, category, color: value('primaryColor')[0] ?? '', styles: value('styles'), seasons: value('seasons'),
    file: `garments/${id}.png`, source: sourceFile, w: info.width, h: info.height, rgb, ...hue(rgb) })
}

const renders = []
for (const row of csv(fs.readFileSync(path.join(tmp, 'renders.csv'), 'utf8'))) {
  const file = path.join(data, 'private-person', `${row.MEDIA_ID}.png`)
  if (!fs.existsSync(file)) continue
  const input = JSON.parse(row.INPUT_JSON)
  const name = `${row.PURPOSE.toLowerCase()}-${renders.filter(r => r.purpose === row.PURPOSE).length}`
  const info = await sharp(file).resize(900, 1400, { fit: 'inside' }).png().toFile(path.join(out, 'person', `${name}.png`))
  const wears = (input.references ?? []).filter(r => r.purpose === 'GARMENT').map(r => garments.find(g => g.garmentId === r.garmentId)?.id).filter(Boolean)
  renders.push({ purpose: row.PURPOSE, file: `person/${name}.png`, w: info.width, h: info.height, wears })
}

fs.copyFileSync(path.join(web, 'public/yuda-logo.png'), path.join(out, 'yuda-logo.png'))
fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/assets.json', JSON.stringify({ garments, renders }, null, 1))
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`garments ${garments.length}, sources ${garments.filter(g => g.source).length}, renders ${renders.map(r => `${r.file}[${r.wears}]`).join(' ')}`)
