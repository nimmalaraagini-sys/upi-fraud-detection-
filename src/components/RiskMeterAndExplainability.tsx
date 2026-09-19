import React, { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Lock, Zap, Info, ArrowUpRight, ArrowDownRight 
} from "lucide-react";

export interface RiskFactorItem {
  name: string;
  impactPoints?: number; // e.g. +35 or -15
  impact?: number; // alias for impactPoints
  type: "risk" | "safety" | "safe";
  humanExplanation: string;
}

interface RiskMeterAndExplainabilityProps {
  score: number; // 0 - 100
  riskLevel: "low" | "medium" | "high";
  reasons?: string[];
  userMessage?: string;
  recommendedAction?: string;
  factors?: RiskFactorItem[];
  amount?: number;
  recipient?: string;
  timeStr?: string;
  isNewDevice?: boolean;
  isNewRecipient?: boolean;
}

export const RiskMeterAndExplainability: React.FC<RiskMeterAndExplainabilityProps> = ({
  score,
  riskLevel,
  reasons,
  factors,
  amount = 5000,
  recipient = "friend@upi",
  timeStr = "02:00 AM",
  isNewDevice = false,
  isNewRecipient = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Derive human factors if not provided
  const derivedFactors: RiskFactorItem[] = factors && factors.length > 0 ? factors : [
    ...(amount > 1000 ? [{
      name: "Transfer Amount",
      impactPoints: Math.min(45, Math.round((amount / 400) * 8)),
      type: "risk" as const,
      humanExplanation: `₹${amount.toLocaleString("en-IN")} is significantly higher than your typical weekly ₹400 spending.`
    }] : [{
      name: "Typical Amount",
      impactPoints: -15,
      type: "safety" as const,
      humanExplanation: `₹${amount.toLocaleString("en-IN")} aligns closely with your regular purchase history.`
    }]),
    ...(timeStr.toLowerCase().includes("am") && (timeStr.startsWith("01") || timeStr.startsWith("02") || timeStr.startsWith("03") || timeStr.startsWith("04")) ? [{
      name: "Late Night Activity",
      impactPoints: 20,
      type: "risk" as const,
      humanExplanation: `Initiated at ${timeStr} — your usual transactions occur between 9:00 AM and 10:00 PM.`
    }] : [{
      name: "Normal Day Hours",
      impactPoints: -10,
      type: "safety" as const,
      humanExplanation: "Occurred during your active daily banking hours."
    }]),
    ...(isNewDevice ? [{
      name: "Unrecognized Device",
      impactPoints: 25,
      type: "risk" as const,
      humanExplanation: "Sent from a smartphone or browser not previously registered to your profile."
    }] : [{
      name: "Registered Device",
      impactPoints: -10,
      type: "safety" as const,
      humanExplanation: "Conducted on your recognized daily smartphone."
    }]),
    ...(isNewRecipient ? [{
      name: "First-Time Recipient",
      impactPoints: 20,
      type: "risk" as const,
      humanExplanation: `First payment to ${recipient} — no historical trust record established.`
    }] : [{
      name: "Established Beneficiary",
      impactPoints: -10,
      type: "safety" as const,
      humanExplanation: `You have sent money to ${recipient} previously without issue.`
    }])
  ];

  // Palette settings based on score
  const isLow = score <= 30;
  const isMedium = score > 30 && score <= 70;
  const isHigh = score > 70;

  const meterColor = isLow 
    ? "bg-emerald-500" 
    : isMedium 
    ? "bg-amber-500" 
    : "bg-rose-600";

  const badgeTheme = isLow 
    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
    : isMedium 
    ? "bg-amber-100 text-amber-900 border-amber-300"
    : "bg-rose-100 text-rose-900 border-rose-300";

  const meterGradient = isLow
    ? "from-emerald-400 to-emerald-600"
    : isMedium
    ? "from-amber-400 to-amber-600"
    : "from-rose-500 to-rose-700";

  return (
    <div className="rounded-3xl border border-rose-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4 text-slate-800">
      {/* Top Title & Risk Score Visual Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isLow ? "bg-emerald-600" : isMedium ? "bg-amber-600" : "bg-rose-700"
          }`}>
            {isLow ? <ShieldCheck className="w-6 h-6" /> : isMedium ? <HelpCircle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900">
                Risk Score: {score}/100
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeTheme}`}>
                {isLow ? "Protected · Safe" : isMedium ? "Unusual Pattern" : "High Risk · Flagged"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {isLow 
                ? "Instant reassurance: Parameters match normal patterns" 
                : isMedium 
                ? "Friendly check-in: We noticed minor deviations" 
                : "Safety pause: Matches patterns seen in reported cases"}
            </p>
          </div>
        </div>

        {/* Visual Meter Bar */}
        <div className="sm:text-right space-y-1 sm:min-w-[140px]">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>0</span>
            <span className="font-mono text-slate-900">{score}%</span>
            <span>100</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${meterGradient}`}
              style={{ width: `${Math.max(8, score)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subconscious reassurance for low-risk transactions */}
      {isLow && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-emerald-950 block">Protected by SafeUPI</strong>
            ₹{amount.toLocaleString("en-IN")} to {recipient} looks normal. Sent on your usual device at a normal time.
          </div>
        </div>
      )}

      {/* Explainability Accordion Header — "Why was this flagged?" */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-1 text-xs font-extrabold text-rose-950 hover:text-rose-800 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-rose-700" />
            Explainability — &ldquo;Why was this flagged?&rdquo;
          </span>
          <span className="text-xs text-rose-700 flex items-center gap-1">
            {isExpanded ? "Hide factor details" : "View factor details"}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {isExpanded && (
          <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
            <p className="text-xs text-slate-600 leading-relaxed">
              We look at mathematical factor weights (SHAP influence) to explain exactly why this score was reached in plain words:
            </p>

            <div className="space-y-2">
              {derivedFactors.map((item, idx) => {
                const points = item.impactPoints ?? item.impact ?? 0;
                const isRisk = item.type === "risk";
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      isRisk
                        ? "bg-rose-50/40 border-rose-100 hover:bg-rose-50/70"
                        : "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 flex items-center gap-1.5">
                        {isRisk ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {item.name}
                      </span>
                      <span className={`font-mono font-extrabold px-2 py-0.5 rounded-md ${
                        isRisk
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {points > 0 ? `+${points}` : points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {item.humanExplanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Trust & Privacy Reassurance note */}
      <div className="pt-3 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-rose-700" />
          We never store your transaction details.
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-600" />
          Checks happen in under a second (300ms).
        </span>
      </div>
    </div>
  );
};
