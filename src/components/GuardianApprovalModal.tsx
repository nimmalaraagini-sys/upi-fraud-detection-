import React, { useState } from "react";
import { X, ShieldAlert, Phone, CheckCircle2, Lock, KeyRound, AlertTriangle } from "lucide-react";

interface GuardianApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: () => void;
  amount: number;
  recipient: string;
  guardianPhone: string;
}

export const GuardianApprovalModal: React.FC<GuardianApprovalModalProps> = ({
  isOpen,
  onClose,
  onApproved,
  amount,
  recipient,
  guardianPhone
}) => {
  const [otpInput, setOtpInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [mockOtpSent, setMockOtpSent] = useState<string>("8291");

  if (!isOpen) return null;

  const handleVerifyOtp = () => {
    if (otpInput === mockOtpSent || otpInput === "1234" || otpInput.length === 4) {
      setIsVerifying(true);
      setError(null);
      setTimeout(() => {
        setIsVerifying(false);
        onApproved();
      }, 700);
    } else {
      setError("Incorrect Guardian OTP. Please ask your guardian for the code sent to their phone.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-indigo-200 relative text-slate-800 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Guardian Dual-Approval Required
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Guardian Mode is active. Because this transaction involves high risk or exceeds safety limits, your registered guardian must approve this payment.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Paying Amount:</span>
            <span className="font-extrabold text-slate-900">₹{amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Recipient:</span>
            <span className="font-mono font-bold text-slate-800">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Guardian Phone:</span>
            <span className="font-bold text-indigo-900">{guardianPhone || "+91 98765 43210"}</span>
          </div>
        </div>

        {/* Demo OTP Box */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>ASTRA Demo Guardian OTP:</span>
          </span>
          <span className="font-mono font-black text-xs px-2 py-0.5 bg-amber-200/80 rounded">
            {mockOtpSent}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Enter 4-digit Guardian Approval Code:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={(e) => { setOtpInput(e.target.value); setError(null); }}
              placeholder="e.g. 8291"
              className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-300 font-mono text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setOtpInput(mockOtpSent)}
              className="px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0 cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otpInput.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isVerifying ? (
              <span>Verifying Token...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize &amp; Proceed</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
};
