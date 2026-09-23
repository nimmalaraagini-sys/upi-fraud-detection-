import React, { useState } from "react";
import { 
  X, LogIn, LogOut, ShieldCheck, Lock, Smartphone, 
  KeyRound, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, RefreshCw, Eye, EyeOff, Building2, User
} from "lucide-react";
import { UserProfile, USER_PROFILES } from "../data/userProfiles";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  activeProfile: UserProfile;
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  activeProfile,
  onLogin,
  onLogout
}) => {
  const [loginMethod, setLoginMethod] = useState<"phone" | "persona">("persona");
  const [phoneNumber, setPhoneNumber] = useState<string>(activeProfile.phone);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle custom phone + PIN / OTP login
  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      // Find matching profile by phone or fallback to first
      const cleanPhone = phoneNumber.replace(/\s+/g, "");
      const matched = USER_PROFILES.find((p) => p.phone.replace(/\s+/g, "") === cleanPhone) || activeProfile;

      if (isOtpSent) {
        if (otpCode.length < 4) {
          setAuthError("Please enter a valid 4-digit or 6-digit OTP");
          setIsAuthenticating(false);
          return;
        }
      } else {
        if (enteredPin && enteredPin !== matched.defaultPin && enteredPin !== "1234") {
          setAuthError(`Incorrect PIN. Demo PIN for ${matched.name} is ${matched.defaultPin}`);
          setIsAuthenticating(false);
          return;
        }
      }

      onLogin(matched);
      setIsAuthenticating(false);
      onClose();
    }, 600);
  };

  const handleSendOtp = () => {
    setIsOtpSent(true);
    setOtpCode("4829"); // simulated auto-OTP for seamless demo testing
    setAuthError(null);
  };

  const handleQuickPersonaSelect = (profile: UserProfile) => {
    onLogin(profile);
    setPhoneNumber(profile.phone);
    setEnteredPin(profile.defaultPin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {isLoggedIn ? "User Account & Session" : "Sign In to Secure Shield"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Zero-PII Edge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLoggedIn 
                  ? `Active session authenticated for ${activeProfile.name}`
                  : "Verify your identity or choose a demo testing role"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">

          {/* Current Logged-in Profile Banner */}
          {isLoggedIn ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${activeProfile.avatarBg} text-white flex items-center justify-center font-extrabold text-sm shadow-md`}>
                    {activeProfile.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{activeProfile.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active & Authenticated" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {activeProfile.phone} · {activeProfile.bankName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Account Quick Meta */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Available Balance</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{activeProfile.accountBalance.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Primary UPI Handle</span>
                  <span className="font-mono text-slate-300 text-xs truncate block">{activeProfile.upiId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Session Security: <strong className="text-emerald-400">Enrolled Hardware</strong></span>
                <span>Demo PIN: <strong className="text-amber-300 font-mono">{activeProfile.defaultPin}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You are currently in guest view. Log in to authenticate payments and link your account.</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setLoginMethod("persona")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMethod === "persona"
                  ? "bg-slate-800 text-emerald-400 shadow-xs border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1-Tap Demo Roles ({USER_PROFILES.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMethod === "phone"
                  ? "bg-slate-800 text-emerald-400 shadow-xs border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone / UPI PIN Login</span>
            </button>
          </div>

          {/* Persona 1-Click Login List */}
          {loginMethod === "persona" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Select Evaluation Persona</span>
                <span>Click to switch instant session</span>
              </div>

              <div className="space-y-2">
                {USER_PROFILES.map((p) => {
                  const isCurrent = isLoggedIn && activeProfile.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleQuickPersonaSelect(p)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs"
                          : "bg-slate-850/60 hover:bg-slate-800 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${p.avatarBg} text-white flex items-center justify-center font-extrabold text-xs shrink-0`}>
                          {p.avatarText}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-white">{p.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${p.badgeColor}`}>
                              {p.roleLabel.split("(")[0].trim()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{p.bankName}</span>
                            <span>•</span>
                            <span>PIN: <strong className="text-amber-300">{p.defaultPin}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCurrent ? (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1">
                            <span>Select</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Phone Number & UPI PIN / OTP Form */}
          {loginMethod === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Registered Mobile Number or UPI ID
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 12345 or user@upi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {isOtpSent ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Enter One-Time Password (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="4-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-center text-white font-mono text-base tracking-widest font-extrabold focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-400/80 mt-1">
                    Demo simulated OTP code pre-filled (4829)
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      4-Digit UPI Security PIN
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Login via OTP instead</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPin ? "text" : "password"}
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                      placeholder="Default PIN: 1234"
                      maxLength={6}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In &amp; Link Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Zero-PII Security Assurance */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Zero-PII Assurance:</strong> Authentication tokens and keys remain encrypted inside your local sandbox. No raw credentials or banking passwords ever touch external tracking servers.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Status: <strong className="text-emerald-400">Local Sandbox Edge</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
