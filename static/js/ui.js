// ============================================================================
// UI RENDERING PIPELINE (HUD, DYNAMIC LOBBY SHOWCASE, PAUSE, CODEX, GAMEOVER)
// ============================================================================
function drawHUD() {
  ctx.fillStyle = "rgba(3, 21, 44, 0.85)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 250, 16, 500, 72, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`[JLPT ${currentLevel}] TARGET MEANING`, W / 2, 36);
  ctx.fillStyle = "#fde047";
  ctx.font = "bold 27px sans-serif";
  ctx.fillText(
    `${currentGate.data.en} (${currentGate.data.reading})`,
    W / 2,
    66,
  );

  ctx.fillStyle = "rgba(3, 21, 44, 0.85)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.beginPath();
  ctx.roundRect(26, 16, 230, 76, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 21px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 40, 42);

  let hearts = "";
  for (let i = 0; i < 3; i++) hearts += i < lives ? "❤️ " : "🖤 ";
  ctx.font = "16px sans-serif";
  ctx.fillText(hearts, 40, 64);

  if (combo >= 3) {
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`⚡ FEVER x${combo}! (2X)`, 140, 42);
  }

  const meterCardX = W - 265 - 26;
  ctx.fillStyle = "rgba(3, 21, 44, 0.85)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.beginPath();
  ctx.roundRect(meterCardX, 16, 205, 76, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e0f2fe";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("ATTACK & COMPANIONS", meterCardX + 16, 36);

  ctx.fillStyle = patrick.active ? "#fb923c" : "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  let compText = patrick.active ? "🌟 Patrick " : "";
  if (spongebob.active) compText += "🧽 SpongeBob";
  if (!compText) compText = `🐟 Fish: ${fishCount}/3`;
  ctx.fillText(compText, meterCardX + 16, 54);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "11px sans-serif";
  ctx.fillText("[F / R-Click] Shoot Kanji", meterCardX + 16, 70);

  ctx.save();
  ctx.fillStyle = "rgba(3, 21, 44, 0.85)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(
    pauseTriggerBtn.x,
    pauseTriggerBtn.y,
    pauseTriggerBtn.w,
    pauseTriggerBtn.h,
    12,
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(pauseTriggerBtn.x + 15, pauseTriggerBtn.y + 14, 5, 18);
  ctx.fillRect(pauseTriggerBtn.x + 26, pauseTriggerBtn.y + 14, 5, 18);
  ctx.restore();
}

// ============================================================================
// REDESIGNED CYBER-ATLANTIS MAIN MENU WITH LIVE ANIMATED CAST
// ============================================================================
function drawMenu() {
  // 1. Render Live Animated Multi-Layer Ocean Backdrop
  if (typeof drawDynamicOceanBackdrop === "function") {
    drawDynamicOceanBackdrop(ctx, frameCount);
  } else {
    ctx.drawImage(bgCanvas, 0, 0);
  }
  kelpForest.forEach((k) => k.draw(ctx, frameCount));
  ambientBubbles.forEach((b) => b.draw(ctx));

  // 2. Animate All 6 Characters Smoothly in the Menu Background
  // (Explicitly overrides any leftover game-over coordinates or states)
  const t = frameCount * 0.045;

  // --- LEFT WING: HERO & ALLIES ---
  // Baby Seal (Swimming happily on top-left)
  seal.invulnerableTimer = 0;
  seal.dashTimer = 0;
  seal.eatTimer = 0;
  seal.hasShield = false;
  seal.x = 125 + Math.cos(t * 0.8) * 18;
  seal.y = 210 + Math.sin(t * 1.1) * 16;
  seal.rot = Math.cos(t * 1.1) * 0.12;
  seal.flipperCycle = frameCount * 0.18;
  seal.tailCycle = frameCount * 0.18;
  seal.flipperIntensity = 0.45;
  seal.draw(ctx);

  // SpongeBob (Floating mid-left & blowing bubbles)
  spongebob.active = true;
  spongebob.x = 115 + Math.sin(t * 0.9) * 14;
  spongebob.y = 375 + Math.cos(t * 1.2) * 14;
  spongebob.bob = frameCount * 0.08;
  spongebob.blowingTimer = frameCount % 160 < 35 ? 20 : 0;
  spongebob.wandAngle = Math.sin(t * 2) * 0.2;
  spongebob.draw(ctx);
  spongebob.active = false;

  // Patrick Star (Cruising bottom-left & waving)
  patrick.active = true;
  patrick.x = 130 + Math.cos(t * 0.7) * 15;
  patrick.y = 535 + Math.sin(t * 0.95) * 14;
  patrick.bob = frameCount * 0.07;
  patrick.armWave = (Math.sin(t * 2.5) + 1) * 0.35;
  patrick.draw(ctx);
  patrick.active = false;

  // --- RIGHT WING: THE 3 BOSSES ---
  // Squidward (Hovering top-right with waving tentacles)
  squidward.active = true;
  squidward.hitFlicker = 0;
  squidward.hp = squidward.maxHp;
  squidward.x = W - 120 + Math.sin(t * 0.75) * 14;
  squidward.y = 195 + Math.cos(t * 0.95) * 15;
  squidward.bob = frameCount * 0.07;
  squidward.throwArmAngle = Math.max(0, Math.sin(t * 1.8) * 0.5);
  squidward.draw(ctx);
  squidward.active = false;

  // Plankton (Patrolling mid-right in his jet pod)
  plankton.active = true;
  plankton.hitFlicker = 0;
  plankton.hp = plankton.maxHp;
  plankton.x = W - 115 + Math.cos(t * 1.1) * 18;
  plankton.y = 375 + Math.sin(t * 1.3) * 14;
  plankton.bob = frameCount * 0.1;
  plankton.charging = frameCount % 120 > 85;
  plankton.draw(ctx);
  plankton.active = false;

  // Mr. Krabs (Snapping pincers bottom-right)
  if (typeof mrKrabs !== "undefined") {
    mrKrabs.active = true;
    mrKrabs.hitFlicker = 0;
    mrKrabs.hp = mrKrabs.maxHp;
    mrKrabs.x = W - 125 + Math.sin(t * 0.85) * 14;
    mrKrabs.y = 545 + Math.cos(t * 1.05) * 14;
    mrKrabs.bob = frameCount * 0.08;
    mrKrabs.clawSnapAngle = Math.max(0, Math.sin(t * 2.4) * 0.45);
    mrKrabs.draw(ctx);
    mrKrabs.active = false;
  }

  // 3. Character Showcase Badges (Left & Right Floating Labels)
  const drawSideBadge = (bx, by, title, borderColor) => {
    ctx.save();
    ctx.fillStyle = "rgba(3, 21, 44, 0.82)";
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - 68, by, 136, 26, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e0f2fe";
    ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, bx, by + 13);
    ctx.restore();
  };
  drawSideBadge(125, 95, "✨ OCEAN HEROES", "#38bdf8");
  drawSideBadge(W - 120, 95, "⚔️ SEA BOSSES", "#f43f5e");

  // 4. Center Cyber-Glass Main Menu Card
  const cardW = 680;
  const cardH = 590;
  const cardX = W / 2 - cardW / 2;
  const cardY = 55;

  ctx.save();
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cardGrad.addColorStop(0, "rgba(4, 24, 48, 0.88)");
  cardGrad.addColorStop(1, "rgba(2, 12, 26, 0.94)");
  ctx.fillStyle = cardGrad;
  ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 30);
  ctx.fill();
  ctx.stroke();

  // Inner Decorative Top Glow Line
  ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 180, cardY + 2);
  ctx.lineTo(W / 2 + 180, cardY + 2);
  ctx.stroke();
  ctx.restore();

  // Top Pill Tag
  ctx.save();
  ctx.fillStyle = "rgba(14, 165, 233, 0.2)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 145, 76, 290, 26, 13);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🌊 JAPANESE KANJI ACTION ARCADE", W / 2, 93);
  ctx.restore();

  // Main Title with Golden-Cyan Gradient
  ctx.save();
  const titleGrad = ctx.createLinearGradient(
    W / 2 - 250,
    115,
    W / 2 + 250,
    150,
  );
  titleGrad.addColorStop(0, "#ffffff");
  titleGrad.addColorStop(0.5, "#bae6fd");
  titleGrad.addColorStop(1, "#fde047");
  ctx.fillStyle = titleGrad;
  ctx.font = "800 42px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("BABY SEAL KANJI QUEST", W / 2, 142);
  ctx.restore();

  // Stats Dashboard Box (3 Columns)
  const vocabCount = JLPT_DATABASE[currentLevel].length;
  ctx.save();
  ctx.fillStyle = "rgba(7, 38, 66, 0.78)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 295, 168, 590, 64, 16);
  ctx.fill();
  ctx.stroke();

  // Column Dividers
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(W / 2 - 98, 178);
  ctx.lineTo(W / 2 - 98, 222);
  ctx.moveTo(W / 2 + 98, 178);
  ctx.lineTo(W / 2 + 98, 222);
  ctx.stroke();

  // Stat 1: Selected Rank
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("SELECTED PROFICIENCY", W / 2 - 196, 190);
  ctx.fillStyle = "#fde047";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`JLPT ${currentLevel}`, W / 2 - 196, 215);

  // Stat 2: Kanji Pool
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("KANJI VOCABULARY", W / 2, 190);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`${vocabCount} Characters`, W / 2, 215);

  // Stat 3: Best Record
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("PERSONAL BEST", W / 2 + 196, 190);
  ctx.fillStyle = "#4ade80";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`${bestScore} PTS`, W / 2 + 196, 215);
  ctx.restore();

  // JLPT Level Selector Buttons
  LEVEL_BUTTONS.forEach((btn) => {
    const isSel = btn.level === currentLevel;
    ctx.save();
    if (isSel) {
      const selGrad = ctx.createLinearGradient(
        btn.x,
        btn.y,
        btn.x,
        btn.y + btn.h,
      );
      selGrad.addColorStop(0, "#0284c7");
      selGrad.addColorStop(1, "#0369a1");
      ctx.fillStyle = selGrad;
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.5;
    } else {
      ctx.fillStyle = "rgba(12, 34, 62, 0.85)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.2;
    }
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isSel ? "#ffffff" : "#94a3b8";
    ctx.font = isSel ? "bold 14px sans-serif" : "600 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    ctx.restore();
  });

  // Primary Action: START DIVE Button with Animated Pulse
  const pulseScale = 1 + Math.sin(frameCount * 0.08) * 0.015;
  ctx.save();
  ctx.translate(W / 2, startBtn.y + startBtn.h / 2);
  ctx.scale(pulseScale, pulseScale);
  ctx.translate(-W / 2, -(startBtn.y + startBtn.h / 2));

  const btnGrad = ctx.createLinearGradient(
    startBtn.x,
    startBtn.y,
    startBtn.x + startBtn.w,
    startBtn.y + startBtn.h,
  );
  btnGrad.addColorStop(0, "#0ea5e9");
  btnGrad.addColorStop(0.5, "#0284c7");
  btnGrad.addColorStop(1, "#0369a1");
  ctx.fillStyle = btnGrad;
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `▶ START JLPT ${currentLevel} DIVE`,
    W / 2,
    startBtn.y + startBtn.h / 2 + 1,
  );
  ctx.restore();

  // Secondary Action: KANJI CODEX Button
  ctx.save();
  ctx.fillStyle = "rgba(15, 28, 52, 0.9)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(codexBtn.x, codexBtn.y, codexBtn.w, codexBtn.h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "📖 KANJI CODEX & STUDY GUIDE",
    W / 2,
    codexBtn.y + codexBtn.h / 2 + 1,
  );
  ctx.restore();

  // Bottom Feature Cards (Allies & Bosses Guide)
  ctx.save();
  ctx.fillStyle = "rgba(8, 33, 58, 0.7)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 295, 495, 590, 120, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fde047";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("⚡ MISSION BRIEFING & SQUAD SYNERGY ⚡", W / 2, 518);

  ctx.fillStyle = "#e0f2fe";
  ctx.font = "13px sans-serif";
  ctx.fillText(
    "• Swim through the matching Kanji Pearl Orb to build FEVER Combos.",
    W / 2,
    544,
  );
  ctx.fillText(
    "• Eat 3 Golden Fish to summon Patrick Star  |  6 Fish for SpongeBob!",
    W / 2,
    568,
  );
  ctx.fillStyle = "#fda4af";
  ctx.fillText(
    "• Press [F] or [Right-Click] to blast Squidward, Plankton & Mr. Krabs!",
    W / 2,
    592,
  );
  ctx.restore();
}

function drawPauseMenu() {
  ctx.fillStyle = "rgba(1, 15, 30, 0.82)";
  ctx.fillRect(0, 0, W, H);

  const card = { x: W / 2 - 200, y: H / 2 - 130, w: 400, h: 260 };
  ctx.save();
  ctx.fillStyle = "rgba(8, 36, 64, 0.95)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y, card.w, card.h, 22);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME PAUSED", W / 2, card.y + 55);

  ctx.save();
  ctx.fillStyle = "#0284c7";
  ctx.strokeStyle = "#e0f2fe";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(resumeBtn.x, resumeBtn.y, resumeBtn.w, resumeBtn.h, 16);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("RESUME DIVE", W / 2, resumeBtn.y + resumeBtn.h / 2 + 2);

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(
    quitPauseBtn.x,
    quitPauseBtn.y,
    quitPauseBtn.w,
    quitPauseBtn.h,
    16,
  );
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#f43f5e";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("QUIT TO MENU", W / 2, quitPauseBtn.y + quitPauseBtn.h / 2 + 2);
}

function drawCodex() {
  if (typeof drawDynamicOceanBackdrop === "function") {
    drawDynamicOceanBackdrop(ctx, frameCount);
  } else {
    ctx.drawImage(bgCanvas, 0, 0);
  }

  ctx.save();
  ctx.fillStyle = "rgba(2, 18, 38, 0.92)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 460, 40, 920, 640, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`📖 JLPT ${currentLevel} KANJI CODEX`, W / 2, 90);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "15px sans-serif";
  ctx.fillText(
    "Review all target Kanji, readings, and meanings for this level:",
    W / 2,
    120,
  );

  const list = JLPT_DATABASE[currentLevel];
  const cols = 4;
  const itemW = 200;
  const itemH = 68;
  const startX = W / 2 - (cols * itemW + (cols - 1) * 16) / 2;
  const startY = 150;

  list.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cardX = startX + col * (itemW + 16);
    const cardY = startY + row * (itemH + 14);

    if (cardY < H - 140) {
      ctx.save();
      ctx.fillStyle = "rgba(8, 47, 73, 0.7)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, itemW, itemH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(item.correct, cardX + 16, cardY + 44);

      ctx.fillStyle = "#fde047";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(item.reading, cardX + 64, cardY + 28);

      ctx.fillStyle = "#e0f2fe";
      ctx.font = "13px sans-serif";
      ctx.fillText(item.en, cardX + 64, cardY + 50);
      ctx.restore();
    }
  });

  ctx.save();
  ctx.fillStyle = "#0284c7";
  ctx.strokeStyle = "#e0f2fe";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(
    closeCodexBtn.x,
    closeCodexBtn.y,
    closeCodexBtn.w,
    closeCodexBtn.h,
    16,
  );
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CLOSE CODEX", W / 2, closeCodexBtn.y + closeCodexBtn.h / 2 + 1);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(1, 12, 24, 0.88)";
  ctx.fillRect(0, 0, W, H);

  const card = { x: W / 2 - 250, y: H / 2 - 180, w: 500, h: 360 };
  ctx.save();
  ctx.fillStyle = "rgba(8, 36, 64, 0.95)";
  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y, card.w, card.h, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#f43f5e";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SPLASH OVER!", W / 2, card.y + 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.fillText(
    `Proficiency: JLPT ${currentLevel}  •  Score: ${score}`,
    W / 2,
    card.y + 110,
  );
  ctx.fillText(
    `Max Combo: ${maxCombo}  •  Fish Caught: ${fishCount} 🐟`,
    W / 2,
    card.y + 145,
  );

  ctx.save();
  ctx.fillStyle = "#0284c7";
  ctx.strokeStyle = "#e0f2fe";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(retryBtn.x, retryBtn.y, retryBtn.w, retryBtn.h, 16);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 19px sans-serif";
  ctx.fillText("PLAY AGAIN", W / 2, retryBtn.y + retryBtn.h / 2 + 2);

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(
    gameOverQuitBtn.x,
    gameOverQuitBtn.y,
    gameOverQuitBtn.w,
    gameOverQuitBtn.h,
    16,
  );
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 17px sans-serif";
  ctx.fillText(
    "RETURN TO MAIN MENU",
    W / 2,
    gameOverQuitBtn.y + gameOverQuitBtn.h / 2 + 2,
  );
}
