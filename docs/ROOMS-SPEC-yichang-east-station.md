# 宜昌东站房间 — 设计 SPEC

## 现状评估
- 设计思路 (paper airplane 飞行 + 4 个 STORY_MILESTONES 浮空) — **保留**
- 内容 (JOURNEY/FREELANCE/UO/2023-NOW/2025-NOW) — **替换为东站内容**
- YichangStationDecorations (入川第一站牌坊 + 横幅) — **增强：加 3D 高铁列车、车站大屏、班次信息**

## 设计方向

### 1. 飞行故事节点 (4 个 STORY_MILESTONES)

| # | title | subtitle | type | 视觉元素 |
|---|-------|----------|------|----------|
| 1 | "宜昌东站" | "2012 · 通车运营" | intro | 大红底 + 入川第一站牌坊轮廓 |
| 2 | "沪汉蓉高铁" | "东西大动脉 · 串联 9 省" | rail | 浅蓝 + 列车剪影 |
| 3 | "日均 5 万人次" | "2024 暑运高峰 · 12 万" | stats | 绿色 + 人流粒子 |
| 4 | "汉宜城际" | "30 分钟 · 武汉 ⇌ 宜昌" | route | 橙色 + 路线弧线 |

每个 milestone 出现时伴随一个小手绘图标 + 数字/年份, 飞行过程看到的是浮空信息, 像经过一个信息站。

### 2. YichangStationDecorations 增强

- **3D 高铁列车模型** (约 8 单位长) — 沿 z=-30 处沿轨道横放, 车头白色流线型, 车身红色 CRH 涂装, 窗户网格
- **车站大屏** (10x3 单位) — 悬于 z=-50 上方, 显示 "宜昌东站 · YEICHANG EAST · 实时班次 G1234 上海虹桥 → 重庆北 14:35 准点" 滚动
- **班次信息牌** (3 个, 散布) — 1x0.5 木牌, 显示 "G502 上海虹桥 14:35 / D5826 武汉 16:20 / K1234 重庆北 22:40"
- **轨道弧线** — 沿 z 轴方向两条平行线 + 枕木纹理
- **远景** — 长江水面 (蓝色半透明平面) + 群山剪影 (灰色平面) + 晨雾

### 3. 交互设计

- **飞行过程**: 鼠标滚轮控制 paper airplane 前进, 看到 4 个 milestone 依次出现
- **hover 高铁**: 鼠标移到列车模型时, 车头灯亮 + 名字浮标 "复兴号 CR400AF"
- **hover 大屏**: 屏幕内容滚动加速, 显示更多班次
- **click milestone**: 弹出 overlay (复用 portfolio-itom 的 openOverlay), 显示该里程碑的详细介绍
- **click 列车**: 弹出 "车型参数" overlay, 显示列车技术参数

### 4. 文案 (中文为主, 保留必要的英文)

| 元素 | 文案 |
|---|---|
| 标题 | 宜昌东站 / YICHANG EAST STATION |
| 副标题 | 入川第一站 · 沪汉蓉高铁枢纽 |
| 列车说明 | 复兴号 CR400AF · 时速 350km · 16 节编组 |
| 大屏内容 | 宜昌东站 · 实时班次 · G1234 / D5826 / K1234 |
| 入川牌坊文字 | 入川第一站 · 万里长江 |

### 5. 技术实现

- 复用 AboutRoom 现有 paper airplane 飞行系统
- 复用 STORY_MILESTONES fade in/out 逻辑
- StoryMilestone 组件: 增加 type ''rail/stats/route'' 颜色
- YichangStationDecorations: 重写为 5 个独立 sub-component (Train / BigScreen / ScheduleBoard / Tracks / Scenery)
- 中文字体: 复用 zcoolxiaowei (已验证), 标题字号 1.5-1.8

## 验证标准
- 进入 /about 看到: 4 个东站里程碑 + 3D 高铁列车 + 车站大屏 + 入川牌坊
- build 0 error
- fly-through 时 milestone 依次 fade in/out
- 无 pageerror
