import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

import MissionHUD from "./MissionHUD";

import UGV from "./UGV";
import UAV from "./UAV";
import Survivor from "./Survivor";
import Obstacle from "./Obstacle";
import FireZone from "./FireZone";

import { initialWorldState } from "../simulation/worldState";
import { updateWorldState } from "../simulation/simulation";

function Ground({ onGroundClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(event) => {
        event.stopPropagation();

        const point = event.point;

        onGroundClick([
          point.x,
          1,
          point.z,
        ]);
      }}
    >
      <planeGeometry args={[100, 100]} />

      <meshStandardMaterial
        color="#303030"
      />
    </mesh>
  );
}

export default function World() {
  const [world, setWorld] =
    useState(initialWorldState);

  const [paused, setPaused] =
    useState(false);

  // =====================================================
  // SIMULATION LOOP
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) {
        return;
      }

      setWorld((currentWorld) =>
        updateWorldState(
          currentWorld,
          0.1
        )
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [paused]);

  // =====================================================
  // ADD OBSTACLE
  // =====================================================

  const addObstacle = (position) => {
    setWorld((currentWorld) => ({
      ...currentWorld,

      obstacles: [
        ...currentWorld.obstacles,

        {
          id: `obstacle-${Date.now()}`,

          position: position,

          scale: [2, 2, 2],
        },
      ],
    }));
  };

  // =====================================================
  // PAUSE / RESUME
  // =====================================================

  const togglePause = () => {
    setPaused(
      (currentPaused) =>
        !currentPaused
    );
  };

  // =====================================================
  // RESET WORLD
  // =====================================================

  const resetWorld = () => {
    setWorld({
      ...initialWorldState,

      mission: {
        ...initialWorldState.mission,
      },

      ugv: {
        ...initialWorldState.ugv,

        position: [
          ...initialWorldState.ugv.position,
        ],
      },

      uav: {
        ...initialWorldState.uav,

        position: [
          ...initialWorldState.uav.position,
        ],

        observations: [],
      },

      survivor: {
        ...initialWorldState.survivor,

        position: [
          ...initialWorldState.survivor.position,
        ],
      },

      obstacles:
        initialWorldState.obstacles.map(
          (obstacle) => ({
            ...obstacle,

            position: [
              ...obstacle.position,
            ],

            scale: [
              ...obstacle.scale,
            ],
          })
        ),

      fireZones:
        initialWorldState.fireZones.map(
          (fire) => ({
            ...fire,

            position: [
              ...fire.position,
            ],
          })
        ),
    });

    setPaused(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =================================================
          3D WORLD
          ================================================= */}

      <Canvas
        shadows
        camera={{
          position: [20, 20, 20],
          fov: 50,
        }}
      >
        {/* Lighting */}

        <ambientLight
          intensity={0.5}
        />

        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
        />

        {/* Ground */}

        <Ground
          onGroundClick={addObstacle}
        />

        {/* Grid */}

        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          sectionSize={5}
          sectionThickness={1}
          fadeDistance={100}
          fadeStrength={1}
        />

        {/* UGV */}

        <UGV
          position={
            world.ugv.position
          }
        />

        {/* UAV */}

        <UAV
          position={
            world.uav.position
          }
        />

        {/* Survivor */}

        <Survivor
          position={
            world.survivor.position
          }
        />

        {/* Obstacles */}

        {world.obstacles.map(
          (obstacle) => (
            <Obstacle
              key={obstacle.id}
              position={
                obstacle.position
              }
              scale={
                obstacle.scale
              }
            />
          )
        )}

        {/* Fire */}

        {world.fireZones.map(
          (fire) => (
            <FireZone
              key={fire.id}
              position={
                fire.position
              }
              radius={
                fire.radius
              }
            />
          )
        )}

        {/* Camera */}

        <OrbitControls />
      </Canvas>

      {/* =================================================
          MISSION CONTROL HUD
          ================================================= */}

      <MissionHUD
        world={world}
        paused={paused}
        onPause={togglePause}
        onReset={resetWorld}
      />
    </>
  );
}