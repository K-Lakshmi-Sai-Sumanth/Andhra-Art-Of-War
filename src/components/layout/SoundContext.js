"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const SoundContext = createContext({
  soundEnabled: false,
  toggleSound: () => {},
  playWhoosh: () => {},
  playBell: () => {},
  playWoodClick: () => {},
});

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const toggleSound = () => {
    initAudio();
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        // play gentle confirmation chime
        playBell(660, 0.4);
      }
      return next;
    });
  };

  // Synthesize martial bamboo whoosh sound
  const playWhoosh = (intensity = 1.0) => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White/pink noise base
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      const startTime = ctx.currentTime;
      filter.frequency.setValueAtTime(300, startTime);
      filter.frequency.exponentialRampToValueAtTime(1400 * intensity, startTime + 0.12);
      filter.frequency.exponentialRampToValueAtTime(350, startTime + 0.24);
      filter.Q.setValueAtTime(4.0, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.2 * Math.min(1.5, intensity), startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(startTime);
      noise.stop(startTime + 0.25);
    } catch {
      // Audio fallback silent
    }
  };

  // Synthesize traditional brass temple bell / gong resonance
  const playBell = (freq = 528, duration = 1.8) => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2.76, now); // Bell harmonic overtone

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.2, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration);
      oscHarmonic.stop(now + duration);
    } catch {
      // Audio fallback silent
    }
  };

  // Synthesize wood staff clash or UI tap
  const playWoodClick = () => {
    if (!soundEnabled) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback silent
    }
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playWhoosh,
        playBell,
        playWoodClick,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
