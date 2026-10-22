// ============================================================================
// CANVAS INITIALIZATION & HARDWARE ACCELERATION
// ============================================================================
const canvas = document.getElementById("sealCanvas");
const ctx = canvas.getContext("2d", { alpha: false });
canvas.width = W;
canvas.height = H;

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

// Offscreen Static Deep-Sea Gradient Buffer
const bgCanvas = document.createElement("canvas");
bgCanvas.width = W;
bgCanvas.height = H;
const bgCtx = bgCanvas.getContext("2d");

function preRenderBackground() {
  const grad = bgCtx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#025080");
  grad.addColorStop(0.32, "#033258");
  grad.addColorStop(0.72, "#021d36");
  grad.addColorStop(1, "#010d1a");
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, W, H);
}
preRenderBackground();

// ============================================================================
// PARALLAX ENVIRONMENT, MARINE SNOW & BIOSPHERE CLASSES
// ============================================================================
class ParallaxReef {
  constructor(speedFactor, color, baseY, heightVar) {
    this.speedFactor = speedFactor;
    this.color = color;
    this.baseY = baseY;
    this.offset = 0;
    this.nodes = [];
    for (let x = 0; x <= W + 200; x += 90) {
      this.nodes.push({
        x: x,
        h: 35 + Math.sin(x * 0.02) * heightVar + Math.random() * 25,
      });
    }
  }
  update(currentSpd) {
    this.offset -= currentSpd * this.speedFactor;
    if (this.offset <= -90) {
      this.offset += 90;
      const first = this.nodes.shift();
      first.x = this.nodes[this.nodes.length - 1].x + 90;
      first.h = 35 + Math.random() * 45;
      this.nodes.push(first);
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].x = i * 90;
      }
    }
  }
  draw(c) {
    c.save();
    c.fillStyle = this.color;
    c.beginPath();
    c.moveTo(0, H);
    for (let i = 0; i < this.nodes.length; i++) {
      const nx = this.nodes[i].x + this.offset;
      const ny = this.baseY - this.nodes[i].h;
      if (i === 0) c.lineTo(nx, ny);
      else {
        const prevX = this.nodes[i - 1].x + this.offset;
        const prevY = this.baseY - this.nodes[i - 1].h;
        const midX = (prevX + nx) / 2;
        const midY = (prevY + ny) / 2;
        c.quadraticCurveTo(prevX, prevY, midX, midY);
      }
    }
    c.lineTo(W, H);
    c.closePath();
    c.fill();
    c.restore();
  }
}

const farReef = new ParallaxReef(0.18, "rgba(4, 38, 68, 0.65)", H - 35, 38);
const midReef = new ParallaxReef(0.38, "rgba(6, 55, 92, 0.8)", H - 25, 26);

// Bioluminescent Marine Snow & Speed Lines
class MarineSpore {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * (H - 50);
    this.r = 1 + Math.random() * 2.2;
    this.spdMultiplier = 0.3 + Math.random() * 0.5;
    this.phase = Math.random() * Math.PI * 2;
    this.color = Math.random() > 0.4 ? "#38bdf8" : "#fde047";
  }
  update(effSpd, isHighSpeed) {
    this.phase += 0.04;
    const boost = isHighSpeed ? 2.4 : 1.0;
    this.x -= effSpd * this.spdMultiplier * boost;
    this.y += Math.sin(this.phase) * 0.3;
    if (this.x < -20) {
      this.x = W + 20;
      this.y = Math.random() * (H - 50);
    }
  }
  draw(c, isHighSpeed) {
    c.save();
    c.globalAlpha = 0.35 + Math.sin(this.phase) * 0.15;
    c.fillStyle = this.color;
    c.strokeStyle = this.color;
    if (isHighSpeed) {
      // Render as hydrodynamic speed lines during Dash or Fever
      c.lineWidth = this.r;
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x + 22, this.y);
      c.stroke();
    } else {
      c.beginPath();
      c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }
}
const marineSpores = Array.from({ length: 28 }, () => new MarineSpore());

// Ambient Bioluminescent Jellyfish
class Jellyfish {
  constructor() {
    this.x = Math.random() * W;
    this.y = 80 + Math.random() * (H - 180);
    this.pulse = Math.random() * Math.PI * 2;
    this.scale = 0.55 + Math.random() * 0.45;
    this.hue = Math.random() > 0.5 ? 195 : 285;
  }
  update(currentSpd) {
    this.pulse += 0.05;
    this.x -= currentSpd * 0.25;
    this.y -= Math.sin(this.pulse) * 0.35 + 0.2;
    if (this.x < -50) {
      this.x = W + 50;
      this.y = 100 + Math.random() * (H - 200);
    }
    if (this.y < -40) this.y = H + 20;
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y);
    c.scale(this.scale, this.scale);
    c.globalAlpha = 0.38;

    const squeeze = 1 + Math.sin(this.pulse) * 0.12;
    c.scale(squeeze, 2 - squeeze);

    c.fillStyle = `hsla(${this.hue}, 90%, 70%, 0.5)`;
    c.strokeStyle = `hsla(${this.hue}, 95%, 80%, 0.85)`;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(0, 0, 16, Math.PI, 0);
    c.bezierCurveTo(16, 6, -16, 6, -16, 0);
    c.fill();
    c.stroke();

    for (let i = -8; i <= 8; i += 5) {
      const wave = Math.cos(this.pulse + i) * 4;
      c.beginPath();
      c.moveTo(i, 3);
      c.quadraticCurveTo(i + wave, 14, i - wave, 24);
      c.stroke();
    }
    c.restore();
  }
}
const jellyfishes = Array.from({ length: 5 }, () => new Jellyfish());

function drawDynamicOceanBackdrop(c, t) {
  c.drawImage(bgCanvas, 0, 0);

  // Animated Sunbeams (God Rays)
  c.save();
  for (let i = 0; i < 6; i++) {
    const sway = Math.sin(t * 0.015 + i * 1.1) * 35;
    const rayX = i * 210 + 50 + sway;
    const rayGrad = c.createLinearGradient(rayX, 0, rayX - 60, H * 0.85);
    rayGrad.addColorStop(0, "rgba(186, 230, 253, 0.09)");
    rayGrad.addColorStop(1, "rgba(186, 230, 253, 0.0)");
    c.fillStyle = rayGrad;
    c.beginPath();
    c.moveTo(rayX - 30, 0);
    c.lineTo(rayX + 95, 0);
    c.lineTo(rayX + 10, H * 0.85);
    c.lineTo(rayX - 115, H * 0.85);
    c.closePath();
    c.fill();
  }
  c.restore();

  // Parallax Reefs, Marine Spores & Bioluminescent Jellyfish
  farReef.draw(c);
  jellyfishes.forEach((j) => j.draw(c));
  midReef.draw(c);

  const isHighSpeed =
    gameState === "PLAY" &&
    ((typeof combo !== "undefined" && combo >= 3) || seal.dashTimer > 0);
  marineSpores.forEach((ms) => ms.draw(c, isHighSpeed));

  // Glowing Sandy Seabed Floor with Caustic Wave Line
  const floorGrad = c.createLinearGradient(0, H - 45, 0, H);
  floorGrad.addColorStop(0, "#095487");
  floorGrad.addColorStop(1, "#021c30");
  c.fillStyle = floorGrad;
  c.fillRect(0, H - 45, W, 45);

  c.strokeStyle = "rgba(56, 189, 248, 0.45)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(0, H - 45);
  c.lineTo(W, H - 45);
  c.stroke();
}

// ============================================================================
// ENTITIES & ENHANCED ATLANTIS KANJI GATES
// ============================================================================
const patrick = new PatrickCompanion();
const squidward = new SquidwardBoss();
const spongebob = new SpongeBobAlly();
const plankton = new PlanktonBoss();
const mrKrabs = new MrKrabsBoss();

class Bubble {
  constructor(x, y, isTrail = false, isGold = false) {
    this.x = x ?? Math.random() * W;
    this.y = y ?? H + Math.random() * 40;
    this.r = isTrail ? 2 + Math.random() * 4 : 2 + Math.random() * 6;
    this.vy = -(1.2 + Math.random() * 2.0);
    this.vx = isTrail
      ? -(0.8 + Math.random() * 1.2)
      : (Math.random() - 0.5) * 0.4;
    this.alpha = 0.35 + Math.random() * 0.4;
    this.isTrail = isTrail;
    this.isGold = isGold;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.isTrail) this.alpha -= 0.032;
    return this.isTrail ? this.alpha > 0 : this.y > -20;
  }
  draw(c) {
    c.fillStyle = this.isGold
      ? `rgba(253, 224, 71, ${Math.max(0, this.alpha)})`
      : `rgba(186, 230, 253, ${Math.max(0, this.alpha * 0.45)})`;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fill();
  }
}
ambientBubbles = Array.from({ length: 32 }, () => new Bubble());

class PopupText {
  constructor(text, x, y, color = "#fde047", size = 26) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.alpha = 1.0;
  }
  update() {
    this.y -= 1.5;
    this.alpha -= 0.028;
    return this.alpha > 0;
  }
  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.alpha);
    c.fillStyle = this.color;
    c.font = `bold ${this.size}px 'Plus Jakarta Sans', sans-serif`;
    c.textAlign = "center";
    c.fillText(this.text, this.x, this.y);
    c.restore();
  }
}

class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.bob = Math.random() * 10;
    this.eaten = false;
  }
  update(effSpd) {
    this.x -= effSpd;
    this.bob += 0.08;
  }
  draw(c) {
    if (this.eaten) return;
    c.save();
    c.translate(this.x, this.y + Math.sin(this.bob) * 7);
    c.fillStyle =
      this.type === "shield"
        ? "rgba(56, 189, 248, 0.35)"
        : "rgba(250, 204, 21, 0.35)";
    c.strokeStyle = this.type === "shield" ? "#38bdf8" : "#facc15";
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(0, 0, 18, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Pure vector icon inside power-up orb for zero-lag rendering
    c.fillStyle = "#ffffff";
    c.font = "bold 14px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(this.type === "shield" ? "SHIELD" : "SLOW", 0, 0);
    c.restore();
  }
  getBounds() {
    return { x: this.x - 18, y: this.y - 18, w: 36, h: 36 };
  }
}

class GoldenFish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.eaten = false;
    this.wiggle = Math.random() * 10;
  }
  update(effSpd) {
    this.x -= effSpd;
    this.wiggle += 0.24;
    this.y = this.baseY + Math.sin(this.wiggle * 0.3) * 8;
  }
  draw(c) {
    if (this.eaten) return;
    c.save();
    c.translate(this.x, this.y);
    const tailOffset = Math.sin(this.wiggle) * 4.5;

    c.fillStyle = "rgba(251, 191, 36, 0.25)";
    c.beginPath();
    c.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = "#fbbf24";
    c.strokeStyle = "#d97706";
    c.lineWidth = 1.5;
    c.beginPath();
    c.ellipse(0, 0, 13, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.beginPath();
    c.moveTo(-9, 0);
    c.lineTo(-20 + tailOffset, -7);
    c.lineTo(-20 + tailOffset, 7);
    c.closePath();
    c.fill();

    c.fillStyle = "#ffffff";
    c.beginPath();
    c.arc(7, -2, 2.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#000000";
    c.beginPath();
    c.arc(8, -2, 1.2, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

class Seaweed {
  constructor(x, height) {
    this.x = x;
    this.h = height;
    this.segments = 5;
    this.offset = Math.random() * 100;
  }
  draw(c, t) {
    c.strokeStyle = "#0891b2";
    c.lineWidth = 15;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(this.x, H);
    const segH = this.h / this.segments;
    for (let i = 1; i <= this.segments; i++) {
      c.lineTo(
        this.x + Math.sin(t * 0.035 + this.offset + i * 0.45) * (i * 3.2),
        H - i * segH,
      );
    }
    c.stroke();
  }
}
const kelpForest = Array.from(
  { length: 12 },
  (_, i) => new Seaweed(50 + i * 95, 130 + Math.random() * 170),
);

// Redesigned Atlantis Cyber-Torii Kanji Gate with Floating Pearl Orbs
class KanjiGate {
  constructor(x) {
    this.w = 96;
    this.gap = 305;
    this.x = x;
    this.passed = false;
    this.orbPulse = 0;
    this.oscillatePhase = Math.random() * Math.PI * 2;
    this.isMovingGate = false;
    this.resetData();
  }

  resetData() {
    this.baseTopH = 75 + Math.random() * (H - this.gap - 155);
    this.topH = this.baseTopH;
    this.botY = this.topH + this.gap;
    const list = JLPT_DATABASE[currentLevel];
    this.data = list[Math.floor(Math.random() * list.length)];
    this.topCorrect = Math.random() > 0.5;
    this.isMovingGate =
      typeof gatesPassedCount !== "undefined" &&
      gatesPassedCount >= 3 &&
      Math.random() > 0.4;
  }

  update(effSpd) {
    this.x -= effSpd;
    this.orbPulse += 0.07;

    if (this.isMovingGate && !this.passed) {
      this.oscillatePhase += 0.035;
      this.topH = this.baseTopH + Math.sin(this.oscillatePhase) * 32;
      this.botY = this.topH + this.gap;
    }
  }

  draw(c) {
    const pillarGrad = c.createLinearGradient(this.x, 0, this.x + this.w, 0);
    pillarGrad.addColorStop(0, "#072b4f");
    pillarGrad.addColorStop(0.5, "#0369a1");
    pillarGrad.addColorStop(1, "#072b4f");

    c.save();
    c.fillStyle = pillarGrad;
    c.strokeStyle = "#38bdf8";
    c.lineWidth = 2.5;

    // Top Atlantis Pillar
    c.beginPath();
    c.roundRect(this.x, -4, this.w, this.topH + 4, [0, 0, 20, 20]);
    c.fill();
    c.stroke();

    // Bottom Atlantis Pillar
    c.beginPath();
    c.roundRect(this.x, this.botY, this.w, H - this.botY + 4, [20, 20, 0, 0]);
    c.fill();
    c.stroke();

    // Glowing Cyber-Runes on Pillars
    c.strokeStyle = "rgba(56, 189, 248, 0.35)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(this.x + this.w / 2, 10);
    c.lineTo(this.x + this.w / 2, this.topH - 14);
    c.moveTo(this.x + this.w / 2, this.botY + 14);
    c.lineTo(this.x + this.w / 2, H - 10);
    c.stroke();

    const centerX = this.x + this.w / 2;
    const bobOffset = Math.sin(this.orbPulse) * 5;

    const drawKanjiPearl = (cx, cy, kanjiText, isCorrectOrb) => {
      c.save();
      c.translate(cx, cy);

      if (this.passed) {
        if (isCorrectOrb) {
          c.scale(1.12, 1.12);
          c.globalAlpha = 0.35;
        } else {
          c.globalAlpha = 0.25;
        }
      }

      const ringRadius = 46;
      const orbGrad = c.createRadialGradient(-10, -12, 6, 0, 0, ringRadius);
      if (this.passed && isCorrectOrb) {
        orbGrad.addColorStop(0, "#fef08a");
        orbGrad.addColorStop(1, "#ca8a04");
      } else {
        orbGrad.addColorStop(0, "#0c4a6e");
        orbGrad.addColorStop(0.75, "#082f49");
        orbGrad.addColorStop(1, "#0369a1");
      }

      c.fillStyle = orbGrad;
      c.strokeStyle = this.passed && isCorrectOrb ? "#facc15" : "#38bdf8";
      c.lineWidth = 3.2;
      c.beginPath();
      c.arc(0, 0, ringRadius, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Specular highlight
      c.fillStyle = "rgba(255, 255, 255, 0.16)";
      c.beginPath();
      c.ellipse(-12, -18, 18, 9, -0.35, 0, Math.PI * 2);
      c.fill();

      // Crisp Kanji Text (No heavy shadowBlur to keep 60fps rock-solid)
      c.fillStyle = "#ffffff";
      c.font = "bold 46px 'Noto Sans JP', 'Segoe UI', sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(kanjiText, 0, 2);

      c.restore();
    };

    drawKanjiPearl(
      centerX,
      this.topH + 62 + bobOffset,
      this.topCorrect ? this.data.correct : this.data.wrong,
      this.topCorrect,
    );
    drawKanjiPearl(
      centerX,
      this.botY - 62 - bobOffset,
      this.topCorrect ? this.data.wrong : this.data.correct,
      !this.topCorrect,
    );

    c.restore();
  }
}
let currentGate = new KanjiGate(W + 140);

// ============================================================================
// CONTROLS, STATE TRANSITIONS & EVENT LISTENERS
// ============================================================================
function handleAction() {
  ensureAudio();
  if (gameState === "PLAY") seal.swim();
}

// Cleanly resets all character coordinates & states when returning to Main Menu
function returnToMainMenu() {
  seal.reset();
  patrick.active = false;
  spongebob.active = false;
  squidward.active = false;
  plankton.active = false;
  mrKrabs.active = false;
  playerShots = [];
  burgerShots = [];
  eyeLasers = [];
  coinShots = [];
  gateParticles = [];
  popups = [];
  shakeTime = 0;
  screenFlashAlpha = 0;
  gameState = "MENU";
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    handleAction();
  }
  if (
    (e.code === "ShiftLeft" || e.code === "ShiftRight") &&
    gameState === "PLAY"
  ) {
    e.preventDefault();
    seal.dash();
  }
  if (e.code === "KeyF" && gameState === "PLAY") {
    e.preventDefault();
    seal.shootKanji();
  }
  if (e.code === "Escape" || e.code === "KeyP") {
    if (gameState === "PLAY") {
      gameState = "PAUSE";
      playSound("click");
    } else if (gameState === "PAUSE") {
      gameState = "PLAY";
      playSound("click");
    } else if (gameState === "CODEX") {
      returnToMainMenu();
      playSound("click");
    }
  }
});

let lastClickTime = 0;
canvas.addEventListener("pointerdown", (e) => {
  ensureAudio();
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) * (W / rect.width);
  const clickY = (e.clientY - rect.top) * (H / rect.height);

  if (gameState === "MENU") {
    for (let btn of LEVEL_BUTTONS) {
      if (
        clickX >= btn.x &&
        clickX <= btn.x + btn.w &&
        clickY >= btn.y &&
        clickY <= btn.y + btn.h
      ) {
        currentLevel = btn.level;
        bestScore = parseInt(
          localStorage.getItem("seal_kanji_best_" + currentLevel) || "0",
        );
        playSound("click");
        return;
      }
    }
    if (
      clickX >= startBtn.x &&
      clickX <= startBtn.x + startBtn.w &&
      clickY >= startBtn.y &&
      clickY <= startBtn.y + startBtn.h
    ) {
      startGame();
      return;
    }
    if (
      clickX >= codexBtn.x &&
      clickX <= codexBtn.x + codexBtn.w &&
      clickY >= codexBtn.y &&
      clickY <= codexBtn.y + codexBtn.h
    ) {
      gameState = "CODEX";
      playSound("click");
      return;
    }
  } else if (gameState === "CODEX") {
    if (
      clickX >= closeCodexBtn.x &&
      clickX <= closeCodexBtn.x + closeCodexBtn.w &&
      clickY >= closeCodexBtn.y &&
      clickY <= closeCodexBtn.y + closeCodexBtn.h
    ) {
      returnToMainMenu();
      playSound("click");
      return;
    }
  } else if (gameState === "PLAY") {
    if (
      clickX >= pauseTriggerBtn.x &&
      clickX <= pauseTriggerBtn.x + pauseTriggerBtn.w &&
      clickY >= pauseTriggerBtn.y &&
      clickY <= pauseTriggerBtn.y + pauseTriggerBtn.h
    ) {
      gameState = "PAUSE";
      playSound("click");
      return;
    }
    if (e.button === 2) {
      seal.shootKanji();
    } else {
      const now = Date.now();
      if (now - lastClickTime < 280) seal.dash();
      else handleAction();
      lastClickTime = now;
    }
  } else if (gameState === "PAUSE") {
    if (
      clickX >= resumeBtn.x &&
      clickX <= resumeBtn.x + resumeBtn.w &&
      clickY >= resumeBtn.y &&
      clickY <= resumeBtn.y + resumeBtn.h
    ) {
      gameState = "PLAY";
      playSound("click");
      return;
    }
    if (
      clickX >= quitPauseBtn.x &&
      clickX <= quitPauseBtn.x + quitPauseBtn.w &&
      clickY >= quitPauseBtn.y &&
      clickY <= quitPauseBtn.y + quitPauseBtn.h
    ) {
      returnToMainMenu();
      playSound("click");
      return;
    }
  } else if (gameState === "GAMEOVER") {
    if (
      clickX >= retryBtn.x &&
      clickX <= retryBtn.x + retryBtn.w &&
      clickY >= retryBtn.y &&
      clickY <= retryBtn.y + retryBtn.h
    ) {
      startGame();
      playSound("click");
      return;
    }
    if (
      clickX >= gameOverQuitBtn.x &&
      clickX <= gameOverQuitBtn.x + gameOverQuitBtn.w &&
      clickY >= gameOverQuitBtn.y &&
      clickY <= gameOverQuitBtn.y + gameOverQuitBtn.h
    ) {
      returnToMainMenu();
      playSound("click");
      return;
    }
  }
});

function startGame() {
  seal.reset();
  patrick.active = false;
  spongebob.active = false;
  currentGate = new KanjiGate(W + 120);
  bonusFishes = [new GoldenFish(W + 360, 350)];
  powerUps = [];
  popups = [];
  playerShots = [];
  burgerShots = [];
  eyeLasers = [];
  coinShots = [];
  gateParticles = [];
  score = 0;
  combo = 0;
  maxCombo = 0;
  lives = 3;
  fishCount = 0;
  gatesPassedCount = 0;
  speed = BASE_SCROLL_SPD;
  slowMoTimer = 0;
  screenFlashAlpha = 0;
  squidward.active = false;
  plankton.active = false;
  mrKrabs.active = false;
  gameState = "PLAY";
}

function triggerGameOver() {
  playSound("hit");
  gameState = "GAMEOVER";
  shakeTime = 16;
  shakeAmp = 8;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(
      "seal_kanji_best_" + currentLevel,
      bestScore.toString(),
    );
  }
}

// ============================================================================
// DELTA-TIME SMOOTHED 60 FPS MAIN LOOP
// ============================================================================
let lastFrameTime = performance.now();

function loop(now = performance.now()) {
  // Compute normalized delta-time factor (clamped to prevent tab-switch jumps)
  const elapsed = Math.min(32, Math.max(8, now - lastFrameTime));
  const dtScale = elapsed / 16.667;
  lastFrameTime = now;

  frameCount++;

  const effectiveSpeed = (slowMoTimer > 0 ? speed * 0.52 : speed) * dtScale;
  const isHighSpeed =
    gameState === "PLAY" &&
    ((typeof combo !== "undefined" && combo >= 3) || seal.dashTimer > 0);

  // Keep ocean biosphere, parallax reefs & spores alive in MENU and PLAY
  if (gameState === "MENU" || gameState === "PLAY") {
    const bgSpd = gameState === "MENU" ? 1.4 * dtScale : effectiveSpeed;
    farReef.update(bgSpd);
    midReef.update(bgSpd);
    jellyfishes.forEach((j) => j.update(bgSpd));
    marineSpores.forEach((ms) => ms.update(bgSpd, isHighSpeed));
  }

  ambientBubbles.forEach((b) => {
    if (!b.update()) {
      b.y = H + 10;
      b.x = Math.random() * W;
    }
  });

  if (gameState === "PLAY") {
    if (slowMoTimer > 0) slowMoTimer--;

    // Fast in-place cleanup for trail bubbles & popups
    for (let i = trailBubbles.length - 1; i >= 0; i--) {
      if (!trailBubbles[i].update()) trailBubbles.splice(i, 1);
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      if (!popups[i].update()) popups.splice(i, 1);
    }

    // Update Gate Shatter Particles
    for (let i = gateParticles.length - 1; i >= 0; i--) {
      let gp = gateParticles[i];
      gp.x += gp.vx * dtScale;
      gp.y += gp.vy * dtScale;
      gp.vx *= 0.95;
      gp.vy *= 0.95;
      gp.alpha -= 0.035;
      if (gp.alpha <= 0) gateParticles.splice(i, 1);
    }

    bonusFishes.forEach((f) => f.update(effectiveSpeed));
    bonusFishes = bonusFishes.filter((f) => f.x > -50);
    powerUps.forEach((p) => p.update(effectiveSpeed));
    powerUps = powerUps.filter((p) => p.x > -50);

    playerShots.forEach((s) => s.update());
    playerShots = playerShots.filter((s) => s.x < W + 50);

    burgerShots.forEach((b) => b.update());
    burgerShots = burgerShots.filter((b) => b.x > -50);

    eyeLasers.forEach((l) => l.update());
    eyeLasers = eyeLasers.filter((l) => l.x > -60);

    coinShots.forEach((c) => c.update());
    coinShots = coinShots.filter((c) => c.x > -50);

    if (squidward.active) squidward.update();
    if (plankton.active) plankton.update();
    if (mrKrabs.active) mrKrabs.update();
    if (patrick.active) patrick.update(seal.y);
    if (spongebob.active) spongebob.update(seal.y);

    // Subtle natural ocean swell current acting on the seal
    seal.y += Math.sin(frameCount * 0.035) * 0.18;
    seal.update();

    // Elastic seabed bounce with sand/bubble kick-up
    if (seal.y >= H - 56) {
      seal.y = H - 56;
      seal.vy = -3.0;
      seal.scaleX = 1.15;
      seal.scaleY = 0.85;
      if (trailBubbles.length < 30) {
        for (let i = 0; i < 3; i++) {
          trailBubbles.push(
            new Bubble(seal.x + (Math.random() - 0.5) * 25, H - 46, true, true),
          );
        }
      }
    }

    // Elastic surface wave bounce
    if (seal.y <= 36) {
      seal.y = 36;
      seal.vy = Math.max(1.2, seal.vy * 0.5);
      seal.scaleX = 1.1;
      seal.scaleY = 0.9;
    }

    currentGate.update(effectiveSpeed);
    checkLogic();
  }

  let ox = 0,
    oy = 0;
  if (shakeTime > 0) {
    shakeTime--;
    ox = (Math.random() - 0.5) * shakeAmp;
    oy = (Math.random() - 0.5) * shakeAmp;
  }

  ctx.save();
  ctx.translate(ox, oy);

  if (gameState === "MENU") {
    drawMenu();
  } else if (gameState === "CODEX") {
    drawCodex();
  } else {
    drawDynamicOceanBackdrop(ctx, frameCount);
    kelpForest.forEach((k) => k.draw(ctx, frameCount));
    ambientBubbles.forEach((b) => b.draw(ctx));

    currentGate.draw(ctx);

    // Render Orb Shatter Particles
    for (let gp of gateParticles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, gp.alpha);
      ctx.fillStyle = gp.color;
      ctx.beginPath();
      ctx.arc(gp.x, gp.y, gp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    bonusFishes.forEach((f) => f.draw(ctx));
    powerUps.forEach((p) => p.draw(ctx));
    burgerShots.forEach((b) => b.draw(ctx));
    eyeLasers.forEach((l) => l.draw(ctx));
    coinShots.forEach((c) => c.draw(ctx));
    playerShots.forEach((s) => s.draw(ctx));

    if (squidward.active) squidward.draw(ctx);
    if (plankton.active) plankton.draw(ctx);
    if (mrKrabs.active) mrKrabs.draw(ctx);
    if (patrick.active) patrick.draw(ctx);
    if (spongebob.active) spongebob.draw(ctx);

    trailBubbles.forEach((b) => b.draw(ctx));
    seal.draw(ctx);
    popups.forEach((p) => p.draw(ctx));

    // Screen Flash Overlay Feedback
    if (screenFlashAlpha > 0 && screenFlashColor) {
      ctx.save();
      ctx.fillStyle = screenFlashColor;
      ctx.globalAlpha = Math.max(0, screenFlashAlpha);
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      screenFlashAlpha -= 0.025;
    }

    drawHUD();

    if (gameState === "PAUSE") drawPauseMenu();
    if (gameState === "GAMEOVER") drawGameOver();
  }

  ctx.restore();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
