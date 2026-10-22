// ============================================================================
// ALLY: SPONGEBOB SQUAREPANTS (Bubble Wand Animation & Rainbow Shield Buffs)
// ============================================================================
class SpongeBobAlly extends BaseEntity {
  constructor() {
    super(-100, 300, 50, 62);
    this.active = false;
    this.targetX = 72;
    this.bob = 0;
    this.shieldDropTimer = 0;
    this.blowingTimer = 0;
    this.wandAngle = 0;
    this.soapBubbles = [];
  }

  summon() {
    if (!this.active) {
      this.active = true;
      this.x = -80;
      this.soapBubbles = [];
      if (typeof playSound === "function") playSound("powerup");
      if (typeof popups !== "undefined") {
        popups.push(
          new PopupText(
            "🧽 SPONGEBOB BUBBLE SUPPORT! 🫧",
            W / 2,
            160,
            "#fde047",
            28,
          ),
        );
      }
    }
  }

  spawnSoapParticles(count = 5) {
    const symbols = ["🫧", "✨", "♪", "♫"];
    for (let i = 0; i < count; i++) {
      this.soapBubbles.push({
        x: this.x + 26,
        y: this.y - 6 + (Math.random() - 0.5) * 12,
        vx: 1.5 + Math.random() * 2.5,
        vy: -(0.8 + Math.random() * 1.6),
        r: 4 + Math.random() * 6,
        alpha: 1.0,
        isNote: Math.random() > 0.65,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        hue: Math.floor(Math.random() * 360),
      });
    }
  }

  update(sealY) {
    if (!this.active) return;
    this.bob += 0.075;
    this.y += (sealY - 48 + Math.sin(this.bob) * 16 - this.y) * 0.08;
    if (this.x < this.targetX) this.x += 2.4;

    // Ambient soap bubble trail
    if (Math.random() < 0.06) {
      this.spawnSoapParticles(1);
    }

    // Update floating soap bubbles & musical notes
    for (let sb of this.soapBubbles) {
      sb.x += sb.vx;
      sb.y += sb.vy;
      sb.alpha -= 0.022;
    }
    this.soapBubbles = this.soapBubbles.filter((sb) => sb.alpha > 0);

    if (this.blowingTimer > 0) {
      this.blowingTimer--;
      this.wandAngle = Math.sin(this.blowingTimer * 0.3) * 0.25;
    } else {
      this.wandAngle *= 0.85;
    }

    this.shieldDropTimer++;
    // Start bubble-blowing animation 35 frames before granting shield
    if (this.shieldDropTimer === 265) {
      this.blowingTimer = 40;
      this.spawnSoapParticles(7);
    }

    if (this.shieldDropTimer > 300) {
      this.shieldDropTimer = 0;
      if (typeof seal !== "undefined") {
        if (!seal.hasShield) {
          seal.hasShield = true;
          if (typeof playSound === "function") playSound("powerup");
          if (typeof popups !== "undefined") {
            popups.push(
              new PopupText(
                "🫧 SPONGEBOB BUBBLE SHIELD!",
                seal.x,
                seal.y - 32,
                "#38bdf8",
                22,
              ),
            );
          }
        } else {
          // Bonus score if seal already has a shield
          score += 40;
          if (typeof playSound === "function") playSound("fish");
          if (typeof popups !== "undefined") {
            popups.push(
              new PopupText(
                "🫧 +40 BUBBLE BONUS!",
                seal.x,
                seal.y - 32,
                "#fde047",
                20,
              ),
            );
          }
        }
      }
    }
  }

  draw(c) {
    if (!this.active) return;

    // 1. Render Floating Rainbow Soap Bubbles & Notes
    for (let sb of this.soapBubbles) {
      c.save();
      c.globalAlpha = Math.max(0, sb.alpha);
      if (sb.isNote) {
        c.fillStyle = "#fde047";
        c.font = "bold 15px sans-serif";
        c.fillText(sb.symbol, sb.x, sb.y);
      } else {
        c.strokeStyle = `hsla(${sb.hue}, 90%, 75%, ${sb.alpha})`;
        c.fillStyle = `hsla(${sb.hue}, 90%, 85%, ${sb.alpha * 0.25})`;
        c.lineWidth = 1.8;
        c.beginPath();
        c.arc(sb.x, sb.y, sb.r, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Bubble shine dot
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.arc(
          sb.x - sb.r * 0.3,
          sb.y - sb.r * 0.3,
          sb.r * 0.25,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y);

    // Gentle squash & stretch while swimming or blowing bubbles
    const stretch =
      this.blowingTimer > 0
        ? 1 + Math.sin(this.blowingTimer * 0.4) * 0.08
        : 1 + Math.sin(this.bob) * 0.03;
    c.scale(stretch, 2 - stretch);
    c.rotate(Math.sin(this.bob * 0.6) * 0.06);

    // Soft Golden Glow Aura
    c.fillStyle = "rgba(250, 204, 21, 0.2)";
    c.beginPath();
    c.arc(0, 0, 44, 0, Math.PI * 2);
    c.fill();

    // 2. Kick-Swimming Legs, Striped Socks & Shiny Black Shoes
    for (let side of [-1, 1]) {
      const legKick = Math.sin(this.bob * 2.5 + (side === 1 ? Math.PI : 0)) * 6;
      c.save();
      c.translate(side * 8, 28);
      c.rotate(legKick * 0.04);

      // Yellow Leg
      c.strokeStyle = "#eab308";
      c.lineWidth = 3.5;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, 11);
      c.stroke();

      // White Sock with Blue/Red Stripes
      c.fillStyle = "#ffffff";
      c.fillRect(-2.5, 5, 5, 5);
      c.fillStyle = "#ef4444";
      c.fillRect(-2.5, 6, 5, 1.2);
      c.fillStyle = "#3b82f6";
      c.fillRect(-2.5, 8, 5, 1.2);

      // Shiny Black Shoe
      c.fillStyle = "#0f172a";
      c.beginPath();
      c.ellipse(2, 12, 5.5, 3.5, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(3.5, 11, 1.2, 0, Math.PI * 2);
      c.fill();

      c.restore();
    }

    // 3. Wavy Sponge Body
    c.fillStyle = "#facc15";
    c.strokeStyle = "#ca8a04";
    c.lineWidth = 2.8;
    c.beginPath();
    c.roundRect(-20, -26, 40, 40, 7);
    c.fill();
    c.stroke();

    // Olive Sponge Pores
    c.fillStyle = "#ca8a04";
    c.beginPath();
    c.arc(-12, -16, 3.2, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-14, -6, 2.0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(12, -18, 2.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(13, 4, 3.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(-10, 6, 2.8, 0, Math.PI * 2);
    c.fill();

    // 4. White Shirt, Brown SquarePants & Red Tie
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#475569";
    c.lineWidth = 2;
    c.fillRect(-20, 13, 40, 7);
    c.strokeRect(-20, 13, 40, 7);

    c.fillStyle = "#78350f";
    c.strokeStyle = "#451a03";
    c.fillRect(-20, 20, 40, 9);
    c.strokeRect(-20, 20, 40, 9);

    // Black Belt Dashes
    c.fillStyle = "#0f172a";
    for (let bx = -15; bx <= 12; bx += 9) {
      c.fillRect(bx, 21.5, 5, 2.5);
    }

    // Red Necktie
    c.fillStyle = "#ef4444";
    c.strokeStyle = "#991b1b";
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(-3, 13);
    c.lineTo(3, 13);
    c.lineTo(4.5, 22);
    c.lineTo(0, 26);
    c.lineTo(-4.5, 22);
    c.closePath();
    c.fill();
    c.stroke();

    // 5. Expressive Big Blue Eyes & Eyelashes
    for (let ex of [-7, 7]) {
      // 3 Black Eyelashes
      c.strokeStyle = "#0f172a";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(ex - 3, -15);
      c.lineTo(ex - 4, -19);
      c.moveTo(ex, -16);
      c.lineTo(ex, -20);
      c.moveTo(ex + 3, -15);
      c.lineTo(ex + 4, -19);
      c.stroke();

      // White Eyeball
      c.fillStyle = "#ffffff";
      c.strokeStyle = "#1e293b";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(ex, -9, 7.5, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Sky Blue Iris
      c.fillStyle = "#38bdf8";
      c.beginPath();
      c.arc(ex + 1, -9, 4.2, 0, Math.PI * 2);
      c.fill();

      // Black Pupil & Catchlight
      c.fillStyle = "#0f172a";
      c.beginPath();
      c.arc(ex + 1.2, -9, 2.2, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc(ex, -10.5, 1.3, 0, Math.PI * 2);
      c.fill();
    }

    // Cute Curved Nose
    c.fillStyle = "#facc15";
    c.strokeStyle = "#ca8a04";
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(3, -5, 5.5, 3, -0.15, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Rosy Cheeks with Freckles
    c.fillStyle = "rgba(244, 63, 94, 0.45)";
    c.beginPath();
    c.arc(-12, -2, 4, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(12, -2, 4, 0, Math.PI * 2);
    c.fill();

    // 6. Mouth: Blowing Bubble "O" vs Iconic Buck-Teeth Smile
    if (this.blowingTimer > 0) {
      // Puffed Cheeks & "O" Mouth
      c.fillStyle = "#991b1b";
      c.strokeStyle = "#7f1d1d";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(6, 2, 4.5, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    } else {
      // Wide Joyful Smile
      c.strokeStyle = "#78350f";
      c.lineWidth = 2.2;
      c.beginPath();
      c.arc(0, -1, 10, 0.12 * Math.PI, 0.88 * Math.PI);
      c.stroke();

      // Two Iconic White Buck Teeth
      c.fillStyle = "#ffffff";
      c.strokeStyle = "#475569";
      c.lineWidth = 1.6;
      c.beginPath();
      c.roundRect(-4.5, 7, 4, 5, 1);
      c.roundRect(0.5, 7, 4, 5, 1);
      c.fill();
      c.stroke();
    }

    // 7. Right Arm Holding Pink Bubble Wand
    c.save();
    c.translate(18, 4);
    c.rotate(this.wandAngle - 0.2);

    // White Sleeve & Yellow Arm
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#475569";
    c.lineWidth = 1.8;
    c.beginPath();
    c.arc(0, 0, 4, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.strokeStyle = "#eab308";
    c.lineWidth = 3.2;
    c.beginPath();
    c.moveTo(2, 0);
    c.lineTo(12, -4);
    c.stroke();

    // Pink Bubble Wand Stick & Loop
    c.strokeStyle = "#f472b6";
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(12, -2);
    c.lineTo(14, -14);
    c.stroke();

    c.fillStyle = "rgba(56, 189, 248, 0.45)";
    c.beginPath();
    c.ellipse(14, -18, 4.5, 6.5, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.restore();

    c.restore();
  }
}
