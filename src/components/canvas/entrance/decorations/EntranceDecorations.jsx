import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * RedLantern — 峡江红灯笼，挂于门侧
 * Sphere + 飘带 + Edges 手绘描线
 */
function RedLantern({ position, swingPhase = 0 }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.z = Math.sin(t * 0.8 + swingPhase) * 0.08;
        groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + swingPhase) * 0.04;
    });
    return (
        <group ref={groupRef} position={position}>
            {/* Hanging string */}
            <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.55, 6]} />
                <meshBasicMaterial color="#5a3a2a" />
            </mesh>
            {/* Top cap */}
            <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {/* Main bulb (squashed sphere) */}
            <mesh scale={[0.55, 0.45, 0.55]}>
                <sphereGeometry args={[0.42, 16, 16]} />
                <meshBasicMaterial color="#c41e1e" transparent opacity={0.92} />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* Vertical ridges (8 thin ribs) */}
            {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return (
                    <mesh key={i} position={[Math.cos(a) * 0.42, 0, Math.sin(a) * 0.42]} rotation={[0, a, 0]}>
                        <boxGeometry args={[0.015, 0.7, 0.015]} />
                        <meshBasicMaterial color="#7a0e0e" />
                    </mesh>
                );
            })}
            {/* Bottom cap */}
            <mesh position={[0, -0.32, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {/* Tassel ribbon */}
            <mesh position={[0, -0.5, 0]}>
                <coneGeometry args={[0.08, 0.32, 8]} />
                <meshBasicMaterial color="#c41e1e" />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 中央"宜"字 */}
            <Text
                position={[0, 0, 0.43]}
                fontSize={0.22}
                color="#ffd06b"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                outlineWidth={0.01}
                outlineColor="#7a2222"
            >
                {"\u5b9c"}
            </Text>
        </group>
    );
}

/**
 * WoodenFishBoat — 峡江三角帆木船，立于门前
 */
function WoodenFishBoat({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
        groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.05;
    });
    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Hull (椭球) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.55, 0.18, 1.1]} />
                <meshBasicMaterial color="#7a4a2a" />
                <Edges color="#3a2010" />
            </mesh>
            {/* Bow tip */}
            <mesh position={[0, 0.04, 0.7]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.3, 0.18, 0.4]} />
                <meshBasicMaterial color="#7a4a2a" />
                <Edges color="#3a2010" />
            </mesh>
            {/* Mast */}
            <mesh position={[0, 0.85, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 1.5, 8]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* Sail (三角帆) */}
            <mesh position={[0.35, 0.65, 0]} rotation={[0, 0, -0.15]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            0.85, 0, 0,
                            0, 1.0, 0,
                        ])}
                    />
                </bufferGeometry>
                <meshBasicMaterial color="#faf5e6" side={THREE.DoubleSide} />
                <Edges color="#7a5a2a" />
            </mesh>
            {/* Right sail */}
            <mesh position={[-0.35, 0.65, 0]} rotation={[0, 0, 0.15]} scale={[-1, 1, 1]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            0.85, 0, 0,
                            0, 1.0, 0,
                        ])}
                    />
                </bufferGeometry>
                <meshBasicMaterial color="#faf5e6" side={THREE.DoubleSide} />
                <Edges color="#7a5a2a" />
            </mesh>
        </group>
    );
}

/**
 * BronzeDrum — 壮族铜鼓，立于门右前
 * 点击鼓面触发"咚"缩放动画 (由父组件通过 ref)
 */
function BronzeDrum({ position, clickRef }) {
    const groupRef = useRef();
    const topRef = useRef();
    const baseScale = useRef(1);
    const pulse = useRef(0);
    useFrame((_, delta) => {
        if (!groupRef.current) return;
        // idle 微旋
        groupRef.current.rotation.y += delta * 0.1;
        // 点击 pulse
        if (pulse.current > 0) {
            pulse.current = Math.max(0, pulse.current - delta * 3);
            const s = 1 + Math.sin(pulse.current * Math.PI) * 0.06;
            if (topRef.current) topRef.current.scale.setScalar(s);
        } else if (topRef.current) {
            topRef.current.scale.setScalar(1);
        }
    });
    const handleClick = (e) => {
        e.stopPropagation();
        pulse.current = 1;
        if (clickRef?.current) clickRef.current();
    };
    return (
        <group ref={groupRef} position={position} scale={0.75}>
            {/* Drum base */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.5, 0.55, 0.1, 24]} />
                <meshBasicMaterial color="#5a4020" />
                <Edges color="#2a1808" />
            </mesh>
            {/* Drum body */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.45, 0.5, 0.55, 24]} />
                <meshBasicMaterial color="#7a5a2a" />
                <Edges color="#3a2010" />
            </mesh>
            {/* Drum top (clickable) */}
            <mesh ref={topRef} position={[0, 0.3, 0]} onClick={handleClick}>
                <cylinderGeometry args={[0.45, 0.45, 0.04, 24]} />
                <meshBasicMaterial color="#a87a3a" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 4 边耳朵 (把手) */}
            {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((a, i) => (
                <mesh key={i} position={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]} rotation={[0, -a, 0]}>
                    <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
                    <meshBasicMaterial color="#3a2010" />
                </mesh>
            ))}
            {/* 中央太阳纹 (circle outline) */}
            <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.16, 32]} />
                <meshBasicMaterial color="#3a2010" side={THREE.DoubleSide} />
            </mesh>
            {/* 中心太阳点 */}
            <mesh position={[0, 0.325, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.06, 16]} />
                <meshBasicMaterial color="#3a2010" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

/**
 * ScrollPainting — 卷轴牌匾，"宜昌全景"
 */
function ScrollPainting({ position }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02;
    });
    return (
        <group ref={groupRef} position={position} rotation={[0, 0, 0]}>
            {/* 卷轴底板 */}
            <mesh>
                <planeGeometry args={[2.0, 0.5]} />
                <meshBasicMaterial color="#f6efdf" />
                <Edges color="#7a5a2a" />
            </mesh>
            {/* 卷轴轴 */}
            <mesh position={[-1.25, 0, 0.01]}>
                <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} rotation={[0, 0, Math.PI / 2]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            <mesh position={[1.25, 0, 0.01]}>
                <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} rotation={[0, 0, Math.PI / 2]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 标题 */}
            <Text
                position={[0, 0.12, 0.02]}
                fontSize={0.18}
                color="#3a2a1a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.06}
                outlineWidth={0.012}
                outlineColor="#fffaf0"
            >
                {"\u5b9c\u660c\u5168\u666f\u00b7\u4e00\u7eb8\u6c5f\u5c71"}
            </Text>
            {/* 副标题 */}
            <Text
                position={[0, -0.13, 0.02]}
                fontSize={0.07}
                color="#7a5a3a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
            >
                {"yichang panorama \u00b7 river &amp; mountain on paper"}
            </Text>
            {/* 装饰: 三峡小图 */}
            <mesh position={[-0.9, -0.22, 0.02]}>
                <planeGeometry args={[0.35, 0.14]} />
                <meshBasicMaterial color="#e0e8f0" />
                <Edges color="#5a7090" />
            </mesh>
            <Text
                position={[-0.9, -0.22, 0.03]}
                fontSize={0.07}
                color="#3a4a5a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"\u4e09\u5ce1"}
            </Text>
        </group>
    );
}

/**
 * FlyingButterfly — 沿曲线飘飞的纸蝴蝶
 */
function FlyingButterfly({ pathPoints, phase = 0, scale = 1, color = "#c46a30" }) {
    const groupRef = useRef();
    const wingLRef = useRef();
    const wingRRef = useRef();
    const curve = useMemo(() => {
        const v = pathPoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        return new THREE.CatmullRomCurve3(v, true);
    }, [pathPoints]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = (state.clock.elapsedTime * 0.15 + phase) % 1;
        const p = curve.getPoint(t);
        groupRef.current.position.copy(p);
        const lookAt = curve.getPoint((t + 0.01) % 1);
        groupRef.current.lookAt(lookAt);
        // 翅膀扇动
        const flap = Math.sin(state.clock.elapsedTime * 18 + phase * 5) * 0.6;
        if (wingLRef.current) wingLRef.current.rotation.z = flap;
        if (wingRRef.current) wingRRef.current.rotation.z = -flap;
    });

    return (
        <group ref={groupRef} scale={scale}>
            <mesh ref={wingLRef} position={[-0.05, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            -0.18, 0.08, 0,
                            -0.05, -0.12, 0,
                        ])}
                    />
                </bufferGeometry>
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                <Edges color="#5a2a10" />
            </mesh>
            <mesh ref={wingRRef} position={[0.05, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            0.18, 0.08, 0,
                            0.05, -0.12, 0,
                        ])}
                    />
                </bufferGeometry>
                <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                <Edges color="#5a2a10" />
            </mesh>
            {/* body */}
            <mesh>
                <sphereGeometry args={[0.018, 8, 8]} />
                <meshBasicMaterial color="#3a2010" />
            </mesh>
        </group>
    );
}

/**
 * MorningMist — 地面 / 门洞雾团
 */
function MorningMist({ position, scale = 1, phase = 0 }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.x = position[0] + Math.sin(t * 0.2 + phase) * 0.3;
        ref.current.position.z = position[2] + Math.cos(t * 0.15 + phase) * 0.2;
        ref.current.material.opacity = 0.22 + Math.sin(t * 0.4 + phase) * 0.05;
    });
    return (
        <mesh ref={ref} position={position} scale={scale}>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
        </mesh>
    );
}

/**
 * EntranceDecorations — 入口宜昌元素装饰
 * 挂在 EntranceDoors 旁边（position [0,0,22]）
 */
const EntranceDecorations = (props) => {
    const drumClickRef = useRef(null);
    return (
        <group {...props}>
            {/* === 红灯笼 (左右各 1) === */}
            <RedLantern position={[-4.2, 1.8, 0.8]} swingPhase={0} />
            <RedLantern position={[4.2, 1.8, 0.8]} swingPhase={1.3} />

            {/* === 峡江三角帆船 (门口左前) === */}
            <Float speed={0.6} floatIntensity={0.18} rotationIntensity={0.05}>
                <WoodenFishBoat position={[-2.0, -1.7, 1.5]} scale={0.6} />
            </Float>

            {/* === 铜鼓 (门口右前) === */}
            <Float speed={0.4} floatIntensity={0.06} rotationIntensity={0}>
                <BronzeDrum position={[2.6, -1.6, 1.5]} clickRef={drumClickRef} />
            </Float>

            {/* === 卷轴牌匾 (砖墙上方) === */}
            <ScrollPainting position={[0, 1.05, 0.95]} />

            {/* === 飘飞蝴蝶 (3 只) === */}
            <FlyingButterfly
                pathPoints={[[-3, 1, 2], [-1.5, 1.6, 2.2], [0, 1.2, 2.4], [1.5, 1.8, 2.2], [3, 1.3, 2]]}
                phase={0}
                scale={1}
                color="#c46a30"
            />
            <FlyingButterfly
                pathPoints={[[-2.5, 0.5, 2.5], [-1, 0.9, 2.8], [1, 0.6, 2.8], [2.5, 1.0, 2.5]]}
                phase={0.4}
                scale={0.85}
                color="#3a6fa0"
            />
            <FlyingButterfly
                pathPoints={[[-2, 2.0, 2], [0, 2.2, 2.2], [2, 1.8, 2]]}
                phase={0.7}
                scale={0.7}
                color="#7a2222"
            />

            {/* === 晨雾 (4 团) === */}
            <MorningMist position={[-1.2, -1.6, 2]} scale={[1.0, 0.35, 1.0]} phase={0} />
            <MorningMist position={[1.2, -1.7, 2]} scale={[1.0, 0.35, 1.0]} phase={1.2} />
        </group>
    );
};

export default EntranceDecorations;
