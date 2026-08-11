# 三峡大坝房间 — 飞行曲线与装饰打磨 SPEC v3

> 替代: `ROOMS-SPEC-three-gorges-dam.md` v2
> 落地: v3 (2026-08-11)
> 范围: **仅修改飞行距离 / 装饰增量 / 文字尺寸**;不破坏房间结构、不改 textures/

## 0. 不动区域 (Hard Constraints)
- ❌ 不动 `RoomInterior.jsx` 包裹结构
- ❌ 不动 `SceneContext` 状态机
- ❌ 不动 `useInfiniteCamera` 走廊相机
- ❌ 不动 `textures/*.webp` 任何资源
- ❌ 不动 `RoomWarmup` 5 房间挂载顺序
- ❌ 不集成 voicebox(单独任务)

## 1. 当前问题定位

### 1.1 用户反馈 (按时间倒序,最近)
1. **长镜头 飞行推进量要根据设计来** — 当前 7 单位推进量太小
2. **大坝上面要能看到三峡水库里面的场景** — 需要在飞行终点能俯瞰水库
3. **感受工程的恢弘** — 需要景深感(更远距离、更高视角)
4. **初始位置现在就差不多** — 保持 entry 位置 `(0, 0.5, -18)` 不动
5. **大坝装饰还要改进的更有那种感觉和视觉效果 元素丰富一些** — 装饰需要更丰富、更有艺术氛围
6. **很多文字太大了 没有设计可言** — StoryMilestone 文字过大

### 1.2 飞行参数对比

| 参数 | 当前 (65b6c65) | v3 设计 | 变化说明 |
|------|----------------|---------|----------|
| entry.z | -18 | -18 | 不动 |
| entry.y | 0.5 | 0.5 | 不动 |
| dz (max forward) | 7 | 28 | 4x 拉远 |
| dy (max rise) | 2.4 | 6.5 | 2.7x 升高 |
| targetPitch (max) | -0.18 rad (≈10°) | -0.25 rad (≈14°) | 略微加大俯角 |
| maxScroll | 120 | 200 | 给充足飞行距离 |
| scroll → camera 位置映射 | linear | **2-段**: 0-130 推进 + 130-200 上升 | 远距+抬起 |

### 1.3 装饰增量

在大坝后方 (roomRef-local z=-50 ~ -80) 增加:

| 元素 | 位置 (roomRef-local) | 视觉 |
|------|----------------------|------|
| **三峡水库水面** | z=-50, plane 60x30, 颜色 #b8d8e8 | 远景大片水面 |
| **水面涟漪** | z=-50, 5 行 wave mesh | 微动效 |
| **秭归县城轮廓** | z=-65, 4 个低三角剪影 | 远景层次 |
| **大坝顶部增设第 5 面旗** | dam top z=-7.5 | 增加视觉密度 |

### 1.4 文字尺寸调整

`StoryMilestone.jsx`:
- `journey` type: titleSize `1.5 → 0.7`, subtitleSize `0.35 → 0.18`
- `intro` type: titleSize `1.8 → 0.9`, subtitleSize `0.4 → 0.2`
- 保持 `awards` `skills` `default` 不动(没在 dam 用)

## 2. v3 飞行曲线

```js
// Phase 1 (scroll 0 → 130): 推进 + 轻度抬头
const phase1T = Math.min(1, scroll / 130);
const dz_p1 = phase1T * 22;      // 前推 22 单位
const dy_p1 = phase1T * 1.5;    // 上升 1.5 单位
const pitch_p1 = -0.05 * phase1T;

// Phase 2 (scroll 130 → 200): 大幅上升 + 继续前推 + 增大俯角
const phase2T = Math.max(0, Math.min(1, (scroll - 130) / 70));
const dz_p2 = 22 + phase2T * 6;  // 继续前推 6 单位
const dy_p2 = 1.5 + phase2T * 5; // 大幅上升 5 单位
const pitch_p2 = -0.05 - 0.20 * phase2T; // 加大俯角
```

### 2.1 相机轨迹关键帧
| scroll | x | y | z | pitch |
|--------|---|---|---|-------|
| 0 | 0 | 0.5 | -18 | 0 |
| 50 | 0 | ~1.0 | ~-25 | -0.02 |
| 100 | 0 | ~1.5 | ~-33 | -0.04 |
| 130 | 0 | ~2.0 | ~-40 | -0.05 |
| 165 | 0 | ~4.0 | ~-43 | -0.15 |
| 200 | 0 | ~7.0 | ~-46 | -0.25 |

终点: 相机在 y=7(大坝上方),z=-46(大坝之后),pitch=-14°(俯瞰)
此视角能看到: 大坝结构(下方)、三峡水库水面(y=0, z=-50)、秭归县城轮廓(z=-65)

## 3. 装饰增量 — 详细设计

### 3.1 三峡水库水面 (`YichangDamDecorations.jsx` 新增)

```jsx
{/* === 三峡水库水面 (roomRef-local z=-50) === */}
<group position={[0, -0.3, -50]}>
  <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
    <planeGeometry args={[80, 50]} />
    <meshBasicMaterial color="#b8d8e8" side={THREE.DoubleSide} />
  </mesh>
  {/* 水面波纹 (5 排小波) */}
  {[...Array(5)].map((_, i) => (
    <mesh key={`wave-${i}`} position={[-20 + i * 10, 0.02, 0]}
          rotation={[-Math.PI/2, 0, 0]}>
      <planeGeometry args={[8, 40]} />
      <meshBasicMaterial color="#a8c8e0" transparent opacity={0.6} />
    </mesh>
  ))}
</group>
```

### 3.2 秭归县城轮廓 (roomRef-local z=-65)

```jsx
{/* === 秭归县城剪影 (4 三角) === */}
<group position={[0, 0, -65]}>
  <mesh position={[-12, 0, 0]}><coneGeometry args={[3, 4, 3]} /><meshBasicMaterial color="#888" /></mesh>
  <mesh position={[-3, 0, 0]}><coneGeometry args={[2.5, 3, 3]} /></mesh>
  <mesh position={[5, 0, 0]}><coneGeometry args={[2, 2.5, 3]} /></mesh>
  <mesh position={[10, 0, 0]}><coneGeometry args={[3.5, 4.5, 3]} /></mesh>
</group>
```

### 3.3 大坝顶部增设第 5 面旗

找到 `DamStructure` 顶部的旗子数组,增加一面:
```jsx
<mesh key="flag-5" position={[-8, 2.4, 0.71]}>
  <planeGeometry args={[0.3, 0.4]} />
  <meshBasicMaterial color="#5b8def" side={THREE.DoubleSide} />
</mesh>
```

## 4. StoryMilestone 文字调整

只调整 `journey` 和 `intro` 类型 (dam 房间用到):
- `journey.titleSize`: 1.5 → 0.7
- `journey.subtitleSize`: 0.35 → 0.18
- `intro.titleSize`: 1.8 → 0.9
- `intro.subtitleSize`: 0.4 → 0.2

## 5. 验收清单

- [ ] 相机在 (0, 0.5, -18) 看向前方能看到大坝装饰(可能是远景)
- [ ] 滚动至 scroll=50, 大坝变大, 仍能看到装饰元素
- [ ] 滚动至 scroll=100, 大坝占据视野中心, 装饰元素细节清晰
- [ ] 滚动至 scroll=130, 相机接近大坝, 可看到大坝顶部细节
- [ ] 滚动至 scroll=200, 相机在 y≈7, 可看到三峡水库水面和秭归县城轮廓
- [ ] StoryMilestone 文字不大, 不喧宾夺主
- [ ] 不出现: 走廊门、白屏、装饰丢失
- [ ] 不出现: 飞行方向错误 (无左右转、无倒车)
- [ ] 浏览器真实验证 (Playwright 截图)

## 6. 回滚点

`git checkout 39bdd37 -- src/components/canvas/rooms/Gallery/DamFlightRoom.jsx`
可回滚到 65b6c65 同等状态。

修改前会自动 commit 当前工作区,失败可一键回滚。
