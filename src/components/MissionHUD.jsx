import "./MissionHUD.css";

function StatusRow({ label, value }) {
  return (
    <div className="status-row">
      <span className="status-label">
        {label}
      </span>

      <span className="status-value">
        {value}
      </span>
    </div>
  );
}

function formatStatus(status) {
  switch (status) {
    case "SEARCHING":
      return "SEARCHING";

    case "TARGET_FOUND":
      return "TARGET FOUND";

    case "NAVIGATING":
      return "NAVIGATING";

    case "HAZARD_DETECTED":
      return "HAZARD DETECTED";

    case "RESCUED":
      return "RESCUED";

    default:
      return status;
  }
}

export default function MissionHUD({
  world,
  paused,
  onPause,
  onReset,
}) {
  const mission = world.mission;
  const ugv = world.ugv;
  const uav = world.uav;

  const hazardDetected =
    mission.hazardDetected ||
    ugv.status === "hazard_detected";

  return (
    <div className="mission-hud">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="hud-header">
        <div className="hud-title">
          DREAMFUTURES
        </div>

        <div className="hud-subtitle">
          MISSION CONTROL
        </div>
      </div>

      {/* =================================================
          MISSION
          ================================================= */}

      <div className="hud-section">
        <div className="section-title">
          MISSION
        </div>

        <StatusRow
          label="STATUS"
          value={formatStatus(
            mission.status
          )}
        />

        <StatusRow
          label="TARGET"
          value={mission.targetId}
        />

        <div className="mission-message">
          {mission.message}
        </div>
      </div>

      {/* =================================================
          UGV
          ================================================= */}

      <div className="hud-section">
        <div className="section-title">
          UGV
        </div>

        <StatusRow
          label="STATUS"
          value={ugv.status}
        />

        <StatusRow
          label="BATTERY"
          value={`${ugv.battery}%`}
        />

        <StatusRow
          label="SPEED"
          value={`${ugv.speed} m/s`}
        />
      </div>

      {/* =================================================
          UAV
          ================================================= */}

      <div className="hud-section">
        <div className="section-title">
          UAV
        </div>

        <StatusRow
          label="STATUS"
          value={uav.status}
        />

        <StatusRow
          label="BATTERY"
          value={`${uav.battery}%`}
        />

        <StatusRow
          label="OBSERVATIONS"
          value={uav.observations.length}
        />
      </div>

      {/* =================================================
          HAZARD
          ================================================= */}

      <div className="hud-section">
        <div className="section-title">
          HAZARD
        </div>

        <div
          className={
            hazardDetected
              ? "hazard danger"
              : "hazard safe"
          }
        >
          {hazardDetected
            ? "⚠ HAZARD DETECTED"
            : "✓ NONE"}
        </div>
      </div>

      {/* =================================================
          MISSION COMPLETE
          ================================================= */}

      {mission.completed && (
        <div className="mission-complete">
          ✓ MISSION COMPLETE
        </div>
      )}

      {/* =================================================
          SIMULATION CONTROLS
          ================================================= */}

      <div className="hud-controls">

        <button
          className="hud-button"
          onClick={onPause}
        >
          {paused ? "RESUME" : "PAUSE"}
        </button>

        <button
          className="hud-button reset-button"
          onClick={onReset}
        >
          RESET
        </button>

      </div>

    </div>
  );
}