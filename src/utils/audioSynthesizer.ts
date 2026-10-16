// Web Audio API Synth for Retro Cyber Cafe Atmosphere

class AudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  // 1. Mechanical Keyboard Click (IBM Model M / Cherry MX Blue)
  public playKeyClick(variant: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // High-pitched initial plastic impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const baseFreq = 1800 + (variant % 5) * 120 + Math.random() * 80;
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    // Spring buckling metallic ping
    const springOsc = this.ctx.createOscillator();
    const springGain = this.ctx.createGain();
    springOsc.type = 'sine';
    springOsc.frequency.setValueAtTime(3200 + Math.random() * 400, t + 0.005);
    springOsc.frequency.exponentialRampToValueAtTime(900, t + 0.06);

    springGain.gain.setValueAtTime(0.08, t + 0.005);
    springGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    // Thump bottom out
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(140, t + 0.01);
    thump.frequency.exponentialRampToValueAtTime(40, t + 0.05);
    thumpGain.gain.setValueAtTime(0.12, t + 0.01);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    springOsc.connect(springGain);
    springGain.connect(this.ctx.destination);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
    springOsc.start(t + 0.005);
    springOsc.stop(t + 0.065);
    thump.start(t + 0.01);
    thump.stop(t + 0.055);
  }

  // 2. CRT Degauss Coil Discharge: The unforgettable "BOOOIINNNGG-BZZZZZT-CLACK"
  public playDegauss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low frequency magnetic surge
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.6);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.8);

    // Metallic spring vibration
    const wobbleOsc = this.ctx.createOscillator();
    const wobbleGain = this.ctx.createGain();
    wobbleOsc.type = 'sine';
    wobbleOsc.frequency.setValueAtTime(260, t);
    wobbleOsc.frequency.exponentialRampToValueAtTime(60, t + 0.7);
    wobbleGain.gain.setValueAtTime(0.2, t);
    wobbleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    // Filter to give it that heavy chassis resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(100, t + 0.8);

    osc.connect(filter);
    wobbleOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.85);
    wobbleOsc.start(t);
    wobbleOsc.stop(t + 0.85);

    // End relay click
    setTimeout(() => {
      this.playRelayClick();
    }, 750);
  }

  public playRelayClick() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.03);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  // 3. Yahoo / MSN Messenger "BUZZ / NUDGE" Sound
  public playMessengerBuzz() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + idx * 0.07;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });

    // Vibration rattle
    for (let i = 0; i < 4; i++) {
      const rattleTime = t + i * 0.06;
      const oscRattle = this.ctx.createOscillator();
      const gainRattle = this.ctx.createGain();
      oscRattle.type = 'triangle';
      oscRattle.frequency.setValueAtTime(120, rattleTime);
      gainRattle.gain.setValueAtTime(0.15, rattleTime);
      gainRattle.gain.exponentialRampToValueAtTime(0.001, rattleTime + 0.04);
      oscRattle.connect(gainRattle);
      gainRattle.connect(this.ctx.destination);
      oscRattle.start(rattleTime);
      oscRattle.stop(rattleTime + 0.045);
    }
  }

  // 4. BIOS Post Beep / OK Tone
  public playBiosBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // 5. 56k Dial-up Modem Sound Simulator (Short iconic snippet: dial tone, 5 DTMF, screech handshake, connect chime)
  public playDialupSample(onProgress?: (step: string) => void) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Step 1: Dial tone (350Hz + 440Hz)
    onProgress?.('Off hook... dial tone');
    const dt1 = this.ctx.createOscillator();
    const dt2 = this.ctx.createOscillator();
    const dtGain = this.ctx.createGain();
    dt1.frequency.setValueAtTime(350, t);
    dt2.frequency.setValueAtTime(440, t);
    dtGain.gain.setValueAtTime(0.08, t);
    dtGain.gain.setValueAtTime(0.08, t + 0.4);
    dtGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    dt1.connect(dtGain);
    dt2.connect(dtGain);
    dtGain.connect(this.ctx.destination);
    dt1.start(t);
    dt1.stop(t + 0.45);
    dt2.start(t);
    dt2.stop(t + 0.45);

    // Step 2: DTMF dialing (5 quick touch tones)
    const dtmfPairs = [
      [697, 1209], // 1
      [770, 1336], // 5
      [852, 1477], // 9
      [941, 1336], // 0
      [770, 1209], // 4
    ];

    dtmfPairs.forEach(([f1, f2], i) => {
      if (!this.ctx) return;
      const start = t + 0.5 + i * 0.1;
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      oscA.frequency.setValueAtTime(f1, start);
      oscB.frequency.setValueAtTime(f2, start);
      g.gain.setValueAtTime(0.1, start);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
      oscA.connect(g);
      oscB.connect(g);
      g.connect(this.ctx.destination);
      oscA.start(start);
      oscA.stop(start + 0.08);
      oscB.start(start);
      oscB.stop(start + 0.08);
    });

    // Step 3: Ring & Calling Handshake Screech (1.2s to 3.5s)
    setTimeout(() => {
      onProgress?.('Negotiating V.90 (56,000 bps)...');
    }, 1100);

    const screechStart = t + 1.2;
    // Chaotic carrier frequency modulation
    const carrier = this.ctx.createOscillator();
    const carrierMod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const carrierGain = this.ctx.createGain();

    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(2100, screechStart);
    carrier.frequency.linearRampToValueAtTime(1400, screechStart + 0.8);
    carrier.frequency.linearRampToValueAtTime(2400, screechStart + 1.6);

    carrierMod.type = 'sine';
    carrierMod.frequency.setValueAtTime(35, screechStart);
    carrierMod.frequency.linearRampToValueAtTime(180, screechStart + 1.6);
    modGain.gain.setValueAtTime(220, screechStart);

    carrierMod.connect(carrier.frequency);

    carrierGain.gain.setValueAtTime(0.001, screechStart);
    carrierGain.gain.linearRampToValueAtTime(0.09, screechStart + 0.1);
    carrierGain.gain.setValueAtTime(0.09, screechStart + 1.8);
    carrierGain.gain.exponentialRampToValueAtTime(0.001, screechStart + 2.2);

    carrier.connect(carrierGain);
    carrierGain.connect(this.ctx.destination);

    carrierMod.start(screechStart);
    carrier.start(screechStart);
    carrierMod.stop(screechStart + 2.2);
    carrier.stop(screechStart + 2.2);

    // Step 4: Final Connect Chime (CONNECT 56000)
    setTimeout(() => {
      onProgress?.('ONLINE: CONNECT 56000/V.90 / PROTOCOL OK');
      this.playConnectChime();
    }, 3400);
  }

  public playConnectChime() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.14, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  // 6. Floppy Disk Stepper Motor Sound
  public playFloppySeek() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const stepTime = t + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(280 + (i % 2) * 80, stepTime);
      gain.gain.setValueAtTime(0.1, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.025);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(stepTime);
      osc.stop(stepTime + 0.03);
    }
  }

  // 7. Coffee Mug Clink
  public playCoffeeClink() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, t);
    osc.frequency.exponentialRampToValueAtTime(2100, t + 0.15);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  // 8. Heavy Industrial Toggle Switch "CLACK-SNAP"
  public playHeavyToggle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // First high impact metallic contact
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1400, t);
    osc1.frequency.exponentialRampToValueAtTime(150, t + 0.025);
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    // Deep chassis thud
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, t + 0.005);
    osc2.frequency.exponentialRampToValueAtTime(55, t + 0.06);
    gain2.gain.setValueAtTime(0.35, t + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start(t);
    osc1.stop(t + 0.035);
    osc2.start(t + 0.005);
    osc2.stop(t + 0.07);
  }

  // 9. Rotary Dial Stepped Detent Click
  public playRotaryClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.015);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  }
}

export const audioSynth = new AudioSynth();
