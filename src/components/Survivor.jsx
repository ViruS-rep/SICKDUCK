export default function Survivor({ position = [15, 0.6, 10] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}