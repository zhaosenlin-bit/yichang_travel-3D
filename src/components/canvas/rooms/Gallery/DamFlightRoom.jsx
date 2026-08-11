import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import PaperAirplane from "../About/PaperAirplane";
import InfiniteSkyManager from "../About/InfiniteSkyManager";
import YichangDamDecorations from "./YichangDamDecorations";
import TicketButton from "../_shared/TicketButton";
import { useScene } from "../../../../context/SceneContext";
import { useAchievements } from "../../../../context/AchievementsContext";
import { useAudio } from "../../../../context/AudioManager";

const CHUNK_LENGTH = 40;

export const AUDIO_SETTINGS = {
  volume: 2.0,
  distance: 2,
  rolloff: 0.8
};

// \u4e09\u5ce1\u5927\u575d 4 \u4e2a\u98de\u884c\u6545\u4e8b\u8282\u70b9
const STORY_MILESTONES = [
  {
    id: "gaoxia",
    position: [0, 0, -15],
    type: "intro",
    title: "\u9ad8\u5ce1\u51fa\u5e73\u6e56",
    subtitle: "\u6bdb\u6cfd\u4e1c\u00b7\u6c34\u8c03\u6b4c\u5934\u00b7\u6e38\u6cf3"
  },
  {
    id: "qiannian",
    position: [0, 0, -55],
    type: "journey",
    title: "\u5343\u5e74\u68a6\u5706",
    subtitle: "1994\u00b7\u5f00\u5de5 \u00b7 2009\u00b7\u5168\u9762\u5efa\u6210"
  },
  {
    id: "chuazha",
    position: [0, 0, -95],
    type: "journey",
    title: "\u5929\u4e0b\u7b2c\u4e00\u8239\u95f8",
    subtitle: "\u53cc\u7ebf\u4e94\u7ea7\u00b7113m\u63d0\u5347"
  },
  {
    id: "qingjie",
    position: [0, 0, -135],
    type: "journey",
    title: "\u6e05\u6d01\u80fd\u6e90\u5fc3\u810f",
    subtitle: "32\u53f0\u673a\u7ec4\u00b72250\u4e07\u5343\u74e6"
  }
];

const DamFlightRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
  const { camera } = useThree();
  const { isTeleporting, overlayContent, currentRoom } = useScene();
  const { showTutorial, unlockAchievement, hidePopup } = useAchievements();
  const { globalVolume, isMuted } = useAudio();
  const effectiveVolume = isMuted ? 0 : AUDIO_SETTINGS.volume * globalVolume;

  const audioRef = useRef();
  useEffect(() => {
    if (audioRef.current && audioRef.current.setVolume) {
      audioRef.current.setVolume(effectiveVolume);
    }
  }, [effectiveVolume]);

  const overlayRef = useRef(overlayContent);
  useEffect(() => {
    overlayRef.current = overlayContent;
  }, [overlayContent]);

  useEffect(() => {
    if (isExiting || isTeleporting) {
      hidePopup();
    }
  }, [isExiting, isTeleporting, hidePopup]);

  const hasSignaledReady = useRef(false);
  const frameCount = useRef(0);
  const FRAMES_TO_WAIT = 25;

  const scrollPosition = useRef(0);
  const scrollVelocity = useRef(0);

  const baseCameraRotation = useRef({ x: 0, y: 0, z: 0 });
  const isFlightActive = useRef(false);

  const currentBank = useRef(0);
  const currentPitch = useRef(0);

  const roomRef = useRef();
  const airplaneGroupRef = useRef();

  useEffect(() => {
    if (isTeleporting) {
      currentBank.current = 0;
      currentPitch.current = 0;
      isFlightActive.current = false;
      baseCameraRotation.current = { x: 0, y: 0, z: 0 };
      entryCameraPos.current = { x: 0, y: 0.5, z: -18 };
      scrollPosition.current = 0;
      scrollVelocity.current = 0;
    }
  }, [isTeleporting]);

  const entryCameraPos = useRef({ x: 0, y: 0.5, z: -18 });

  // Reset camera to face dam head-on right after the door fly-through lands.
  // Without this the camera keeps DOOR_LOOK_ANGLE and the dam scene renders to the side.
  useEffect(() => {
    if (isWarmup || isTeleporting) return;
    if (currentRoom !== 'gallery') return;
    camera.position.set(entryCameraPos.current.x, entryCameraPos.current.y, entryCameraPos.current.z);
    camera.rotation.set(0, 0, 0);
    scrollPosition.current = 0;
    scrollVelocity.current = 0;
    isFlightActive.current = false;
    currentBank.current = 0;
    currentPitch.current = 0;
    baseCameraRotation.current = { x: 0, y: 0, z: 0 };
    if (typeof window !== 'undefined') {
      window.__cam = camera;
      window.__damFlight = {
        scroll: (v) => { scrollPosition.current = v; scrollVelocity.current = 0; },
        get cam() { return window.__cam; },
        p: scrollPosition,
        start: () => { scrollVelocity.current = 8; }
      };
    }
  }, [currentRoom, isWarmup, isTeleporting, camera]);

  useFrame((state, delta) => {
    if (!hasSignaledReady.current) {
      if (frameCount.current === 0) if (roomRef.current) {
        roomRef.current.traverse((child) => {
          if (child.isMesh) child.frustumCulled = false;
        });
      }
      frameCount.current++;
      if (frameCount.current >= FRAMES_TO_WAIT) {
        if (roomRef.current) {
          roomRef.current.traverse((child) => {
            if (child.isMesh) child.frustumCulled = true;
          });
        }
        hasSignaledReady.current = true;
        onReady?.();
        if (!isTeleporting && !isWarmup) {
          unlockAchievement?.("first_room_visit");
        }
      }
    }

    scrollVelocity.current *= 0.94;
    scrollPosition.current += scrollVelocity.current * delta * 10;

    if (scrollPosition.current < 0) {
      scrollPosition.current = 0;
      scrollVelocity.current = 0;
    }

    if (!isFlightActive.current && scrollPosition.current > 0.5) {
      isFlightActive.current = true;
      entryCameraPos.current = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      };
    }

    if (isFlightActive.current) {
      // === 2-PHASE LONG SHOT (v3 spec) ===
      // Phase 1 (0-130 scroll): 推进 22, 上升 1.5, pitch -0.05 (接近大坝)
      // Phase 2 (130-200 scroll): 再推 6, 上升 5, pitch -> -0.18 (上升俯瞰)
      const phase1T = Math.min(1, scrollPosition.current / 130);
      const phase2T = Math.max(0, Math.min(1, (scrollPosition.current - 130) / 70));
      const dz = phase1T * 22 + phase2T * 6;
      const dy = phase1T * 1.5 + phase2T * 5;
      const targetPitch = -0.05 * phase1T + -0.13 * phase2T;
      const posLerp = 1 - Math.pow(0.01, delta);
      const rotLerp = 1 - Math.pow(0.02, delta);
      currentBank.current = 0;
      currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch, rotLerp);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, entryCameraPos.current.z - dz, posLerp);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, entryCameraPos.current.y + dy, posLerp);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, entryCameraPos.current.x, posLerp);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetPitch, rotLerp);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, 0, rotLerp);
      camera.rotation.z = 0;
    } else {
      currentBank.current = 0;
      currentPitch.current = 0;
    }

    if (airplaneGroupRef.current) {
      airplaneGroupRef.current.rotation.x = currentPitch.current * 3 + 0.1;
      airplaneGroupRef.current.rotation.z = -currentBank.current * 2;
    }
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (overlayRef.current) return;
      scrollVelocity.current += e.deltaY * 0.002;
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const lastTouchY = useRef(0);
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) lastTouchY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      if (overlayRef.current) return;
      if (e.touches.length === 1) {
        const deltaY = lastTouchY.current - e.touches[0].clientY;
        lastTouchY.current = e.touches[0].clientY;
        scrollVelocity.current += deltaY * 0.005;
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <group ref={roomRef} position={[0, 0, -25]}>
      {!isWarmup && (
        <PositionalAudio
          ref={audioRef}
          url="/sounds/szummiasta.mp3"
          distanceModel="exponential"
          refDistance={AUDIO_SETTINGS.distance}
          rolloffFactor={AUDIO_SETTINGS.rolloff}
          loop
          autoplay
          volume={effectiveVolume}
        />
      )}

      {/* \u7eb8\u98de\u673a */}
      <group ref={airplaneGroupRef} position={[0, -0.3, -3]}>
        <PaperAirplane scale={1.2} color="#5a8db0" />
      </group>

      {/* \u98de\u884c\u5929\u7a7a + \u4e91\u6735 + 4 \u4e2a\u5927\u575d milestone */}

      {/* \u4e09\u5ce1\u5927\u575d\u88c5\u9970: \u5927\u575d\u5256\u9762 + \u5377\u8f74 + \u724c\u574a + \u6c34\u4f4d\u6807\u5c3a + \u6c34\u8f6e + \u6e05\u6d2a\u5f27\u7ebf + \u957f\u6c5f\u6c34\u9762 + \u8fdc\u5c71 */}
      <InfiniteSkyManager scrollProgressRef={scrollPosition} milestones={STORY_MILESTONES} />

      <YichangDamDecorations />

      {/* \u5929\u7a7a\u80cc\u666f (sky color) */}
      <mesh position={[0, 0, -200]}>
        <planeGeometry args={[300, 150]} />
        <meshBasicMaterial color="#b8d8e8" side={THREE.DoubleSide} />
      </mesh>

      {/* \u8d2d\u7968\u00b7\u8be6\u60c5\u6309\u94ae (\u4e09\u5ce1\u5927\u575d\u65c5\u6e38\u5b98\u7f51) */}
            <TicketButton
        position={[-2, -1.5, -3]}
        rotation={[0, 0.25, 0]}
        url="http://www.sxdam.com"
        label={"\u8d2d\u7968\u00b7\u8be6\u60c5"}
        subLabel={"\u4e09\u5ce1\u5927\u575d\u65c5\u6e38"}
      />
    </group>
  );
};

export default DamFlightRoom;



