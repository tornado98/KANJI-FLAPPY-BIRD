// ============================================================================
// ULTRA-SMOOTH KAWAII BABY SEAL (Zero-Lag Pure Vector Particle FX)
// ============================================================================
const seal = {
  defaultX: 220,
  x: 220,
  y: 330,
  vy: 0,
  rot: 0,

  // Smooth soft-body interpolation factors
  scaleX: 1,
  scaleY: 1,

  // Animation & state timers
  blinkTimer: 0,
  isBlinking: false,
  dashTimer: 0,
  dashCooldown: 0,
  dashMaxCooldown: 120,
  invulnerableTimer: 0,
  hasShield: false,

  // Propulsion kinematics
  flipperCycle: 0,
  flipperIntensity: 0,
  tailCycle: 0,

  // Smooth Eating Animation State
  eatTimer: 0,
  eatDuration: 32,
  chewPhase: 0,

  // Hardware-accelerated pure vector FX pools (No laggy emoji text rendering)
  ripples: [],
  afterimages: [],
  starParticles: [],

  reset() {
    this.x = this.defaultX;
    this.y = 330;
    this.vy = 0;
    this.rot = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.invulnerableTimer = 0;
    this.hasShield = false;
    this.flipperCycle = 0;
    this.flipperIntensity = 0;
    this.tailCycle = 0;
    this.eatTimer = 0;
    this.chewPhase = 0;
    this.ripples = [];
    this.afterimages = [];
    this.starParticles = [];
  },

  swim() {
    this.vy = SWIM_THRUST_IMPULSE;
    this.flipperIntensity = 1.1;
    this.scaleX = 1.14;
    this.scaleY = 0.88;

    if (this.ripples.length < 6) {
      this.ripples.push({
        x: this.x - 35,
        y: this.y + 8,
        rx: 6,
        ry: 14,
        alpha: 0.7,
        color:
          typeof combo !== "undefined" && combo >= 3 ? "#facc15" : "#38bdf8",
      });
    }

    if (typeof playSound === "function") playSound("swim");
    const isFever = typeof combo !== "undefined" && combo >= 3;
    if (typeof trailBubbles !== "undefined" && trailBubbles.length < 35) {
      for (let i = 0; i < 4; i++) {
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
      this.flipperIntensity = 1.7;
      this.scaleX = 1.28;
      this.scaleY = 0.78;

      this.ripples.push({
        x: this.x,
        y: this.y,
        rx: 12,
        ry: 26,
        alpha: 0.9,
        color: "#fde047",
      });

      if (typeof playSound === "function") playSound("dash");
      if (typeof trailBubbles !== "undefined") {
        for (let i = 0; i < 8; i++) {
          trailBubbles.push(
            new Bubble(
              this.x - 20,
              this.y + (Math.random() - 0.5) * 24,
              true,
              true,
            ),
          );
        }
      }
    }
  },

  // Ultra-smooth vector eating trigger (Zero lag)
  eatFish() {
    this.eatTimer = this.eatDuration;
    this.chewPhase = 0;
    this.flipperIntensity = 1.25;

    // Gentle elastic puff without jarring jumps
    this.scaleX = 1.12;
    this.scaleY = 1.12;

    // Spawn lightweight pure-vector golden stars & rings around mouth
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 3 + (Math.random() - 0.5) * 1.4;
      const spd = 1.8 + Math.random() * 2.4;
      this.starParticles.push({
        x: this.x + 34,
        y: this.y - 2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.8,
        size: 4 + Math.random() * 4,
        alpha: 1.0,
        rot: Math.random() * Math.PI,
        color: i % 2 === 0 ? "#fde047" : "#fb7185",
      });
    }
  },

  shootKanji() {
    const char =
      typeof currentGate !== "undefined" && currentGate && currentGate.data
        ? currentGate.data.correct
        : "水";
    if (typeof playerShots !== "undefined") {
      playerShots.push(new PlayerKanjiShot(this.x + 34, this.y, char, false));
    }
    this.scaleX = 0.9;
    this.scaleY = 1.1;
    if (typeof playSound === "function") playSound("shoot");
  },

  update() {
    if (this.dashTimer > 0) {
      this.dashTimer--;
      this.x = Math.min(this.defaultX + 95, this.x + 10);
      this.vy = 0;

      if (this.dashTimer % 3 === 0) {
        this.afterimages.push({
          x: this.x,
          y: this.y,
          rot: this.rot,
          alpha: 0.45,
        });
      }
    } else {
      this.vy += BUOYANCY_GRAVITY;
      this.vy *= WATER_VISCOUS_DRAG;
      this.y += this.vy;
      if (this.x > this.defaultX)
        this.x = Math.max(this.defaultX, this.x - 2.2);
    }

    // Smooth exponential damping back to normal scale
    this.scaleX += (1.0 - this.scaleX) * 0.18;
    this.scaleY += (1.0 - this.scaleY) * 0.18;

    if (this.dashCooldown > 0) this.dashCooldown--;
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;

    if (this.eatTimer > 0) {
      this.eatTimer--;
      this.chewPhase += 0.36;
    }

    if (this.flipperIntensity > 0.05) {
      this.flipperCycle += 0.35;
      this.tailCycle += 0.3;
      this.flipperIntensity *= 0.92;
    } else {
      const fCount = typeof frameCount !== "undefined" ? frameCount : 0;
      this.flipperCycle = Math.sin(fCount * 0.05) * 0.14;
      this.tailCycle = Math.sin(fCount * 0.05) * 0.18;
      this.flipperIntensity = 0;
    }

    const targetRot = Math.max(-0.36, Math.min(0.42, this.vy * 0.052));
    this.rot += (targetRot - this.rot) * 0.15;

    this.blinkTimer++;
    if (this.blinkTimer > 170) {
      this.isBlinking = true;
      if (this.blinkTimer > 182) {
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

    // Fast in-place particle updates
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      let r = this.ripples[i];
      r.x -= 2.2;
      r.rx += 0.75;
      r.ry += 1.5;
      r.alpha -= 0.045;
      if (r.alpha <= 0) this.ripples.splice(i, 1);
    }

    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      let img = this.afterimages[i];
      img.x -= 3.0;
      img.alpha -= 0.065;
      if (img.alpha <= 0) this.afterimages.splice(i, 1);
    }

    for (let i = this.starParticles.length - 1; i >= 0; i--) {
      let sp = this.starParticles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.rot += 0.1;
      sp.alpha -= 0.038;
      if (sp.alpha <= 0) this.starParticles.splice(i, 1);
    }
  },

  draw(c) {
    // 1. Render Hydro-Ripples
    for (let r of this.ripples) {
      c.save();
      c.strokeStyle = r.color;
      c.globalAlpha = r.alpha;
      c.lineWidth = 2.2;
      c.beginPath();
      c.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }

    // 2. Render Dash Afterimage Ghosts
    for (let img of this.afterimages) {
      c.save();
      c.translate(img.x, img.y);
      c.rotate(img.rot);
      c.globalAlpha = img.alpha;
      c.fillStyle = "#38bdf8";
      c.beginPath();
      c.ellipse(0, 0, 42, 26, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    if (
      this.invulnerableTimer > 0 &&
      Math.floor(this.invulnerableTimer / 4) % 2 === 0
    )
      return;

    c.save();

    // Smooth sinusoidal chewing motion
    let finalScaleX = this.scaleX;
    let finalScaleY = this.scaleY;
    if (this.eatTimer > 0) {
      const envelope = this.eatTimer / this.eatDuration;
      const chewWave = Math.sin(this.chewPhase) * 0.055 * envelope;
      finalScaleX += chewWave;
      finalScaleY -= chewWave;
    }

    c.translate(this.x, this.y);
    c.rotate(this.rot);
    c.scale(finalScaleX, finalScaleY);

    const isFever =
      typeof combo !== "undefined" && combo >= 3 && gameState === "PLAY";

    if (isFever || this.dashTimer > 0) {
      c.fillStyle = "rgba(250, 204, 21, 0.26)";
      c.beginPath();
      c.ellipse(0, 0, 56, 40, 0, 0, Math.PI * 2);
      c.fill();
    }

    if (this.hasShield) {
      const fCount = typeof frameCount !== "undefined" ? frameCount : 0;
      c.strokeStyle = "rgba(56, 189, 248, 0.9)";
      c.fillStyle = "rgba(56, 189, 248, 0.18)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(0, 0, 45, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      c.strokeStyle = "rgba(255, 255, 255, 0.7)";
      c.lineWidth = 2.5;
      c.beginPath();
      c.arc(
        0,
        0,
        39,
        -0.8 + Math.sin(fCount * 0.05) * 0.2,
        -0.2 + Math.sin(fCount * 0.05) * 0.2,
      );
      c.stroke();
    }

    c.lineCap = "round";
    c.lineJoin = "round";

    // Back Flipper
    c.save();
    c.translate(16, 16);
    const backFlipperAngle =
      Math.sin(this.flipperCycle + 0.8) * (0.15 + this.flipperIntensity * 0.6);
    c.rotate(backFlipperAngle);
    c.fillStyle = "#cbd5e1";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 3.5;
    c.beginPath();
    c.ellipse(0, 7, 7, 13, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    // Tail Fin
    c.save();
    c.translate(-40, 2);
    const dynamicTailAngle =
      Math.sin(this.tailCycle) * (0.22 + this.flipperIntensity * 0.55);
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

    // Chubby Body
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

    // Fur Spots
    c.fillStyle = "#cbd5e1";
    c.beginPath();
    c.arc(20, -25, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(13, -27, 2.2, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-9, -4, 3.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-18, 2, 4.2, 0, Math.PI * 2);
    c.fill();

    // Rosy Cheeks
    c.fillStyle =
      this.eatTimer > 0
        ? "rgba(255, 85, 120, 0.95)"
        : "rgba(255, 140, 165, 0.85)";
    c.beginPath();
    c.ellipse(27, 6, this.eatTimer > 0 ? 10 : 9, 6.5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255, 255, 255, 0.65)";
    c.beginPath();
    c.arc(25, 4, 1.8, 0, Math.PI * 2);
    c.fill();

    // Eyes
    if (this.invulnerableTimer > 40 && gameState === "PLAY") {
      c.strokeStyle = "#1e293b";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(18, -12);
      c.lineTo(24, -9);
      c.lineTo(18, -6);
      c.moveTo(41, -11);
      c.lineTo(35, -8);
      c.lineTo(41, -5);
      c.stroke();
    } else if (this.eatTimer > 0) {
      // Smooth Curved Happy Arcs (^ _ ^)
      c.strokeStyle = "#1e293b";
      c.lineWidth = 3.2;
      c.beginPath();
      c.arc(22, -7, 4.5, Math.PI * 1.1, Math.PI * 1.9);
      c.stroke();
      c.beginPath();
      c.arc(37, -6, 4.5, Math.PI * 1.1, Math.PI * 1.9);
      c.stroke();
    } else if (this.isBlinking) {
      c.strokeStyle = "#1e293b";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(17, -9);
      c.lineTo(26, -9);
      c.moveTo(33, -8);
      c.lineTo(42, -8);
      c.stroke();
    } else {
      const gazeOffsetY = Math.max(-2, Math.min(2, this.vy * 0.25));
      c.fillStyle = "#1e293b";
      c.beginPath();
      c.arc(22, -9 + gazeOffsetY, 5.4, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(37, -8 + gazeOffsetY, 5.4, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = isFever || this.dashTimer > 0 ? "#fde047" : "#ffffff";
      c.beginPath();
      c.arc(20.8, -11 + gazeOffsetY, 2.2, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(35.8, -10 + gazeOffsetY, 2.2, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(23.5, -7.2 + gazeOffsetY, 1.1, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(38.5, -6.2 + gazeOffsetY, 1.1, 0, Math.PI * 2);
      c.fill();
    }

    // Muzzle & Nose
    c.fillStyle = "#f1f5f9";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(33, 2, 11, 7.5, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.fillStyle = "#334155";
    c.beginPath();
    c.ellipse(33, -1.2, 4.5, 3.2, 0, 0, Math.PI * 2);
    c.fill();

    // Mouth
    c.strokeStyle = "#2b303a";
    if (this.eatTimer > 0) {
      const chompOpen = (Math.sin(this.chewPhase) + 1) * 2.2;
      c.fillStyle = "#fb7185";
      c.lineWidth = 2.0;
      c.beginPath();
      c.ellipse(
        33,
        5 + chompOpen * 0.3,
        4.5,
        1.5 + chompOpen,
        0,
        0,
        Math.PI * 2,
      );
      c.fill();
      c.stroke();
    } else if (this.dashTimer > 0) {
      c.fillStyle = "#fb7185";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(33, 5, 3.2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    } else {
      c.lineWidth = 2.2;
      c.beginPath();
      c.moveTo(33, 2);
      c.lineTo(33, 4.5);
      c.moveTo(28, 4.5);
      c.quadraticCurveTo(30.5, 7.5, 33, 4.5);
      c.quadraticCurveTo(35.5, 7.5, 38, 4.5);
      c.stroke();
    }

    // Whiskers
    const whiskerDrift =
      -this.vy * 0.4 + (this.eatTimer > 0 ? Math.sin(this.chewPhase) * 2.2 : 0);
    c.strokeStyle = "#1e293b";
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(23, 2);
    c.quadraticCurveTo(17, 0, 12, 2 + whiskerDrift);
    c.moveTo(24, 5.5);
    c.quadraticCurveTo(18, 5, 13, 8 + whiskerDrift);
    c.moveTo(42, 0);
    c.quadraticCurveTo(47, -2, 52, -1 + whiskerDrift);
    c.moveTo(43, 3.5);
    c.quadraticCurveTo(48, 3, 53, 5 + whiskerDrift);
    c.stroke();

    // Front Flipper
    c.save();
    c.translate(5, 18);
    const eatFlap =
      this.eatTimer > 0 ? Math.sin(this.chewPhase * 1.4) * 0.32 : 0;
    const dynamicFlipperAngle =
      -Math.sin(this.flipperCycle) * (0.18 + this.flipperIntensity * 0.78) +
      eatFlap;
    c.rotate(dynamicFlipperAngle);
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#2b303a";
    c.lineWidth = 4;
    c.beginPath();
    c.ellipse(0, 8, 9.5, 15.5, 0.25, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    c.restore();

    // 3. Render Pure-Vector Star Particles (Zero lag!)
    for (let sp of this.starParticles) {
      c.save();
      c.translate(sp.x, sp.y);
      c.rotate(sp.rot);
      c.globalAlpha = sp.alpha;
      c.fillStyle = sp.color;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(
          Math.cos((i * Math.PI) / 2) * sp.size,
          Math.sin((i * Math.PI) / 2) * sp.size,
        );
        c.lineTo(
          Math.cos(((i + 0.5) * Math.PI) / 2) * (sp.size * 0.4),
          Math.sin(((i + 0.5) * Math.PI) / 2) * (sp.size * 0.4),
        );
      }
      c.closePath();
      c.fill();
      c.restore();
    }
  },

  getBounds() {
    return { x: this.x - 28, y: this.y - 20, w: 58, h: 40 };
  },
};
