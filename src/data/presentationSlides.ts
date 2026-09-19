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
}

export const PRESENTATION_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "UPI Fraud Forensics & Fund Recovery",
    subtitle: "Tracing Digital Money Loss, Cyber Security Tracing & RBI Guidelines with Blockchain Correlation",
    category: "Executive Overview",
    badge: "Hackathon Deck · Slide 1/10",
    summary: "An end-to-end framework combining real-time AI/ML fraud detection, inter-bank money trail tracing, and legal restitution under RBI digital payment mandates.",
    keyPoints: [
      {
        heading: "The Challenge",
        description: "UPI processed over 130+ billion transactions in India. Rapid transaction velocity has enabled sophisticated cyber syndicates to siphon funds across multi-hop mule networks in under 15 minutes."
      },
      {
        heading: "The Technological Solution",
        description: "Hybrid AI Risk Sentinel + Real-time CFCFRMS 1930 API integration to freeze outbound funds before ATM liquidation or crypto conversion."
      },
      {
        heading: "Regulatory & Recovery Framework",
        description: "Leveraging RBI's Limited Customer Liability Circular (Zero Liability), Section 102 CrPC Lien Orders, and Distributed Ledger tracking for digital asset off-ramps."
      }
    ],
    rbiCitation: "RBI Master Direction on Digital Payment Security Controls & Circular DBR.No.Leg.BC.78/09.07.005/2017-18",
    blockchainContext: "Forensic bridging: Monitoring fiat-to-crypto P2P conversion points (e.g., USDT cashouts) and RBI e-Rupee CBDC 2-tier ledgers.",
    visualType: "architecture_ai",
    speakerNotes: "Welcome judges. In this presentation, we demonstrate how our solution moves beyond mere detection: we showcase how money is lost, how it traverses banking hops, how cyber forensic investigators trace it, and how victims recover their funds through RBI rules and blockchain analytics."
  },
  {
    id: 2,
    title: "Anatomy of Online UPI Financial Loss",
    subtitle: "How Cyber Fraudsters Deceive Victims and Induce Unauthorized Debits",
    category: "Threat Vectors",
    badge: "Attack Mechanics · Slide 2/10",
    summary: "Analyzing the top 4 attack blueprints documented by CERT-In and Indian State Cyber Police wings.",
    keyPoints: [
      {
        heading: "1. Reverse Collect Request Phishing",
        description: "Attacker initiates a 'Collect/Pull Request' claiming the victim will 'receive refund' or 'claim lottery'. Victims mistakenly enter their UPI PIN, which debits their account."
      },
      {
        heading: "2. Screen Mirroring / RAT Exploitation",
        description: "Victims are coerced into installing AnyDesk or TeamViewer under the guise of customer care, granting scammers real-time visibility of the UPI PIN entry screen."
      },
      {
        heading: "3. Tampered & Malicious QR Codes (Quishing)",
        description: "Physical retail merchant QR stickers are surreptitiously replaced with freshly generated personal VPAs, redirecting merchant payments to criminal mules."
      },
      {
        heading: "4. SIM Swap & Overnight Account Takeover",
        description: "Duplicating physical SIM cards via telecom social engineering to bind UPI credentials on rooted emulator devices between 1:00 AM – 5:00 AM."
      }
    ],
    rbiCitation: "NPCI Circular: Guidelines on UPI Security Architecture & Authentication Mandates",
    speakerNotes: "Notice that UPI itself is cryptographically secure; the attack surface lies in human engineering, screen-sharing malware, and reverse collect requests. Our detector halts these at the device and transaction layer."
  },
  {
    id: 3,
    title: "The Multi-Hop Mule Money Trail",
    subtitle: "Layer 1, Layer 2, and Layer 3 Money Laundering Mechanics",
    category: "Forensic Tracing",
    badge: "Money Flow · Slide 3/10",
    summary: "Fraudulent funds never stay in the initial beneficiary account. Criminal networks immediately disperse amounts across layered mule hierarchies within minutes.",
    keyPoints: [
      {
        heading: "Hop 1: Primary Mule (0 - 3 mins)",
        description: "The stolen amount hits a compromised 'primary mule' account via UPI. The account was often opened with forged Aadhaar or rented from students/gig workers."
      },
      {
        heading: "Hop 2: Splitting & Layering (3 - 8 mins)",
        description: "Automated scripts split the ₹50,000 into smaller batches (e.g. 5 transfers of ₹9,999) across 5 different regional banks via IMPS/NEFT to bypass velocity triggers."
      },
      {
        heading: "Hop 3: Off-Ramping & Cashout (8 - 15 mins)",
        description: "Funds are withdrawn at multiple ATM kiosks across different cities or instantly funneled into crypto P2P exchanges (buying USDT) or gaming wallets."
      }
    ],
    visualType: "diagram_mule",
    rbiCitation: "PMLA Act 2002 & FIU-IND Advisory on Mule Account Syndicates and Real-Time Suspicious Transaction Reporting (STR)",
    speakerNotes: "This slide illustrates the critical timeline: after 15 minutes, funds typically reach cash ATMs or crypto wallets. That is why automated real-time lien triggering within the 1-hour window is vital."
  },
  {
    id: 4,
    title: "Real-Time Trace-Back & The 1930 'Golden Hour'",
    subtitle: "Citizen Financial Cyber Fraud Reporting System (CFCFRMS) & I4C Architecture",
    category: "Cyber Security Protocol",
    badge: "Tracing Architecture · Slide 4/10",
    summary: "How Indian cyber authorities and partner banks track and freeze funds across the banking network in real time.",
    keyPoints: [
      {
        heading: "Step 1: Citizen SOS via 1930 / cybercrime.gov.in",
        description: "Victim dials 1930 or registers an incident. The system captures the Transaction ID (RRN), Source Bank, Target UPI ID, and exact timestamp."
      },
      {
        heading: "Step 2: Automated Inter-Bank Freeze API (CFCFRMS)",
        description: "The Indian Cyber Crime Coordination Centre (I4C) dispatches simultaneous API freeze alerts to the recipient bank (Hop 1) and intermediary banks (Hop 2)."
      },
      {
        heading: "Step 3: Account Lien Placement under Sec 102 CrPC",
        description: "Banks place a temporary legal 'Lien' (freeze on the specific siphoned amount) across all identified mule accounts down the chain."
      },
      {
        heading: "Golden Hour Success Window",
        description: "Reporting within 60 minutes yields an 85%+ fund recovery rate; beyond 4 hours, recovery probability drops below 25% due to ATM cashouts."
      }
    ],
    visualType: "flow_recovery",
    rbiCitation: "MHA / I4C National Cyber Crime Reporting Portal Operating Procedures & Section 102 Code of Criminal Procedure",
    speakerNotes: "The 1930 system is India's most powerful cyber defense weapon. Our application directly interfaces with this knowledge base to generate instant pre-filled incident complaints for the user."
  },
  {
    id: 5,
    title: "RBI Latest Guidelines on Digital Money & Liability",
    subtitle: "Limiting Customer Liability & Mandatory Banking Safety Directives",
    category: "Legal & Regulatory",
    badge: "RBI Circulars · Slide 5/10",
    summary: "Clear rules established by the Reserve Bank of India governing who pays for digital fraud and mandatory bank reimbursement timelines.",
    keyPoints: [
      {
        heading: "Zero Customer Liability (Full Refund)",
        description: "Applies when the fraud is due to contributory fraud/negligence on the bank's side OR third-party breaches where the customer notifies the bank within 3 working days."
      },
      {
        heading: "Limited Liability Matrix (4 to 7 Days)",
        description: "If reporting takes between 4 to 7 working days, customer liability is capped at ₹10,000 for standard savings accounts and ₹25,000 for credit facilities."
      },
      {
        heading: "Mandatory Reversal Timeline (Shadow Credit in 10 Days)",
        description: "Per RBI directives, banks MUST credit the disputed amount back to the customer's account within 10 working days from the date of notification, pending investigation."
      },
      {
        heading: "24-Hour & 4-Hour Cooling Ceilings",
        description: "Mandatory maximum limit of ₹5,000 for the first 24 hours following a newly bound SIM card, and 4-hour cooling holds on newly added beneficiaries."
      }
    ],
    visualType: "table_liability",
    rbiCitation: "RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 & Master Direction on Digital Payment Security Controls",
    speakerNotes: "Many victims assume their money is gone forever. RBI guidelines explicitly protect consumers with Zero Liability if reported within 3 days, forcing banks to provide shadow credit within 10 days."
  },
  {
    id: 6,
    title: "Digital Money & Blockchain Interaction",
    subtitle: "Tracing Cryptocurrency Cashouts, P2P Off-Ramps & CBDC (e-Rupee) Forensics",
    category: "Blockchain Analytics",
    badge: "Web3 & Ledger Forensics · Slide 6/10",
    summary: "How modern fraud rings attempt to launder UPI fiat into crypto assets, and how on-chain intelligence closes the loop.",
    keyPoints: [
      {
        heading: "The Fiat-to-Crypto P2P Bridge",
        description: "Criminals use stolen UPI balances to buy stablecoins (USDT) on P2P desks. The unsuspecting P2P seller receives frozen fiat, while the scammer receives clean on-chain tokens."
      },
      {
        heading: "On-Chain Transaction Graphing (TRC-20 / ERC-20)",
        description: "Forensic tracing tracks wallet cluster hops, mixer interactions (Tornado/Tumble), and deposits into centralized Virtual Digital Asset (VDA) exchanges."
      },
      {
        heading: "FIU-IND & Exchange Freeze Mandates",
        description: "Indian Financial Intelligence Unit (FIU-IND) mandates registered crypto exchanges to enforce KYC and execute immediate on-chain wallet blacklisting upon receiving police notices."
      },
      {
        heading: "RBI Digital Rupee (CBDC) Interoperability",
        description: "The RBI Central Bank Digital Currency (e-Rupee) utilizes a permissioned distributed ledger where every token's cryptographic lineage is auditable, making mule hops instantly traceable."
      }
    ],
    visualType: "diagram_blockchain",
    blockchainContext: "Chainalysis / Elliptic-style clustering combined with bank account metadata correlation.",
    speakerNotes: "Notice how blockchain is not just a fraudster hiding tool; the immutable ledger provides transparent evidentiary trails. With FIU-IND registration, Indian law enforcement freezes accounts on crypto exchanges within hours."
  },
  {
    id: 7,
    title: "On-Chain & Inter-Bank Ledger Correlation",
    subtitle: "Connecting Traditional Core Banking Solutions (CBS) with Distributed Ledgers",
    category: "Technical Architecture",
    badge: "Ledger Correlation · Slide 7/10",
    summary: "A unified forensic pipeline bridging UPI NPCI logs, ISO 20022 banking messages, and EVM/Tron blockchain transactions.",
    keyPoints: [
      {
        heading: "1. NPCI UPI Transaction Switch Log",
        description: "Captures RRN, Payer PSP, Payee PSP, IP address, Device IMEI/Android ID hash, and GPS coordinates at the instant of PIN verification."
      },
      {
        heading: "2. Core Banking Finacle / BaNCS Settlement",
        description: "Maps the credit into the recipient savings account and detects instantaneous automated sweep/IMPS transfers to Layer 2 and 3 mules."
      },
      {
        heading: "3. Blockchain Node Ingestion (Web3 RPC)",
        description: "Watches target deposit addresses on major crypto exchanges and detects smart contract minting or token transfers originating from flagged P2P orders."
      },
      {
        heading: "4. Unified Correlation Matrix",
        description: "Correlates bank transaction timestamps with on-chain mempool transactions to pinpoint the exact crypto off-ramp counterparty."
      }
    ],
    rbiCitation: "RBI Interoperable Regulatory Sandbox for Digital Ledger Technologies & NPCI API specs",
    speakerNotes: "By unifying banking switch logs with blockchain node indexing, investigators can unmask pseudonymous crypto wallets through the bank account credentials used to purchase the cryptocurrency."
  },
  {
    id: 8,
    title: "Victim Action Blueprint: Step-by-Step Recovery",
    subtitle: "From Immediate SOS to Court De-freezing Order & Account Restitution",
    category: "Recovery Blueprint",
    badge: "Action Protocol · Slide 8/10",
    summary: "The definitive 5-step legal and technical procedural checklist to recover lost online payments.",
    keyPoints: [
      {
        heading: "Step 1: Immediate Freeze Request (Minutes 0 - 60)",
        description: "Dial 1930 immediately. Note the CFCFRMS Acknowledgement Number. Contact your home bank to block the UPI handle and freeze the debit card."
      },
      {
        heading: "Step 2: Formal FIR & Written Bank Grievance (Day 1)",
        description: "Submit written dispute letter to home bank citing RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18. Attach screenshot of unauthorized debit, SMS, and 1930 ticket."
      },
      {
        heading: "Step 3: Section 102 CrPC Lien Confirmation (Days 2 - 5)",
        description: "The investigating cyber police officer issues an official requisition to the recipient bank to preserve the frozen balance under Section 102 of the Code of Criminal Procedure."
      },
      {
        heading: "Step 4: Banking Ombudsman Escalation (Day 30)",
        description: "If the bank fails to resolve or credit the disputed amount within 30 days, file an escalation on the RBI CMS Portal (cms.rbi.org.in) under the Integrated Ombudsman Scheme."
      },
      {
        heading: "Step 5: Magistrate Court Restitution Order (Sec 451/457 CrPC)",
        description: "Victim's counsel files an application before the local Judicial Magistrate under Section 457 CrPC for release of the frozen funds back into the victim's verified bank account."
      }
    ],
    rbiCitation: "Reserve Bank - Integrated Ombudsman Scheme, 2021 & Sections 102, 451, 457 Code of Criminal Procedure",
    speakerNotes: "This 5-step checklist demystifies the legal process. Most people give up after filing a police report, not knowing that Section 457 CrPC allows courts to release frozen lien amounts directly back to them."
  },
  {
    id: 9,
    title: "AI Sentinel: Automated Defense & Lien Triggering",
    subtitle: "How Our Hackathon Prototype Prevents and Mitigates Financial Loss",
    category: "Product Innovation",
    badge: "Prototype Defense · Slide 9/10",
    summary: "Integrating real-time anomaly detection with automated law enforcement notification and preventative cooling periods.",
    keyPoints: [
      {
        heading: "Pre-Transaction Prevention (Sub-15ms)",
        description: "Evaluates screen sharing hooks (AnyDesk/TeamViewer), unseasoned beneficiary age (<24h), and collect request vectors before the user types their UPI PIN."
      },
      {
        heading: "Enforced 4-Hour Cooling Windows",
        description: "Automatically enforces RBI-compliant cooling holds on high-risk transfers, allowing victims to cancel coerced transactions before money leaves the bank."
      },
      {
        heading: "Instant 1930 Dossier Compilation",
        description: "In the event of an anomalous debit, the AI compiles a one-click forensic packet containing RRN, device telemetry, and recipient VPA ready for police dispatch."
      },
      {
        heading: "Explainable Forensic Audit Trails",
        description: "Outputs mathematically grounded SHAP factor scores and Gemini 3.8 Flash incident reports admissible in banking ombudsman dispute proceedings."
      }
    ],
    visualType: "architecture_ai",
    speakerNotes: "Our prototype acts as both a shield and a recovery assistant. It halts high-risk attacks before execution, and should an unauthorized debit slip through, it generates a complete forensic dossier in seconds."
  },
  {
    id: 10,
    title: "Conclusion & Strategic Impact",
    subtitle: "Building a Trustworthy, Safe, and Fraud-Resilient Digital India",
    category: "Conclusion",
    badge: "Key Takeaways · Slide 10/10",
    summary: "Summary of technological innovations, regulatory alignment, and hackathon value delivery.",
    keyPoints: [
      {
        heading: "Triple-Layer Security",
        description: "Seamless convergence of Edge Device Telemetry, Deterministic Rule Gates, and Machine Learning Isolation Scoring."
      },
      {
        heading: "Regulatory Compliance",
        description: "Engineered strictly around RBI Customer Protection Circulars, NPCI Frameworks, and 1930 National Cyber Crime Reporting standards."
      },
      {
        heading: "Blockchain Transparency",
        description: "Ready for Central Bank Digital Currency (e-Rupee) distributed ledgers and crypto exchange off-ramp forensics."
      },
      {
        heading: "Citizen Empowerment",
        description: "Transforms confusing cyber law and banking protocols into actionable, real-time protection and transparent recovery pathways for 350+ million UPI users."
      }
    ],
    rbiCitation: "Vision 2025: Reserve Bank of India - Payments Vision 2025: E-Payments for Everyone, Everywhere, Everytime (4Es)",
    speakerNotes: "Thank you, judges! UPI Fraud Sentinel proves that with explainable AI, strict adherence to RBI guidelines, and multi-ledger tracking, we can safeguard the future of digital payments. We are now open for your questions."
  }
];
