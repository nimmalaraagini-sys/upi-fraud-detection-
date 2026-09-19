import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Image as ImageIcon, Sparkles, AlertTriangle, 
  CheckCircle2, X, RefreshCw, FileText, ArrowRight, 
  Eye, Zap, ShieldAlert, Smartphone, ShieldCheck, Ban, Info
} from "lucide-react";
import { ScreenshotScanResult, TransactionPayload } from "../types";
import { scanTransactionScreenshot } from "../utils/fraudEngine";
import { SAMPLE_SCREENSHOTS, SampleScreenshot } from "../utils/sampleScreenshots";

interface TransactionScreenshotUploaderProps {
  onApplyExtractedPayload?: (payload: Partial<TransactionPayload>, scanResult: ScreenshotScanResult) => void;
  onScanExtracted?: (scanResult: ScreenshotScanResult) => void;
  isOpenDefault?: boolean;
}

export const TransactionScreenshotUploader: React.FC<TransactionScreenshotUploaderProps> = ({
  onApplyExtractedPayload,
  onScanExtracted,
  isOpenDefault = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpenDefault);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScreenshotScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clipboard paste listener (Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          processFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 10MB limit. Please choose a smaller screenshot.");
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setAppliedNotification(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      triggerScan(dataUrl, file.name, file.type);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file. Please try another screenshot.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerScan = async (base64: string, name: string, mime: string) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await scanTransactionScreenshot(base64, name, mime);
      setScanResult(result);
      
      // Check if it's a valid payment image
      if (result.isPaymentImage !== false) {
        if (typeof onApplyExtractedPayload === "function") {
          onApplyExtractedPayload(result.suggestedPayload, result);
        }
        if (typeof onScanExtracted === "function") {
          onScanExtracted(result);
        }
        setAppliedNotification(true);
        setTimeout(() => setAppliedNotification(false), 5000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to scan screenshot.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectSample = (sample: SampleScreenshot) => {
    setErrorMsg(null);
    setFileName(sample.fileName);
    setImagePreview(sample.dataUrl);
    setAppliedNotification(false);
    triggerScan(sample.dataUrl, sample.fileName, "image/svg+xml");
  };

  const handleClear = () => {
    setImagePreview(null);
    setFileName("");
    setScanResult(null);
    setErrorMsg(null);
    setAppliedNotification(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xs flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Upload Transaction Screenshot
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Vision Scanner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload Google Pay, PhonePe, Paytm, SMS, or QR screenshots. Non-payment photos (food, pets, etc.) will be detected and rejected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {imagePreview && (
            <button
              onClick={handleClear}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Image
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium border border-slate-200 transition-colors"
          >
            {isExpanded ? "Hide Uploader" : "Open Uploader"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Applied Notification Toast */}
          {appliedNotification && scanResult && scanResult.isPaymentImage !== false && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-900 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Screenshot Verified!</strong> Detected ₹{scanResult.detectedAmount?.toLocaleString("en-IN")} to <strong>{scanResult.receiverName}</strong> ({scanResult.channel?.replace("_", " ")}). Applied into risk checker below.
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Synced ✓</span>
            </div>
          )}

          {/* Main Drop Area & Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left/Main: Upload or Preview Dropzone (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/70 scale-[0.99]"
                      : "border-slate-300 bg-slate-50/80 hover:bg-slate-100/70 hover:border-indigo-400"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-indigo-600 transition-transform hover:scale-105">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Click to upload or drag & drop payment screenshot
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        PNG, JPG, or WEBP up to 10MB · Or paste directly (<kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-700 font-mono shadow-2xs">Ctrl+V</kbd>)
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Google Pay</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">PhonePe</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Paytm</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Bank SMS / QR</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Container */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                    <span className="font-mono truncate max-w-[220px] font-semibold text-slate-800" title={fileName}>
                      📄 {fileName}
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" /> Change Image
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Image Display */}
                  <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 max-h-64 flex items-center justify-center shadow-xs">
                    <img
                      src={imagePreview}
                      alt="Uploaded Screenshot"
                      className="max-h-64 w-auto object-contain p-1"
                    />

                    {/* Scanning Overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-slate-900">
                          AI Vision is analyzing image...
                        </p>
                        <p className="text-xs text-slate-600 max-w-xs">
                          Checking if this is a payment screen and scanning for UPI IDs, amounts, and scam indicators
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error display */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Right: AI Vision Scan Insights or Quick Samples (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              {scanResult ? (
                scanResult.isPaymentImage === false ? (
                  /* REJECTION CARD: Non-Payment Image Detected (e.g. food, animals, random photo) */
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 space-y-3.5 shadow-xs animate-in fade-in">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0">
                        <Ban className="w-5 h-5 text-amber-800" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-amber-950">
                          Not a Payment Image Detected
                        </h3>
                        <p className="text-xs text-amber-900 mt-0.5">
                          This image does not appear to be a transaction screenshot.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between pb-1 border-b border-amber-100">
                        <span className="text-slate-500 font-medium">Detected Content:</span>
                        <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                          {scanResult.detectedContentType || "Food / Meal / Non-Payment"}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {scanResult.rejectionReason || "The uploaded image appears to be a photo of food or a general object. This app only analyzes UPI payments, QR codes, banking SMS, and collect requests."}
                      </p>
                    </div>

                    <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-200/70 text-[11px] text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-amber-700" />
                        What you can upload:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                        <li>Payment screens from Google Pay, PhonePe, Paytm, BHIM</li>
                        <li>Bank SMS debit/credit alerts</li>
                        <li>UPI QR codes or store merchant payment prompts</li>
                        <li>Incoming UPI collect requests</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleClear}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Upload a Payment Screenshot Instead</span>
                    </button>
                  </div>
                ) : (
                  /* Scan Analysis Result Card for VALID Payment Images */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          AI Vision Insights
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {scanResult.confidenceScore}% Confidence
                      </span>
                    </div>

                    {/* Key Extracted Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Detected App</span>
                        <span className="font-bold text-slate-900 truncate block">{scanResult.appName || "UPI App"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Extracted Amount</span>
                        <span className="font-bold text-emerald-700 font-mono block">₹{scanResult.detectedAmount?.toLocaleString("en-IN") || "0"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2">
                        <span className="text-[10px] text-slate-500 block">Recipient / Requester</span>
                        <span className="font-bold text-slate-900 truncate block">{scanResult.receiverName}</span>
                        <span className="text-[11px] font-mono text-indigo-700 truncate block">{scanResult.receiverVpa}</span>
                      </div>
                    </div>

                    {/* Detected Red Flags list */}
                    {scanResult.detectedRedFlags && scanResult.detectedRedFlags.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Scam Red Flags in Screenshot:
                        </span>
                        <div className="space-y-1">
                          {scanResult.detectedRedFlags.map((flag, idx) => (
                            <div key={idx} className="text-[11px] p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 leading-tight">
                              • {flag}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>No obvious visual scam patterns detected in screenshot.</span>
                      </div>
                    )}

                    {/* Summary Text */}
                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed italic">
                      "{scanResult.summary}"
                    </p>

                    {/* Re-apply button */}
                    <button
                      onClick={() => {
                        if (typeof onApplyExtractedPayload === "function") {
                          onApplyExtractedPayload(scanResult.suggestedPayload, scanResult);
                        }
                        if (typeof onScanExtracted === "function") {
                          onScanExtracted(scanResult);
                        }
                        setAppliedNotification(true);
                        setTimeout(() => setAppliedNotification(false), 4000);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <span>Update Risk Checker</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              ) : (
                /* Quick Sample Screenshots Selector */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">
                      No screenshot? Test with a sample:
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Click any sample below to see how our AI scans transactions and rejects food/non-payment photos:
                  </p>
                  <div className="space-y-2 pt-1">
                    {SAMPLE_SCREENSHOTS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all group shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                            {sample.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                            sample.id === "sample_food_photo"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : sample.id === "sample_verified_qr"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : sample.id === "sample_electricity_urgency"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {sample.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {sample.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
