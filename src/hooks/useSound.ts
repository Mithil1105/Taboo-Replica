// Synthesized sound effects using Web Audio API - no backend needed
const SOUND_KEY = "taboo-sound-enabled";

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(SOUND_KEY);
  return v === null || v === "1";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
}

const audioCtx = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

function shouldPlay(): boolean {
  return isSoundEnabled();
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  rampDown = true
) {
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  if (rampDown) {
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);

  // Clean up
  osc.onended = () => ctx.close();
}

function playNoise(duration: number, volume = 0.15) {
  const ctx = audioCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  source.onended = () => ctx.close();
}

export function playCorrectSound() {
  if (!shouldPlay()) return;
  playTone(523, 0.12, "sine", 0.25); // C5
  setTimeout(() => playTone(659, 0.2, "sine", 0.25), 80); // E5
}

export function playSkipSound() {
  if (!shouldPlay()) return;
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
  osc.onended = () => ctx.close();
}

export function playTabooSound() {
  if (!shouldPlay()) return;
  playTone(180, 0.35, "square", 0.15);
  playTone(160, 0.35, "sawtooth", 0.1);
  playNoise(0.25, 0.08);
}

export function playTimerBuzzerSound() {
  if (!shouldPlay()) return;
  playTone(600, 0.15, "square", 0.2);
  setTimeout(() => playTone(500, 0.15, "square", 0.2), 120);
  setTimeout(() => playTone(350, 0.4, "square", 0.25), 240);
  setTimeout(() => playNoise(0.3, 0.1), 240);
}

export function playTickSound() {
  if (!shouldPlay()) return;
  playTone(1000, 0.05, "sine", 0.08);
}

export function playRoundEndSound() {
  if (!shouldPlay()) return;
  playTone(523, 0.1, "sine", 0.2); // C5
  setTimeout(() => playTone(659, 0.1, "sine", 0.2), 80); // E5
  setTimeout(() => playTone(784, 0.15, "sine", 0.25), 160); // G5
  setTimeout(() => playTone(1047, 0.2, "sine", 0.2), 240); // C6
}
