from simulation.world.state import WorldState
from simulation.agents.ugv import UGV
from simulation.planning.planner import Planner
from simulation.agents.uav import UAV



world = WorldState()

uav = UAV(world.uav_position)
ugv = UGV(world.ugv_position)

planner = Planner()


# -------------------------
# Initial path
# -------------------------

path = uav.calculate_path(
    world,
    planner,
    ugv.position,
    world.target_position
)

ugv.set_path(path)

print("Initial path:")
print(path)

print("\nUGV position:", ugv.position)


# -------------------------
# UGV movement
# -------------------------

while ugv.position != world.target_position:

    success = ugv.move_next(world)

    if not success:
        print("UGV could not move")
        break

    print("UGV moved to:", ugv.position)


    # -------------------------
    # User adds fire
    # -------------------------

    if ugv.position == (0, 5):

        fire_position = (0, 8)

        success = world.add_fire(
            fire_position,
            ugv.position
        )

        print("\nUser tried to add fire at:", fire_position)
        print("Fire added:", success)

        print("Current fire zones:")
        print(world.fire_zones)


        # -------------------------
        # Recalculate path
        # -------------------------

        if success:

            new_path = uav.calculate_path(
                world,
                planner,
                ugv.position,
                world.target_position
            )

            print("\nNew path:")
            print(new_path)

            ugv.set_path(new_path)


print("\nFinal position:", ugv.position)
print("Battery:", ugv.battery)