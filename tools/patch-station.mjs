import fs from "node:fs";
const path = "src/components/canvas/rooms/About/YichangStationDecorations.jsx";
let txt = fs.readFileSync(path, "utf8");

// Add 3 new components before the YichangStationDecorations default export
const NEW_COMPONENTS = `

/**
 * HighSpeedTrain — 复兴号 CR400AF 高铁列车 3D 模型
 * 流线型车头 + 红色车身 + 黑色窗户
 */
function HighSpeedTrain({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* 车头 (流线型) */}
            <group position={[3.5, 0.6, 0]}>
                <mesh rotation={[0, 0, -0.15]}>
                    <coneGeometry args={[0.55, 1.8, 16]} />
                    <meshBasicMaterial color="#f8f8f8" />
                    <Edges color="#3a3a3a" />
                </mesh>
                {/* 车头窗 */}
                <mesh position={[0.5, 0.15, 0]} rotation={[0, 0, -0.15]}>
                    <planeGeometry args={[0.6, 0.25]} />
                    <meshBasicMaterial color="#2a3a4a" />
                </mesh>
                {/* 车头灯 */}
                <mesh position={[0.7, -0.25, 0.3]} rotation={[0, 0, -0.15]}>
                    <circleGeometry args={[0.08, 16]} />
                    <meshBasicMaterial color="#fffacd" emissive="#fffacd" />
                </mesh>
                <mesh position={[0.7, -0.25, -0.3]} rotation={[0, 0, -0.15]}>
                    <circleGeometry args={[0.08, 16]} />
                    <meshBasicMaterial color="#fffacd" emissive="#fffacd" />
                </mesh>
            </group>

            {/* 车身 (4 节编组示意) */}
            {[-1.5, 0.5, 2.5, 4.5].map((x, i) => (
                <group key={i} position={[x, 0.6, 0]}>
                    {/* 车厢主体 */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.8, 1.1, 1.4]} />
                        <meshBasicMaterial color="#f8f8f8" />
                        <Edges color="#3a3a3a" />
                    </mesh>
                    {/* 红色腰线 */}
                    <mesh position={[0, -0.15, 0.71]}>
                        <planeGeometry args={[1.7, 0.18]} />
                        <meshBasicMaterial color="#c41e1e" />
                    </mesh>
                    <mesh position={[0, -0.15, -0.71]}>
                        <planeGeometry args={[1.7, 0.18]} />
                        <meshBasicMaterial color="#c41e1e" />
                    </mesh>
                    {/* 窗户 (左) */}
                    <mesh position={[0, 0.18, 0.71]}>
                        <planeGeometry args={[1.4, 0.28]} />
                        <meshBasicMaterial color="#2a3a4a" />
                    </mesh>
                    {/* 窗户 (右) */}
                    <mesh position={[0, 0.18, -0.71]}>
                        <planeGeometry args={[1.4, 0.28]} />
                        <meshBasicMaterial color="#2a3a4a" />
                    </mesh>
                    {/* 车厢连接处黑线 */}
                    {i > 0 && (
                        <mesh position={[-0.9, 0, 0.71]}>
                            <planeGeometry args={[0.06, 1.0]} />
                            <meshBasicMaterial color="#3a3a3a" />
                        </mesh>
                    )}
                </group>
            ))}

            {/* 底盘 + 转向架 */}
            <mesh position={[1, 0, 0]}>
                <boxGeometry args={[8, 0.18, 1.3]} />
                <meshBasicMaterial color="#3a3a3a" />
            </mesh>
            {/* 车轮 (8 对) */}
            {[-3, -1.5, -0.5, 1, 2.5, 4, 5.5, 7].map((x, i) => (
                <group key={i} position={[x, -0.1, 0]}>
                    <mesh position={[0, 0, 0.55]}>
                        <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
                        <meshBasicMaterial color="#2a2a2a" />
                    </mesh>
                    <mesh position={[0, 0, -0.55]}>
                        <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
                        <meshBasicMaterial color="#2a2a2a" />
                    </mesh>
                </group>
            ))}

            {/* 车号牌 */}
            <mesh position={[6, 0.6, 0.71]}>
                <planeGeometry args={[0.6, 0.25]} />
                <meshBasicMaterial color="#c41e1e" />
            </mesh>
            <Text
                position={[6, 0.6, 0.72]}
                fontSize={0.12}
                color="#fffaf0"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.05}
            >
                {"\u590d\u5174\u53f7"}
            </Text>
            <Text
                position={[6, 0.4, 0.72]}
                fontSize={0.06}
                color="#fffaf0"
                anchorX="center"
                anchorY="middle"
            >
                {"CR400AF"}
            </Text>
        </group>
    );
}

/**
 * StationScreen — 车站大屏 (滚动班次信息)
 */
function StationScreen({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();
    const text1Ref = useRef();
    const text2Ref = useRef();
    const text3Ref = useRef();
    const text4Ref = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // 滚动效果: 通过修改 text position 的 y 实现
        if (text1Ref.current) text1Ref.current.position.y = -1.3 + (t * 0.3 % 4);
        if (text2Ref.current) text2Ref.current.position.y = -1.3 + ((t * 0.3 + 1) % 4);
        if (text3Ref.current) text3Ref.current.position.y = -1.3 + ((t * 0.3 + 2) % 4);
        if (text4Ref.current) text4Ref.current.position.y = -1.3 + ((t * 0.3 + 3) % 4);
    });

    return (
        <group position={position} scale={scale}>
            {/* 屏幕支架 */}
            <mesh position={[0, -2, -0.15]}>
                <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
                <meshBasicMaterial color="#5a5a5a" />
            </mesh>
            <mesh position={[0, -2.5, -0.15]}>
                <boxGeometry args={[0.4, 0.1, 0.4]} />
                <meshBasicMaterial color="#3a3a3a" />
            </mesh>

            {/* 屏幕外框 (黑色) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[10, 3, 0.15]} />
                <meshBasicMaterial color="#1a1a1a" />
            </mesh>
            {/* 屏幕底色 (深绿) */}
            <mesh position={[0, 0, 0.08]}>
                <planeGeometry args={[9.5, 2.5]} />
                <meshBasicMaterial color="#0a3a1a" />
            </mesh>

            {/* 顶部标题 */}
            <Text
                position={[0, 1.1, 0.09]}
                fontSize={0.35}
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
                position={[0, 0.75, 0.09]}
                fontSize={0.13}
                color="#88cc88"
                anchorX="center"
                anchorY="middle"
            >
                {"YICHANG EAST \u00b7 LIVE DEPARTURES"}
            </Text>

            {/* 滚动班次 */}
            <Text ref={text1Ref} position={[-3.5, -1.3, 0.09]} fontSize={0.18} color="#ffffff" anchorX="left" anchorY="middle" font={ZCOOL}>
                {"G502  \u4e0a\u6d77\u8679\u6865  14:35  \u51c6\u70b9"}
            </Text>
            <Text ref={text2Ref} position={[-3.5, -1.3, 0.09]} fontSize={0.18} color="#aaffaa" anchorX="left" anchorY="middle" font={ZCOOL}>
                {"D5826  \u6b66\u6c49  16:20  \u51c6\u70b9"}
            </Text>
            <Text ref={text3Ref} position={[-3.5, -1.3, 0.09]} fontSize={0.18} color="#ffffff" anchorX="left" anchorY="middle" font={ZCOOL}>
                {"K1234  \u91cd\u5e86\u5317  22:40  \u51c6\u70b9"}
            </Text>
            <Text ref={text4Ref} position={[-3.5, -1.3, 0.09]} fontSize={0.18} color="#aaffaa" anchorX="left" anchorY="middle" font={ZCOOL}>
                {"D2204  \u6b66\u6c49  18:50  \u51c6\u70b9"}
            </Text>

            {/* 时间戳 */}
            <Text
                position={[4.3, -1.05, 0.09]}
                fontSize={0.12}
                color="#88cc88"
                anchorX="right"
                anchorY="middle"
            >
                {"2024-08-08"}
            </Text>
        </group>
    );
}

/**
 * ScheduleBoard — 班次信息小木牌
 */
function ScheduleBoard({ position = [0, 0, 0], rotation = [0, 0, 0], departures = [] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* 木桩 */}
            <mesh position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
                <meshBasicMaterial color="#7a5a3a" />
            </mesh>
            {/* 木牌 */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.8, 0.08]} />
                <meshBasicMaterial color="#e8d0a8" />
                <Edges color="#5a3a1a" />
            </mesh>
            {/* 标题 */}
            <Text
                position={[0, 0.55, 0.05]}
                fontSize={0.12}
                color="#3a1a0a"
                anchorX="center"
                anchorY="middle"
                font={ZCOOL}
                letterSpacing={0.04}
            >
                {"\u73ed\u6b21\u4fe1\u606f"}
            </Text>
            <Text
                position={[0, 0.42, 0.05]}
                fontSize={0.05}
                color="#7a5a2a"
                anchorX="center"
                anchorY="middle"
            >
                {"DEPARTURES"}
            </Text>
            {/* 班次 */}
            {departures.slice(0, 3).map((d, i) => (
                <Text
                    key={i}
                    position={[0, 0.22 - i * 0.18, 0.05]}
                    fontSize={0.07}
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

/**
 * RailTracks — 轨道 (双轨 + 枕木)
 */
function RailTracks({ position = [0, 0, 0] }) {
    const ties = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 30; i++) arr.push(i * 2 - 30);
        return arr;
    }, []);
    return (
        <group position={position}>
            {/* 双轨 */}
            {[-0.6, 0.6].map((z, i) => (
                <mesh key={i} position={[0, 0, z]}>
                    <boxGeometry args={[60, 0.04, 0.08]} />
                    <meshBasicMaterial color="#5a5a5a" />
                </mesh>
            ))}
            {/* 枕木 */}
            {ties.map((x, i) => (
                <mesh key={i} position={[x, -0.02, 0]}>
                    <boxGeometry args={[0.3, 0.06, 1.4]} />
                    <meshBasicMaterial color="#3a2818" />
                </mesh>
            ))}
        </group>
    );
}

/**
 * SteamPuffs — 蒸汽效果 (列车加速时的蒸汽)
 */
function SteamPuffs({ position = [0, 0, 0] }) {
    const puffs = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
    const refs = useRef([]);
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        puffs.forEach((i) => {
            const r = refs.current[i];
            if (r) {
                const cycle = (t * 0.6 + i * 0.4) % 2.5;
                r.position.y = cycle * 0.3;
                r.position.x = -cycle * 0.2;
                r.material.opacity = Math.max(0, 0.6 - cycle * 0.25);
                r.scale.setScalar(0.15 + cycle * 0.4);
            }
        });
    });
    return (
        <group position={position}>
            {puffs.map((i) => (
                <mesh key={i} ref={(el) => (refs.current[i] = el)}>
                    <sphereGeometry args={[1, 12, 12]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}
`;

// Insert before "const YichangStationDecorations = () => {"
const TARGET = "const YichangStationDecorations = () => {";
if (!txt.includes(TARGET)) {
    console.error("TARGET not found");
    process.exit(1);
}
txt = txt.replace(TARGET, NEW_COMPONENTS + "\n" + TARGET);

// Now replace the body of YichangStationDecorations to include new components
const OLD_BODY = `const YichangStationDecorations = () => {
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
};`;

const NEW_BODY = `const YichangStationDecorations = () => {
    return (
        <group>
            {/* === 远山轮廓 (背景) === */}
            <DistantMountains position={[0, -2, -45]} />

            {/* === 长江水波 === */}
            <RiverWater position={[0, -2.5, -15]} />

            {/* === 轨道 (地面层) === */}
            <RailTracks position={[0, -2.3, -10]} />

            {/* === 复兴号高铁列车 (横放在 z=-8 处) === */}
            <Float speed={0.4} floatIntensity={0.05} rotationIntensity={0.02}>
                <group rotation={[0, Math.PI / 2, 0]}>
                    <HighSpeedTrain position={[0, -1.0, -8]} scale={0.45} />
                    <SteamPuffs position={[-3, -0.5, 0]} />
                </group>
            </Float>

            {/* === 车站大屏 (悬于 z=-20 上方) === */}
            <Float speed={0.6} floatIntensity={0.08} rotationIntensity={0.04}>
                <StationScreen position={[0, 4, -20]} scale={1.0} />
            </Float>

            {/* === 班次信息牌 (散布) === */}
            <Float speed={1.0} floatIntensity={0.2} rotationIntensity={0.1}>
                <ScheduleBoard
                    position={[4, -0.5, -3]}
                    rotation={[0, -Math.PI / 8, 0]}
                    departures={["G502 \u4e0a\u6d77 14:35", "D5826 \u6b66\u6c49 16:20", "K1234 \u91cd\u5e86 22:40"]}
                />
            </Float>
            <Float speed={0.9} floatIntensity={0.18} rotationIntensity={0.08}>
                <ScheduleBoard
                    position={[-4, -0.5, -12]}
                    rotation={[0, Math.PI / 8, 0]}
                    departures={["D2204 \u6b66\u6c49 18:50", "G532 \u91cd\u5e86 19:30", "K50 \u4e0a\u6d77 23:10"]}
                />
            </Float>

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
};`;

if (txt.includes(OLD_BODY)) {
    txt = txt.replace(OLD_BODY, NEW_BODY);
    console.log("Body replaced");
} else {
    console.error("OLD_BODY not found");
    process.exit(1);
}

fs.writeFileSync(path, txt, "utf8");
console.log("Patched YichangStationDecorations, new size:", txt.length);
