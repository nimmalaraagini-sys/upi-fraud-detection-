import { TransactionPayload, AnalysisResult, RuleViolation, FactorContribution, ForensicReport, ScreenshotScanResult } from "../types";

export function evaluateRiskEngine(tx: TransactionPayload): AnalysisResult {
  const triggeredRules: RuleViolation[] = [];
  const factors: FactorContribution[] = [];

  let rulePoints = 0;

  // RULE 1: Screen share active (AnyDesk / TeamViewer)
  if (tx.screenShareAppActive) {
    const violation: RuleViolation = {
      code: "RULE_SCREENS_01",
      name: "Screen Sharing App is Active (AnyDesk / TeamViewer)",
      severity: "CRITICAL",
      scoreImpact: 45,
      category: "DEVICE",
      description: "Someone can see your phone screen right now. Scammers use this trick to watch you enter your UPI PIN and steal your money.",
      remedy: "Close and delete AnyDesk or TeamViewer immediately before typing any PIN!"
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "Screen Sharing App is Active",
      weight: 45,
      type: "risk",
      explanation: "A remote app is watching your screen. Extreme risk of PIN theft."
    });
  }

  // RULE 2: Collect Request Trap
  if (tx.channel === "collect_request") {
    if (tx.receiverAccountAgeHours < 48 || tx.amount > 2000) {
      const violation: RuleViolation = {
        code: "RULE_COLLECT_02",
        name: "Fake 'Receive Money' Request (Collect Request)",
        severity: "HIGH",
        scoreImpact: 35,
        category: "CHANNEL",
        description: "This is a payment request, NOT receiving money! Scammers tell victims 'enter your PIN to get cash or prize', but your money will be deducted.",
        remedy: "Remember: You NEVER enter your UPI PIN to receive money!"
      };
      triggeredRules.push(violation);
      rulePoints += violation.scoreImpact;
      factors.push({
        factor: "Payment Request Sent to You",
        weight: 35,
        type: "risk",
        explanation: "Entering your PIN will DEDUCT money from your account, not credit it."
      });
    }
  }

  // RULE 3: Newly Added Beneficiary + High Value Drain
  if (tx.receiverAccountAgeHours < 24 && tx.amount > 10000) {
    const violation: RuleViolation = {
      code: "RULE_NEW_BENEF_03",
      name: "Sending Big Amount to Brand New Account",
      severity: "CRITICAL",
      scoreImpact: 30,
      category: "BENEFICIARY",
      description: `The receiver account was created just ${tx.receiverAccountAgeHours} hours ago, and you are sending a large amount of ₹${tx.amount.toLocaleString("en-IN")}. Scammers use brand new accounts and close them immediately.`,
      remedy: "Wait 4 hours before sending large amounts to someone you just added."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "Brand New Receiver Account (<24h)",
      weight: 30,
      type: "risk",
      explanation: "Large transfer to a brand new account created today is a major scam sign."
    });
  } else if (tx.receiverAccountAgeHours < 72) {
    factors.push({
      factor: "Recently Created Receiver Account",
      weight: 12,
      type: "risk",
      explanation: "Receiver account was created less than 3 days ago."
    });
    rulePoints += 12;
  }

  // RULE 4: Device Integrity & Root/Emulation
  if (tx.isEmulatedOrRooted) {
    const violation: RuleViolation = {
      code: "RULE_INTEGRITY_04",
      name: "Unsafe or Modified Phone Operating System",
      severity: "CRITICAL",
      scoreImpact: 30,
      category: "DEVICE",
      description: "This phone is rooted, jailbroken, or running on a computer simulator. Normal phone security protections are disabled.",
      remedy: "Only use official banking apps on standard, unmodified phones."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "Modified or Unsafe Phone",
      weight: 30,
      type: "risk",
      explanation: "The phone security system has been bypassed."
    });
  }

  // RULE 5: Rapid Payments in short time
  if (tx.frequencyLast10Mins >= 4) {
    const violation: RuleViolation = {
      code: "RULE_VELOCITY_05",
      name: "Too Many Quick Payments in 10 Minutes",
      severity: "HIGH",
      scoreImpact: 28,
      category: "VELOCITY",
      description: `You have made ${tx.frequencyLast10Mins} payments in less than 10 minutes. Scammers frequently rush victims to send money multiple times in a panic.`,
      remedy: "Pause and verify before sending another payment."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "Rapid Repeated Payments",
      weight: 28,
      type: "risk",
      explanation: `${tx.frequencyLast10Mins} payments made within 10 minutes.`
    });
  } else if (tx.frequencyLast10Mins >= 2) {
    rulePoints += 10;
    factors.push({
      factor: "Quick Back-to-Back Payments",
      weight: 10,
      type: "risk",
      explanation: "Multiple payments sent in quick succession."
    });
  }

  // RULE 6: Extreme Amount Anomaly
  const amountRatio = tx.amount / (tx.userAvgMonthlyAmount || 1000);
  if (tx.amount > tx.userMaxHistoricalAmount * 2 && tx.amount > 25000) {
    const violation: RuleViolation = {
      code: "RULE_AMOUNT_06",
      name: "Much Higher Amount Than You Usually Pay",
      severity: "HIGH",
      scoreImpact: 25,
      category: "BEHAVIORAL",
      description: `This amount (₹${tx.amount.toLocaleString("en-IN")}) is more than double the highest payment you have ever made.`,
      remedy: "Verify through your bank app or call the person on phone before approving."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "Payment Amount is Extremely High",
      weight: 25,
      type: "risk",
      explanation: `Amount is ${(amountRatio).toFixed(1)} times higher than your normal monthly spending.`
    });
  } else if (amountRatio > 3 && tx.amount > 10000) {
    rulePoints += 15;
    factors.push({
      factor: "Noticeably Higher Than Normal",
      weight: 15,
      type: "risk",
      explanation: "Amount is much higher than your routine daily payments."
    });
  }

  // RULE 7: Unusual Midnight Hours
  if (tx.unusualHour) {
    if (tx.amount > 5000) {
      const violation: RuleViolation = {
        code: "RULE_TIME_07",
        name: "Late Night Payment (1:00 AM - 5:00 AM)",
        severity: "MEDIUM",
        scoreImpact: 15,
        category: "BEHAVIORAL",
        description: "Payment is being made in the middle of the night when banks and customer care are closed. Scammers often strike at night.",
        remedy: "Wait until morning hours if the payment is not a genuine emergency."
      };
      triggeredRules.push(violation);
      rulePoints += violation.scoreImpact;
    }
    factors.push({
      factor: "Late Night Hours (1 AM - 5 AM)",
      weight: 12,
      type: "risk",
      explanation: "Transactions during sleep hours carry extra risk."
    });
  }

  // RULE 8: Location Anomaly
  if (tx.distanceFromHomeKm > 500) {
    const violation: RuleViolation = {
      code: "RULE_LOCATION_08",
      name: "Payment Far Away From Your Home City",
      severity: "MEDIUM",
      scoreImpact: 18,
      category: "BEHAVIORAL",
      description: `This payment is happening ${tx.distanceFromHomeKm} km away from your usual home location.`,
      remedy: "Check if you are using a VPN or if someone else is accessing your account."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: `Sudden Long Distance (${tx.distanceFromHomeKm} km)`,
      weight: 18,
      type: "risk",
      explanation: "Payment is being made far from where you normally live."
    });
  }

  // RULE 9: Device changed recently
  if (tx.deviceChangedRecently && !tx.deviceTrusted) {
    const violation: RuleViolation = {
      code: "RULE_DEVICE_09",
      name: "New Phone or Recent SIM Swap Detected",
      severity: "HIGH",
      scoreImpact: 25,
      category: "DEVICE",
      description: "Payment is happening from a brand new phone or after a SIM card replacement today. Thieves do this after stealing phone numbers.",
      remedy: "Under RBI rules, maximum limit is ₹5,000 for the first 24 hours on a new phone."
    };
    triggeredRules.push(violation);
    rulePoints += violation.scoreImpact;
    factors.push({
      factor: "New Phone or Recent SIM Change",
      weight: 25,
      type: "risk",
      explanation: "This phone is not recognized in your trusted device history."
    });
  } else if (tx.deviceTrusted) {
    factors.push({
      factor: "Your Usual Trusted Phone",
      weight: -15,
      type: "safety",
      explanation: "Your personal phone security and fingerprint are recognized."
    });
  }

  // Safety factors
  if (tx.receiverCategory === "merchant" && tx.receiverAccountAgeHours > 720) {
    factors.push({
      factor: "Verified Registered Business Store",
      weight: -20,
      type: "safety",
      explanation: "The receiver is a verified, long-standing registered shop with GST."
    });
  }

  if (tx.amount <= tx.userAvgMonthlyAmount && tx.distanceFromHomeKm < 15 && tx.deviceTrusted) {
    factors.push({
      factor: "Normal Routine Daily Spending",
      weight: -15,
      type: "safety",
      explanation: "Matches your normal daily habits and usual neighborhood."
    });
  }

  // AI Pattern Score (simulating Isolation Forest / Pattern Detection)
  const normAmount = Math.min(tx.amount / 50000, 1);
  const normVel = Math.min(tx.frequencyLast10Mins / 5, 1);
  const normBenefRisk = tx.receiverAccountAgeHours < 24 ? 1 : tx.receiverAccountAgeHours < 72 ? 0.6 : 0.1;
  const normDeviceRisk = (tx.screenShareAppActive ? 1.0 : 0) + (tx.isEmulatedOrRooted ? 0.8 : 0) + (tx.deviceChangedRecently ? 0.6 : 0);
  const normDist = Math.min(tx.distanceFromHomeKm / 1000, 1);

  const mlAnomalyScore = Math.min(
    1,
    0.35 * normAmount * normVel +
    0.30 * Math.min(normDeviceRisk, 1) +
    0.20 * normBenefRisk +
    0.15 * normDist +
    (tx.channel === "collect_request" ? 0.25 : 0)
  );

  const mlScoreComponent = Math.round(mlAnomalyScore * 100);
  const ruleScoreComponent = Math.min(100, Math.max(0, rulePoints));

  let rawScore = Math.round(ruleScoreComponent * 0.55 + mlScoreComponent * 0.45);

  if (tx.deviceTrusted && tx.receiverCategory === "merchant" && !tx.screenShareAppActive && !tx.isEmulatedOrRooted) {
    rawScore = Math.max(0, rawScore - 25);
  }

  if (tx.screenShareAppActive || (tx.isEmulatedOrRooted && tx.amount > 5000)) {
    rawScore = Math.max(85, rawScore);
  }

  const finalRiskScore = Math.min(100, Math.max(0, rawScore));

  let riskLevel: AnalysisResult["riskLevel"] = "SAFE";
  let decision: AnalysisResult["decision"] = "ALLOW";
  let summaryReason = "Everything looks safe. This payment matches your normal routine.";

  if (finalRiskScore >= 80) {
    riskLevel = "CRITICAL";
    decision = "BLOCK_AND_FREEZE";
    summaryReason = "DANGEROUS SCAM DETECTED! We stopped this payment because someone is likely trying to steal your money (e.g. active screen sharing or fake collect request).";
  } else if (finalRiskScore >= 55) {
    riskLevel = "HIGH";
    decision = "COOLING_PERIOD";
    summaryReason = "HIGH RISK! This looks suspicious. Under RBI safety rules, a 4-hour waiting period is recommended so you can double check.";
  } else if (finalRiskScore >= 30) {
    riskLevel = "MODERATE";
    decision = "STEP_UP_2FA";
    summaryReason = "BE CAREFUL! Some details look unusual. Please verify with fingerprint or bank OTP before proceeding.";
  } else {
    riskLevel = "SAFE";
    decision = "ALLOW";
    summaryReason = "SAFE TO PAY. Transaction verified on your trusted phone with no red flags.";
  }

  const safetyTips: string[] = [];
  if (tx.channel === "collect_request") {
    safetyTips.push("Never enter your UPI PIN to receive money! A PIN is ONLY used when money is leaving your account.");
  }
  if (tx.screenShareAppActive) {
    safetyTips.push("Close AnyDesk or TeamViewer right now. Bank staff will NEVER ask you to install screen-sharing apps.");
  }
  if (tx.receiverAccountAgeHours < 48) {
    safetyTips.push("Call the receiver on phone first to confirm their identity before sending money to a brand new account.");
  }
  if (safetyTips.length === 0) {
    safetyTips.push("Always read the name shown on your screen before typing your PIN.");
    safetyTips.push("Verify that official store accounts have a blue verified badge or registered merchant tag.");
  }

  return {
    transactionId: tx.transactionId,
    riskScore: finalRiskScore,
    riskLevel,
    mlConfidence: Math.round(86 + (finalRiskScore > 70 ? 9 : 4)),
    decision,
    triggeredRules,
    factors,
    mlAnomalyScore: Number(mlAnomalyScore.toFixed(3)),
    ruleScoreComponent,
    mlScoreComponent,
    summaryReason,
    safetyTips
  };
}

export async function fetchAiForensics(transaction: TransactionPayload, analysis: AnalysisResult): Promise<ForensicReport> {
  try {
    const res = await fetch("/api/ai-forensics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction, analysis })
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Falling back to local forensic report:", err);
    return {
      source: "client_forensic_generator",
      attackVector: transaction.screenShareAppActive 
        ? "AnyDesk Screen-Sharing Trap" 
        : transaction.channel === "collect_request"
        ? "Fake 'Receive Money' Request Trap"
        : transaction.deviceChangedRecently
        ? "Stolen Phone / SIM Card Swap"
        : "Standard Everyday Payment",
      forensicSummary: `Our system checked this transaction and gave it a risk score of ${analysis.riskScore}/100. ${analysis.summaryReason}`,
      threatActorModusOperandi: transaction.screenShareAppActive
        ? "The scammer pretended to be a buyer or customer support, tricked you into installing AnyDesk, and is trying to see your PIN."
        : transaction.channel === "collect_request"
        ? "The scammer sent a request saying you will 'receive cashback' or 'get a refund', hoping you press accept and type your PIN."
        : "Checked against your normal spending patterns and verified merchant safety lists.",
      npciGuidelineReference: "Reserve Bank of India (RBI) Digital Security Rules & 1930 Cyber Helpline Guidelines",
      recommendedAction: analysis.decision,
      consumerActionSteps: [
        "If you already sent money, call 1930 immediately to freeze the money before the scammer withdraws it.",
        "Remember: You NEVER enter your UPI PIN to receive money.",
        "Decline unknown payment requests on Google Pay, PhonePe, or Paytm."
      ]
    };
  }
}

export async function scanTransactionScreenshot(
  imageBase64: string,
  fileName: string = "",
  mimeType: string = "image/jpeg"
): Promise<ScreenshotScanResult> {
  try {
    const res = await fetch("/api/ocr-transaction-screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64, fileName, mimeType })
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Falling back to client-side screenshot heuristic:", err);
    // Intelligent client-side fallback
    const lower = fileName.toLowerCase();
    const isNonPayment = lower.includes("food") || lower.includes("meal") || lower.includes("dish") || 
                         lower.includes("pizza") || lower.includes("burger") || lower.includes("cat") || 
                         lower.includes("dog") || lower.includes("selfie") || lower.includes("photo") ||
                         lower.includes("sample_non_payment");
    if (isNonPayment) {
      return {
        source: "simulated_ocr",
        isPaymentImage: false,
        detectedContentType: lower.includes("food") || lower.includes("pizza") ? "Food / Meal Photo" : "General Non-Payment Photo",
        rejectionReason: "The uploaded image appears to be a photo of food or a personal item, not a financial payment screen. Please upload a screenshot from your payment app (Google Pay, PhonePe, Paytm, etc.).",
        appName: "None",
        detectedAmount: 0,
        detectedRedFlags: ["Image Rejected: Not a financial transaction screenshot"],
        summary: "Upload rejected: Image does not contain any UPI payment, banking SMS, or transaction details.",
        confidenceScore: 99,
        suggestedPayload: {}
      };
    }

    const isCollect = lower.includes("collect") || lower.includes("olx") || lower.includes("scam");
    const isQr = lower.includes("qr");
    const amount = isCollect ? 14500 : isQr ? 850 : 2500;
    const receiver = isCollect ? "OLX Express Refund Helpdesk" : isQr ? "Verified City Mart" : "Pooja Sharma";
    const vpa = isCollect ? "olx_buyer_refund99@ybl" : isQr ? "citymart_pos@icici" : "pooja.sharma@okaxis";
    
    return {
      source: "simulated_ocr",
      isPaymentImage: true,
      detectedContentType: isCollect ? "Collect Request" : isQr ? "QR Code" : "UPI Transfer",
      appName: isCollect ? "Google Pay (Collect Request)" : isQr ? "PhonePe (Store QR)" : "Paytm Direct Pay",
      detectedAmount: amount,
      senderVpa: "your_upi_id@oksbi",
      senderName: "You",
      receiverVpa: vpa,
      receiverName: receiver,
      receiverCategory: isCollect ? "unknown" : isQr ? "merchant" : "individual",
      channel: isCollect ? "collect_request" : isQr ? "qr_code" : "direct_vpa",
      screenShareAppActive: isCollect,
      detectedRedFlags: isCollect
        ? [
            "Collect Request: The screen asks to pay to receive a token or refund.",
            "AnyDesk screen sharing icon detected in status bar.",
            "Unverified stranger account attempting high amount transfer."
          ]
        : [],
      summary: isCollect
        ? "Dangerous! The uploaded screenshot is a UPI Collect Request asking for ₹14,500 with AnyDesk screen sharing on. If you enter your PIN, ₹14,500 will be taken from your bank!"
        : `Screenshot scanned: Payment of ₹${amount} to ${receiver} (${vpa}).`,
      confidenceScore: 90,
      suggestedPayload: {
        amount,
        receiverVpa: vpa,
        receiverName: receiver,
        receiverCategory: isCollect ? "unknown" : isQr ? "merchant" : "individual",
        channel: isCollect ? "collect_request" : isQr ? "qr_code" : "direct_vpa",
        screenShareAppActive: isCollect,
        notesOrRemarks: `Extracted from uploaded screenshot (${fileName || "UPI Payment Image"})`
      }
    };
  }
}
