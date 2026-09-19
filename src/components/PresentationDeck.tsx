import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Layers, FileText, CheckCircle2, ArrowRight, 
  Database, Copy, Check, X, Sparkles
} from "lucide-react";
import { PRESENTATION_SLIDES } from "../data/presentationSlides";

interface PresentationDeckProps {
  onClose?: () => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Escape" && onClose && !document.fullscreenElement) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopyTranscript = () => {
    const transcript = PRESENTATION_SLIDES.map(
      (s) => `SLIDE ${s.id}: ${s.title}\n${s.subtitle}\n\nSUMMARY: ${s.summary}\n\nKEY POINTS:\n${s.keyPoints.map((k) => `• ${k.heading}: ${k.description}`).join("\n")}\n\nRBI/REGULATORY: ${s.rbiCitation || "N/A"}\n\nSPEAKER SCRIPT:\n${s.speakerNotes}\n\n------------------------\n`
    ).join("\n");

    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div ref={containerRef} className="space-y-4 bg-slate-900 text-slate-100 p-3 sm:p-6 rounded-3xl shadow-2xl max-w-6xl mx-auto">
      {/* PPT Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 p-0.5 flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Standalone Presentation Deck
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                10 Slides
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              UPI Fraud Detection, Money Tracing, RBI Safety Rules & Recovery
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSpeakerNotes
                ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {showSpeakerNotes ? "Hide Notes" : "Show Notes"}
          </button>

          <button
            onClick={handleCopyTranscript}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Copy full slide deck text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Text"}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition-colors flex items-center gap-1 text-xs font-bold px-2.5"
              title="Close Presentation View"
            >
              <X className="w-4 h-4" />
              <span>Close PPT</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Presentation Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* Slide Header: Category & Slide Number */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              · {currentSlide.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">
              Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
            </span>
          </div>
        </div>

        {/* Slide Body */}
        <div className="py-6 space-y-5 relative z-10 my-auto">
          {/* Slide Title & Subtitle */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-300 font-medium">
              {currentSlide.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-4xl">
              {currentSlide.summary}
            </p>
          </div>

          {/* Diagram mule visual */}
          {currentSlide.visualType === "diagram_mule" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Step-by-Step Stolen Money Flow (0 - 15 Minutes)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 space-y-1">
                  <div className="font-bold text-white">1. Your Account</div>
                  <div className="text-[10px] text-rose-300">₹50,000 Debited</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 0</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-950/60 border border-orange-800 text-orange-200 space-y-1">
                  <div className="font-bold text-white">2. Mule Account 1</div>
                  <div className="text-[10px] text-orange-300">Rented UPI ID</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 2</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 space-y-1">
                  <div className="font-bold text-white">3. Mule Account 2</div>
                  <div className="text-[10px] text-amber-300">Split into small parts</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 6</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 space-y-1">
                  <div className="font-bold text-white">4. Cashout Attempt</div>
                  <div className="text-[10px] text-emerald-300">ATM or Crypto</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 12</div>
                </div>
              </div>
            </div>
          )}

          {currentSlide.visualType === "diagram_blockchain" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                How Police Trace Stolen Crypto Transactions
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 w-full text-center">
                  <span className="text-amber-400 font-bold block">1. UPI Payment</span>
                  <span className="text-[11px] text-slate-400">Money to Trader</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden sm:block" />
                <div className="p-3 rounded-lg bg-slate-800 border border-indigo-700 w-full text-center">
                  <span className="text-indigo-400 font-bold block">2. Crypto Transfer</span>
                  <span className="text-[11px] text-slate-400">Online Coin Wallet</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden sm:block" />
                <div className="p-3 rounded-lg bg-slate-800 border border-indigo-700 w-full text-center">
                  <span className="text-indigo-400 font-bold block">3. Wallet Tracing</span>
                  <span className="text-[11px] text-slate-400">Ledger Analysis</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden sm:block" />
                <div className="p-3 rounded-lg bg-slate-800 border border-emerald-700 w-full text-center">
                  <span className="text-emerald-400 font-bold block">4. Police Freeze</span>
                  <span className="text-[11px] text-slate-400">Account Blacklisted</span>
                </div>
              </div>
            </div>
          )}

          {currentSlide.visualType === "table_liability" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                RBI Customer Protection Rules (When You Get 100% Refund)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 space-y-1">
                  <span className="text-emerald-400 font-bold block">100% REFUND GUARANTEE</span>
                  <p className="text-[11px] text-slate-300">
                    Reported within <strong>3 working days</strong>. Bank must return full amount within 10 days.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800 space-y-1">
                  <span className="text-amber-400 font-bold block">LIMITED LOSS</span>
                  <p className="text-[11px] text-slate-300">
                    Reported within <strong>4 to 7 working days</strong>. Max victim loss is capped at ₹10,000.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 space-y-1">
                  <span className="text-rose-400 font-bold block">BANK REVIEW</span>
                  <p className="text-[11px] text-slate-300">
                    Beyond 7 days, compensation depends on individual bank policy or Banking Ombudsman.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Bullet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentSlide.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{point.heading}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-5">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          {/* Regulatory Citation */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-slate-800">
            {currentSlide.rbiCitation && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-slate-300">Official Safety Rule:</strong> {currentSlide.rbiCitation}
                </span>
              </div>
            )}
            {currentSlide.blockchainContext && (
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px]">{currentSlide.blockchainContext}</span>
              </div>
            )}
          </div>
        </div>

        {/* Slide Navigation Bottom Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 relative z-10">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Slide Dots */}
          <div className="flex items-center gap-1.5 max-w-md overflow-x-auto py-1">
            {PRESENTATION_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? "bg-indigo-400 scale-125"
                    : "bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Slide ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speaker Notes View */}
      {showSpeakerNotes && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Speaker Pitch Script (Slide {currentSlide.id} of 10)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Plain English narration for presentations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            &ldquo;{currentSlide.speakerNotes}&rdquo;
          </p>
        </div>
      )}

      {/* Thumbnail Navigation Drawer */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Click Any Slide to Jump
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESENTATION_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                idx === currentSlideIndex
                  ? "bg-slate-700 border-indigo-400 ring-1 ring-indigo-400/40 shadow-xs"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono text-indigo-300 font-semibold block mb-0.5">
                Slide {s.id}
              </span>
              <span className="font-semibold text-white truncate block text-[11px]">
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
