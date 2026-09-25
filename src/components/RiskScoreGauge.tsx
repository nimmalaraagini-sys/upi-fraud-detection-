import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame, ArrowRight, CheckCircle2, Lock, Clock, Sparkles } from "lucide-react";
import { AnalysisResult } from "../types";

interface RiskScoreGaugeProps {
  analysis: AnalysisResult;
  onInvestigateAi?: () => void;
  isLoadingAi?: boolean;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ analysis, onInvestigateAi, isLoadingAi }) => {
  const { riskScore, riskLevel, decision, mlConfidence, ruleScoreComponent, mlScoreComponent, summaryReason } = analysis;

  // Determine color theme & simple plain-English wording based on riskLevel
  const config = {
    SAFE: {
      color: "text-emerald-700",
      strokeColor: "#059669",
      badgeBg: "bg-emerald-50 border-emerald-300 text-emerald-800",
      label: "SAFE TO PROCEED",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      decisionText: "PAYMENT ALLOWED",
      decisionBg: "bg-emerald-50 border-emerald-300 text-emerald-950",
      subtext: "Everything looks normal. No scam signs found."
    },
    MODERATE: {
      color: "text-amber-800",
      strokeColor: "#d97706",
      badgeBg: "bg-amber-50 border-amber-300 text-amber-900",
      label: "BE CAREFUL (MODERATE RISK)",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      decisionText: "EXTRA VERIFICATION NEEDED (FINGERPRINT / OTP)",
      decisionBg: "bg-amber-50 border-amber-300 text-amber-950",
      subtext: "Some details look new or unusual. Check carefully before paying."
    },
    HIGH: {
      color: "text-orange-800",
      strokeColor: "#ea580c",
      badgeBg: "bg-orange-50 border-orange-300 text-orange-900",
      label: "HIGH RISK WARNING",
      icon: AlertOctagon,
      iconColor: "text-orange-600",
      decisionText: "HOLD PAYMENT FOR 4 HOURS (SAFETY CHECK)",
      decisionBg: "bg-orange-50 border-orange-300 text-orange-950",
      subtext: "Suspicious signs detected. RBI rules advise a 4-hour pause."
    },
    CRITICAL: {
      color: "text-rose-800",
      strokeColor: "#e11d48",
      badgeBg: "bg-rose-50 border-rose-300 text-rose-900",
      label: "DANGEROUS SCAM DETECTED",
      icon: Flame,
      iconColor: "text-rose-600",
      decisionText: "PAYMENT BLOCKED FOR YOUR SAFETY",
      decisionBg: "bg-rose-50 border-rose-300 text-rose-950",
      subtext: "Active scam in progress (e.g. AnyDesk screen sharing or fake prize)."
    }
  }[riskLevel];

  const Icon = config.icon;

  // Gauge calculation for semi-circle arc
  const radius = 75;
  const arcLength = Math.PI * radius; // ~235.6
  const strokeDashoffset = arcLength - (riskScore / 100) * arcLength;

  // Smooth numerical count animation
  const [animatedScore, setAnimatedScore] = React.useState(riskScore);
  React.useEffect(() => {
    let start = animatedScore;
    const end = riskScore;
    if (start === end) return;
    const duration = 600;
    const startTime = performance.now();

    let animId: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(start + (end - start) * ease));
      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [riskScore]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header bar with risk tag */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-500 ${config.badgeBg}`}>
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
              {config.label}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-500">System Confidence: </span>
            <span className="text-xs font-mono font-bold text-slate-800">{mlConfidence}%</span>
          </div>
        </div>

        {/* Gauge visual */}
        <div className="flex flex-col items-center justify-center my-2 relative">
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 180 100">
            {/* Background Arc */}
            <path
              d="M 15 90 A 75 75 0 0 1 165 90"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Foreground Score Arc */}
            <path
              d="M 15 90 A 75 75 0 0 1 165 90"
              fill="none"
              stroke={config.strokeColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.6s ease"
              }}
            />
          </svg>

          {/* Centered Score text */}
          <div className="absolute top-10 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900 flex items-baseline">
              {animatedScore}
              <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
            </span>
            <span className="text-xs font-semibold text-slate-600 mt-0.5">
              Risk Score (0 = Safe, 100 = Scam)
            </span>
          </div>
        </div>

        {/* Action / Decision Card */}
        <div className={`mt-3 p-3.5 rounded-xl border ${config.decisionBg} flex items-center justify-between gap-3 shadow-2xs`}>
          <div className="flex items-center gap-2.5">
            {decision === "ALLOW" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {decision === "STEP_UP_2FA" && <Lock className="w-5 h-5 text-amber-600 shrink-0" />}
            {decision === "COOLING_PERIOD" && <Clock className="w-5 h-5 text-orange-600 shrink-0" />}
            {decision === "BLOCK_AND_FREEZE" && <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide">
                What to do: {config.decisionText}
              </p>
              <p className="text-[11px] leading-tight mt-0.5 opacity-90">
                {summaryReason}
              </p>
            </div>
          </div>
        </div>

        {/* Score Components breakdown in simple English */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span className="font-medium">Security Rules Triggered</span>
              <span className="font-mono font-bold text-indigo-700">{ruleScoreComponent} points</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ruleScoreComponent)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span className="font-medium">AI Unusual Behavior Rating</span>
              <span className="font-mono font-bold text-cyan-700">{mlScoreComponent}% unusual</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-cyan-600 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, mlScoreComponent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Investigation Button */}
      {onInvestigateAi && (
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            id="btn-trigger-ai-forensics"
            onClick={onInvestigateAi}
            disabled={isLoadingAi}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            {isLoadingAi ? "Checking Details with AI..." : "Ask AI: Explain Why This Is Suspicious"}
          </button>
        </div>
      )}
    </div>
  );
};
