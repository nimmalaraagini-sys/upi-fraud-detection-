export interface TranslationStrings {
  appName: string;
  appTagline: string;
  appSubQuote: string;
  payViaUpi: string;
  checkBeforePay: string;
  scanQr: string;
  scanScreenshot: string;
  quickDemoTests: string;
  approved: string;
  reviewCheck: string;
  blockedScam: string;
  fakeScreenshotDemo: string;
  recipientLabel: string;
  amountLabel: string;
  timeLabel: string;
  deviceLabel: string;
  trustedDevice: string;
  newDevice: string;
  recipientTrustLabel: string;
  knownBeneficiary: string;
  newBeneficiary: string;
  btnCheckBeforePay: string;
  btnPayNow: string;
  lowRiskBadge: string;
  medRiskBadge: string;
  highRiskBadge: string;
  whyFlagged: string;
  mlPrediction: string;
  ruleScore: string;
  combinedScore: string;
  navPay: string;
  navVerify: string;
  navDashboard: string;
  navRecovery: string;
  navLearn: string;
  iLostMoney: string;
  recoveryTrackerTitle: string;
  technicalJuryView: string;
  friendlyUserView: string;
  caseStatus: string;
  stage1ReportCreated: string;
  stage2BankContacted: string;
  stage3ComplaintSubmitted: string;
  stage4Investigation: string;
  stage5RecoveryUpdate: string;
  securityTips: string;
  scamQuizTitle: string;
}

export const TRANSLATIONS: TranslationStrings = {
  appName: "SafeUPI Fraud Detector",
  appTagline: "Your friendly real-time payment guard",
  appSubQuote: "Before you pay, SafeUPI quietly checks — and tells you in plain words if something feels off.",
  payViaUpi: "Pay via UPI (Safe Send)",
  checkBeforePay: "Check Before Pay",
  scanQr: "Scan UPI QR",
  scanScreenshot: "Scan Screenshot",
  quickDemoTests: "Quick Demo Scenarios:",
  approved: "Safe (₹250 Groceries)",
  reviewCheck: "Review (₹5,000 Night)",
  blockedScam: "High Risk (₹38,000 Scam)",
  fakeScreenshotDemo: "Fake Screenshot Test",
  recipientLabel: "Who are you paying? (UPI ID or Name)",
  amountLabel: "How much? (Amount in ₹)",
  timeLabel: "What time is it now?",
  deviceLabel: "Device Status",
  trustedDevice: "Trusted Device (Verified)",
  newDevice: "New / Unknown Device",
  recipientTrustLabel: "Recipient History",
  knownBeneficiary: "Known Beneficiary",
  newBeneficiary: "First-time / New Beneficiary",
  btnCheckBeforePay: "🔐 Check Before Pay",
  btnPayNow: "🛡️ Verify & Proceed to Pay",
  lowRiskBadge: "🟢 Looks Safe to Pay",
  medRiskBadge: "🟡 Review & Verify Details",
  highRiskBadge: "🔴 High Risk — Scam Suspected",
  whyFlagged: "Why was this flagged?",
  mlPrediction: "Random Forest Model Probability",
  ruleScore: "Deterministic Rule Score",
  combinedScore: "Combined Risk Score (70% ML + 30% Rules)",
  navPay: "Pay & Check",
  navVerify: "Verify Screenshot / QR",
  navDashboard: "Dashboard & History",
  navRecovery: "Recovery Tracker",
  navLearn: "Scam Simulator",
  iLostMoney: "🚨 I think I lost money (Emergency)",
  recoveryTrackerTitle: "UPI Money Recovery Tracker",
  technicalJuryView: "Technical / Jury View",
  friendlyUserView: "Friendly User View",
  caseStatus: "Case Status",
  stage1ReportCreated: "Incident Report Created",
  stage2BankContacted: "Bank Fraud Desk Contacted",
  stage3ComplaintSubmitted: "1930 / Cyber Portal Submitted",
  stage4Investigation: "Police / Nodal Investigation",
  stage5RecoveryUpdate: "Account Lien & Recovery",
  securityTips: "UPI Golden Rule: You NEVER need to enter a UPI PIN or scan a QR code to RECEIVE money!",
  scamQuizTitle: "Interactive Scam Simulator"
};
