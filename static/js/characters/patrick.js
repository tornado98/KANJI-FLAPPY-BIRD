// ============================================================================
// ALLY: PATRICK STAR (Auto-Targeting Kanji Turret & Arm Wave Animation)
// ============================================================================
class PatrickCompanion extends BaseEntity {
  constructor() {
    super(-80, 300, 48, 56);
    this.active = false;
    this.targetX = 110;
    this.bob = 0;
    this.shootTimer = 0;
    this.armWave = 0;
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
    this.bob += 0.065;
    this.y += (sealY + 42 + Math.sin(this.bob) * 16 - this.y) * 0.08;
    if (this.x < this.targetX) this.x += 2.5;
    if (this.armWave > 0) this.armWave -= 0.08;

    // Auto-support against any active Boss (Squidward, Plankton, or Mr. Krabs)
    const hasBoss =
      (typeof squidward !== "undefined" && squidward.active) ||
      (typeof plankton !== "undefined" && plankton.active) ||
      (typeof mrKrabs !== "undefined" && mrKrabs.active);
    if (hasBoss) {
      this.shootTimer++;
      if (this.shootTimer > 55) {
        this.shootTimer = 0;
        this.armWave = 0.8;
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
    c.rotate(Math.sin(this.bob * 0.5) * 0.08);

    // Warm Star Aura
    c.fillStyle = "rgba(251, 146, 60, 0.22)";
    c.beginPath();
    c.arc(0, 0, 44, 0, Math.PI * 2);
    c.fill();

    // Pink Starfish Body
    c.fillStyle = "#f472b6";
    c.strokeStyle = "#db2777";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, -38);
    c.quadraticCurveTo(8, -15, 25 + this.armWave * 8, -12 - this.armWave * 10);
    c.quadraticCurveTo(16, 4, 18, 22);
    c.quadraticCurveTo(0, 18, -18, 22);
    c.quadraticCurveTo(-16, 4, -24, -12);
    c.quadraticCurveTo(-8, -15, 0, -38);
    c.closePath();
    c.fill();
    c.stroke();

    // Green Swim Trunks
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

    // Happy Eyes & Grin
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
    c.beginPath();
    c.arc(0, -6, 7, 0, Math.PI);
    c.fill();

    c.restore();
  }
}
