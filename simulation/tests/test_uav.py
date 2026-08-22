from simulation.world.state import WorldState
from simulation.agents.uav import UAV


world = WorldState()

uav = UAV(world.uav_position)

print("UAV position:", uav.position)

print("Before scan:")
print("Known obstacles:", world.known_obstacles)
print("Known fire:", world.known_fire_zones)
print("Explored cells:", len(world.explored_cells))

uav.scan(world)

print("\nAfter scan:")
print("Known obstacles:", world.known_obstacles)
print("Known fire:", world.known_fire_zones)
print("Explored cells:", len(world.explored_cells))