class WorldState:
    def __init__(self):
        self.time = 0

        self.width = 20
        self.height = 20

        self.ugv_position = (0, 0)
        self.uav_position = (5, 5)
        self.target_position = (9, 9)

        self.obstacles = {
            (2, 2),
            (2, 3),
            (2, 4),
            (3, 4),
            (4, 4),
            (5, 4),
        }

        self.fire_zones = {
            (12, 12)
        }

    def is_valid_position(self, position):
        x, y = position

        if x < 0 or x >= self.height:
            return False

        if y < 0 or y >= self.width:
            return False

        if position in self.obstacles:
            return False

        if position in self.fire_zones:
            return False

        return True
    def add_fire(self, position, ugv_position):
        x1, y1 = position
        x2, y2 = ugv_position

        distance = abs(x1 - x2) + abs(y1 - y2)

        if distance <= 2:
            return False

        if not (0 <= x1 < self.height and 0 <= y1 < self.width):
            return False

        if position in self.obstacles:
            return False

        self.fire_zones.add(position)

        return True