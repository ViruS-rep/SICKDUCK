from simulation.world.state import WorldState
from simulation.agents.ugv import UGV
from simulation.planning.planner import Planner


world = WorldState()

ugv = UGV(world.ugv_position)

planner = Planner()

path = planner.find_path(
    world,
    ugv.position,
    world.target_position
)

print("Planned path:")
print(path)

ugv.set_path(path)

print("UGV before movement:", ugv.position)

success = ugv.follow_path(world)

print("Movement successful:", success)
print("UGV after movement:", ugv.position)
print("Battery:", ugv.battery)