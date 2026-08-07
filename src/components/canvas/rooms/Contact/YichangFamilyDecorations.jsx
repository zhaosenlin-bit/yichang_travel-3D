import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * Diaojiaolou — 吊脚楼模型
 * 4 立柱 + 悬空平台 + 屋顶 + 西兰卡普墙
 */
function Diaojiaolou({ position }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    });
    return (
        <group ref={groupRef} position={position}>
            {/* 4 立柱 */}
            {[[-1.4, -1.2], [1.4, -1.2], [-1.4, -1.5], [1.4, -1.5]].map((p, i) => (
                <mesh key={i} position={[p[0], p[1] + 0.7, 0]}>
                    <cylinderGeometry args={[0.12, 0.14, 1.6, 12]} />
                    <meshBasicMaterial color="#5a3a1a" />
                    <Edges color="#2a1808" />
                </mesh>
            ))}
            {/* 平台底 */}
            <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[3.2, 0.1, 1.6]} />
                <meshBasicMaterial color="#7a5a3a" />
                <Edges color="#3a2810" />
            </mesh>
            {/* 西兰卡普墙 (装饰条纹) */}
            <mesh position={[0, 0.4, 0.81]}>
                <planeGeometry args={[3.2, 1.0]} />
                <meshBasicMaterial color="#c41e1e" />
                <Edges color="#5a0e0e" />
            </mesh>
            {/* 装饰条纹 - 横线 */}
            {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
                <mesh key={`h${i}`} position={[0, y + 0.4, 0.82]}>
                    <planeGeometry args={[3.0, 0.04]} />
                    <meshBasicMaterial color="#ffd06b" />
                </mesh>
            ))}
            {/* 装饰菱形 */}
            {[-0.8, 0, 0.8].map((x, i) => (
                <group key={`d${i}`} position={[x, 0.4, 0.83]}>
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <planeGeometry args={[0.25, 0.25]} />
                        <meshBasicMaterial color="#5a8fb0" />
                        <Edges color="#1a3a5a" />
                    </mesh>
                </group>
            ))}
            {/* 屋顶 */}
            <mesh position={[0, 1.0, 0]}>
                <coneGeometry args={[2.2, 0.6, 4, 1, false, Math.PI / 4]} />
                <meshBasicMaterial color="#3a2010" />
                <Edges color="#1a0a00" />
            </mesh>
            {/* 屋檐装饰 */}
            <mesh position={[0, 1.35, 0]}>
                <coneGeometry args={[2.0, 0.3, 4, 1, false, Math.PI / 4]} />
                <meshBasicMaterial color="#5a3a1a" />
                <Edges color="#2a1808" />
            </mesh>
            {/* 屋顶尖 */}
            <mesh position={[0, 1.55, 0]}>
                <coneGeometry args={[0.15, 0.4, 4]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
        </group>
    );
}

/**
 * PaperBoats — 漂浮的折纸船 (峡江号子)
 */
function PaperBoats({ position }) {
    const ref = useRef();
    const boats = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 8; i++) {
            arr.push({
                x: -8 + i * 2 + Math.random(),
                y: -2 + Math.random() * 0.5,
                z: -10 + Math.random() * 3,
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.4,
                scale: 0.18 + Math.random() * 0.1,
            });
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((c, i) => {
            const b = boats[i];
            if (c) {
                c.position.x = b.x + Math.sin(t * b.speed + b.phase) * 1.5;
                c.position.y = b.y + Math.sin(t * 1.5 + b.phase) * 0.1;
                c.rotation.y = Math.sin(t * 0.5 + b.phase) * 0.5;
            }
        });
    });

    return (
        <group ref={ref} position={position}>
            {boats.map((b, i) => (
                <group key={i} position={[b.x, b.y, b.z]} scale={b.scale}>
                    {/* 船体 */}
                    <mesh>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([
                                    0, 0, -1.0,
                                    -0.6, 0, 0.7,
                                    0.6, 0, 0.7,
                                ])}
                            />
                        </bufferGeometry>
                        <meshBasicMaterial color="#fafafa" side={THREE.DoubleSide} />
                        <Edges color="#5a5a5a" />
                    </mesh>
                    {/* 折痕 */}
                    <mesh position={[0, 0.01, 0]} rotation={[0, 0, 0]}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([
                                    0, 0, -1.0,
                                    0, 0.18, 0,
                                    0, 0, 0.7,
                                ])}
                            />
                        </bufferGeometry>
                        <meshBasicMaterial color="#cccccc" side={THREE.DoubleSide} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/**
 * BaishouRibbon — 摆手舞飘带 (CatmullRom)
 */
function BaishouRibbon({ position, color, phase = 0 }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime + phase;
        ref.current.rotation.z = Math.sin(t * 0.5) * 0.15;
        ref.current.rotation.x = Math.cos(t * 0.4) * 0.1;
    });
    // use a TubeGeometry along a CatmullRom curve
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.3, 0.3, 0.5),
            new THREE.Vector3(0.6, 0.1, 1.0),
            new THREE.Vector3(0.9, 0.4, 1.5),
            new THREE.Vector3(1.2, 0.2, 2.0),
        ]);
    }, []);
    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.06, 8, false), [curve]);

    return (
        <group ref={ref} position={position}>
            <mesh geometry={geometry}>
                <meshBasicMaterial color={color} transparent opacity={0.85} />
                <Edges color="#5a1010" />
            </mesh>
        </group>
    );
}

/**
 * DragonBoatFlag — "端午·赛龙舟" 旗
 */
function DragonBoatFlag({ position }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.y = Math.sin(t * 0.6) * 0.2;
    });
    return (
        <group ref={ref} position={position}>
            {/* 旗杆 */}
            <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            {/* 三角旗 */}
            <mesh position={[0.4, 2.0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={3}
                        itemSize={3}
                        array={new Float32Array([
                            0, 0, 0,
                            1.0, 0.2, 0,
                            0, 0.6, 0,
                        ])}
                    />
                </bufferGeometry>
                <meshBasicMaterial color="#c41e1e" side={THREE.DoubleSide} />
                <Edges color="#5a0e0e" />
            </mesh>
            <Text
                position={[0.5, 0.3, 0.02]}
                fontSize={0.16}
                color="#ffd06b"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.06}
            >
                {"\u7adf\u6e38"}
            </Text>
            {/* 旗顶 */}
            <mesh position={[0, 2.4, 0]}>
                <coneGeometry args={[0.08, 0.2, 4]} />
                <meshBasicMaterial color="#7a2222" />
            </mesh>
        </group>
    );
}

/**
 * QuyuanScroll — "屈原·离骚" 卷轴
 */
function QuyuanScroll({ position }) {
    const ref = useRef();
    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    });
    return (
        <group ref={ref} position={position}>
            <mesh>
                <planeGeometry args={[2.2, 1.0]} />
                <meshBasicMaterial color="#f6efdf" />
                <Edges color="#5a3010" />
            </mesh>
            {/* 卷轴轴 */}
            <mesh position={[-1.15, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 1.0, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            <mesh position={[1.15, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 1.0, 12]} />
                <meshBasicMaterial color="#5a3a1a" />
            </mesh>
            <Text
                position={[0, 0.3, 0.02]}
                fontSize={0.22}
                color="#3a1010"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.08}
                outlineWidth={0.012}
                outlineColor="#fffaf0"
            >
                {"\u7aef\u5348\u00b7\u8d5b\u9f99\u821f"}
            </Text>
            <Text
                position={[0, 0.06, 0.02]}
                fontSize={0.1}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {"duanwu \u00b7 dragon boat festival"}
            </Text>
            <Text
                position={[0, -0.25, 0.02]}
                fontSize={0.11}
                color="#3a2a1a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
                maxWidth={2.0}
            >
                {"\u4e94\u6708\u521d\u4e94\u00b7\u9f99\u821f\u8d5b\u6c34\u00b7\u9e7f\u53ee\u4e0d\u5fd8"}
            </Text>
        </group>
    );
}

const YichangFamilyDecorations = () => {
    return (
        <group>
            {/* === 吊脚楼 (远处左侧) === */}
            <Float speed={0.7} floatIntensity={0.12} rotationIntensity={0.06}>
                <Diaojiaolou position={[-7, -1.5, -14]} />
            </Float>

            {/* === 折纸船 (水面) === */}
            <PaperBoats position={[0, 0, -2]} />

            {/* === 摆手舞飘带 (3 条) === */}
            <BaishouRibbon position={[-5, 1.0, -8]} color="#c41e1e" phase={0} />
            <BaishouRibbon position={[4, 1.5, -10]} color="#3a6fa0" phase={1.2} />
            <BaishouRibbon position={[5, 0.8, -6]} color="#ffd06b" phase={2.4} />

            {/* === 龙舟旗 (船顶附近) === */}
            <DragonBoatFlag position={[1.5, -0.5, -8]} />

            {/* === "端午·赛龙舟" 卷轴 === */}
            <QuyuanScroll position={[5.5, 1.0, -6]} />
        </group>
    );
};

export default YichangFamilyDecorations;
