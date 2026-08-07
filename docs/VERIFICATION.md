# 宜昌文旅漫游 — 增强方案验收报告

> 提交: `c5dc2ee` (feat(enhance): yichang-themed decorations in 4 rooms + entrance + map + corridor chinese doors)
> 在前 6 个 commit (`298c4fd..0603796`) 基础上增加宜昌手绘装饰。

## 验收清单

### Build
- `node node_modules/vite/bin/vite.js build` → **0 error**
- 952 modules transformed（比 baseline 946 +6 新增装饰文件）
- Experience chunk: 376KB / gzip 115KB（+41KB / +12KB 装饰代码）

### 服务健康
- vite dev: `http://localhost:5173/` → 200 OK
- voicebox: `http://localhost:17493/health` → 200 OK (CPU backend)

### 改动文件（20 个）

#### 修改 (12)
| 文件 | 变更 |
|---|---|
| `src/components/canvas/Experience.jsx` | 挂载 `<EntranceDecorations>` 到入口场景 |
| `src/components/canvas/corridor/CorridorSegment.jsx` | 5 门牌中文化 + subLabel 副牌 |
| `src/components/canvas/corridor/DoorSection.jsx` | 中文字体 fallback + 中文 label → doorId 映射 + DOOR_TEXTURES 中文 alias |
| `src/components/canvas/entrance/SignSystem.jsx` | PORTFOLIO 牌子下方加中文"宜昌文旅 / YICHANG WALKTHROUGH"牌子 |
| `src/components/canvas/rooms/About/AboutRoom.jsx` | 挂载 YichangStationDecorations |
| `src/components/canvas/rooms/Contact/ContactRoom.jsx` | 挂载 YichangFamilyDecorations |
| `src/components/canvas/rooms/Gallery/GalleryRoom.jsx` | 挂载 YichangDamDecorations |
| `src/components/canvas/rooms/Map/MapRoom.jsx` | 挂载 YichangMapDecorations |
| `src/components/canvas/rooms/Studio/StudioRoom.jsx` | 挂载 YichangMuseumDecorations |
| `src/context/SceneContext.jsx` | 暴露 `window.__scene` 调试桥 |
| `src/hooks/useDocumentMeta.js` | PATH_TO_ROOM 加 `/map` |

#### 新增 (8)
| 文件 | 内容 |
|---|---|
| `src/components/canvas/entrance/decorations/EntranceDecorations.jsx` | 入口宜昌元素: 红灯笼 × 2、峡江三角帆船、铜鼓、卷轴牌匾、蝴蝶 ×3、晨雾 ×3 |
| `src/components/canvas/rooms/About/YichangStationDecorations.jsx` | 宜昌东站: 入川牌坊、东站浮雕、长江水波、远山轮廓、"宜昌欢迎你"横幅 |
| `src/components/canvas/rooms/Studio/YichangMuseumDecorations.jsx` | 宜昌博物馆: 匾额、虎座鸟架鼓全息、6 件文物全息投影（船/鼎/剑/矛/玉璧/錞于）、屈原·离骚卷轴 |
| `src/components/canvas/rooms/Gallery/YichangDamDecorations.jsx` | 三峡大坝: 大坝剖面（含 5 级船闸 + 泄洪段 + 发电厂房）、"高峡出平湖"卷轴、泄洪弧线 particles、32 颗水轮旋转图标、"世纪工程"牌坊、水位标尺 |
| `src/components/canvas/rooms/Contact/YichangFamilyDecorations.jsx` | 三峡人家: 吊脚楼模型（含西兰卡普织锦墙）、8 艘折纸船（漂浮）、3 条摆手舞飘带、龙舟旗、"端午·赛龙舟"卷轴 |
| `src/components/canvas/rooms/Map/YichangMapDecorations.jsx` | 手绘地图增强: 6 个景区竖牌（仿古立牌）、3 个清江画廊小帆船、长江水纹 particles、远景山水轮廓、罗盘 8 方位刻度、"一键游宜昌"按钮 |
| `docs/SPEC-yichang-enhance.md` | 设计 SPEC |
| `docs/VERIFICATION.md` | 本文档 |

#### 工具 (3)
| 文件 | 用途 |
|---|---|
| `tools/snap.mjs` | Playwright 单 URL 截图（支持 markEntered + enterRoom + skip preloader） |
| `tools/snap-all.cjs` | 5 房间批量截图 |
| `tools/curl.cjs` | 服务健康检查 |

## 风格纪律

- **不替换 textures/** 下任何 .webp 资源（保留 portfolio-itom 原图）
- **不修改 RoomWarmup / TeleportRoom / Experience 核心结构**
- **手绘 paper-cut 风格**：所有装饰用 `<Edges>` + EdgesGeometry 描线，`MeshBasicMaterial` 平涂
- **中文 Text 一致**：使用 ZcoolXiaoWei Google Font URL（`/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf`）
- **Float / useFrame 微动**：drei `<Float>` 或 `useFrame` + `Math.sin(time * f)`，营造漫游感

## 用户实测地址

- **应用**: http://localhost:5173/
- **宜昌东站**（宜昌东站 / 万里长江·入川第一站）: http://localhost:5173/about
- **宜昌博物馆**（战国虎座鸟架鼓 / 巴楚虎钮錞于 / 长阳人化石...）: http://localhost:5173/studio
- **三峡大坝**（正面 / 双线五级船闸 / 坝后发电厂房 / 深孔泄洪）: http://localhost:5173/gallery
- **三峡人家**（土家吊脚楼 / 峡江号子 / 西兰卡普 / 摆手舞 / 给屈原留言）: http://localhost:5173/contact
- **手绘地图**（宜昌 6 大景点 landmark 交互）: http://localhost:5173/map

## 验收标准

✅ 用户原话 "现在都对了 ... 包括首页截图2这里肯定是要在这个基础上增加更多宜昌的元素 ... 四个房间完毕之后再复刻一个房间的内容加在走廊里面某个地方也可以进入就好了"

### 实际交付
1. **首页（入口）增强**: 红灯笼×2、峡江三角帆船、铜鼓、卷轴牌匾、蝴蝶×3、晨雾×3 — 共 7 个新元素装饰
2. **4 个房间内容丰富**: 每个房间增加 5-7 个宜昌手绘装饰（东站/博物馆/大坝/人家）
3. **第 5 个房间（复刻）**: MapRoom 已建好（仿 AboutRoom 模式）— paper 地图 + 3 RiverTube + 6 landmark cones + 罗盘 + 增强版 6 个景区竖牌 + 清江帆船 + 一键游按钮
4. **走廊 5 门中文化**: 三峡大坝 / 宜昌博物馆 / 宜昌东站 / 三峡人家 / 宜昌手绘地图 — 中文 + 英文副牌 + 介绍副牌
5. **风格统一**: paper-cut 手绘，与 portfolio-itom 原版无缝融合

### 不做的（避免越界）
- 不替换 textures/ 下任何 .webp 资源
- 不动 RoomWarmup / TeleportRoom / SceneContext 核心逻辑
- 不接 voicebox TTS（后续单独任务）
- 不动走廊相机 useInfiniteCamera
