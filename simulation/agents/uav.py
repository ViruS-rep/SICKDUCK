class UAV:
    def __init__(self, position):
        self.position = position
        self.battery = 100

    def move_to(self, position, world):
        if world.is_valid_position(position):
            self.position = position
            self.battery -= 1
            return True

        return False

    def calculate_path(self, world, planner, start, target):
        return planner.find_path(
            world,
            start,
            target
        )