from simulation.world.state import WorldState


world = WorldState()

print("Initial fire:")
print(world.fire_zones)

world.spread_fire()

print("\nAfter first spread:")
print(world.fire_zones)

world.spread_fire()

print("\nAfter second spread:")
print(world.fire_zones)