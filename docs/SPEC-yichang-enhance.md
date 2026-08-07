# SPEC — 宜昌文旅漫游 · 4 房间 + 入口增强方案

> 项目 `C:\kaifa_senlin\yichang_travel` 是 portfolio-itom 的本地 fork（HEAD `0603796`）。
> 已落地：4 房间内容替换（东站/博物馆/大坝/人家）+ 第 5 房间 MapRoom（手绘地图）+ 走廊第 5 门接入 + SignSystem 中文牌子。
> 本 SPEC 覆盖：**4 房间内容丰富 + 入口宜昌元素 + MapRoom 复刻增强**。

## 设计原则
1. **结构不动** — 走廊、RoomWarmup、TeleportRoom、SceneContext、5 房间布局结构保持原状
2. **风格统一** — paper-cut 手绘 / Edges / Float / 砖墙纹理，与 portfolio-itom 原版一致
3. **中文一致** — 标题用 ZcoolXiaoWei Google Font（已配）
4. **资源不动** — 不替换 `textures/` 下原图，只在 React 层添加新几何 / 文字 / 装饰

## A. 入口增强（EntranceDoors）

新增组件：`EntranceDecorations.jsx` 挂在 EntranceDoors 旁边。

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **红灯笼** | 圆球 + Edges + 飘带 | 门左右 2.2 高 | 鼠标悬停微摇 |
| **峡江三角帆船** | BufferGeometry 三角形 + 风帆 | 门口左前 | idle 漂浮 |
| **铜鼓** | 圆柱 + Edges + 4 边把手 | 门口右前 | 点击鼓面"咚"动画（缩放） |
| **"宜昌全景"卷轴** | Plane + 手绘线 + 中文标题 | 砖墙上方 | hover 展开 |
| **蝴蝶飘飞** | 2-3 个 InstancedMesh 蝴蝶 | 树 / 花坛之间 | 沿贝塞尔曲线飘飞 |
| **峡江晨雾雾团** | 3-4 个半透 sphere | 地面 / 门洞 | 缓慢漂移 |

实现细节：
- 在 `Experience.jsx` 的 `EntranceDoors` 后加 `<EntranceDecorations position={[0, 0, ENTRANCE_DOORS_Z]} />`
- 挂件 idle 动画用 `useFrame` + `Math.sin(time * 0.7)`
- 蝴蝶飘飞用 CatmullRomCurve3 沿曲线移动

## B. AboutRoom 增强（宜昌东站）

现有：4 个 STORY_MILESTONES（宜昌东站/火车头高铁/长江中游/峡江橙） + 暖黄纸飞机。

新增：

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **东站立体浮雕** | 矩形屋顶 + 4 根立柱 BufferGeometry | 地面 + 3 | 滚动触发淡入 |
| **长江水波** | 2-3 层透明 plane + FlowMaterial | 远景 Z=-180 | 缓慢流动 |
| **"入川第一站"牌坊** | 3 根立柱 + 横匾 + 中文 Text | Z=-15 前 | 滚动触发淡入 |
| **远山轮廓** | 三角 ExtrudeGeometry 起伏 | Z=-160 | 静止 |
| **"宜昌欢迎你" 横幅** | plane + 飘动 | Z=-25 | 飘动 |

实现：
- 在 `AboutRoom.jsx` 的 `<InfiniteSkyManager>` 后加 `<YichangStationDecorations />`（新文件）
- 远景用天空层级 Z < -150，融入天空蓝

## C. StudioRoom 增强（宜昌博物馆）

现有：浮动 monitor tower + 28 个时代文物标题。

新增：

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **博物馆匾额** | Plane + 中文 "宜昌博物馆" + ZcoolXiaoWei | tower 顶部 Y=8 | 静止 |
| **"镇馆之宝" 虎座鸟架鼓** | 2 鸟 + 1 鼓 BufferGeometry + Edges | tower 中央 Y=2 | 浮动旋转 |
| **5 件文物全息投影** | 5 个小型图标 (船/鼎/剑/矛/玉璧) Float | tower 周围 360° | 各自 Float |
| **"七朝文物" 卷轴** | Plane + 中文 7 段标题 | Z=-3 前 | hover 展开 |
| **碑刻拓片** | Plane + 黑底白字 (屈原·离骚) | 墙面 | hover 模糊清晰切换 |

## D. GalleryRoom 增强（三峡大坝）

现有：4 张可点击的 project 卡片（dam-front/lock/generator/release）。

新增：

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **大坝剖面立绘** | 大型 Plane + 阶梯剖面线 | 后墙 Z=-22 | 静止 |
| **"高峡出平湖" 卷轴** | Plane + 中文卷轴框 | Z=-22 上方 | 飘动 |
| **泄洪弧线** | 弧形 ParticleSystem | 大坝剖面前 | 流动 |
| **32 颗水轮图标** | 32 个小圆 Float | 大坝后 | 各自旋转 |
| **"世纪工程" 牌坊** | 3 立柱 + 中文横匾 | 入口前 | hover 发光 |
| **水位标尺** | Plane + 刻度线 + 中文 "175 / 145 / 135" | 大坝旁 | hover 显示 |

## E. ContactRoom 增强（三峡人家）

现有：灯塔 + 船 + 4 波浪层 + 5 个 SocialBarrel + 留言纸。

新增：

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **吊脚楼模型** | 4 根立柱 + 悬空平台 BufferGeometry | 远处 Y=4 | idle 飘移 |
| **西兰卡普织锦** | Plane + 五彩几何条纹 | 吊脚楼墙 | 静止 |
| **"屈原·离骚" 卷轴** | Plane + 诗文字幕 | 屋顶下方 | hover 展开 |
| **"摆手舞" 飘带** | 3 条 CatmullRom 飘带 | 半空 | 飘动 |
| **峡江号子纸船** | 8-12 折纸船 Float | 水面 | 各自漂 |
| **"端午·赛龙舟" 旗** | 三角旗 + 旗杆 | 船顶 | 飘动 |

## F. MapRoom 复刻增强（手绘地图）

现有：6 landmark cones + 3 RiverTube + title + 罗盘。

新增：

| 元素 | 类型 | 位置 | 交互 |
|------|------|------|------|
| **景区名称竖牌** | 6 个 Plane + 中文 | 每个 landmark 旁 | hover 翻牌 |
| **"三峡胜迹" 全景** | 大型 Plane + 手绘山轮廓 | 后景 | 静止 |
| **"清江画廊" 小帆** | 3 个 Float 三角帆 | 清江 RiverTube 旁 | 漂浮 |
| **"长江三峡" 水纹** | 沿主 RiverTube 路径的细线 | 主河 | 流动 |
| **罗盘刻度** | 8 个方向 + 中文（东南西北） | 罗盘周围 | hover 旋转 |
| **"一键游宜昌" 按钮** | Plane + 中文 | 地图下方 | hover 弹出 7 景点链接 |

## G. 走廊（5 门）增强

现有：4 门 THE GALLERY/THE STUDIO/THE ABOUT/LET'S CONNECT + 第 5 门 "手绘地图"。

变更：

| 元素 | 变更 |
|------|------|
| **门牌中文** | 把英文 THE GALLERY 等改为中文「画廊/工坊/东站/留言/手绘地图」 |
| **门牌 icon** | ◈▶★✉ 改为 🎨🛠🚄📜🗺 (用 SVG path 替代 emoji) |
| **门牌颜色** | 保留米色淡彩，但加重 |
| **门旁立牌** | 加 1 个 Plane + 中文副标题 ("三峡大坝·世纪工程") |
| **走廊 Doodles** | 加宜昌风物涂鸦（三角帆 / 船 / 铜鼓轮廓） |

## H. 走廊灯光 / 氛围微调

不改结构，加氛围：

| 元素 | 类型 | 位置 |
|------|------|------|
| 走廊远处暖光 | DirectionalLight color="#ffd06b" | Z=-50 |
| 走廊飘带 | 1-2 个 CatmullRom ribbon | 半空 |

## 工程纪律
- 每次加 `<group>` 都加 `{/* === NAME === */}` 注释
- 用 ZcoolXiaoWei Google Font URL（已配）保持中文一致
- Float 飘动用 drei `<Float>` 或 `useFrame`
- Edges 用 `@react-three/drei` `<Edges>` 保持手绘线描
- 每次新增组件独立文件，放在 `src/components/canvas/decorations/` 或 `src/components/canvas/rooms/<Room>/`
- 不动 SceneContext / Experience / corridor / hooks 结构
- build 通过 + 截图验证

## 验证清单
1. `npm run build` 0 error
2. vite dev 5173 健康
3. 进入每个房间渲染正确
4. 新增装饰可见、不挡交互
5. 中文 Text 渲染正常（字体加载或回退）
6. 无 console.error

## 不做
- 不替换原 textures/ 下任何 webp
- 不动 RoomWarmup 5 房间挂载顺序
- 不动 SceneContext 状态机
- 不动 useInfiniteCamera 走廊相机
- 不接 voicebox TTS（后续单独任务）
