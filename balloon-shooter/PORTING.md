# 🎈 Porting Balloon Defender to a New Computer

The **Balloon Defender** game features adaptive difficulty for players of different ages and is optimized for both fast and slow computers.

## 1. Quick Start
On the new computer, install **Node.js** from [nodejs.org](https://nodejs.org/).

## 2. Moving the Files
1. Copy the `balloon-shooter` folder to your USB drive.
2. **Exclude** the `node_modules` folder.

## 3. Installation
Open a terminal in the folder and run:
```bash
npm install
```

## 4. Launch the Game
```bash
npm run dev
```

### Game Modes:
- **Equal:** Fair for two players of the same skill.
- **P1 Hard / P2 Easy:** P1 gets 70% of the balloons and they move faster!
- **P2 Hard / P1 Easy:** P2 gets 70% of the balloons and they move faster!

### Controls:
- **P1:** Move with **A / D**, Shoot with **S**.
- **P2:** Move with **← / →**, Shoot with **↓**.

*Note: This game includes custom audio! Click anywhere on the page to enable sound in your browser.*
