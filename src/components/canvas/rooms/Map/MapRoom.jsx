import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { useScene } from "../../../../context/SceneContext";
import { useAchievements } from "../../../../context/AchievementsContext";
import { useAudio } from "../../../../context/AudioManager";
import { isTouchDevice } from "../../../../utils/deviceDetect";

const MAP_LANDMARKS = [
    { id: "station",   name: "\u5b9c\u660c\u4e1c\u7ad9",   x:  3.0, y:  2.5, color: "#c46a30", hint: "\u4e07\u91cc\u957f\u6c5f\u00b7\u5165\u5ddd\u7b2c\u4e00\u7ad9" },
    { id: "museum",    name: "\u5b9c\u660c\u535a\u7269\u9986", x: -3.0, y:  0.0, color: "#7a2222", hint: "\u5df4\u695a\u6587\u5316\u00b7\u5343\u5e74\u5b9d\u5e93" },
    { id: "dam",       name: "\u4e09\u5ce1\u5927\u575d",   x: -1.5, y: -3.0, color: "#2b6190", hint: "\u4e16\u754c\u6c34\u7535\u4e4b\u90fd" },
    { id: "family",    name: "\u4e09\u5ce1\u4eba\u5bb6",   x:  4.5, y: -1.5, color: "#c2185b", hint: "\u571f\u5bb6\u6302\u811a\u697c\u00b7\u897f\u5170\u5361\u666e" },
    { id: "quyuan",    name: "\u5c48\u539f\u6545\u91cc",   x:  1.5, y: -1.0, color: "#3d7e5c", hint: "\u4ea4\u53cb\u4e66\u68f5\u68a3\u6aaf" },
    { id: "qingjiang", name: "\u6e05\u6c5f\u753b\u823f",   x: -2.0, y:  2.5, color: "#5499c7", hint: "\u516b\u767e\u91cc\u6e05\u6c5f\u00b7\u753b\u823f\u6f02\u8d4f" }
];

const RIVER_PATHS = [
    { color: "#3a6fa0", points: [[-9, 0.3, -1], [-4, 0.0, -1.3], [-1, -0.5, -1.6], [2, -1.0, -1.8], [7, -1.2, -2]] },
    { color: "#3a6fa0", points: [[-3.5, 3.2, -1], [-2.6, 1.2, -1.2], [-1.8, -0.4, -1.5], [-1.6, -1.0, -1.6]] },
    { color: "#3a6fa0", points: [[2.2, 4.5, -1], [1.5, 1.5, -1.2], [0.5, -0.8, -1.7]] }
];

const AUDIO_SETTINGS = { volume: 1.5, distance: 2, rolloff: 0.8 };

function LandmarkMarker({ landmark, isActive, onClick, onPointerEnter, onPointerLeave }) {
    const groupRef = useRef();
    const coneRef = useRef();
    const popPhase = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (groupRef.current) {
            const bob = Math.sin(t * 0.7 + popPhase.current) * 0.04;
            groupRef.current.position.y = landmark.y + bob;
        }
        if (coneRef.current) {
            const targetScale = isActive ? 1.25 : 1.0;
            const lerp = 0.15;
            coneRef.current.scale.x = THREE.MathUtils.lerp(coneRef.current.scale.x, targetScale, lerp);
            coneRef.current.scale.y = THREE.MathUtils.lerp(coneRef.current.scale.y, targetScale, lerp);
            coneRef.current.scale.z = THREE.MathUtils.lerp(coneRef.current.scale.z, targetScale, lerp);
        }
    });

    return (
        <group ref={groupRef} position={[landmark.x, landmark.y, -1]}>
            <mesh
                ref={coneRef}
                onClick={(e) => { e.stopPropagation(); onClick(landmark); }}
                onPointerOver={(e) => { e.stopPropagation(); onPointerEnter(landmark); document.body.style.cursor = "pointer"; }}
                onPointerOut={() => { onPointerLeave(); document.body.style.cursor = "auto"; }}
            >
                <coneGeometry args={[0.18, 0.45, 16]} />
                <meshStandardMaterial color={landmark.color} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
                <circleGeometry args={[0.22, 24]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.18} />
            </mesh>
            <Text
                position={[0, 0.55, 0]}
                fontSize={0.18}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
                outlineWidth={0.008}
                outlineColor="#ffffff"
            >
                {landmark.name}
            </Text>
            {isActive && (
                <Text
                    position={[0, 0.85, 0]}
                    fontSize={0.12}
                    color="#666666"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
                >
                    {landmark.hint}
                </Text>
            )}
        </group>
    );
}

function RiverTube({ points, color }) {
    const geometry = useMemo(() => {
        const v = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
        const curve = new THREE.CatmullRomCurve3(v);
        return new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
    }, [points]);
    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} transparent opacity={0.85} />
        </mesh>
    );
}

const MapRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
    const roomRef = useRef();
    const { isTeleporting } = useScene();
    const { showTutorial, unlockAchievement, hidePopup } = useAchievements();
    const { globalVolume, isMuted } = useAudio();
    const audioRef = useRef();
    const effectiveVolume = isMuted ? 0 : AUDIO_SETTINGS.volume * globalVolume;

    const [activeLandmark, setActiveLandmark] = useState(null);
    const [hovered, setHovered] = useState(null);

    const isTouch = useMemo(() => isTouchDevice(), []);

    const hasSignaledReady = useRef(false);
    const frameCount = useRef(0);
    const FRAMES_TO_WAIT = 25;

    useFrame((state, delta) => {
        if (roomRef.current) {
            roomRef.current.rotation.z += delta * 0.005;
        }
        if (!hasSignaledReady.current) {
            if (roomRef.current) {
                roomRef.current.traverse((c) => { if (c.isMesh) c.frustumCulled = false; });
            }
            frameCount.current++;
            if (frameCount.current >= FRAMES_TO_WAIT) {
                if (roomRef.current) {
                    roomRef.current.traverse((c) => { if (c.isMesh) c.frustumCulled = true; });
                }
                hasSignaledReady.current = true;
                onReady?.();
                if (!isTeleporting && !isExiting && !isWarmup) {
                    setTimeout(() => showTutorial("map_hover"), 1800);
                }
            }
        }
        if (audioRef.current && audioRef.current.setVolume) {
            audioRef.current.setVolume(effectiveVolume);
        }
    });

    useEffect(() => {
        if (isExiting || isTeleporting) hidePopup();
    }, [isExiting, isTeleporting, hidePopup]);

    const handleLandmarkClick = (landmark) => {
        if (isTouch) {
            setActiveLandmark((curr) => (curr === landmark ? null : landmark));
        }
        unlockAchievement("map_visit");
    };

    return (
        <group ref={roomRef} position={[0, 0.5, -22]}>
            {!isWarmup && (
                <PositionalAudio
                    ref={audioRef}
                    url="/sounds/cfl_turningpages-belem-breeze-487596.ogg"
                    distanceModel="exponential"
                    refDistance={AUDIO_SETTINGS.distance}
                    rolloffFactor={AUDIO_SETTINGS.rolloff}
                    loop
                    autoplay
                    volume={effectiveVolume}
                />
            )}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
                <planeGeometry args={[24, 18]} />
                <meshStandardMaterial color="#f6efdf" roughness={0.95} />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -1]}>
                <planeGeometry args={[23.7, 17.7]} />
                <meshBasicMaterial color="#9b8159" wireframe transparent opacity={0.25} />
            </mesh>

            {RIVER_PATHS.map((path, i) => (
                <RiverTube key={i} points={path.points} color={path.color} />
            ))}

            <Float speed={1.2} floatIntensity={0.2}>
                <Text
                    position={[0, 4.4, -0.6]}
                    fontSize={0.6}
                    color="#3a2a1a"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
                    outlineWidth={0.025}
                    outlineColor="#fffaf0"
                >
                    {"\u5b9c\u660c\u6587\u65c5\u624b\u7ed8\u5730\u56fe"}
                </Text>
                <Text
                    position={[0, 3.7, -0.6]}
                    fontSize={0.22}
                    color="#7a6a4a"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
                    outlineWidth={0.012}
                    outlineColor="#fffaf0"
                >
                    {"yichang walkthrough \u00b7 \u4e00\u5904\u540d\u80dc \u00b7 \u5343\u5a1f\u5b9d\u5730"}
                </Text>
            </Float>

            {MAP_LANDMARKS.map((l) => (
                <LandmarkMarker
                    key={l.id}
                    landmark={l}
                    isActive={hovered === l.id || activeLandmark === l.id}
                    onClick={handleLandmarkClick}
                    onPointerEnter={(lm) => setHovered(lm.id)}
                    onPointerLeave={() => setHovered(null)}
                />
            ))}

            <group position={[8.5, 1.0, -0.6]}>
                <mesh>
                    <circleGeometry args={[0.45, 32]} />
                    <meshStandardMaterial color="#fff8e8" roughness={0.9} />
                </mesh>
                <Text
                    position={[0, 0.15, 0.01]}
                    fontSize={0.16}
                    color="#7a2222"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
                >
                    {"\u5317"}
                </Text>
                <mesh position={[0, 0, 0.02]}>
                    <coneGeometry args={[0.08, 0.28, 3]} />
                    <meshBasicMaterial color="#7a2222" />
                </mesh>
            </group>

            <Text
                position={[0, -4.2, -0.6]}
                fontSize={0.16}
                color="#a08a6a"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/zcoolxiaowei/v15/i7dMIFFrTRywPpUVX9_RJyM1YFI.ttf"
            >
                {isTouch ? "\u70b9\u51fb\u5404\u6807\u67e5\u770b\u4ecb\u7ecd" : "\u60ac\u505c\u9f7f\u5149\u6807\u00b7\u67e5\u770b\u4ecb\u7ecd"}
            </Text>
        </group>
    );
};

export default MapRoom;
