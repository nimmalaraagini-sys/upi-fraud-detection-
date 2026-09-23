import React, { useState } from "react";
import { 
  X, User, Shield, Check, Copy, Building2, CreditCard, 
  Phone, Key, AlertCircle, Sparkles, ExternalLink, ArrowRight, 
  Smartphone, Lock, Eye, EyeOff
} from "lucide-react";
import { UserProfile, USER_PROFILES } from "../data/userProfiles";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onSelectProfile
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPin, setShowPin] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${activeProfile.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
              {activeProfile.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeProfile.name}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${activeProfile.badgeColor}`}>
                  {activeProfile.roleLabel.split("(")[0].trim()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {activeProfile.upiId} · {activeProfile.bankName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Active Bank Card Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 shadow-lg border border-slate-700">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Primary Linked Account
                </span>
                <div className="text-lg font-extrabold tracking-tight mt-0.5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>{activeProfile.bankName}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {activeProfile.accountType}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Available Balance
                </span>
                <span className="text-xl font-mono font-extrabold text-emerald-400">
                  ₹{activeProfile.accountBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Account Number</span>
                <span className="font-mono font-bold text-slate-200">{activeProfile.accountNumberMasked}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                <span className="font-mono font-bold text-slate-200">{activeProfile.ifscCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">UPI VPA Handle</span>
                <button 
                  onClick={() => handleCopy(activeProfile.upiId, "upi")}
                  className="font-mono font-bold text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>{activeProfile.upiId}</span>
                  {copiedField === "upi" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">UPI PIN</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300">
                  <span>{showPin ? activeProfile.defaultPin : "••••"}</span>
                  <button 
                    type="button"
                    onClick={() => setShowPin(!showPin)} 
                    className="text-slate-400 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Persona Switcher Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Switch Testing Persona / Role (5 Accounts)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Tap any account to switch instantly</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {USER_PROFILES.map((profile) => {
                const isSelected = profile.id === activeProfile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      onSelectProfile(profile);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${profile.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
                        {profile.avatarText}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900">
                            {profile.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${profile.badgeColor}`}>
                            {profile.roleLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {profile.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-mono pt-0.5">
                          <span>Bank: <strong className="text-slate-800">{profile.bankName}</strong> ({profile.accountNumberMasked})</span>
                          <span>UPI: <strong className="text-emerald-700">{profile.upiId}</strong></span>
                          <span>PIN: <strong className="text-slate-800">{profile.defaultPin}</strong></span>
                          {profile.guardianProtection?.enabled && (
                            <span className="text-purple-700 font-sans font-bold">🛡️ Guardian Co-Pilot</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center pt-1">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Credentials Cheatsheet for Judges & Reviewers */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-700" />
              <span>Login & Test Credentials Reference</span>
            </h5>
            <div className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
              <div>• <strong>Citizen:</strong> Phone <code>+91 98765 12345</code> | PIN <code>1234</code> | Default Consumer check</div>
              <div>• <strong>Senior Citizen:</strong> Phone <code>+91 94421 98765</code> | Guardian <code>+91 98765 43210</code> | Vishing sensor & approval</div>
              <div>• <strong>Analyst:</strong> <code>analyst@secureshield.ai</code> | Code <code>ADMIN_SECURE_2026</code> | ML inspection</div>
              <div>• <strong>Cyber Cell 1930:</strong> <code>I4C-OFFICER-7891</code> | Section 102 CrPC multi-hop freeze</div>
              <div>• <strong>Ombudsman/Jury:</strong> <code>jury.evaluator@smarttech.org</code> | PIN <code>9999</code> | Pitch Deck & Matrix</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Active: <strong>{activeProfile.name}</strong> ({activeProfile.bankName})
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
