import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "/fonts/CabinSketch-Bold.ttf";

/**
 * TicketButton — 手绘风木牌式"购票·详情"按钮
 * hover 变指针 + scale 微变, click 新窗口打开公开 URL
 */
export default function TicketButton({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 2.0,
  url = "https://www.12306.cn",
  label = "购票·详情",
  subLabel = "",
  color = "#f6e6c0",
  edgeColor = "#5a3010"
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.06 : 1.0;
    const k = 1 - Math.pow(0.001, delta);
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, k);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, k);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, k);
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); window.open(url, "_blank", "noopener,noreferrer"); }}
    >
      <mesh>
        <planeGeometry args={[1.8, 0.7]} />
        <meshBasicMaterial color={color} />
        <Edges color={edgeColor} />
      </mesh>
      <mesh position={[-0.7, 0.27, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0.7, 0.27, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.86, 0.76]} />
        <meshBasicMaterial color={hovered ? "#fff4c8" : "#f6e6c0"} transparent opacity={hovered ? 0.9 : 0.5} />
      </mesh>
      <Text
        position={[0, 0.06, 0.02]}
        fontSize={0.18}
        color="#3a1010"
        anchorX="center"
        anchorY="middle"
        font={ZCOOL}
        letterSpacing={0.06}
        outlineWidth={0.008}
        outlineColor="#fffaf0"
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
