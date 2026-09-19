/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { SafeUpiApp } from "./components/SafeUpiApp";
import { RiskScoreGauge } from "./components/RiskScoreGauge";
import { TransactionEditor } from "./components/TransactionEditor";
import { RuleViolationsList } from "./components/RuleViolationsList";
import { ExplainableAiWaterfall } from "./components/ExplainableAiWaterfall";
import { AiForensicsPanel } from "./components/AiForensicsPanel";
import { ScenarioPresets } from "./components/ScenarioPresets";
import { LiveTransactionFeed } from "./components/LiveTransactionFeed";
import { RulesMatrixModal } from "./components/RulesMatrixModal";
import { CyberAwarenessModal } from "./components/CyberAwarenessModal";
import { FundTracebackSimulator } from "./components/FundTracebackSimulator";
import { TransactionScreenshotUploader } from "./components/TransactionScreenshotUploader";
import { HowToUseModal } from "./components/HowToUseModal";
import { PRESET_SCENARIOS } from "./data/presets";
import { TransactionPayload, AnalysisResult, ForensicReport, PresetScenario, ScreenshotScanResult } from "./types";
import { evaluateRiskEngine, fetchAiForensics } from "./utils/fraudEngine";
import { Sparkles, ShieldCheck, Zap, AlertTriangle, HelpCircle, Image as ImageIcon, SlidersHorizontal, ArrowLeft } from "lucide-react";

export default function App() {
  // Mode: 'friendly' (Default SafeUPI User flow) vs 'expert' (Raw engine & waterfall)
  const [appMode, setAppMode] = useState<"friendly" | "expert">("friendly");

  // Navigation tabs for expert mode
  const [activeTab, setActiveTab] = useState<"simulator" | "scenarios" | "feed" | "matrix" | "traceback">("simulator");
  const [isAwarenessOpen, setIsAwarenessOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isTracebackModalOpen, setIsTracebackModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // Active scenario identifier (if loaded from preset)
  const [activeScenarioId, setActiveScenarioId] = useState<string>("screen_share_scam");

  // Current Transaction Payload state
  const [transaction, setTransaction] = useState<TransactionPayload>(() => PRESET_SCENARIOS[0].data);

  // Synchronous, instant evaluation whenever transaction changes
  const analysisResult = useMemo<AnalysisResult>(() => {
    return evaluateRiskEngine(transaction);
  }, [transaction]);

  // AI Forensics Report state
  const [forensicReport, setForensicReport] = useState<ForensicReport | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Reset AI report whenever transaction significantly changes
  useEffect(() => {
    setForensicReport(null);
  }, [transaction.transactionId]);

  // Trigger Gemini AI forensic investigation
  const handleInvestigateAi = async () => {
    setIsLoadingAi(true);
    try {
      const report = await fetchAiForensics(transaction, analysisResult);
      setForensicReport(report);
    } catch (err) {
      console.error("AI Investigation failed:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Handle preset scenario selection
  const handleSelectScenario = (scenario: PresetScenario) => {
    setActiveScenarioId(scenario.id);
    setTransaction({ ...scenario.data });
    setActiveTab("simulator");
  };

  // Handle inspecting a transaction from the live feed
  const handleInspectFromFeed = (tx: TransactionPayload) => {
    setTransaction(tx);
    setActiveScenarioId("");
    setActiveTab("simulator");
  };

  // Reset to initial baseline
  const handleReset = () => {
    const defaultPreset = PRESET_SCENARIOS[0];
    setActiveScenarioId(defaultPreset.id);
    setTransaction({ ...defaultPreset.data });
    setForensicReport(null);
  };

  // Handle payload extracted from uploaded transaction screenshot
  const handleApplyScreenshotPayload = (extracted: Partial<TransactionPayload>, _scanResult: ScreenshotScanResult) => {
    setTransaction((prev) => ({
      ...prev,
      transactionId: `TXN_SCAN_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      ...extracted
    }));
    setActiveScenarioId("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* If Friendly SafeUPI Mode (Default user-centric experience) */}
      {appMode === "friendly" ? (
        <>
          <SafeUpiApp
            onOpenTraceback={() => setIsTracebackModalOpen(true)}
            onOpenHowToUse={() => setIsHowToUseOpen(true)}
            onOpenSafetyRules={() => setIsMatrixModalOpen(true)}
          />

          {/* Discreet Developer / Expert Mode Switcher at bottom */}
          <div className="fixed bottom-3 right-3 z-40">
            <button
              onClick={() => setAppMode("expert")}
              className="px-3 py-1.5 rounded-full bg-rose-950/85 hover:bg-rose-950 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-all border border-rose-800/80 cursor-pointer"
              title="Switch to detailed ML engine view"
            >
              <SlidersHorizontal className="w-3 h-3 text-rose-300" />
              <span>Expert Mode</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Header for Expert Mode */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAwareness={() => setIsAwarenessOpen(true)}
            onOpenHowToUse={() => setIsHowToUseOpen(true)}
          />

          {/* Expert Mode Back to Friendly SafeUPI Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex items-center justify-between">
            <button
              onClick={() => setAppMode("friendly")}
              className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to SafeUPI Friendly App</span>
            </button>
            <span className="text-xs text-slate-500">
              Expert Mode: Inspecting underlying rules & factor weights
            </span>
          </div>

          {/* Main Content Area in Expert Mode */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
            {activeTab === "simulator" && (
              <div className="space-y-6">
                <TransactionScreenshotUploader
                  onApplyExtractedPayload={handleApplyScreenshotPayload}
                  isOpenDefault={false}
                />

                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Attack Scenarios:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    {PRESET_SCENARIOS.map((sc) => (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(sc)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                          activeScenarioId === sc.id
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {sc.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                    <TransactionEditor
                      transaction={transaction}
                      onChange={setTransaction}
                      onReset={handleReset}
                    />

                    <ExplainableAiWaterfall
                      factors={analysisResult.factors}
                      riskScore={analysisResult.riskScore}
                    />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <RiskScoreGauge
                      analysis={analysisResult}
                      onInvestigateAi={handleInvestigateAi}
                      isLoadingAi={isLoadingAi}
                    />

                    {(forensicReport || isLoadingAi) && (
                      <AiForensicsPanel
                        report={forensicReport}
                        isLoading={isLoadingAi}
                        onRunAgain={handleInvestigateAi}
                        onOpenCyberHelpline={() => setIsAwarenessOpen(true)}
                      />
                    )}

                    <RuleViolationsList rules={analysisResult.triggeredRules} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "scenarios" && (
              <ScenarioPresets
                onSelectScenario={handleSelectScenario}
                activeScenarioId={activeScenarioId}
              />
            )}

            {activeTab === "feed" && (
              <LiveTransactionFeed
                onInspectTransaction={handleInspectFromFeed}
              />
            )}

            {activeTab === "matrix" && (
              <RulesMatrixModal />
            )}

            {activeTab === "traceback" && (
              <FundTracebackSimulator />
            )}
          </main>
        </>
      )}

      {/* Traceback Simulator Modal when called from SafeUPI */}
      {isTracebackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Fund Traceback Simulator & Official Bank Refund Letter
              </h2>
              <button
                onClick={() => setIsTracebackModalOpen(false)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
            <FundTracebackSimulator />
          </div>
        </div>
      )}

      {/* Rules Matrix Modal when called from SafeUPI */}
      {isMatrixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                SafeUPI Safety Rules & Protection Actions
              </h2>
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
            <RulesMatrixModal />
          </div>
        </div>
      )}

      {/* Cyber Crime Helpline & Awareness Modal */}
      <CyberAwarenessModal
        isOpen={isAwarenessOpen}
        onClose={() => setIsAwarenessOpen(false)}
      />

      {/* How to Use This App Guide Modal */}
      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SafeUPI · &ldquo;Your friendly payment guard.&rdquo;
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAwarenessOpen(true)}
              className="text-rose-700 hover:text-rose-900 font-semibold hover:underline"
            >
              Helpline 1930
            </button>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-xs text-slate-500">
              cybercrime.gov.in
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

