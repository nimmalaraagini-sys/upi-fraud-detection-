import React from "react";
import { 
  X, CheckCircle, ShieldAlert, Sparkles, Image, Sliders, 
  HelpCircle, ArrowRight, PhoneCall, AlertTriangle, ShieldCheck,
  Search, Lock, FileText
} from "lucide-react";

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUploader?: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose, onOpenUploader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                How to Use This App & Check Any Payment
              </h2>
              <p className="text-xs text-slate-500">
                A simple 4-step guide to verify UPI payments, spot traps, and protect your money
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Interactive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                STEP 1
              </span>
              <Image className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              1. Add Payment Details or Upload Screenshot
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have 3 easy ways to check a transaction:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Upload Screenshot:</strong> Take a screenshot in Google Pay, PhonePe, Paytm, or SMS and upload it. The AI scanner reads the amount and receiver automatically.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Try Scam Examples:</strong> Click one-click presets like "OLX Screen Share" or "Fake QR Code".</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Type Details:</strong> Enter the amount, receiver UPI ID, and check phone toggles (like screen sharing or new device).</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                STEP 2
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              2. Read the Instant Risk Score & Decision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The circular gauge shows a clear 0-100 risk rating instantly:
            </p>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <span className="font-bold">0 – 35 : SAFE</span>
                <span className="text-[11px] text-emerald-800">Normal everyday trusted payment</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
                <span className="font-bold">36 – 65 : CAUTION</span>
                <span className="text-[11px] text-amber-800">Extra OTP or cooling-off period</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
                <span className="font-bold">66 – 100 : CRITICAL SCAM</span>
                <span className="text-[11px] text-rose-800">Payment should be halted immediately</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                STEP 3
              </span>
              <Sliders className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              3. See "Why Did the Score Go Up or Down?"
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No mystery math. The waterfall breakdown shows:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">🔴 Red Bars:</span>
                <span>Danger flags like screen mirroring, unexpected high amount, new receiver, or collect request traps.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">🟢 Green Bars:</span>
                <span>Safety discounts like verified merchant GST handle, trusted phone hardware, or familiar routine location.</span>
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                STEP 4
              </span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              4. Deep AI Investigation & Fund Traceback
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get official backing and immediate emergency support:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Gemini AI Forensics:</strong> Click "Investigate with AI" to read the scammer's modus operandi in plain English.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Trace Lost Money:</strong> If money was deducted, open the Traceback simulator to download the 1-click Bank Refund Letter and call 1930.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Golden Rules Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                The Golden Rule of UPI
              </span>
            </div>
            <p className="text-xs text-emerald-950 font-medium">
              You <strong>NEVER</strong> have to enter your UPI PIN to receive money or get a refund. Entering your PIN always deducts money from your bank!
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onOpenUploader) onOpenUploader();
            }}
            className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-indigo-700 transition-all"
          >
            <span>Start Checking Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
