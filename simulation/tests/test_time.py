from simulation.world.state import WorldState


world = WorldState()

print("Initial time:", world.time)
print("Initial fire:", world.fire_zones)

for i in range(12):

    fire_changed = world.update(1)

    print(
        "Time:",
        world.time,
        "| Fire spread:",
        fire_changed,
        "| Fire cells:",
        len(world.fire_zones)
    )