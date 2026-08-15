import pygame
import math
import random
import sys

# Initialize Pygame
pygame.init()
pygame.mixer.init()

# Screen Setup
WIDTH, HEIGHT = 1000, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("🌌 SPACE HYPER-RACER 3D (Desktop Native)")
clock = pygame.time.Clock()

# Color Palette & Neon Glows
DARK_SPACE = (8, 10, 24)
CYAN_GLOW = (0, 240, 255)
PINK_GLOW = (255, 0, 170)
PURPLE_TRACK = (130, 0, 255)
GOLD_YELLOW = (255, 215, 0)
WHITE = (255, 255, 255)

# Audio Synthesis
def generate_sound(freq, duration=0.1, type_s='sine'):
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    buf = bytearray()
    for i in range(n_samples):
        t = float(i) / sample_rate
        val = math.sin(2.0 * math.pi * freq * t)
        if type_s == 'square':
            val = 1.0 if val > 0 else -1.0
        val = int(val * 32767 * 0.3)
        buf.extend(val.to_bytes(2, byteorder='little', signed=True))
    return pygame.mixer.Sound(buffer=bytes(buf))

try:
    coin_sound = generate_sound(880, 0.12, 'sine')
    boost_sound = generate_sound(440, 0.25, 'square')
    crash_sound = generate_sound(120, 0.35, 'square')
except Exception:
    coin_sound = boost_sound = crash_sound = None

# Perspective 3D Projection Helpers
VANISHING_X = WIDTH // 2
VANISHING_Y = 220
FOV = 350.0

def project_3d(x3d, y3d, z3d):
    """
    Project 3D world space coordinate (x3d, y3d, z3d) to 2D screen coordinate (sx, sy, scale)
    z3d is depth from player (z3d > 0 is ahead of player into screen).
    """
    if z3d <= 0.05:
        z3d = 0.05
    scale = FOV / z3d
    sx = VANISHING_X + x3d * scale
    sy = VANISHING_Y + y3d * scale
    return sx, sy, scale

class Particle3D:
    def __init__(self, x, y, z, color, vx=None, vy=None, vz=None):
        self.x = x
        self.y = y
        self.z = z
        self.vx = vx if vx is not None else random.uniform(-1.5, 1.5)
        self.vy = vy if vy is not None else random.uniform(-1.5, 1.5)
        self.vz = vz if vz is not None else random.uniform(-0.5, 0.5)
        self.color = color
        self.life = 1.0
        self.decay = random.uniform(0.02, 0.05)

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.z += self.vz
        self.life -= self.decay

    def draw(self, surface):
        if self.life <= 0 or self.z <= 0.1:
            return
        sx, sy, scale = project_3d(self.x, self.y, self.z)
        radius = max(1, int(4 * scale * self.life))
        alpha = int(255 * max(0, self.life))
        s = pygame.Surface((radius * 2 + 2, radius * 2 + 2), pygame.SRCALPHA)
        pygame.draw.circle(s, (*self.color[:3], alpha), (radius + 1, radius + 1), radius)
        surface.blit(s, (sx - radius - 1, sy - radius - 1))

class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        # 3D Player State (X lane position: -1.8 to 1.8)
        self.player_x3d = 0.0
        self.player_target_x = 0.0
        self.speed_z = 25.0
        self.camera_tilt = 0.0
        self.score = 0
        self.coins = 0
        self.lives = 3
        self.boost_timer = 0.0
        self.invincible_timer = 0.0
        self.game_over = False
        self.z_distance = 0.0

        # Background Starfield (3D Warp Points)
        self.stars = []
        for _ in range(250):
            self.stars.append([
                random.uniform(-12, 12),
                random.uniform(-8, 8),
                random.uniform(1.0, 30.0),
                random.choice([CYAN_GLOW, PINK_GLOW, WHITE, GOLD_YELLOW])
            ])

        # Active Objects
        self.obstacles = []
        self.coin_items = []
        self.particles = []

    def spawn_entities(self):
        # Spawn Obstacles ahead at z = 35.0
        if random.random() < 0.06:
            lane_x = random.choice([-1.5, -0.75, 0.0, 0.75, 1.5])
            obs_type = random.choice(['meteor', 'laser_wall', 'cube'])
            self.obstacles.append({
                'x': lane_x,
                'y': 0.8, # On track surface height
                'z': 35.0,
                'type': obs_type,
                'rot': 0.0,
                'rot_speed': random.uniform(-3, 3)
            })

        # Spawn Coins & Nitro Boosts
        if random.random() < 0.05:
            lane_x = random.choice([-1.4, -0.7, 0.0, 0.7, 1.4])
            item_type = 'boost' if random.random() < 0.2 else 'coin'
            self.coin_items.append({
                'x': lane_x,
                'y': 0.6,
                'z': 35.0,
                'type': item_type,
                'rot': 0.0
            })

    def run(self):
        running = True
        font_large = pygame.font.SysFont("Fredoka", 52, bold=True)
        font_small = pygame.font.SysFont("Plus Jakarta Sans", 24, bold=True)

        while running:
            dt = clock.tick(60) / 1000.0

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q or event.key == pygame.K_ESCAPE:
                        running = False
                    if self.game_over and (event.key == pygame.K_SPACE or event.key == pygame.K_RETURN):
                        self.reset()

            if not self.game_over:
                # Handle Input
                keys = pygame.key.get_pressed()
                steer = 0.0
                if keys[pygame.K_LEFT] or keys[pygame.K_a]:
                    steer -= 1.0
                if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
                    steer += 1.0

                # Smooth Player Movement & Bank/Tilt Angle
                self.player_target_x = max(-1.85, min(1.85, self.player_target_x + steer * 3.2 * dt))
                self.player_x3d += (self.player_target_x - self.player_x3d) * 12.0 * dt
                self.camera_tilt += (steer * 0.15 - self.camera_tilt) * 10.0 * dt

                # Boost Logic
                if self.boost_timer > 0:
                    self.boost_timer -= dt
                    curr_speed = self.speed_z * 2.2
                else:
                    curr_speed = self.speed_z

                if self.invincible_timer > 0:
                    self.invincible_timer -= dt

                self.z_distance += curr_speed * dt
                self.score += int(curr_speed * dt * 10)

                # Spawn Entities
                self.spawn_entities()

                # Thruster Trail Particles behind player (z ~ 1.2)
                for _ in range(2 if self.boost_timer <= 0 else 5):
                    p_color = CYAN_GLOW if self.boost_timer > 0 else (255, 140, 0)
                    self.particles.append(Particle3D(
                        self.player_x3d + random.uniform(-0.1, 0.1),
                        1.2,
                        1.1,
                        p_color,
                        vx=random.uniform(-0.3, 0.3),
                        vy=random.uniform(0.1, 0.4),
                        vz=-random.uniform(2.0, 4.0)
                    ))

                # Update 3D Stars
                for star in self.stars:
                    star[2] -= curr_speed * dt * 0.8
                    if star[2] <= 0.5:
                        star[2] = 30.0
                        star[0] = random.uniform(-12, 12)
                        star[1] = random.uniform(-8, 8)

                # Update Obstacles
                for obs in self.obstacles[:]:
                    obs['z'] -= curr_speed * dt
                    obs['rot'] += obs['rot_speed'] * dt

                    # Collision Check with Player (Player at z=1.2, y=1.0)
                    if 0.8 <= obs['z'] <= 1.6 and abs(obs['x'] - self.player_x3d) < 0.45:
                        if self.invincible_timer <= 0:
                            self.lives -= 1
                            self.invincible_timer = 1.5
                            if crash_sound: crash_sound.play()
                            for _ in range(30):
                                self.particles.append(Particle3D(
                                    obs['x'], obs['y'], obs['z'], PINK_GLOW,
                                    vx=random.uniform(-3, 3), vy=random.uniform(-3, 3), vz=random.uniform(-2, 4)
                                ))
                            self.obstacles.remove(obs)
                            if self.lives <= 0:
                                self.game_over = True
                            continue

                    if obs['z'] < 0.2:
                        self.obstacles.remove(obs)

                # Update Items
                for item in self.coin_items[:]:
                    item['z'] -= curr_speed * dt
                    item['rot'] += 4.0 * dt

                    # Collision Check
                    if 0.8 <= item['z'] <= 1.6 and abs(item['x'] - self.player_x3d) < 0.45:
                        if item['type'] == 'coin':
                            self.coins += 1
                            self.score += 250
                            if coin_sound: coin_sound.play()
                            for _ in range(12):
                                self.particles.append(Particle3D(item['x'], item['y'], item['z'], GOLD_YELLOW))
                        else: # Boost
                            self.boost_timer = 4.0
                            if boost_sound: boost_sound.play()
                            for _ in range(20):
                                self.particles.append(Particle3D(item['x'], item['y'], item['z'], CYAN_GLOW))
                        self.coin_items.remove(item)
                        continue

                    if item['z'] < 0.2:
                        self.coin_items.remove(item)

                # Update Particles
                for p in self.particles[:]:
                    p.update()
                    if p.life <= 0:
                        self.particles.remove(p)

            # ================= RENDERING =================
            screen.fill(DARK_SPACE)

            # 1. 3D Warp Starfield / Nebulae
            for star in self.stars:
                sx, sy, scale = project_3d(star[0], star[1], star[2])
                if 0 <= sx < WIDTH and 0 <= sy < HEIGHT:
                    size = max(1, int(3.5 * scale))
                    # Streak line visual when speeding up
                    streak = int((20.0 / star[2]) * (2.0 if self.boost_timer > 0 else 1.0))
                    pygame.draw.line(screen, star[3], (sx, sy), (sx, sy - streak), size)

            # 2. 3D Futuristic Grid Track with Perspective Depth
            # Draw horizon line
            pygame.draw.line(screen, PURPLE_TRACK, (0, VANISHING_Y), (WIDTH, VANISHING_Y), 2)

            # Grid longitudinal lines (tunnel perspective lines)
            num_lanes = 6
            for i in range(-num_lanes, num_lanes + 1):
                lane_x3d = i * 0.4
                sx_near, sy_near, _ = project_3d(lane_x3d, 1.0, 0.5)
                sx_far, sy_far, _ = project_3d(lane_x3d, 1.0, 35.0)
                glow_col = CYAN_GLOW if i in [-4, 4] else PURPLE_TRACK
                thickness = 3 if i in [-4, 4] else 1
                pygame.draw.line(screen, glow_col, (sx_near, sy_near), (sx_far, sy_far), thickness)

            # Moving Horizontal perspective grid bars
            z_offset = (self.z_distance % 2.0)
            z_val = 0.5 + z_offset
            while z_val < 35.0:
                sx_l, sy_l, scale = project_3d(-2.0, 1.0, z_val)
                sx_r, sy_r, _ = project_3d(2.0, 1.0, z_val)
                alpha = max(0, min(255, int(255 * (1.0 - z_val / 35.0))))
                line_surf = pygame.Surface((WIDTH, 4), pygame.SRCALPHA)
                col = (*CYAN_GLOW[:3], alpha // 2) if self.boost_timer > 0 else (*PURPLE_TRACK[:3], alpha // 3)
                pygame.draw.line(screen, col, (max(0, sx_l), 2), (min(WIDTH, sx_r), 2), max(1, int(scale * 1.5)))
                screen.blit(line_surf, (0, sy_l - 2))
                z_val += 1.8

            # Combine active 3D entities for back-to-front depth sorting (Painter's Algorithm)
            render_queue = []

            for obs in self.obstacles:
                render_queue.append(('obstacle', obs['z'], obs))

            for item in self.coin_items:
                render_queue.append(('item', item['z'], item))

            # Add Player to render queue (Player z fixed at 1.2)
            if not self.game_over:
                render_queue.append(('player', 1.2, None))

            # Sort by Z depth descending (farthest rendered first)
            render_queue.sort(key=lambda item: item[1], reverse=True)

            # Render 3D Entities
            for entity_type, z, data in render_queue:
                if entity_type == 'obstacle':
                    obs = data
                    sx, sy, scale = project_3d(obs['x'], obs['y'], obs['z'])
                    size = int(35 * scale)

                    if obs['type'] == 'meteor':
                        # Wireframe Glowing Meteor
                        pygame.draw.circle(screen, (255, 60, 60), (int(sx), int(sy)), size)
                        pygame.draw.circle(screen, GOLD_YELLOW, (int(sx), int(sy)), size, max(2, int(3 * scale)))
                        pygame.draw.circle(screen, WHITE, (int(sx - size*0.3), int(sy - size*0.3)), max(1, int(size * 0.2)))
                    elif obs['type'] == 'laser_wall':
                        # Neon Laser Barrier
                        w = int(70 * scale)
                        h = int(25 * scale)
                        rect = pygame.Rect(sx - w//2, sy - h//2, w, h)
                        pygame.draw.rect(screen, PINK_GLOW, rect, border_radius=max(2, int(4*scale)))
                        pygame.draw.rect(screen, WHITE, rect, max(1, int(2*scale)), border_radius=max(2, int(4*scale)))
                    else: # 3D Glowing Cube Wireframe
                        w = int(45 * scale)
                        rect = pygame.Rect(sx - w//2, sy - w//2, w, w)
                        pygame.draw.rect(screen, (120, 0, 255), rect, border_radius=4)
                        pygame.draw.rect(screen, CYAN_GLOW, rect, max(2, int(3*scale)), border_radius=4)

                elif entity_type == 'item':
                    item = data
                    sx, sy, scale = project_3d(item['x'], item['y'], item['z'])
                    if item['type'] == 'coin':
                        r = max(2, int(18 * scale))
                        # Glowing spinning gold coin
                        pygame.draw.circle(screen, GOLD_YELLOW, (int(sx), int(sy)), r)
                        pygame.draw.circle(screen, WHITE, (int(sx), int(sy)), r, max(1, int(2 * scale)))
                    else: # Boost Nitro Icon
                        r = max(3, int(22 * scale))
                        pts = [
                            (sx, sy - r),
                            (sx - r * 0.8, sy + r * 0.8),
                            (sx + r * 0.8, sy + r * 0.8)
                        ]
                        pygame.draw.polygon(screen, CYAN_GLOW, pts)
                        pygame.draw.polygon(screen, WHITE, pts, max(1, int(2 * scale)))

                elif entity_type == 'player':
                    # Draw 3D Player Spaceship with Roll/Bank Angle & Dynamic Shader Glow
                    sx, sy, scale = project_3d(self.player_x3d, 1.0, 1.2)
                    bank = self.camera_tilt * 40.0 # Degrees roll

                    # Base player polygon relative coordinates
                    base_pts = [
                        (0, -32),      # Nose
                        (-35, 20),     # Left wing tip
                        (-12, 10),     # Left inner wing
                        (0, 16),       # Center tail
                        (12, 10),      # Right inner wing
                        (35, 20)       # Right wing tip
                    ]

                    # Rotate points for 3D banking turn effect
                    cos_b = math.cos(math.radians(bank))
                    sin_b = math.sin(math.radians(bank))
                    rot_pts = []
                    for px, py in base_pts:
                        rx = px * cos_b - py * sin_b
                        ry = px * sin_b + py * cos_b
                        rot_pts.append((sx + rx, sy + ry))

                    # Thruster Exhaust Flames
                    flame_color = CYAN_GLOW if self.boost_timer > 0 else (255, 120, 0)
                    flame_len = random.randint(30, 50) if self.boost_timer > 0 else random.randint(18, 30)
                    flame_pts = [
                        (sx - 10 * cos_b, sy - 10 * sin_b + 12),
                        (sx + 10 * cos_b, sy + 10 * sin_b + 12),
                        (sx + flame_len * sin_b, sy + flame_len * cos_b + 15)
                    ]
                    pygame.draw.polygon(screen, flame_color, flame_pts)

                    # Draw Ship Hull
                    ship_col = CYAN_GLOW if (self.invincible_timer % 0.2 < 0.1) else (100, 200, 255)
                    if self.boost_timer > 0:
                        ship_col = (100, 255, 180)

                    pygame.draw.polygon(screen, ship_col, rot_pts)
                    pygame.draw.polygon(screen, WHITE, rot_pts, 2)

                    # Cockpit Glass
                    pygame.draw.circle(screen, WHITE, (int(sx), int(sy - 4)), 7)

            # Draw 3D Particles
            for p in self.particles:
                p.draw(screen)

            # ================= HUD & OVERLAY =================
            score_text = font_small.render(f"SCORE: {self.score}", True, WHITE)
            coins_text = font_small.render(f"GOLD: {self.coins}", True, GOLD_YELLOW)
            lives_text = font_small.render(f"SHIELD: {'⚡ ' * self.lives}", True, PINK_GLOW)

            screen.blit(score_text, (25, 20))
            screen.blit(coins_text, (230, 20))
            screen.blit(lives_text, (410, 20))

            if self.boost_timer > 0:
                boost_text = font_small.render(f"🚀 HYPER BOOST ACTIVE ({self.boost_timer:.1f}s)", True, CYAN_GLOW)
                screen.blit(boost_text, (WIDTH - 380, 20))

            if self.game_over:
                over_surf = font_large.render("HYPERDRIVE CRASHED!", True, PINK_GLOW)
                restart_surf = font_small.render("Press SPACE or ENTER to Respawn | [Q] to Exit", True, WHITE)
                screen.blit(over_surf, (WIDTH // 2 - over_surf.get_width() // 2, HEIGHT // 2 - 50))
                screen.blit(restart_surf, (WIDTH // 2 - restart_surf.get_width() // 2, HEIGHT // 2 + 20))

            pygame.display.flip()

        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    Game().run()
