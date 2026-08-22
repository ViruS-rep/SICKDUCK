export const initialWorldState = {
  // =====================================================
  // SIMULATION
  // =====================================================

  time: 0,

  // =====================================================
  // MISSION
  // =====================================================

  mission: {
    status: "SEARCHING",

    targetId: "survivor-01",

    startTime: 0,

    completed: false,

    hazardDetected: false,

    message: "Searching for survivor...",
  },

  // =====================================================
  // UGV
  // =====================================================

  ugv: {
    id: "ugv-01",

    position: [0, 0.75, 0],

    destination: [15, 0.75, 10],

    battery: 100,

    speed: 2,

    safetyRadius: 4,

    status: "moving",
  },

  // =====================================================
  // UAV
  // =====================================================

  uav: {
    id: "uav-01",

    position: [5, 8, 5],

    battery: 100,

    altitude: 8,

    speed: 3,

    sensorRange: 8,

    status: "scouting",

    scoutPoints: [
      [5, 8, 5],
      [20, 8, 5],
      [20, 8, 20],
      [5, 8, 20],
      [5, 8, 5],
    ],

    currentScoutPoint: 0,

    observations: [],
  },

  // =====================================================
  // SURVIVOR
  // =====================================================

  survivor: {
    id: "survivor-01",

    position: [15, 0.6, 10],

    status: "waiting",
  },

  // =====================================================
  // OBSTACLES
  // =====================================================

  obstacles: [
    {
      id: "obstacle-01",

      position: [8, 1, 5],

      scale: [2, 2, 2],
    },

    {
      id: "obstacle-02",

      position: [-5, 1, 8],

      scale: [3, 2, 1.5],
    },
  ],

  // =====================================================
  // FIRE ZONES
  // =====================================================

  fireZones: [
    {
      id: "fire-01",

      position: [12, 0.1, -5],

      radius: 3,

      intensity: 0.7,

      spreadRate: 0.1,
    },
  ],
};