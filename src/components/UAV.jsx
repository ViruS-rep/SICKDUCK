import { useRef } from "react";

export default function UAV({ position = [0, 8, 0] }) {
  const uavRef = useRef();

  return (
    <group ref={uavRef} position={position}>
      {/* Central body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.35, 1.2]} />
        <meshStandardMaterial color="#303030" />
      </mesh>

      {/* Camera/sensor */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Arms */}
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Rotors */}
      {[
        [1.1, 0.15, 1.1],
        [-1.1, 0.15, 1.1],
        [1.1, 0.15, -1.1],
        [-1.1, 0.15, -1.1],
      ].map((rotorPosition, index) => (
        <mesh key={index} position={rotorPosition}>
          <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
    </group>
  );
}