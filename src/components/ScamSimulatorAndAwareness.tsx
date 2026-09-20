import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import { TRANSLATIONS, MULTI_TRANSLATIONS, SupportedLang } from "../utils/translations";

interface ScamScenario {
  id: string;
  title: string;
  category: "Fake Screenshot" | "QR Scam" | "Screen Share APK" | "Refund / Customer Care";
  sender: string;
  situation: string;
  evidenceText: string;
  correctAction: "verify" | "reject" | "report";
  options: {
    id: "trust" | "verify" | "report";
    label: string;
    description: string;
  }[];
  explanation: string;
  keySafetyTip: string;
}

export const ScamSimulatorAndAwareness: React.FC<{
  currentLang?: SupportedLang;
}> = ({ currentLang = "en" }) => {
  const t = MULTI_TRANSLATIONS[currentLang] || MULTI_TRANSLATIONS.en;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<"trust" | "verify" | "report" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const scenarios: ScamScenario[] = [
    {
      id: "fake_screen_1",
      title: currentLang === "te" ? "ఓఎల్‌ఎక్స్ కొనుగోలుదారు నకిలీ చెల్లింపు రసీదు పంపాడు" : "OLX Buyer sends Payment Screenshot",
      category: "Fake Screenshot",
      sender: "Buyer on WhatsApp: +91 98490 XXXXX",
      situation: currentLang === "te" 
        ? "మీరు మీ సైకిల్‌ను ₹6,500 కు అమ్ముతున్నారు. కొనుగోలుదారుడు '₹6,500 మీ ఖాతాకు పంపబడింది' అని నకిలీ స్క్రీన్‌షాట్ పంపి, వెంటనే సైకిల్‌ను డెలివరీ అబ్బాయికి ఇవ్వమని కోరుతున్నాడు."
        : "You are selling your bicycle for ₹6,500. The buyer sends a screenshot showing 'Payment Successful - ₹6,500 sent to your UPI ID' and asks you to immediately hand over the bicycle to their delivery guy.",
      evidenceText: currentLang === "te" 
        ? "స్క్రీన్‌షాట్‌లో ₹6,500 అక్షరాలు అస్పష్టంగా ఉన్నాయి మరియు మీ బ్యాంక్ బ్యాలెన్స్ ఎస్ఎంఎస్ ఇంకా రాలేదు."
        : "Screenshot font looks slightly blurred around the amount '₹6,500' and your bank balance SMS has not arrived yet.",
      correctAction: "verify",
      options: [
        { 
          id: "trust", 
          label: currentLang === "te" ? "స్క్రీన్‌షాట్ నమ్మి వస్తువు ఇవ్వండి" : "Trust screenshot", 
          description: currentLang === "te" ? "గ్రీన్ టిక్ మార్క్ ఉన్నందున సైకిల్ డెలివరీ చేయండి." : "Hand over the bicycle because the screenshot has a green tick." 
        },
        { 
          id: "verify", 
          label: currentLang === "te" ? "బ్యాంక్ బ్యాలెన్స్ ముందు తనిఖీ చేయండి" : "Check bank balance first", 
          description: currentLang === "te" ? "మీ బ్యాంక్ యాప్ తెరిచి నిజంగా డబ్బులు జమ అయ్యాయో చూడండి." : "Open your bank app directly to verify actual credit." 
        },
        { 
          id: "report", 
          label: currentLang === "te" ? "నకిలీ మోసంగా నివేదించండి" : "Report as fake fraud", 
          description: currentLang === "te" ? "యూజర్‌ను బ్లాక్ చేసి SafeUPI లో నివేదించండి." : "Block the user and flag the fake screenshot to SafeUPI." 
        }
      ],
      explanation: currentLang === "te" 
        ? "నకిలీ పేమెంట్ యాప్‌లతో కొద్ది సెకన్లలోనే నకిలీ రసీదులు సృష్టించవచ్చు. మీ అధికారిక బ్యాంక్ ఖాతాలో బ్యాలెన్స్ పెరిగినట్లు నిర్ధారించుకోకుండా ఎప్పుడూ వస్తువులు ఇవ్వకండి."
        : "Fake payment generator apps create realistic payment screens in seconds. Never rely on a screenshot or green tick—always check your actual bank account balance or statement before releasing goods.",
      keySafetyTip: currentLang === "te" 
        ? "స్క్రీన్‌షాట్‌లను సులభంగా తయారు చేయవచ్చు. మీ బ్యాంక్ యాప్‌లో కనిపించే క్రెడిట్ మాత్రమే నిజమైనది."
        : "Screenshots can be fabricated with ease. Only trust credits visible inside your official banking application."
    },
    {
      id: "qr_receive_trap",
      title: currentLang === "te" ? "బహుమతి డబ్బును 'పొందడానికి' క్యూఆర్ స్కాన్ చేయమంటున్నారు" : "Scan QR Code to 'Receive' Prize Money",
      category: "QR Scam",
      sender: "SMS: 'Reward Points Cashback'",
      situation: currentLang === "te" 
        ? "మీకు ₹3,000 లాటరీ క్యాష్‌బ్యాక్ వచ్చిందని ఒక వ్యక్తి ఫోన్ చేసి: 'మీ యూపీఐ యాప్ తెరిచి ఈ క్యూఆర్ స్కాన్ చేసి మీ 6 అంకెల పిన్ కొట్టండి' అని చెబుతున్నాడు."
        : "You receive a message claiming you won a ₹3,000 lottery cashback. The caller instructs: 'Open your UPI app, scan this QR code, and enter your 6-digit UPI PIN to claim your refund directly into your bank.'",
      evidenceText: "QR payload shows: upi://pay?pa=cashbackrewards@ybl&am=3000&pn=ClaimReward",
      correctAction: "report",
      options: [
        { 
          id: "trust", 
          label: currentLang === "te" ? "స్కాన్ చేసి పిన్ ఎంటర్ చేయండి" : "Scan & Enter PIN", 
          description: currentLang === "te" ? "డబ్బులు మీ ఖాతాలోకి రావడానికి యూపీఐ పిన్ వేయండి." : "Enter UPI PIN quickly so the money transfers into your account." 
        },
        { 
          id: "verify", 
          label: currentLang === "te" ? "బ్యాంకు కస్టమర్ కేర్‌ను అడగండి" : "Ask bank customer care", 
          description: currentLang === "te" ? "ఆగి మీ బ్రాంచ్‌ను సంప్రదించండి." : "Wait and call your branch." 
        },
        { 
          id: "report", 
          label: currentLang === "te" ? "తిరస్కరించి మోసంగా నివేదించండి" : "Refuse & Report Scam", 
          description: currentLang === "te" ? "డబ్బులు తీసుకోవడానికి ఎప్పుడూ పిన్ కొట్టవద్దు!" : "Never scan QR or enter PIN to receive money!" 
        }
      ],
      explanation: currentLang === "te" 
        ? "యూపీఐ గోల్డెన్ రూల్: డబ్బులు అందుకోవడానికి మీరు ఎప్పుడూ యూపీఐ పిన్ కొట్టాల్సిన పనిలేదు. పిన్ ఎంటర్ చేస్తే మీ ఖాతా నుండే డబ్బులు కట్ అవుతాయి!"
        : "Fundamental UPI Golden Rule: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering your PIN always deducts money from your account.",
      keySafetyTip: currentLang === "te" 
        ? "పిన్ అనేది చెల్లించడానికి మాత్రమే, స్వీకరించడానికి కాదు. డబ్బులు ఇస్తామని ఎవరైనా పిన్ అడిగితే అది 100% మోసం."
        : "PIN is for paying, not receiving. If anyone asks for your PIN to send you money, it is 100% a scam."
    },
    {
      id: "screen_share_apk",
      title: currentLang === "te" ? "కేవైసీ కోసం ఎనీడెస్క్ (AnyDesk) యాప్ వేసుకోమంటున్నారు" : "Bank KYC Support asking for 'AnyDesk' App",
      category: "Screen Share APK",
      sender: "Caller posing as Bank Nodal Officer",
      situation: currentLang === "te" 
        ? "కేవైసీ పూర్తి కాకపోతే మీ యూపీఐ ఐడీ 2 గంటల్లో బ్లాక్ అవుతుందని కాల్ వచ్చింది. వీడియో కేవైసీ కోసం 'QuickSupport' లేదా 'AnyDesk' డౌన్‌లోడ్ చేయమంటున్నారు."
        : "A caller claims your UPI ID is expiring in 2 hours due to pending KYC. They ask you to install an app like 'QuickSupport' or 'AnyDesk' to help you complete live video KYC from home.",
      evidenceText: currentLang === "te" 
        ? "కాలర్ ఒత్తిడి: 'స్క్రీన్ మీద వచ్చే 9 అంకెల కోడ్ చెబితే మా బ్యాంక్ ఆఫీసర్ సెట్టింగ్స్ సరిచేస్తారు.'"
        : "Caller insists: 'Just share the 9-digit code displayed on screen so our bank officer can verify your settings.'",
      correctAction: "report",
      options: [
        { 
          id: "trust", 
          label: currentLang === "te" ? "యాప్ వేసి కోడ్ షేర్ చేయండి" : "Install app & share code", 
          description: currentLang === "te" ? "యూపీఐ అకౌంట్ బ్లాక్ కాకుండా ఉండటానికి సూచనలు పాటించండి." : "Follow instructions to avoid your UPI account being blocked." 
        },
        { 
          id: "verify", 
          label: currentLang === "te" ? "యాప్ వేసి బ్యాంక్ వివరాలు ఇవ్వకండి" : "Open app in mute", 
          description: currentLang === "te" ? "కేవలం ఇన్స్టాల్ చేయండి." : "Install it but don't enter bank details." 
        },
        { 
          id: "report", 
          label: currentLang === "te" ? "కట్ చేసి 1930 కు ఫిర్యాదు చేయండి" : "Disconnect & Report to 1930", 
          description: currentLang === "te" ? "బ్యాంక్ ఉద్యోగులు ఎప్పుడూ స్క్రీన్ షేరింగ్ యాప్‌లను డౌన్‌లోడ్ చేయమని కోరరు." : "Bank employees never ask you to install remote screen sharing software." 
        }
      ],
      explanation: currentLang === "te" 
        ? "రిమోట్ యాక్సెస్ టూల్స్ (AnyDesk, TeamViewer) సైబర్ నేరగాళ్లకు మీ ఫోన్ స్క్రీన్‌ను నేరుగా చూపిస్తాయి. మీరు టైప్ చేసే ఓటీపీలు మరియు బ్యాంక్ వివరాలను వారు సులభంగా కాజేస్తారు."
        : "Remote access tools (AnyDesk, TeamViewer, RustDesk) allow scammers to watch your screen in real time, capturing OTPs and bank credentials while you type.",
      keySafetyTip: currentLang === "te" 
        ? "ఎవరైనా అపరిచితులు చెప్పారని ఎప్పుడూ స్క్రీన్ షేరింగ్ యాప్‌లు ఇన్స్టాల్ చేయవద్దు."
        : "Never install remote desktop apps at the instruction of unknown callers, even if they claim to be from your bank or police."
    }
  ];

  const scenario = scenarios[selectedIdx] || scenarios[0];

  const handleSelectOption = (choice: "trust" | "verify" | "report") => {
    setUserChoice(choice);
    setShowResult(true);
    if (choice === scenario.correctAction || (choice === "report" && scenario.correctAction === "verify")) {
      setScore(prev => prev + 1);
    }
    setCompletedCount(prev => Math.max(prev, selectedIdx + 1));
  };

  const handleNext = () => {
    setUserChoice(null);
    setShowResult(false);
    setSelectedIdx((prev) => (prev + 1) % scenarios.length);
  };

  const isCorrect = userChoice === scenario.correctAction || (userChoice === "report" && scenario.correctAction === "verify");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-rose-800/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>{t.scamQuizTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {currentLang === "te" ? "స్కామ్ డిటెక్షన్ ప్రాక్టికల్ ల్యాబ్" : "Scam Detection Hands-on Lab"}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 mt-1 max-w-xl">
              {currentLang === "te" 
                ? "నిజమైన యూపీఐ మోసపు దృశ్యాలలో మీ అప్రమత్తతను పరీక్షించుకోండి. నిజమైన డబ్బులు పోకముందే జాగ్రత్త పడండి."
                : "Put yourself in common UPI fraud situations. Test your instincts before real money is at stake."}
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/15 min-w-[120px]">
            <span className="text-[10px] text-rose-200 uppercase font-bold tracking-wider block">
              {currentLang === "te" ? "అవగాహన స్కోరు" : "Awareness Score"}
            </span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {score} / {scenarios.length}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-200">
              {scenario.category}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {currentLang === "te" ? `దృశ్యం ${selectedIdx + 1} / ${scenarios.length}` : `Scenario ${selectedIdx + 1} of ${scenarios.length}`}
            </span>
          </div>
          <button
            onClick={() => {
              setUserChoice(null);
              setShowResult(false);
              setSelectedIdx(0);
              setScore(0);
            }}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{currentLang === "te" ? "మళ్లీ ప్రారంభించండి" : "Reset"}</span>
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900">
            {scenario.title}
          </h3>

          <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 text-xs text-slate-800 space-y-1.5">
            <div className="font-semibold text-rose-900 flex items-center gap-1">
              <span>👤 {currentLang === "te" ? "సందేశం పంపిన వారు:" : "Sender Context:"}</span>
              <span className="font-normal text-slate-700">{scenario.sender}</span>
            </div>
            <p className="leading-relaxed">{scenario.situation}</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">{currentLang === "te" ? "ముఖ్యమైన క్లూ:" : "Noticeable Clue:"}</strong>
              <span>{scenario.evidenceText}</span>
            </div>
          </div>
        </div>

        {/* User Choice Options */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {currentLang === "te" ? "మీరు ఏ నిర్ణయం తీసుకుంటారు?" : "What action would you take?"}
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {scenario.options.map((opt) => (
              <button
                key={opt.id}
                disabled={showResult}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  userChoice === opt.id
                    ? isCorrect
                      ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300"
                      : "bg-rose-50 border-rose-400 ring-2 ring-rose-300"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{opt.description}</div>
                </div>
                {userChoice === opt.id && (
                  <span className="shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Feedback Card */}
        {showResult && (
          <div className={`p-4 rounded-2xl border animate-in fade-in space-y-2.5 text-xs ${
            isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
          }`}>
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{currentLang === "te" ? "సరైన నిర్ణయం! +1 పాయింట్" : "Correct Security Decision! +1 Point"}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>{currentLang === "te" ? "ప్రమాదకర ఎంపిక! మీ డబ్బులు పోయే ప్రమాదం ఉంది." : "Risky Choice! You could have lost money."}</span>
                </>
              )}
            </div>

            <p className="leading-relaxed">{scenario.explanation}</p>

            <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-start gap-2 font-medium text-slate-800">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>{currentLang === "te" ? "గోల్డెన్ రూల్:" : "Golden Rule:"}</strong> {scenario.keySafetyTip}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentLang === "te" ? "తరువాతి దృశ్యం" : "Next Scenario"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 Golden Security Awareness Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">1</span>
            <span>{currentLang === "te" ? "డబ్బు పొందడానికి పిన్ అవసరం లేదు" : "No PIN to Receive"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentLang === "te" 
              ? "యూపీఐ పిన్ అనేది డబ్బులు చెల్లించడానికి మాత్రమే. బహుమతులు లేదా క్యాష్‌బ్యాక్ పొందడానికి పిన్ ఎప్పుడూ కొట్టవద్దు."
              : "UPI PIN is strictly for authenticating outgoing debits. You never enter a PIN to receive refunds or prizes."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">2</span>
            <span>{currentLang === "te" ? "అధికారిక బ్యాంక్ పేరు తనిఖీ చేయండి" : "Verify Beneficiary Name"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentLang === "te"
              ? "పిన్ కొట్టే ముందు, స్క్రీన్ పై కనిపించే నమోదిత బ్యాంక్ పేరును నిశితంగా సరిచూసుకోండి."
              : "Before entering PIN, check the registered banking name on the UPI prompt—not just the nickname or phone number."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">3</span>
            <span>{currentLang === "te" ? "1930 గోల్డెన్ 24 గంటలు" : "1930 Golden 24 Hours"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentLang === "te"
              ? "మోసం జరిగిన మొదటి 24 గంటల్లో 1930 కాల్ చేస్తే నేరగాళ్ల ఖాతాలు స్తంభింపజేసి డబ్బు రికవరీ అయ్యే అవకాశం ఎక్కువ."
              : "Dial 1930 within the first 24 hours to freeze destination mule accounts before scammers can withdraw cash at ATMs."}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-mono">4</span>
            <span>{currentLang === "te" ? "స్క్రీన్ షేరింగ్ యాప్‌లు తిరస్కరించండి" : "Reject Remote Screen Apps"}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentLang === "te"
              ? "కస్టమర్ కేర్ పేరుతో ఎవరైనా AnyDesk లేదా QuickSupport ఇన్స్టాల్ చేయమంటే వెంటనే ఫోన్ కట్ చేయండి."
              : "Never install AnyDesk or QuickSupport at the request of anyone claiming to be bank or courier customer care."}
          </p>
        </div>
      </div>
    </div>
  );
};
