import React from "react";
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { RuleViolation } from "../types";

interface RuleViolationsListProps {
  rules: RuleViolation[];
}

export const RuleViolationsList: React.FC<RuleViolationsListProps> = ({ rules }) => {
  const getSeverityStyle = (severity: RuleViolation["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: "bg-rose-50/80 border-rose-200 text-rose-950",
          titleColor: "text-rose-950",
          badge: "bg-rose-600 text-white font-bold",
          badgeText: "High Danger",
          icon: AlertOctagon,
          iconColor: "text-rose-600",
          borderDiv: "border-rose-200",
          remedyTitle: "text-rose-800"
        };
      case "HIGH":
        return {
          bg: "bg-orange-50/80 border-orange-200 text-orange-950",
          titleColor: "text-orange-950",
          badge: "bg-orange-600 text-white font-bold",
          badgeText: "Warning",
          icon: AlertTriangle,
          iconColor: "text-orange-600",
          borderDiv: "border-orange-200",
          remedyTitle: "text-orange-800"
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-50/80 border-amber-200 text-amber-950",
          titleColor: "text-amber-950",
          badge: "bg-amber-500 text-white font-bold",
          badgeText: "Notice",
          icon: Info,
          iconColor: "text-amber-600",
          borderDiv: "border-amber-200",
          remedyTitle: "text-amber-800"
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-800",
          titleColor: "text-slate-900",
          badge: "bg-slate-600 text-white",
          badgeText: "Info",
          icon: Info,
          iconColor: "text-slate-600",
          borderDiv: "border-slate-200",
          remedyTitle: "text-slate-700"
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Security Warnings Triggered
          </h2>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
          {rules.length} {rules.length === 1 ? "Warning" : "Warnings"}
        </span>
      </div>

      {rules.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-emerald-900">All Security Checks Passed!</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            No scam tricks found. The phone is safe, the amount is normal, and there is no active screen sharing.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {rules.map((rule) => {
            const style = getSeverityStyle(rule.severity);
            const Icon = style.icon;

            return (
              <div
                key={rule.code}
                className={`p-3.5 rounded-xl border ${style.bg} transition-all space-y-2 shadow-2xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${style.iconColor}`} />
                    <span className={`text-xs font-bold tracking-tight ${style.titleColor}`}>
                      {rule.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${style.badge}`}>
                      {style.badgeText}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 shadow-2xs">
                      +{rule.scoreImpact} risk pts
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {rule.description}
                </p>

                {/* What to do remedy */}
                <div className={`pt-2 border-t ${style.borderDiv} flex items-start gap-1.5 text-[11px] text-slate-700`}>
                  <strong className={`${style.remedyTitle} font-bold shrink-0`}>What to do:</strong>
                  <span>{rule.remedy}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
