import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * MuseumPlT — 博物馆匾额
 */
function MuseumPlT() {
    return (
        <group position={[0, 7.5, -3]}>
            <mesh>
                <planeGeometry args={[3.4, 0.9]} />
                <meshBasicMaterial color="#f6e6c0" />
                <Edges color="#5a3010" />
            </mesh>
            <mesh position={[0, 0.4, 0.01]}>
                <planeGeometry args={[3.5, 0.08]} />
                <meshBasicMaterial color="#7a2222" />
            </mesh>
            <mesh position={[0, -0.4, 0.01]}>
                <planeGeometry args={[3.5, 0.08]} />
                <meshBasicMaterial color="#7a2222" />
            </mesh>
            <Text
                position={[0, 0.06, 0.02]}
                fontSize={0.36}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.12}
                outlineWidth={0.018}
                outlineColor="#fffaf0"
            >
                {"\u5b9c\u660c\u535a\u7269\u9986"}
            </Text>
        </group>
    );
}

/**
 * TigerBirdDrum — 虎座鸟架鼓全息投影
 * 2 立鸟 + 中央鼓 + 底座
 */
function TigerBirdDrum({ position }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    });
    return (
        <group ref={groupRef} position={position}>
            {/* 底座 (双虎) */}
            {[-0.6, 0.6].map((x, i) => (
                <group key={i} position={[x, -0.7, 0]}>
                    <mesh>
                        <boxGeometry args={[0.4, 0.4, 1.2]} />
                        <meshBasicMaterial color="#7a5a3a" />
                        <Edges color="#3a2810" />
                    </mesh>
                    {/* 虎头 */}
                    <mesh position={[0, 0.2, 0.55]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshBasicMaterial color="#7a5a3a" />
                        <Edges color="#3a2810" />
                    </mesh>
                    {/* 虎眼 */}
                    <mesh position={[-0.08, 0.25, 0.7]}>
                        <circleGeometry args={[0.04, 8]} />
                        <meshBasicMaterial color="#3a1010" />
                    </mesh>
                    <mesh position={[0.08, 0.25, 0.7]}>
                        <circleGeometry args={[0.04, 8]} />
                        <meshBasicMaterial color="#3a1010" />
                    </mesh>
                </group>
            ))}
            {/* 中央鼓 */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 0.55, 24]} />
                <meshBasicMaterial color="#c41e1e" transparent opacity={0.85} />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 鼓面 */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 0.04, 24]} />
                <meshBasicMaterial color="#a87a3a" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 2 立鸟 */}
            {[-0.55, 0.55].map((x, i) => (
                <group key={i} position={[x, 0.55, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.03, 0.03, 0.55, 6]} />
                        <meshBasicMaterial color="#5a3a1a" />
                    </mesh>
                    {/* 鸟头 */}
                    <mesh position={[0, 0.45, 0]}>
                        <sphereGeometry args={[0.12, 8, 8]} />
                        <meshBasicMaterial color="#3a2010" />
                        <Edges color="#1a0a00" />
                    </mesh>
                    {/* 鸟嘴 */}
                    <mesh position={[0, 0.5, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                        <coneGeometry args={[0.05, 0.18, 4]} />
                        <meshBasicMaterial color="#7a5a2a" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/**
 * ArtifactHologram — 单文物全息投影图标
 * Float + 缓慢自转
 */
function ArtifactHologram({ position, color = "#3a6fa0", shape = "ding", label = "" }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    });

    let geometry;
    switch (shape) {
        case "ding":
            // 三足圆鼎
            geometry = (
                <group>
                    <mesh>
                        <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                    {/* 耳 */}
                    {[-0.25, 0.25].map((x, i) => (
                        <mesh key={i} position={[x, 0.25, 0]}>
                            <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    ))}
                    {/* 3 足 */}
                    {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((a, i) => (
                        <mesh key={i} position={[Math.cos(a) * 0.3, -0.3, Math.sin(a) * 0.3]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    ))}
                </group>
            );
            break;
        case "sword":
            geometry = (
                <group>
                    <mesh>
                        <boxGeometry args={[0.08, 0.9, 0.04]} />
                        <meshBasicMaterial color={color} transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                    <mesh position={[0, -0.5, 0]}>
                        <boxGeometry args={[0.2, 0.04, 0.06]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                    <mesh position={[0, -0.6, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                </group>
            );
            break;
        case "jade":
            geometry = (
                <group>
                    <mesh>
                        <torusGeometry args={[0.3, 0.1, 8, 32]} />
                        <meshBasicMaterial color={color} transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                    {/* 缺口 */}
                    <mesh position={[0.3, 0, 0]}>
                        <boxGeometry args={[0.1, 0.2, 0.2]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                </group>
            );
            break;
        case "spear":
            geometry = (
                <group>
                    <mesh>
                        <cylinderGeometry args={[0.04, 0.04, 0.9, 6]} />
                        <meshBasicMaterial color={color} transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <coneGeometry args={[0.12, 0.25, 6]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                </group>
            );
            break;
        case "boat":
            geometry = (
                <group>
                    <mesh>
                        <boxGeometry args={[0.5, 0.15, 0.9]} />
                        <meshBasicMaterial color={color} transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                </group>
            );
            break;
        default:
            geometry = (
                <mesh>
                    <sphereGeometry args={[0.3, 12, 12]} />
                    <meshBasicMaterial color={color} transparent opacity={0.7} />
                    <Edges color="#1a3a5a" />
                </mesh>
            );
    }

    return (
        <group ref={ref} position={position}>
            {geometry}
            {label && (
                <Text
                    position={[0, -0.7, 0]}
                    fontSize={0.12}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                    font={ZCOOL}
                    letterSpacing={0.06}
                    outlineWidth={0.008}
                    outlineColor="#ffffff"
                >
                    {label}
                </Text>
            )}
        </group>
    );
}

/**
 * QuyuanScroll — 屈原·离骚卷轴
 */
function QuyuanScroll({ position }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    });
    return (
        <group ref={ref} position={position}>
            {/* 卷轴 */}
            <mesh>
                <planeGeometry args={[2.2, 1.4]} />
                <meshBasicMaterial color="#f6efdf" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 卷轴轴 */}
            <mesh position={[-1.15, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 1.4, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            <mesh position={[1.15, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 1.4, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 标题 */}
            <Text
                position={[0, 0.45, 0.02]}
                fontSize={0.2}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.08}
                outlineWidth={0.012}
                outlineColor="#fffaf0"
            >
                {"\u5c48\u539f\u00b7\u79bb\u9a9a"}
            </Text>
            {/* 副标题 */}
            <Text
                position={[0, 0.22, 0.02]}
                fontSize={0.08}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"qu yuan \u00b7 li sao"}
            </Text>
            {/* 古文 (节选) */}
            <Text
                position={[0, -0.2, 0.02]}
                fontSize={0.13}
                color="#3a2a1a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.05}
                maxWidth={1.9}
            >
                {"\u8def\u66fc\u66fc\u5176\u590d\u8fd8\u5165\u3001\u671f\u4ec0\u591c\u4ee5\u4e4b\u4e0d\u9519"}
            </Text>
            <Text
                position={[0, -0.42, 0.02]}
                fontSize={0.1}
                color="#7a5a3a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
            >
                {"\u613f\u4e0e\u5fe7\u4e0e\u4eb2\u3001\u4e0d\u5fd8\u4e8b\u522b\u4ee5\u5fd7"}
            </Text>
        </group>
    );
}

const YichangMuseumDecorations = () => {
    // 5 文物全息分布 (环绕 tower)
    const artifacts = [
        { pos: [3.5, 2, 0], color: "#3a6fa0", shape: "boat", label: "\u8239" },
        { pos: [-3.5, 2.5, 0], color: "#7a2222", shape: "ding", label: "\u9f0e" },
        { pos: [3.2, 4.5, 0], color: "#3a7e5c", shape: "sword", label: "\u5251" },
        { pos: [-3.2, 5, 0], color: "#c97a2f", shape: "spear", label: "\u77db" },
        { pos: [3.0, 0, 0], color: "#5499c7", shape: "jade", label: "\u7389\u74f6" },
        { pos: [-3.0, 0.5, 0], color: "#7e5bb8", shape: "ding", label: "\u9497\u4e8e" },
    ];
    return (
        <group>
            {/* === 博物馆匾额 === */}
            <MuseumPlT />

            {/* === 虎座鸟架鼓全息 (中央) === */}
            <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.05}>
                <TigerBirdDrum position={[0, 3.5, 4]} />
            </Float>

            {/* === 5+1 文物全息 === */}
            {artifacts.map((a, i) => (
                <Float key={i} speed={1.2} floatIntensity={0.2} rotationIntensity={0.1}>
                    <ArtifactHologram position={a.pos} color={a.color} shape={a.shape} label={a.label} />
                </Float>
            ))}

            {/* === 屈原·离骚卷轴 === */}
            <QuyuanScroll position={[0, -0.3, 5]} />
        </group>
    );
};

export default YichangMuseumDecorations;
