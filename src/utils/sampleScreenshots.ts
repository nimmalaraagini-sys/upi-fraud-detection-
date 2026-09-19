/**
 * Generates realistic SVG data URLs for sample UPI transaction screenshots
 * for users who want to test the screenshot scanner immediately.
 */

export interface SampleScreenshot {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  dataUrl: string;
  fileName: string;
}

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// 1. OLX AnyDesk Screen Share Collect Request Scam
const olxScamSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="400" height="700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="dangerBg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
  </defs>

  <!-- Phone Background -->
  <rect width="400" height="700" rx="30" fill="url(#bg)" />

  <!-- Top Status Bar with Remote Screen Share Warning Icon -->
  <rect x="0" y="0" width="400" height="40" fill="#090d16" />
  <text x="25" y="25" fill="#e2e8f0" font-family="Arial" font-size="13" font-weight="bold">10:42 AM</text>
  <!-- Screen recording / AnyDesk red indicator -->
  <circle cx="310" cy="22" r="6" fill="#ef4444" />
  <text x="322" y="26" fill="#f87171" font-family="Arial" font-size="11" font-weight="bold">AnyDesk Active</text>
  <text x="380" y="25" fill="#94a3b8" font-family="Arial" font-size="12">100%</text>

  <!-- App Header -->
  <rect x="0" y="40" width="400" height="60" fill="#1e293b" />
  <text x="25" y="75" fill="#38bdf8" font-family="Arial" font-size="18" font-weight="bold">Google Pay</text>
  <text x="270" y="75" fill="#94a3b8" font-family="Arial" font-size="12">Payment Request</text>

  <!-- Alert Warning Box -->
  <rect x="25" y="120" width="350" height="65" rx="12" fill="#450a0a" stroke="#dc2626" stroke-width="1.5" />
  <text x="40" y="145" fill="#fca5a5" font-family="Arial" font-size="13" font-weight="bold">⚠️ INCOMING COLLECT REQUEST</text>
  <text x="40" y="168" fill="#fecaca" font-family="Arial" font-size="11">OLX Buyer has requested money from your account.</text>

  <!-- Transaction Card -->
  <rect x="25" y="200" width="350" height="340" rx="16" fill="url(#cardBg)" stroke="#334155" stroke-width="1" />
  
  <!-- Avatar -->
  <circle cx="200" cy="250" r="32" fill="#ef4444" />
  <text x="200" y="258" fill="#ffffff" font-family="Arial" font-size="22" font-weight="bold" text-anchor="middle">OLX</text>

  <!-- Receiver Details -->
  <text x="200" y="305" fill="#ffffff" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle">OLX Express Refund Helpdesk</text>
  <text x="200" y="325" fill="#94a3b8" font-family="Arial" font-size="12" text-anchor="middle">olx_buyer_refund99@ybl</text>

  <!-- Amount -->
  <text x="200" y="380" fill="#ffffff" font-family="Arial" font-size="34" font-weight="bold" text-anchor="middle">₹ 14,500</text>
  <text x="200" y="405" fill="#cbd5e1" font-family="Arial" font-size="12" text-anchor="middle">Note: "Enter PIN to receive token advance for sofa"</text>

  <!-- Warning about PIN -->
  <rect x="45" y="435" width="310" height="40" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
  <text x="200" y="459" fill="#a5b4fc" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Entering UPI PIN will DEDUCT money from bank!</text>

  <!-- Buttons: Pay / Decline -->
  <rect x="45" y="490" width="145" height="42" rx="10" fill="#334155" />
  <text x="117" y="516" fill="#ffffff" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">Decline</text>

  <rect x="210" y="490" width="145" height="42" rx="10" fill="url(#dangerBg)" />
  <text x="282" y="516" fill="#ffffff" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">Pay ₹14,500</text>

  <!-- Bottom Notice -->
  <text x="200" y="600" fill="#64748b" font-family="Arial" font-size="11" text-anchor="middle">NPCI UPI · Never share OTP or PIN</text>
  <text x="200" y="620" fill="#ef4444" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">AnyDesk remote screen mirroring is currently running!</text>
</svg>
`;

// 2. Fake Electricity Bill / Disconnection Urgency SMS & UPI Screen
const electricityScamSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="400" height="700">
  <defs>
    <linearGradient id="elecBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
  </defs>

  <rect width="400" height="700" rx="30" fill="url(#elecBg)" />

  <!-- Status Bar -->
  <rect x="0" y="0" width="400" height="40" fill="#09090b" />
  <text x="25" y="25" fill="#e4e4e7" font-family="Arial" font-size="13" font-weight="bold">11:15 PM</text>
  <text x="350" y="25" fill="#a1a1aa" font-family="Arial" font-size="12">84%</text>

  <!-- SMS Header -->
  <rect x="0" y="40" width="400" height="60" fill="#27272a" />
  <text x="25" y="75" fill="#facc15" font-family="Arial" font-size="16" font-weight="bold">Messages · Urgent Notice</text>

  <!-- Fake SMS Bubble -->
  <rect x="25" y="120" width="350" height="150" rx="14" fill="#3f3f46" stroke="#fbbf24" stroke-width="1.5" />
  <text x="40" y="145" fill="#fef08a" font-family="Arial" font-size="12" font-weight="bold">URGENT: ELECTRICITY BOARD NOTICE</text>
  <text x="40" y="170" fill="#f4f4f5" font-family="Arial" font-size="11">Dear Customer, your electricity power will be</text>
  <text x="40" y="190" fill="#f4f4f5" font-family="Arial" font-size="11">DISCONNECTED tonight at 9:30 PM due to unpaid bill.</text>
  <text x="40" y="215" fill="#f4f4f5" font-family="Arial" font-size="11">Pay ₹3,850 immediately to electricity officer:</text>
  <text x="40" y="240" fill="#38bdf8" font-family="Arial" font-size="12" font-weight="bold">power_nodal_bill99@paytm</text>

  <!-- Payment Checkout in PhonePe -->
  <rect x="25" y="300" width="350" height="280" rx="16" fill="#18181b" stroke="#52525b" stroke-width="1" />
  <text x="200" y="335" fill="#a855f7" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle">PhonePe Instant Pay</text>

  <text x="200" y="380" fill="#ffffff" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">Officer Rajesh Kumar (Personal VPA)</text>
  <text x="200" y="400" fill="#a1a1aa" font-family="Arial" font-size="12" text-anchor="middle">power_nodal_bill99@paytm</text>
  <text x="200" y="445" fill="#ffffff" font-family="Arial" font-size="30" font-weight="bold" text-anchor="middle">₹ 3,850</text>

  <!-- Button -->
  <rect x="50" y="490" width="300" height="44" rx="12" fill="#7e22ce" />
  <text x="200" y="518" fill="#ffffff" font-family="Arial" font-size="15" font-weight="bold" text-anchor="middle">Proceed to Pay ₹3,850</text>

  <text x="200" y="620" fill="#ef4444" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Red Flag: Unofficial personal UPI handle for utility bill!</text>
</svg>
`;

// 3. Legitimate Verified Supermarket QR Payment
const verifiedMerchantSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="400" height="700">
  <defs>
    <linearGradient id="safeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
  </defs>

  <rect width="400" height="700" rx="30" fill="#020617" />

  <!-- Status Bar -->
  <rect x="0" y="0" width="400" height="40" fill="#020617" />
  <text x="25" y="25" fill="#f8fafc" font-family="Arial" font-size="13" font-weight="bold">05:20 PM</text>
  <text x="350" y="25" fill="#94a3b8" font-family="Arial" font-size="12">92%</text>

  <!-- App Header -->
  <rect x="0" y="40" width="400" height="60" fill="#042f2e" />
  <text x="25" y="75" fill="#2dd4bf" font-family="Arial" font-size="18" font-weight="bold">Paytm · Shop Scanner</text>

  <!-- Verified Badge Card -->
  <rect x="25" y="120" width="350" height="420" rx="16" fill="#0f172a" stroke="#059669" stroke-width="1.5" />
  
  <circle cx="200" cy="180" r="30" fill="#10b981" />
  <text x="200" y="188" fill="#ffffff" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle">✓</text>

  <text x="200" y="235" fill="#ffffff" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Fresh Mart Supermarket</text>
  <text x="200" y="255" fill="#10b981" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle">✓ NPCI Verified Merchant (GST Registered)</text>
  <text x="200" y="275" fill="#94a3b8" font-family="Arial" font-size="12" text-anchor="middle">freshmart_store@icici</text>

  <!-- Amount -->
  <text x="200" y="340" fill="#ffffff" font-family="Arial" font-size="34" font-weight="bold" text-anchor="middle">₹ 650</text>
  <text x="200" y="365" fill="#64748b" font-family="Arial" font-size="12" text-anchor="middle">Scanned Counter QR Code</text>

  <!-- Pay Button -->
  <rect x="50" y="420" width="300" height="44" rx="12" fill="#059669" />
  <text x="200" y="448" fill="#ffffff" font-family="Arial" font-size="15" font-weight="bold" text-anchor="middle">Pay ₹650 Safely</text>

  <text x="200" y="580" fill="#34d399" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle">✓ Low Risk · Legitimate Merchant · Trusted Device</text>
</svg>
`;

// 4. Sample Non-Payment Image (Food / Pizza photo to test rejection)
const foodPhotoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="plate" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="85%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <radialGradient id="pizza" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="#78350f" />
  <circle cx="200" cy="200" r="170" fill="url(#plate)" stroke="#94a3b8" stroke-width="4"/>
  <circle cx="200" cy="200" r="140" fill="#ffffff" />
  <circle cx="200" cy="200" r="125" fill="url(#pizza)" stroke="#78350f" stroke-width="6"/>
  <circle cx="160" cy="160" r="18" fill="#dc2626" />
  <circle cx="240" cy="170" r="20" fill="#dc2626" />
  <circle cx="190" cy="240" r="18" fill="#dc2626" />
  <circle cx="150" cy="220" r="12" fill="#16a34a" />
  <circle cx="230" cy="230" r="14" fill="#16a34a" />
  <circle cx="200" cy="150" r="12" fill="#16a34a" />
  <circle cx="255" cy="205" r="9" fill="#1f2937" />
  <circle cx="145" cy="180" r="9" fill="#1f2937" />
  <circle cx="200" cy="200" r="10" fill="#dc2626" />
  <rect x="40" y="335" width="320" height="42" rx="8" fill="#000000" opacity="0.8"/>
  <text x="200" y="361" fill="#fef08a" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">🍕 Lunch Pizza Photo (Non-Payment)</text>
</svg>
`;

export const SAMPLE_SCREENSHOTS: SampleScreenshot[] = [
  {
    id: "sample_olx_anydesk",
    name: "OLX Collect Scam (AnyDesk Active)",
    badge: "High Danger Scam",
    badgeColor: "bg-rose-950 text-rose-300 border-rose-700",
    description: "Fake buyer collect request of ₹14,500 with AnyDesk screen mirroring running in the notification bar.",
    dataUrl: createSvgDataUrl(olxScamSvg),
    fileName: "olx_anydesk_collect_scam_screenshot.png"
  },
  {
    id: "sample_electricity_urgency",
    name: "Electricity Bill SMS Scam",
    badge: "Phishing Trap",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-700",
    description: "Urgent night SMS threatening power cut, demanding ₹3,850 sent to a personal stranger UPI ID.",
    dataUrl: createSvgDataUrl(electricityScamSvg),
    fileName: "electricity_bill_phishing_screenshot.png"
  },
  {
    id: "sample_verified_qr",
    name: "Verified Grocery Store QR",
    badge: "Safe Payment",
    badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-700",
    description: "Routine ₹650 payment to a seasoned NPCI-verified merchant with GST & bank validation.",
    dataUrl: createSvgDataUrl(verifiedMerchantSvg),
    fileName: "freshmart_verified_qr_screenshot.png"
  },
  {
    id: "sample_food_photo",
    name: "Food / Meal Photo (Non-Payment Test)",
    badge: "Test Rejection",
    badgeColor: "bg-purple-950 text-purple-300 border-purple-700",
    description: "Photo of a pizza/food dish. Used to verify the system rejects non-payment photos.",
    dataUrl: createSvgDataUrl(foodPhotoSvg),
    fileName: "sample_food_meal_dish.png"
  }
];
