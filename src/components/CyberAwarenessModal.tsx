import React from "react";
import { X, PhoneCall, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface CyberAwarenessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberAwarenessModal: React.FC<CyberAwarenessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Emergency Scam Helpline: Dial 1930
              </h2>
              <p className="text-xs text-slate-500">
                Official Indian Cyber Crime Police Helpline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Golden Hour callout */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Act Within the First 60 Minutes (The Golden Hour)
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            If you lost money or clicked a fake link, call <strong>1930</strong> or report on <strong>cybercrime.gov.in</strong> immediately. When you report within the first 1 to 2 hours, police and banks can quickly freeze the scammer's bank account before they can withdraw the cash at an ATM!
          </p>
        </div>

        {/* Core Rules for Every UPI User */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            3 Simple Rules to Never Get Scammed
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Rule 1: PIN Means PAYING
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                You NEVER enter your UPI PIN to receive money or get lottery prizes. Entering your PIN ALWAYS sends money OUT of your bank.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Rule 2: Never Install Screen Apps
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Never download AnyDesk, TeamViewer, or QuickSupport if a caller asks you to. They can watch your screen and see your PIN!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                Rule 3: Read the Real Name
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Before you enter your PIN, look at the actual bank account name on your phone screen to make sure it matches who you want to pay.
              </p>
            </div>
          </div>
        </div>

        {/* External links */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Visit National Cyber Crime Website (cybercrime.gov.in)
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
