export class SoundGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initAudio();
  }

  private initAudio(): void {
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  private ensureContext(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  jump(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const now = this.ctx.currentTime;

    // Rising pitch for jump
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(400, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  shootSmall(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const now = this.ctx.currentTime;

    // Quick "pew" sound
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.linearRampToValueAtTime(200, now + 0.08);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  shootCharged(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    // Layered sound for charged shot
    const now = this.ctx.currentTime;

    // Low bass
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(100, now);
    osc1.frequency.linearRampToValueAtTime(50, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.linearRampToValueAtTime(0, now + 0.3);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // High "boom"
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(400, now);
    osc2.frequency.linearRampToValueAtTime(100, now + 0.2);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    gain2.gain.setValueAtTime(0.25, now);
    gain2.gain.linearRampToValueAtTime(0, now + 0.25);
    osc2.start(now);
    osc2.stop(now + 0.25);
  }

  collectEnergy(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const now = this.ctx.currentTime;

    // Rising "pling" sound
    const frequencies = [523, 659, 784]; // C5, E5, G5
    frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.05 + 0.15);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.15);
    });
  }

  enemyHit(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const now = this.ctx.currentTime;

    // Low thud
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.linearRampToValueAtTime(80, now + 0.1);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.12);

    oscillator.start(now);
    oscillator.stop(now + 0.12);
  }

  playerHit(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const now = this.ctx.currentTime;

    // Falling pitch damage sound
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.25);

    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }

  cardSelect(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const now = this.ctx.currentTime;

    // Positive jingle
    const notes = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.1 },    // E5
      { freq: 784, time: 0.2 },    // G5
      { freq: 1047, time: 0.3 },   // C6
    ];

    notes.forEach(({ freq, time }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      gain.gain.setValueAtTime(0.2, now + time);
      gain.gain.linearRampToValueAtTime(0, now + time + 0.2);
      osc.start(now + time);
      osc.stop(now + time + 0.2);
    });
  }

  levelComplete(): void {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.ensureContext();

    const now = this.ctx.currentTime;

    // Victory fanfare
    const notes = [
      { freq: 392, time: 0 },      // G4
      { freq: 523, time: 0.15 },   // C5
      { freq: 659, time: 0.3 },    // E5
      { freq: 784, time: 0.45 },   // G5
      { freq: 1047, time: 0.6 },   // C6
    ];

    notes.forEach(({ freq, time }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      gain.gain.setValueAtTime(0.15, now + time);
      gain.gain.linearRampToValueAtTime(0.1, now + time + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + time + 0.25);
      osc.start(now + time);
      osc.stop(now + time + 0.25);
    });
  }
}
