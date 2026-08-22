import heapq


class Planner:

    def __init__(self):
        pass

    
    
    def heuristic(self, current, target):
        x1, y1 = current
        x2, y2 = target

        return abs(x1 - x2) + abs(y1 - y2)

    def get_neighbors(self, position):
        x, y = position

        return [
            (x + 1, y),
            (x - 1, y),
            (x, y + 1),
            (x, y - 1)
        ]

    def find_path(self, world, start, target):
        open_set = []

        heapq.heappush(open_set, (0, start))

        came_from = {}
        g_score = {start: 0}

        while open_set:

            _, current = heapq.heappop(open_set)

            if current == target:
                return self.reconstruct_path(came_from, current)

            for neighbor in self.get_neighbors(current):

                if not world.is_valid_position(neighbor):
                    continue

                new_cost = g_score[current] + 1

                if neighbor not in g_score or new_cost < g_score[neighbor]:

                    g_score[neighbor] = new_cost

                    f_score = (
                        new_cost +
                        self.heuristic(neighbor, target)
                    )

                    heapq.heappush(
                        open_set,
                        (f_score, neighbor)
                    )

                    came_from[neighbor] = current

        return []

    def reconstruct_path(self, came_from, current):
        path = [current]

        while current in came_from:
            current = came_from[current]
            path.append(current)

        path.reverse()

        return path