from simulation.world.state import WorldState


world = WorldState()

print(world.is_valid_position((3, 3)))
print(world.is_valid_position((3, 4)))
print(world.is_valid_position((-1, 0)))