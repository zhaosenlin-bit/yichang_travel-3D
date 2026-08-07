import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * Signboard — 景区竖牌 (仿 AboutRoom / Gallery 风格 — 中式立牌)
 * 仿古木立牌 + 中文标题 + 简介
 */
function Signboard({ position, rotation, title, subtitle, color = "#c41e1e" }) {
    return (
        <group position={position} rotation={rotation}>
            {/* 木杆 */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 牌匾底 */}
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.7, 0.5, 0.06]} />
                <meshBasicMaterial color="#f6e6c0" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 边框红 */}
            {[[0, 0.25, 0.03, 0.74, 0.04, 0.005], [0, 0.25, -0.03, 0.74, 0.04, 0.005],
              [0.35, 0.25, 0, 0.04, 0.54, 0.005], [-0.35, 0.25, 0, 0.04, 0.54, 0.005]].map((p, i) => (
                <mesh key={i} position={[p[0], p[1], p[2]]}>
                    <boxGeometry args={[p[3], p[4], p[5]]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
            {/* 标题 */}
            <Text
                position={[0, 0.32, 0.05]}
                fontSize={0.13}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
            >
                {title}
            </Text>
            {/* 副文 */}
            <Text
                position={[0, 0.13, 0.05]}
                fontSize={0.06}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.02}
                maxWidth={0.6}
            >
                {subtitle}
            </Text>
        </group>
    );
}

/**
 * QingjiangSail — 清江画廊小帆船 (Float)
 */
function QingjiangSail({ position, phase = 0 }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.x = position[0] + Math.sin(t * 0.3 + phase) * 0.6;
        ref.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.04;
    });
    return (
        <group ref={ref} position={position}>
            {/* 船体 */}
            <mesh>
                <boxGeometry args={[0.25, 0.08, 0.5]} />
                <meshBasicMaterial color="#7a4a2a" />
                <Edges color="#3a2010" />
            </mesh>
            {/* 桅 */}
            <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 帆 */}
            <mesh position={[0.13, 0.32, 0]} rotation={[0, 0, -0.15]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            0.4, 0, 0,
                            0, 0.5, 0,
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
 * YangtzeFlow — 长江水纹 (沿主 RiverTube 路径的细线)
 */
function YangtzeFlow() {
    const ref = useRef();
    const count = 40;
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const t = i / count;
            arr[i * 3] = -9 + t * 16;
            arr[i * 3 + 1] = 0.3 - t * 1.5 + Math.sin(t * 6) * 0.08;
            arr[i * 3 + 2] = -1 - t * 1;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        const pos = ref.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const phase = (t * 0.3 + i / count) % 1;
            pos[i * 3] = -9 + phase * 16;
            pos[i * 3 + 1] = 0.3 - phase * 1.5 + Math.sin(phase * 6) * 0.08;
            pos[i * 3 + 2] = -1 - phase * 1 - 0.05;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <pointsMaterial color="#5a8fb0" size={0.08} transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

/**
 * CompassRose — 罗盘刻度 (8 方向 + 中文)
 */
function CompassRose({ position }) {
    const directions = [
        { angle: 0, label: "\u5317", en: "N" },
        { angle: Math.PI / 4, label: "\u4e1c\u5317", en: "NE" },
        { angle: Math.PI / 2, label: "\u4e1c", en: "E" },
        { angle: 3 * Math.PI / 4, label: "\u4e1c\u5357", en: "SE" },
        { angle: Math.PI, label: "\u5357", en: "S" },
        { angle: 5 * Math.PI / 4, label: "\u5357\u897f", en: "SW" },
        { angle: 3 * Math.PI / 2, label: "\u897f", en: "W" },
        { angle: 7 * Math.PI / 4, label: "\u897f\u5317", en: "NW" },
    ];
    return (
        <group position={position}>
            {/* 外圈 */}
            <mesh>
                <ringGeometry args={[0.45, 0.5, 32]} />
                <meshBasicMaterial color="#7a5a2a" side={THREE.DoubleSide} />
            </mesh>
            {/* 内圈 */}
            <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[0.3, 0.33, 32]} />
                <meshBasicMaterial color="#7a5a2a" side={THREE.DoubleSide} />
            </mesh>
            {/* 8 方向 */}
            {directions.map((d, i) => (
                <group key={i} position={[Math.cos(d.angle) * 0.6, Math.sin(d.angle) * 0.6, 0.02]}>
                    <Text
                        fontSize={0.1}
                        color={d.angle === 0 ? "#c41e1e" : "#3a2a1a"}
                        anchorX="center"
                        anchorY="middle"
                        font={ZCOOL}
                    >
                        {d.label}
                    </Text>
                </group>
            ))}
        </group>
    );
}

/**
 * QuickTourButton — "一键游宜昌" 按钮
 */
function QuickTourButton({ position }) {
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    return (
        <group
            ref={ref}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <mesh scale={hovered ? [1.05, 1.05, 1] : [1, 1, 1]}>
                <planeGeometry args={[2.4, 0.55]} />
                <meshBasicMaterial color={hovered ? "#c41e1e" : "#7a2222"} />
                <Edges color="#3a1010" />
            </mesh>
            <Text
                position={[0, 0, 0.02]}
                fontSize={0.18}
                color="#ffd06b"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.06}
                outlineWidth={0.012}
                outlineColor="#5a0e0e"
            >
                {"\u4e00\u952e\u6e38\u5b9c\u660c"}
            </Text>
            <Text
                position={[0, -0.16, 0.02]}
                fontSize={0.08}
                color="#ffe6a0"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"quick tour \u00b7 7 sites"}
            </Text>
        </group>
    );
}

/**
 * useStateLocal — mini helper for hover state
 */
function useStateLocal(ref, initial) {
    const [v, setV] = useState(initial);
    ref.current = { set: setV };
    return [v, setV];
}

/**
 * ScenicBackdrop — 远景全景 (山水轮廓)
 */
function ScenicBackdrop({ position }) {
    return (
        <group position={position}>
            {/* 远山 3 层 */}
            {[
                { y: 0.4, color: "#a8a8a8", peak: 5 },
                { y: 0.0, color: "#8a8a8a", peak: 6.5 },
                { y: -0.4, color: "#7a7a7a", peak: 7.5 },
            ].map((m, layer) => (
                <group key={layer} position={[0, m.y, -layer * 0.2]}>
                    {[-9, -4, 1, 5, 9].map((x, i) => (
                        <mesh key={i} position={[x, m.peak / 2, 0]}>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={3}
                                    itemSize={3}
                                    array={new Float32Array([
                                        -3, 0, 0,
                                        3, 0, 0,
                                        0, m.peak, 0,
                                    ])}
                                />
                            </bufferGeometry>
                            <meshBasicMaterial color={m.color} side={THREE.DoubleSide} />
                            <Edges color="#3a3a3a" />
                        </mesh>
                    ))}
                </group>
            ))}
        </group>
    );
}

const YichangMapDecorations = () => {
    return (
        <group>
            {/* === 6 个景区竖牌 (放在每个 landmark cone 旁) === */}
            <Signboard position={[ 3.0,  2.5, -1]} title={"\u5b9c\u660c\u4e1c\u7ad9"} subtitle={"\u4e07\u91cc\u957f\u6c5f\u00b7\u5165\u5ddd\u7b2c\u4e00\u7ad9"} />
            <Signboard position={[-3.0,  0.0, -1]} title={"\u5b9c\u660c\u535a\u7269\u9986"} subtitle={"\u5df4\u695a\u6587\u5316\u00b7\u5343\u5e74\u5b9d\u5e93"} />
            <Signboard position={[-1.5, -3.0, -1]} title={"\u4e09\u5ce1\u5927\u575d"} subtitle={"\u4e16\u754c\u6c34\u7535\u4e4b\u90fd"} />
            <Signboard position={[ 4.5, -1.5, -1]} title={"\u4e09\u5ce1\u4eba\u5bb6"} subtitle={"\u571f\u5bb6\u6302\u811a\u697c"} />
            <Signboard position={[ 1.5, -1.0, -1]} title={"\u5c48\u539f\u6545\u91cc"} subtitle={"\u4ea4\u53cb\u4e66\u68f5\u00b7\u6aaf"} />
            <Signboard position={[-2.0,  2.5, -1]} title={"\u6e05\u6c5f\u753b\u823f"} subtitle={"\u516b\u767e\u91cc\u6e05\u6c5f"} />

            {/* === 清江画廊小帆船 (3 个) === */}
            <QingjiangSail position={[-2.4, 2.0, -1]} phase={0} />
            <QingjiangSail position={[-2.8, 2.3, -1.2]} phase={1.3} />
            <QingjiangSail position={[-1.8, 1.8, -1]} phase={2.7} />

            {/* === 长江水纹 (主河) === */}
            <YangtzeFlow />

            {/* === 远景山水轮廓 === */}
            <ScenicBackdrop position={[0, -3, -6]} />

            {/* === 罗盘刻度 (放在原 compass 旁) === */}
            <CompassRose position={[8.5, 1.0, 0.0]} />

            {/* === 一键游宜昌按钮 (地图下方) === */}
            <QuickTourButton position={[0, -5.0, -0.4]} />
        </group>
    );
};

export default YichangMapDecorations;
