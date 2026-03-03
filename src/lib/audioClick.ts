/**
 * audioClick.ts
 * Web Audio API sound generators for tactile button hover feedback.
 *
 * playClick()    — short, crisp noise burst for any button hover
 * playNavClick() — weighted mid-range click for nav link hovers (no sub-bass)
 *
 * AudioContext is created lazily on first call (satisfies browser autoplay policy).
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

function maybeResume(ac: AudioContext): void {
  if (ac.state === 'suspended') ac.resume();
}

/** Short tactile click — bandpass-filtered white noise, ~35 ms */
export function playClick(): void {
  const ac = getCtx();
  if (!ac) return;
  maybeResume(ac);

  const now = ac.currentTime;
  const bufLen = Math.floor(ac.sampleRate * 0.035);
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

  // Shape the noise as a crisp, high-register click
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3200;
  bp.Q.value = 1.2;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  src.connect(bp);
  bp.connect(gain);
  gain.connect(ac.destination);
  src.start(now);
}

/**
 * Nav tactile click — two bandpass noise layers, no sub-bass.
 * Sits lower than playClick() (mid-range vs high-register) giving it
 * more weight while staying firmly in "click" territory, not "thump".
 *
 * Layer 1 (~1100 Hz, Q=3)  — the body: rounded mechanical press
 * Layer 2 (~2400 Hz, Q=1)  — the crack: crisp tactile edge
 */
export function playNavClick(): void {
  const ac = getCtx();
  if (!ac) return;
  maybeResume(ac);

  const now = ac.currentTime;

  // Shared noise buffer (45 ms is enough for both layers)
  const bufLen = Math.floor(ac.sampleRate * 0.045);
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  // ── Layer 1: mid-range body (~1100 Hz) ───────────────────────────────────
  const src1 = ac.createBufferSource();
  src1.buffer = buf;

  const bp1 = ac.createBiquadFilter();
  bp1.type = 'bandpass';
  bp1.frequency.value = 1100;
  bp1.Q.value = 3.0; // resonant enough to sound like a key press

  const gain1 = ac.createGain();
  gain1.gain.setValueAtTime(0.32, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

  src1.connect(bp1);
  bp1.connect(gain1);
  gain1.connect(ac.destination);
  src1.start(now);

  // ── Layer 2: high crack (~2400 Hz) ───────────────────────────────────────
  const src2 = ac.createBufferSource();
  src2.buffer = buf; // reuse same buffer — different filter, different sound

  const bp2 = ac.createBiquadFilter();
  bp2.type = 'bandpass';
  bp2.frequency.value = 2400;
  bp2.Q.value = 1.0;

  const gain2 = ac.createGain();
  gain2.gain.setValueAtTime(0.16, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

  src2.connect(bp2);
  bp2.connect(gain2);
  gain2.connect(ac.destination);
  src2.start(now);
}
