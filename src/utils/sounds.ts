'use client';

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume context if suspended (browser auto-play policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const playPopSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
};

export const playSuccessSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
  oscillator.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1); // C#5
  oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
};
