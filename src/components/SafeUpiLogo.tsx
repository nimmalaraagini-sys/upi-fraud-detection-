import React from "react";
import { Shield, Sparkles } from "lucide-react";

interface SafeUpiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTeam?: boolean;
  lightText?: boolean;
}

export const SafeUpiLogo: React.FC<SafeUpiLogoProps> = ({
  size = "md",
  showText = true,
  showTeam = true,
  lightText = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Emblem: Modern Shield + Payment Geometric Mark with Rich Indigo-Cyan-Emerald Gradient */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0 transition-transform hover:scale-105`}
      >
        <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-30" />
          
          {/* Central Shield with Inner Rupee Mark */}
          <div className="relative z-10 flex items-center justify-center">
            <Shield className={`${iconSizes[size]} text-cyan-400`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-black text-white leading-none tracking-tighter drop-shadow-xs">
                ₹
              </span>
            </div>
          </div>
          
          {/* Active Security Pulse Indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-tight ${
                size === "xl"
                  ? "text-3xl"
                  : size === "lg"
                  ? "text-2xl"
                  : size === "sm"
                  ? "text-sm"
                  : "text-lg"
              } ${lightText ? "text-white" : "text-slate-900"}`}
            >
              Safe<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">UPI</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-widest font-mono shadow-xs">
              SHIELD v3.0
            </span>
          </div>

          {showTeam && (
            <span
              className={`text-[11px] font-medium tracking-wide flex items-center gap-1 ${
                lightText ? "text-slate-300" : "text-slate-600"
              }`}
            >
              By <strong className="font-bold text-cyan-400">Team Secure Shield</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

