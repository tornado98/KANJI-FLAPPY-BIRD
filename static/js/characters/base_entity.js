// ============================================================================
// BASE ENTITY & SHARED PROJECTILE CLASSES
// ============================================================================
class BaseEntity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = true;
  }
  getBounds() {
    return {
      x: this.x - this.w / 2,
      y: this.y - this.h / 2,
      w: this.w,
      h: this.h,
    };
  }
  update() {}
  draw(c) {}
}

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

class EyeLaserBeam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = -11.5;
    this.length = 55;
    this.thickness = 7;
    this.pulse = 0;
  }
  update() {
    this.x += this.vx;
    this.pulse += 0.35;
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y);

    c.shadowColor = "#ef4444";
    c.shadowBlur = 16 + Math.sin(this.pulse) * 6;

    c.fillStyle = "#ef4444";
    c.beginPath();
    c.roundRect(
      -this.length,
      -this.thickness / 2,
      this.length,
      this.thickness,
      4,
    );
    c.fill();

    c.fillStyle = "#fef08a";
    c.beginPath();
    c.roundRect(
      -this.length + 6,
      -this.thickness / 4,
      this.length - 8,
      this.thickness / 2,
      3,
    );
    c.fill();

    c.fillStyle = "#ffffff";
    c.beginPath();
    c.arc(
      -this.length - 2,
      0,
      3.5 + Math.sin(this.pulse) * 1.5,
      0,
      Math.PI * 2,
    );
    c.fill();

    c.restore();
  }
  getBounds() {
    return {
      x: this.x - this.length,
      y: this.y - this.thickness / 2,
      w: this.length,
      h: this.thickness,
    };
  }
}

// Mr. Krabs' Spinning Golden Coin Projectile
class CoinProjectile {
  constructor(x, y, vyOffset = 0) {
    this.x = x;
    this.y = y;
    this.vx = -7.8;
    this.vy = vyOffset;
    this.r = 15;
    this.spinPhase = Math.random() * Math.PI;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.spinPhase += 0.22;
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y);

    // 3D Coin Flipping Illusion via horizontal scaling
    const scaleX = Math.max(0.25, Math.abs(Math.cos(this.spinPhase)));
    c.scale(scaleX, 1);

    c.shadowColor = "#facc15";
    c.shadowBlur = 10;

    // Outer Gold Rim
    c.fillStyle = "#eab308";
    c.strokeStyle = "#fef08a";
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(0, 0, this.r, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Inner Coin Detail
    c.fillStyle = "#facc15";
    c.beginPath();
    c.arc(0, 0, this.r - 4, 0, Math.PI * 2);
    c.fill();

    // Dollar Sign Emblem
    c.fillStyle = "#854d0e";
    c.font = "bold 16px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("$", 0, 1);

    c.restore();
  }
  getBounds() {
    return { x: this.x - 12, y: this.y - 12, w: 24, h: 24 };
  }
}
