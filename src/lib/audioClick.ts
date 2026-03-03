/**
 * audioClick.ts
 * Web Audio API sound generators for tactile button hover feedback.
 *
 * playClick()    — short, crisp noise burst for any button hover
 * playNavClick() — weighted mid-range click for nav link hovers (no sub-bass)
 *
 * AudioContext lifecycle
 * ─────────────────────
 * The context is created ONLY inside pointerdown / keydown handlers (trusted
 * browser gestures). A context created there starts in 'running' state
 * immediately (Chrome 71+, Firefox, Safari).
 *
 * If a hover fires before any pointerdown/keydown the context doesn't exist
 * yet, getReadyCtx() returns null, and the sound is silently skipped — this
 * is the correct behaviour; browsers forbid audio before user interaction.
 *
 * Previous bug: buildCtx() was also called from getReadyCtx() which runs
 * on every mouseover. That created the context from a non-trusted event,
 * leaving it suspended. The pointerdown prime listener then called buildCtx()
 * which was a no-op (ctx already set), so the context never got resumed.
 */

let ctx: AudioContext | null = null;

function buildCtx(): void {
  if (ctx || typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;
  ctx = new AudioCtx();
  // Context created inside a trusted gesture → starts as 'running' in
  // Chrome 71+. No resume() call needed; add a safety net in getReadyCtx.
}

// Only create the context on real user gestures.
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', buildCtx, { once: true });
  window.addEventListener('keydown', buildCtx, { once: true });
}

async function getReadyCtx(): Promise<AudioContext | null> {
  // Context not yet unlocked by a user gesture — skip silently.
  if (!ctx) return null;

  // Safety net for browsers that still suspend on creation.
  if (ctx.state !== 'running') await ctx.resume();

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
