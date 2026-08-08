# 三峡人家房间 — 设计 SPEC v2

> 本 SPEC 是 `ROOMS-SPEC-yichang-east-station.md` 的姊妹文档。
> 落地版本: v2(2026-08-08)。

## 现状评估
- `ContactRoom.jsx` 是 **海面+灯塔+船** 风格,5 个 SocialBarrel(土家吊脚楼/峡江号子/西兰卡普/摆手舞/屈原留言)
- 用户反馈: "三峡人家这里的设计也可以 就是可以再丰富一些这里的场景"
- `YichangFamilyDecorations.jsx` 已有吊脚楼/折纸船/摆手舞/龙舟旗/屈原卷轴,需要**再增加**三峡人家元素
- 三峡人家属于 **户外+民俗文化**,适合 **海面+船+民居+民俗** 风格(已有)

## 设计方向

### 核心改动
**保留 ContactRoom 的海面/灯塔/船/SocialBarrel 框架**,在 YichangFamilyDecorations 中**大量增加**三峡人家特色元素,并把 SocialBarrel 改成可点击科普。

### YichangFamilyDecorations 大量增强
| 元素 | 类型 | 位置 | 视觉 |
|------|------|------|------|
| **吊脚楼**(已存在) | 3D 几何体 | x=-7 z=-14 | 4立柱+悬空+西兰卡普墙 |
| **8 艘折纸船**(已存在) | BufferGeometry | 水面 | 漂浮 |
| **3 条摆手舞飘带**(已存在) | Curve Tube | x=-5/4/5 | 飘动 |
| **龙舟旗**(已存在) | 旗杆+三角旗 | x=1.5 z=-8 | "竞渡" |
| **"端午·赛龙舟" 卷轴**(已存在) | Plane + Text | x=5.5 z=-6 | 已存在 |
| **"哭嫁" 剪影场景** | 2 几何人形剪影 | x=-5 z=-12 | 新娘+母亲剪影 |
| **土家"白虎"图腾柱** | 几何体 | x=5 z=-12 | 虎头+柱身 |
| **"山歌对唱" 声波可视化** | Sine 波 Line | x=0 z=-15 | 2 条对称波动 |
| **"西兰卡普" 织锦挂毯** | Plane + 几何图案 | x=0 z=-9 | 土家纹饰 |
| **"油茶汤" 茶碗几何** | 几何体 | x=-3 z=-7 | 3 碗+冒烟 |
| **"竹楼晒谷" 场景** | 几何体 | x=6 z=-9 | 楼+谷物 |
| **"乌篷船" 模型** | 几何体 | x=0 z=-16 | 拱形船篷 |

### SocialBarrel 升级(可点击科普)
- hover: 显示 2 行科普文字(中文 + 拼音)
- click: 弹出 overlay 显示详细介绍
- 5 个 barrel 主题保持:
  1. **土家吊脚楼**: 介绍建筑结构 + "半干栏式" 民居
  2. **峡江号子**: 介绍劳动号子种类 + "川江号子" 非遗
  3. **西兰卡普**: 介绍土家织锦 + "摆手舞" 配饰
  4. **摆手舞**: 介绍土家舞蹈 + "肉连响"
  5. **屈原留言**: 改为"端午习俗"(屈原 + 龙舟 + 粽子)

### 交互
- **click barrel**: 弹出 overlay 显示该主题的科普(中文+小图标+音频图标预留 TTS 入口)
- **hover 哭嫁剪影**: 剪影微微摆手(动画)
- **hover 图腾柱**: 微微晃动
- **hover 声波**: 振幅扩大
- **hover 织锦**: 纹饰微动
- **click 卷轴**: 弹出"端午·赛龙舟" 全诗
- **click "购票·详情" 按钮**: window.open 三峡人家官网

### 文案
| 元素 | 文案 |
|------|------|
| 房间标题 | 三峡人家 / THREE GORGES FAMILY |
| 副标题 | 巴土遗风·峡江明珠·土家文化活化石 |
| 卷轴 | 端午·赛龙舟 |
| 卷轴副文 | 五月初五·龙舟赛水·鹿鸣不忘 |
| 哭嫁剪影 | 哭嫁·土家婚俗 |
| 图腾柱 | 白虎图腾·土家崇虎 |
| 山歌 | 山歌对唱·妹娃子 |
| 织锦 | 西兰卡普·土家织锦 |
| 油茶 | 油茶汤·土家待客 |
| 晒谷 | 竹楼晒谷·金秋土家 |

## 实施步骤

1. **重写** `YichangFamilyDecorations.jsx`
   - 保留原有 5 个组件(吊脚楼/折纸船/摆手舞/龙舟旗/屈原卷轴)
   - 增加 7 个新组件:哭嫁剪影/白虎图腾/山歌对唱/西兰卡普挂毯/油茶汤碗/竹楼晒谷/乌篷船
2. **改造** `ContactRoom.jsx`
   - SocialBarrel 的 `label` 改成中文主题名
   - 5 个 barrel 的 `onClick` 改为 `openOverlay(主题科普内容)`
3. **修改** `corridor/DoorSection.jsx`(无需)

## 验证标准

### 真实浏览器验证
1. 启动 vite
2. 访问 `http://localhost:5173/contact`
3. 等待 22s
4. 截图 5 张:family-entry.png / family-scroll-1~4.png
5. 检查截图:
   - 标题"三峡人家"显示
   - 海面 + 灯塔 + 船 可见(原有)
   - 5 个 SocialBarrel 主题中文显示
   - 吊脚楼/折纸船/摆手舞/龙舟旗/屈原卷轴(原有)
   - 哭嫁剪影/白虎图腾/山歌声波/西兰卡普/油茶汤/竹楼晒谷/乌篷船 至少 5 个新元素可见
6. 检查 console: 无 pageerror

### 验证脚本
`tools/verify-family.mjs`:
```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/contact");
await page.waitForTimeout(22000);
for (let i = 0; i < 5; i++) {
  await page.screenshot({ path: `.tmp/live/family-${i}.png` });
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(2000);
}
await browser.close();
```

## 风险与回滚
- **风险 1**: 装饰元素太多导致 z-fighting
  - **回滚**: 元素 z 坐标分层 -3 到 -16 区间
- **风险 2**: SocialBarrel 弹出 overlay 与现有 MessagePaper 冲突
  - **回滚**: barrel onClick 仅更新 label,不弹 overlay
- **风险 3**: 山歌声波动画 frame rate 影响
  - **回滚**: 改用静态 wave 几何

## 不在本次范围
- TTS 语音讲解(后续接入 voicebox)
- 高精度 3D 模型(用简化几何代替)
