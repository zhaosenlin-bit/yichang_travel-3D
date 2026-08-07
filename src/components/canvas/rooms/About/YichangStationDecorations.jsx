import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * YichangStationDecorations — 宜昌东站主题装饰
 *
 * 添加在 AboutRoom 内，与现有 4 段 STORY_MILESTONES 共存。
 * - 入川牌坊 (3 立柱 + 横匾)
 * - 东站立体浮雕
 * - 长江水波 (3 层)
 * - 远山轮廓
 * - "宜昌欢迎你" 飘动横幅
 */

/**
 * Paifang — 3 立柱 + 横匾牌坊
 */
function Paifang({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* 3 立柱 */}
            {[-3, 0, 3].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    {/* 柱基 */}
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[0.5, 0.2, 0.5]} />
                        <meshBasicMaterial color="#7a5a3a" />
                        <Edges color="#3a2810" />
                    </mesh>
                    {/* 柱身 */}
                    <mesh position={[0, 1.2, 0]}>
                        <cylinderGeometry args={[0.12, 0.16, 2.5, 12]} />
                        <meshBasicMaterial color="#c41e1e" />
                        <Edges color="#5a0e0e" />
                    </mesh>
                    {/* 柱顶 */}
                    <mesh position={[0, 2.5, 0]}>
                        <boxGeometry args={[0.55, 0.2, 0.55]} />
                        <meshBasicMaterial color="#7a2222" />
                        <Edges color="#3a1010" />
                    </mesh>
                </group>
            ))}
            {/* 横梁 1 */}
            <mesh position={[0, 2.85, 0]}>
                <boxGeometry args={[7.0, 0.35, 0.3]} />
                <meshBasicMaterial color="#c41e1e" />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 横梁 2 (顶部) */}
            <mesh position={[0, 3.3, 0]}>
                <boxGeometry args={[7.6, 0.4, 0.35]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {/* 屋檐装饰 4 角 */}
            {[
                [-3.7, 3.55, 0], [3.7, 3.55, 0],
                [-3.0, 3.55, 0], [3.0, 3.55, 0],
            ].map((p, i) => (
                <mesh key={i} position={p} rotation={[0, i % 2 ? -0.3 : 0.3, 0]}>
                    <coneGeometry args={[0.18, 0.32, 4]} />
                    <meshBasicMaterial color="#7a2222" />
                    <Edges color="#3a1010" />
                </mesh>
            ))}
            {/* 中央匾额 */}
            <mesh position={[0, 2.55, 0.18]}>
                <planeGeometry args={[2.4, 0.7]} />
                <meshBasicMaterial color="#f6e6c0" />
                <Edges color="#5a3010" />
            </mesh>
            <Text
                position={[0, 2.65, 0.19]}
                fontSize={0.32}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.1}
                outlineWidth={0.015}
                outlineColor="#fffaf0"
            >
                {"\u5165\u5ddd\u7b2c\u4e00\u7ad9"}
            </Text>
            <Text
                position={[0, 2.4, 0.19]}
                fontSize={0.10}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"\u5b9c\u660c\u4e1c\u7ad9"}
            </Text>
        </group>
    );
}

/**
 * StationBuilding — 宜昌东站立体浮雕
 * 屋顶 + 4 立柱 + 中央立面
 */
function StationBuilding({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* 主体 */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[4.5, 3.0, 2.0]} />
                <meshBasicMaterial color="#e8e0d0" transparent opacity={0.85} />
                <Edges color="#3a2a1a" />
            </mesh>
            {/* 屋顶弧形 */}
            <mesh position={[0, 3.2, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[5.0, 0.4, 2.3]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            <mesh position={[0, 3.55, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[3.0, 0.5, 4, 1, false, Math.PI / 4]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {/* 4 立柱 */}
            {[[-1.8, 0, 0.85], [1.8, 0, 0.85], [-1.8, 0, -0.85], [1.8, 0, -0.85]].map((p, i) => (
                <mesh key={i} position={[p[0], 1.5, p[2]]}>
                    <cylinderGeometry args={[0.18, 0.18, 3.0, 12]} />
                    <meshBasicMaterial color="#c41e1e" />
                    <Edges color="#5a0e0e" />
                </mesh>
            ))}
            {/* 大玻璃窗 */}
            <mesh position={[0, 1.8, 1.01]}>
                <planeGeometry args={[3.6, 1.4]} />
                <meshBasicMaterial color="#a8c8e0" transparent opacity={0.55} />
                <Edges color="#3a4a5a" />
            </mesh>
            {/* "宜昌东站"招牌 */}
            <mesh position={[0, 2.85, 1.02]}>
                <planeGeometry args={[2.2, 0.45]} />
                <meshBasicMaterial color="#f6e6c0" />
                <Edges color="#5a3010" />
            </mesh>
            <Text
                position={[0, 2.85, 1.04]}
                fontSize={0.22}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.08}
            >
                {"\u5b9c\u660c\u4e1c\u7ad9"}
            </Text>
        </group>
    );
}

/**
 * RiverWater — 长江水波，多层透明 plane
 */
function RiverWater({ position = [0, -2.2, -10] }) {
    const groupRef = useRef();
    const layer1Ref = useRef();
    const layer2Ref = useRef();
    const layer3Ref = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (layer1Ref.current) {
            layer1Ref.current.position.x = Math.sin(t * 0.3) * 0.4;
            layer1Ref.current.material.opacity = 0.55 + Math.sin(t * 1.2) * 0.08;
        }
        if (layer2Ref.current) {
            layer2Ref.current.position.x = Math.sin(t * 0.4 + 1) * 0.5;
            layer2Ref.current.material.opacity = 0.4 + Math.sin(t * 1.5 + 1) * 0.08;
        }
        if (layer3Ref.current) {
            layer3Ref.current.position.x = Math.sin(t * 0.5 + 2) * 0.6;
            layer3Ref.current.material.opacity = 0.3 + Math.sin(t * 1.8 + 2) * 0.08;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={layer1Ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[80, 18]} />
                <meshBasicMaterial color="#3a6fa0" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={layer2Ref} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[80, 18]} />
                <meshBasicMaterial color="#5a8fb0" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={layer3Ref} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[80, 18]} />
                <meshBasicMaterial color="#a8c8e0" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

/**
 * DistantMountains — 远山轮廓 (三角 ExtrudeGeometry 起伏)
 */
function DistantMountains({ position = [0, 0, -50] }) {
    const triangles = useMemo(() => {
        // 5 座山
        const xs = [-30, -15, -5, 8, 22];
        const peaks = [4, 7, 5.5, 8, 6];
        return xs.map((x, i) => ({ x, peak: peaks[i] }));
    }, []);

    return (
        <group position={position}>
            {triangles.map((m, i) => (
                <group key={i} position={[m.x, 0, 0]}>
                    {/* 山体 1 - 大三角 */}
                    <mesh position={[0, m.peak / 2, 0]}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([
                                    -8, 0, 0,
                                    8, 0, 0,
                                    0, m.peak, 0,
                                ])}
                            />
                        </bufferGeometry>
                        <meshBasicMaterial color="#8a8a8a" side={THREE.DoubleSide} />
                        <Edges color="#3a3a3a" />
                    </mesh>
                    {/* 山体 2 - 后层小三角 */}
                    <mesh position={[3, m.peak * 0.6 / 2, -1]}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([
                                    -5, 0, 0,
                                    5, 0, 0,
                                    1, m.peak * 0.6, 0,
                                ])}
                            />
                        </bufferGeometry>
                        <meshBasicMaterial color="#a8a8a8" side={THREE.DoubleSide} />
                        <Edges color="#5a5a5a" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/**
 * WelcomeBanner — "宜昌欢迎你" 飘动横幅
 */
function WelcomeBanner({ position = [0, 2, 0] }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.06;
    });
    return (
        <group ref={groupRef} position={position}>
            {/* 横幅底 */}
            <mesh>
                <planeGeometry args={[3.6, 0.7]} />
                <meshBasicMaterial color="#c41e1e" side={THREE.DoubleSide} />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 上下金边 */}
            <mesh position={[0, 0.32, 0.01]}>
                <planeGeometry args={[3.7, 0.06]} />
                <meshBasicMaterial color="#ffd06b" />
            </mesh>
            <mesh position={[0, -0.32, 0.01]}>
                <planeGeometry args={[3.7, 0.06]} />
                <meshBasicMaterial color="#ffd06b" />
            </mesh>
            {/* 主文字 */}
            <Text
                position={[0, 0.05, 0.02]}
                fontSize={0.32}
                color="#ffd06b"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.1}
                outlineWidth={0.015}
                outlineColor="#5a0e0e"
            >
                {"\u5b9c\u660c\u6b22\u8fce\u4f60"}
            </Text>
            <Text
                position={[0, -0.2, 0.02]}
                fontSize={0.08}
                color="#ffe6a0"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"welcome to yichang"}
            </Text>
            {/* 左右挂穗 */}
            {[[-1.85, 0, 0], [1.85, 0, 0]].map((p, i) => (
                <mesh key={i} position={p}>
                    <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                    <meshBasicMaterial color="#ffd06b" />
                </mesh>
            ))}
        </group>
    );
}

const YichangStationDecorations = () => {
    return (
        <group>
            {/* === 远山轮廓 (背景) === */}
            <DistantMountains position={[0, -2, -45]} />

            {/* === 长江水波 === */}
            <RiverWater position={[0, -2.5, -15]} />

            {/* === "入川第一站" 牌坊 (近景) === */}
            <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.05}>
                <Paifang position={[0, -1.5, 4]} scale={0.6} />
            </Float>

            {/* === 东站立体浮雕 === */}
            <Float speed={0.5} floatIntensity={0.18} rotationIntensity={0.08}>
                <StationBuilding position={[-5, -2, 2]} scale={0.4} />
            </Float>

            {/* === "宜昌欢迎你" 飘动横幅 (中景) === */}
            <WelcomeBanner position={[5, 1.5, -5]} />
        </group>
    );
};

export default YichangStationDecorations;
