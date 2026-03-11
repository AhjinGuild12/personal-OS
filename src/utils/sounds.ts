// Lazy AudioContext singleton — created on first user interaction to satisfy browser autoplay policy
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playClick(): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Frequency sweep 800→400 Hz over 50ms gives a short retro "blip"
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

  // Quick fade-out so it doesn't clip
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}
