import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Zap,
  Check,
  CreditCard,
  KeyRound,
  Copy,
  BadgeCheck,
  Terminal,
  LockKeyhole,
  Globe
} from "lucide-react";
import { SafeUpiLogo } from "./SafeUpiLogo";

export type AuthMode = "LOGIN" | "SIGNUP" | "OTP";

interface AuthScreensProps {
  onLoginSuccess: (userData: { name: string; mobile: string; email: string }) => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>("LOGIN");
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile");
  
  // Login Form State
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [autofillNotice, setAutofillNotice] = useState(false);

  // Sign Up Form State
  const [fullName, setFullName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState("");

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [authLang, setAuthLang] = useState<string>(() => {
    try {
      return localStorage.getItem("safeupi_language") || "en";
    } catch {
      return "en";
    }
  });

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Registered users store in localStorage
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem("safeupi_registered_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (newUser: { name: string; mobile: string; email: string; password?: string }) => {
    try {
      const users = getRegisteredUsers();
      const exists = users.find((u: any) => u.mobile === newUser.mobile || u.email === newUser.email);
      if (!exists) {
        users.push(newUser);
        localStorage.setItem("safeupi_registered_users", JSON.stringify(users));
      }
    } catch (e) {
      console.warn("User save warning", e);
    }
  };

  // Quick fill helper for rapid testing without breaking real production feel
  const handleQuickFill = () => {
    if (loginMethod === "mobile") {
      setMobileNumber("9876543210");
    } else {
      setEmailAddress("rahul.sharma@safeupi.in");
    }
    setPassword("SafeUPI@2025");
    setLoginError("");
    setAutofillNotice(true);
    setTimeout(() => setAutofillNotice(false), 3000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Timer for OTP resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMode === "OTP" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, authMode]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent, requireOtp: boolean = false) => {
    e.preventDefault();
    setLoginError("");

    if (loginMethod === "mobile") {
      const cleanNum = mobileNumber.replace(/\D/g, "");
      if (!cleanNum || cleanNum.length < 10) {
        setLoginError("Please enter a valid 10-digit mobile number (e.g., 9876543210)");
        return;
      }
    } else {
      if (!emailAddress || !emailAddress.includes("@")) {
        setLoginError("Please enter a valid email address (e.g., rahul.sharma@safeupi.in)");
        return;
      }
    }

    if (!password || password.length < 4) {
      setLoginError("Please enter your security password or PIN (min 4 characters)");
      return;
    }

    if (requireOtp) {
      // Move to OTP verification
      setAuthMode("OTP");
      setCountdown(30);
      setIsResendActive(false);
      setOtpDigits(["8", "4", "9", "2", "0", "1"]);
    } else {
      // Direct successful sign in with registered user check
      const users = getRegisteredUsers();
      const existing = users.find((u: any) => 
        (mobileNumber && u.mobile && u.mobile.replace(/\D/g, "") === mobileNumber.replace(/\D/g, "")) ||
        (emailAddress && u.email && u.email.toLowerCase() === emailAddress.toLowerCase())
      );

      const resolvedName = existing?.name || (
        mobileNumber.includes("98765") || emailAddress.includes("rahul") 
          ? "Rahul Sharma" 
          : mobileNumber.includes("99887") || emailAddress.includes("ananya") 
          ? "Ananya Patel" 
          : emailAddress.split("@")[0] || `User ${mobileNumber.slice(-4)}`
      );

      const userObj = {
        name: resolvedName,
        mobile: mobileNumber.startsWith("+91") ? mobileNumber : `+91 ${mobileNumber || "98765 43210"}`,
        email: emailAddress || `${resolvedName.toLowerCase().replace(/\s+/g, ".")}@safeupi.in`
      };

      try {
        localStorage.setItem("safeupi_active_user", JSON.stringify(userObj));
      } catch (e) {
        console.warn("Storage save error", e);
      }

      onLoginSuccess(userObj);
    }
  };

  // Handle Sign Up submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!fullName.trim()) {
      setSignupError("Please enter your full name");
      return;
    }
    if (!signupMobile || signupMobile.replace(/\D/g, "").length < 10) {
      setSignupError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!signupEmail || !signupEmail.includes("@")) {
      setSignupError("Please enter a valid email address");
      return;
    }
    if (signupPassword.length < 4) {
      setSignupError("Password must be at least 4 characters");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    // Save newly created user
    saveRegisteredUser({
      name: fullName.trim(),
      mobile: signupMobile,
      email: signupEmail,
      password: signupPassword,
    });

    setMobileNumber(signupMobile);
    setEmailAddress(signupEmail);
    setPassword(signupPassword);
    setAuthMode("OTP");
    setCountdown(30);
    setIsResendActive(false);
    setOtpDigits(["8", "4", "9", "2", "0", "1"]);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError("");

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtpDigits(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setOtpError("Please enter all 6 digits of the verification code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);

      setTimeout(() => {
        onLoginSuccess({
          name: fullName || "Rahul Sharma",
          mobile: mobileNumber.startsWith("+91") ? mobileNumber : `+91 ${mobileNumber || "98765 43210"}`,
          email: emailAddress || signupEmail || "rahul.sharma@safeupi.in"
        });
      }, 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center font-sans relative overflow-hidden py-6 sm:py-10 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* Split Screen Master Card with Rich Navy & Indigo Glass Styling */}
        <div className="bg-[#0f172a]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-500/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: Brand Identity & Security Value Proposition */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1322] via-[#111827] to-[#1e1b4b] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-indigo-500/20">
            
            {/* Ambient Shield Watermark */}
            <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none">
              <Shield className="w-96 h-96 text-cyan-400" />
            </div>

            {/* Top Brand Info */}
            <div className="relative z-10">
              <SafeUpiLogo size="lg" lightText={true} />
              
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Zero-Trust UPI Threat Defense</span>
              </div>
            </div>

            {/* Center Visual Content */}
            <div className="relative z-10 my-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Your Payment.<br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Your Protection.
                </span>
              </h1>
              
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                SafeUPI analyzes payee reputation, collect traps, remote-screen sharing signals, and QR tampering in real time before you enter your UPI PIN.
              </p>

              {/* Security Mechanism Pipeline */}
              <div className="mt-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>How Protection Works</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Active 24/7</span>
                </div>

                <div className="flex items-center justify-between gap-2 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center gap-1.5 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-sm">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">1. Initiate</span>
                    <span className="text-[9px] text-slate-400">Scan or Pay</span>
                  </div>

                  <div className="w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center gap-1.5 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20 animate-pulse">
                      <Shield className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-300">2. Intercept</span>
                    <span className="text-[9px] text-cyan-400 font-medium">Risk Score</span>
                  </div>

                  <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400" />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center gap-1.5 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-300">3. Secure</span>
                    <span className="text-[9px] text-emerald-400">Safe Transfer</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    NPCI Verified Protocols
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Helpline 1930 Fast Link
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Credits */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Developed by <strong className="text-cyan-400">Team Secure Shield</strong></span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                Production Release
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Interactive Auth, Credentials & Space to Fill */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0b101d] relative">
            
            {/* SCREEN 1: LOGIN */}
            {authMode === "LOGIN" && (
              <div className="w-full max-w-lg mx-auto space-y-6">
                
                {/* Language Option Selector Banner */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Language / భాష / भाषा:</span>
                  </div>
                  <select
                    id="auth-language-select"
                    value={authLang}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setAuthLang(newLang);
                      localStorage.setItem("safeupi_language", newLang);
                    }}
                    className="bg-slate-950 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                    aria-label="Select Interface Language"
                  >
                    <option value="en">English</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                {/* Header Title */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Sign In to SafeUPI
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Access your transaction security monitor and risk shield.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    <LockKeyhole className="w-3.5 h-3.5 text-indigo-400" />
                    <span>256-bit AES</span>
                  </div>
                </div>

                {/* Security Verification Badge */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Live Zero-PII UPI Authentication</p>
                      <p className="text-[11px] text-slate-400">NPCI compliant biometric & OTP security protocol</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                    title="Fill test credentials"
                  >
                    Quick Fill
                  </button>
                </div>

                {autofillNotice && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Credentials filled. Click "Sign In to SafeUPI".</span>
                  </div>
                )}

                {/* Login Method Toggle: Mobile vs Email */}
                <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1 text-xs font-bold text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("mobile");
                      setLoginError("");
                    }}
                    className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      loginMethod === "mobile"
                        ? "bg-indigo-600 text-white shadow-md font-bold"
                        : "hover:text-slate-200"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Login via Mobile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("email");
                      setLoginError("");
                    }}
                    className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      loginMethod === "email"
                        ? "bg-indigo-600 text-white shadow-md font-bold"
                        : "hover:text-slate-200"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Login via Email</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* LOGIN FORM: SPACIOUS INPUT FIELDS WITH AMPLE ROOM */}
                {/* ========================================================= */}
                <form onSubmit={(e) => handleLoginSubmit(e, false)} className="space-y-4">
                  
                  {/* FIELD 1: Mobile or Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>{loginMethod === "mobile" ? "Registered Mobile Number" : "Registered Email Address"}</span>
                      <span className="text-[11px] text-cyan-400 font-normal">
                        {loginMethod === "mobile" ? "e.g. 98765 43210" : "e.g. user@safeupi.in"}
                      </span>
                    </label>

                    {loginMethod === "mobile" ? (
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 font-bold text-sm">
                          <span>🇮🇳 +91</span>
                          <span className="w-px h-4 bg-slate-700" />
                        </div>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={12}
                          className="w-full pl-24 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-medium text-base focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="rahul.sharma@safeupi.in"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-medium text-base focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* FIELD 2: Password / UPI Security PIN */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Security Password / UPI PIN</span>
                      <span className="text-[11px] text-slate-400 font-normal">Min. 4 characters</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your security password or PIN"
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-medium text-base focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error display */}
                  {loginError && (
                    <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 font-medium">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Remember Me & Forgot details */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Trust this device for 30 days</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleQuickFill}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Fill Test Login
                    </button>
                  </div>

                  {/* Primary Action: Sign In Button */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <span>Sign In to SafeUPI</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Secondary Action: Login via 2FA OTP */}
                    <button
                      type="button"
                      onClick={(e) => handleLoginSubmit(e, true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Or Verify via 6-Digit SMS OTP</span>
                    </button>
                  </div>
                </form>

                {/* Switch to Create Account */}
                <div className="text-center pt-3 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400">
                    Need a new protection profile?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("SIGNUP");
                        setSignupError("");
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 2: SIGN UP */}
            {authMode === "SIGNUP" && (
              <div className="w-full max-w-lg mx-auto space-y-5 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Create Protection Profile
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Register with SafeUPI to protect your UPI VPAs & payments.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="rahul@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-8 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {signupError && (
                    <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-center gap-2 text-xs text-rose-300 font-medium">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{signupError}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-tight">
                    By registering, you agree to SafeUPI Security Standards and RBI Fraud Monitoring Guidelines.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Register Protection Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-800">
                  <p className="text-xs text-slate-400">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("LOGIN")}
                      className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                    >
                      Log In with Existing Account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 3: OTP VERIFICATION */}
            {authMode === "OTP" && (
              <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Heading */}
                <div className="space-y-1.5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/20">
                    <KeyRound className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    2-Factor Verification
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
                    We sent a 6-digit authentication token to{" "}
                    <strong className="text-cyan-300 font-semibold">
                      {mobileNumber || signupMobile || "+91 98765 43210"}
                    </strong>
                  </p>
                </div>

                {/* 6 OTP Digit Boxes with Spacious Inputs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl flex items-center gap-2 text-xs text-rose-300 font-medium justify-center">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  {verificationSuccess && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-bold justify-center animate-in zoom-in-95">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Security credentials verified! Launching dashboard...</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || verificationSuccess}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Complete Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isResendActive) {
                          setCountdown(30);
                          setIsResendActive(false);
                          setOtpDigits(["8", "4", "9", "2", "0", "1"]);
                        }
                      }}
                      disabled={!isResendActive}
                      className={`font-semibold cursor-pointer ${
                        isResendActive
                          ? "text-cyan-400 hover:underline"
                          : "text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Resend SMS Token
                    </button>

                    <span className="text-slate-400 font-mono text-[11px]">
                      {isResendActive ? "Token ready to resend" : `Resend in ${countdown}s`}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpDigits(["8", "4", "9", "2", "0", "1"]);
                        setOtpError("");
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Paste Security OTP Code (849201)</span>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode("LOGIN")}
                    className="text-xs text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
                  >
                    ← Back to Login Credentials
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
