/**
 * Project Documentation & PDF Report Generator
 * Contains Team details, Problem Statement, System Architecture, Flowchart,
 * and 5 User Test Personas.
 */

export function downloadProjectPdf() {
  const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Documentation - Secure Shield (Smart Technologies / Cybersecurity)</title>
  <style>
    @media print {
      @page {
        size: A4;
        margin: 15mm 15mm 15mm 15mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: #fff !important;
        color: #0f172a !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #1e293b;
      background: #f8fafc;
      padding: 2rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    /* Print toolbar */
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
    }
    .toolbar button {
      background: #059669;
      color: #ffffff;
      border: none;
      padding: 0.6rem 1.25rem;
      font-weight: 700;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }
    .toolbar button:hover {
      background: #10b981;
    }

    /* Header & Logo */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-svg {
      width: 52px;
      height: 52px;
    }
    .header-title h1 {
      font-size: 1.6rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .header-title p {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-pill {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    /* Meta Details Card */
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      background: #f1f5f9;
      padding: 1.25rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      border: 1px solid #e2e8f0;
    }
    .meta-item strong {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.2rem;
    }
    .meta-item span {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #059669;
      padding-left: 0.75rem;
      margin: 2rem 0 1rem 0;
    }

    p {
      color: #334155;
      font-size: 0.92rem;
      margin-bottom: 1rem;
    }

    /* Flowchart Section */
    .flowchart-wrapper {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: center;
    }
    .flowchart-svg {
      max-width: 100%;
      height: auto;
    }

    /* Table styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.85rem;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 0.65rem 0.8rem;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }

    .callout {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      border-radius: 0 0.5rem 0.5rem 0;
      margin: 1.5rem 0;
      font-size: 0.88rem;
      color: #1e3a8a;
    }

    .footer {
      margin-top: 3rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 0.75rem;
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Print action bar (hidden on print) -->
    <div class="toolbar no-print">
      <div>
        <strong style="font-size: 1rem;">Project Documentation & Flow Chart</strong>
        <p style="font-size: 0.8rem; color: #94a3b8;">Click below to Save as PDF or Print directly.</p>
      </div>
      <button onclick="window.print()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9V2h12v7"></path>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <path d="M6 14h12v8H6z"></path>
        </svg>
        Save as PDF / Print
      </button>
    </div>

    <!-- Official Header with Vector Logo -->
    <div class="header">
      <div class="logo-container">
        <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="22" fill="#0F172A"/>
          <path d="M50 15L78 28V52C78 69 66 82 50 87C34 82 22 69 22 52V28L50 15Z" fill="#059669" stroke="#34D399" stroke-width="3"/>
          <path d="M38 50L46 58L62 42" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="header-title">
          <h1>Secure Shield</h1>
          <p>Zero-PII Client-Edge UPI Fraud Defense</p>
        </div>
      </div>
      <div class="badge-pill">
        Smart Technologies / Cybersecurity
      </div>
    </div>

    <!-- Hackathon & Submission Meta Grid -->
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Problem Statement Title</strong>
        <span>Real-Time Pre-Transaction Fraud Detection & Dual-Protection Architecture for UPI</span>
      </div>
      <div class="meta-item">
        <strong>Team Name (Registered on Portal)</strong>
        <span>Secure Shield</span>
      </div>
      <div class="meta-item">
        <strong>Theme</strong>
        <span>Smart Technologies / Cybersecurity</span>
      </div>
      <div class="meta-item">
        <strong>PS Category</strong>
        <span>Software</span>
      </div>
    </div>

    <!-- Problem Statement Details -->
    <h2>1. Executive Summary & Problem Statement</h2>
    <p>
      Unified Payments Interface (UPI) processes tens of millions of micro-transactions daily. However, <strong>over 84% of cyber-fraud occurs before the user enters their UPI PIN</strong>—through urgent psychological manipulation (lotteries, electricity bill threats), social engineering during active phone calls (vishing), fake QR codes, and mule accounts. Current bank detection mechanisms operate post-facto (after funds have left the account), leaving victims with an arduous recovery journey.
    </p>
    <p>
      <strong>Our Solution:</strong> Secure Shield introduces a client-side, zero-PII pre-transaction interception layer. It evaluates QR/VPA data, payment velocity, call telemetry, and device trust locally on the user's handset before transmitting payment parameters to the NPCI switch.
    </p>

    <!-- Architecture Flow Chart -->
    <h2>2. System Architecture & End-to-End Flow Chart</h2>
    <p>
      The complete transaction lifecycle from optical scanning / intent reception through multi-vector risk evaluation, guardian co-pilot verification, and final execution:
    </p>

    <div class="flowchart-wrapper">
      <svg class="flowchart-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="800" height="600" fill="#f8fafc" rx="12" />

        <!-- Definitions for Arrowheads -->
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>

        <!-- Box 1: User / Trigger -->
        <rect x="300" y="30" width="200" height="50" rx="8" fill="#0f172a" />
        <text x="400" y="60" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">1. User Initiates Payment / QR Scan</text>

        <!-- Arrow 1 to 2 -->
        <line x1="400" y1="80" x2="400" y2="120" stroke="#475569" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Box 2: Pre-Transmit Interceptor -->
        <rect x="250" y="120" width="300" height="60" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
        <text x="400" y="145" fill="#0369a1" font-size="13" font-weight="bold" text-anchor="middle">2. Secure Shield Edge Interceptor</text>
        <text x="400" y="165" fill="#0284c7" font-size="11" text-anchor="middle">Extracts VPA, Amount, Note &amp; Device Telemetry (Zero-PII)</text>

        <!-- Arrow 2 to Multi-Engine -->
        <line x1="400" y1="180" x2="400" y2="220" stroke="#475569" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Dual Engine Container -->
        <rect x="100" y="220" width="600" height="110" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="400" y="245" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">3. Real-Time Multi-Vector Edge Risk Engine</text>

        <!-- Engine Sub-boxes -->
        <rect x="120" y="260" width="165" height="50" rx="6" fill="#f1f5f9" stroke="#94a3b8" />
        <text x="202" y="282" fill="#1e293b" font-size="11" font-weight="bold" text-anchor="middle">A. Vishing Call Sensor</text>
        <text x="202" y="298" fill="#64748b" font-size="10" text-anchor="middle">Active call during payment</text>

        <rect x="315" y="260" width="170" height="50" rx="6" fill="#f1f5f9" stroke="#94a3b8" />
        <text x="400" y="282" fill="#1e293b" font-size="11" font-weight="bold" text-anchor="middle">B. Edge ML Classifier</text>
        <text x="400" y="298" fill="#64748b" font-size="10" text-anchor="middle">Velocity, Amount &amp; Time</text>

        <rect x="510" y="260" width="170" height="50" rx="6" fill="#f1f5f9" stroke="#94a3b8" />
        <text x="595" y="282" fill="#1e293b" font-size="11" font-weight="bold" text-anchor="middle">C. Mule VPA Registry</text>
        <text x="595" y="298" fill="#64748b" font-size="10" text-anchor="middle">Real-time flagged blacklist</text>

        <!-- Arrow to Decision Tier -->
        <line x1="400" y1="330" x2="400" y2="370" stroke="#475569" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Decision Box: Risk Assessment Tier -->
        <polygon points="400,370 550,420 400,470 250,420" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
        <text x="400" y="415" fill="#92400e" font-size="12" font-weight="bold" text-anchor="middle">Risk Tier</text>
        <text x="400" y="432" fill="#b45309" font-size="11" text-anchor="middle">Assessment</text>

        <!-- Branch 1: Low Risk (<30) -->
        <line x1="250" y1="420" x2="150" y2="420" stroke="#16a34a" stroke-width="2" />
        <line x1="150" y1="420" x2="150" y2="500" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow-green)" />
        <rect x="75" y="500" width="150" height="60" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
        <text x="150" y="525" fill="#166534" font-size="12" font-weight="bold" text-anchor="middle">LOW RISK (&lt;30)</text>
        <text x="150" y="545" fill="#15803d" font-size="10" text-anchor="middle">Direct PIN Entry &amp; Transmit</text>

        <!-- Branch 2: Medium Risk (30 - 70) -->
        <line x1="400" y1="470" x2="400" y2="500" stroke="#d97706" stroke-width="2" marker-end="url(#arrow)" />
        <rect x="310" y="500" width="180" height="60" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
        <text x="400" y="525" fill="#92400e" font-size="12" font-weight="bold" text-anchor="middle">MEDIUM RISK (30-70)</text>
        <text x="400" y="545" fill="#b45309" font-size="10" text-anchor="middle">Step-Up Prompt / Review Warning</text>

        <!-- Branch 3: High Risk / Mule / Vishing (>70) -->
        <line x1="550" y1="420" x2="650" y2="420" stroke="#dc2626" stroke-width="2" />
        <line x1="650" y1="420" x2="650" y2="500" stroke="#dc2626" stroke-width="2" marker-end="url(#arrow-red)" />
        <rect x="565" y="500" width="170" height="60" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />
        <text x="650" y="525" fill="#991b1b" font-size="12" font-weight="bold" text-anchor="middle">HIGH RISK / BLOCK (&gt;70)</text>
        <text x="650" y="545" fill="#b91c1c" font-size="10" text-anchor="middle">Guardian Dual-Auth or Freeze</text>
      </svg>
    </div>

    <!-- 5 Connected Layers Architectural Ecosystem -->
    <h2>3. SafeUPI 5-Layer Connected Architecture</h2>
    <p>
      SafeUPI treats digital financial safety as five tightly coupled, specialized architectural layers:
    </p>

    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 15px 0;">
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 11px;">
        <strong style="color: #0284c7; display: block; margin-bottom: 4px;">Layer 1: User &amp; Identity</strong>
        <span>Account creation, Mobile OTP, Linked bank metadata, Hardware keystore, and Personal Safety Score (92/100).</span>
      </div>
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 11px;">
        <strong style="color: #4f46e5; display: block; margin-bottom: 4px;">Layer 2: App &amp; Payment</strong>
        <span>Send, Scan QR, Receive, Payee Check, Utility Bills, AutoPay Mandates, and Spending Analytics.</span>
      </div>
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 11px;">
        <strong style="color: #dc2626; display: block; margin-bottom: 4px;">Layer 3: Fraud / AI Engine</strong>
        <span>45+ Deterministic rules + ML anomaly model + XAI Waterfall reasoning + Gemini AI Money Guardian.</span>
      </div>
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 11px;">
        <strong style="color: #059669; display: block; margin-bottom: 4px;">Layer 4: Bank / UPI / PSP</strong>
        <span>SafeUPI is the security layer; authorized PSP and NPCI switch infrastructure handles official fund movement.</span>
      </div>
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 11px;">
        <strong style="color: #d97706; display: block; margin-bottom: 4px;">Layer 5: Monitoring &amp; Recovery</strong>
        <span>Post-transaction anomaly alerts, Emergency Fraud Mode, Evidence locker, and 1930 / CFCFRMS restitution.</span>
      </div>
    </div>

    <!-- Normal UPI vs SafeUPI Paradigm Shift -->
    <div style="background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 12px; margin: 15px 0; font-size: 12px;">
      <strong style="color: #6b21a8; font-size: 13px; display: block; margin-bottom: 6px;">The Paradigm Shift: Traditional UPI vs SafeUPI</strong>
      <p style="margin-bottom: 6px;"><strong>Traditional UPI App:</strong> <em>&ldquo;Here is a payment system.&rdquo;</em> Blindly dispatches money without pre-verification, provides no explanation on suspicious traps, and leaves victims completely helpless post-fraud.</p>
      <p><strong>SafeUPI (Secure Shield):</strong> <em>&ldquo;Here is a payment system + a personal security layer + fraud intelligence + recovery assistance + money-management tools.&rdquo;</em></p>
    </div>

    <!-- Testing Personas Table -->
    <div class="page-break"></div>
    <h2>4. Demonstration User Personas &amp; Credentials</h2>
    <p>
      The application comes equipped with five distinct profiles designed for comprehensive hackathon jury evaluation:
    </p>

    <table>
      <thead>
        <tr>
          <th>Role / Persona</th>
          <th>Registered Name &amp; Phone</th>
          <th>Linked Bank &amp; UPI ID</th>
          <th>Demo PIN</th>
          <th>Key Simulation Scenario</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Consumer / Citizen</strong><br>(Default App Mode)</td>
          <td>Aarav Sharma<br>+91 98765 12345</td>
          <td>HDFC Bank (•••• 4021)<br>aarav.sharma@upi</td>
          <td><code>1234</code></td>
          <td>Standard pre-transaction scam check, optical QR payments, and baseline velocity.</td>
        </tr>
        <tr>
          <td><strong>2. Senior Citizen</strong><br>(Guardian Co-Pilot)</td>
          <td>Ramesh Chandra<br>+91 94421 98765</td>
          <td>Axis Bank (•••• 6720)<br>ramesh.senior@okaxis</td>
          <td><code>2580</code></td>
          <td>Dual-authorization trigger, active vishing call detection, and guardian OTP override.</td>
        </tr>
        <tr>
          <td><strong>3. Cyber Analyst</strong><br>(Forensics &amp; Engine)</td>
          <td>Team Secure Shield<br>+91 98111 22334</td>
          <td>State Bank of India (•••• 8102)<br>analyst.shield@okhdfc</td>
          <td><code>7788</code></td>
          <td>Live ML feature inspection, 70/30 ensemble weights, and rule threshold calibration.</td>
        </tr>
        <tr>
          <td><strong>4. Crime Officer</strong><br>(Enforcement)</td>
          <td>Inspector K. Rathore<br>+91 99000 11223</td>
          <td>ICICI Bank (•••• 1194)<br>cybercell.delhi@gov</td>
          <td><code>1930</code></td>
          <td>Mule account blacklist registration, 1930 NCRP integration, and freeze workflows.</td>
        </tr>
        <tr>
          <td><strong>5. Bank Ombudsman</strong><br>(Compliance Jury)</td>
          <td>Dr. S. Venkatraman<br>+91 97777 88899</td>
          <td>Kotak Mahindra (•••• 5521)<br>ombudsman.jury@rbi</td>
          <td><code>9999</code></td>
          <td>Zero-PII client privacy compliance audit, dispute resolution, and regulatory audit trail.</td>
        </tr>
      </tbody>
    </table>

    <!-- Key Technical Innovations -->
    <h2>4. Core Technical Differentiators</h2>
    <div class="callout">
      <strong>Zero-PII Architecture Guarantee:</strong>
      All ML inferences and behavioral assessments occur directly inside the client browser / mobile sandbox. User credentials, banking passwords, and contacts never leave the local device unencrypted.
    </div>

    <ul style="margin-left: 1.5rem; font-size: 0.9rem; color: #334155; line-height: 1.7;">
      <li><strong>Edge Optical QR Decoding:</strong> In-memory QR code parsing supporting direct camera streams, image drag-and-drop, and NPCI standard UPI URI parameter extraction.</li>
      <li><strong>Active Vishing Call Telemetry:</strong> Detects simultaneous cellular phone calls during high-value transfer attempts to neutralize coercive screen-share scams.</li>
      <li><strong>Dynamic Mule Account Registry:</strong> Synchronized with local incident reporting and national cybersecurity databases to alert users before fund dispatch.</li>
      <li><strong>Offline Standalone Demonstration Engine:</strong> Self-contained pitch presentation with interactive audio narration and chapter scrubbing.</li>
    </ul>

    <div class="footer">
      <span>Secure Shield — Smart Technologies / Cybersecurity</span>
      <span>Problem Statement: Software / UPI Fraud Detection</span>
    </div>
  </div>

  <script>
    // Automatically focus window for smooth printing
    window.onload = function() {
      // ready
    };
  </script>
</body>
</html>`;

  const blob = new Blob([docHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // Fallback direct download if popup blocked
    const a = document.createElement("a");
    a.href = url;
    a.download = "Secure_Shield_Documentation_and_Flowchart.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
