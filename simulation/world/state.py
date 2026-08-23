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
        self.fire_spread_interval = 2 #change the fire spreading tiime from here
        self.last_fire_spread_time = 0

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

    def spread_fire(self):
        new_fire_zones = set()
        for x, y in self.fire_zones:
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    neighbor = (x + dx, y + dy)
                    nx, ny = neighbor
                    if nx < 0 or nx >= self.height:
                        continue
                    if ny < 0 or ny >= self.width:
                        continue
                    if neighbor in self.obstacles:
                        continue
                    new_fire_zones.add(neighbor)
        self.fire_zones.update(new_fire_zones)


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

    
    def update(self, delta_time):
        self.time += delta_time
        if self.time - self.last_fire_spread_time >= self.fire_spread_interval:
            self.spread_fire()
            self.last_fire_spread_time = self.time
            return True
        return False