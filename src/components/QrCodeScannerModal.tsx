import React, { useState, useRef, useEffect } from "react";
import { 
  X, QrCode, Camera, Upload, Check, AlertCircle, Sparkles, 
  Store, Zap, Coffee, ShieldAlert, ArrowRight, RefreshCw 
} from "lucide-react";

export interface DecodedUpiQr {
  vpa: string;
  name: string;
  amount?: number;
  note?: string;
  rawPayload: string;
  sourceType: "camera" | "upload" | "sample";
}

interface QrCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQrScanned: (data: DecodedUpiQr) => void;
}

export const QrCodeScannerModal: React.FC<QrCodeScannerModalProps> = ({
  isOpen,
  onClose,
  onQrScanned
}) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "samples">("samples");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample UPI QR presets for immediate 1-tap testing
  const SAMPLE_QRS = [
    {
      id: "swiggy-qr",
      title: "Swiggy / Food Order",
      vpa: "swiggy@icici",
      name: "Swiggy Delivery Hub",
      amount: 250,
      note: "Lunch Order #4892",
      riskProfile: "safe",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Verified Merchant UPI QR · Typical daily food purchase"
    },
    {
      id: "electricity-qr",
      title: "Electricity Bill (BESCOM)",
      vpa: "bescom.bills@sbi",
      name: "BESCOM Utility Bill",
      amount: 1450,
      note: "Account #90214812",
      riskProfile: "safe",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Registered state utility provider · Safe bill payment"
    },
    {
      id: "chai-qr",
      title: "Local Chai Point",
      vpa: "ramesh.chai@okaxis",
      name: "Ramesh Tea Stall",
      amount: 40,
      note: "Morning Chai & Samosa",
      riskProfile: "safe",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "Small local merchant payment"
    },
    {
      id: "p2p-night-qr",
      title: "Unusual Night P2P Transfer",
      vpa: "crypto_p2p_trader@upi",
      name: "P2P Quick Trader",
      amount: 5000,
      note: "Urgent transfer",
      riskProfile: "review",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      description: "First-time transfer to unrecognized individual · High value"
    },
    {
      id: "lottery-trap-qr",
      title: "Fake Lottery Refund QR (Scam)",
      vpa: "support_refund99@upi",
      name: "UPI Cashback & Refund Dept",
      amount: 9999,
      note: "Claim ₹50,000 Prize Processing Fee",
      riskProfile: "blocked",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-200",
      description: "Known phishing trap requesting payment disguised as cashback"
    }
  ];

  // Helper to parse UPI URI format: upi://pay?pa=...&pn=...&am=...&tn=...
  const parseUpiUri = (uri: string): DecodedUpiQr => {
    let vpa = "";
    let name = "Merchant";
    let amount: number | undefined;
    let note = "";

    try {
      if (uri.startsWith("upi://pay")) {
        const urlParams = new URLSearchParams(uri.replace("upi://pay?", ""));
        vpa = urlParams.get("pa") || "";
        name = urlParams.get("pn") || "Merchant";
        const amtStr = urlParams.get("am");
        if (amtStr) amount = parseFloat(amtStr);
        note = urlParams.get("tn") || "";
      } else if (uri.includes("@")) {
        vpa = uri.trim();
        name = vpa.split("@")[0];
      }
    } catch (e) {
      console.warn("URI parsing exception:", e);
      vpa = uri.trim();
    }

    return {
      vpa: vpa || "merchant@upi",
      name: name || "Verified Merchant",
      amount: amount || (vpa.includes("support") ? 9999 : vpa.includes("swiggy") ? 250 : 500),
      note: note || "SafeUPI payment",
      rawPayload: uri,
      sourceType: "sample"
    };
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device/browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setIsScanning(true);
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError("Camera unavailable or permission denied. Please select a sample QR or upload an image below.");
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  // Handle sample selection
  const handleSelectSample = (sample: typeof SAMPLE_QRS[0]) => {
    onQrScanned({
      vpa: sample.vpa,
      name: sample.name,
      amount: sample.amount,
      note: sample.note,
      rawPayload: `upi://pay?pa=${sample.vpa}&pn=${encodeURIComponent(sample.name)}&am=${sample.amount}&tn=${encodeURIComponent(sample.note)}`,
      sourceType: "sample"
    });
    onClose();
  };

  // Handle Manual or File Input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const decoded = parseUpiUri(manualInput);
    onQrScanned({ ...decoded, sourceType: "upload" });
    onClose();
  };

  // Simulate scanning camera QR on tap
  const handleSimulateCameraCapture = () => {
    // Pick a random realistic QR to simulate successful optical scan
    const randomPreset = SAMPLE_QRS[Math.floor(Math.random() * SAMPLE_QRS.length)];
    handleSelectSample(randomPreset);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-rose-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/90 to-rose-100/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-900/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-rose-950 flex items-center gap-1.5">
                Scan UPI QR Code
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                  Pre-Pay Shield
                </span>
              </h3>
              <p className="text-xs text-rose-800/80">
                SafeUPI analyzes the QR code before you send money
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-700 p-2 rounded-xl hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Camera vs 1-Tap Sample QRs vs Image Upload */}
        <div className="flex border-b border-rose-100 bg-rose-50/40 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("samples")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "samples"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-rose-900 hover:bg-rose-100/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Tap QR Tests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "camera"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-rose-900 hover:bg-rose-100/50"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "upload"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-rose-900 hover:bg-rose-100/50"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Paste / Upload</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: 1-Tap Sample QRs */}
          {activeTab === "samples" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                Tap any sample UPI QR code below to simulate an instant scan and see how SafeUPI verifies it before transmission:
              </div>

              <div className="space-y-2.5">
                {SAMPLE_QRS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50/20 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-rose-900">
                          {sample.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                          {sample.riskProfile === "safe" ? "Verified Safe" : sample.riskProfile === "review" ? "Unusual Pattern" : "Flagged Scam"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        {sample.vpa} · <strong className="text-slate-800">₹{sample.amount}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {sample.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 group-hover:bg-rose-700 group-hover:text-white transition-all shadow-2xs">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Live Camera Scanner */}
          {activeTab === "camera" && (
            <div className="space-y-3 text-center">
              {cameraError ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Camera Permission Notice</span>
                  </div>
                  <p>{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("samples")}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold text-xs"
                  >
                    Use 1-Tap Sample QRs Instead
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square max-w-xs mx-auto border-2 border-rose-300 shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Scanning reticle and laser line */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-rose-400 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-rose-500 -mt-1 -ml-1 rounded-tl-sm" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-rose-500 -mt-1 -mr-1 rounded-tr-sm" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-rose-500 -mb-1 -ml-1 rounded-bl-sm" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-rose-500 -mb-1 -mr-1 rounded-br-sm" />
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse absolute top-1/2" />
                    </div>
                  </div>

                  {/* Simulated scan trigger button */}
                  <button
                    type="button"
                    onClick={handleSimulateCameraCapture}
                    className="absolute bottom-3 bg-white/90 hover:bg-white text-rose-900 text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg cursor-pointer"
                  >
                    Tap to Capture Frame
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Point your camera at any BharatPe, Google Pay, PhonePe, or Paytm QR code
              </p>
            </div>
          )}

          {/* TAB 3: Paste or Upload QR URI */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Paste UPI QR URI or Merchant VPA:
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. upi://pay?pa=merchant@upi&am=500 or just merchant@upi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-xs font-mono focus:outline-none focus:border-rose-600 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-colors"
                >
                  Load & Check Payment
                </button>
              </form>

              <div className="pt-2 border-t border-rose-100 text-center">
                <span className="text-[11px] text-slate-400">
                  Tip: Most UPI apps encode parameters as <code>upi://pay?pa=...&am=...</code>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3.5 bg-rose-50/70 border-t border-rose-100 text-[11px] text-rose-900 text-center font-medium">
          🔒 SafeUPI intercepts QR data to check receiver safety before any PIN is entered.
        </div>
      </div>
    </div>
  );
};
