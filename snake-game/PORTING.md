# 🚀 Porting This Game to a New Computer

This is a **React + Vite** project. To play this game on another computer during your holidays, follow these simple steps:

## 1. Prerequisites
On the new computer, you must install **Node.js**:
- Download it from: [nodejs.org](https://nodejs.org/)
- Choose the **LTS (Long Term Support)** version.

## 2. Moving the Files
You can move this game using a USB drive or by zipping the folder:
1. Copy the entire `snake-game` folder.
2. **IMPORTANT:** Do NOT copy the `node_modules` folder (it is very large and contains thousands of small files).
3. Paste the folder onto the new computer.

## 3. Installation
Open a terminal (PowerShell or Command Prompt) inside the `snake-game` folder on the new computer and run:
```bash
npm install
```
*This will download all the necessary libraries (like React and Vite) in a few seconds.*

## 4. Play the Game
Once the installation is finished, run:
```bash
npm run dev
```
- A link will appear (usually `http://localhost:5173`).
- Hold **Ctrl and click** the link to open the game in your browser!

---
**Tech Stack:** React, Vite, Vanilla CSS.
**Controls:** Arrow Keys / WASD.
