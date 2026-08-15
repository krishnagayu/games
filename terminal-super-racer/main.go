package main

import (
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"sync"
	"time"
)

const (
	width     = 40
	height    = 22
	roadWidth = 14
)

type Car struct {
	x int
	y int
}

type Obstacle struct {
	x    int
	y    float64
	char rune
}

type PowerUp struct {
	x    int
	y    float64
	char rune
}

type Game struct {
	mu           sync.Mutex
	playerX      int
	speed        float64
	distance     float64
	score        int
	coins        int
	turboTimer   float64
	shieldTimer  float64
	gameOver     bool
	roadOffset   float64
	obstacles    []Obstacle
	powerups     []PowerUp
	leftBoundary []int
}

// System audio sound synthesizer using terminal bell / paplay / speaker tones
func playSound(soundType string) {
	go func() {
		switch soundType {
		case "coin":
			// High pitch coin chime
			exec.Command("paplay", "/usr/share/sounds/freedesktop/stereo/bell.oga").Run()
			fmt.Print("\007")
		case "turbo":
			// Fast double beep turbo sound
			fmt.Print("\007")
			time.Sleep(50 * time.Millisecond)
			fmt.Print("\007")
		case "shield":
			// Shield activation chime
			fmt.Print("\007")
		case "crash":
			// Low crash sound
			exec.Command("paplay", "/usr/share/sounds/freedesktop/stereo/dialog-warning.oga").Run()
			fmt.Print("\007")
		}
	}()
}

// Background retro engine arcade music loop synthesizer
func startArcadeMusic(g *Game) {
	notes := []time.Duration{
		120 * time.Millisecond,
		160 * time.Millisecond,
		120 * time.Millisecond,
		200 * time.Millisecond,
	}

	go func() {
		noteIndex := 0
		for {
			g.mu.Lock()
			isOver := g.gameOver
			isTurbo := g.turboTimer > 0
			g.mu.Unlock()

			if isOver {
				break
			}

			// Terminal arcade rhythm beat
			fmt.Print("\007")

			delay := notes[noteIndex%len(notes)]
			if isTurbo {
				delay = delay / 2 // Fast engine beat during Turbo
			}
			noteIndex++

			time.Sleep(delay + 180*time.Millisecond)
		}
	}()
}

func newGame() *Game {
	g := &Game{
		playerX:      width / 2,
		speed:        0.4,
		leftBoundary: make([]int, height),
	}
	for i := 0; i < height; i++ {
		g.leftBoundary[i] = (width - roadWidth) / 2
	}
	return g
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

	// Clear terminal screen
	fmt.Print("\033[2J\033[?25l")
	defer fmt.Print("\033[?25h") // Restore cursor

	// Start background arcade rhythm sound engine
	startArcadeMusic(game)

	// Input listener goroutine
	go func() {
		b := make([]byte, 1)
		for !game.gameOver {
			os.Stdin.Read(b)
			game.mu.Lock()
			switch b[0] {
			case 'a', 'A':
				if game.playerX > 2 {
					game.playerX -= 2
				}
			case 'd', 'D':
				if game.playerX < width-3 {
					game.playerX += 2
				}
			case 'w', 'W':
				if game.speed < 1.2 {
					game.speed += 0.1
				}
			case 's', 'S':
				if game.speed > 0.2 {
					game.speed -= 0.1
				}
			case 'q', 'Q':
				game.gameOver = true
			}
			game.mu.Unlock()
		}
	}()

	ticker := time.NewTicker(33 * time.Millisecond) // ~30 FPS terminal loop
	defer ticker.Stop()

	rand.Seed(time.Now().UnixNano())

	for range ticker.C {
		game.mu.Lock()
		if game.gameOver {
			game.mu.Unlock()
			break
		}

		game.update()
		game.render()
		game.mu.Unlock()
	}

	playSound("crash")
	fmt.Printf("\033[%d;1H\033[0m\n", height+3)
	fmt.Println("========================================")
	fmt.Printf("   🏁 GAME OVER! Final Score: %d 🏁\n", game.score)
	fmt.Printf("   🪙 Gold Coins Collected: %d\n", game.coins)
	fmt.Println("========================================")
}

func (g *Game) update() {
	g.distance += g.speed
	g.score += int(g.speed * 10)
	g.roadOffset += g.speed

	if g.turboTimer > 0 {
		g.turboTimer -= 0.033
		g.speed = 1.2
	}
	if g.shieldTimer > 0 {
		g.shieldTimer -= 0.033
	}

	// Move road curves
	for i := height - 1; i > 0; i-- {
		g.leftBoundary[i] = g.leftBoundary[i-1]
	}
	// Add smooth curves
	curveShift := (rand.Intn(3) - 1)
	newLeft := g.leftBoundary[0] + curveShift
	if newLeft < 2 {
		newLeft = 2
	}
	if newLeft > width-roadWidth-2 {
		newLeft = width - roadWidth - 2
	}
	g.leftBoundary[0] = newLeft

	// Spawn Obstacles (Oil slick '🛢️', Enemy Car '🚗')
	if rand.Float64() < 0.08 {
		roadLeft := g.leftBoundary[0]
		spawnX := roadLeft + 1 + rand.Intn(roadWidth-2)
		char := '🚗'
		if rand.Float64() > 0.5 {
			char = '🛢'
		}
		g.obstacles = append(g.obstacles, Obstacle{x: spawnX, y: 0, char: char})
	}

	// Spawn Powerups (Coins '🪙', Turbo '⚡', Shield '🛡')
	if rand.Float64() < 0.05 {
		roadLeft := g.leftBoundary[0]
		spawnX := roadLeft + 1 + rand.Intn(roadWidth-2)
		r := rand.Float64()
		char := '🪙'
		if r > 0.7 {
			char = '⚡'
		} else if r > 0.4 {
			char = '🛡'
		}
		g.powerups = append(g.powerups, PowerUp{x: spawnX, y: 0, char: char})
	}

	// Update Obstacles position
	for i := len(g.obstacles) - 1; i >= 0; i-- {
		g.obstacles[i].y += g.speed
		obs := g.obstacles[i]

		// Check collision with player car
		if int(obs.y) >= height-3 && int(obs.y) <= height-1 {
			if MathAbs(obs.x-g.playerX) <= 1 {
				if g.shieldTimer > 0 {
					// Shield saved player
					playSound("shield")
					g.obstacles = append(g.obstacles[:i], g.obstacles[i+1:]...)
					continue
				}
				g.gameOver = true
				return
			}
		}

		if obs.y >= float64(height) {
			g.obstacles = append(g.obstacles[:i], g.obstacles[i+1:]...)
		}
	}

	// Update Powerups position
	for i := len(g.powerups) - 1; i >= 0; i-- {
		g.powerups[i].y += g.speed
		pw := g.powerups[i]

		// Check collision with player car
		if int(pw.y) >= height-3 && int(pw.y) <= height-1 {
			if MathAbs(pw.x-g.playerX) <= 2 {
				if pw.char == '🪙' {
					g.coins += 1
					g.score += 50
					playSound("coin")
				} else if pw.char == '⚡' {
					g.turboTimer = 3.0 // 3 seconds turbo
					playSound("turbo")
				} else if pw.char == '🛡' {
					g.shieldTimer = 5.0 // 5 seconds shield
					playSound("shield")
				}
				g.powerups = append(g.powerups[:i], g.powerups[i+1:]...)
				continue
			}
		}

		if pw.y >= float64(height) {
			g.powerups = append(g.powerups[:i], g.powerups[i+1:]...)
		}
	}
}

func MathAbs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func (g *Game) render() {
	buf := "\033[H" // Cursor to top-left

	buf += "\033[1;36m🏎️  RETRO TERMINAL SUPER-RACER 🏎️\033[0m\n"
	buf += fmt.Sprintf("\033[1;33mScore: %-6d \033[1;32mCoins: %-4d \033[1;35mSpeed: %.1fx\033[0m", g.score, g.coins, g.speed*2)
	if g.turboTimer > 0 {
		buf += " \033[1;31m⚡TURBO!\033[0m"
	}
	if g.shieldTimer > 0 {
		buf += " \033[1;34m🛡️SHIELD!\033[0m"
	}
	buf += "\n"

	// Draw Road Frame
	for r := 0; r < height; r++ {
		left := g.leftBoundary[r]
		right := left + roadWidth

		for c := 0; c < width; c++ {
			// Player car (at row height-2)
			if r == height-2 && MathAbs(c-g.playerX) <= 1 {
				if c == g.playerX {
					buf += "\033[1;31m🚘\033[0m"
				}
				continue
			}

			// Check Obstacles
			isObj := false
			for _, obs := range g.obstacles {
				if int(obs.y) == r && obs.x == c {
					buf += string(obs.char)
					isObj = true
					break
				}
			}
			if isObj {
				continue
			}

			// Check Powerups
			for _, pw := range g.powerups {
				if int(pw.y) == r && pw.x == c {
					buf += string(pw.char)
					isObj = true
					break
				}
			}
			if isObj {
				continue
			}

			// Road borders & turf
			if c < left {
				buf += "\033[32m🌲\033[0m" // Green palm grass turf
			} else if c == left || c == right {
				if (r+int(g.roadOffset))%2 == 0 {
					buf += "\033[1;37m█\033[0m"
				} else {
					buf += "\033[1;31m█\033[0m"
				}
			} else if c == (left+right)/2 {
				if (r+int(g.roadOffset))%2 == 0 {
					buf += "\033[1;33m┆\033[0m" // Yellow centerline
				} else {
					buf += " "
				}
			} else if c > left && c < right {
				buf += " "
			} else {
				buf += "\033[32m🌴\033[0m"
			}
		}
		buf += "\n"
	}

	buf += "\033[1;30mControls: [A] Left | [D] Right | [W] Accelerate | [S] Brake | [Q] Quit\033[0m"
	fmt.Print(buf)
}
