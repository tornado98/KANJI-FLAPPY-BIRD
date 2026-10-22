// ============================================================================
// BOSS: PLANKTON (Jet Thruster Submarine & Ocular Laser Lock-on)
// ============================================================================
class PlanktonBoss extends BaseEntity {
  constructor() {
    super(W + 120, 200, 48, 44);
    this.active = false;
    this.targetX = W - 140;
    this.bob = 0;
    this.hp = 4;
    this.maxHp = 4;
    this.laserTimer = 0;
    this.hitFlicker = 0;
    this.charging = false;
  }

  spawn() {
    this.active = true;
    this.x = W + 120;
    this.y = 150 + Math.random() * (H - 300);
    this.hp = this.maxHp;
    this.laserTimer = 30;
    this.charging = false;
    if (typeof popups !== "undefined") {
      popups.push(
        new PopupText(
          "⚠️ PLANKTON EYE LASER ONLINE! ⚠️",
          W / 2,
          100,
          "#ef4444",
          30,
        ),
      );
    }
  }

  update() {
    if (!this.active) return;
    this.bob += 0.09;
    this.y += Math.sin(this.bob) * 3.0;
    if (this.x > this.targetX) this.x -= 3.2;
    if (this.hitFlicker > 0) this.hitFlicker--;

    this.laserTimer++;
    if (this.laserTimer > 70) {
      this.charging = true;
    }

    if (this.laserTimer > 92) {
      this.laserTimer = 0;
      this.charging = false;
      if (typeof eyeLasers !== "undefined") {
        eyeLasers.push(new EyeLaserBeam(this.x - 18, this.y));
        if (typeof playSound === "function") playSound("shoot");
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

    // Rear Submarine Plasma Thruster Flame
    const flameFlicker = 12 + Math.sin(this.bob * 6) * 6;
    c.fillStyle = "#f97316";
    c.beginPath();
    c.moveTo(22, -6);
    c.lineTo(22 + flameFlicker, 0);
    c.lineTo(22, 6);
    c.closePath();
    c.fill();

    // Metallic Submarine Pod Base
    c.fillStyle = "#475569";
    c.strokeStyle = "#1e293b";
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(0, 6, 22, 0, Math.PI);
    c.fill();
    c.stroke();

    // Glass Cockpit Dome
    c.fillStyle = "rgba(56, 189, 248, 0.38)";
    c.strokeStyle = "#38bdf8";
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(0, 0, 24, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Plankton Body Inside Pod
    c.fillStyle = "#059669";
    c.beginPath();
    c.ellipse(0, 4, 8.5, 14.5, 0, 0, Math.PI * 2);
    c.fill();

    // Twitching Antennas
    const antTwitch = Math.sin(this.bob * 4) * 3;
    c.strokeStyle = "#064e3b";
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(-4, -8);
    c.lineTo(-9 + antTwitch, -19);
    c.moveTo(4, -8);
    c.lineTo(9 + antTwitch, -19);
    c.stroke();

    // Giant Cyclops Eye & Laser Charge Ring
    if (this.charging) {
      c.shadowColor = "#ef4444";
      c.shadowBlur = 18;
      c.strokeStyle = "#fde047";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(0, 0, 9 + Math.sin(this.bob * 8) * 2, 0, Math.PI * 2);
      c.stroke();
    }

    c.fillStyle = "#fef08a";
    c.beginPath();
    c.arc(0, 0, 5.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#ef4444";
    c.beginPath();
    c.arc(-1, 0, 3.2, 0, Math.PI * 2);
    c.fill();

    // HP Bar
    const barW = 44;
    c.fillStyle = "rgba(0,0,0,0.65)";
    c.beginPath();
    c.roundRect(-barW / 2, -34, barW, 6, 3);
    c.fill();
    c.fillStyle = "#10b981";
    c.beginPath();
    c.roundRect(-barW / 2, -34, barW * (this.hp / this.maxHp), 6, 3);
    c.fill();

    c.restore();
  }
}
