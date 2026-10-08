import { staticFile } from 'remotion'
import data from '../data/assets.json'

export type Garment = (typeof data.garments)[number]
export const garments: Garment[] = data.garments
export const renders = data.renders
export const byId = (id: string) => garments.find(g => g.id === id)!
export const src = (file: string) => staticFile(file)

const groups: Record<string, string> = {
  衬衫: '上衣', T恤: '上衣', 短袖衬衫: '上衣', 背心: '上衣', 卫衣: '上衣',
  长裤: '下装', 半身裙: '下装',
  连衣裙: '连衣裙',
  开衫: '外套', 夹克: '外套', 风衣: '外套', 西装外套: '外套',
  围巾: '配饰', 高跟鞋: '配饰',
}
export const GROUPS = ['上衣', '下装', '连衣裙', '外套', '配饰']
export const groupOf = (g: Garment) => groups[g.category] ?? '配饰'

export const baseline = renders.find(r => r.purpose === 'BASELINE')!
export const ootds = renders.filter(r => r.purpose === 'OOTD')
export const stats = {
  garments: garments.length,
  categories: new Set(garments.map(g => g.category)).size,
  colors: new Set(garments.map(g => g.color)).size,
}
