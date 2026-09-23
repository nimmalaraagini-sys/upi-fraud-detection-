export interface UserProfile {
  id: string;
  name: string;
  role: "citizen" | "senior" | "analyst" | "officer" | "jury";
  roleLabel: string;
  badgeColor: string;
  phone: string;
  email?: string;
  loginId: string;
  upiId: string;
  defaultPin: string;
  bankName: string;
  accountNumberMasked: string;
  accountType: string;
  ifscCode: string;
  accountBalance: number;
  riskBaseline: string;
  guardianProtection?: {
    enabled: boolean;
    guardianName: string;
    guardianPhone: string;
    thresholdAmount: number;
  };
  specialAccessCode?: string;
  avatarBg: string;
  avatarText: string;
  description: string;
  quickScenarioPreset?: string;
}

export const USER_PROFILES: UserProfile[] = [
  {
    id: "citizen",
    name: "Aarav Sharma",
    role: "citizen",
    roleLabel: "Consumer / Citizen (Standard)",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    phone: "+91 98765 12345",
    email: "aarav.sharma@gmail.com",
    loginId: "+91 98765 12345 / aarav.sharma@upi",
    upiId: "aarav.sharma@upi",
    defaultPin: "1234",
    bankName: "HDFC Bank",
    accountNumberMasked: "•••• 4021",
    accountType: "Savings Account",
    ifscCode: "HDFC0001021",
    accountBalance: 34500,
    riskBaseline: "Average ₹400 – ₹1,500/day; Safe device fingerprint",
    avatarBg: "bg-emerald-600",
    avatarText: "AS",
    description: "Standard pre-transaction scam checks, QR payments, everyday consumer transfers.",
    quickScenarioPreset: "safe"
  },
  {
    id: "senior",
    name: "Ramesh Chandra",
    role: "senior",
    roleLabel: "Senior Citizen (Protected Account)",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    phone: "+91 94421 98765",
    email: "ramesh.chandra1958@gmail.com",
    loginId: "+91 94421 98765",
    upiId: "ramesh.senior@okaxis",
    defaultPin: "2580",
    bankName: "Axis Bank",
    accountNumberMasked: "•••• 8912",
    accountType: "Pension Savings Account",
    ifscCode: "UTIB0002891",
    accountBalance: 82400,
    riskBaseline: "Pension account; Low frequency; Protected against vishing & remote screen-share",
    guardianProtection: {
      enabled: true,
      guardianName: "Rohan Chandra (Son)",
      guardianPhone: "+91 98765 43210",
      thresholdAmount: 5000
    },
    avatarBg: "bg-purple-600",
    avatarText: "RC",
    description: "Protected mode with Guardian dual-authorization, active call vishing alerts, and remote access blocks.",
    quickScenarioPreset: "call_scam"
  },
  {
    id: "analyst",
    name: "Security Officer",
    role: "analyst",
    roleLabel: "Cyber Security Analyst & ML Engineer",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    phone: "+91 91234 56789",
    email: "analyst@secureshield.ai",
    loginId: "analyst@secureshield.ai",
    upiId: "analyst.shield@sbi",
    defaultPin: "7788",
    bankName: "State Bank of India",
    accountNumberMasked: "•••• 1029",
    accountType: "Corporate Security Desk",
    ifscCode: "SBIN0004012",
    accountBalance: 150000,
    riskBaseline: "Enterprise analyst account with telemetry inspection & AI heuristics",
    specialAccessCode: "ADMIN_SECURE_2026",
    avatarBg: "bg-blue-600",
    avatarText: "SO",
    description: "Inspects live telemetry, SHAP explainable AI waterfall, rule matrix, and Gemini 3.8 Flash forensics.",
    quickScenarioPreset: "review"
  },
  {
    id: "officer",
    name: "Inspector K. Rathore",
    role: "officer",
    roleLabel: "Cyber Crime 1930 / I4C Law Enforcement",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    phone: "+91 98110 19300",
    email: "cybercell@gov.in",
    loginId: "I4C-OFFICER-7891",
    upiId: "i4c.officer7891@nic",
    defaultPin: "1930",
    bankName: "State Cyber Cell Escrow",
    accountNumberMasked: "•••• 7891",
    accountType: "Official Law Enforcement Account",
    ifscCode: "PUNB0007891",
    accountBalance: 500000,
    riskBaseline: "Government agency nodal account; Multi-hop traceback & Section 102 CrPC lien orders",
    specialAccessCode: "I4C-OFFICER-7891",
    avatarBg: "bg-rose-700",
    avatarText: "KR",
    description: "Simulates 4-hop fund traceback, freeze orders on beneficiary mule nodes, and 1930 complaint filing.",
    quickScenarioPreset: "mule_scam"
  },
  {
    id: "jury",
    name: "Hackathon Jury / RBI Auditor",
    role: "jury",
    roleLabel: "Bank Ombudsman & Jury Evaluator",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    phone: "+91 99999 00001",
    email: "jury.evaluator@smarttech.org",
    loginId: "jury.evaluator@smarttech.org",
    upiId: "evaluator@smarttech",
    defaultPin: "9999",
    bankName: "Regulatory Reserve Pool",
    accountNumberMasked: "•••• 0001",
    accountType: "Audit & Evaluation Account",
    ifscCode: "RBIS0000001",
    accountBalance: 1000000,
    riskBaseline: "Compliance audit, dual-engine benchmark (70% ML / 30% Rules), and presentation slides",
    specialAccessCode: "JURY_SMART_TECH_2026",
    avatarBg: "bg-amber-600",
    avatarText: "JE",
    description: "Evaluates zero-PII architecture, multi-language coverage, pitch presentation deck, and technical compliance.",
    quickScenarioPreset: "safe"
  }
];
