import { scanEnvironment } from "./sensors";

function distance2D(a, b) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dz * dz);
}

function isPositionBlocked(
  position,
  obstacles,
  safetyDistance = 1.5
) {
  for (const obstacle of obstacles) {
    const distance = distance2D(
      position,
      obstacle.position
    );

    const obstacleRadius =
      Math.max(
        obstacle.scale[0],
        obstacle.scale[2]
      ) / 2;

    if (
      distance <=
      obstacleRadius + safetyDistance
    ) {
      return true;
    }
  }

  return false;
}

function isHazardDetected(
  ugvPosition,
  observations,
  safetyRadius
) {
  for (const observation of observations) {
    if (observation.type !== "fire_detected") {
      continue;
    }

    const distance = distance2D(
      ugvPosition,
      observation.position
    );

    const hazardRadius =
      observation.radius ?? 0;

    if (
      distance <=
      safetyRadius + hazardRadius
    ) {
      return true;
    }
  }

  return false;
}

export function updateWorldState(
  state,
  deltaTime
) {
  // =====================================================
  // MISSION STATE
  // =====================================================

  let missionStatus =
    state.mission?.status ?? "SEARCHING";

  let missionHazardDetected =
    state.mission?.hazardDetected ?? false;

  let missionMessage =
    state.mission?.message ??
    "Searching for survivor...";

  // =====================================================
  // UAV SCOUTING
  // =====================================================

  const uav = state.uav;

  const currentPoint =
    uav.scoutPoints[uav.currentScoutPoint];

  const uavPosition = uav.position;

  const uavDx =
    currentPoint[0] -
    uavPosition[0];

  const uavDz =
    currentPoint[2] -
    uavPosition[2];

  const uavDistance = Math.sqrt(
    uavDx * uavDx +
    uavDz * uavDz
  );

  let newUAVPosition = uavPosition;

  let newScoutPoint =
    uav.currentScoutPoint;

  if (uavDistance > 0.2) {
    const directionX =
      uavDx / uavDistance;

    const directionZ =
      uavDz / uavDistance;

    const movement = Math.min(
      uav.speed * deltaTime,
      uavDistance
    );

    newUAVPosition = [
      uavPosition[0] +
        directionX * movement,

      uavPosition[1],

      uavPosition[2] +
        directionZ * movement,
    ];
  } else {
    newScoutPoint =
      (uav.currentScoutPoint + 1) %
      uav.scoutPoints.length;

    newUAVPosition = [
      currentPoint[0],
      currentPoint[1],
      currentPoint[2],
    ];
  }

  // =====================================================
  // UAV SENSOR SCAN
  // =====================================================

  const stateForScan = {
    ...state,

    uav: {
      ...uav,
      position: newUAVPosition,
    },
  };

  const observations =
    scanEnvironment(stateForScan);

  if (observations.length > 0) {
    console.log(
      "UAV observations:",
      observations
    );
  }

  // =====================================================
  // TARGET DETECTION
  // =====================================================

  const targetDetected =
    observations.some(
      (observation) =>
        observation.type ===
        "survivor_detected"
    );

  if (
    missionStatus === "SEARCHING" &&
    targetDetected
  ) {
    missionStatus =
      "TARGET_FOUND";

    missionMessage =
      "Survivor located by UAV.";

    console.log(
      "MISSION: Survivor detected."
    );
  }

  // =====================================================
  // UGV
  // =====================================================

  const ugv = state.ugv;

  const ugvPosition =
    ugv.position;

  const ugvDestination =
    ugv.destination;

  let newUGVPosition =
    ugvPosition;

  let newUGVStatus =
    ugv.status;

  // =====================================================
  // HAZARD DETECTION
  // =====================================================

  const hazardDetected =
    isHazardDetected(
      ugvPosition,
      observations,
      ugv.safetyRadius
    );

  missionHazardDetected =
    hazardDetected;

  // =====================================================
  // UGV DECISION
  // =====================================================

  if (hazardDetected) {
    // ---------------------------------------------
    // HAZARD DETECTED
    // ---------------------------------------------

    newUGVPosition =
      ugvPosition;

    newUGVStatus =
      "hazard_detected";

    missionStatus =
      "HAZARD_DETECTED";

    missionMessage =
      "Hazard detected. UGV stopped.";

    console.log(
      "UGV: Hazard detected. Stopping."
    );
  } else {
    // ---------------------------------------------
    // HAZARD CLEARED
    // ---------------------------------------------

    if (
      missionStatus ===
      "HAZARD_DETECTED"
    ) {
      missionStatus =
        "NAVIGATING";

      missionMessage =
        "Hazard cleared. Resuming navigation.";
    }

    // ---------------------------------------------
    // NORMAL NAVIGATION
    // ---------------------------------------------

    const ugvDx =
      ugvDestination[0] -
      ugvPosition[0];

    const ugvDz =
      ugvDestination[2] -
      ugvPosition[2];

    const ugvDistance = Math.sqrt(
      ugvDx * ugvDx +
      ugvDz * ugvDz
    );

    if (ugvDistance > 0.1) {
      const directionX =
        ugvDx / ugvDistance;

      const directionZ =
        ugvDz / ugvDistance;

      const movement = Math.min(
        ugv.speed * deltaTime,
        ugvDistance
      );

      const proposedPosition = [
        ugvPosition[0] +
          directionX * movement,

        ugvPosition[1],

        ugvPosition[2] +
          directionZ * movement,
      ];

      // -------------------------------------------
      // OBSTACLE CHECK
      // -------------------------------------------

      const blocked =
        isPositionBlocked(
          proposedPosition,
          state.obstacles
        );

      if (!blocked) {
        // Normal movement

        newUGVPosition =
          proposedPosition;

        newUGVStatus =
          "moving";

        if (
          missionStatus ===
          "TARGET_FOUND"
        ) {
          missionStatus =
            "NAVIGATING";

          missionMessage =
            "UGV navigating to survivor.";
        }
      } else {
        // -----------------------------------------
        // OBSTACLE DETECTED
        // -----------------------------------------

        const sideStep =
          movement * 2;

        // -----------------------------------------
        // TRY LEFT
        // -----------------------------------------

        const leftPosition = [
          ugvPosition[0] -
            directionZ * sideStep,

          ugvPosition[1],

          ugvPosition[2] +
            directionX * sideStep,
        ];

        const leftBlocked =
          isPositionBlocked(
            leftPosition,
            state.obstacles
          );

        // -----------------------------------------
        // TRY RIGHT
        // -----------------------------------------

        const rightPosition = [
          ugvPosition[0] +
            directionZ * sideStep,

          ugvPosition[1],

          ugvPosition[2] -
            directionX * sideStep,
        ];

        const rightBlocked =
          isPositionBlocked(
            rightPosition,
            state.obstacles
          );

        // -----------------------------------------
        // CHOOSE SIDE
        // -----------------------------------------

        if (!leftBlocked) {
          newUGVPosition =
            leftPosition;

          newUGVStatus =
            "avoiding_obstacle";

          missionMessage =
            "Obstacle detected. Rerouting.";

          console.log(
            "UGV: Avoiding obstacle on left."
          );
        } else if (!rightBlocked) {
          newUGVPosition =
            rightPosition;

          newUGVStatus =
            "avoiding_obstacle";

          missionMessage =
            "Obstacle detected. Rerouting.";

          console.log(
            "UGV: Avoiding obstacle on right."
          );
        } else {
          newUGVPosition =
            ugvPosition;

          newUGVStatus =
            "blocked";

          missionMessage =
            "Path blocked. UGV waiting.";

          console.log(
            "UGV: Path blocked."
          );
        }
      }
    } else {
      // ---------------------------------------------
      // DESTINATION REACHED
      // ---------------------------------------------

      newUGVPosition = [
        ugvDestination[0],
        ugvDestination[1],
        ugvDestination[2],
      ];

      newUGVStatus =
        "arrived";

      missionStatus =
        "RESCUED";

      missionHazardDetected =
        false;

      missionMessage =
        "Survivor reached. Mission complete.";

      console.log(
        "MISSION COMPLETE: Survivor reached."
      );
    }
  }

  // =====================================================
  // FIRE EXPANSION
  // =====================================================

  const newFireZones =
    state.fireZones.map((fire) => ({
      ...fire,

      radius:
        fire.radius +
        fire.spreadRate * deltaTime,
    }));

  // =====================================================
  // RETURN NEW WORLD STATE
  // =====================================================

  return {
    ...state,

    time:
      state.time + deltaTime,

    // ---------------------------------------------
    // MISSION
    // ---------------------------------------------

    mission: {
      ...state.mission,

      status:
        missionStatus,

      hazardDetected:
        missionHazardDetected,

      message:
        missionMessage,

      completed:
        missionStatus === "RESCUED",
    },

    // ---------------------------------------------
    // UGV
    // ---------------------------------------------

    ugv: {
      ...ugv,

      position:
        newUGVPosition,

      status:
        newUGVStatus,
    },

    // ---------------------------------------------
    // UAV
    // ---------------------------------------------

    uav: {
      ...uav,

      position:
        newUAVPosition,

      currentScoutPoint:
        newScoutPoint,

      status:
        "scouting",

      observations:
        observations,
    },

    // ---------------------------------------------
    // FIRE
    // ---------------------------------------------

    fireZones:
      newFireZones,
  };
}