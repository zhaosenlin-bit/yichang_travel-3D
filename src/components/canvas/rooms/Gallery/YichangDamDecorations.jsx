import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * DamSection — 大坝剖面立绘 (阶梯形)
 * 中央大坝 + 5 级船闸 + 泄洪段 + 发电厂房
 */
function DamSection({ position }) {
    return (
        <group position={position}>
            {/* 大坝主体 (灰色梯形) */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[8, 1.6, 0.5]} />
                <meshBasicMaterial color="#a8a8a8" />
                <Edges color="#3a3a3a" />
            </mesh>
            {/* 坝顶 */}
            <mesh position={[0, 1.7, 0]}>
                <boxGeometry args={[8.4, 0.2, 0.7]} />
                <meshBasicMaterial color="#7a7a7a" />
                <Edges color="#3a3a3a" />
            </mesh>
            {/* 5 级船闸 (右侧阶梯) */}
            {Array.from({ length: 5 }).map((_, i) => (
                <mesh key={i} position={[3.5 + i * 0.4, -1.0 + i * 0.25, 0]}>
                    <boxGeometry args={[0.35, 0.3, 0.4]} />
                    <meshBasicMaterial color="#5a8fb0" />
                    <Edges color="#1a3a5a" />
                </mesh>
            ))}
            {/* 泄洪段 (左侧) */}
            {[-1.5, -2.5, -3.5].map((x, i) => (
                <group key={i} position={[x, -0.5, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.18, 0.18, 0.9, 12]} />
                        <meshBasicMaterial color="#3a6fa0" transparent opacity={0.7} />
                        <Edges color="#1a3a5a" />
                    </mesh>
                </group>
            ))}
            {/* 发电厂房 (右侧) */}
            <mesh position={[4.5, -0.5, 0]}>
                <boxGeometry args={[1.8, 0.9, 0.5]} />
                <meshBasicMaterial color="#c97a2f" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 水位线 */}
            <mesh position={[0, -0.4, 0.26]}>
                <planeGeometry args={[8.4, 0.04]} />
                <meshBasicMaterial color="#3a6fa0" transparent opacity={0.6} />
            </mesh>
        </group>
    );
}

/**
 * SpillwayArc — 泄洪弧线 (ParticleSystem 风格)
 */
function SpillwayArc({ position }) {
    const ref = useRef();
    const count = 80;
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = -Math.PI / 3 + t * (Math.PI / 1.5);
            arr[i * 3] = Math.cos(angle) * 2;
            arr[i * 3 + 1] = Math.sin(angle) * 2 - 1;
            arr[i * 3 + 2] = 0;
        }
        return arr;
    }, []);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        // animate each particle along the arc
        const positions = ref.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const phase = (t * 0.4 + i / count) % 1;
            const angle = -Math.PI / 3 + phase * (Math.PI / 1.5);
            positions[i * 3] = Math.cos(angle) * 2;
            positions[i * 3 + 1] = Math.sin(angle) * 2 - 1;
            positions[i * 3 + 2] = 0.1;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });
    return (
        <points ref={ref} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <pointsMaterial color="#a8c8e0" size={0.06} transparent opacity={0.85} sizeAttenuation />
        </points>
    );
}

/**
 * WaterTurbines — 32 颗水轮图标
 * 整齐排列在大坝后方
 */
function WaterTurbines({ position }) {
    const ref = useRef();
    const turbines = useMemo(() => {
        const arr = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 8; col++) {
                arr.push({
                    x: (col - 3.5) * 0.45,
                    y: -1.5 + row * 0.4,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((c, i) => {
            const t0 = turbines[i];
            if (c) c.rotation.z = t * 0.5 + t0.phase;
        });
    });

    return (
        <group ref={ref} position={position}>
            {turbines.map((t, i) => (
                <mesh key={i} position={[t.x, t.y, 0]}>
                    <torusGeometry args={[0.12, 0.04, 6, 16]} />
                    <meshBasicMaterial color="#c97a2f" />
                    <Edges color="#5a3010" />
                </mesh>
            ))}
        </group>
    );
}

/**
 * CenturyPlT — "世纪工程" 牌坊
 */
function CenturyPlT({ position }) {
    return (
        <group position={position}>
            {/* 3 立柱 */}
            {[-3, 0, 3].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[0.4, 0.18, 0.4]} />
                        <meshBasicMaterial color="#5a3a1a" />
                        <Edges color="#2a1808" />
                    </mesh>
                    <mesh position={[0, 0.9, 0]}>
                        <cylinderGeometry args={[0.1, 0.13, 2.0, 12]} />
                        <meshBasicMaterial color="#c41e1e" />
                        <Edges color="#5a0e0e" />
                    </mesh>
                    <mesh position={[0, 1.95, 0]}>
                        <boxGeometry args={[0.45, 0.18, 0.45]} />
                        <meshBasicMaterial color="#7a2222" />
                        <Edges color="#3a1010" />
                    </mesh>
                </group>
            ))}
            {/* 横梁 */}
            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[6.6, 0.3, 0.3]} />
                <meshBasicMaterial color="#c41e1e" />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 匾 */}
            <mesh position={[0, 1.95, 0.18]}>
                <planeGeometry args={[2.4, 0.6]} />
                <meshBasicMaterial color="#f6e6c0" />
                <Edges color="#5a3010" />
            </mesh>
            <Text
                position={[0, 1.97, 0.19]}
                fontSize={0.3}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.1}
                outlineWidth={0.014}
                outlineColor="#fffaf0"
            >
                {"\u4e16\u7eaa\u5de5\u7a0b"}
            </Text>
            <Text
                position={[0, 1.7, 0.19]}
                fontSize={0.08}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"century project"}
            </Text>
        </group>
    );
}

/**
 * WaterLevelRuler — 水位标尺 (刻度)
 */
function WaterLevelRuler({ position }) {
    const marks = [175, 145, 135, 113];
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[0.15, 3.5, 0.1]} />
                <meshBasicMaterial color="#fafafa" />
                <Edges color="#3a3a3a" />
            </mesh>
            {marks.map((m, i) => (
                <group key={i} position={[0.2, -1.6 + (m - 100) * 0.02, 0]}>
                    <mesh position={[-0.1, 0, 0]}>
                        <boxGeometry args={[0.2, 0.04, 0.05]} />
                        <meshBasicMaterial color="#3a3a3a" />
                    </mesh>
                    <Text
                        position={[0.5, 0, 0]}
                        fontSize={0.16}
                        color="#3a2a1a"
                        anchorX="left"
                        anchorY="middle"
                        font={ZCOOL}
                    >
                        {`${m}m`}
                    </Text>
                </group>
            ))}
            <Text
                position={[0, 2, 0]}
                fontSize={0.2}
                color="#c41e1e"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.06}
            >
                {"\u6c34\u4f4d"}
            </Text>
        </group>
    );
}

/**
 * GaoxiaPinghu — "高峡出平湖" 卷轴
 */
function GaoxiaScroll({ position }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    });
    return (
        <group ref={ref} position={position}>
            {/* 卷轴主体 */}
            <mesh>
                <planeGeometry args={[3.2, 0.85]} />
                <meshBasicMaterial color="#f6efdf" />
                <Edges color="#7a5a2a" />
            </mesh>
            {/* 卷轴轴 */}
            <mesh position={[-1.65, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 0.85, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            <mesh position={[1.65, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 0.85, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 主文字 */}
            <Text
                position={[0, 0.1, 0.02]}
                fontSize={0.36}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.12}
                outlineWidth={0.015}
                outlineColor="#fffaf0"
            >
                {"\u9ad8\u5ce1\u51fa\u5e73\u6e56"}
            </Text>
            {/* 副文 */}
            <Text
                position={[0, -0.22, 0.02]}
                fontSize={0.1}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"\u4e09\u5ce1\u5927\u575d\u00b7\u4e16\u7eaa\u5947\u8ff9"}
            </Text>
        </group>
    );
}

const YichangDamDecorations = () => {
    return (
        <group>
            {/* === 大坝剖面立绘 === */}
            <DamSection position={[0, -0.2, -7]} />

            {/* === "高峡出平湖" 卷轴 (顶部) === */}
            <GaoxiaScroll position={[0, 3.8, -6]} />

            {/* === 泄洪弧线 === */}
            <SpillwayArc position={[-3, -0.2, -6.5]} />

            {/* === 32 颗水轮 (大坝后) === */}
            <WaterTurbines position={[3.5, -0.2, -7]} />

            {/* === "世纪工程" 牌坊 === */}
            <Float speed={0.6} floatIntensity={0.1} rotationIntensity={0.04}>
                <CenturyPlT position={[0, -1.5, -5]} />
            </Float>

            {/* === 水位标尺 === */}
            <WaterLevelRuler position={[-6.5, 0, -7]} />
        </group>
    );
};

export default YichangDamDecorations;
