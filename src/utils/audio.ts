class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled = true;
  private bgmInterval: number | null = null;
  private bgmStep = 0;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration = 0.15,
    vol = 0.12,
    delay = 0
  ) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  public jump() {
    this.playTone(280, 'square', 0.12, 0.07, 0);
    this.playTone(440, 'square', 0.14, 0.07, 0.06);
  }

  public coin() {
    this.playTone(987.77, 'sine', 0.1, 0.11, 0);
    this.playTone(1318.51, 'sine', 0.25, 0.11, 0.08);
  }

  public correct() {
    this.playTone(523.25, 'triangle', 0.12, 0.14, 0);
    this.playTone(659.25, 'triangle', 0.12, 0.14, 0.1);
    this.playTone(783.99, 'triangle', 0.25, 0.14, 0.2);
  }

  public wrong() {
    this.playTone(240, 'sawtooth', 0.18, 0.09, 0);
    this.playTone(190, 'sawtooth', 0.25, 0.09, 0.14);
  }

  public levelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => this.playTone(n, 'triangle', 0.18, 0.14, i * 0.1));
  }

  public finish() {
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => this.playTone(n, 'sine', 0.22, 0.14, i * 0.12));
  }

  public startBGM() {
    if (this.bgmInterval !== null) return;
    const melody = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 392.0];
    this.bgmInterval = window.setInterval(() => {
      if (!this.enabled) return;
      const note = melody[this.bgmStep % melody.length];
      this.playTone(note, 'sine', 0.35, 0.025, 0);
      this.bgmStep++;
    }, 650);
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const AudioEngine = new SoundSynthesizer();
