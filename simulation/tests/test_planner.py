from simulation.world.state import WorldState
from simulation.planning.planner import Planner


world = WorldState()
planner = Planner()

path = planner.find_path(
    world,
    world.ugv_position,
    world.target_position
)

print("Path:")
print(path)

print("Path length:", len(path))
for position in path:
    print(position, world.is_valid_position(position))