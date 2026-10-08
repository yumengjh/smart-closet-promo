# 鱼搭演示视频

Remotion 程序化动画，1920×1080 / 30fps / 43 秒。分镜参考了一条 Applore 宣传片的节奏：吉祥物从头带到尾、图标爆开、数字滚动、重新排列、AI 输入框、三个大字快切，最后 logo 定版。

```sh
npm install
npm run music    # 从 Pixabay 下载配乐（许可不允许随仓库再分发）
npm run assets   # 从相邻 ../smart-closet-server 的本地数据导出真实衣物、原图与 OOTD
npm run studio   # 逐帧预览
npm run render   # 输出 out/yuda-promo.mp4
```

## 分镜（每 3.2 秒一个乐句，150 BPM，一拍 12 帧）

| 时间 | 场景 | 文件 |
| --- | --- | --- |
| 0–4.0s | 光线扫过，Bloub 出场，衣物爆开环绕 | `scenes/Hello.tsx` |
| 4.0–7.2s | 鱼搭品牌名加扫光 | `scenes/Brand.tsx` |
| 7.2–10.4s | 件数和品类数滚动，透视衣物地毯翻成平铺墙 | `scenes/Stats.tsx` |
| 10.4–16.8s | 圆环 → 按颜色 → 按品类 | `scenes/Sort.tsx` |
| 16.8–23.2s | 原图扫描 → 抠出贴纸 → 属性标签 → 入柜 | `scenes/Intake.tsx` |
| 23.2–29.6s | 问鱼搭 → 候选单品 → 搭台 | `scenes/Ask.tsx` |
| 29.6–32.8s | 基准人物换上搭配 → OOTD | `scenes/Wear.tsx` |
| 32.8–36.0s | 收录 / 搭配 / 上身 快切 | `scenes/Slam.tsx` |
| 36.0–43.0s | logo 定版，淡出 | `scenes/End.tsx` |

## 素材来源

- 衣物、原图、基准人物和 OOTD：本机衣柜真实数据，通过 `scripts/export-assets.mjs` 从数据库副本导出，不进入 Git，因此克隆后需要自备鱼搭本地数据才能渲染。场景按导出编号（如 `g00`）引用单品；衣柜变化后重新导出时，需要核对编号。
- Bloub 吉祥物：`src/bloub` 复制自前端，上游 [jeremy-prt/bloub](https://github.com/jeremy-prt/bloub)，MIT 许可。
- 音效：前端同款 `@foleyjs/core` soft 主题，用 `toWav()` 离线渲染。
- 配乐：BombinSound《Upbeat Background Music – Version 1 (Rise)》，来自 [Pixabay](https://pixabay.com/music/future-bass-upbeat-background-music-version-1-rise-600006/)，适用 Pixabay Content License；仓库不包含音频文件，用 `npm run music` 下载。
- 字体：Noto Sans SC、JetBrains Mono，SIL OFL。
