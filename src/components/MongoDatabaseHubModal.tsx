import React, { useState, useEffect } from "react";
import { 
  Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, 
  Terminal, Server, HardDrive, Layers, ArrowUpRight, X, Play, Shield
} from "lucide-react";
import { SupportedLang } from "../utils/translations";

interface MongoDatabaseHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: SupportedLang;
}

interface DatabaseStatus {
  success: boolean;
  provider: string;
  isMongoConnected: boolean;
  mongoUri: string;
  databaseName: string;
  lastMongoSync: string;
  mongoError: string | null;
  records: {
    transactions: number;
    muleRegistry: number;
    complaints: number;
    threatIntel: number;
  };
}

export const MongoDatabaseHubModal: React.FC<MongoDatabaseHubModalProps> = ({
  isOpen,
  onClose,
  currentLang = "en"
}) => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [customUri, setCustomUri] = useState("");
  const [connectMessage, setConnectMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const isTe = currentLang === "te";
  const isTeEn = currentLang === "te-en";

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/database/status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch database status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setConnectMessage(null);
    }
  }, [isOpen]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUri.trim()) return;
    setConnecting(true);
    setConnectMessage(null);
    try {
      const res = await fetch("/api/database/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mongoUri: customUri.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setConnectMessage({ 
          type: "success", 
          text: isTe 
            ? "MongoDB కి విజయవంతంగా కనెక్ట్ అయ్యింది!" 
            : isTeEn 
            ? "MongoDB ki successfully connect ayyindi!" 
            : "Successfully connected to MongoDB!" 
        });
        fetchStatus();
      } else {
        setConnectMessage({ 
          type: "error", 
          text: data.error || data.message || "Failed to connect to MongoDB" 
        });
      }
    } catch (err: any) {
      setConnectMessage({ type: "error", text: err?.message || "Connection network error" });
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/database/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setConnectMessage({ 
          type: "success", 
          text: isTe 
            ? "డేటాబేస్ మరియు MongoDB కలెక్షన్లు సింక్ అయ్యాయి!" 
            : isTeEn 
            ? "Database and MongoDB collections sync ayyayi!" 
            : "Collections synced successfully!" 
        });
        fetchStatus();
      }
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isTe 
                    ? "MongoDB & పెర్సిస్టెంట్ డేటాబేస్ హబ్" 
                    : isTeEn 
                    ? "MongoDB & Persistent Database Hub" 
                    : "MongoDB & Persistent Database Hub"}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  dbStatus?.isMongoConnected 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}>
                  {dbStatus?.isMongoConnected ? "MongoDB Active" : "Hybrid Persistent DB"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTe 
                  ? "లావాదేవీలు, మ్యూల్ రిజిస్ట్రీ మరియు 1930 ఫిర్యాదుల నిల్వ" 
                  : isTeEn 
                  ? "Transactions, Mule Registry and 1930 Complaints Storage" 
                  : "SafeUPI Dual-Engine Storage & Live Telemetry Engine"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Connection Status Box */}
          <div className={`p-4 rounded-2xl border ${
            dbStatus?.isMongoConnected 
              ? "bg-emerald-950/30 border-emerald-500/30" 
              : "bg-slate-800/60 border-slate-700"
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  dbStatus?.isMongoConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`} />
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {dbStatus?.provider || "Persistent Local Storage"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    URI: <code className="text-emerald-400 font-mono text-[11px]">{dbStatus?.mongoUri || "mongodb://127.0.0.1:27017/safeupi"}</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSync}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isTe ? "సింక్ చేయండి" : isTeEn ? "Sync Cheyyandi" : "Sync Collections"}</span>
              </button>
            </div>

            {dbStatus?.mongoError && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  {isTe 
                    ? `స్థానిక MongoDB రన్ కావడం లేదు (${dbStatus.mongoError}). SafeUPI మీ డేటాను సురక్షితంగా నిల్వ చేయడానికి అంతర్నిర్మిత పెర్సిస్టెంట్ స్టోరేజ్‌ను వాడుతోంది.` 
                    : isTeEn 
                    ? `Local MongoDB run avvatledu (${dbStatus.mongoError}). SafeUPI automatic ga internal persistent store lo data ni secure chestondi.` 
                    : `MongoDB daemon is offline locally. SafeUPI is operating with 100% data durability using the internal JSON persistence engine.`}
                </span>
              </div>
            )}
          </div>

          {/* Database Collection Stats Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTe ? "డేటాబేస్ కలెక్షన్లు & లైవ్ రికార్డులు" : isTeEn ? "Collections & Live Records" : "Active Database Collections"}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">safeupi_transactions</span>
                <span className="text-xl font-black text-white mt-1 block">
                  {dbStatus?.records?.transactions ?? 0}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">{isTe ? "లావాదేవీలు" : isTeEn ? "Transactions" : "Verified Txns"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">safeupi_mule_registry</span>
                <span className="text-xl font-black text-rose-400 mt-1 block">
                  {dbStatus?.records?.muleRegistry ?? 0}
                </span>
                <span className="text-[10px] text-rose-300 font-medium">{isTe ? "మ్యూల్ ఖాతాలు" : isTeEn ? "Mule Accounts" : "Flagged Mules"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">safeupi_complaints</span>
                <span className="text-xl font-black text-cyan-400 mt-1 block">
                  {dbStatus?.records?.complaints ?? 0}
                </span>
                <span className="text-[10px] text-cyan-300 font-medium">{isTe ? "1930 డాకెట్స్" : isTeEn ? "1930 Dockets" : "1930 FIRs"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">safeupi_threat_intel</span>
                <span className="text-xl font-black text-amber-400 mt-1 block">
                  {dbStatus?.records?.threatIntel ?? 0}
                </span>
                <span className="text-[10px] text-amber-300 font-medium">{isTe ? "హెచ్చరికలు" : isTeEn ? "Threat Intel" : "Live Signals"}</span>
              </div>
            </div>
          </div>

          {/* Connect to Custom MongoDB (e.g. Atlas / Local) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isTe ? "కస్టమ్ MongoDB కనెక్షన్ (Atlas / Local)" : isTeEn ? "Connect Custom MongoDB (Atlas / Local)" : "Connect to MongoDB Atlas or Local Instance"}</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {isTe 
                ? "మీ క్లౌడ్ MongoDB Atlas కనెక్షన్ స్ట్రింగ్ లేదా లోకల్ పోర్ట్ 27017 ఎంటర్‌చేసి వెంటనే కనెక్ట్ అవ్వండి:" 
                : isTeEn 
                ? "Mee MongoDB Atlas connection string leda localhost enter chesi connect avvandi:" 
                : "Paste your MongoDB Atlas connection string (mongodb+srv://...) or local host URI to connect:"}
            </p>

            <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customUri}
                onChange={(e) => setCustomUri(e.target.value)}
                placeholder="mongodb+srv://<user>:<password>@cluster0.mongodb.net/safeupi"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={connecting || !customUri.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {connecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTe ? "కనెక్ట్ చేయండి" : isTeEn ? "Connect Cheyyandi" : "Connect MongoDB"}</span>
              </button>
            </form>

            {connectMessage && (
              <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                connectMessage.type === "success" 
                  ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300" 
                  : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
              }`}>
                {connectMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{connectMessage.text}</span>
              </div>
            )}
          </div>

          {/* VS Code Terminal Prompts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{isTe ? "VS Code టెర్మినల్ రన్ ప్రాంప్ట్స్ & కమాండ్స్" : isTeEn ? "VS Code Terminal Run Commands" : "VS Code Terminal Run Prompts"}</span>
            </h4>

            <div className="space-y-2.5">
              {/* Command 1: Run Project */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    1. {isTe ? "ప్రాజెక్ట్‌ను రన్ చేయడానికి (Start Dev Server)" : "Run SafeUPI Dev Server in VS Code"}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("npm install\nnpm run dev", "cmd1")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === "cmd1" ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === "cmd1" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
npm install
npm run dev
                </pre>
              </div>

              {/* Command 2: Docker MongoDB */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    2. {isTe ? "డాకర్ ద్వారా MongoDB స్టార్ట్ చేయండి" : "Start Local MongoDB via Docker"}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("docker run -d -p 27017:27017 --name safeupi-mongo mongo:latest", "cmd2")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === "cmd2" ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === "cmd2" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-2 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto">
docker run -d -p 27017:27017 --name safeupi-mongo mongo:latest
                </pre>
              </div>

              {/* Command 3: Mongosh CLI */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    3. {isTe ? "కలెక్షన్లను పరిశీలించడానికి (mongosh CLI)" : "Inspect Collections in mongosh CLI"}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("mongosh \"mongodb://localhost:27017/safeupi\" --eval \"db.safeupi_transactions.find().pretty()\"", "cmd3")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === "cmd3" ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === "cmd3" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-2 rounded-lg bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto">
mongosh "mongodb://localhost:27017/safeupi" --eval "db.safeupi_transactions.find().pretty()"
                </pre>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero-PII Secure Data Model · NPCI Compliant</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {isTe ? "మూసివేయండి" : isTeEn ? "Close" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
};
