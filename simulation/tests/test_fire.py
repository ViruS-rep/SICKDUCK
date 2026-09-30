from simulation.world.state import WorldState


world = WorldState()

ugv_position = (5, 5)

print("Initial fires:", world.fire_zones)

print("Add fire at (6,5):",
      world.add_fire((6, 5), ugv_position))

print("Add fire at (7,5):",
      world.add_fire((7, 5), ugv_position))

print("Add fire at (8,5):",
      world.add_fire((8, 5), ugv_position))

print("Final fires:", world.fire_zones)