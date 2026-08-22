class UGV:
    def __init__(self, position):
        self.position = position
        self.battery = 100
        self.path = []

    def move_to(self, position, world):
        if world.is_valid_position(position):
            self.position = position
            self.battery -= 1
            return True

        return False
    
    def move_next(self, world):
        if len(self.path) <= 1:
            return False

        next_position = self.path[1]

        if not self.move_to(next_position, world):
            return False

        self.path = self.path[1:]

        return True
    
    def set_path(self, path):
        self.path = path

    def follow_path(self, world):
        for position in self.path[1:]:
            if not self.move_to(position, world):
                return False

        return True