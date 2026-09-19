import React from "react";
import { 
  Sliders, ShieldAlert, Smartphone, Clock, MapPin, 
  UserCheck, AlertTriangle, ScreenShare, RefreshCw,
  QrCode, ArrowDownLeft, Send, Link, Zap
} from "lucide-react";
import { TransactionPayload, ChannelType } from "../types";

interface TransactionEditorProps {
  transaction: TransactionPayload;
  onChange: (updated: TransactionPayload) => void;
  onReset: () => void;
}

export const TransactionEditor: React.FC<TransactionEditorProps> = ({ transaction, onChange, onReset }) => {
  const updateField = <K extends keyof TransactionPayload>(key: K, value: TransactionPayload[K]) => {
    onChange({
      ...transaction,
      [key]: value
    });
  };

  const channelOptions: { id: ChannelType; label: string; icon: any; warning?: string }[] = [
    { id: "qr_code", label: "Shop QR Code", icon: QrCode },
    { id: "collect_request", label: "Payment Request Sent to You", icon: ArrowDownLeft, warning: "High Scam Risk" },
    { id: "direct_vpa", label: "Direct UPI ID / Phone", icon: Send },
    { id: "payment_link", label: "SMS or WhatsApp Link", icon: Link },
    { id: "intent_sdk", label: "Inside Trusted App", icon: Zap }
  ];

  const quickAmounts = [350, 1500, 14500, 45000, 98000];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Top title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Payment Details to Check
          </h2>
          {transaction.transactionId.startsWith("TXN_SCAN") && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              📷 From Screenshot
            </span>
          )}
        </div>
        <button
          id="btn-reset-transaction"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-medium transition-colors"
          title="Reset to safe normal payment values"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          Reset to Normal
        </button>
      </div>

      {/* Primary Row: Amount & Channel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            How much are you paying? (₹ Rupees)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-base font-bold">₹</span>
            <input
              id="input-amount"
              type="number"
              min="1"
              max="200000"
              value={transaction.amount}
              onChange={(e) => updateField("amount", Number(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-mono text-base font-bold focus:outline-none transition-colors"
            />
          </div>
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => updateField("amount", amt)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  transaction.amount === amt
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-300 font-bold"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            How are you paying?
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {channelOptions.map((ch) => {
              const Icon = ch.icon;
              const isSelected = transaction.channel === ch.id;
              return (
                <button
                  key={ch.id}
                  id={`channel-${ch.id}`}
                  type="button"
                  onClick={() => updateField("channel", ch.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs font-semibold ${
                    isSelected
                      ? ch.id === "collect_request"
                        ? "bg-rose-50 border-rose-400 text-rose-800 shadow-2xs font-bold"
                        : "bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? (ch.id === "collect_request" ? "text-rose-600" : "text-indigo-600") : "text-slate-400"}`} />
                  <span className="truncate">{ch.label}</span>
                </button>
              );
            })}
          </div>
          {transaction.channel === "collect_request" && (
            <p className="text-[11px] text-rose-800 mt-1.5 flex items-center gap-1.5 font-semibold bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>Warning: Scammers send this claiming you will "receive cash". Entering your PIN will DEDUCT money!</span>
            </p>
          )}
        </div>
      </div>

      {/* Payee Info & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Receiver's UPI ID (e.g. name@okhdfcbank)
          </label>
          <input
            id="input-receiver-vpa"
            type="text"
            value={transaction.receiverVpa}
            onChange={(e) => updateField("receiverVpa", e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Receiver's Real Name (Shown by UPI)
          </label>
          <input
            id="input-receiver-name"
            type="text"
            value={transaction.receiverName}
            onChange={(e) => updateField("receiverName", e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Critical Threat Toggles Section */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Phone Safety & Screen Sharing Warnings
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Toggle 1: Screen Share (AnyDesk / TeamViewer) */}
          <div 
            onClick={() => updateField("screenShareAppActive", !transaction.screenShareAppActive)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              transaction.screenShareAppActive
                ? "bg-rose-50 border-rose-400 shadow-2xs"
                : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <ScreenShare className={`w-4 h-4 mt-0.5 shrink-0 ${transaction.screenShareAppActive ? "text-rose-600" : "text-slate-400"}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  AnyDesk / Screen Sharing is ON
                  {transaction.screenShareAppActive && (
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">DANGER</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Someone is watching your screen. They can see your secret PIN!
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={transaction.screenShareAppActive}
              readOnly
              className="mt-0.5 accent-rose-600 w-4 h-4 rounded"
            />
          </div>

          {/* Toggle 2: New Device / SIM Swap */}
          <div 
            onClick={() => updateField("deviceChangedRecently", !transaction.deviceChangedRecently)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              transaction.deviceChangedRecently
                ? "bg-amber-50 border-amber-400 shadow-2xs"
                : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Smartphone className={`w-4 h-4 mt-0.5 shrink-0 ${transaction.deviceChangedRecently ? "text-amber-600" : "text-slate-400"}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  New SIM Card or New Phone Today
                  {transaction.deviceChangedRecently && (
                    <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded">&lt;24 hrs</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  SIM or phone was activated today (Check for SIM swap fraud)
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={transaction.deviceChangedRecently}
              readOnly
              className="mt-0.5 accent-amber-600 w-4 h-4 rounded"
            />
          </div>

          {/* Toggle 3: Rooted / Emulator */}
          <div 
            onClick={() => updateField("isEmulatedOrRooted", !transaction.isEmulatedOrRooted)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              transaction.isEmulatedOrRooted
                ? "bg-rose-50 border-rose-400"
                : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${transaction.isEmulatedOrRooted ? "text-rose-600" : "text-slate-400"}`} />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Phone is Rooted or Modified
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Operating system protections and security locks have been disabled
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={transaction.isEmulatedOrRooted}
              readOnly
              className="mt-0.5 accent-rose-600 w-4 h-4 rounded"
            />
          </div>

          {/* Toggle 4: Nocturnal Off-hours */}
          <div 
            onClick={() => updateField("unusualHour", !transaction.unusualHour)}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
              transaction.unusualHour
                ? "bg-indigo-50 border-indigo-400"
                : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${transaction.unusualHour ? "text-indigo-600" : "text-slate-400"}`} />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Middle of the Night (1 AM - 5 AM)
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Paying while you are normally asleep (scammers strike at night)
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={transaction.unusualHour}
              readOnly
              className="mt-0.5 accent-indigo-600 w-4 h-4 rounded"
            />
          </div>
        </div>
      </div>

      {/* Sliders: Velocity, Beneficiary Age, Location Delta */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          Timing, Speed & Location Details
        </label>

        {/* Slider 1: Velocity in last 10m */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-700 flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              How many payments made in the last 10 minutes?
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
              transaction.frequencyLast10Mins >= 4 
                ? "bg-rose-50 text-rose-700 border border-rose-200" 
                : "bg-slate-100 text-slate-800 border border-slate-200"
            }`}>
              {transaction.frequencyLast10Mins} times
            </span>
          </div>
          <input
            id="slider-velocity"
            type="range"
            min="1"
            max="8"
            step="1"
            value={transaction.frequencyLast10Mins}
            onChange={(e) => updateField("frequencyLast10Mins", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Slider 2: Beneficiary Account Age */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-700 flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              How old is the receiver's account?
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
              transaction.receiverAccountAgeHours < 24
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : transaction.receiverAccountAgeHours < 72
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              {transaction.receiverAccountAgeHours < 24 
                ? `Created today (${transaction.receiverAccountAgeHours} hours ago)` 
                : `${Math.round(transaction.receiverAccountAgeHours / 24)} days old`}
            </span>
          </div>
          <input
            id="slider-beneficiary-age"
            type="range"
            min="1"
            max="720"
            step="1"
            value={transaction.receiverAccountAgeHours}
            onChange={(e) => updateField("receiverAccountAgeHours", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Slider 3: Distance from Registered Location */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-700 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              How far away from your home city?
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
              transaction.distanceFromHomeKm > 500
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-slate-100 text-slate-800 border border-slate-200"
            }`}>
              {transaction.distanceFromHomeKm} km away ({transaction.distanceFromHomeKm < 15 ? "Near your home" : "Unusual long distance"})
            </span>
          </div>
          <input
            id="slider-distance"
            type="range"
            min="0"
            max="1500"
            step="10"
            value={transaction.distanceFromHomeKm}
            onChange={(e) => updateField("distanceFromHomeKm", Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
