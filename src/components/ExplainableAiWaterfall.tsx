import React from "react";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { FactorContribution } from "../types";

interface ExplainableAiWaterfallProps {
  factors: FactorContribution[];
  riskScore: number;
}

export const ExplainableAiWaterfall: React.FC<ExplainableAiWaterfallProps> = ({ factors, riskScore }) => {
  // Sort factors by magnitude
  const sortedFactors = [...factors].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  const maxWeight = Math.max(...factors.map(f => Math.abs(f.weight)), 40);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Why Did the Score Go Up or Down?
          </h2>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
          Transparent Explanation
        </span>
      </div>

      <p className="text-xs text-slate-500">
        See which details added risk points (red) and which details gave safety discounts (green).
      </p>

      <div className="space-y-3.5 pt-1">
        {sortedFactors.map((item, idx) => {
          const isRisk = item.type === "risk";
          const barWidthPercent = Math.min(100, Math.round((Math.abs(item.weight) / maxWeight) * 100));

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  {isRisk ? (
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span className="truncate max-w-[220px] sm:max-w-xs">{item.factor}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className={isRisk ? "text-rose-700 font-extrabold" : "text-emerald-700 font-extrabold"}>
                    {isRisk ? `+${item.weight} pts (Risky)` : `${item.weight} pts (Safe)`}
                  </span>
                </div>
              </div>

              {/* Dual Direction Visual Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5 border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    isRisk 
                      ? "bg-rose-500 ml-auto" 
                      : "bg-emerald-500 mr-auto"
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600">
                {item.explanation}
              </p>
            </div>
          );
        })}

        {sortedFactors.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            No specific safety or risk factors noted.
          </div>
        )}
      </div>

      {/* Summary note */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
        <span className="font-medium">Total Calculated Risk Score</span>
        <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
          {riskScore} / 100
        </span>
      </div>
    </div>
  );
};
