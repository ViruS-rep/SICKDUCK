function distance2D(a, b) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dz * dz);
}

export function scanEnvironment(state) {
  const uavPosition = state.uav.position;
  const range = state.uav.sensorRange;

  const observations = [];

  // Detect survivor
  const survivorDistance = distance2D(
    uavPosition,
    state.survivor.position
  );

  if (survivorDistance <= range) {
    observations.push({
      type: "survivor_detected",
      id: state.survivor.id,
      position: state.survivor.position,
      distance: survivorDistance,
    });
  }

  // Detect obstacles
  state.obstacles.forEach((obstacle) => {
    const distance = distance2D(
      uavPosition,
      obstacle.position
    );

    if (distance <= range) {
      observations.push({
        type: "obstacle_detected",
        id: obstacle.id,
        position: obstacle.position,
        distance,
      });
    }
  });

  // Detect fire
  state.fireZones.forEach((fire) => {
    const distance = distance2D(
      uavPosition,
      fire.position
    );

    if (distance <= range) {
      observations.push({
        type: "fire_detected",
        id: fire.id,
        position: fire.position,
        radius: fire.radius,
        distance,
      });
    }
  });

  return observations;
}  