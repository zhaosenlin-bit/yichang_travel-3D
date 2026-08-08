# 宜昌博物馆房间 — 设计 SPEC v2

> 本 SPEC 是 `ROOMS-SPEC-yichang-east-station.md` 的姊妹文档。
> 落地版本: v2(2026-08-08)。

## 现状评估
- `StudioRoom.jsx` 是 **tower-of-monitors 风格**: 28 个时代文物标题,monitor 堆叠成塔
- 用户反馈: "博物馆也是的还是之前这种空壳子"
- `YichangMuseumDecorations.jsx` 已存在,但用户看不到内容(可能 monitor 渲染问题或装饰元素太弱)
- 博物馆属于 **室内展览**,适合 **手绘藏品/画作/碑刻** 风格(类似 portfolio-itom 中的 paper-flip art)

## 设计方向

### 核心改动
**保留 StudioRoom 的 tower-of-monitors 框架**,在 monitor 内容上改为手绘风格的"文物画作",并在 YichangMuseumDecorations 中**大量增加**手绘藏品和画作元素。

### StudioRoom 增强(内容方向)
- **monitor 内容**: 每个 monitor 渲染一件文物的手绘 SVG/Canvas(简化线条画)
  - 虎座鸟架鼓 · 越王勾践剑 · 太阳人石刻 · 长阳人化石 · 巴人錞于 · 楚简 · 玉璧 · 青铜鼎
- **monitor 标题**: 中文文物名 + 英文别名 + 朝代(已存在,需强化)
- **monitor 选中行为**: 点击 monitor → 弹出该文物的高清画作 overlay + 简介

### YichangMuseumDecorations 大量增强
| 元素 | 类型 | 位置 | 视觉 |
|------|------|------|------|
| **博物馆匾额** | Plane + Text | y=7.5 z=-3 | 中文 "宜昌博物馆" |
| **"镇馆之宝" 虎座鸟架鼓** | 3D 几何体 | y=3.5 z=4 | 全息投影,2 鸟 + 鼓 + 底座(已存在,增强动画) |
| **6 件文物全息** | Float + 自转 | tower 周围 360° | 船/鼎/剑/矛/玉璧/錞于(已存在) |
| **"屈原·离骚" 卷轴** | Plane + Text | y=-0.3 z=5 | 全诗节选(已存在) |
| **"长阳人" 头骨复原画** | Plane + 简化线条 | y=4 z=-3 | 19.5万年前古人类 |
| **"太阳人" 石刻画** | Plane + 简化线条 | y=2 z=-3 | 7000年前新石器 |
| **"巴人" 图腾柱** | 几何体 | y=-1 z=-5 | 虎钮錞于造型 |
| **"楚简" 复制品墙** | Plane × 6 | 墙面 z=-10 | 模拟竹简 |
| **"明清宜昌府城图" 卷轴** | Plane + Text | y=0 z=-7 | 城市历史地图 |
| **"长江三峡考古遗址" 立体微缩** | 几何体 | y=-2 z=-6 | 3 个考古点标记 |
| **3 块"碑刻拓片"** | Plane × 3 + 黑底白字 | 墙面 z=-10 | 屈原/昭君/三国 |

### 交互
- **滚轮 / 拖拽**: monitor tower 旋转(已存在)
- **click monitor**: 弹出文物详情 overlay(已存在,内容改为手绘画作)
- **hover 匾额**: 发光 + 显示"国家二级博物馆·藏品 30000+ 件"
- **hover 全息文物**: 自转加速 + 名称浮标
- **hover 卷轴**: 卷轴展开
- **hover 拓片**: 模糊→清晰切换
- **hover 图腾柱**: 微微晃动(像风铃)
- **click "购票·详情" 按钮**: window.open 公开博物馆官网

### 文案
| 元素 | 文案 |
|------|------|
| 房间标题 | 宜昌博物馆 / YICHANG MUSEUM |
| 副标题 | 八千年巴楚文脉·三峡文化基因库 |
| 匾额 | 宜昌博物馆 |
| 镇馆之宝 | 虎座鸟架鼓(战国早期·2002 出土) |
| 屈原卷轴 | 屈原·离骚(节选) |
| 长阳人 | 长阳人·19.5万年前 |
| 太阳人 | 太阳人石刻·7000年前 |
| 巴人图腾 | 巴人崇虎·錞于王冠 |

## 实施步骤

1. **新建** `src/components/canvas/rooms/Studio/ArtifactPaintings.jsx`
   - 8 件文物手绘 SVG/Canvas 简化画
   - 每件尺寸 2×2.5,黑底白线风格
2. **改造** `StudioRoom.jsx`
   - 改 monitor 渲染:用 ArtifactPaintings 作为内容
   - 改 CONTENT_DATA 标题为中文文物名
3. **重写** `YichangMuseumDecorations.jsx`
   - 保留原有 4 个组件(匾额/虎座鸟架鼓/6 全息/屈原卷轴)
   - 增加 7 个新组件:长阳人画/太阳人画/巴人图腾/楚简墙/明清府城图/考古遗址微缩/碑刻拓片
4. **修改** `corridor/DoorSection.jsx`(无需)

## 验证标准

### 真实浏览器验证
1. 启动 vite
2. 访问 `http://localhost:5173/studio`
3. 等待 22s
4. 截图 5 张:studio-entry.png / studio-scroll-1~4.png
5. 检查截图:
   - 标题"宜昌博物馆"显示
   - tower-of-monitors 可见,每个 monitor 是手绘文物
   - 匾额 + 虎座鸟架鼓全息 + 屈原卷轴可见
   - 长阳人/太阳人/巴人图腾/楚简墙 可见
   - 至少 5 个新元素正确渲染
6. 检查 console: 无 pageerror

### 验证脚本
`tools/verify-museum.mjs`:
```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/studio");
await page.waitForTimeout(22000);
for (let i = 0; i < 5; i++) {
  await page.screenshot({ path: `.tmp/live/museum-${i}.png` });
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(2000);
}
await browser.close();
```

## 风险与回滚
- **风险 1**: ArtifactPaintings 复杂 SVG 渲染卡顿
  - **回滚**: 改为简化几何体 + 文字标注
- **风险 2**: 新元素 z 坐标与 tower 冲突
  - **回滚**: 装饰元素 z 调整为 -3 到 -10 区间
- **风险 3**: 碑刻拓片 Plane alpha 透明问题
  - **回滚**: 用 meshBasicMaterial color #1a1a1a + text white

## 不在本次范围
- TTS 语音讲解(后续接入 voicebox)
- 文物 3D 模型高精度还原(用简化几何+线条代替)
