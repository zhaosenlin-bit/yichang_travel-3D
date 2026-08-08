# 三峡大坝房间 — 设计 SPEC v2

> 本 SPEC 是 `ROOMS-SPEC-yichang-east-station.md` 的姊妹文档。
> 落地版本: v2(2026-08-08)。

## 现状评估
- `GalleryRoom.jsx` 当前为 **paper-flip 风格**(挂着的照片 + 鼠标拖拽翻转 + 项目详情卡)
- 用户反馈: "这种是看挂着的照片的啊 ... 换成那种往前滚动飞行的场景啊"
- `YichangDamDecorations.jsx` 已存在,含大坝剖面/泄洪/水轮/卷轴/牌坊/水位尺,但未与 paper-flip 逻辑融合,实际渲染时被遮挡或孤立
- 大坝属于 **户外大型工程**,适合 **纸飞机飞行场景**(类似 AboutRoom)

## 设计方向

### 核心改动
**删除 paper-flip 风格,改为纸飞机飞行场景**。把 GalleryRoom 替换为 `DamFlightRoom`,沿用 AboutRoom 的飞行/天空/滚动系统,内容换成大坝。

### 飞行沿途 4 个 STORY_MILESTONES

| # | title | subtitle | type | 飞行时看到 |
|---|-------|----------|------|------------|
| 1 | **高峡出平湖** | 毛泽东·水调歌头·游泳 | intro | 卷轴展开 + 大坝剖面轮廓 |
| 2 | **千年梦圆** | 1994开工·2009建成 | journey | 进度条 + 5 级船闸剖面 |
| 3 | **天下第一船闸** | 双线五级·113m 提升 | stats | 阶梯剖面 + 船舶过闸动画 |
| 4 | **清洁能源心脏** | 32台机组·2250万千瓦 | journey | 32 颗水轮旋转图标 |

每个 milestone 在飞行过程中 fade in/out(沿用 AboutRoom 的 StoryMilestone fade 逻辑)。

### YichangDamDecorations 改造
| 元素 | 位置 | 飞行时视觉 |
|------|------|------------|
| **大坝剖面立绘**(梯形) | z=-7 | 飞行途中地面景物 |
| **"高峡出平湖" 卷轴** | y=3.8 z=-6 | 顶空飘动 |
| **泄洪弧线 particles** | z=-6.5 | 持续流动 |
| **32 颗水轮**(4×8 阵列) | z=-7 | 大坝后旋转 |
| **"世纪工程" 牌坊** | y=-1.5 z=-5 | 入口门楼(浮空) |
| **水位标尺 175/145/135/113** | z=-7 | 大坝旁刻度 |
| **长江水面**(3 层波浪) | y=-2.2 z=-10 | 远景水波 |
| **远山轮廓**(5 三角) | z=-50 | 远景剪影 |

### 交互
- **滚轮**: paper airplane 沿 z 负方向前进
- **hover 大坝剖面**: 牌坊发光 + "点击查看大坝剖面" 提示
- **hover 卷轴**: 卷轴展开 + 显示全诗 "更立西江石壁·截断巫山云雨·高峡出平湖"
- **hover 水位标尺**: 刻度数字高亮 + tooltip "175m 正常蓄水位"
- **click 牌坊**: 弹出 overlay 显示大坝简介(经纬度/库容/装机/泄洪能力)
- **click 卷轴**: 弹出 overlay 显示 "高峡出平湖" 全词

### 文案
| 元素 | 文案 |
|------|------|
| 房间标题 | 三峡大坝 / THREE GORGES DAM |
| 副标题 | 高峡出平湖·世纪工程·万里长江第一坝 |
| 卷轴主文 | 高峡出平湖 |
| 卷轴副文 | 三峡大坝·世纪奇迹 |
| 牌坊 | 世纪工程 |
| milestone 1 | 高峡出平湖 / 毛泽东·水调歌头·游泳 |
| milestone 2 | 千年梦圆 / 1994开工·2009建成 |
| milestone 3 | 天下第一船闸 / 双线五级·113m 提升 |
| milestone 4 | 清洁能源心脏 / 32台机组·2250万千瓦 |

## 实施步骤

1. **新建** `src/components/canvas/rooms/Gallery/DamFlightRoom.jsx`
   - 复制 AboutRoom 结构
   - 改 STORY_MILESTONES 为大坝 4 个
   - 挂载 `YichangDamDecorations` 到房间组
   - 挂载 `PaperAirplane` 沿用
2. **改造** `YichangDamDecorations.jsx`
   - 增加长江水面(RiverWater 复用东站组件)
   - 增加远山轮廓(DistantMountains 复用东站组件)
3. **修改** `RoomInterior.jsx`
   - `isGallery ? <GalleryRoom>` → `isGallery ? <DamFlightRoom>`
4. **保留** `GalleryRoom.jsx`(不删除,作为 reference,后续其他项目可复用)
5. **修改** `corridor/DoorSection.jsx`(如需要)
   - 大坝门标签中文显示正常,无需改

## 验证标准

### 真实浏览器验证
1. 启动 vite
2. 访问 `http://localhost:5173/gallery`(深链)或从入口滚轮走到三峡大坝门点击
3. 等待 22s(paper close + camera move + room ready + paper open)
4. 截图 5 张:B-only-entry.png / scroll-1~4.png
5. 检查截图:
   - 标题"三峡大坝"显示
   - 4 个 milestone 浮空(随飞行 fade in/out)
   - 大坝剖面 + 卷轴 + 牌坊 + 水位尺可见
   - 长江水面 + 远山轮廓可见
   - 纸飞机在视野中
6. 检查 console: 无 pageerror,无 R3F 警告

### 验证脚本
`tools/verify-dam-flight.mjs`:
```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/gallery");
await page.waitForTimeout(22000); // 18s preload + 22s transition
for (let i = 0; i < 5; i++) {
  await page.screenshot({ path: `.tmp/live/dam-flight-${i}.png` });
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(2000);
}
await browser.close();
```

## 风险与回滚
- **风险 1**: GalleryRoom paper-flip 删除后,Sanity 数据 useGalleryProjects 报错
  - **回滚**: 保留 GalleryRoom.jsx 文件,只把 RoomInterior 引用换成 DamFlightRoom
- **风险 2**: 飞行场景在 mobile 上 frame rate 下降
  - **回滚**: 减少云朵数量(CHUNK cloudCount 12-15 改 6-8)
- **风险 3**: YichangDamDecorations 与飞行逻辑 z 坐标冲突
  - **回滚**: 把装饰组 position 调整为 zOffset 跟随

## 不在本次范围
- TTS 语音讲解(后续接入 voicebox)
- 多语言切换(仅中文)
- 移动端专门优化(沿用 desktop 布局)
