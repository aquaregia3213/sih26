/**
 * Web Audio API synthesized acoustic sound effects for elderly cognitive feedback & sensory therapy
 * Pure client-side, offline-reliable, zero latency, no external audio file dependencies
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Gentle meditative bell / chime for peaceful affirmation (528 Hz Solfeggio)
  playGentleChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528 Hz Solfeggio frequency for calm
      osc.frequency.exponentialRampToValueAtTime(792, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch (e) {
      console.log('Audio chime not supported');
    }
  }

  // 2. Celebratory harp ripple for memory game completion
  playCelebration() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major pentatonic
      notes.forEach((freq, i) => {
        const now = ctx.currentTime + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch (e) {
      console.log('Celebration audio error');
    }
  }

  // 3. Gentle acoustic bamboo water drop for garden nurturing
  playWaterDrop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.log('Water drop error');
    }
  }

  // 4. Warm gentle traditional drum (Dhol/Khram) soft tap for sequence step
  playTraditionalDrum() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.log('Drum audio error');
    }
  }

  // 5. Soothing warm prompt click
  playSoftClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.log('Click error');
    }
  }

  // 6. Traditional Bamboo Flute / Pepa Melody (Soothing North East Folk Phrasing)
  playAssamFluteMelody() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Pentatonic melody: C5 -> D5 -> E5 -> G5 -> E5
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.45 },
        { freq: 587.33, time: 0.40, dur: 0.40 },
        { freq: 659.25, time: 0.75, dur: 0.55 },
        { freq: 783.99, time: 1.25, dur: 0.65 },
        { freq: 659.25, time: 1.85, dur: 0.90 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + time;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        // Subtle natural flute pitch vibrato
        osc.frequency.linearRampToValueAtTime(freq + 4, startTime + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, startTime + dur);

        // Gentle breath envelope
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch (e) {
      console.log('Flute melody error');
    }
  }

  // 7. Authentic Bihu Rhythm (Dum-Tak Dum-Dum-Tak Folk Cadence)
  playBihuRhythm() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Pattern: Beat 1 (Bass Dum), Beat 2 (Rim Tak), Beat 3 (Bass Dum), Beat 3.5 (Bass Dum), Beat 4 (Rim Tak)
      const beats = [
        { type: 'bass', time: 0.00, freq: 130 },
        { type: 'slap', time: 0.28, freq: 380 },
        { type: 'bass', time: 0.56, freq: 125 },
        { type: 'bass', time: 0.74, freq: 135 },
        { type: 'slap', time: 0.95, freq: 400 }
      ];

      beats.forEach(({ type, time, freq }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + time;

        if (type === 'bass') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.22);
          gain.gain.setValueAtTime(0.25, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);
        } else {
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, startTime);
          osc.frequency.exponentialRampToValueAtTime(160, startTime + 0.12);
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.log('Bihu rhythm error');
    }
  }

  // 8. Resonant Sacred Temple / Monastery Bell (432 Hz Solfeggio Healing Resonance)
  playTempleBell() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Fundamental 432 Hz with shimmering 864 Hz and 1296 Hz harmonics
      const partials = [
        { freq: 432, gainVal: 0.18, decay: 3.2 },
        { freq: 864, gainVal: 0.08, decay: 2.2 },
        { freq: 1296, gainVal: 0.04, decay: 1.5 },
        { freq: 2160, gainVal: 0.02, decay: 0.8 }
      ];

      partials.forEach(({ freq, gainVal, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gainVal, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.log('Temple bell error');
    }
  }

  // 9. Morning Mountain Birdsong (Tea Garden Sunrise Chirp)
  playMorningBirdSong() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // 3 delightful melodic bird chirps
      const chirps = [
        { start: 0.00, f1: 2200, f2: 3200, dur: 0.14 },
        { start: 0.18, f1: 2600, f2: 3600, dur: 0.18 },
        { start: 0.42, f1: 2400, f2: 3400, dur: 0.22 }
      ];

      chirps.forEach(({ start, f1, f2, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + start;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f1, startTime);
        osc.frequency.exponentialRampToValueAtTime(f2, startTime + dur * 0.6);
        osc.frequency.exponentialRampToValueAtTime(f1 + 300, startTime + dur);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch (e) {
      console.log('Birdsong error');
    }
  }

  // 10. Gentle Monsoon Rain on Tea Leaves (Filtered Soft White Noise Shower)
  playRainOnTeaLeaves() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const bufferSize = Math.floor(ctx.sampleRate * 2.2); // 2.2 seconds buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Lowpass filter to simulate soft raindrops on leaves (muffling harsh highs)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(650, ctx.currentTime + 2.0);

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 2.2);
    } catch (e) {
      console.log('Rain sound error');
    }
  }

  // 11. Meditative Tibetan Singing Bowl Drone
  playSingingBowl() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Two close sines creating a soothing 2 Hz acoustic pulsating beat
      const freqs = [432, 434];
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.8);
      });
    } catch (e) {
      console.log('Singing bowl error');
    }
  }

  // 12. Warm Voice Welcoming Chime (3-Note Ascending Chord)
  playWarmVoiceGreetingChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // A Major welcoming chord: A4 (440), C#5 (554.37), E5 (659.25)
      const chord = [440, 554.37, 659.25];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.13, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.4);
      });
    } catch (e) {
      console.log('Greeting chime error');
    }
  }
}

export const soundSynth = new SoundSynthesizer();
