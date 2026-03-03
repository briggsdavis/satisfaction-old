/**
 * audioClick.ts
 * Web Audio API sound generators for tactile button hover feedback.
 *
 * playClick()    — short, crisp noise burst for any button hover
 * playNavClick() — weighted mid-range click for nav link hovers (no sub-bass)
 *
 * Root cause of "silent first few hovers":
 *   AudioContext starts in 'suspended' state until a trusted user gesture
 *   (pointerdown / keydown). Previously, resume() was fire-and-forget, so
 *   audio nodes started while the context was still suspended and were silently
 *   dropped. Fix: eagerly unlock on first pointerdown/keydown, AND await the
 *   resume promise before creating any nodes.
 */

let ctx: AudioContext | null = null;
let resumePromise: Promise<void> | null = null;

function buildCtx(): void {
  if (ctx || typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;
  ctx = new AudioCtx();
  if (ctx.state !== 'running') {
    resumePromise = ctx.resume();
  }
}

// Unlock on the first real user gesture so the context is already running
// by the time hover sounds fire.  pointerdown fires before mousedown/click;
// keydown covers keyboard users.
if (typeof window !== 'undefined') {
  const prime = () => buildCtx();
  window.addEventListener('pointerdown', prime, { once: true });
  window.addEventListener('keydown', prime, { once: true });
}

async function getReadyCtx(): Promise<AudioContext | null> {
  buildCtx(); // no-op if already built
  if (!ctx) return null;

  // Await any pending resume from buildCtx()
  if (resumePromise) {
    await resumePromise;
    resumePromise = null;
  }

  // Safety net: if somehow still suspended, await a fresh resume
  if (ctx.state !== 'running') {
    await ctx.resume();
  }

  return ctx;
}

/** Short tactile click — bandpass-filtered white noise, ~35 ms */
export async function playClick(): Promise<void> {
  const ac = await getReadyCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const bufLen = Math.floor(ac.sampleRate * 0.035);
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

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
export async function playNavClick(): Promise<void> {
  const ac = await getReadyCtx();
  if (!ac) return;

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
  bp1.Q.value = 3.0;

  const gain1 = ac.createGain();
  gain1.gain.setValueAtTime(0.32, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

  src1.connect(bp1);
  bp1.connect(gain1);
  gain1.connect(ac.destination);
  src1.start(now);

  // ── Layer 2: high crack (~2400 Hz) ───────────────────────────────────────
  const src2 = ac.createBufferSource();
  src2.buffer = buf;

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
