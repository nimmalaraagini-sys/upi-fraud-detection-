export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  summary: string;
  keyPoints: {
    heading: string;
    description: string;
    iconName?: string;
  }[];
  rbiCitation?: string;
  blockchainContext?: string;
  visualType?: "diagram_mule" | "flow_recovery" | "diagram_blockchain" | "table_liability" | "architecture_ai";
  speakerNotes: string;
  teluguEnglishSpeakerNotes: string;
  teluguSpeakerNotes: string;
  teluguTitle: string;
  teluguSubtitle: string;
  teluguSummary: string;
}

export interface JudgeQuickAnswer {
  tool: string;
  teluguEnglish: string;
  english: string;
  telugu: string;
}

export const JUDGE_QUICK_ANSWERS: JudgeQuickAnswer[] = [
  {
    tool: "React",
    teluguEnglish: "Frontend UI create cheyyadaniki.",
    english: "To build the interactive frontend user interface (Login, Dashboard, Payment & Risk screens).",
    telugu: "యూజర్ ఇంటర్‌ఫేస్ (UI), లాగిన్, డ్యాష్‌బోర్డ్ స్క్రీన్‌లను నిర్మించడానికి."
  },
  {
    tool: "TypeScript",
    teluguEnglish: "Type safety and maintainable code kosam.",
    english: "Provides static type safety, reducing runtime errors and improving code maintainability.",
    telugu: "టైప్ సేఫ్టీ మరియు ఎర్రర్స్ లేని కోడ్ నిర్వహణ కోసం."
  },
  {
    tool: "Vite",
    teluguEnglish: "Fast development and build kosam.",
    english: "Lightning-fast frontend development server and optimized production bundler.",
    telugu: "వేగవంతమైన డెవలప్‌మెంట్ మరియు ప్రొడక్షన్ బిల్డ్ కోసం."
  },
  {
    tool: "TailwindCSS",
    teluguEnglish: "Responsive and modern UI design kosam.",
    english: "For responsive, modern fintech UI styling, clean typography and accessible palettes.",
    telugu: "రెస్పాన్సివ్ మరియు ఆధునిక UI డిజైన్ కోసం."
  },
  {
    tool: "Lucide Icons",
    teluguEnglish: "Icons kosam.",
    english: "Clean, consistent icons for security, warning, payment, and navigation.",
    telugu: "సెక్యూరిటీ మరియు నావిగేషన్ ఐకాన్స్ కోసం."
  },
  {
    tool: "Rule Engine",
    teluguEnglish: "Known suspicious conditions ni quickly detect cheyyadaniki.",
    english: "Deterministic rule engine (45+ checks) to instantly intercept known fraud patterns.",
    telugu: "తెలిసిన అనుమానాస్పద సైబర్ మోసాల నిబంధనలను తక్షణమే గుర్తించడానికి."
  },
  {
    tool: "ML / Risk Engine",
    teluguEnglish: "Risk scoring and suspicious patterns evaluate cheyyadaniki.",
    english: "Multivariate anomaly evaluation and calibrated 0–100 risk scoring.",
    telugu: "రిస్క్ స్కోరింగ్ మరియు అసాధారణ చెల్లింపు విధానాలను విశ్లేషించడానికి."
  },
  {
    tool: "Explainable AI",
    teluguEnglish: "Risk enduku vachindo user ki explain cheyyadaniki.",
    english: "Explains the underlying factors behind risk scores in plain, transparent language.",
    telugu: "రిస్క్ స్కోర్ ఎందుకు వచ్చిందో యూజర్‌కు సరళమైన భాషలో వివరించడానికి."
  },
  {
    tool: "Google Gemini API",
    teluguEnglish: "Forensic report and incident summary generate cheyyadaniki.",
    english: "Generates plain-language forensic incident reports, summaries, and police checklists.",
    telugu: "ఫోరెన్సిక్ రిపోర్ట్ మరియు ఇన్సిడెంట్ సారాంశాన్ని రూపొందించడానికి."
  },
  {
    tool: "1930 / CFCFRMS Workflow",
    teluguEnglish: "Fraud reporting / recovery process ki guide cheyyadaniki.",
    english: "Guides victims through immediate Golden-Hour account freeze protocols and e-FIR filing.",
    telugu: "గోల్డెన్ అవర్ ఫండ్ ఫ్రీజ్ మరియు సైబర్ హెల్ప్‌లైన్ 1930 రికవరీ గైడెన్స్ కోసం."
  },
  {
    tool: "Fund Traceback Simulator",
    teluguEnglish: "Possible money movement ni visual ga demonstrate cheyyadaniki.",
    english: "Demonstrates how stolen funds traverse layered mule accounts toward ATM/crypto off-ramps.",
    telugu: "మ్యూల్ అకౌంట్ల ద్వారా డబ్బు ఎలా కదులుతుందో విజువల్‌గా వివరించడానికి."
  },
  {
    tool: "Database (Judges: 'Where is the database?')",
    teluguEnglish: "Memu database connect cheyyaledu sir. SafeUPI focus pre-payment real-time risk detection, explainability and immediate victim recovery meeda untundi. Client-side zero-latency evaluation and 1930 reporting guidance maa main priority.",
    english: "We did not connect an external persistent database by design. SafeUPI focuses on pre-payment real-time edge risk detection, explainable AI, and golden-hour victim recovery without latency.",
    telugu: "మేము ఉద్దేశపూర్వకంగా ఎక్స్‌టర్నల్ డేటాబేస్ కనెక్ట్ చేయలేదు. పేమెంట్‌కు ముందే జీరో-లేటెన్సీతో రిస్క్ విశ్లేషణ చేయడం, మోసాలను ఆపడం మరియు 1930 రికవరీ గైడెన్స్ అందించడం మా ప్రాధాన్యత."
  }
];

export const FLOW_TO_MEMORIZE = {
  teluguEnglish: "User payment initiate chestadu → SafeUPI transaction details ni check chestundi → Rules and ML risk calculate chestayi → Explainable AI reason chupistundi → Risk high aithe warning istundi → Fraud already jarigite recovery workflow and fund traceback simulation provide chestundi.",
  english: "The user initiates a payment → SafeUPI analyzes the transaction → rules and ML calculate the risk → explainable AI shows the reasons → high-risk transactions trigger a warning → and if fraud has already occurred, the system provides recovery guidance and a fund-trace simulation.",
  telugu: "యూజర్ చెల్లింపు ప్రారంభిస్తారు → సేఫ్‌యూపీఐ లావాదేవీ వివరాలను విశ్లేషిస్తుంది → రూల్స్ & ML రిస్క్‌ను లెక్కిస్తాయి → Explainable AI కారణాలను వివరిస్తుంది → హై-రిస్క్ అయితే హెచ్చరిక ఇస్తుంది → ఇప్పటికే మోసం జరిగితే రికవరీ గైడెన్స్ & ఫండ్ ట్రేస్ సిమ్యులేషన్ అందిస్తుంది."
};

export const PROBLEM_STATEMENT_DATA = {
  english: "UPI has made digital payments fast, convenient and accessible, but this speed is also being exploited by cyber fraudsters. Users can be targeted through fake collect requests, tampered QR codes, remote-access attacks and account-takeover techniques. The major problem is that many existing approaches focus on detecting fraud after the transaction has already happened. Once money is transferred, tracing and recovery can become difficult. Therefore, our problem is to develop a system that can analyze a UPI transaction before payment, identify suspicious signals, provide a clear risk score and explanation, warn the user before a high-risk transaction, and guide the victim through the recovery and reporting process if fraud has already occurred.",
  teluguEnglish: "UPI valla digital payments chala fast, easy and convenient ayyayi. Kani ade speed ni cyber fraudsters misuse chestunnaru. Fake collect requests, tampered QR codes, remote-access attacks, SIM swap and account takeover lanti methods dwara users ni target chestunnaru. Main problem enti ante, fraud jarigina tarvata detect chesthe money already transfer ayipoyi untundi. Appudu money ni trace cheyyadam and recovery process difficult avvachu. Kabatti maa problem statement enti ante, payment complete avvakamunde UPI transaction ni analyze chesi suspicious signals ni identify cheyyali, risk score and reason user ki explain cheyyali, high-risk transaction aithe warning ivvali, and fraud already jarigite reporting and recovery process lo user ki guidance ivvali.",
  telugu: "యూపీఐ ద్వారా డిజిటల్ చెల్లింపులు చాలా వేగంగా మరియు సులభంగా మారాయి. కానీ ఇదే వేగాన్ని సైబర్ నేరగాళ్లు దుర్వినియోగం చేస్తున్నారు. ఫేక్ కలెక్ట్ రిక్వెస్ట్‌లు, ట్యాంపర్ చేసిన క్యూఆర్ కోడ్‌లు, రిమోట్ యాక్సెస్ యాప్‌లు (AnyDesk/TeamViewer), మరియు సిమ్ స్వాప్ ద్వారా ప్రజలను మోసం చేస్తున్నారు. ప్రధాన సమస్య ఏమిటంటే: మోసం జరిగిన తర్వాత గుర్తించడం వల్ల డబ్బు ఇప్పటికే బదిలీ అయిపోతుంది. రికవరీ చేయడం చాలా కష్టమవుతుంది. కాబట్టి మా ప్రాజెక్ట్ పరిష్కారం: చెల్లింపు చేయడానికి ముందే అనుమానాస్పద సంకేతాలను గుర్తించి, రిస్క్ స్కోర్ మరియు కారణాలను యూజర్‌కు వివరించి, హై-రిస్క్ లావాదేవీలను నిరోధించడం, మరియు మోసం జరిగితే 1930 రికవరీ ప్రక్రియలో సహాయపడటం.",
  oneLineEnglish: "How can we detect and explain UPI fraud before payment, prevent high-risk transactions, and guide users toward recovery after fraud?",
  oneLineTeluguEnglish: "Payment mundu UPI fraud ni detect and explain chesi, high-risk transactions ni prevent cheyyadam, fraud jarigite recovery ki guide cheyyadam ela possible?",
  oneLineTelugu: "చెల్లింపుకు ముందే యూపీఐ మోసాన్ని గుర్తించి వివరించడం, హై-రిస్క్ లావాదేవీలను ఆపడం, మరియు మోసం జరిగితే రికవరీకి మార్గనిర్దేశం చేయడం ఎలా?"
};

export interface SafeUpiLayer {
  number: number;
  name: string;
  teluguName: string;
  color: string;
  headline: string;
  teluguHeadline: string;
  components: string[];
  responsibilities: string;
  teluguResponsibilities: string;
  securityGuarantee: string;
}

export const SAFEUPI_5_LAYERS: SafeUpiLayer[] = [
  {
    number: 1,
    name: "USER & IDENTITY LAYER",
    teluguName: "యూజర్ & గుర్తింపు విభాగం",
    color: "from-blue-600 to-cyan-500",
    headline: "Account Creation, Mobile OTP, Linked Bank Metadata & Device Trust",
    teluguHeadline: "ఖాతా నమోదు, మొబైల్ OTP, బ్యాంక్ లింకింగ్ & డివైస్ సెక్యూరిటీ",
    components: [
      "Mobile OTP Verification",
      "Linked Bank Account Metadata",
      "UPI ID Registration",
      "Hardware Device Keystore Binding",
      "Personal Safety Score (92/100)",
      "Family & Senior Citizen Mode"
    ],
    responsibilities: "Establishes verified user identity and behavioral spending baselines without ever storing sensitive credentials (No UPI PIN, ATM PIN, CVV, or passwords stored).",
    teluguResponsibilities: "సున్నితమైన బ్యాంకింగ్ పిన్లు (UPI PIN, CVV) నిల్వ చేయకుండా యూజర్ గుర్తింపు మరియు సురక్షిత డివైస్ బైండింగ్ చేస్తుంది.",
    securityGuarantee: "Zero Sensitive Credentials: Only non-sensitive metadata (VPA, bank handle, device token) is handled."
  },
  {
    number: 2,
    name: "SAFEUPI APP & PAYMENT SERVICES",
    teluguName: "సేఫ్‌యూపీఐ యాప్ & చెల్లింపు సేవలు",
    color: "from-indigo-600 to-purple-600",
    headline: "Send, Scan QR, Receive, Check Payee, Bills & Money Management",
    teluguHeadline: "డబ్బు పంపడం, క్యూఆర్ స్కాన్, బిల్లులు & మనీ మేనేజ్‌మెంట్",
    components: [
      "Send Money & Direct VPA Transfer",
      "Dynamic QR Scanner with Recipient Verification",
      "Inbound Collect Request Trap Protection",
      "Bills, Utilities & AutoPay Mandates",
      "Spending Dashboard & Categorized Analytics",
      "Multilingual Voice Assistant ('Pay ₹500 to Ravi')"
    ],
    responsibilities: "Provides a frictionless digital payment interface wrapped inside an active security envelope that captures transaction intent before dispatch.",
    teluguResponsibilities: "చెల్లింపు జరిగే ముందే లావాదేవీ వివరాలను సేకరించి సెక్యూరిటీ ఇంజిన్‌కు పంపుతుంది.",
    securityGuarantee: "Transaction Interception: Every payment draft is paused for security analysis before PIN prompt."
  },
  {
    number: 3,
    name: "FRAUD / AI SECURITY ENGINE",
    teluguName: "ఫ్రాడ్ / AI సెక్యూరిటీ ఇంజిన్ (హృదయం)",
    color: "from-rose-600 to-amber-600",
    headline: "Dual Engine: 45+ Deterministic Rules + ML Anomaly Model + Explainable AI",
    teluguHeadline: "రూల్ ఇంజిన్ + మెషిన్ లెర్నింగ్ + ఎక్స్‌ప్లెయినబుల్ AI",
    components: [
      "Deterministic Rule Engine (45+ checks, e.g. New Payee +20, Unusual Amount +20, Rapid Txn +15)",
      "ML Statistical Anomaly Model (0–100 behavioral scoring based on tabular features)",
      "Combined Risk Score: (0.70 × ML) + (0.30 × Rules)",
      "Explainable AI (XAI) Waterfall: SHAP-style breakdown explaining WHY",
      "AI Money Guardian (Gemini): Natural language translation of risk signals",
      "Screenshot OCR Scam Analyzer & Scam SMS/Message Checker"
    ],
    responsibilities: "Computes calibrated risk scores in <18ms on client edge. Decides risk (Rules + ML) and explains risk (AI Guardian) before asking user to Decide (Cancel / Review / Continue).",
    teluguResponsibilities: "లావాదేవీ ప్రమాదకరమో కాదో <18ms లో లెక్కించి, యూజర్‌కు సరళమైన భాషలో కారణాలను వివరిస్తుంది.",
    securityGuarantee: "Explainable Decision: AI explains and translates risk—it never directly controls or authorizes money independently."
  },
  {
    number: 4,
    name: "AUTHORIZED BANK / UPI / PSP SYSTEM",
    teluguName: "బ్యాంక్ / యూపీఐ / PSP వ్యవస్థ",
    color: "from-emerald-600 to-teal-600",
    headline: "Clean Architectural Separation: SafeUPI is Security, UPI Handles Settlement",
    teluguHeadline: "స్పష్టమైన విభజన: సేఫ్‌యూపీఐ రక్షణ కవచం, బ్యాంకులు చెల్లింపులను పూర్తి చేస్తాయి",
    components: [
      "Authorized NPCI UPI Switch & PSP Gateway",
      "Issuing & Beneficiary Bank Settlement",
      "Hardware-backed Encrypted PIN Transmission",
      "Real-time Settlement Notification",
      "Immediate Success / Failure Webhook Dispatch"
    ],
    responsibilities: "SafeUPI does not replace the official banking rails. SafeUPI is the intelligent security layer around the payment, while the authorized PSP/Bank infrastructure handles actual money movement.",
    teluguResponsibilities: "సేఫ్‌యూపీఐ బ్యాంకింగ్ వ్యవస్థను రీప్లేస్ చేయదు; చెల్లింపులకు రక్షణ కవచంగా పనిచేస్తుంది, అసలు చెల్లింపులు బ్యాంకుల ద్వారానే జరుగుతాయి.",
    securityGuarantee: "Regulatory Compliance: Strict alignment with RBI Zero Customer Liability & NPCI guidelines."
  },
  {
    number: 5,
    name: "RESULT, MONITORING & RECOVERY HUB",
    teluguName: "ఫలితం, పర్యవేక్షణ & రికవరీ హబ్",
    color: "from-amber-600 to-red-600",
    headline: "Post-Transaction Monitoring, Emergency Fraud Mode & 1930 / CFCFRMS Restitution",
    teluguHeadline: "పోస్ట్-పేమెంట్ పర్యవేక్షణ, ఎమర్జెన్సీ మోడ్ & 1930 రికవరీ గైడెన్స్",
    components: [
      "Post-Payment Behavior Monitoring & Anomaly Alerts",
      "Emergency Fraud Mode: 🚨 'I Think I've Been Scammed' Button",
      "Automated Evidence Locker (Screenshot, Recipient VPA, Chat History, Timestamp)",
      "AI Forensics Incident Dossier Generation (Gemini)",
      "Simulated Fund Traceback: Visualizing multi-hop mule layering toward crypto/ATM",
      "1930 Cybercrime Helpline Integration & Golden-Hour Bank Lien Protocol"
    ],
    responsibilities: "When fraud happens, transforms victim helplessness into immediate structured action: collects forensic evidence, generates official dockets, and guides freeze requests within the critical Golden Hour.",
    teluguResponsibilities: "ఒకవేళ మోసం జరిగితే, గోల్డెన్ అవర్‌లో ఫండ్స్ ఫ్రీజ్ చేయడానికి మరియు 1930 హెల్ప్‌లైన్‌కు పూర్తి ఆధారాలతో రిపోర్ట్ చేయడానికి సహాయపడుతుంది.",
    securityGuarantee: "Golden Hour Restitution: Maximizes victim fund recovery chance under Section 102 CrPC."
  }
];

export const NORMAL_VS_SAFEUPI_COMPARISON = {
  punchline: {
    normal: "Normal UPI App: 'Here is a payment system.'",
    safeupi: "SafeUPI: 'Here is a payment system + a personal security layer + fraud intelligence + recovery assistance + money-management tools.'"
  },
  teluguPunchline: {
    normal: "సాధారణ యూపీఐ యాప్: 'ఇది ఒక పేమెంట్ సిస్టమ్ మాత్రమే.'",
    safeupi: "సేఫ్‌యూపీఐ: 'పేమెంట్ సిస్టమ్ + వ్యక్తిగత భద్రతా కవచం + మోసాల నిఘా + బాధితుల రికవరీ సహాయం + మనీ మేనేజ్‌మెంట్ టూల్స్.'"
  },
  comparisons: [
    {
      dimension: "Pre-Payment Verification",
      normal: "Direct dispatch without checking recipient age, reported complaints or call status.",
      safeupi: "Dual Engine (45+ Rules + ML) checks VPA reputation, device trust and unusual patterns before PIN entry."
    },
    {
      dimension: "Explainability",
      normal: "No explanation. User is left guessing why an error happened or if an offer is authentic.",
      safeupi: "Explainable AI (XAI) Waterfall gives exact plain-language reasons why a payment is risky."
    },
    {
      dimension: "AI Integration",
      normal: "No AI or generic chatbots that don't inspect transaction telemetry.",
      safeupi: "AI Money Guardian (Gemini) translates technical risk vectors into plain regional language advice."
    },
    {
      dimension: "Scam Detection Beyond Payments",
      normal: "Cannot inspect screenshots or deceptive SMS/WhatsApp collect traps.",
      safeupi: "Screenshot OCR Scam Analyzer and SMS/Message scam checker work even outside payment flow."
    },
    {
      dimension: "Post-Fraud Recovery Support",
      normal: "Shows 'Transaction Successful' receipt with zero recovery guidance. Victim is helpless.",
      safeupi: "Emergency 'I Think I've Been Scammed' Mode: Evidence collection, AI Forensics Dossier, and 1930 Golden Hour freeze guide."
    },
    {
      dimension: "Money Management & Safety",
      normal: "Basic transaction passbook.",
      safeupi: "Personal Safety Score (92/100) + Spending analytics + Senior Citizen / Family simplified mode."
    }
  ]
};

export const PRESENTATION_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "SafeUPI — Introduction",
    subtitle: "AI-Powered Real-Time UPI Fraud Detection, Forensic Tracing & Fund Recovery",
    category: "Introduction",
    badge: "Slide 1/7 · Overview",
    summary: "Team Secure Shield introduces SafeUPI: a pre-payment cybersecurity layer that verifies UPI transactions before PIN authorization, explains risk factors, and accelerates golden-hour restitution.",
    keyPoints: [
      {
        heading: "Team & Application",
        description: "Team: Secure Shield | App: SafeUPI | Tagline: 'Check Before You Pay'."
      },
      {
        heading: "Core Principle: Check → Warn → Guide",
        description: "Pay cheyyadaniki mundu Check → Risk unte Warn → Fraud aithe Recovery ki Guide."
      },
      {
        heading: "Pre-Auth vs Post-Incident",
        description: "Interception happens on the client edge before the UPI PIN leaves the device, neutralizing coerced fraud at the source."
      }
    ],
    rbiCitation: "NPCI UPI Safety Architecture & RBI Master Direction on Digital Payment Security Controls",
    visualType: "architecture_ai",
    speakerNotes: "Good morning everyone. We are Team Secure Shield, and our project is SafeUPI. SafeUPI is an AI-powered UPI fraud detection and prevention system. Our primary goal is to check whether a transaction is safe before the user pays. If there is a risk, we warn the user, explain why it is risky, and guide them through fund recovery if fraud has occurred.",
    teluguEnglishSpeakerNotes: "“Good morning everyone. Memu Team Secure Shield. Maa project peru SafeUPI. SafeUPI anedi AI-powered UPI fraud detection and prevention system. Ee system main goal enti ante, user payment chese mundu transaction safe aa kaada ani check cheyadam. Fraud risk unte user ki warning ivvadam, enduku risk ani explain cheyadam, and already fraud jarigite recovery process lo guide cheyadam maa main objective.”\n\nSimple ga:\nSafeUPI = Pay cheyyadaniki mundu Check → Risk unte Warn → Fraud aithe Recovery ki Guide.",
    teluguSpeakerNotes: "“శుభోదయం అందరికీ. మేము టీమ్ సెక్యూర్ షీల్డ్. మా ప్రాజెక్ట్ పేరు సేఫ్‌యూపీఐ (SafeUPI).\n\nసేఫ్‌యూపీఐ అనేది AI ఆధారిత యూపీఐ మోసాల గుర్తింపు మరియు నివారణ వ్యవస్థ.\n\nఈ సిస్టమ్ ముఖ్య ఉద్దేశ్యం: యూజర్ పేమెంట్ చేసే ముందే లావాదేవీ సురక్షితమైనదా కాదా అని తనిఖీ చేయడం.\n\nమోసం జరిగే ప్రమాదం ఉంటే హెచ్చరించడం, ఎందుకు రిస్క్ ఉందో వివరించడం, మరియు ఇప్పటికే మోసపోతే రికవరీ ప్రక్రియలో మార్గనిర్దేశం చేయడం మా ప్రధాన లక్ష్యం.”\n\nసింపుల్‌గా:\nపే చేయడానికి ముందు చెక్ → రిస్క్ ఉంటే హెచ్చరిక → మోసం జరిగితే రికవరీ గైడెన్స్.",
    teluguTitle: "సేఫ్‌యూపీఐ — పరిచయం (Introduction)",
    teluguSubtitle: "AI-ఆధారిత రియల్-టైమ్ యూపీఐ మోసాల నివారణ & ఫండ్ రికవరీ వ్యవస్థ",
    teluguSummary: "టీమ్ సెక్యూర్ షీల్డ్ వారి సేఫ్‌యూపీఐ: చెల్లింపు చేయడానికి ముందే లావాదేవీ భద్రతను విశ్లేషించి యూజర్‌ను రక్షించే వినూత్న వ్యవస్థ."
  },
  {
    id: 2,
    title: "Problem Statement — Anatomy of UPI Fraud",
    subtitle: "Reverse Collect Phishing, Screen Mirroring/RATs, Tampered QR & SIM Swap",
    category: "Problem Statement",
    badge: "Slide 2/7 · Attack Vectors",
    summary: "UPI transactions settle in milliseconds. Fraudsters exploit this velocity with psychological urgency, deceiving users into approving fraudulent debits.",
    keyPoints: [
      {
        heading: "1. Reverse Collect Request Phishing",
        description: "Scammer claims to send refund or prize money, sending an inbound 'Collect Request' that debits victim's account upon PIN entry."
      },
      {
        heading: "2. Screen Mirroring / RAT Apps",
        description: "Victims are tricked into installing AnyDesk, RustDesk, or TeamViewer under the guise of customer support to capture UPI PINs."
      },
      {
        heading: "3. Tampered / Fake QR Codes (Quishing)",
        description: "Criminals paste rogue QR stickers over verified merchant shop codes, diverting retail payments to untraceable mule accounts."
      },
      {
        heading: "4. SIM Swap & Account Takeover",
        description: "Telecom social engineering transfers mobile connectivity to fraudulent SIMs, bypassing SMS-based UPI binding."
      }
    ],
    rbiCitation: "CERT-In Cyber Security Advisory & NPCI Circular on Consumer Safeguards",
    visualType: "diagram_mule",
    speakerNotes: "UPI payments are fast and convenient, but cyber fraudsters exploit that very speed. Once money is transferred, recovering it can be very difficult. That is why identifying suspicious transactions before payment completion is essential. Attackers use collect requests, screen-mirroring apps, tampered QR stickers, and SIM swap attacks.",
    teluguEnglishSpeakerNotes: "“UPI payments chala fast and convenient ga untayi. Kani ade speed ni fraudsters misuse chestunnaru. Fraud jarigina tarvata money ni recover cheyyadam difficult avvachu. Anduke payment complete avvakamunde suspicious transaction ni identify cheyyadam important.\n\n1. Reverse Collect Request: Fraudster refund or cashback ani cheppi victim ni request accept cheyyamani convince chestadu.\n2. Screen Mirroring/RAT: Remote access app install cheyinchi PIN observe chestadu.\n3. Tampered QR: Shop genuine QR place lo fake QR petti money diver chestadu.\n4. SIM Swap: Account takeover chesi unauthorized transactions chestadu.”",
    teluguSpeakerNotes: "“యూపీఐ చెల్లింపులు చాలా వేగంగా ఉంటాయి. కానీ ఆ వేగాన్నే సైబర్ నేరగాళ్లు దుర్వినియోగం చేస్తున్నారు. మోసం జరిగిన తర్వాత డబ్బు రికవరీ చేయడం చాలా కష్టమవుతుంది. అందుకే పేమెంట్ పూర్తికాకముందే అనుమానాస్పద లావాదేవీని గుర్తించడం అత్యంత ముఖ్యం.\n\n1. రివర్స్ కలెక్ట్ రిక్వెస్ట్: రీఫండ్ లేదా క్యాష్‌బ్యాక్ అని చెప్పి పిన్ ఎంటర్ చేయించి డబ్బు దోచేయడం.\n2. స్క్రీన్ మిర్రరింగ్ (RAT): AnyDesk/TeamViewer ద్వారా యూజర్ టైప్ చేసే పిన్‌ను ప్రత్యక్షంగా చూడటం.\n3. ట్యాంపర్డ్ క్యూఆర్: దుకాణాల క్యూఆర్ కోడ్‌లపై నకిలీ స్టిక్కర్లు అతికించి మోసం చేయడం.\n4. సిమ్ స్వాప్: మొబైల్ సిమ్ నంబర్‌ను హ్యాక్ చేసి యూపీఐ ఖాతాను స్వాధీనం చేసుకోవడం.”",
    teluguTitle: "సమస్య వివరణ — యూపీఐ మోసాల విధానాలు",
    teluguSubtitle: "రివర్స్ కలెక్ట్ రిక్వెస్ట్‌లు, స్క్రీన్ షేరింగ్, నకిలీ క్యూఆర్ మరియు సిమ్ స్వాప్",
    teluguSummary: "లావాదేవీ పూర్తయిన తర్వాత కాకుండా, పిన్ ఎంటర్ చేయడానికి ముందే సైబర్ దాడులను అడ్డుకోవడం ప్రస్తుత డిజిటల్ ఇండియాలో అతిపెద్ద అవసరం."
  },
  {
    id: 3,
    title: "Our Solution — Check Before You Pay",
    subtitle: "The 4-Pillar Architecture: Detect → Explain → Prevent → Recover",
    category: "Solution Architecture",
    badge: "Slide 3/7 · Core Workflow",
    summary: "SafeUPI executes an end-to-end defense loop: evaluating signals, explaining reasons, warning users, and guiding recovery if fraud already occurred.",
    keyPoints: [
      {
        heading: "1. DETECT (Pre-Auth Risk Engine)",
        description: "Analyzes beneficiary age, transaction velocity, device integrity, and active screen-sharing before the PIN prompt."
      },
      {
        heading: "2. EXPLAIN (Explainable AI Waterfall)",
        description: "Instead of a cryptic warning, clearly displays why a transaction is flagged (e.g. +35% Collect Vector, +45% Screen Share)."
      },
      {
        heading: "3. PREVENT (Proactive Friction & Holds)",
        description: "Displays 'Pause Before You Pay' warnings, enforces 4-hour cooling holds, or prompts cancel options."
      },
      {
        heading: "4. RECOVER (1930 / CFCFRMS Recovery Hub)",
        description: "Instantly compiles formal evidence dossiers for golden-hour freezing via 1930 and bank dispute resolution."
      }
    ],
    rbiCitation: "RBI Zero-Liability Mandate & Section 102 CrPC Lien Orders",
    visualType: "flow_recovery",
    speakerNotes: "Our solution is built on the philosophy 'Check Before You Pay'. SafeUPI uses four major steps: First, Detect evaluates suspicious signals and calculates a risk score. Second, Explain shows the user why that score was generated in simple language. Third, Prevent warns the user before high-risk payments. Fourth, Recover guides victims through 1930 and bank reporting procedures.",
    teluguEnglishSpeakerNotes: "“Maa main idea: 'Check Before You Pay'. SafeUPI four major steps use chestundi:\n\n1. DETECT: First stage Detect. Maa system transaction context ni analyze chesi suspicious signals unnaya ani check chestundi. Rule engine and risk scoring use chesi risk score calculate chestundi.\n2. EXPLAIN: Second stage Explain. User ki just risk score matrame chupinchakunda, aa risk score enduku vachindo simple language lo explain chestam.\n3. PREVENT: Third stage Prevent. Transaction high risk ani detect aithe user ki warning istam. Cancel or reconsider chesukune opportunity vastundi.\n4. RECOVER: Fourth stage Recover. Already money fraud ayithe, 1930 and CFCFRMS recovery workflow dwara guidance istam.”",
    teluguSpeakerNotes: "“మా ప్రధాన పరిష్కారం: 'చెల్లించే ముందు తనిఖీ చేయండి' (Check Before You Pay). సేఫ్‌యూపీఐ 4 ప్రధాన దశల్లో పనిచేస్తుంది:\n\n1. డిటెక్ట్ (Detect): లావాదేవీని విశ్లేషించి రూల్ ఇంజిన్ మరియు మెషిన్ లెర్నింగ్ ద్వారా రిస్క్ స్కోర్‌ను గణిస్తుంది.\n2. ఎక్స్‌ప్లెయిన్ (Explain): కేవలం 'రిస్క్' అని చెప్పకుండా, ఆ స్కోర్ ఎందుకు వచ్చిందో స్పష్టంగా వివరిస్తుంది.\n3. ప్రివెంట్ (Prevent): ప్రమాదకరమైన చెల్లింపులను వెంటనే హెచ్చరించి, యూజర్ డబ్బును రక్షిస్తుంది.\n4. రికవర్ (Recover): ఒకవేళ ముందే మోసపోయి ఉంటే, 1930 సైబర్ హెల్ప్‌లైన్ మరియు బ్యాంక్ ద్వారా ఫండ్ ఫ్రీజ్ చేయిస్తుంది.”",
    teluguTitle: "మా పరిష్కారం — చెల్లించే ముందే తనిఖీ చేయండి",
    teluguSubtitle: "నాలుగు దశల భద్రతా చట్రం: గుర్తించు → వివరించు → నిరోధించు → రికవర్ చేయు",
    teluguSummary: "డిటెక్ట్, ఎక్స్‌ప్లెయిన్, ప్రివెంట్ మరియు రికవర్ అనే 4 విప్లవాత్మక అంచెల ద్వారా వినియోగదారుడికి పూర్తి భద్రత."
  },
  {
    id: 4,
    title: "Key Features — Comprehensive Protection Suite",
    subtitle: "6 Core Modules Delivering Enterprise Security to Every Smartphone",
    category: "Key Features",
    badge: "Slide 4/7 · Feature Highlights",
    summary: "SafeUPI integrates live scoring, deterministic rule gates, simulated money tracing, scam education, 1930 recovery, and Gemini forensic reports.",
    keyPoints: [
      {
        heading: "1. Live Risk Score Gauge (0–100)",
        description: "Dynamic circular risk dial categorized into Low (0–30), Medium (31–70), and High (71–100)."
      },
      {
        heading: "2. Deterministic Rule Engine",
        description: "45+ automated checks verifying screen-sharing, collect vectors, unseasoned payees, and root status."
      },
      {
        heading: "3. Fund Traceback Simulator",
        description: "Demonstrates how stolen money hops across Layer 1, Layer 2, and Layer 3 mule accounts toward ATM/crypto off-ramps."
      },
      {
        heading: "4. Scam Awareness Simulator",
        description: "Interactive learning covering Quishing, SIM Swap, AnyDesk remote fraud, and fake electricity bills."
      },
      {
        heading: "5. 1930 / CFCFRMS Recovery Hub",
        description: "Step-by-step golden-hour reporting, evidence generation, and automated bank dispute formatting."
      },
      {
        heading: "6. AI Forensics Panel (Gemini API)",
        description: "Converts raw transaction telemetry into human-readable forensic investigative dossiers."
      }
    ],
    rbiCitation: "PMLA Act 2002 & FIU-IND Advisory on Mule Account Syndicates",
    visualType: "diagram_mule",
    speakerNotes: "SafeUPI has six standout features: The Live Risk Score Gauge calculates a 0-100 score. The Rule Violations Engine checks predefined security rules with 45+ deterministic checks. The Fund Traceback Simulator visualizes the money trail through mule accounts. The Scam Awareness Simulator educates users on scams. The 1930 Recovery Hub guides victims through golden hour reporting. And the AI Forensics Panel uses Gemini to generate human-readable reports.",
    teluguEnglishSpeakerNotes: "“SafeUPI lo six main features unnayi:\n\n1. Live Risk Score Gauge: 0 to 100 madhya risk score generate chestundi reasons tho paatu.\n2. Rule Violations Engine: 45+ security rules ni deterministic ga check chestundi.\n3. Fund Traceback Simulator: Fraud jarigaka money different mule accounts madhya ela move avtundo visual ga demonstrate chestundi (Judge mundu idi simulator ani cheppandi).\n4. Scam Awareness Simulator: Quishing, SIM swap, remote-access scams gurinchi interactive ga nerpistundi.\n5. 1930 / CFCFRMS Recovery Hub: Incident details prepare chesi recovery reporting process ki guidance istundi.\n6. AI Forensics Panel: Gemini API use chesi forensic incident report generate chestundi.”",
    teluguSpeakerNotes: "“సేఫ్‌యూపీఐలో 6 ప్రధాన విశిష్టతలు ఉన్నాయి:\n\n1. లైవ్ రిస్క్ స్కోర్ గేజ్: 0 నుండి 100 వరకు ఖచ్చితమైన రిస్క్ స్కోర్ మరియు విశ్లేషణ.\n2. రూల్ వయోలేషన్స్ ఇంజిన్: 45+ ముందస్తు నిబంధనల ద్వారా మోసాలను పసిగడుతుంది.\n3. ఫండ్ ట్రేస్‌బ్యాక్ సిమ్యులేటర్: మోసపోయిన డబ్బు మ్యూల్ ఖాతాల ద్వారా ఎలా ప్రయాణిస్తుందో విజువల్‌గా చూపిస్తుంది.\n4. స్కామ్ అవేర్‌నెస్ సిమ్యులేటర్: ఫేక్ క్యూఆర్, సిమ్ స్వాప్, రిమోట్ యాప్ మోసాలపై అవగాహన కల్పిస్తుంది.\n5. 1930 రికవరీ హబ్: గోల్డెన్ అవర్‌లో ఫండ్స్ ఫ్రీజ్ చేయించడానికి పూర్తి సహాయం.\n6. AI ఫోరెన్సిక్స్ ప్యానెల్: జెమినీ (Gemini) AI ద్వారా ఫోరెన్సిక్ ఇన్సిడెంట్ రిపోర్ట్‌ను సిద్ధం చేస్తుంది.”",
    teluguTitle: "ప్రధాన ఫీచర్లు — పూర్తిస్థాయి భద్రతా సూట్",
    teluguSubtitle: "లైవ్ రిస్క్ గేజ్, రూల్ ఇంజిన్, మ్యూల్ ట్రేస్‌బ్యాక్, అవేర్‌నెస్, 1930 రికవరీ మరియు AI ఫోరెన్సిక్స్",
    teluguSummary: "సాధారణ యూజర్ నుండి సైబర్ దర్యాప్తు సంస్థల వరకు ఉపయోగపడే 6 కీలక మాడ్యూల్స్ కలయిక."
  },
  {
    id: 5,
    title: "Technology & Tools Stack",
    subtitle: "React, TypeScript, Vite, TailwindCSS, Explainable AI & Google Gemini",
    category: "Technical Stack",
    badge: "Slide 5/7 · Tech Architecture",
    summary: "Built for speed, type safety, responsiveness, and zero-PII privacy with client edge intelligence and Gemini-assisted forensics.",
    keyPoints: [
      {
        heading: "React + Vite + TypeScript",
        description: "High-performance reactive frontend, strict type safety, and ultra-fast build pipelines."
      },
      {
        heading: "TailwindCSS + Lucide Icons",
        description: "Mobile-first fintech design, accessible color tokens (Safe 🟢, Warning 🟡, High Risk 🔴), and clean iconography."
      },
      {
        heading: "Deterministic Rule Engine + ML Risk Model",
        description: "Fast rule evaluation combined with statistical multivariate anomaly detection."
      },
      {
        heading: "Explainable AI (Waterfall Decomposition)",
        description: "Transparent SHAP-style factor breakdown ensuring complete algorithm explainability."
      },
      {
        heading: "Google Gemini API (3.8 Flash)",
        description: "Natural-language incident summarization, forensic evidence synthesis, and multilingual copilot."
      },
      {
        heading: "RBI / NPCI Regulatory Mapping",
        description: "Framework alignment with RBI Zero Customer Liability mandates and 1930 CFCFRMS guidelines."
      }
    ],
    rbiCitation: "Reserve Bank - Integrated Ombudsman Scheme 2021 & NPCI Architecture Specs",
    visualType: "architecture_ai",
    speakerNotes: "Judges often ask what tools we used and why. React builds our user interface. TypeScript provides type safety and prevents bugs. Vite enables fast development and builds. TailwindCSS provides modern, responsive styling. Lucide provides icons. Our Rule Engine catches known threats deterministically, while ML scores multi-signal anomalies. Explainable AI ensures users understand the score. Gemini generates human-readable forensic reports. And our workflow is strictly aligned with RBI and NPCI standards.",
    teluguEnglishSpeakerNotes: "“Judges question: 'What tools did you use and why?'\n\n1. React: Frontend UI build cheyyadaniki (Login, Dashboard, Payment screens).\n2. TypeScript: JavaScript meeda type safety and code maintainability kosam.\n3. Vite: Fast development and production build tool.\n4. TailwindCSS: Responsive, modern UI styling and design kosam.\n5. Lucide Icons: Icons kosam.\n6. ML / Risk Engine: Risk scoring and suspicious patterns evaluate cheyyadaniki.\n7. Explainable AI: Risk enduku vachindo user ki transparent ga explain cheyyadaniki.\n8. Google Gemini API: Forensic report generation and incident explanation kosam.\n9. RBI / NPCI Mapping: RBI payment-security and 1930 reporting frameworks tho aligned workflow.”",
    teluguSpeakerNotes: "“సాంకేతిక పరిజ్ఞానం మరియు సాధనాలు (Technology Stack):\n\n• రియాక్ట్ (React): యూజర్ ఇంటర్‌ఫేస్ (UI) స్క్రీన్‌ల నిర్మాణం కోసం.\n• టైప్‌స్క్రిప్ట్ (TypeScript): టైప్-సేఫ్టీ మరియు బగ్‌లు లేని స్థిరమైన కోడింగ్ కోసం.\n• వైట్ (Vite): వేగవంతమైన డెవలప్‌మెంట్ మరియు బిల్డ్ టూల్.\n• టెయిల్‌విండ్ CSS (TailwindCSS): ఆధునిక, రెస్పాన్సివ్ ఫిన్‌టెక్ డిజైన్ కోసం.\n• రూల్ ఇంజిన్ + ML: తక్షణ రిస్క్ గణన మరియు మోసాల గుర్తింపు కోసం.\n• Explainable AI: AI తీసుకున్న నిర్ణయాలను యూజర్‌కు సరళంగా వివరించడానికి.\n• గూగుల్ జెమినీ API: ఆటోమేటిక్ ఫోరెన్సిక్ రిపోర్ట్ మరియు కేసు సారాంశం కోసం.\n• RBI / NPCI అలైన్‌మెంట్: జాతీయ సైబర్ సెక్యూరిటీ నిబంధనలకు అనుగుణంగా రూపొందించబడింది.”",
    teluguTitle: "సాంకేతికత & టూల్స్ స్టాక్ (Technology & Tools)",
    teluguSubtitle: "రియాక్ట్, టైప్‌స్క్రిప్ట్, వైట్, టెయిల్‌విండ్, ఎక్స్‌ప్లెయినబుల్ AI మరియు జెమినీ",
    teluguSummary: "ఆధునిక వెబ్ ప్రమాణాలు, క్లయింట్-ఎడ్జ్ భద్రత మరియు జెమినీ AI మేళవింపు."
  },
  {
    id: 6,
    title: "Impact & Project Uniqueness",
    subtitle: "Combining Detection, Explanation, Prevention & Recovery in a Single Flow",
    category: "Impact",
    badge: "Slide 6/7 · Uniqueness",
    summary: "Most existing solutions only detect fraud after money is gone. SafeUPI combines prevention, transparent explanation, and structured recovery in one seamless citizen platform.",
    keyPoints: [
      {
        heading: "The Complete Lifecycle Formula",
        description: "Detection + Explanation + Prevention + Recovery = SafeUPI."
      },
      {
        heading: "No Technical Jargon",
        description: "Translates complex cybersecurity telemetry into clear, reassuring advice anyone can understand."
      },
      {
        heading: "Zero-PII Client Edge Architecture",
        description: "User account balances, contact lists, and banking credentials never leave the personal device."
      },
      {
        heading: "Multi-Language Citizen Empowerment",
        description: "Full native support for Telugu (తెలుగు), English, and Hindi, democratizing cyber safety across India."
      }
    ],
    rbiCitation: "Payments Vision 2025: E-Payments for Everyone, Everywhere, Everytime (4Es)",
    visualType: "table_liability",
    speakerNotes: "Our project's uniqueness lies in the fact that we don't merely detect fraud after the event. We integrate pre-payment detection, plain-language explainability, active prevention, and structured recovery guidance into a single user-friendly platform. Instead of confusing technical jargon, we give citizens clear warnings before they authorize a risky transaction.",
    teluguEnglishSpeakerNotes: "“Maa project uniqueness enti ante, memu only fraud detection meeda focus cheyyaledu.\n\nDetection tho paatu prevention, explanation and recovery guidance ni same platform lo combine chestunnam.\n\nUser ki technical cybersecurity terms kakunda simple language lo warning and explanation provide cheyyadam maa important feature.\n\nSimple formula:\nDetection + Explanation + Prevention + Recovery = SafeUPI.”",
    teluguSpeakerNotes: "“మా ప్రాజెక్ట్ విశిష్టత మరియు ప్రభావం (Impact & Uniqueness):\n\nచాలా సిస్టమ్స్ డబ్బులు పోయిన తర్వాత మాత్రమే స్పందిస్తాయి. కానీ మా సేఫ్‌యూపీఐ:\nడబ్బు పోకముందే పసిగట్టడం (Detection) + ఎందుకు రిస్కో వివరించడం (Explanation) + చెల్లింపును ఆపడం (Prevention) + మోసపోతే డబ్బు రికవరీకి మార్గనిర్దేశం (Recovery) అనే నాలుగింటిని ఒకే వేదికపైకి తీసుకువచ్చింది.\n\nసాంకేతిక పదాలు వాడకుండా, సాధారణ ప్రజలకు సైతం అర్థమయ్యేలా తెలుగు మరియు ఆంగ్లంలో సమాచారాన్ని అందిస్తుంది.”",
    teluguTitle: "ప్రభావం & ప్రాజెక్ట్ విశిష్టత (Impact & Uniqueness)",
    teluguSubtitle: "గుర్తింపు + వివరణ + నివారణ + రికవరీ = సంపూర్ణ సేఫ్‌యూపీఐ రక్షణ",
    teluguSummary: "సాధారణ ప్రజలను సైబర్ మోసాల బారిన పడకుండా కాపాడే పూర్తిస్థాయి రక్షణ కవచం."
  },
  {
    id: 7,
    title: "Conclusion — Check Before You Pay",
    subtitle: "Triple-Layer Security, Regulatory Alignment & Citizen Empowerment",
    category: "Conclusion",
    badge: "Slide 7/7 · Final Vision",
    summary: "SafeUPI empowers India's 350+ million UPI users with transparent, real-time protection. Reacting after losing money is too late; checking before paying saves livelihoods.",
    keyPoints: [
      {
        heading: "1. Triple-Layer Security",
        description: "Seamless integration of device integrity checks, deterministic rule gates, and machine-learning risk scoring."
      },
      {
        heading: "2. Regulatory & RBI Alignment",
        description: "Engineered around RBI Zero-Liability circulars, Section 102 CrPC liens, and 1930 CFCFRMS protocols."
      },
      {
        heading: "3. Citizen Empowerment",
        description: "Protects students, senior citizens, and small merchants from deceptive collect requests and remote access traps."
      },
      {
        heading: "Our Vision",
        description: "'Money lose ayyaka react avvadam kanna, payment mundu risk ni identify chesi user ni protect cheyyadam.' SafeUPI — Check Before You Pay."
      }
    ],
    rbiCitation: "Vision 2025: RBI E-Payments for Everyone, Everywhere, Everytime",
    visualType: "architecture_ai",
    speakerNotes: "In conclusion, SafeUPI is not just a fraud detection app—it is a complete fraud protection workflow. First it detects, second it explains, third it prevents, and finally it assists recovery. Our vision is simple: instead of reacting after money is lost, we identify risks before payment and protect citizens. SafeUPI — Check Before You Pay. Thank you, judges! We are ready for your questions.",
    teluguEnglishSpeakerNotes: "“Finally, SafeUPI oka fraud detection application matrame kaadu.\n\nIt is designed as a complete fraud protection workflow.\n\nFirst, transaction ni detect chestundi.\nSecond, risk ni explain chestundi.\nThird, suspicious transaction aithe user ni prevent cheyyadaniki warning istundi.\nFinally, fraud already jarigite recovery and reporting process lo guide chestundi.\n\nMaa vision simple — money lose ayyaka react avvadam kanna, payment mundu risk ni identify chesi user ni protect cheyyadam.\n\nFinal line:\n'SafeUPI — Check Before You Pay.' Thank you judges!”",
    teluguSpeakerNotes: "“ముగింపు (Conclusion):\n\nసేఫ్‌యూపీఐ కేవలం ఒక యాప్ మాత్రమే కాదు — ఇది డిజిటల్ చెల్లింపుల పూర్తి రక్షణ వ్యవస్థ.\n\n1. లావాదేవీని గుర్తిస్తుంది (Detect).\n2. రిస్క్ కారణాన్ని వివరిస్తుంది (Explain).\n3. అనుమానాస్పద లావాదేవీని నివారిస్తుంది (Prevent).\n4. ఇప్పటికే మోసం జరిగితే రికవరీ ప్రక్రియలో తోడ్పడుతుంది (Recover).\n\nమా లక్ష్యం ఒక్కటే: డబ్బు పోయిన తర్వాత బాధపడేకంటే, చెల్లించే ముందే తనిఖీ చేసి ప్రజల కష్టార్జితాన్ని రక్షించడం.\n\n'సేఫ్‌యూపీఐ — చెల్లించే ముందే తనిఖీ చేయండి.' ధన్యవాదాలు!”",
    teluguTitle: "ముగింపు — చెల్లించే ముందే తనిఖీ చేయండి",
    teluguSubtitle: "త్రిముఖ భద్రత, నియంత్రణ సంస్థల ప్రమాణాలు & పౌర సాధికారత",
    teluguSummary: "డబ్బు కోల్పోయిన తర్వాత బాధపడటం కంటే, చెల్లింపుకు ముందే తనిఖీ చేయడం ఉత్తమం."
  }
];
