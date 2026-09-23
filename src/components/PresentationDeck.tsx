import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Layers, FileText, CheckCircle2, ArrowRight, 
  Copy, Check, X, Sparkles, HelpCircle, BookOpen, Volume2, ShieldAlert,
  Network, Scale, Building2, LifeBuoy, Smartphone, Cpu, ShieldCheck
} from "lucide-react";
import { 
  PRESENTATION_SLIDES, 
  JUDGE_QUICK_ANSWERS, 
  FLOW_TO_MEMORIZE, 
  PROBLEM_STATEMENT_DATA,
  SAFEUPI_5_LAYERS,
  NORMAL_VS_SAFEUPI_COMPARISON,
  SlideItem 
} from "../data/presentationSlides";

interface PresentationDeckProps {
  onClose?: () => void;
}

type LangMode = "te_en" | "te_script" | "en";

export const PresentationDeck: React.FC<PresentationDeckProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [langMode, setLangMode] = useState<LangMode>("te_en");
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [showJudgeSheet, setShowJudgeSheet] = useState(false);
  const [showMemorizeFlow, setShowMemorizeFlow] = useState(false);
  const [showProblemStmt, setShowProblemStmt] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide: SlideItem = PRESENTATION_SLIDES[currentSlideIndex] || PRESENTATION_SLIDES[0];

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
    const transcript = PRESENTATION_SLIDES.map((s) => {
      let notes = s.speakerNotes;
      let title = s.title;
      let subtitle = s.subtitle;
      let summary = s.summary;

      if (langMode === "te_en") {
        notes = s.teluguEnglishSpeakerNotes || s.speakerNotes;
      } else if (langMode === "te_script") {
        notes = s.teluguSpeakerNotes || s.speakerNotes;
        title = s.teluguTitle || s.title;
        subtitle = s.teluguSubtitle || s.subtitle;
        summary = s.teluguSummary || s.summary;
      }

      return `SLIDE ${s.id}: ${title}\n${subtitle}\n\nSUMMARY: ${summary}\n\nKEY POINTS:\n${s.keyPoints.map((k) => `• ${k.heading}: ${k.description}`).join("\n")}\n\nSPEAKER SCRIPT:\n${notes}\n\n------------------------\n`;
    }).join("\n");

    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSlideTitle = () => {
    if (langMode === "te_script" && currentSlide.teluguTitle) return currentSlide.teluguTitle;
    return currentSlide.title;
  };

  const getSlideSubtitle = () => {
    if (langMode === "te_script" && currentSlide.teluguSubtitle) return currentSlide.teluguSubtitle;
    return currentSlide.subtitle;
  };

  const getSlideSummary = () => {
    if (langMode === "te_script" && currentSlide.teluguSummary) return currentSlide.teluguSummary;
    return currentSlide.summary;
  };

  const getActiveNotes = () => {
    if (langMode === "te_en") return currentSlide.teluguEnglishSpeakerNotes || currentSlide.speakerNotes;
    if (langMode === "te_script") return currentSlide.teluguSpeakerNotes || currentSlide.speakerNotes;
    return currentSlide.speakerNotes;
  };

  return (
    <div ref={containerRef} className="space-y-4 bg-slate-900 text-slate-100 p-3 sm:p-6 rounded-3xl shadow-2xl max-w-6xl mx-auto">
      {/* PPT Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">SafeUPI Presentation & Pitch Deck</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                7 Core Slides
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Team Secure Shield · "Check Before You Pay" · AI Fraud Detection & Recovery
            </p>
          </div>
        </div>

        {/* Action Controls & Language Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setLangMode("te_en")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                langMode === "te_en"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Telugu in English letters (Easy presentation delivery)"
            >
              Telugu-English 🗣️
            </button>
            <button
              type="button"
              onClick={() => setLangMode("te_script")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                langMode === "te_script"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Pure Telugu script (తెలుగు)"
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLangMode("en")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                langMode === "en"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Standard English"
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSpeakerNotes
                ? "bg-blue-500/30 text-blue-200 border border-blue-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {showSpeakerNotes ? "Hide Script" : "Speaker Script"}
          </button>

          <button
            type="button"
            onClick={() => setShowJudgeSheet(!showJudgeSheet)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showJudgeSheet
                ? "bg-amber-500/30 text-amber-200 border border-amber-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Judge Q&A
          </button>

          <button
            type="button"
            onClick={() => setShowMemorizeFlow(!showMemorizeFlow)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showMemorizeFlow
                ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Flow
          </button>

          <button
            type="button"
            onClick={() => setShowProblemStmt(!showProblemStmt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showProblemStmt
                ? "bg-rose-500/30 text-rose-200 border border-rose-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Problem
          </button>

          <button
            type="button"
            onClick={() => setShowLayers(!showLayers)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLayers
                ? "bg-cyan-500/30 text-cyan-200 border border-cyan-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            5-Layers
          </button>

          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComparison
                ? "bg-violet-500/30 text-violet-200 border border-violet-500/50"
                : "bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-violet-400" />
            Normal vs SafeUPI
          </button>

          <button
            type="button"
            onClick={handleCopyTranscript}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy full slide deck text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Deck"}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition-colors flex items-center gap-1 text-xs font-bold px-2.5 cursor-pointer"
              title="Close Presentation View"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK EXPANDABLE: FLOW TO MEMORIZE */}
      {showMemorizeFlow && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Most Important Flow to Memorize for Presentation (ప్రాజెక్ట్ ప్రధాన ఫ్లో)
            </span>
            <button
              type="button"
              onClick={() => setShowMemorizeFlow(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs text-slate-200">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-600/30">
              <strong className="text-emerald-400 block mb-0.5">🗣️ Telugu in English Letters (Speaking):</strong>
              <p className="leading-relaxed">{FLOW_TO_MEMORIZE.teluguEnglish}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-600/30">
              <strong className="text-emerald-300 block mb-0.5">తెలుగు (Telugu Script):</strong>
              <p className="leading-relaxed">{FLOW_TO_MEMORIZE.telugu}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-600/30">
              <strong className="text-blue-300 block mb-0.5">English:</strong>
              <p className="leading-relaxed">{FLOW_TO_MEMORIZE.english}</p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK EXPANDABLE: JUDGE Q&A ONE-LINE ANSWERS */}
      {showJudgeSheet && (
        <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-2xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Judge Ki Tools One-Line Answers (Cheat Sheet)
              </h3>
              <p className="text-[11px] text-amber-200/80">
                If judges ask: "Why did you use React, Vite, Rule Engine, Gemini, or Traceback?" Give these crisp answers:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowJudgeSheet(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {JUDGE_QUICK_ANSWERS.map((q, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-400 block">{q.tool}</span>
                <p className="text-slate-200 text-[11px]">
                  <strong className="text-slate-400">Telugu-Eng:</strong> {q.teluguEnglish}
                </p>
                <p className="text-slate-300 text-[11px]">
                  <strong className="text-slate-400">English:</strong> {q.english}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK EXPANDABLE: PROBLEM STATEMENT (TRILINGUAL) */}
      {showProblemStmt && (
        <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Problem Statement — Full Narrative & 1-Line Definitions
              </h3>
              <p className="text-[11px] text-rose-200/80">
                Why SafeUPI exists and the exact cybercrime problem we are solving
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProblemStmt(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-slate-200">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/20 space-y-1">
              <strong className="text-rose-400 block">🗣️ Telugu in English Letters (How to explain to judges):</strong>
              <p className="leading-relaxed text-[12px]">{PROBLEM_STATEMENT_DATA.teluguEnglish}</p>
              <div className="pt-1.5 mt-1 border-t border-slate-800 text-[11px] text-amber-300">
                <strong>1-Line Summary:</strong> {PROBLEM_STATEMENT_DATA.oneLineTeluguEnglish}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/20 space-y-1">
              <strong className="text-rose-300 block">తెలుగు (Telugu Script):</strong>
              <p className="leading-relaxed text-[12px]">{PROBLEM_STATEMENT_DATA.telugu}</p>
              <div className="pt-1.5 mt-1 border-t border-slate-800 text-[11px] text-amber-300">
                <strong>ఒక్క వాక్యంలో:</strong> {PROBLEM_STATEMENT_DATA.oneLineTelugu}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/20 space-y-1">
              <strong className="text-blue-300 block">English (Formal Problem Statement):</strong>
              <p className="leading-relaxed text-[12px]">{PROBLEM_STATEMENT_DATA.english}</p>
              <div className="pt-1.5 mt-1 border-t border-slate-800 text-[11px] text-emerald-300">
                <strong>1-Line Core Problem:</strong> {PROBLEM_STATEMENT_DATA.oneLineEnglish}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK EXPANDABLE: 5 CONNECTED LAYERS ARCHITECTURE */}
      {showLayers && (
        <div className="bg-cyan-950/70 border border-cyan-500/40 p-4 rounded-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Network className="w-4 h-4 text-cyan-400" />
                SafeUPI 5 Connected Layers Architecture (Full Ecosystem)
              </h3>
              <p className="text-[11px] text-cyan-200/80">
                User → SafeUPI App → Payment & User Services → Fraud/AI Security Engine → Bank/UPI/PSP System → Result, Monitoring & Recovery
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLayers(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {SAFEUPI_5_LAYERS.map((layer) => (
              <div
                key={layer.number}
                className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center border border-cyan-500/40">
                      {layer.number}
                    </span>
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">
                      {layer.name}
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold text-cyan-300 mb-1.5">
                    {langMode === "te_script" ? layer.teluguName : layer.headline}
                  </p>

                  <div className="space-y-1 mb-2">
                    {layer.components.map((comp, i) => (
                      <div key={i} className="text-[10px] text-slate-300 flex items-start gap-1">
                        <span className="text-cyan-400 shrink-0">•</span>
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1">
                  <p className="text-slate-400 leading-snug">
                    <strong className="text-slate-300">Duty:</strong> {langMode === "te_script" ? layer.teluguResponsibilities : layer.responsibilities}
                  </p>
                  <p className="text-emerald-300 font-medium leading-snug">
                    <strong className="text-emerald-400">Security:</strong> {layer.securityGuarantee}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK EXPANDABLE: NORMAL UPI VS SAFEUPI COMPARISON */}
      {showComparison && (
        <div className="bg-violet-950/70 border border-violet-500/40 p-4 rounded-2xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-violet-500/30 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-violet-400" />
                The Core Difference: Normal UPI App vs SafeUPI
              </h3>
              <p className="text-[11px] text-violet-200/80">
                {langMode === "te_script" 
                  ? NORMAL_VS_SAFEUPI_COMPARISON.teluguPunchline.safeupi
                  : NORMAL_VS_SAFEUPI_COMPARISON.punchline.safeupi}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowComparison(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                Standard UPI App (Payment System Only)
              </span>
              <p className="text-xs text-slate-300">
                &ldquo;Here is a payment system.&rdquo; Blindly dispatches money without pre-verification, provides zero explanation on suspicious traps, and leaves victims completely helpless post-fraud.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                SafeUPI (Personal Cybersecurity Envelope)
              </span>
              <p className="text-xs text-slate-300">
                &ldquo;Payment system + personal security layer + fraud intelligence + recovery assistance + money-management tools.&rdquo; Intercepts on edge before PIN, explains why with XAI &amp; Gemini, and accelerates 1930 Golden Hour restitution.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-violet-500/30 text-slate-400 text-[11px]">
                  <th className="pb-2 w-1/4">Dimension</th>
                  <th className="pb-2 w-3/8 text-rose-300">Traditional UPI Apps</th>
                  <th className="pb-2 w-3/8 text-emerald-300">SafeUPI (Secure Shield)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {NORMAL_VS_SAFEUPI_COMPARISON.comparisons.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-900/50">
                    <td className="py-2 font-bold text-violet-300">{c.dimension}</td>
                    <td className="py-2 text-slate-400 pr-3">{c.normal}</td>
                    <td className="py-2 text-slate-200 font-medium pl-1 text-emerald-200/90">{c.safeupi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Slide Presentation Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* Slide Header: Category & Slide Number */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
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
              {getSlideTitle()}
            </h1>
            <p className="text-sm sm:text-base text-blue-300 font-medium">
              {getSlideSubtitle()}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-4xl">
              {getSlideSummary()}
            </p>
          </div>

          {/* Diagram visual for Slide 2 or 3 */}
          {currentSlide.visualType === "diagram_mule" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Multi-Hop Money Trail (0 - 15 Minutes Breakdown)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 space-y-1">
                  <div className="font-bold text-white">1. Victim Account</div>
                  <div className="text-[10px] text-rose-300">₹50,000 Debited</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 0</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-950/60 border border-orange-800 text-orange-200 space-y-1">
                  <div className="font-bold text-white">2. Layer 1 Mule</div>
                  <div className="text-[10px] text-orange-300">Compromised UPI ID</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 2</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 space-y-1">
                  <div className="font-bold text-white">3. Layer 2 Splitting</div>
                  <div className="text-[10px] text-amber-300">Split into small transfers</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 6</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 space-y-1">
                  <div className="font-bold text-white">4. Off-Ramp Target</div>
                  <div className="text-[10px] text-emerald-300">ATM Kiosk / Crypto</div>
                  <div className="text-[10px] font-mono text-slate-400">Minute 12</div>
                </div>
              </div>
            </div>
          )}

          {currentSlide.visualType === "flow_recovery" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Our 4-Stage Core Flow
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-700/50">
                  <span className="font-bold text-blue-300 block">1. DETECT</span>
                  <span className="text-[10px] text-slate-400">Pre-auth risk rules</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-700/50">
                  <span className="font-bold text-indigo-300 block">2. EXPLAIN</span>
                  <span className="text-[10px] text-slate-400">Explainable AI waterfall</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-700/50">
                  <span className="font-bold text-amber-300 block">3. PREVENT</span>
                  <span className="text-[10px] text-slate-400">Warning & Cooling holds</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50">
                  <span className="font-bold text-emerald-300 block">4. RECOVER</span>
                  <span className="text-[10px] text-slate-400">1930 & Golden Hour freeze</span>
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
          {currentSlide.rbiCitation && (
            <div className="pt-2 flex items-center gap-1.5 text-xs border-t border-slate-800 text-slate-400">
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                <strong className="text-slate-300">Regulatory Framework:</strong> {currentSlide.rbiCitation}
              </span>
            </div>
          )}
        </div>

        {/* Slide Navigation Bottom Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 relative z-10">
          <button
            type="button"
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Slide Dots */}
          <div className="flex items-center gap-1.5 max-w-md overflow-x-auto py-1">
            {PRESENTATION_SLIDES.map((s, idx) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? "bg-blue-400 scale-125"
                    : "bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Slide ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
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
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Speaker Pitch Script (Slide {currentSlide.id} of {PRESENTATION_SLIDES.length})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Delivery Language:</span>
              <span className="font-semibold text-blue-300">
                {langMode === "te_en" ? "Telugu in English letters" : langMode === "te_script" ? "తెలుగు (Telugu)" : "English"}
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/90 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
            {getActiveNotes()}
          </div>
        </div>
      )}

      {/* Thumbnail Navigation Drawer */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Click Any Slide to Jump
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {PRESENTATION_SLIDES.map((s, idx) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                idx === currentSlideIndex
                  ? "bg-slate-700 border-blue-400 ring-1 ring-blue-400/40 shadow-xs"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono text-blue-300 font-semibold block mb-0.5">
                Slide {s.id}
              </span>
              <span className="font-semibold text-white truncate block text-[11px]">
                {s.title.replace("SafeUPI — ", "")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
