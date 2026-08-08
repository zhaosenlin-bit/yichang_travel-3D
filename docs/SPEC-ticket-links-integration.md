# 票务/详情链接集成 SPEC

> 用户原话: "每个门里面可以增加一个联系方式 也就是网络上公开的景点网站可以看内容和买票啥的 是可以的"

## 目标
在 4 个景点房间各加一个 **手绘风格的"购票·详情"按钮**,点击 `window.open` 公开网站(不跳转,新窗口打开)。保留 portfolio-itom 原结构。

## 设计

### 通用按钮组件
新文件:`src/components/canvas/rooms/_shared/TicketButton.jsx`

```jsx
function TicketButton({ position, url, label, subLabel }) {
  return (
    <group position={position}>
      {/* 手绘风木牌底 */}
      <mesh>
        <planeGeometry args={[1.8, 0.7]} />
        <meshBasicMaterial color="#f6e6c0" />
        <Edges color="#5a3010" />
      </mesh>
      {/* 顶部钉子装饰 */}
      <mesh position={[-0.7, 0.27, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0.7, 0.27, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      {/* 文字 */}
      <Text
        position={[0, 0.06, 0.02]}
        fontSize={0.18}
        color="#3a1010"
        anchorX="center"
        anchorY="middle"
        font={ZCOOL}
        letterSpacing={0.06}
        onClick={() => window.open(url, '_blank')}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {label}
      </Text>
      <Text
        position={[0, -0.18, 0.02]}
        fontSize={0.08}
        color="#7a5a2a"
        anchorX="center"
        anchorY="middle"
        font={ZCOOL}
      >
        {subLabel}
      </Text>
    </group>
  );
}
```

### 4 个房间集成

| 房间 | 按钮位置 | 链接 URL | 按钮文案 | 副文案 |
|------|----------|----------|----------|--------|
| 宜昌东站 (about) | 浮岛附近 [-3, 1.5, -50] | https://www.12306.cn | 购票·12306 | 中国铁路官方 |
| 宜昌博物馆 (studio) | 匾额下方 [0, 6.5, -3] | http://www.ycbwg.com | 参观预约 | 宜昌博物馆官网 |
| 三峡大坝 (gallery) | 牌坊旁边 [-3, -1, -5] | http://www.sxdam.com | 购票·详情 | 三峡大坝旅游 |
| 三峡人家 (contact) | 灯塔附近 [-9, 4, -18] | http://www.sxrbj.com.cn | 购票·详情 | 三峡人家风景区 |

> **注**: URL 用公开的官网/购票页,如有变更可后续替换。`window.open(url, '_blank')` 不影响当前场景。

### 实施步骤
1. 新建 `src/components/canvas/rooms/_shared/TicketButton.jsx`
2. 在 `AboutRoom.jsx` `<YichangStationDecorations />` 后挂载 `<TicketButton>`
3. 在 `StudioRoom.jsx` `<YichangMuseumDecorations />` 后挂载 `<TicketButton>`
4. 在 `GalleryRoom.jsx`(改 DamFlightRoom)`<YichangDamDecorations />` 后挂载 `<TicketButton>`
5. 在 `ContactRoom.jsx` `<YichangFamilyDecorations />` 后挂载 `<TicketButton>`

### 验证标准
- 每个房间入口可见手绘风格"购票·详情"按钮
- 按钮 hover 鼠标变 pointer
- 按钮 click 打开新窗口(不跳转当前)
- console 无 pageerror

## 不在本次范围
- 不集成第三方购票 API(纯链接跳转)
- 不修改走廊或门系统
