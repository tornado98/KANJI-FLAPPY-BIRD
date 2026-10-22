// ============================================================================
// BOSS: SQUIDWARD (Animated Tentacles, Spatula Throw & Rage Steam FX)
// ============================================================================
class SquidwardBoss extends BaseEntity {
  constructor() {
    super(W + 150, 300, 60, 105);
    this.active = false;
    this.targetX = W - 190;
    this.bob = 0;
    this.hp = 6;
    this.maxHp = 6;
    this.attackTimer = 0;
    this.hitFlicker = 0;
    this.throwArmAngle = 0;
    this.steamPuffs = [];
  }

  spawn() {
    this.active = true;
    this.x = W + 150;
    this.y = 260 + Math.random() * 120;
    this.hp = this.maxHp;
    this.attackTimer = 40;
    this.steamPuffs = [];
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

  triggerRageSteam() {
    this.hitFlicker = 16;
    for (let i = 0; i < 4; i++) {
      this.steamPuffs.push({
        x: this.x + (Math.random() - 0.5) * 40,
        y: this.y - 45,
        vy: -(1.5 + Math.random() * 1.5),
        r: 6 + Math.random() * 6,
        alpha: 0.9,
      });
    }
  }

  update() {
    if (!this.active) return;
    this.bob += 0.06;
    this.y += Math.sin(this.bob) * 2.2;
    if (this.x > this.targetX) this.x -= 2.6;
    if (this.hitFlicker > 0) this.hitFlicker--;
    if (this.throwArmAngle > 0) this.throwArmAngle -= 0.09;

    for (let sp of this.steamPuffs) {
      sp.y += sp.vy;
      sp.r += 0.25;
      sp.alpha -= 0.035;
    }
    this.steamPuffs = this.steamPuffs.filter((sp) => sp.alpha > 0);

    this.attackTimer++;
    if (this.attackTimer > 85) {
      this.attackTimer = 0;
      this.throwArmAngle = 0.95;
      if (typeof burgerShots !== "undefined") {
        burgerShots.push(new BurgerShot(this.x - 35, this.y + 12));
      }
    }
  }

  draw(c) {
    if (!this.active) return;

    // Render Rage Steam Puffs
    for (let sp of this.steamPuffs) {
      c.save();
      c.fillStyle = `rgba(248, 250, 252, ${Math.max(0, sp.alpha)})`;
      c.beginPath();
      c.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y);

    if (this.hitFlicker > 0 && Math.floor(this.hitFlicker / 3) % 2 === 0) {
      c.restore();
      return;
    }

    const isAngry = this.hitFlicker > 0 || this.hp <= 2;
    const skinColor = isAngry ? "#fda4af" : "#6ee7b7";
    const outlineColor = isAngry ? "#9f1239" : "#0f766e";

    // 4 Waving Octopus Tentacles with Suction Cups
    c.strokeStyle = skinColor;
    c.lineWidth = 6.5;
    c.lineCap = "round";
    for (let i = -15; i <= 15; i += 10) {
      const wave1 = Math.sin(this.bob * 2.8 + i) * 10;
      const wave2 = Math.cos(this.bob * 2.8 + i) * 10;
      c.beginPath();
      c.moveTo(i, 46);
      c.bezierCurveTo(i + wave1, 62, i - wave2, 74, i + wave2 * 0.5, 88);
      c.stroke();
    }

    // Brown Krusty Krab Shirt
    c.fillStyle = "#b45309";
    c.strokeStyle = "#78350f";
    c.lineWidth = 2.5;
    c.beginPath();
    c.roundRect(-18, 22, 36, 26, 5);
    c.fill();
    c.stroke();

    // Throwing Arm with Spatula
    c.save();
    c.translate(-16, 28);
    c.rotate(-this.throwArmAngle);
    c.strokeStyle = skinColor;
    c.lineWidth = 5.5;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-22, 6);
    c.stroke();

    // Spatula
    c.strokeStyle = "#94a3b8";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-22, 6);
    c.lineTo(-34, 2);
    c.stroke();
    c.restore();

    // Large Bald Forehead & Head
    c.fillStyle = skinColor;
    c.strokeStyle = outlineColor;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-24, 0);
    c.bezierCurveTo(-36, -28, -28, -54, 0, -54);
    c.bezierCurveTo(28, -54, 36, -28, 24, 0);
    c.bezierCurveTo(22, 18, 12, 24, 0, 24);
    c.bezierCurveTo(-12, 24, -22, 18, -24, 0);
    c.closePath();
    c.fill();
    c.stroke();

    // Forehead Wrinkles
    c.strokeStyle = outlineColor;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-12, -40);
    c.quadraticCurveTo(0, -43, 12, -40);
    c.moveTo(-9, -34);
    c.quadraticCurveTo(0, -37, 9, -34);
    c.stroke();

    // Half-lidded Annoyed Eyes
    c.fillStyle = "#fef08a";
    c.strokeStyle = outlineColor;
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(-11, -8, 8, 10, -0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(11, -8, 8, 10, 0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Heavy Droopy Eyelids
    c.fillStyle = skinColor;
    c.beginPath();
    c.arc(-11, -8, 8.5, Math.PI, 0);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(11, -8, 8.5, Math.PI, 0);
    c.fill();
    c.stroke();

    // Red Rectangular Pupils
    c.fillStyle = "#831843";
    c.fillRect(-14, -7, 5, 4);
    c.fillRect(9, -7, 5, 4);

    // Iconic Droopy Nose
    c.fillStyle = skinColor;
    c.strokeStyle = outlineColor;
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(0, 10, 10, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Boss Health Bar
    const barW = 60;
    c.fillStyle = "rgba(0,0,0,0.65)";
    c.beginPath();
    c.roundRect(-barW / 2, -68, barW, 8, 4);
    c.fill();
    c.fillStyle = "#ef4444";
    c.beginPath();
    c.roundRect(-barW / 2, -68, barW * (this.hp / this.maxHp), 8, 4);
    c.fill();

    c.restore();
  }
}
