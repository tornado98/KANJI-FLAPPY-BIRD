// ============================================================================
// GLOBAL CANVAS & ADVANCED HYDRODYNAMIC ENGINE CONSTANTS
// ============================================================================
const W = 1180;
const H = 720;

// Refined Fluid Physics Parameters
const BUOYANCY_GRAVITY = 0.21;
const SWIM_THRUST_IMPULSE = -6.6;
const WATER_VISCOUS_DRAG = 0.986;
const BASE_SCROLL_SPD = 3.5;

// Global Runtime State
let speed = BASE_SCROLL_SPD;
let score = 0;
let combo = 0;
let maxCombo = 0;
let lives = 3;
let fishCount = 0;
let currentLevel = "N5";
let bestScore = parseInt(
  localStorage.getItem("seal_kanji_best_" + currentLevel) || "0",
);
let gameState = "MENU"; // MENU, PLAY, PAUSE, GAMEOVER, CODEX
let frameCount = 0;
let shakeTime = 0;
let shakeAmp = 0;
let slowMoTimer = 0;
let gatesPassedCount = 0;
let bossRotationIndex = 0; // Cycles between 0: Squidward, 1: Plankton, 2: Mr. Krabs

// Screen Flash Feedback (Green for correct, Red for damage)
let screenFlashColor = null;
let screenFlashAlpha = 0;

// UI Buttons Coordinates
const LEVEL_BUTTONS = [
  { level: "N5", label: "N5 Beginner", x: W / 2 - 325, y: 265, w: 120, h: 44 },
  { level: "N4", label: "N4 Basic", x: W / 2 - 195, y: 265, w: 120, h: 44 },
  { level: "N3", label: "N3 Inter.", x: W / 2 - 65, y: 265, w: 120, h: 44 },
  { level: "N2", label: "N2 Adv.", x: W / 2 + 65, y: 265, w: 120, h: 44 },
  { level: "N1", label: "N1 Expert", x: W / 2 + 195, y: 265, w: 120, h: 44 },
];

const startBtn = { x: W / 2 - 165, y: 345, w: 330, h: 64 };
const codexBtn = { x: W / 2 - 165, y: 425, w: 330, h: 48 };
const closeCodexBtn = { x: W / 2 - 100, y: H - 110, w: 200, h: 44 };

const pauseTriggerBtn = { x: W - 70, y: 16, w: 46, h: 46 };
const resumeBtn = { x: W / 2 - 140, y: H / 2 - 20, w: 280, h: 54 };
const quitPauseBtn = { x: W / 2 - 140, y: H / 2 + 50, w: 280, h: 54 };

const retryBtn = { x: W / 2 - 150, y: H / 2 + 35, w: 300, h: 50 };
const gameOverQuitBtn = { x: W / 2 - 150, y: H / 2 + 95, w: 300, h: 46 };

// Dynamic Object Pools
let playerShots = [];
let burgerShots = [];
let eyeLasers = [];
let coinShots = [];
let ambientBubbles = [];
let trailBubbles = [];
let gateParticles = []; // Shatter particles when passing a Kanji orb
let popups = [];
let powerUps = [];
let bonusFishes = [];
