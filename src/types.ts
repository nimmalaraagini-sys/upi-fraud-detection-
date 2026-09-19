export type RiskLevel = "SAFE" | "MODERATE" | "HIGH" | "CRITICAL";

export type DecisionType = "ALLOW" | "STEP_UP_2FA" | "COOLING_PERIOD" | "BLOCK_AND_FREEZE";

export type ChannelType = "qr_code" | "collect_request" | "direct_vpa" | "payment_link" | "intent_sdk";

export type ReceiverCategory = "individual" | "merchant" | "charity" | "gaming_crypto" | "unknown";

export interface TransactionPayload {
  transactionId: string;
  timestamp: string;
  senderVpa: string;
  senderName: string;
  senderAccountAgeDays: number;
  receiverVpa: string;
  receiverName: string;
  receiverCategory: ReceiverCategory;
  receiverAccountAgeHours: number;
  amount: number;
  userAvgMonthlyAmount: number;
  userMaxHistoricalAmount: number;
  frequencyLast10Mins: number;
  frequencyLast24Hours: number;
  channel: ChannelType;
  deviceTrusted: boolean;
  deviceChangedRecently: boolean;
  isEmulatedOrRooted: boolean;
  screenShareAppActive: boolean;
  locationCity: string;
  distanceFromHomeKm: number;
  unusualHour: boolean;
  notesOrRemarks?: string;
}

export interface RuleViolation {
  code: string;
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  scoreImpact: number;
  category: "VELOCITY" | "DEVICE" | "BENEFICIARY" | "CHANNEL" | "BEHAVIORAL";
  description: string;
  remedy: string;
}

export interface FactorContribution {
  factor: string;
  weight: number;
  type: "risk" | "safety";
  explanation: string;
}

export interface AnalysisResult {
  transactionId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  mlConfidence: number;
  decision: DecisionType;
  triggeredRules: RuleViolation[];
  factors: FactorContribution[];
  mlAnomalyScore: number;
  ruleScoreComponent: number;
  mlScoreComponent: number;
  summaryReason: string;
  safetyTips: string[];
}

export interface ForensicReport {
  source: string;
  attackVector: string;
  forensicSummary: string;
  threatActorModusOperandi?: string;
  npciGuidelineReference: string;
  recommendedAction: string;
  consumerActionSteps: string[];
}

export interface PresetScenario {
  id: string;
  title: string;
  categoryTag: string;
  badgeColor: string;
  description: string;
  expectedRisk: RiskLevel;
  data: TransactionPayload;
}

export interface ScreenshotScanResult {
  source: "gemini_vision" | "simulated_ocr";
  isPaymentImage: boolean;
  detectedContentType?: string;
  rejectionReason?: string;
  appName?: string;
  detectedAmount?: number;
  senderVpa?: string;
  senderName?: string;
  receiverVpa?: string;
  receiverName?: string;
  receiverCategory?: ReceiverCategory;
  channel?: ChannelType;
  screenShareAppActive?: boolean;
  detectedRedFlags: string[];
  summary: string;
  rawExtractedText?: string;
  confidenceScore?: number;
  suggestedPayload: Partial<TransactionPayload>;
}
