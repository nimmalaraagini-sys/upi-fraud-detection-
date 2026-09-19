/**
 * SafeUPI Demo Audio Narration Service
 * Uses the Web Speech API (SpeechSynthesis) for realistic, clear spoken audio
 * synchronized with each chapter of the demo video walkthrough.
 * Also provides sound effects for high-risk alert chimes and verification sounds.
 */

class DemoSpeechService {
  private isSpeaking: boolean = false;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    // Check speech synthesis support
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Warm up voices on first interaction
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  /**
   * Speaks a chapter's narration text clearly and deliberately
   */
  public speak(text: string, onEnd?: () => void, rate: number = 0.96) {
    if (this.isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) setTimeout(onEnd, 1000);
      return;
    }

    this.stop();

    try {
      const cleanText = text.replace(/[*_#"`]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;
      this.onEndCallback = onEnd || null;

      // Select a clean English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.lang.startsWith("en-IN") || v.lang.startsWith("en-GB") || v.lang.startsWith("en-US")) && !v.name.includes("whisper")
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = rate; // Clear, well-paced cadence for presentations
      utterance.pitch = 1.02; // Friendly, confident pitch
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        this.isSpeaking = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public pause() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
  }

  /**
   * Synthesize a subtle UI chime using Web Audio API
   */
  public playAlertChime(type: "warning" | "success" | "transition") {
    if (this.isMuted || typeof window === "undefined" || !("AudioContext" in window || "(window as any).webkitAudioContext")) {
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "warning") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }
}

export const demoSpeech = new DemoSpeechService();
