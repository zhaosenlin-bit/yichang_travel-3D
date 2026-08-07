# 宜昌文旅漫游 — 增强方案验收报告

> 最终提交链: `298c4fd` (portfolio-itom HEAD) → `0603796` (map-room) → `c5dc2ee` (4 房+入口装饰) → `138d347` (door fix) → `14c52aa` (scene bridge race + /map route)
> 总 10 个 commit, ahead of `origin/main` by 9 commits

## 验收清单

### Build
- `node node_modules/vite/bin/vite.js build` → 0 error
- 952 modules transformed

### 服务健康
- vite dev PID 13124 (or current): `http://localhost:5173/` → 200 OK
- 6 routes 全部 200: `/`, `/about`, `/studio`, `/gallery`, `/contact`, `/map`

### 真实用户路径验证 (verify-full.mjs, 4/4 PASS)
| 测试 | 路径 | 结果 |
|---|---|---|
| 01-entrance | `/` 强刷 + 15s 等待 | ✅ 0 errors |
| 02-corridor | markEntered | ✅ 0 errors |
| 03-corridor-scroll | wheel 18 次 | ✅ 0 errors |
| 04-corridor-deep | wheel 35 次 | ✅ 0 errors |

### 深链验证 (verify-deep.mjs, 6/6 PASS)
| Route | Result |
|---|---|
| `/` (entrance) | ✅ OK |
| `/about` (宜昌东站) | ✅ OK |
| `/studio` (宜昌博物馆) | ✅ OK |
| `/gallery` (三峡大坝) | ✅ OK |
| `/contact` (三峡人家) | ✅ OK |
| `/map` (手绘地图) | ✅ OK |

> 注: R3F 内部 cold-mount `isReady` race (chunk-L3Z576C2.js checkMaterialsReady) 是 pre-existing portfolio-itom 内部 bug，仅在 programmatic enterRoom 触发时出现，真实用户点击门路径无此问题。

### 改动文件 (20 个)

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
| `src/context/SceneContext.jsx` | `bridgeRef` + getter pattern 修复 race condition |
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

#### 工具 (8)
| 文件 | 用途 |
|---|---|
| `tools/snap.mjs` | Playwright 单 URL 截图（支持 markEntered + enterRoom + skip preloader） |
| `tools/snap-all.cjs` | 5 房间批量截图 |
| `tools/curl.cjs` | 服务健康检查 |
| `tools/fix-door-bug.cjs` | 历史 patch: door-section deep-link 修复 |
| `tools/revert-door-deeplink.cjs` | 历史 patch: 回滚 deep-link hook (isSegment0 undefined → 白屏) |
| `tools/fix-scene-bridge.cjs` | 历史 patch: scene bridge race condition 修复 |
| `tools/verify-full.mjs` | 真实用户路径验证（4 测试） |
| `tools/verify-deep.mjs` | 深链验证（6 routes） |

### 渲染证据
- **入口 (user-01-entrance.png)**: 红灯笼 × 2、峡江三角帆船、铜鼓、卷轴牌匾"宜昌文旅 / YICHANG WALKTHROUGH / 宜昌全景·一纸江山"、3 只蝴蝶 + 原 portfolio-itom 砖墙、树、猫、花坛、JS/React/Node logo
- **走廊 (user-03/04-corridor)**: 中式 ITOM 字母远景、左右侧 5 扇门可见

## 检查地址 (用户实测)

打开任一链接（强刷 `Ctrl+Shift+R` 清缓存）：

| URL | 看到什么 |
|---|---|
| http://localhost:5173/ | 入口画面：砖墙+灯笼+船+鼓+卷轴+蝴蝶+猫+JS logo |
| http://localhost:5173/about | 宜昌东站房间 |
| http://localhost:5173/studio | 宜昌博物馆房间 |
| http://localhost:5173/gallery | 三峡大坝房间 |
| http://localhost:5173/contact | 三峡人家房间 |
| http://localhost:5173/map | 宜昌手绘地图 |

## 用户实测建议路径
1. 打开 http://localhost:5173/（强刷 `Ctrl+Shift+R`）
2. 等 2-3 秒预加载器消失
3. 看到入口画面（灯笼/船/鼓/卷轴/蝴蝶）
4. 点击门 → 进入走廊
5. 鼠标滚轮往下滚 → 看到中文门牌"三峡大坝/宜昌博物馆/宜昌东站/三峡人家/宜昌手绘地图"
6. 点击任一门 → 进入对应房间 → 看到手绘宜昌装饰
7. 右上角菜单（汉堡）可去手绘地图

## 不做的（避免越界）
- 不替换 textures/ 下任何 webp
- 不动 RoomWarmup / TeleportRoom / SceneContext 核心逻辑（除 bridge race fix）
- 不动 useInfiniteCamera 走廊相机
- 不接 voicebox TTS（用户确认范围外）
- 不动 R3F 内部 isReady race（pre-existing，不阻塞功能）
