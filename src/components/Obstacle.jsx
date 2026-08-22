export default function Obstacle({
  position = [8, 1, 5],
  scale = [2, 2, 2],
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <boxGeometry />
      <meshStandardMaterial color="#555555" />
    </mesh>
  );
}