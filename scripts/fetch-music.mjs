// Download the soundtrack from Pixabay (Pixabay Content License, not redistributed in this repo).
import fs from 'node:fs'

const url = 'https://cdn.pixabay.com/download/audio/2026/09/09/audio_90fab756c3.mp3?filename=bombinsound-upbeat-background-music-version-1-rise-600006.mp3'
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://pixabay.com/' } })
if (!res.ok) throw new Error(`Download failed: ${res.status}. Get it manually from https://pixabay.com/music/future-bass-upbeat-background-music-version-1-rise-600006/`)
fs.mkdirSync('public/music', { recursive: true })
fs.writeFileSync('public/music/rise.mp3', Buffer.from(await res.arrayBuffer()))
console.log('public/music/rise.mp3')
