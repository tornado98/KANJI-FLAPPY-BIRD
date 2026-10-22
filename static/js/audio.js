const AudioContext = window.AudioContext || window.webkitAudioContext;
let actx = null;

function ensureAudio() {
  if (!actx) actx = new AudioContext();
  if (actx.state === "suspended") actx.resume();
}

function playSound(type) {
  if (!actx) return;
  try {
    const t = actx.currentTime;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);

    if (type === "swim") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(190, t);
      osc.frequency.exponentialRampToValueAtTime(340, t + 0.14);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.start(t);
      osc.stop(t + 0.14);
    } else if (type === "dash") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(550, t);
      osc.frequency.exponentialRampToValueAtTime(850, t + 0.15);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === "shoot") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === "boss_hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.18);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === "patrick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(330, t);
      osc.frequency.setValueAtTime(440, t + 0.1);
      osc.frequency.setValueAtTime(660, t + 0.2);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (type === "correct") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523, t);
      osc.frequency.setValueAtTime(659, t + 0.07);
      osc.frequency.setValueAtTime(784, t + 0.14);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.28);
    } else if (type === "powerup") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(1100, t + 0.18);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (type === "fish") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(1360, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === "hit") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.25);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  } catch (e) {}
}
