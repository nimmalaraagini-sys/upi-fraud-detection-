import React from "react";
import { Sparkles, Shield, AlertTriangle, FileText, Phone, CheckCircle, RefreshCw } from "lucide-react";
import { ForensicReport } from "../types";

interface AiForensicsPanelProps {
  report: ForensicReport | null;
  isLoading: boolean;
  onRunAgain: () => void;
  onOpenCyberHelpline: () => void;
}

export const AiForensicsPanel: React.FC<AiForensicsPanelProps> = ({
  report,
  isLoading,
  onRunAgain,
  onOpenCyberHelpline
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Checking with AI Scam Detective...</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Reviewing scam tricks, RBI safety rules, and phone security signals in plain English...
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const isGeminiLive = report.source === "gemini_3_8_flash";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
      {/* Top title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              AI Scam Investigator Report
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isGeminiLive 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}>
                {isGeminiLive ? "Smart AI Analysis" : "Safety Rules Analysis"}
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={onRunAgain}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 font-medium"
        >
          <RefreshCw className="w-3 h-3" />
          Check Again
        </button>
      </div>

      {/* Attack Vector Highlight */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
        <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Identified Scam Pattern
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">
            {report.attackVector}
          </p>
        </div>
      </div>

      {/* Narrative */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Simple Summary
        </h4>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
          {report.forensicSummary}
        </div>
      </div>

      {/* Threat Actor Modus Operandi */}
      {report.threatActorModusOperandi && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            The Scammer's Trick Explained
          </h4>
          <p className="text-xs text-slate-800 bg-amber-50 border border-amber-200 p-3 rounded-xl leading-relaxed">
            {report.threatActorModusOperandi}
          </p>
        </div>
      )}

      {/* Official Safety Rule */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
        <span className="truncate">
          <strong className="text-slate-900">Official Safety Rule: </strong>
          {report.npciGuidelineReference}
        </span>
      </div>

      {/* Actionable Steps */}
      {report.consumerActionSteps && report.consumerActionSteps.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              What You Must Do Right Now
            </h4>
            <button
              onClick={onOpenCyberHelpline}
              className="text-xs text-rose-700 hover:text-rose-800 flex items-center gap-1 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
            >
              <Phone className="w-3 h-3 text-rose-600" />
              Dial 1930 Helpline
            </button>
          </div>
          <ul className="space-y-1.5">
            {report.consumerActionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-emerald-950 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
