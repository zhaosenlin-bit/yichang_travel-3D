import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Edges } from "@react-three/drei";
import * as THREE from "three";

const ZCOOL = "https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf";

/**
 * Paifang — 3 立柱 + 横匾牌坊 (gateway archway)
 */
function Paifang({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {[-3, 0, 3].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[0.5, 0.2, 0.5]} />
                        <meshBasicMaterial color="#7a5a3a" />
                        <Edges color="#3a2810" />
                    </mesh>
                    <mesh position={[0, 1.2, 0]}>
                        <cylinderGeometry args={[0.12, 0.16, 2.5, 12]} />
                        <meshBasicMaterial color="#c41e1e" />
                        <Edges color="#5a0e0e" />
                    </mesh>
                    <mesh position={[0, 2.5, 0]}>
                        <boxGeometry args={[0.55, 0.2, 0.55]} />
                        <meshBasicMaterial color="#7a2222" />
                        <Edges color="#3a1010" />
                    </mesh>
                </group>
            ))}
            <mesh position={[0, 2.85, 0]}>
                <boxGeometry args={[7.0, 0.35, 0.3]} />
                <meshBasicMaterial color="#c41e1e" />
                <Edges color="#5a0e0e" />
            </mesh>
            <mesh position={[0, 3.3, 0]}>
                <boxGeometry args={[7.6, 0.4, 0.35]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {[[-3.7, 3.55, 0], [3.7, 3.55, 0], [-3.0, 3.55, 0], [3.0, 3.55, 0]].map((p, i) => (
                <mesh key={i} position={p} rotation={[0, i % 2 ? -0.3 : 0.3, 0]}>
                    <coneGeometry args={[0.18, 0.32, 4]} />
                    <meshBasicMaterial color="#7a2222" />
                    <Edges color="#3a1010" />
                </mesh>
            ))}
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
 */
function StationBuilding({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[4.5, 3.0, 2.0]} />
                <meshBasicMaterial color="#e8e0d0" transparent opacity={0.85} />
                <Edges color="#3a2a1a" />
            </mesh>
            <mesh position={[0, 3.2, 0]}>
                <boxGeometry args={[5.0, 0.4, 2.3]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            <mesh position={[0, 3.55, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[3.0, 0.5, 4]} />
                <meshBasicMaterial color="#7a2222" />
                <Edges color="#3a1010" />
            </mesh>
            {[[-1.8, 0, 0.85], [1.8, 0, 0.85], [-1.8, 0, -0.85], [1.8, 0, -0.85]].map((p, i) => (
                <mesh key={i} position={[p[0], 1.5, p[2]]}>
                    <cylinderGeometry args={[0.18, 0.18, 3.0, 12]} />
                    <meshBasicMaterial color="#c41e1e" />
                    <Edges color="#5a0e0e" />
                </mesh>
            ))}
            <mesh position={[0, 1.8, 1.01]}>
                <planeGeometry args={[3.6, 1.4]} />
                <meshBasicMaterial color="#a8c8e0" transparent opacity={0.55} />
                <Edges color="#3a4a5a" />
            </mesh>
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
 * RiverWater — 长江水波 (Yangtze River water waves)
 */
function RiverWater({ position = [0, -2.2, -10] }) {
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
        <group position={position}>
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
 * DistantMountains — 远山轮廓 (distant mountain silhouettes)
 */
function DistantMountains({ position = [0, 0, -50] }) {
    const triangles = useMemo(() => {
        const xs = [-30, -15, -5, 8, 22];
        const peaks = [4, 7, 5.5, 8, 6];
        return xs.map((x, i) => ({ x, peak: peaks[i] }));
    }, []);

    return (
        <group position={position}>
            {triangles.map((m, i) => (
                <group key={i} position={[m.x, 0, 0]}>
                    <mesh position={[0, m.peak / 2, 0]}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([-8, 0, 0, 8, 0, 0, 0, m.peak, 0])}
                            />
                        </bufferGeometry>
                        <meshBasicMaterial color="#8a8a8a" side={THREE.DoubleSide} />
                        <Edges color="#3a3a3a" />
                    </mesh>
                    <mesh position={[3, m.peak * 0.6 / 2, -1]}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={3}
                                itemSize={3}
                                array={new Float32Array([-5, 0, 0, 5, 0, 0, 1, m.peak * 0.6, 0])}
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
            <mesh>
                <planeGeometry args={[3.6, 0.7]} />
                <meshBasicMaterial color="#c41e1e" side={THREE.DoubleSide} />
                <Edges color="#5a0e0e" />
            </mesh>
            <mesh position={[0, 0.32, 0.01]}>
                <planeGeometry args={[3.7, 0.06]} />
                <meshBasicMaterial color="#ffd06b" />
            </mesh>
            <mesh position={[0, -0.32, 0.01]}>
                <planeGeometry args={[3.7, 0.06]} />
                <meshBasicMaterial color="#ffd06b" />
            </mesh>
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
            {[[-1.85, 0, 0], [1.85, 0, 0]].map((p, i) => (
                <mesh key={i} position={p}>
                    <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                    <meshBasicMaterial color="#ffd06b" />
                </mesh>
            ))}
        </group>
    );
}

/**
 * HighSpeedTrain — 复兴号 CR400AF 3D simplified model
 */
function HighSpeedTrain({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* Train body main (white) */}
            <mesh>
                <boxGeometry args={[7, 1.0, 1.3]} />
                <meshBasicMaterial color="#f8f8f8" />
                <Edges color="#3a3a3a" />
            </mesh>
            {/* Red stripe along the bottom */}
            <mesh position={[0, -0.32, 0.66]}>
                <boxGeometry args={[6.9, 0.16, 0.01]} />
                <meshBasicMaterial color="#c41e1e" />
            </mesh>
            <mesh position={[0, -0.32, -0.66]}>
                <boxGeometry args={[6.9, 0.16, 0.01]} />
                <meshBasicMaterial color="#c41e1e" />
            </mesh>
            {/* Window strip */}
            <mesh position={[0, 0.18, 0.66]}>
                <boxGeometry args={[6.5, 0.25, 0.01]} />
                <meshBasicMaterial color="#2a3a4a" />
            </mesh>
            <mesh position={[0, 0.18, -0.66]}>
                <boxGeometry args={[6.5, 0.25, 0.01]} />
                <meshBasicMaterial color="#2a3a4a" />
            </mesh>
            {/* Streamlined nose (front) */}
            <mesh position={[3.8, 0, 0]} rotation={[0, 0, -0.2]}>
                <coneGeometry args={[0.55, 1.4, 16]} />
                <meshBasicMaterial color="#f8f8f8" />
                <Edges color="#3a3a3a" />
            </mesh>
            {/* Window on nose */}
            <mesh position={[4.1, 0.15, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.5, 0.2, 0.8]} />
                <meshBasicMaterial color="#2a3a4a" />
            </mesh>
            {/* Wheels (4 pairs) */}
            {[-2.5, -1.0, 1.0, 2.5].map((x, i) => (
                <group key={i}>
                    <mesh position={[x, -0.5, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.08, 12]} />
                        <meshBasicMaterial color="#2a2a2a" />
                    </mesh>
                    <mesh position={[x, -0.5, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.08, 12]} />
                        <meshBasicMaterial color="#2a2a2a" />
                    </mesh>
                </group>
            ))}
            {/* CRH logo plate */}
            <mesh position={[-2.5, 0.5, 0.66]}>
                <planeGeometry args={[1.0, 0.3]} />
                <meshBasicMaterial color="#c41e1e" />
            </mesh>
            <Text
                position={[-2.5, 0.5, 0.67]}
                fontSize={0.18}
                color="#fffaf0"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.06}
            >
                {"\u590d\u5174\u53f7"}
            </Text>
            <Text
                position={[-2.5, 0.32, 0.67]}
                fontSize={0.08}
                color="#fffaf0"
                anchorX="center"
                anchorY="middle"
            >
                {"CR400AF \u00b7 350km/h"}
            </Text>
        </group>
    );
}

/**
 * RailTracks — 轨道 (rail tracks with ties)
 */
function RailTracks({ position = [0, 0, 0] }) {
    const ties = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 20; i++) arr.push(i * 1.2 - 12);
        return arr;
    }, []);
    return (
        <group position={position}>
            {[-0.8, 0.8].map((z, i) => (
                <mesh key={i} position={[0, 0.05, z]}>
                    <boxGeometry args={[24, 0.05, 0.08]} />
                    <meshBasicMaterial color="#7a7a7a" />
                </mesh>
            ))}
            {ties.map((x, i) => (
                <mesh key={i} position={[x, 0, 0]}>
                    <boxGeometry args={[0.25, 0.06, 1.8]} />
                    <meshBasicMaterial color="#4a3018" />
                </mesh>
            ))}
        </group>
    );
}

/**
 * ScheduleBoard — 班次信息小木牌 (schedule info board)
 */
function ScheduleBoard({ position = [0, 0, 0], departures = [] }) {
    return (
        <group position={position}>
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
                <meshBasicMaterial color="#7a5a3a" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[1.5, 1.0, 0.06]} />
                <meshBasicMaterial color="#e8d0a8" />
                <Edges color="#5a3a1a" />
            </mesh>
            <Text
                position={[0, 0.55, 0.04]}
                fontSize={0.13}
                color="#3a1a0a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
            >
                {"\u73ed\u6b21\u4fe1\u606f"}
            </Text>
            <Text
                position={[0, 0.4, 0.04]}
                fontSize={0.05}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
            >
                {"DEPARTURES"}
            </Text>
            {departmentsSafe(departures).map((d, i) => (
                <Text
                    key={i}
                    position={[0, 0.18 - i * 0.18, 0.04]}
                    fontSize={0.08}
                    color="#3a1a0a"
                    anchorX="center"
                    anchorY="middle"
                    font={ZCOOL}
                >
                    {d}
                </Text>
            ))}
        </group>
    );
}

function departmentsSafe(deps) {
    return Array.isArray(deps) ? deps.slice(0, 3) : [];
}

/**
 * StationScreen — 车站大屏 (station info screen with scrolling text)
 */
function StationScreen({ position = [0, 0, 0] }) {
    const textRef = useRef();
    const lines = [
        "G502  \u4e0a\u6d77\u8679\u6865  14:35  \u51c6\u70b9",
        "D5826  \u6b66\u6c49  16:20  \u51c6\u70b9",
        "K1234  \u91cd\u5e86\u5317  22:40  \u51c6\u70b9",
        "D2204  \u6b66\u6c49  18:50  \u51c6\u70b9",
    ];
    const idxRef = useRef(0);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (textRef.current && Math.floor(t * 0.5) !== idxRef.current) {
            idxRef.current = Math.floor(t * 0.5);
            const newIdx = idxRef.current % lines.length;
            textRef.current.text = lines[newIdx];
        }
    });

    return (
        <group position={position}>
            <mesh position={[0, -1.6, -0.05]}>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
                <meshBasicMaterial color="#5a5a5a" />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[8, 2.4, 0.12]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0, 0.07]}>
                <planeGeometry args={[7.6, 2.0]} />
                <meshBasicMaterial color="#0a3a1a" />
            </mesh>
            <Text
                position={[0, 0.8, 0.08]}
                fontSize={0.28}
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.08}
                outlineWidth={0.01}
                outlineColor="#000000"
            >
                {"\u5b9c\u660c\u4e1c\u7ad9 \u00b7 \u5b9e\u65f6\u73ed\u6b21"}
            </Text>
            <Text
                position={[0, 0.55, 0.08]}
                fontSize={0.10}
                color="#88cc88"
                anchorX="center"
                anchorY="middle"
            >
                {"YICHANG EAST \u00b7 LIVE DEPARTURES"}
            </Text>
            <Text
                ref={textRef}
                position={[0, -0.3, 0.08]}
                fontSize={0.18}
                color="#aaffaa"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
            >
                {lines[0]}
            </Text>
            <Text
                position={[3.4, -0.8, 0.08]}
                fontSize={0.10}
                color="#88cc88"
                anchorX="right"
                anchorY="middle"
            >
                {"2024-08-08"}
            </Text>
        </group>
    );
}

const YichangStationDecorations = () => {
    return (
        <group>
            <DistantMountains position={[0, -2, -45]} />
            <RiverWater position={[0, -2.5, -15]} />
            <RailTracks position={[0, -2.45, -5]} />
            <Float speed={0.4} floatIntensity={0.05} rotationIntensity={0.02}>
                <group position={[0, -1.0, -3]}>
                    <HighSpeedTrain scale={0.32} />
                </group>
            </Float>
            <Float speed={0.6} floatIntensity={0.08} rotationIntensity={0.04}>
                <StationScreen position={[0, 4.5, -25]} />
            </Float>
            <Float speed={1.0} floatIntensity={0.2} rotationIntensity={0.08}>
                <ScheduleBoard
                    position={[4, -0.3, -2]}
                    departures={["G502 \u4e0a\u6d77 14:35", "D5826 \u6b66\u6c49 16:20", "K1234 \u91cd\u5e86 22:40"]}
                />
            </Float>
            <Float speed={0.9} floatIntensity={0.18} rotationIntensity={0.08}>
                <ScheduleBoard
                    position={[-4, -0.3, -8]}
                    departures={["D2204 \u6b66\u6c49 18:50", "G532 \u91cd\u5e86 19:30", "K50 \u4e0a\u6d77 23:10"]}
                />
            </Float>
            <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.05}>
                <Paifang position={[0, -1.5, 6]} scale={0.6} />
            </Float>
            <Float speed={0.5} floatIntensity={0.18} rotationIntensity={0.08}>
                <StationBuilding position={[-5, -2, 4]} scale={0.4} />
            </Float>
            <WelcomeBanner position={[5, 1.5, -10]} />
        </group>
    );
};

export default YichangStationDecorations;
