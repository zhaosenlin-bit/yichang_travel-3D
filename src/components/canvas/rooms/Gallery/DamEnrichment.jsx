import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// ========= Tower Crane (industrial gantry crane on dam top) =========
// Hand-drawn paper-cut style — flat box arm + triangular truss + counterweight
function TowerCrane({ position, scale = 1, armRotation = 0, color = "#e89a1a", delay = 0 }) {
  const ref = useRef();
  const armRef = useRef();
  useFrame((state) => {
    if (!ref.current || !armRef.current) return;
    const t = state.clock.elapsedTime + delay;
    armRef.current.rotation.y = armRotation + Math.sin(t * 0.15) * 0.05;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* vertical tower (orange lattice) */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.18, 6, 0.18]} />
        <meshBasicMaterial color={color} />
        <Edges color="#5a3a0a" />
      </mesh>
      {/* horizontal jib (long arm) */}
      <group ref={armRef} position={[0, 5.5, 0]}>
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[6, 0.12, 0.18]} />
          <meshBasicMaterial color={color} />
          <Edges color="#5a3a0a" />
        </mesh>
        {/* truss webbing (small triangular boxes) */}
        {[-1, -0.4, 0.2, 0.8, 1.4, 2, 2.6, 3.2, 3.8, 4.4].map((x, i) => (
          <mesh key={"truss-" + i} position={[x, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.18, 0.06]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
        {/* counterweight short arm */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[1.4, 0.2, 0.22]} />
          <meshBasicMaterial color="#3a3a3a" />
          <Edges color="#1a1a1a" />
        </mesh>
        {/* hook cable */}
        <mesh position={[3.5, -1.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3.6, 4]} />
          <meshBasicMaterial color="#2a1a0a" />
        </mesh>
        {/* hook */}
        <mesh position={[3.5, -3.6, 0]}>
          <boxGeometry args={[0.18, 0.1, 0.18]} />
          <meshBasicMaterial color="#5a3a1a" />
        </mesh>
      </group>
      {/* operator cabin */}
      <mesh position={[0.4, 5.2, 0.2]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshBasicMaterial color="#d4a878" />
        <Edges color="#5a3a1a" />
      </mesh>
    </group>
  );
}

// ========= Bird (paper-cut V-shape) =========
function Bird({ position, scale = 1, delay = 0, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + delay;
    // circular glide path
    ref.current.position.x = position[0] + Math.cos(t * 0.3) * 6;
    ref.current.position.z = position[2] + Math.sin(t * 0.3) * 4;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.4;
    // face direction of motion
    ref.current.rotation.y = -t * 0.3 + Math.PI / 2;
    // flap wings (scale Y)
    const flap = 1 + Math.sin(t * 8) * 0.25;
    if (ref.current.children[0]) {
      ref.current.children[0].scale.y = flap;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* wings as two angled planes */}
      <group>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
          <planeGeometry args={[0.7, 0.15]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <planeGeometry args={[0.7, 0.15]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ========= Birds (flock) =========
function Birds({ count = 5, center = [0, 5, -10], spread = 4 }) {
  const positions = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: center[0] + (i - (count - 1) / 2) * spread * 0.6,
      y: center[1] + Math.sin(i) * 0.5,
      z: center[2] + (i % 2 === 0 ? -1 : 1) * spread * 0.4,
      scale: 0.7 + Math.random() * 0.4,
      delay: i * 1.3,
      speed: 0.7 + Math.random() * 0.4,
    }));
  }, [count, center, spread]);
  return (
    <group>
      {positions.map((p, i) => (
        <Bird key={i} position={[p.x, p.y, p.z]} scale={p.scale} delay={p.delay} speed={p.speed} />
      ))}
    </group>
  );
}

// ========= Tree (paper-cut pine) =========
function Tree({ position, scale = 1, color = "#4a6a48" }) {
  return (
    <group position={position} scale={scale}>
      {/* trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      {/* layered pine foliage */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.7, 0.8, 6]} />
        <meshBasicMaterial color={color} />
        <Edges color="#2a3a28" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.55, 0.7, 6]} />
        <meshBasicMaterial color={color} />
        <Edges color="#2a3a28" />
      </mesh>
      <mesh position={[0, 2.15, 0]}>
        <coneGeometry args={[0.4, 0.6, 6]} />
        <meshBasicMaterial color={color} />
        <Edges color="#2a3a28" />
      </mesh>
    </group>
  );
}

function Trees({ positions = [], scale = 1, color = "#4a6a48" }) {
  return (
    <group>
      {positions.map((p, i) => (
        <Tree key={i} position={p} scale={scale} color={color} />
      ))}
    </group>
  );
}

// ========= Sail Boat (small Chinese junk) =========
function SailBoat({ position, scale = 1, color = "#e89a1a", delay = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.06;
    ref.current.rotation.z = Math.sin(t * 0.3 + position[0]) * 0.04;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* hull */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.0, 0.18, 0.35]} />
        <meshBasicMaterial color="#7a4a2a" />
        <Edges color="#3a2010" />
      </mesh>
      {/* mast */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 4]} />
        <meshBasicMaterial color="#5a3a1a" />
      </mesh>
      {/* sail (paper-cut triangle) */}
      <mesh position={[0.15, 0.95, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        <Edges color="#5a3a0a" />
      </mesh>
    </group>
  );
}

// ========= Distant Bridge (Yichang-style cable bridge silhouette) =========
function DistantBridge({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* deck */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.12, 0.4]} />
        <meshBasicMaterial color="#5a5a6a" />
      </mesh>
      {/* left pylon */}
      <mesh position={[-3, 0.8, 0]}>
        <boxGeometry args={[0.25, 1.6, 0.25]} />
        <meshBasicMaterial color="#3a3a4a" />
      </mesh>
      {/* right pylon */}
      <mesh position={[3, 0.8, 0]}>
        <boxGeometry args={[0.25, 1.6, 0.25]} />
        <meshBasicMaterial color="#3a3a4a" />
      </mesh>
      {/* cables (thin lines from pylons to deck) */}
      {[-3, 3].map((x, i) => (
        <group key={"cables-" + i}>
          <mesh position={[x + 0.8, 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[1.8, 0.015, 0.015]} />
            <meshBasicMaterial color="#2a2a3a" />
          </mesh>
          <mesh position={[x - 0.8, 0.4, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[1.8, 0.015, 0.015]} />
            <meshBasicMaterial color="#2a2a3a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ========= Float debris (driftwood / leaves on river) =========
function Driftwood({ position, scale = 1, delay = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.x = position[0] + Math.sin(t * 0.4) * 0.6;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.03;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 4]} />
        <meshBasicMaterial color="#7a5a3a" />
      </mesh>
    </group>
  );
}

// ========= Exported Enrichment Group (mount inside YichangDamDecorations) =========
const DamEnrichment = () => {
  return (
    <group>
      {/* === 5 TOWER CRANES on dam top (was 3, increased for visual scale) === */}
      <TowerCrane position={[-8, 0, -8]} scale={1.0} armRotation={0.6} color="#e89a1a" delay={0} />
      <TowerCrane position={[-3, 0, -8]} scale={1.2} armRotation={-0.3} color="#e89a1a" delay={1.0} />
      <TowerCrane position={[0, 0, -8]} scale={1.5} armRotation={1.4} color="#e89a1a" delay={2.0} />
      <TowerCrane position={[4, 0, -8]} scale={1.0} armRotation={-0.9} color="#e89a1a" delay={3.0} />
      <TowerCrane position={[8, 0, -8]} scale={1.1} armRotation={0.5} color="#e89a1a" delay={4.0} />

      {/* === 14 BIRDS gliding above dam and reservoir (was 6) === */}
      <Birds count={14} center={[0, 7, -14]} spread={8} />

      {/* === 16 PINE TREES on dam hillsides + reservoir shores (was 8) === */}
      <Trees positions={[[-9, -0.5, -10], [-7, -0.5, -12], [9, -0.5, -10], [7, -0.5, -12], [-11, -0.5, -14], [11, -0.5, -14]]} scale={0.9} />
      <Trees positions={[[-14, -0.5, -16], [14, -0.5, -16], [-16, -0.5, -22], [16, -0.5, -22], [-18, -0.5, -28], [18, -0.5, -28], [-12, -0.5, -32], [12, -0.5, -32]]} scale={1.1} color="#5a7a58" />

      {/* === 6 SAIL BOATS on reservoir (was 3, spread more) === */}
      <SailBoat position={[-4, -1.45, -25]} scale={1.0} color="#e89a1a" delay={0} />
      <SailBoat position={[5, -1.45, -28]} scale={0.8} color="#c41e1e" delay={2.0} />
      <SailBoat position={[-7, -1.45, -32]} scale={1.1} color="#f6efdf" delay={4.0} />
      <SailBoat position={[8, -1.45, -34]} scale={0.9} color="#5a8db0" delay={5.5} />
      <SailBoat position={[-10, -1.45, -38]} scale={1.2} color="#e89a1a" delay={6.5} />
      <SailBoat position={[3, -1.45, -42]} scale={0.7} color="#c41e1e" delay={7.5} />

      {/* === 4 DISTANT BRIDGES (was 2) including Xiling Yangtze Bridge anchors === */}
      <DistantBridge position={[-12, -1.4, -30]} scale={1.2} />
      <DistantBridge position={[12, -1.4, -32]} scale={1.0} />
      <DistantBridge position={[-18, -1.4, -42]} scale={1.5} />
      <DistantBridge position={[18, -1.4, -45]} scale={1.3} />

      {/* === 8 DRIFTWOOD on river (was 3) === */}
      <Driftwood position={[-3, -1.45, -14]} delay={0} />
      <Driftwood position={[3, -1.45, -16]} delay={1.5} />
      <Driftwood position={[0, -1.45, -18]} delay={3.0} />
      <Driftwood position={[-5, -1.45, -20]} delay={4.5} />
      <Driftwood position={[5, -1.45, -22]} delay={5.5} />
      <Driftwood position={[-2, -1.45, -24]} delay={6.5} />
      <Driftwood position={[2, -1.45, -26]} delay={7.5} />
      <Driftwood position={[-4, -1.45, -28]} delay={8.5} />
    </group>
  );
};

export default DamEnrichment;
