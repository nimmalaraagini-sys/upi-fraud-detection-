import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Activity, 
  HelpCircle, Sparkles, Check, ChevronDown, ChevronUp, 
  Info, Lock, Eye, AlertOctagon, Smartphone, Clock, 
  Sliders, Play, RotateCcw, Share2, Shield, HeartPulse,
  ExternalLink, Zap, Bug, Ban, FileWarning, ArrowRight,
  TrendingUp, RefreshCw, Cpu, Volume2, ShieldX
} from "lucide-react";

export interface SafetyTemplate {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  maxAmount: number;
  blockCalls: boolean;
  blockNewBeneficiary: boolean;
  enforceGuardian: boolean;
  lateNightStrict: boolean;
  color: string;
  recommendation: string;
}

export const SAFETY_TEMPLATES: SafetyTemplate[] = [
  {
    id: "senior_armor",
    name: "Senior Citizen Armor",
    badge: "Maximum Guard",
    icon: "👵",
    description: "Hard-blocks payments during active phone calls, limits transactions to ₹2,000, and triggers guardian approval for all unfamiliar payees.",
    maxAmount: 2000,
    blockCalls: true,
    blockNewBeneficiary: true,
    enforceGuardian: true,
    lateNightStrict: true,
    color: "from-rose-500/20 to-purple-500/20 border-purple-500/40 text-purple-200",
    recommendation: "Essential for elderly users vulnerable to impersonation, digital arrest, and remote-desktop scams."
  },
  {
    id: "student_delivery",
    name: "Student & Daily Essentials",
    badge: "Balanced",
    icon: "🎒",
    description: "Whitelists verified food, grocery, and campus merchants while actively flagging crypto, task jobs, and lottery refund traps.",
    maxAmount: 5000,
    blockCalls: false,
    blockNewBeneficiary: false,
    enforceGuardian: false,
    lateNightStrict: false,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-200",
    recommendation: "Optimized for high-frequency everyday small payments without cumbersome security friction."
  },
  {
    id: "merchant_invoice",
    name: "Vendor & Merchant Invoices",
    badge: "Business P2B",
    icon: "🏢",
    description: "Inspects GST-registered merchant VPA signatures, stops reverse collect requests disguised as buyer deposits, and allows up to ₹50,000.",
    maxAmount: 50000,
    blockCalls: true,
    blockNewBeneficiary: false,
    enforceGuardian: false,
    lateNightStrict: true,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-200",
    recommendation: "Protects business owners against unverified supply vendor invoices and QR sticker tampering."
  },
  {
    id: "zero_trust_olx",
    name: "Zero-Trust Marketplace (OLX/P2P)",
    badge: "Scam Shield",
    icon: "🛒",
    description: "Strict defense against 'buyer token advance' traps, unverified army officer QR vouchers, and refund collect links.",
    maxAmount: 15000,
    blockCalls: true,
    blockNewBeneficiary: true,
    enforceGuardian: true,
    lateNightStrict: true,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-200",
    recommendation: "Recommended whenever trading with strangers on OLX, Quikr, or Facebook Marketplace."
  },
  {
    id: "late_night_lock",
    name: "Late-Night High-Shield Mode",
    badge: "11 PM - 6 AM",
    icon: "🌙",
    description: "Automatically imposes a +25 point risk penalty on transfers initiated after 11:00 PM and introduces a mandatory 15-minute cooling pause.",
    maxAmount: 3000,
    blockCalls: true,
    blockNewBeneficiary: true,
    enforceGuardian: true,
    lateNightStrict: true,
    color: "from-indigo-500/20 to-slate-500/20 border-indigo-500/40 text-indigo-200",
    recommendation: "Prevents impulsive or coerced late-night transfers during compromised cognitive alertness."
  },
  {
    id: "freelancer_escrow",
    name: "Freelancer & Remote Milestone Shield",
    badge: "Contractors",
    icon: "💻",
    description: "Screens inbound client advances for deceptive chargeback collect intents and verifies employer UPI handles against freelance registries.",
    maxAmount: 35000,
    blockCalls: false,
    blockNewBeneficiary: true,
    enforceGuardian: false,
    lateNightStrict: false,
    color: "from-sky-500/20 to-indigo-500/20 border-sky-500/40 text-sky-200",
    recommendation: "Ideal for gig workers, designers, and developers getting paid by unfamiliar corporate VPAs."
  },
  {
    id: "executive_vault",
    name: "Executive High-Value Vault",
    badge: "Strict Biometric",
    icon: "🏦",
    description: "Enforces dual-factor biometric authentication on every transfer over ₹10,000, locks device tokens, and disallows clipboard VPA pasting.",
    maxAmount: 100000,
    blockCalls: true,
    blockNewBeneficiary: true,
    enforceGuardian: true,
    lateNightStrict: true,
    color: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/40 text-violet-200",
    recommendation: "Tailored for high-net-worth accounts managing large recurring personal or corporate payments."
  },
  {
    id: "rural_vernacular",
    name: "Rural & Vernacular Voice Shield",
    badge: "Voice-Assisted",
    icon: "🎙️",
    description: "Converts all security warnings to regional voice readouts (Telugu, Hindi, Tamil) and prevents unassisted PIN entry for new payees.",
    maxAmount: 4000,
    blockCalls: true,
    blockNewBeneficiary: true,
    enforceGuardian: true,
    lateNightStrict: true,
    color: "from-emerald-500/20 to-amber-500/20 border-emerald-500/40 text-emerald-200",
    recommendation: "Guards first-time digital banking adopters against social engineering in their native languages."
  }
];

export interface FailureTestCase {
  id: string;
  caseNumber: number;
  title: string;
  category: string;
  severity: "Critical" | "High" | "Medium";
  inputs: {
    recipient: string;
    amount: number;
    timeStr: string;
    isNewDevice: boolean;
    isNewRecipient: boolean;
    activeCall: boolean;
    isCollectRequest: boolean;
  };
  whyItFails: string;
  engineBlindSpot: string;
  countermeasure: string;
  predictedRiskScore: number;
  limitationCategory: "Off-Device Intimidation" | "Micro-Structuring" | "Identity Hijack" | "Physical Cashout" | "Dynamic Redirect" | "Character Homoglyph" | "Kernel/OS Spyware" | "Audio Spoofing";
  realWorldImpact: string;
}

export const FAILURE_TEST_CASES: FailureTestCase[] = [
  {
    id: "case_1_digital_arrest",
    caseNumber: 1,
    title: "Digital Arrest & Coerced Willing Authorizer",
    category: "Vishing / Psychological Coercion",
    severity: "Critical",
    inputs: {
      recipient: "supreme_court_bail_clearing@sbi",
      amount: 45000,
      timeStr: "11:30 AM",
      isNewDevice: false,
      isNewRecipient: true,
      activeCall: false, // Victim was coerced via WhatsApp video on an external laptop; phone GSM call sensor is idle!
      isCollectRequest: false
    },
    whyItFails: "The victim is terrified by fake police officers on an external laptop video call and willingly enters their genuine UPI PIN on their own daily phone. Hardware ID, geolocation, and biometrics appear 100% legitimate.",
    engineBlindSpot: "Client-side sensors cannot detect off-device psychological intimidation, Skype/Zoom on another computer, or in-person extortion without cross-device ambient awareness.",
    countermeasure: "Natural Language VPA scanning for authority keywords ('bail', 'court', 'cbi') + high-value cooling pause for first-time government-named VPAs.",
    predictedRiskScore: 42,
    limitationCategory: "Off-Device Intimidation",
    realWorldImpact: "Victims in India lost over ₹120 Crore in 2024 to fake law-enforcement video calls where victims willingly entered genuine PINs."
  },
  {
    id: "case_2_smurfing_structuring",
    caseNumber: 2,
    title: "Split-Amount Micro-Structuring (Smurfing)",
    category: "Threshold Evasion",
    severity: "High",
    inputs: {
      recipient: "gaming_pass_drop99@ybl",
      amount: 1950,
      timeStr: "02:15 PM",
      isNewDevice: false,
      isNewRecipient: true,
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "Scammer instructs victim to send ₹1,950 five consecutive times instead of ₹9,750 all at once, flying right under single-transaction anomaly thresholds (₹2,000 / ₹5,000 limits).",
    engineBlindSpot: "Stateless heuristic evaluators score each transaction in isolation without cross-transaction rolling velocity counters or burst aggregators.",
    countermeasure: "Sliding-window cumulative velocity tracker across 60 minutes that flags rapid repeat disbursements to newly added VPAs.",
    predictedRiskScore: 28,
    limitationCategory: "Micro-Structuring",
    realWorldImpact: "Telegram task job syndicates systematically instruct participants to pay in ₹1,800 - ₹1,990 increments to evade bank high-value fraud rules."
  },
  {
    id: "case_3_hijacked_reputable_vpa",
    caseNumber: 3,
    title: "Compromised Reputable Merchant VPA (SIM Swap Hijack)",
    category: "Account Takeover",
    severity: "High",
    inputs: {
      recipient: "sharma.grocery.delhi@okhdfcbank",
      amount: 12500,
      timeStr: "04:30 PM",
      isNewDevice: false,
      isNewRecipient: false, // User shopped there last year!
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "The merchant's UPI handle has 3 years of authentic transaction history. However, criminals hijacked the merchant's SIM card 2 hours ago to cash out illicit funds.",
    engineBlindSpot: "Reputation engines overly trust historical age and past zero-complaint ratios, failing to catch instantaneous beneficiary account takeovers.",
    countermeasure: "Inbound velocity spike alerts & NPCI Central Identity Ledger sync flagging SIM-swap events within the last 48 hours.",
    predictedRiskScore: 22,
    limitationCategory: "Identity Hijack",
    realWorldImpact: "Fraudsters compromise dormant merchant VPAs to launder mule proceeds under the cover of established merchant trust scores."
  },
  {
    id: "case_4_atm_qr_cardless_cashout",
    caseNumber: 4,
    title: "Instant ATM QR Cardless Withdrawal Trap",
    category: "Physical Cashout Zero-Trace",
    severity: "Critical",
    inputs: {
      recipient: "nfs.atm.cashout@npci",
      amount: 10000,
      timeStr: "07:45 PM",
      isNewDevice: false,
      isNewRecipient: true,
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "Victim is tricked into scanning an ATM screen QR to 'receive payment'. The moment they authorize, physical cash is dispensed into the scammer's hand standing at the ATM machine.",
    engineBlindSpot: "Because cash physically leaves the ATM instantly, there is zero bank-to-bank settlement holding time, rendering the 1930 NCRP Golden Hour recovery window obsolete.",
    countermeasure: "Explicit ATM Cash-Withdrawal MCC (6011) warning: 'WARNING: You are authorizing PHYSICAL CASH DISPENSING at an ATM, NOT sending money to a person!'",
    predictedRiskScore: 35,
    limitationCategory: "Physical Cashout",
    realWorldImpact: "Interoperable Cardless Cash Withdrawal (ICCW) QR codes are increasingly exploited by scammers convincing victims that scanning releases funds to them."
  },
  {
    id: "case_5_server_side_redirect_qr",
    caseNumber: 5,
    title: "Server-Side Dynamic 302 Redirection QR Quishing",
    category: "Payload Camouflage",
    severity: "High",
    inputs: {
      recipient: "menu_table4@cafe",
      amount: 850,
      timeStr: "01:20 PM",
      isNewDevice: false,
      isNewRecipient: true,
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "A printed QR sticker encodes `https://safe-menu-cafe.in/pay`, which appears legitimate to static client QR regex checkers. When scanned, the remote web server returns an HTTP 302 redirecting to a rogue mule UPI address.",
    engineBlindSpot: "Static QR decoders only parse the initial URI string and cannot inspect deferred server-side redirects without a sandboxed HTTP resolver.",
    countermeasure: "Client-side headless URL pre-flight inspection and domain certificate pinning before handing off to the UPI intent router.",
    predictedRiskScore: 18,
    limitationCategory: "Dynamic Redirect",
    realWorldImpact: "Restaurant table QR codes swapped with dynamic shortlinks redirecting diners to fraudulent UPI payees after initial validation."
  },
  {
    id: "case_6_unicode_homoglyph_spoofing",
    caseNumber: 6,
    title: "Zero-Day Homoglyph & Punycode VPA Spoofing",
    category: "Brand Impersonation",
    severity: "Medium",
    inputs: {
      recipient: "amazоn.pay.refund@icici", // Note: The second 'о' is Cyrillic small letter U+043E, not Latin 'o'!
      amount: 4800,
      timeStr: "08:10 PM",
      isNewDevice: false,
      isNewRecipient: true,
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "To the victim's naked eye, the handle looks identically like 'amazon.pay.refund'. Because it uses a Unicode homoglyph, standard exact-match keyword blacklists fail to flag it.",
    engineBlindSpot: "ASCII-only regex pattern matchers treat Unicode homoglyphs as distinct character code points, missing the spoofed brand name.",
    countermeasure: "Unicode NFKC normalization and skeleton-based visual confusable mapping before matching against trusted brand directories.",
    predictedRiskScore: 38,
    limitationCategory: "Character Homoglyph",
    realWorldImpact: "Lookalike VPAs imitating Amazon, Flipkart, electricity boards, and Telecom support handles deceive unsuspecting consumers."
  },
  {
    id: "case_7_silent_accessibility_spyware",
    caseNumber: 7,
    title: "Covert Android Accessibility Service Overlay (No Phone Call)",
    category: "Malware / Keylogger",
    severity: "Critical",
    inputs: {
      recipient: "unknown_merchant@ybl",
      amount: 14000,
      timeStr: "03:40 AM",
      isNewDevice: true,
      isNewRecipient: true,
      activeCall: false, // Spyware uses Android Accessibility permissions, NOT an active phone call!
      isCollectRequest: false
    },
    whyItFails: "Victim downloaded a rogue 'Electricity Bill APK' 5 days ago that gained Android Accessibility permissions. It silently records user keystrokes and injects clicks without initiating a phone call.",
    engineBlindSpot: "Telephony managers only check `TelephonyManager.CALL_STATE_OFFHOOK`. When malware operates silently via background accessibility events, the call sensor reports idle.",
    countermeasure: "Android `AccessibilityManager` active listener audit + enforcing `FLAG_SECURE` on PIN entry views to block overlay clickjacking.",
    predictedRiskScore: 49,
    limitationCategory: "Kernel/OS Spyware",
    realWorldImpact: "Trojanized APKs disguised as PM-Kisan subsidies or electricity updates silently siphon credentials in the background."
  },
  {
    id: "case_8_audio_soundbox_spoofing",
    caseNumber: 8,
    title: "Acoustic Merchant Soundbox Replay Attack",
    category: "Merchant Side Vulnerability",
    severity: "High",
    inputs: {
      recipient: "tea_stall_dharavi@paytm",
      amount: 500,
      timeStr: "10:15 AM",
      isNewDevice: false,
      isNewRecipient: false,
      activeCall: false,
      isCollectRequest: false
    },
    whyItFails: "Customer plays a pre-recorded '₹500 received on Paytm' MP3 from their phone speaker. Merchant relies exclusively on acoustic confirmation and hands over goods, but no money ever moves.",
    engineBlindSpot: "Client-side buyer security app assesses the transaction as 100% normal/safe since no fraudulent UPI intent was triggered from the client device.",
    countermeasure: "Encrypted acoustic watermarking, merchant-side Bluetooth push verification, and dual-display POS confirmation.",
    predictedRiskScore: 10,
    limitationCategory: "Audio Spoofing",
    realWorldImpact: "Street vendors across urban centers suffer cumulative daily losses from rogue buyers playing soundbox audio clips."
  }
];

export interface SystemLimitation {
  id: string;
  name: string;
  category: string;
  severity: "Inherent" | "Architectural" | "Regulatory";
  description: string;
  technicalReason: string;
  mitigationStrategy: string;
}

export const SYSTEMIC_LIMITATIONS: SystemLimitation[] = [
  {
    id: "lim_1",
    name: "Off-Device Psychological Coercion Horizon",
    category: "Sensory Boundary",
    severity: "Inherent",
    description: "Security engines running on the mobile phone cannot detect external laptop calls, physical threats in the room, or secondary phone audio.",
    technicalReason: "App sandboxing strictly isolates telemetry to the host device. Without cross-device ambient sensors, coercive threats remain out-of-band.",
    mitigationStrategy: "Heuristic pattern triggers (sudden uncharacteristic liquidations to newly minted government VPAs) with compulsory cooling delays."
  },
  {
    id: "lim_2",
    name: "Zero-Trace Instant ATM Physical Cashouts",
    category: "Settlement Timing",
    severity: "Architectural",
    description: "Once cash leaves an ATM via ICCW QR code, bank-to-bank freeze mechanisms (like NCRP 1930 Golden Hour) are incapable of clawing back the funds.",
    technicalReason: "Digital ledgers end when physical currency notes dispense. Cash possesses zero programmatic callbacks or reversible state.",
    mitigationStrategy: "Hard visual MCC warnings on ATM QRs with distinct biometric secondary confirmation step before cash release."
  },
  {
    id: "lim_3",
    name: "Reputation Delay & Dormant Mule Hijack",
    category: "Reputation Asymmetry",
    severity: "Architectural",
    description: "A dormant account with a 5-year clean credit history that is purchased or SIM-swapped looks completely trusted until the first victim files a report.",
    technicalReason: "Historical reputation metrics look backward. There is an inevitable latency (minutes to hours) between account takeover and community complaint indexing.",
    mitigationStrategy: "Real-time Telco SIM-swap signal feeds integrated into UPI PSP authorization flows (RBI 48-hour SIM-swap cooling guidelines)."
  },
  {
    id: "lim_4",
    name: "OS Kernel & Accessibility Service Dominance",
    category: "Privilege Escalation",
    severity: "Architectural",
    description: "If malicious software achieves Android Accessibility or root access, it operates with higher OS privileges than standard sandboxed banking apps.",
    technicalReason: "Android Accessibility services have system-level rights to inspect screen contents and dispatch synthesized touch inputs.",
    mitigationStrategy: "Refusal to operate if unknown Accessibility services are active; Hardware Enclave / Secure Element PIN entry."
  },
  {
    id: "lim_5",
    name: "Temporal Micro-Smurfing Across Distributed Mules",
    category: "Threshold Evasion",
    severity: "Architectural",
    description: "Syndicates split ₹5,00,000 into 250 micro-payments across 50 distinct mule accounts, keeping every transaction below individual anomaly detectors.",
    technicalReason: "Client devices lack distributed global visibility over other victims' contemporaneous transactions without a real-time central graph database.",
    mitigationStrategy: "Central NPCI cross-bank graph analytics computing inbound velocity clusters in real-time."
  },
  {
    id: "lim_6",
    name: "Static QR vs Server-Side Dynamic Intent Redirection",
    category: "Vector Camouflage",
    severity: "Architectural",
    description: "QR codes pointing to innocent-looking URL redirects cannot be accurately judged by static regex analysis alone.",
    technicalReason: "The server response can be altered dynamically based on the scanning user's IP, user-agent, or time of day.",
    mitigationStrategy: "Headless sandbox URL pre-fetching with deep domain certificate inspection prior to launching payment intents."
  },
  {
    id: "lim_7",
    name: "Offline UPI (UPI Lite / 123PAY) Telemetry Absence",
    category: "Connectivity Constraint",
    severity: "Regulatory",
    description: "Offline or feature-phone transactions proceed without continuous cloud ML scoring, relying entirely on limited offline heuristic rules.",
    technicalReason: "Local ledger synchronization is asynchronous; threat telemetry cannot query real-time blacklists while offline.",
    mitigationStrategy: "Strict daily wallet caps (e.g. ₹2,000) and mandatory periodic cloud reconcile pulses before wallet replenishment."
  }
];

interface PaymentSecurityStatusGaugeProps {
  score: number; // 0 - 100
  riskLevel: "low" | "medium" | "high";
  amount: number;
  recipient: string;
  timeStr?: string;
  isNewDevice?: boolean;
  isNewRecipient?: boolean;
  activePhoneCall?: boolean;
  isCollectRequest?: boolean;
  matchedMuleEntry?: boolean;
  onApplyPreset?: (inputs: {
    amount: number;
    recipient: string;
    timeStr: string;
    isNewDevice: boolean;
    isNewRecipient: boolean;
    activeCall: boolean;
    isCollectRequest: boolean;
  }) => void;
  className?: string;
}

export const PaymentSecurityStatusGauge: React.FC<PaymentSecurityStatusGaugeProps> = ({
  score,
  riskLevel,
  amount,
  recipient,
  timeStr = "02:00 AM",
  isNewDevice = false,
  isNewRecipient = false,
  activePhoneCall = false,
  isCollectRequest = false,
  matchedMuleEntry = false,
  onApplyPreset,
  className = ""
}) => {
  const [activeTemplate, setActiveTemplate] = useState<SafetyTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<"gauge" | "templates" | "failures" | "limitations">("gauge");
  const [selectedTestCase, setSelectedTestCase] = useState<FailureTestCase | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(score);
  const [expandedLimitations, setExpandedLimitations] = useState<Record<string, boolean>>({});

  // Smooth numerical count animation using requestAnimationFrame
  const animationRef = useRef<number | null>(null);
  useEffect(() => {
    const startValue = animatedScore;
    const endValue = score;
    if (startValue === endValue) return;

    const duration = 650; // ms
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);
      setAnimatedScore(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateNumber);
      }
    };

    animationRef.current = requestAnimationFrame(animateNumber);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [score]);

  // Smooth needle angle calculation:
  // Score 0 -> -75 deg, Score 50 -> 0 deg, Score 100 -> +75 deg
  const targetNeedleAngle = useMemo(() => {
    const clamped = Math.max(0, Math.min(100, score));
    return -75 + (clamped / 100) * 150;
  }, [score]);

  // SVG semicircle arc calculations (Radius = 75, Center = 100, 105)
  // Total arc perimeter = Math.PI * 75 ≈ 235.6
  const arcLength = 235.6;
  const strokeDashoffset = useMemo(() => {
    const clamped = Math.max(0, Math.min(100, score));
    return arcLength - (clamped / 100) * arcLength;
  }, [score]);

  // Dynamic theme colors and status configurations
  const theme = useMemo(() => {
    if (riskLevel === "low") {
      return {
        stroke: "#10b981", // Emerald 500
        bgGradient: "from-emerald-950/80 via-slate-900 to-emerald-950/80",
        borderColor: "border-emerald-500/40",
        textColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
        title: "Verified Safe · Low Risk",
        desc: "All real-time telemetry passed. Payee identity and spending velocity match your normal baseline."
      };
    }
    if (riskLevel === "medium") {
      return {
        stroke: "#f59e0b", // Amber 500
        bgGradient: "from-amber-950/80 via-slate-900 to-amber-950/80",
        borderColor: "border-amber-500/40",
        textColor: "text-amber-400",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]",
        title: "Caution · Elevated Risk",
        desc: "Unusual spend velocity, late-night transfer, or first-time recipient detected. Extra verification advised."
      };
    }
    return {
      stroke: "#f43f5e", // Rose 500
      bgGradient: "from-rose-950/85 via-slate-900 to-rose-950/85",
      borderColor: "border-rose-500/50",
      textColor: "text-rose-400",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      glow: "shadow-[0_0_30px_rgba(244,63,94,0.35)]",
      title: "Critical Alert · High Risk Blocked",
      desc: "Emergency trigger intercepted! Active coercion, reverse collect trap, or blacklisted VPA pattern detected."
    };
  }, [riskLevel]);

  // Derived explainability signals
  const activeSignals = useMemo(() => {
    const list: { label: string; type: "risk" | "safe"; impact: string }[] = [];
    if (activePhoneCall) list.push({ label: "Active Phone Call (Vishing Threat)", type: "risk", impact: "+48" });
    if (isCollectRequest) list.push({ label: "Reverse Collect Request Trap", type: "risk", impact: "+45" });
    if (matchedMuleEntry) list.push({ label: "Matched 1930 NCRP Blacklist", type: "risk", impact: "+50" });
    if (amount >= 8000) list.push({ label: `Unusual Spike ₹${amount.toLocaleString("en-IN")}`, type: "risk", impact: "+28" });
    if (isNewDevice) list.push({ label: "Unfamiliar Hardware Fingerprint", type: "risk", impact: "+22" });
    if (isNewRecipient) list.push({ label: "First-time Beneficiary", type: "risk", impact: "+12" });
    if (recipient.toLowerCase().includes("support") || recipient.toLowerCase().includes("refund")) {
      list.push({ label: "Scam Keyword Pattern in VPA", type: "risk", impact: "+35" });
    }
    if (list.length === 0) {
      list.push({ label: "Trusted Beneficiary Baseline", type: "safe", impact: "-25" });
      list.push({ label: "Registered Device Hardware Match", type: "safe", impact: "-15" });
      list.push({ label: "Regular Everyday Spend Window", type: "safe", impact: "-12" });
    }
    return list;
  }, [activePhoneCall, isCollectRequest, matchedMuleEntry, amount, isNewDevice, isNewRecipient, recipient]);

  const handleCopySummary = () => {
    const summary = [
      `🛡️ SafeUPI Payment Security Status Assessment`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Verdict: ${theme.title}`,
      `• Risk Score: ${score}/100 (Trust Confidence: ${100 - score}%)`,
      `• Recipient VPA: ${recipient || "N/A"}`,
      `• Amount: ₹${amount.toLocaleString("en-IN")}`,
      `• Active Telemetry: ${activeSignals.map(s => s.label).join(", ")}`,
      `• Verified with Zero-PII Client-Edge Defense Engine`
    ].join("\n");

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleApplyTemplate = (tmpl: SafetyTemplate) => {
    setActiveTemplate(tmpl);
    if (onApplyPreset) {
      onApplyPreset({
        amount: Math.min(amount || 1500, tmpl.maxAmount),
        recipient: tmpl.id === "zero_trust_olx" ? "olx_buyer_army@axis" : recipient || "merchant.store@upi",
        timeStr: tmpl.lateNightStrict ? "01:30 AM" : "02:00 PM",
        isNewDevice: false,
        isNewRecipient: tmpl.blockNewBeneficiary,
        activeCall: tmpl.blockCalls,
        isCollectRequest: tmpl.id === "zero_trust_olx"
      });
    }
  };

  const handleLoadTestCase = (tc: FailureTestCase) => {
    setSelectedTestCase(tc);
    setActiveTab("gauge");
    if (onApplyPreset) {
      onApplyPreset({
        amount: tc.inputs.amount,
        recipient: tc.inputs.recipient,
        timeStr: tc.inputs.timeStr,
        isNewDevice: tc.inputs.isNewDevice,
        isNewRecipient: tc.inputs.isNewRecipient,
        activeCall: tc.inputs.activeCall,
        isCollectRequest: tc.inputs.isCollectRequest
      });
    }
  };

  const toggleLimitation = (id: string) => {
    setExpandedLimitations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* Tab Switcher: Gauge vs Safety Templates vs 8 Failure Tests vs Architectural Limitations */}
      <div className="flex items-center justify-between gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("gauge")}
          className={`relative flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === "gauge"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Security Gauge</span>
          {activeTab === "gauge" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-xl bg-slate-800 -z-10 border border-cyan-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`relative flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === "templates"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Safety Templates ({SAFETY_TEMPLATES.length})</span>
          {activeTab === "templates" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-xl bg-slate-800 -z-10 border border-purple-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("failures")}
          className={`relative flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === "failures"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          <span>Failure Tests ({FAILURE_TEST_CASES.length})</span>
          {activeTab === "failures" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-xl bg-slate-800 -z-10 border border-amber-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("limitations")}
          className={`relative flex-1 py-1.5 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === "limitations"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileWarning className="w-3.5 h-3.5 text-rose-400" />
          <span>Limitations ({SYSTEMIC_LIMITATIONS.length})</span>
          {activeTab === "limitations" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 rounded-xl bg-slate-800 -z-10 border border-rose-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: DYNAMIC ANIMATED SECURITY GAUGE */}
        {activeTab === "gauge" && (
          <motion.div
            key="gauge"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`p-4 sm:p-5 rounded-3xl border bg-gradient-to-r ${theme.bgGradient} ${theme.borderColor} ${theme.glow} transition-all duration-700 ease-out shadow-lg text-white space-y-4`}
          >
            {/* Top Bar with Title, Risk Pill and Share Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  animate={{ 
                    scale: riskLevel === "high" ? [1, 1.08, 1] : 1,
                    rotate: riskLevel === "high" ? [0, -3, 3, 0] : 0
                  }}
                  transition={{ 
                    repeat: riskLevel === "high" ? Infinity : 0, 
                    duration: 1.8 
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors duration-500 ${
                    riskLevel === "low" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : riskLevel === "medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  }`}
                >
                  {riskLevel === "low" ? <ShieldCheck className="w-5 h-5" /> : riskLevel === "medium" ? <HelpCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Payment Security Status
                    </h3>
                    <motion.span 
                      key={theme.title}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all duration-500 ${theme.badgeBg}`}
                    >
                      {theme.title}
                    </motion.span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    {theme.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Copy assessment summary"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedSummary ? "Copied" : "Share"}</span>
                </button>
                <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-center font-mono">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Trust</span>
                  <span className="text-xs font-black text-white">{Math.max(1, 100 - animatedScore)}%</span>
                </div>
              </div>
            </div>

            {/* Speedometer Radial Gauge Graphic with Framer Motion Spring & Custom Easing */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-1">
              
              {/* SVG Arc Speedometer */}
              <div className="relative w-52 h-32 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="securityGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                    <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Background Arc Track */}
                  <path
                    d="M 25 105 A 75 75 0 0 1 175 105"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />

                  {/* Animated Foreground Arc */}
                  <motion.path
                    d="M 25 105 A 75 75 0 0 1 175 105"
                    fill="none"
                    stroke={theme.stroke}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    animate={{
                      strokeDashoffset: strokeDashoffset,
                      stroke: theme.stroke
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 18,
                      mass: 0.8
                    }}
                    filter="url(#gaugeGlow)"
                  />

                  {/* Smooth Animated Needle Indicator with Spring Physics */}
                  <motion.g 
                    animate={{
                      rotate: targetNeedleAngle
                    }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 110,
                      damping: 14,
                      mass: 0.7
                    }}
                    style={{
                      transformOrigin: "100px 105px"
                    }}
                  >
                    <polygon points="100,33 96.5,105 103.5,105" fill="#ffffff" filter="drop-shadow(0 0 3px rgba(0,0,0,0.8))" />
                    <circle cx="100" cy="105" r="7" fill="#0f172a" stroke={theme.stroke} strokeWidth="2.5" />
                    <circle cx="100" cy="105" r="3" fill="#ffffff" />
                  </motion.g>
                </svg>

                {/* Centered Numerical Readout with smooth number interpolation */}
                <div className="absolute bottom-0 text-center flex flex-col items-center">
                  <motion.span 
                    key={riskLevel}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black font-mono tracking-tight transition-colors duration-500"
                    style={{ color: theme.stroke }}
                  >
                    {animatedScore}
                  </motion.span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 -mt-1 tracking-wider">
                    / 100 Risk Score
                  </span>
                </div>
              </div>

              {/* Gauge Range Scale & Live Signals Breakdown */}
              <div className="flex-1 w-full space-y-2.5">
                {/* Range Track with Spring Indicator */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      0 - 30 Safe
                    </span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      31 - 70 Caution
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      71 - 100 Block
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800/90 overflow-hidden relative p-0.5 border border-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{
                        width: `${Math.max(5, animatedScore)}%`,
                        backgroundColor: theme.stroke,
                        boxShadow: `0 0 12px ${theme.stroke}`
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18
                      }}
                    />
                  </div>
                </div>

                {/* Real-time Contributing Signal Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Active Telemetry Signals:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {activeSignals.map((sig, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all duration-300 flex items-center gap-1 ${
                          sig.type === "risk"
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        <span>{sig.label}</span>
                        <strong className="font-mono text-[9px] opacity-80">({sig.impact})</strong>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Quick Simulation Level Switches for live smooth testing */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-[10px]">
                  <span className="text-slate-400 font-bold">Quick Risk Presets:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onApplyPreset?.({
                        amount: 450,
                        recipient: "grocery.mart@hdfcbank",
                        timeStr: "02:00 PM",
                        isNewDevice: false,
                        isNewRecipient: false,
                        activeCall: false,
                        isCollectRequest: false
                      })}
                      className="px-2 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      Safe (₹450)
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyPreset?.({
                        amount: 9500,
                        recipient: "new.seller@icici",
                        timeStr: "01:30 AM",
                        isNewDevice: false,
                        isNewRecipient: true,
                        activeCall: false,
                        isCollectRequest: false
                      })}
                      className="px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 transition-all cursor-pointer"
                    >
                      Caution (₹9.5k)
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyPreset?.({
                        amount: 35000,
                        recipient: "refund.desk99@axis",
                        timeStr: "03:15 AM",
                        isNewDevice: true,
                        isNewRecipient: true,
                        activeCall: true,
                        isCollectRequest: true
                      })}
                      className="px-2 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/30 transition-all cursor-pointer"
                    >
                      Critical (Scam)
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: SAFETY TEMPLATES SELECTION (8 COMPREHENSIVE TEMPLATES) */}
        {activeTab === "templates" && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-3xl border border-slate-800 bg-slate-900/95 space-y-3.5 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Pre-Configured Safety Guardrail Templates
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Activate persona-specific risk thresholds and automatic interception policies for diverse profiles.
                </p>
              </div>
              {activeTemplate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono self-start sm:self-auto">
                  Active Guard: {activeTemplate.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAFETY_TEMPLATES.map((tmpl) => {
                const isSelected = activeTemplate?.id === tmpl.id;
                return (
                  <motion.div
                    key={tmpl.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 hover:border-purple-400/60 ${
                      isSelected
                        ? `bg-gradient-to-br ${tmpl.color} ring-1 ring-purple-400 shadow-md`
                        : "bg-slate-850/80 hover:bg-slate-800 border-slate-750 text-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{tmpl.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="text-xs font-bold text-white">{tmpl.name}</h5>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {tmpl.badge}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 mt-0.5 inline-block">
                            Cap: ₹{tmpl.maxAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs shadow-xs font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-400 hover:text-purple-300">
                          Apply →
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {tmpl.description}
                    </p>

                    <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 text-[10px] text-slate-400">
                      <strong className="text-slate-300 block mb-0.5">Best for:</strong>
                      {tmpl.recommendation}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-white/10">
                      <span>Call block: <strong className={tmpl.blockCalls ? "text-emerald-400" : "text-slate-400"}>{tmpl.blockCalls ? "YES" : "NO"}</strong></span>
                      <span>•</span>
                      <span>Guardian 2FA: <strong className={tmpl.enforceGuardian ? "text-purple-300" : "text-slate-400"}>{tmpl.enforceGuardian ? "YES" : "NO"}</strong></span>
                      <span>•</span>
                      <span>Late night rule: <strong className={tmpl.lateNightStrict ? "text-amber-300" : "text-slate-400"}>{tmpl.lateNightStrict ? "ACTIVE" : "OFF"}</strong></span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: FAILURE MODES & 8 RIGOROUS TEST CASES */}
        {activeTab === "failures" && (
          <motion.div
            key="failures"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-3xl border border-amber-500/40 bg-slate-900/95 space-y-4 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-amber-400" />
                  Security Engine Failure Modes & Blind-Spot Test Lab
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Realistic test cases showing exactly where static rules, telephony listeners, and client ML classifiers fail.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold self-start sm:self-auto">
                {FAILURE_TEST_CASES.length} Evasion Scenarios
              </span>
            </div>

            <div className="space-y-3">
              {FAILURE_TEST_CASES.map((tc) => {
                const isSelected = selectedTestCase?.id === tc.id;
                return (
                  <div
                    key={tc.id}
                    className={`p-3.5 rounded-2xl border transition-all text-left space-y-2.5 ${
                      isSelected
                        ? "bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-400/40"
                        : "bg-slate-850/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-black flex items-center justify-center border border-amber-500/30 shrink-0">
                          {tc.caseNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-bold text-white">
                              {tc.title}
                            </h5>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              tc.severity === "Critical" 
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}>
                              {tc.severity} Risk
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {tc.limitationCategory}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{tc.category}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLoadTestCase(tc)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>Inject into Live Gauge & Test</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <strong className="text-rose-400 block text-[11px] font-bold flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5" />
                          Why the Detection Engine Fails (Evasion):
                        </strong>
                        <p className="text-[11px] text-slate-300 leading-snug">{tc.whyItFails}</p>
                        <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                          <strong className="text-amber-300">Engine Blind Spot:</strong> {tc.engineBlindSpot}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <strong className="text-emerald-400 block text-[11px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Required Architectural Countermeasure:
                        </strong>
                        <p className="text-[11px] text-slate-300 leading-snug">{tc.countermeasure}</p>
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-rose-300 font-mono">
                            Naive score bypass: <strong>{tc.predictedRiskScore}/100 (False Safe)</strong>
                          </span>
                          <span className="text-slate-400 font-medium italic">
                            Status: Documented Blind Spot
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Real World Impact Note */}
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/90 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>Real-World Threat Pattern:</strong> {tc.realWorldImpact}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 4: SYSTEMIC ARCHITECTURAL LIMITATIONS REPORT */}
        {activeTab === "limitations" && (
          <motion.div
            key="limitations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-3xl border border-rose-500/40 bg-slate-900/95 space-y-4 shadow-lg text-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldX className="w-4 h-4 text-rose-400" />
                  Fundamental Systemic Limitations & Threat Boundaries
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formal security boundaries where client-side UPI applications cannot guarantee defense without bank-side or hardware intervention.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold self-start sm:self-auto">
                7 Core Threat Horizons
              </span>
            </div>

            <div className="space-y-3">
              {SYSTEMIC_LIMITATIONS.map((lim, index) => {
                const isExpanded = !!expandedLimitations[lim.id];
                return (
                  <div
                    key={lim.id}
                    className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div 
                      onClick={() => toggleLimitation(lim.id)}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-xs font-black flex items-center justify-center border border-rose-500/30 shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{lim.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              lim.severity === "Inherent" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : lim.severity === "Architectural" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            }`}>
                              {lim.severity} Constraint
                            </span>
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">{lim.category}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {lim.description}
                    </p>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs"
                        >
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-rose-300 block text-[10px] font-mono uppercase">
                              Technical Root Cause:
                            </strong>
                            <p className="text-[11px] text-slate-300 leading-tight">
                              {lim.technicalReason}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <strong className="text-emerald-300 block text-[10px] font-mono uppercase">
                              Mitigation & Defense Strategy:
                            </strong>
                            <p className="text-[11px] text-slate-300 leading-tight">
                              {lim.mitigationStrategy}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
