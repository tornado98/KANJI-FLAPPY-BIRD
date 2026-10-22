// ============================================================================
// GLOBAL CANVAS DIMENSIONS & SHARED PHYSICS CONSTANTS
// Declared here first to ensure availability across all dependent scripts
// ============================================================================
const W = 1180;
const H = 720;

const BUOYANCY_GRAVITY = 0.22;
const SWIM_THRUST_IMPULSE = -6.5;
const WATER_VISCOUS_DRAG = 0.988;
const BASE_SCROLL_SPD = 3.4;

// ============================================================================
// PROJECTILE & PARTICLE CLASSES
// ============================================================================
class PlayerKanjiShot {
  constructor(x, y, char, fromPatrick = false) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.fromPatrick = fromPatrick;
    this.vx = fromPatrick ? 12.0 : 10.5;
    this.r = fromPatrick ? 20 : 18;
    this.spin = 0;
  }
  update() {
    this.x += this.vx;
    this.spin += 0.08;
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y);

    c.fillStyle = this.fromPatrick
      ? "rgba(251, 146, 60, 0.4)"
      : "rgba(56, 189, 248, 0.4)";
    c.beginPath();
    c.arc(0, 0, this.r + 4, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = this.fromPatrick ? "#ea580c" : "#0284c7";
    c.strokeStyle = this.fromPatrick ? "#f97316" : "#38bdf8";
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(0, 0, this.r, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.rotate(Math.sin(this.spin) * 0.2);
    c.fillStyle = "#ffffff";
    c.font = "bold 20px 'Segoe UI', sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(this.char, 0, 0);
    c.restore();
  }
  getBounds() {
    return {
      x: this.x - this.r,
      y: this.y - this.r,
      w: this.r * 2,
      h: this.r * 2,
    };
  }
}

class BurgerShot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = -(5.8 + Math.random() * 1.6);
    this.vy = (Math.random() - 0.5) * 1.8;
    this.rot = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += 0.14;
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rot);

    c.fillStyle = "#f59e0b";
    c.beginPath();
    c.arc(0, -3, 14, Math.PI, 0);
    c.fill();

    c.fillStyle = "#fef3c7";
    c.fillRect(-6, -8, 2, 2);
    c.fillRect(3, -9, 2, 2);
    c.fillRect(-2, -5, 2, 2);

    c.fillStyle = "#78350f";
    c.fillRect(-14, -2, 28, 5);

    c.fillStyle = "#84cc16";
    c.fillRect(-15, 2, 30, 3);
    c.fillStyle = "#facc15";
    c.fillRect(-12, 1, 10, 2);

    c.fillStyle = "#f59e0b";
    c.fillRect(-14, 5, 28, 5);

    c.restore();
  }
  getBounds() {
    return { x: this.x - 14, y: this.y - 12, w: 28, h: 24 };
  }
}

// ============================================================================
// MAIN CHARACTER: KAWAII BABY SEAL
// ============================================================================
const seal = {
  defaultX: 220,
  x: 220,
  y: 330,
  vy: 0,
  rot: 0,
  blinkTimer: 0,
  isBlinking: false,
  dashTimer: 0,
  dashCooldown: 0,
  dashMaxCooldown: 120,
  invulnerableTimer: 0,
  hasShield: false,
  flipperCycle: 0,
  flipperIntensity: 0,
  tailCycle: 0,

  reset() {
    this.x = this.defaultX;
    this.y = 330;
    this.vy = 0;
    this.rot = 0;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.invulnerableTimer = 0;
    this.hasShield = false;
    this.flipperCycle = 0;
    this.flipperIntensity = 0;
    this.tailCycle = 0;
  },
  swim() {
    this.vy = SWIM_THRUST_IMPULSE;
    this.flipperIntensity = 1.0;
    if (typeof playSound === "function") playSound("swim");
    const isFever = typeof combo !== "undefined" && combo >= 3;
    if (typeof trailBubbles !== "undefined") {
      for (let i = 0; i < 5; i++) {
        trailBubbles.push(
          new Bubble(
            this.x - 38,
            this.y + 12 + (Math.random() - 0.5) * 14,
            true,
            isFever,
          ),
        );
      }
    }
  },
  dash() {
    if (this.dashCooldown <= 0 && this.dashTimer <= 0) {
      this.dashTimer = 15;
      this.dashCooldown = this.dashMaxCooldown;
      this.flipperIntensity = 1.6;
      if (typeof playSound === "function") playSound("dash");
      if (typeof trailBubbles !== "undefined") {
        for (let i = 0; i < 12; i++) {
          trailBubbles.push(
            new Bubble(
              this.x - 20,
              this.y + (Math.random() - 0.5) * 25,
              true,
              true,
            ),
          );
        }
      }
    }
  },
  shootKanji() {
    const char =
      typeof currentGate !== "undefined" && currentGate && currentGate.data
        ? currentGate.data.correct
        : "水";
    if (typeof playerShots !== "undefined") {
      playerShots.push(new PlayerKanjiShot(this.x + 30, this.y, char, false));
    }
    if (typeof playSound === "function") playSound("shoot");
  },
  update() {
    if (this.dashTimer > 0) {
      this.dashTimer--;
      this.x = Math.min(this.defaultX + 90, this.x + 10);
      this.vy = 0;
    } else {
      this.vy += BUOYANCY_GRAVITY;
      this.vy *= WATER_VISCOUS_DRAG;
      this.y += this.vy;
      if (this.x > this.defaultX)
        this.x = Math.max(this.defaultX, this.x - 2.2);
    }

    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;

    if (this.flipperIntensity > 0.05) {
      this.flipperCycle += 0.35;
      this.tailCycle += 0.28;
      this.flipperIntensity *= 0.92;
    } else {
      this.flipperCycle =
        Math.sin((typeof frameCount !== "undefined" ? frameCount : 0) * 0.04) *
        0.08;
      this.tailCycle =
        Math.sin((typeof frameCount !== "undefined" ? frameCount : 0) * 0.04) *
        0.12;
      this.flipperIntensity = 0;
    }

    const targetRot = Math.max(-0.35, Math.min(0.44, this.vy * 0.055));
    this.rot += (targetRot - this.rot) * 0.12;

    this.blinkTimer++;
    if (this.blinkTimer > 180) {
      this.isBlinking = true;
      if (this.blinkTimer > 192) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    if (this.y < 35) {
      this.y = 35;
      this.vy = Math.max(0, this.vy);
    }
    if (this.y > H - 55) {
      this.y = H - 55;
      this.vy = Math.min(0, this.vy);
    }
  },
  draw(c) {
    if (
      this.invulnerableTimer > 0 &&
      Math.floor(this.invulnerableTimer / 4) % 2 === 0
    )
      return;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rot);

    if ((typeof combo !== "undefined" && combo >= 3) || this.dashTimer > 0) {
      c.fillStyle = "rgba(254, 240, 138, 0.25)";
      c.beginPath();
      c.ellipse(0, 0, 52, 38, 0, 0, Math.PI * 2);
      c.fill();
    }
    if (this.hasShield) {
      c.strokeStyle = "rgba(56, 189, 248, 0.8)";
      c.fillStyle = "rgba(56, 189, 248, 0.15)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(0, 0, 42, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }

    c.lineCap = "round";
    c.lineJoin = "round";

    // Hydrodynamic Tail Fin
    c.save();
    c.translate(-40, 2);
    const dynamicTailAngle =
      Math.sin(this.tailCycle) * (0.2 + this.flipperIntensity * 0.5);
    c.rotate(dynamicTailAngle);
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(-15, -15, -28, -10, -23, 2);
    c.bezierCurveTo(-32, 4, -23, 20, -11, 10);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();

    // Chubby Kawaii Body Contour
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(10, -30);
    c.bezierCurveTo(25, -38, 42, -20, 40, 0);
    c.bezierCurveTo(44, 24, 20, 34, -4, 30);
    c.bezierCurveTo(-28, 28, -40, 15, -42, 2);
    c.bezierCurveTo(-36, -4, -20, -2, -11, -13);
    c.bezierCurveTo(-7, -20, -2, -26, 10, -30);
    c.closePath();
    c.fill();
    c.stroke();

    // Body Spots
    c.fillStyle = "#c5d1dc";
    c.beginPath();
    c.arc(22, -24, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(15, -27, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-9, -4, 3.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-17, 2, 4, 0, Math.PI * 2);
    c.fill();

    // Rosy Kawaii Cheeks
    c.fillStyle = "rgba(255, 140, 165, 0.85)";
    c.beginPath();
    c.ellipse(28, 6, 9, 6.5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255, 255, 255, 0.6)";
    c.beginPath();
    c.arc(26, 4, 1.8, 0, Math.PI * 2);
    c.fill();

    // Big Anime Eyes with Catchlights
    c.fillStyle = "#1e293b";
    if (this.isBlinking) {
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(17, -9);
      c.lineTo(26, -9);
      c.stroke();
      c.beginPath();
      c.moveTo(33, -8);
      c.lineTo(42, -8);
      c.stroke();
    } else {
      c.beginPath();
      c.arc(22, -9, 5.2, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(37, -8, 5.2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(21, -11, 2.0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(36, -10, 2.0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(23.5, -7.5, 1.0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(38.5, -6.5, 1.0, 0, Math.PI * 2);
      c.fill();
    }

    // Muzzle & Heart Nose
    c.fillStyle = "#e2e8f0";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(33, 2, 11, 7.5, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.fillStyle = "#2b303a";
    c.beginPath();
    c.ellipse(33, -1, 4.5, 3.2, 0, 0, Math.PI * 2);
    c.fill();

    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(33, 2);
    c.lineTo(33, 5);
    c.moveTo(28, 4.5);
    c.quadraticCurveTo(33, 7.5, 38, 4.5);
    c.stroke();

    // Dynamic Whiskers with Water Inertia
    const whiskerDrift = -this.vy * 0.35;
    c.strokeStyle = "#1e293b";
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(22, 2);
    c.lineTo(13, 1 + whiskerDrift);
    c.stroke();
    c.beginPath();
    c.moveTo(23, 6);
    c.lineTo(14, 7 + whiskerDrift);
    c.stroke();
    c.beginPath();
    c.moveTo(42, 0);
    c.lineTo(51, -2 + whiskerDrift);
    c.stroke();
    c.beginPath();
    c.moveTo(43, 4);
    c.lineTo(52, 3 + whiskerDrift);
    c.stroke();

    // Active Front Flipper
    c.save();
    c.translate(6, 18);
    const dynamicFlipperAngle =
      -Math.sin(this.flipperCycle) * (0.15 + this.flipperIntensity * 0.75);
    c.rotate(dynamicFlipperAngle);
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 4;
    c.beginPath();
    c.ellipse(0, 8, 9, 15, 0.25, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    c.restore();
  },
  getBounds() {
    return { x: this.x - 28, y: this.y - 20, w: 58, h: 40 };
  },
};

// ============================================================================
// ALLY: PATRICK STAR COMPANION
// ============================================================================
class PatrickCompanion {
  constructor() {
    this.active = false;
    this.x = -80;
    this.y = 300;
    this.targetX = 110;
    this.bob = 0;
    this.shootTimer = 0;
  }
  summon() {
    if (!this.active) {
      this.active = true;
      this.x = -60;
      if (typeof playSound === "function") playSound("patrick");
      if (typeof popups !== "undefined") {
        popups.push(
          new PopupText(
            "🌟 PATRICK STAR HAS JOINED! 🌟",
            W / 2,
            140,
            "#fb923c",
            30,
          ),
        );
      }
    }
  }
  update(sealY) {
    if (!this.active) return;
    this.bob += 0.06;
    this.y += (sealY + 40 + Math.sin(this.bob) * 15 - this.y) * 0.08;
    if (this.x < this.targetX) this.x += 2.5;

    if (typeof squidward !== "undefined" && squidward.active) {
      this.shootTimer++;
      if (this.shootTimer > 60) {
        this.shootTimer = 0;
        const char =
          typeof currentGate !== "undefined" && currentGate && currentGate.data
            ? currentGate.data.correct
            : "星";
        if (typeof playerShots !== "undefined") {
          playerShots.push(
            new PlayerKanjiShot(this.x + 35, this.y - 10, char, true),
          );
        }
        if (typeof playSound === "function") playSound("shoot");
      }
    }
  }
  draw(c) {
    if (!this.active) return;
    c.save();
    c.translate(this.x, this.y);

    c.fillStyle = "rgba(253, 186, 116, 0.25)";
    c.beginPath();
    c.arc(0, 0, 44, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = "#f472b6";
    c.strokeStyle = "#db2777";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, -38);
    c.quadraticCurveTo(8, -15, 24, -12);
    c.quadraticCurveTo(16, 4, 18, 22);
    c.quadraticCurveTo(0, 18, -18, 22);
    c.quadraticCurveTo(-16, 4, -24, -12);
    c.quadraticCurveTo(-8, -15, 0, -38);
    c.closePath();
    c.fill();
    c.stroke();

    c.fillStyle = "#84cc16";
    c.strokeStyle = "#4d7c0f";
    c.lineWidth = 2.5;
    c.beginPath();
    c.roundRect(-16, 8, 32, 16, 4);
    c.fill();
    c.stroke();

    c.fillStyle = "#a855f7";
    c.beginPath();
    c.arc(-8, 14, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(6, 16, 2.5, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = "#ffffff";
    c.beginPath();
    c.arc(-5, -16, 4.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(5, -16, 4.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#000000";
    c.beginPath();
    c.arc(-4, -16, 2, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(6, -16, 2, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = "#9f1239";
    c.strokeStyle = "#881337";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(0, -6, 7, 0, Math.PI);
    c.fill();
    c.stroke();

    c.restore();
  }
}

// ============================================================================
// BOSS: SQUIDWARD
// ============================================================================
class SquidwardBoss {
  constructor() {
    this.active = false;
    this.x = W + 150;
    this.targetX = W - 190;
    this.y = 300;
    this.bob = 0;
    this.hp = 6;
    this.maxHp = 6;
    this.attackTimer = 0;
    this.hitFlicker = 0;
    this.throwArmAngle = 0;
  }
  spawn() {
    this.active = true;
    this.x = W + 150;
    this.y = 260 + Math.random() * 120;
    this.hp = this.maxHp;
    this.attackTimer = 40;
    if (typeof popups !== "undefined") {
      popups.push(
        new PopupText(
          "⚠️ SQUIDWARD IS ATTACKING! ⚠️",
          W / 2,
          120,
          "#f43f5e",
          32,
        ),
      );
    }
  }
  update() {
    if (!this.active) return;
    this.bob += 0.055;
    this.y += Math.sin(this.bob) * 2.2;
    if (this.x > this.targetX) this.x -= 2.6;
    if (this.hitFlicker > 0) this.hitFlicker--;
    if (this.throwArmAngle > 0) this.throwArmAngle -= 0.1;

    this.attackTimer++;
    if (this.attackTimer > 85) {
      this.attackTimer = 0;
      this.throwArmAngle = 0.8;
      if (typeof burgerShots !== "undefined") {
        burgerShots.push(new BurgerShot(this.x - 35, this.y + 12));
      }
    }
  }
  draw(c) {
    if (!this.active) return;
    c.save();
    c.translate(this.x, this.y);

    if (this.hitFlicker > 0 && Math.floor(this.hitFlicker / 3) % 2 === 0) {
      c.restore();
      return;
    }

    const skinColor = "#6ee7b7";
    const outlineColor = "#0f766e";

    c.strokeStyle = skinColor;
    c.lineWidth = 6;
    c.lineCap = "round";
    for (let i = -14; i <= 14; i += 7) {
      const wave = Math.sin(this.bob * 2.5 + i) * 8;
      c.beginPath();
      c.moveTo(i, 48);
      c.quadraticCurveTo(i + wave, 68, i - wave, 86);
      c.stroke();
    }

    c.fillStyle = "#b45309";
    c.strokeStyle = "#78350f";
    c.lineWidth = 2.5;
    c.beginPath();
    c.roundRect(-18, 22, 36, 26, 4);
    c.fill();
    c.stroke();

    c.save();
    c.translate(-16, 28);
    c.rotate(-this.throwArmAngle);
    c.strokeStyle = skinColor;
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-18, 6);
    c.stroke();
    c.restore();

    c.fillStyle = skinColor;
    c.strokeStyle = outlineColor;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-24, 0);
    c.bezierCurveTo(-34, -28, -26, -52, 0, -52);
    c.bezierCurveTo(26, -52, 34, -28, 24, 0);
    c.closePath();
    c.fill();
    c.stroke();

    c.fillStyle = "#fef08a";
    c.beginPath();
    c.ellipse(-11, -8, 8, 10, -0.1, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(11, -8, 8, 10, 0.1, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#831843";
    c.fillRect(-14, -8, 5, 3.5);
    c.fillRect(9, -8, 5, 3.5);

    c.fillStyle = skinColor;
    c.strokeStyle = outlineColor;
    c.beginPath();
    c.ellipse(0, 10, 10, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    const barW = 60;
    c.fillStyle = "rgba(0,0,0,0.6)";
    c.fillRect(-barW / 2, -65, barW, 8);
    c.fillStyle = "#ef4444";
    c.fillRect(-barW / 2, -65, barW * (this.hp / this.maxHp), 8);

    c.restore();
  }
  getBounds() {
    return { x: this.x - 30, y: this.y - 45, w: 60, h: 105 };
  }
}
