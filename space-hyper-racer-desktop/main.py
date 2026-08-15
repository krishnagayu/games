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
clock = pygame.optimizations = pygame.time.Clock()

# Color Palette
DARK_SPACE = (10, 15, 30)
NEON_BLUE = (0, 240, 255)
NEON_PINK = (255, 0, 170)
NEON_GREEN = (50, 255, 126)
GOLD_YELLOW = (255, 220, 0)
WHITE = (255, 255, 255)

# Synthesize Sound Effects
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

class Particle:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.vx = random.uniform(-3, 3)
        self.vy = random.uniform(-3, 3)
        self.color = color
        self.life = 1.0

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.life -= 0.04

    def draw(self, surface):
        if self.life > 0:
            alpha_color = (*self.color[:3], int(255 * self.life))
            s = pygame.Surface((6, 6), pygame.SRCALPHA)
            pygame.draw.circle(s, alpha_color, (3, 3), int(3 * self.life))
            surface.blit(s, (self.x - 3, self.y - 3))

class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        self.player_x = WIDTH / 2
        self.player_y = HEIGHT - 120
        self.speed = 12.0
        self.score = 0
        self.coins = 0
        self.lives = 3
        self.boost_timer = 0
        self.game_over = False
        
        # Starfield
        self.stars = [[random.randint(0, WIDTH), random.randint(0, HEIGHT), random.uniform(1, 4)] for _ in range(120)]
        
        # Track obstacles & items
        self.obstacles = []
        self.coin_items = []
        self.particles = []

    def run(self):
        running = True
        font_large = pygame.font.SysFont("Fredoka", 48, bold=True)
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
                # Keyboard Handling
                keys = pygame.key.get_pressed()
                if keys[pygame.K_LEFT] or keys[pygame.K_a]:
                    self.player_x -= 10
                if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
                    self.player_x += 10
                if keys[pygame.K_UP] or keys[pygame.K_w]:
                    self.player_y = max(150, self.player_y - 6)
                if keys[pygame.K_DOWN] or keys[pygame.K_s]:
                    self.player_y = min(HEIGHT - 80, self.player_y + 6)

                # Keep in screen bounds
                self.player_x = max(100, min(WIDTH - 100, self.player_x))

                # Update Starfield
                for star in self.stars:
                    star[1] += star[2] * (2.0 if self.boost_timer > 0 else 1.0)
                    if star[1] > HEIGHT:
                        star[1] = 0
                        star[0] = random.randint(0, WIDTH)

                # Update Boost Timer
                if self.boost_timer > 0:
                    self.boost_timer -= dt
                    self.speed = 22.0
                else:
                    self.speed = 12.0

                self.score += int(self.speed * 0.1)

                # Spawn Obstacles
                if random.random() < 0.04:
                    self.obstacles.append({
                        'x': random.randint(120, WIDTH - 120),
                        'y': -40,
                        'speed': random.uniform(6, 10),
                        'size': random.randint(22, 35),
                        'type': random.choice(['meteor', 'barrier'])
                    })

                # Spawn Coins / Boosts
                if random.random() < 0.03:
                    self.coin_items.append({
                        'x': random.randint(120, WIDTH - 120),
                        'y': -30,
                        'speed': 7.0,
                        'type': 'boost' if random.random() < 0.25 else 'coin'
                    })

                # Update & Check Collisions for Obstacles
                player_rect = pygame.Rect(self.player_x - 25, self.player_y - 30, 50, 60)

                for obs in self.obstacles[:]:
                    obs['y'] += obs['speed'] + (self.speed * 0.3)
                    obs_rect = pygame.Rect(obs['x'] - obs['size'], obs['y'] - obs['size'], obs['size'] * 2, obs['size'] * 2)

                    if player_rect.colliderect(obs_rect):
                        self.lives -= 1
                        if crash_sound: crash_sound.play()
                        # Explosion particles
                        for _ in range(20):
                            self.particles.append(Particle(obs['x'], obs['y'], NEON_PINK))
                        self.obstacles.remove(obs)
                        if self.lives <= 0:
                            self.game_over = True
                        continue

                    if obs['y'] > HEIGHT + 60:
                        self.obstacles.remove(obs)

                # Update & Check Collisions for Items
                for item in self.coin_items[:]:
                    item['y'] += item['speed']
                    item_rect = pygame.Rect(item['x'] - 15, item['y'] - 15, 30, 30)

                    if player_rect.colliderect(item_rect):
                        if item['type'] == 'coin':
                            self.coins += 1
                            self.score += 100
                            if coin_sound: coin_sound.play()
                            for _ in range(8):
                                self.particles.append(Particle(item['x'], item['y'], GOLD_YELLOW))
                        else:
                            self.boost_timer = 3.5
                            if boost_sound: boost_sound.play()
                            for _ in range(12):
                                self.particles.append(Particle(item['x'], item['y'], NEON_BLUE))
                        self.coin_items.remove(item)
                        continue

                    if item['y'] > HEIGHT + 40:
                        self.coin_items.remove(item)

                # Update Particles
                for p in self.particles[:]:
                    p.update()
                    if p.life <= 0:
                        self.particles.remove(p)

            # --- RENDERING ---
            screen.fill(DARK_SPACE)

            # Draw Stars
            for star in self.stars:
                color_star = WHITE if self.boost_timer <= 0 else NEON_BLUE
                pygame.draw.circle(screen, color_star, (int(star[0]), int(star[1])), int(star[2] * 0.75))

            # Draw Road Horizon Grid (Pseudo-3D Highway Effect)
            for y_line in range(150, HEIGHT, 40):
                offset_y = (y_line + int(pygame.time.get_ticks() * 0.1 * (self.speed * 0.1))) % (HEIGHT - 150) + 150
                alpha = int(255 * (offset_y / HEIGHT))
                line_surf = pygame.Surface((WIDTH, 2), pygame.SRCALPHA)
                pygame.draw.line(line_surf, (0, 240, 255, alpha // 3), (100, 0), (WIDTH - 100, 0), 2)
                screen.blit(line_surf, (0, offset_y))

            # Track Boundaries
            pygame.draw.line(screen, NEON_BLUE, (100, 0), (100, HEIGHT), 4)
            pygame.draw.line(screen, NEON_BLUE, (WIDTH - 100, 0), (WIDTH - 100, HEIGHT), 4)

            # Draw Obstacles
            for obs in self.obstacles:
                if obs['type'] == 'meteor':
                    pygame.draw.circle(screen, (239, 68, 68), (int(obs['x']), int(obs['y'])), obs['size'])
                    pygame.draw.circle(screen, GOLD_YELLOW, (int(obs['x']), int(obs['y'])), obs['size'], 3)
                else:
                    pygame.draw.rect(screen, NEON_PINK, (obs['x'] - obs['size'], obs['y'] - 10, obs['size'] * 2, 20), border_radius=8)

            # Draw Items
            for item in self.coin_items:
                if item['type'] == 'coin':
                    pygame.draw.circle(screen, GOLD_YELLOW, (int(item['x']), int(item['y'])), 14)
                    pygame.draw.circle(screen, WHITE, (int(item['x']), int(item['y'])), 14, 2)
                else:
                    pygame.draw.polygon(screen, NEON_GREEN, [
                        (item['x'], item['y'] - 15),
                        (item['x'] - 12, item['y'] + 10),
                        (item['x'] + 12, item['y'] + 10)
                    ])

            # Draw Particles
            for p in self.particles:
                p.draw(screen)

            # Draw Player Spaceship
            if not self.game_over:
                px, py = self.player_x, self.player_y
                # Engine Thruster Flame
                flame_len = 25 if self.boost_timer <= 0 else 45
                pygame.draw.polygon(screen, (249, 115, 22) if self.boost_timer <= 0 else NEON_BLUE, [
                    (px - 10, py + 20),
                    (px + 10, py + 20),
                    (px, py + 20 + flame_len)
                ])
                # Spaceship Hull
                pygame.draw.polygon(screen, NEON_BLUE if self.boost_timer <= 0 else NEON_GREEN, [
                    (px, py - 35),
                    (px - 30, py + 20),
                    (px, py + 10),
                    (px + 30, py + 20)
                ])
                # Cockpit Glass
                pygame.draw.circle(screen, WHITE, (int(px), int(py - 5)), 8)

            # HUD Display
            score_text = font_small.render(f"SCORE: {self.score}", True, WHITE)
            coins_text = font_small.render(f"GOLD: {self.coins}", True, GOLD_YELLOW)
            lives_text = font_small.render(f"LIVES: {'❤️ ' * self.lives}", True, NEON_PINK)

            screen.blit(score_text, (20, 20))
            screen.blit(coins_text, (220, 20))
            screen.blit(lives_text, (400, 20))

            if self.boost_timer > 0:
                boost_text = font_small.render("⚡ NITRO TURBO ACTIVE!", True, NEON_GREEN)
                screen.blit(boost_text, (WIDTH - 300, 20))

            if self.game_over:
                over_surf = font_large.render("GAME OVER!", True, NEON_PINK)
                restart_surf = font_small.render("Press SPACE or ENTER to play again | [Q] to Exit", True, WHITE)
                screen.blit(over_surf, (WIDTH // 2 - over_surf.get_width() // 2, HEIGHT // 2 - 50))
                screen.blit(restart_surf, (WIDTH // 2 - restart_surf.get_width() // 2, HEIGHT // 2 + 20))

            pygame.display.flip()

        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    Game().run()
