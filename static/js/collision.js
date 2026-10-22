// ============================================================================
// COLLISION, GATE SHATTER FX & GAME RULES ENGINE
// ============================================================================
function triggerScreenFlash(color, alpha = 0.22) {
  screenFlashColor = color;
  screenFlashAlpha = alpha;
}

function spawnOrbShatter(x, y, color) {
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.3;
    const spd = 2.5 + Math.random() * 5.5;
    gateParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      r: 3 + Math.random() * 5,
      alpha: 1.0,
      color: color,
    });
  }
}

function hitSeal() {
  if (seal.hasShield) {
    seal.hasShield = false;
    seal.invulnerableTimer = 65;
    playSound("hit");
    triggerScreenFlash("#38bdf8", 0.3);
    spawnOrbShatter(seal.x, seal.y, "#38bdf8");
    popups.push(
      new PopupText(
        "🛡️ SHIELD ABSORBED HIT!",
        seal.x,
        seal.y - 35,
        "#38bdf8",
        24,
      ),
    );
    return;
  }
  if (seal.invulnerableTimer > 0) return;
  lives--;
  shakeTime = 14;
  shakeAmp = 7;
  triggerScreenFlash("#f43f5e", 0.35);
  playSound("hit");

  // Physical knockback bounce on hit
  seal.vy = -3.5;

  if (lives <= 0) {
    triggerGameOver();
  } else {
    seal.invulnerableTimer = 85;
    combo = 0;
    popups.push(
      new PopupText("OUCH! -1 HEART", seal.x, seal.y - 30, "#f43f5e", 24),
    );
  }
}

function checkLogic() {
  const s = seal.getBounds();
  const gateMid = currentGate.topH + currentGate.gap / 2;
  const inGateX =
    currentGate.x < seal.x && seal.x < currentGate.x + currentGate.w + 16;

  // 1. Kanji Gate Evaluation & Shatter FX
  if (inGateX && !currentGate.passed) {
    const inTop = seal.y < gateMid;
    const correct =
      (currentGate.topCorrect && inTop) || (!currentGate.topCorrect && !inTop);
    if (correct) {
      currentGate.passed = true;
      currentGate.shatterAnim = 1.0;
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      gatesPassedCount++;

      const isFever = combo >= 3;
      const points = 25 * combo * (isFever ? 2 : 1);
      score += points;
      speed = Math.min(8.0, speed + 0.12);

      playSound("correct");
      triggerScreenFlash(isFever ? "#facc15" : "#38bdf8", 0.16);

      // Burst shatter particles at the chosen Kanji Orb
      const orbY = inTop ? currentGate.topH + 62 : currentGate.botY - 62;
      spawnOrbShatter(
        currentGate.x + currentGate.w / 2,
        orbY,
        isFever ? "#fde047" : "#38bdf8",
      );

      popups.push(
        new PopupText(
          `+${points}` + (isFever ? " 🔥 FEVER 2X!" : ""),
          seal.x,
          seal.y - 25,
          isFever ? "#facc15" : "#fde047",
          28,
        ),
      );
      for (let i = 0; i < 12; i++)
        trailBubbles.push(new Bubble(seal.x, seal.y, true, isFever));

      // Sequential Boss Rotation every 4 gates
      const noBossActive =
        !squidward.active && !plankton.active && !mrKrabs.active;
      if (gatesPassedCount % 4 === 0 && noBossActive) {
        if (bossRotationIndex === 0) squidward.spawn();
        else if (bossRotationIndex === 1) plankton.spawn();
        else mrKrabs.spawn();
        bossRotationIndex = (bossRotationIndex + 1) % 3;
      }
    } else {
      hitSeal();
      currentGate.passed = true;
    }
  }

  // 2. Gate Pillar Collision with Physical Pushback
  if (
    s.x + s.w > currentGate.x + 8 &&
    s.x < currentGate.x + currentGate.w - 8
  ) {
    if (s.y < currentGate.topH) {
      seal.y = currentGate.topH + 22;
      seal.vy = Math.abs(seal.vy) * 0.6 + 2.0;
      hitSeal();
    } else if (s.y + s.h > currentGate.botY) {
      seal.y = currentGate.botY - 22;
      seal.vy = -Math.abs(seal.vy) * 0.6 - 2.0;
      hitSeal();
    }
  }

  // 3. Boss Projectiles Collisions
  for (let b of burgerShots) {
    const bb = b.getBounds();
    if (
      s.x + s.w > bb.x &&
      s.x < bb.x + bb.w &&
      s.y + s.h > bb.y &&
      s.y < bb.y + bb.h
    ) {
      hitSeal();
      b.x = -100;
      break;
    }
  }

  for (let laser of eyeLasers) {
    const lb = laser.getBounds();
    if (
      s.x + s.w > lb.x &&
      s.x < lb.x + lb.w &&
      s.y + s.h > lb.y &&
      s.y < lb.y + lb.h
    ) {
      hitSeal();
      laser.x = -100;
      break;
    }
  }

  for (let coin of coinShots) {
    const cb = coin.getBounds();
    if (
      s.x + s.w > cb.x &&
      s.x < cb.x + cb.w &&
      s.y + s.h > cb.y &&
      s.y < cb.y + cb.h
    ) {
      hitSeal();
      coin.x = -100;
      break;
    }
  }

  // 4. Player & Patrick Kanji Shots vs Bosses
  for (let shot of playerShots) {
    const pb = shot.getBounds();

    if (squidward.active) {
      const sb = squidward.getBounds();
      if (
        pb.x + pb.w > sb.x &&
        pb.x < sb.x + sb.w &&
        pb.y + pb.h > sb.y &&
        pb.y < sb.y + sb.h
      ) {
        shot.x = W + 200;
        squidward.hp--;
        squidward.triggerRageSteam();
        playSound("boss_hit");
        spawnOrbShatter(squidward.x - 20, shot.y, "#38bdf8");
        const pts = shot.fromPatrick ? 75 : 50;
        score += pts;
        popups.push(
          new PopupText(
            `+${pts} HIT!`,
            squidward.x,
            squidward.y - 20,
            shot.fromPatrick ? "#fb923c" : "#38bdf8",
            22,
          ),
        );

        if (squidward.hp <= 0) {
          squidward.active = false;
          score += 250;
          playSound("correct");
          spawnOrbShatter(squidward.x, squidward.y, "#facc15");
          popups.push(
            new PopupText(
              "+250 SQUIDWARD DEFEATED!",
              W / 2,
              140,
              "#facc15",
              30,
            ),
          );
        }
        break;
      }
    }

    if (plankton.active) {
      const plb = plankton.getBounds();
      if (
        pb.x + pb.w > plb.x &&
        pb.x < plb.x + plb.w &&
        pb.y + pb.h > plb.y &&
        pb.y < plb.y + plb.h
      ) {
        shot.x = W + 200;
        plankton.hp--;
        plankton.hitFlicker = 15;
        playSound("boss_hit");
        spawnOrbShatter(plankton.x - 15, shot.y, "#10b981");
        score += 60;
        popups.push(
          new PopupText("+60 HIT!", plankton.x, plankton.y - 20, "#ef4444", 22),
        );

        if (plankton.hp <= 0) {
          plankton.active = false;
          score += 200;
          playSound("correct");
          spawnOrbShatter(plankton.x, plankton.y, "#10b981");
          popups.push(
            new PopupText(
              "+200 PLANKTON LASER DESTROYED!",
              W / 2,
              140,
              "#10b981",
              30,
            ),
          );
        }
        break;
      }
    }

    if (mrKrabs.active) {
      const mkb = mrKrabs.getBounds();
      if (
        pb.x + pb.w > mkb.x &&
        pb.x < mkb.x + mkb.w &&
        pb.y + pb.h > mkb.y &&
        pb.y < mkb.y + mkb.h
      ) {
        shot.x = W + 200;
        mrKrabs.hp--;
        mrKrabs.triggerHitEffects();
        playSound("boss_hit");
        spawnOrbShatter(mrKrabs.x - 20, shot.y, "#facc15");
        score += 70;
        popups.push(
          new PopupText(
            "+70 ME MONEY!",
            mrKrabs.x,
            mrKrabs.y - 25,
            "#facc15",
            22,
          ),
        );

        if (mrKrabs.hp <= 0) {
          mrKrabs.active = false;
          score += 300;
          playSound("correct");
          spawnOrbShatter(mrKrabs.x, mrKrabs.y, "#facc15");
          popups.push(
            new PopupText(
              "+300 MR. KRABS RETREATED!",
              W / 2,
              140,
              "#facc15",
              30,
            ),
          );
        }
        break;
      }
    }
  }

  // 5. Power-ups
  for (let p of powerUps) {
    if (!p.eaten) {
      const pb = p.getBounds();
      if (
        s.x + s.w > pb.x &&
        s.x < pb.x + pb.w &&
        s.y + s.h > pb.y &&
        s.y < pb.y + pb.h
      ) {
        p.eaten = true;
        playSound("powerup");
        spawnOrbShatter(p.x, p.y, p.type === "shield" ? "#38bdf8" : "#facc15");
        if (p.type === "shield") {
          seal.hasShield = true;
          popups.push(
            new PopupText(
              "🛡️ SHIELD ACQUIRED!",
              seal.x,
              seal.y - 30,
              "#38bdf8",
              22,
            ),
          );
        } else {
          slowMoTimer = 240;
          popups.push(
            new PopupText(
              "⏳ TIME SLOW-MO ACTIVE!",
              seal.x,
              seal.y - 30,
              "#facc15",
              22,
            ),
          );
        }
      }
    }
  }

  // 6. Golden Fishes & Ultra-Smooth Eating Reaction (Zero Lag)
  for (let fish of bonusFishes) {
    if (!fish.eaten && Math.hypot(seal.x + 14 - fish.x, seal.y - fish.y) < 42) {
      fish.eaten = true;
      fishCount++;
      score += 30;
      playSound("fish");

      // Trigger smooth vector eating animation on the seal
      if (typeof seal.eatFish === "function") {
        seal.eatFish();
      }

      // Lightweight vector bubbles (capped to avoid lag)
      if (trailBubbles.length < 40) {
        for (let i = 0; i < 4; i++) {
          trailBubbles.push(
            new Bubble(
              seal.x + 35,
              seal.y + (Math.random() - 0.5) * 14,
              true,
              true,
            ),
          );
        }
      }

      // Pure ASCII text popup for instant GPU rendering
      popups.push(
        new PopupText("YUM! +30 PTS", fish.x, fish.y - 18, "#fde047", 23),
      );

      if (fishCount >= 3 && score >= 100 && !patrick.active) patrick.summon();
      if (fishCount >= 6 && !spongebob.active) spongebob.summon();
    }
  }

  // 7. Gate Respawn & Dynamic Spawning
  if (currentGate.x < -currentGate.w - 70) {
    currentGate.x = W + 140;
    currentGate.passed = false;
    currentGate.resetData();

    // Spawn a small school of 1 or 2 Golden Fishes
    const fishY =
      currentGate.topH + currentGate.gap / 2 + (Math.random() - 0.5) * 70;
    bonusFishes.push(new GoldenFish(currentGate.x + currentGate.w / 2, fishY));
    if (Math.random() > 0.5) {
      bonusFishes.push(
        new GoldenFish(
          currentGate.x + currentGate.w / 2 + 45,
          fishY + (Math.random() - 0.5) * 30,
        ),
      );
    }

    if (Math.random() > 0.55) {
      powerUps.push(
        new PowerUp(
          W + 310,
          140 + Math.random() * (H - 280),
          Math.random() > 0.5 ? "shield" : "slow",
        ),
      );
    }
  }
}
