import React, { useState } from "react";
import { X, PhoneCall, ShieldCheck, Search, Copy, Check, ExternalLink } from "lucide-react";

interface BankHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankContact {
  name: string;
  phone: string;
  tollFree: string;
  portal: string;
  tag: string;
}

export const BankHelplineModal: React.FC<BankHelplineModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const banks: BankContact[] = [
    {
      name: "National Cyber Crime Helpline",
      phone: "1930",
      tollFree: "1930",
      portal: "https://cybercrime.gov.in",
      tag: "Immediate Freeze Orders"
    },
    {
      name: "National UPI Helpline (NPCI)",
      phone: "18001201740",
      tollFree: "1800-120-1740",
      portal: "https://npci.org.in",
      tag: "Official UPI Network"
    },
    {
      name: "State Bank of India (SBI)",
      phone: "18001234",
      tollFree: "1800-1234 / 1800-2100",
      portal: "https://sbi.co.in",
      tag: "Public Sector"
    },
    {
      name: "HDFC Bank",
      phone: "1800164164",
      tollFree: "1800-164-164",
      portal: "https://hdfcbank.com",
      tag: "Private Sector"
    },
    {
      name: "ICICI Bank",
      phone: "18002662",
      tollFree: "1800-2662",
      portal: "https://icicibank.com",
      tag: "Private Sector"
    },
    {
      name: "Axis Bank",
      phone: "18004195959",
      tollFree: "1800-419-5959",
      portal: "https://axisbank.com",
      tag: "Private Sector"
    },
    {
      name: "Kotak Mahindra Bank",
      phone: "18602662666",
      tollFree: "1860-266-2666",
      portal: "https://kotak.com",
      tag: "Private Sector"
    },
    {
      name: "Punjab National Bank (PNB)",
      phone: "18001802222",
      tollFree: "1800-180-2222",
      portal: "https://pnbindia.in",
      tag: "Public Sector"
    },
    {
      name: "Bank of Baroda",
      phone: "18002584455",
      tollFree: "1800-258-4455",
      portal: "https://bankofbaroda.in",
      tag: "Public Sector"
    }
  ];

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.tollFree.includes(search)
  );

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\D/g, ""));
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/90 to-rose-100/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950">Official Bank Fraud Helplines</h3>
              <p className="text-xs text-rose-800/80">Call to block unauthorized transactions immediately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-700 p-1.5 rounded-xl hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3.5 border-b border-rose-100 bg-rose-50/40">
          <div className="relative">
            <Search className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your bank name (e.g. SBI, HDFC, Kotak)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:border-rose-600 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {filteredBanks.map((b) => (
            <div key={b.name} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{b.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {b.tag}
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-blue-700 mt-0.5">
                  {b.tollFree}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(b.tollFree)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                  title="Copy number"
                >
                  {copiedNumber === b.tollFree ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${b.phone}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}

          {filteredBanks.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500">
              No banks found matching "{search}". You can always dial <strong className="text-rose-600">1930</strong> for any bank.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Toll-free numbers provided under RBI guidelines</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
