import React, { useState } from "react";
import { 
  PhoneOff, AlertTriangle, ShieldAlert, CheckCircle2, UserCheck, 
  Volume2, VolumeX, Sparkles, RefreshCw, Hash, Users, Clock, AlertOctagon
} from "lucide-react";
import { muleRegistry, MuleReportEntry } from "../utils/muleRegistry";
import { regionalVoice, IndianLanguage, REGIONAL_VOICE_SCRIPTS } from "../utils/regionalVoice";

interface SafetyAddonsProps {
  activePhoneCall: boolean;
  onToggleActivePhoneCall: (val: boolean) => void;
  isCollectRequest: boolean;
  onToggleCollectRequest: (val: boolean) => void;
  guardianMode: boolean;
  onToggleGuardianMode: (val: boolean) => void;
  guardianPhone: string;
  onChangeGuardianPhone: (val: string) => void;
  currentRecipient: string;
  currentAmount: number;
  onMuleFound?: (mule: MuleReportEntry) => void;
  selectedVoiceLang?: IndianLanguage;
  onVoiceLangChange?: (lang: IndianLanguage) => void;
}

export const AdvancedSafetyCoPilot: React.FC<SafetyAddonsProps> = ({
  activePhoneCall,
  onToggleActivePhoneCall,
  isCollectRequest,
  onToggleCollectRequest,
  guardianMode,
  onToggleGuardianMode,
  guardianPhone,
  onChangeGuardianPhone,
  currentRecipient,
  currentAmount,
  onMuleFound,
  selectedVoiceLang,
  onVoiceLangChange
}) => {
  // Regional Voice state
  const [internalLang, setInternalLang] = useState<IndianLanguage>(regionalVoice.getSelectedLanguage());
  const activeLang = selectedVoiceLang || internalLang;
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Mule blacklist lookup state
  const [muleLookupStatus, setMuleLookupStatus] = useState<MuleReportEntry | null>(null);
  const [isCheckingMule, setIsCheckingMule] = useState<boolean>(false);
  const [reportedVpaSuccess, setReportedVpaSuccess] = useState<boolean>(false);

  // Check mule registry whenever recipient changes
  React.useEffect(() => {
    let isMounted = true;
    if (!currentRecipient || currentRecipient.length < 4) {
      setMuleLookupStatus(null);
      return;
    }
    setIsCheckingMule(true);
    muleRegistry.checkVpa(currentRecipient).then((result) => {
      if (isMounted) {
        setMuleLookupStatus(result);
        setIsCheckingMule(false);
        if (result && onMuleFound) {
          onMuleFound(result);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentRecipient, onMuleFound]);

  const handleLanguageChange = (lang: IndianLanguage) => {
    setInternalLang(lang);
    if (onVoiceLangChange) {
      onVoiceLangChange(lang);
    }
    regionalVoice.setLanguage(lang);
  };

  const handleTestVoiceAlert = (type: "STOP_SCAM" | "COLLECT_TRAP" | "CALL_SCAM" | "SAFE") => {
    setIsSpeaking(true);
    regionalVoice.speakAlert(type, () => {
      setIsSpeaking(false);
    });
  };

  const handleReportMuleAccount = async () => {
    if (!currentRecipient) return;
    const entry = await muleRegistry.reportVpa(currentRecipient, "LOTTERY_SCAM");
    setMuleLookupStatus(entry);
    setReportedVpaSuccess(true);
    setTimeout(() => setReportedVpaSuccess(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Section Title & Regional Voice Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-700 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
              <span>Next-Gen Co-Pilot Shields</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                ASTRA 2026 Innovation
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Vishing Interceptor · Reverse Flow Reversal · P2P Mule Blacklist · Guardian Mode
            </p>
          </div>
        </div>

        {/* Regional Voice Selector & Spoken Alert Trigger */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <label className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-rose-700" />
            <span className="hidden sm:inline">Alert Voice:</span>
          </label>
          <select
            value={activeLang}
            onChange={(e) => handleLanguageChange(e.target.value as IndianLanguage)}
            className="text-xs font-bold py-1 px-2.5 rounded-xl bg-white border border-rose-200 text-rose-950 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs cursor-pointer"
          >
            {Object.values(REGIONAL_VOICE_SCRIPTS).map((s) => (
              <option key={s.code} value={s.code}>
                {s.nativeName} ({s.name.split(" ")[0]})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleTestVoiceAlert(activePhoneCall ? "CALL_SCAM" : isCollectRequest ? "COLLECT_TRAP" : "STOP_SCAM")}
            title="Listen to regional speech alert"
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isSpeaking 
                ? "bg-rose-700 text-white border-rose-700 animate-pulse" 
                : "bg-white hover:bg-rose-100/70 text-rose-900 border-rose-200"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-700" />}
            <span className="text-[10px] hidden sm:inline">{isSpeaking ? "Speaking..." : "Speak"}</span>
          </button>
        </div>
      </div>

      {/* Grid of the 4 Safety Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. Voice Phishing / Active Call Interceptor */}
        <div className={`p-4 rounded-2xl border transition-all ${
          activePhoneCall 
            ? "bg-red-50/90 border-red-300 ring-2 ring-red-400 shadow-xs" 
            : "bg-white border-rose-100 hover:border-rose-200"
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                activePhoneCall ? "bg-red-600 text-white" : "bg-rose-100 text-rose-800"
              }`}>
                <PhoneOff className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Active Call Co-Pilot
                  </h4>
                  {activePhoneCall && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600 text-white animate-pulse">
                      CALL DETECTED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Flags if user is on a live phone call (CBI digital arrest / electricity bill extortion).
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={activePhoneCall}
                onChange={(e) => onToggleActivePhoneCall(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {activePhoneCall && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-red-100/90 border border-red-300 text-red-950 text-[11px] font-medium space-y-1">
              <p className="font-extrabold flex items-center gap-1 text-red-900">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Vishing Trap Alert:</span>
              </p>
              <p className="leading-tight">
                Banks & police <strong>never</strong> tell you to transfer money on a live call. Disconnect before entering your PIN!
              </p>
            </div>
          )}
        </div>

        {/* 2. Reverse Flow Reversal ("PIN to Receive Money" Trap) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isCollectRequest 
            ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-400 shadow-xs" 
            : "bg-white border-rose-100 hover:border-rose-200"
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isCollectRequest ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Reverse Flow Inversion Guard
                  </h4>
                  {isCollectRequest && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-600 text-white">
                      COLLECT REQUEST
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Prevents OLX / buyer scams where scammers send Collect Requests saying &ldquo;enter PIN to receive&rdquo;.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isCollectRequest}
                onChange={(e) => onToggleCollectRequest(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {isCollectRequest && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] font-medium space-y-1">
              <p className="font-extrabold flex items-center gap-1 text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>UPI Golden Rule:</span>
              </p>
              <p className="leading-tight">
                Entering your PIN will <strong>DEDUCT</strong> ₹{currentAmount.toLocaleString("en-IN")}, not receive it! You NEVER enter a PIN to get money.
              </p>
            </div>
          )}
        </div>

        {/* 3. Community P2P Mule Blacklist Hash Sync */}
        <div className={`p-4 rounded-2xl border transition-all ${
          muleLookupStatus 
            ? "bg-rose-50/90 border-rose-300 ring-2 ring-rose-400 shadow-xs" 
            : "bg-white border-rose-100 hover:border-rose-200"
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                muleLookupStatus ? "bg-rose-700 text-white" : "bg-rose-100 text-rose-800"
              }`}>
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    P2P Mule Registry (Offline SHA-256)
                  </h4>
                  {muleLookupStatus && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-700 text-white">
                      BLACKLIST MATCH
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Checks beneficiary VPA against offline encrypted hashes of known 1930 FIR mule accounts.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {isCheckingMule ? "Checking..." : muleLookupStatus ? "MATCH" : "CLEAN"}
            </span>
          </div>

          {muleLookupStatus ? (
            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span>{muleLookupStatus.reportCount} Cybercrime Complaints</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-rose-200 rounded">
                  {muleLookupStatus.sourceAuthority}
                </span>
              </div>
              <p className="text-rose-900">
                Handle flagged for {muleLookupStatus.threatCategory.replace(/_/g, " ")}. Money sent here is instantly moved to layered mules.
              </p>
            </div>
          ) : (
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-50">
              <span>No active police FIR matches for &ldquo;{currentRecipient || "payee"}&rdquo;</span>
              <button
                type="button"
                onClick={handleReportMuleAccount}
                className="text-rose-700 font-bold hover:underline cursor-pointer"
              >
                {reportedVpaSuccess ? "Reported to P2P!" : "Report this VPA"}
              </button>
            </div>
          )}
        </div>

        {/* 4. Family / Guardian Safety Guard (Elderly & Student Protection Mode) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          guardianMode 
            ? "bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-400 shadow-xs" 
            : "bg-white border-rose-100 hover:border-rose-200"
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                guardianMode ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-800"
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Guardian Dual-Approval Mode
                  </h4>
                  {guardianMode && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-700 text-white">
                      PROTECTED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Requires family OTP/approval for transactions &gt; ₹10,000 or high risk scores (parents/seniors).
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={guardianMode}
                onChange={(e) => onToggleGuardianMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-700"></div>
            </label>
          </div>

          {guardianMode && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-100/90 border border-indigo-200 text-indigo-950 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900">Guardian Phone:</span>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={(e) => onChangeGuardianPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="px-2 py-1 rounded-lg bg-white border border-indigo-300 font-mono text-xs w-36 text-indigo-950 focus:outline-none"
                />
              </div>
              <p className="text-slate-600 text-[10px]">
                Transactions flagged with Risk &gt; 70% will pause until your guardian approves via SMS/WhatsApp token.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
