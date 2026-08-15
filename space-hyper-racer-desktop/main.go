package main

import (
	"fmt"
	"math"
	"math/rand"
	"os"
	"os/exec"
	"sync"
	"time"
)

const (
	width     = 60
	height    = 24
	trackWidth = 20
)

type EntityType int

const (
	TypeMeteor EntityType = iota
	TypeLaserWall
	TypeCoin
	TypeBoost
)

type Entity struct {
	x   float64
	z   float64
	kind EntityType
}

type Particle struct {
	x, y, z float64
	vx, vy, vz float64
	life float64
}

type Game struct {
	mu           sync.Mutex
	playerX      float64
	speed        float64
	distance     float64
	score        int
	coins        int
	lives        int
	boostTimer   float64
	shieldTimer  float64
	gameOver     bool
	entities     []Entity
	particles    []Particle
}

func newGame() *Game {
	return &Game{
		playerX:  0.0,
		speed:    18.0,
		lives:    3,
		entities: make([]Entity, 0),
		particles: make([]Particle, 0),
	}
}

func disableInputBuffering() {
	exec.Command("stty", "-F", "/dev/tty", "cbreak", "min", "1").Run()
	exec.Command("stty", "-F", "/dev/tty", "-echo").Run()
}

func restoreInputBuffering() {
	exec.Command("stty", "-F", "/dev/tty", "sane").Run()
}

func main() {
	disableInputBuffering()
	defer restoreInputBuffering()

	game := newGame()

	// Hide cursor and clear screen
	fmt.Print("\033[2J\033[?25l")
	defer fmt.Print("\033[?25h\033[0m") // Restore cursor and colors

	// Asynchronous keyboard input handler
	go func() {
		b := make([]byte, 3)
		for !game.gameOver {
			n, err := os.Stdin.Read(b)
			if err != nil || n == 0 {
				continue
			}
			game.mu.Lock()
			// Handle Arrow keys and WASD
			if n == 3 && b[0] == 27 && b[1] == 91 {
				switch b[2] {
				case 68: // Left Arrow
					if game.playerX > -1.6 {
						game.playerX -= 0.3
					}
				case 67: // Right Arrow
					if game.playerX < 1.6 {
						game.playerX += 0.3
					}
				}
			} else {
				switch b[0] {
				case 'a', 'A':
					if game.playerX > -1.6 {
						game.playerX -= 0.3
					}
				case 'd', 'D':
					if game.playerX < 1.6 {
						game.playerX += 0.3
					}
				case 'q', 'Q', 27:
					game.gameOver = true
				case ' ':
					if game.gameOver {
						*game = *newGame()
					}
				}
			}
			game.mu.Unlock()
		}
	}()

	ticker := time.NewTicker(33 * time.Millisecond) // ~30 FPS terminal 3D engine loop
	defer ticker.Stop()

	rand.Seed(time.Now().UnixNano())

	for range ticker.C {
		game.mu.Lock()
		if game.gameOver {
			game.renderGameOver()
			game.mu.Unlock()
			continue
		}

		game.update(0.033)
		game.render()
		game.mu.Unlock()
	}
}

func (g *Game) update(dt float64) {
	currSpeed := g.speed
	if g.boostTimer > 0 {
		g.boostTimer -= dt
		currSpeed = g.speed * 2.2
	}
	if g.shieldTimer > 0 {
		g.shieldTimer -= dt
	}

	g.distance += currSpeed * dt
	g.score += int(currSpeed * dt * 12)

	// Spawn Entities at z = 30.0
	if rand.Float64() < 0.08 {
		laneX := float64(rand.Intn(5)-2) * 0.7
		kind := TypeMeteor
		r := rand.Float64()
		if r > 0.75 {
			kind = TypeBoost
		} else if r > 0.45 {
			kind = TypeCoin
		} else if r > 0.25 {
			kind = TypeLaserWall
		}
		g.entities = append(g.entities, Entity{x: laneX, z: 30.0, kind: kind})
	}

	// Update Entities
	for i := len(g.entities) - 1; i >= 0; i-- {
		g.entities[i].z -= currSpeed * dt
		e := g.entities[i]

		// Check collision at player position (z ~ 1.2)
		if e.z >= 0.8 && e.z <= 1.6 && math.Abs(e.x-g.playerX) < 0.45 {
			if e.kind == TypeMeteor || e.kind == TypeLaserWall {
				if g.shieldTimer <= 0 {
					g.lives--
					g.shieldTimer = 1.5
					if g.lives <= 0 {
						g.gameOver = true
					}
				}
			} else if e.kind == TypeCoin {
				g.coins++
				g.score += 250
			} else if e.kind == TypeBoost {
				g.boostTimer = 4.0
			}
			g.entities = append(g.entities[:i], g.entities[i+1:]...)
			continue
		}

		if e.z < 0.2 {
			g.entities = append(g.entities[:i], g.entities[i+1:]...)
		}
	}
}

func (g *Game) render() {
	// Initialize Screen Buffer
	grid := make([][]rune, height)
	colorGrid := make([][]string, height)
	for r := 0; r < height; r++ {
		grid[r] = make([]rune, width)
		colorGrid[r] = make([]string, width)
		for c := 0; c < width; c++ {
			grid[r][c] = ' '
			colorGrid[r][c] = "\033[0m"
		}
	}

	vanishingY := 5
	vanishingX := width / 2

	// Render Perspective Grid Horizon Track
	for r := vanishingY; r < height; r++ {
		depthProgress := float64(r-vanishingY) / float64(height-vanishingY)
		halfTrackWidth := int(float64(trackWidth/2) * depthProgress * 1.6)

		leftBoundary := vanishingX - halfTrackWidth
		rightBoundary := vanishingX + halfTrackWidth

		if leftBoundary >= 0 && leftBoundary < width {
			grid[r][leftBoundary] = '║'
			colorGrid[r][leftBoundary] = "\033[1;36m"
		}
		if rightBoundary >= 0 && rightBoundary < width {
			grid[r][rightBoundary] = '║'
			colorGrid[r][rightBoundary] = "\033[1;36m"
		}

		// Horizontal depth bars
		if (r+int(g.distance*2))%3 == 0 {
			for c := leftBoundary + 1; c < rightBoundary; c++ {
				if c >= 0 && c < width {
					grid[r][c] = '-'
					colorGrid[r][c] = "\033[1;35m"
				}
			}
		}
	}

	// Render Entities in 3D Perspective Depth
	for _, e := range g.entities {
		if e.z <= 0.2 || e.z > 30.0 {
			continue
		}
		scale := 12.0 / e.z
		sy := vanishingY + int(float64(height-vanishingY)*(1.0-(e.z/30.0)))
		sx := vanishingX + int(e.x*scale*8.0)

		if sy >= vanishingY && sy < height && sx >= 1 && sx < width-1 {
			switch e.kind {
			case TypeMeteor:
				grid[sy][sx] = '☄'
				colorGrid[sy][sx] = "\033[1;31m"
			case TypeLaserWall:
				grid[sy][sx] = '⚡'
				colorGrid[sy][sx] = "\033[1;33m"
			case TypeCoin:
				grid[sy][sx] = '🪙'
				colorGrid[sy][sx] = "\033[1;33m"
			case TypeBoost:
				grid[sy][sx] = '🚀'
				colorGrid[sy][sx] = "\033[1;34m"
			}
		}
	}

	// Render Player Spaceship (at bottom center of screen)
	playerRow := height - 3
	playerCol := vanishingX + int(g.playerX*12.0)
	if playerCol >= 2 && playerCol < width-2 {
		shipChar := '🚀'
		if g.boostTimer > 0 {
			shipChar = '🔥'
		}
		grid[playerRow][playerCol] = shipChar
		colorGrid[playerRow][playerCol] = "\033[1;32m"
	}

	// Output Frame
	buf := "\033[H"
	buf += "\033[1;36m🌌 SPACE HYPER-RACER 3D (Go Native) 🌌\033[0m\n"
	buf += fmt.Sprintf("\033[1;37mScore: \033[1;33m%-6d \033[1;37mGold: \033[1;33m%-4d \033[1;37mShields: \033[1;31m%s\033[0m", 
		g.score, g.coins, repeatChar("⚡", g.lives))

	if g.boostTimer > 0 {
		buf += fmt.Sprintf("  \033[1;35m🚀 HYPERDRIVE (%.1fs)\033[0m", g.boostTimer)
	}
	buf += "\n"

	for r := 0; r < height; r++ {
		for c := 0; c < width; c++ {
			buf += colorGrid[r][c] + string(grid[r][c])
		}
		buf += "\033[0m\n"
	}
	buf += "\033[1;30mControls: [←/A] Steer Left | [→/D] Steer Right | [Q/ESC] Quit\033[0m"

	fmt.Print(buf)
}

func (g *Game) renderGameOver() {
	buf := fmt.Sprintf("\033[%d;%dH\033[1;31m══ GAME OVER! PRESS SPACE TO RESPAWN ══\033[0m", height/2, width/6)
	fmt.Print(buf)
}

func repeatChar(char string, n int) string {
	res := ""
	for i := 0; i < n; i++ {
		res += char
	}
	return res
}
