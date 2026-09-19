import React from "react";
import { Play, Zap } from "lucide-react";
import { PRESET_SCENARIOS } from "../data/presets";
import { PresetScenario } from "../types";

interface ScenarioPresetsProps {
  onSelectScenario: (scenario: PresetScenario) => void;
  activeScenarioId?: string;
}

export const ScenarioPresets: React.FC<ScenarioPresetsProps> = ({
  onSelectScenario,
  activeScenarioId
}) => {
  const getBadgeStyle = (risk: PresetScenario["expectedRisk"]) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-rose-50 border-rose-200 text-rose-700 font-bold";
      case "HIGH":
        return "bg-orange-50 border-orange-200 text-orange-700 font-bold";
      case "MODERATE":
        return "bg-amber-50 border-amber-200 text-amber-700 font-bold";
      case "SAFE":
        return "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Real Scam Examples (Click to Test)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any scenario to load it into the risk checker and see how scammers try to steal money.
          </p>
        </div>
        <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
          {PRESET_SCENARIOS.length} Scenarios Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_SCENARIOS.map((scenario) => {
          const isSelected = activeScenarioId === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-indigo-50/60 border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
              }`}
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="space-y-2.5">
                {/* Header Tag & Expected Risk */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    {scenario.categoryTag}
                  </span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(scenario.expectedRisk)}`}>
                    {scenario.expectedRisk === "CRITICAL" ? "HIGH DANGER" : `${scenario.expectedRisk} RISK`}
                  </span>
                </div>

                {/* Scenario Title */}
                <h3 className="text-sm font-bold text-slate-900">
                  {scenario.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {scenario.description}
                </p>

                {/* Key Metrics Chips */}
                <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-900 font-bold">
                    ₹{scenario.data.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 capitalize">
                    {scenario.data.channel.replace("_", " ")}
                  </span>
                  {scenario.data.screenShareAppActive && (
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 font-semibold">
                      AnyDesk Active
                    </span>
                  )}
                  {scenario.data.deviceChangedRecently && (
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200 font-semibold">
                      New Phone
                    </span>
                  )}
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {isSelected ? "Currently active" : "Click to test"}
                </span>
                <button
                  type="button"
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-200"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isSelected ? "Testing Now" : "Test This Scam"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
