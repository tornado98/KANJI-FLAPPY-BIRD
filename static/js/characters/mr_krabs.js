// ============================================================================
// BOSS: MR. KRABS (Claw Snapping & Golden Coin Barrage)
// ============================================================================
class MrKrabsBoss extends BaseEntity {
  constructor() {
    super(W + 150, 320, 75, 95);
    this.active = false;
    this.targetX = W - 180;
    this.bob = 0;
    this.hp = 7;
    this.maxHp = 7;
    this.attackTimer = 0;
    this.hitFlicker = 0;
    this.clawSnapAngle = 0;
    this.cashParticles = [];
  }

  spawn() {
    this.active = true;
    this.x = W + 150;
    this.y = 260 + Math.random() * 140;
    this.hp = this.maxHp;
    this.attackTimer = 35;
    this.cashParticles = [];
    if (typeof popups !== "undefined") {
      popups.push(
        new PopupText(
          "🦀 MR. KRABS WANTS YOUR MONEY! 💰",
          W / 2,
          110,
          "#facc15",
          30,
        ),
      );
    }
  }

  triggerHitEffects() {
    this.hitFlicker = 15;
    // Spawn flying money notes when hit
    for (let i = 0; i < 4; i++) {
      this.cashParticles.push({
        x: this.x + (Math.random() - 0.5) * 30,
        y: this.y - 10,
        vx: (Math.random() - 0.5) * 4,
        vy: -(2 + Math.random() * 2),
        alpha: 1.0,
        symbol: i % 2 === 0 ? "💵" : "🪙",
      });
    }
  }

  update() {
    if (!this.active) return;
    this.bob += 0.06;
    this.y += Math.sin(this.bob) * 2.4;
    if (this.x > this.targetX) this.x -= 2.8;
    if (this.hitFlicker > 0) this.hitFlicker--;
    if (this.clawSnapAngle > 0) this.clawSnapAngle -= 0.08;

    // Update money particles
    for (let cp of this.cashParticles) {
      cp.x += cp.vx;
      cp.y += cp.vy;
      cp.alpha -= 0.03;
    }
    this.cashParticles = this.cashParticles.filter((cp) => cp.alpha > 0);

    this.attackTimer++;
    if (this.attackTimer > 95) {
      this.attackTimer = 0;
      this.clawSnapAngle = 0.65;
      if (typeof coinShots !== "undefined") {
        // Shoot double spread of spinning coins
        coinShots.push(new CoinProjectile(this.x - 42, this.y - 5, -0.7));
        coinShots.push(new CoinProjectile(this.x - 42, this.y + 10, 0.7));
        if (typeof playSound === "function") playSound("fish");
      }
    }
  }

  draw(c) {
    if (!this.active) return;

    // Draw money hit particles
    for (let cp of this.cashParticles) {
      c.save();
      c.globalAlpha = Math.max(0, cp.alpha);
      c.font = "18px sans-serif";
      c.textAlign = "center";
      c.fillText(cp.symbol, cp.x, cp.y);
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y);

    if (this.hitFlicker > 0 && Math.floor(this.hitFlicker / 3) % 2 === 0) {
      c.restore();
      return;
    }

    const crabRed = "#dc2626";
    const darkRed = "#7f1d1d";

    // Walking Crab Legs
    c.strokeStyle = crabRed;
    c.lineWidth = 5;
    c.lineCap = "round";
    for (let side of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        const legWave = Math.sin(this.bob * 3 + i + side) * 5;
        c.beginPath();
        c.moveTo(side * (12 + i * 8), 35);
        c.lineTo(side * (18 + i * 10), 55 + legWave);
        c.stroke();
      }
    }

    // Navy Blue Pants & Black Gold-Buckle Belt
    c.fillStyle = "#1e3a8a";
    c.strokeStyle = "#172554";
    c.lineWidth = 2.5;
    c.beginPath();
    c.roundRect(-28, 16, 56, 22, 8);
    c.fill();
    c.stroke();

    // Black Belt & Gold Buckle
    c.fillStyle = "#0f172a";
    c.fillRect(-28, 14, 56, 6);
    c.fillStyle = "#facc15";
    c.fillRect(-6, 13, 12, 8);

    // Light Blue Sailor Shirt & Red Torso
    c.fillStyle = "#93c5fd";
    c.strokeStyle = "#1e40af";
    c.lineWidth = 2.5;
    c.beginPath();
    c.roundRect(-30, -14, 60, 30, 12);
    c.fill();
    c.stroke();

    // Red Upper Chest & Head
    c.fillStyle = crabRed;
    c.strokeStyle = darkRed;
    c.beginPath();
    c.ellipse(0, -14, 28, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Tall Telescopic Eye Stalks
    const eyeSway = Math.sin(this.bob * 1.5) * 2.5;
    for (let ex of [-11, 11]) {
      c.fillStyle = crabRed;
      c.strokeStyle = darkRed;
      c.lineWidth = 2.5;
      c.beginPath();
      c.roundRect(ex - 4 + eyeSway * 0.3, -52, 8, 36, 4);
      c.fill();
      c.stroke();

      // Eyeball Top
      c.fillStyle = "#fef08a";
      c.beginPath();
      c.ellipse(ex + eyeSway * 0.5, -52, 7.5, 9, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Greedy Pupil ($ eyes when attacking)
      c.fillStyle = "#000000";
      c.beginPath();
      c.arc(ex - 1 + eyeSway * 0.5, -52, 3, 0, Math.PI * 2);
      c.fill();
    }

    // Pointy Crinkle Nose & Wide Greedy Grin
    c.fillStyle = crabRed;
    c.beginPath();
    c.moveTo(0, -22);
    c.lineTo(-10, -15);
    c.lineTo(0, -12);
    c.fill();

    c.fillStyle = "#ffffff";
    c.strokeStyle = darkRed;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(0, -8, 14, 0, Math.PI);
    c.fill();
    c.stroke();

    // Giant Animated Snapping Pincer Claws
    const snap = this.clawSnapAngle + Math.abs(Math.sin(this.bob * 2)) * 0.18;
    c.save();
    c.translate(-34, -4);
    c.rotate(0.2);

    // Upper Claw Jaw
    c.save();
    c.rotate(-snap);
    c.fillStyle = crabRed;
    c.strokeStyle = darkRed;
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(-16, -8, 18, 9, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    // Lower Claw Jaw
    c.save();
    c.rotate(snap);
    c.fillStyle = crabRed;
    c.strokeStyle = darkRed;
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(-16, 6, 16, 7, 0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    c.restore();

    // Boss Health Bar
    const barW = 64;
    c.fillStyle = "rgba(0,0,0,0.65)";
    c.beginPath();
    c.roundRect(-barW / 2, -74, barW, 8, 4);
    c.fill();
    c.fillStyle = "#facc15";
    c.beginPath();
    c.roundRect(-barW / 2, -74, barW * (this.hp / this.maxHp), 8, 4);
    c.fill();

    c.restore();
  }
}
