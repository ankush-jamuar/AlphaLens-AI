/**
 * AlphaLens AI — Realistic Mock Investment Data
 *
 * Used in Milestone 1 to populate report cards with realistic placeholder data.
 * TODO [Milestone 2]: Replace with live data returned by POST /api/analyze.
 */

import type { InvestmentReport, HistoryEntry } from "@/types";

// ---------------------------------------------------------------------------
// Mock NVIDIA Report
// ---------------------------------------------------------------------------

export const MOCK_NVIDIA_REPORT: InvestmentReport = {
  id: "mock-nvda-001",
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  company: {
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    industry: "Semiconductors",
    headquarters: "Santa Clara, California, USA",
    description:
      "NVIDIA is a global leader in accelerated computing, specializing in graphics processing units (GPUs) for gaming, professional visualization, data centers, and autonomous vehicles. The company's CUDA platform and AI infrastructure have positioned it as the dominant hardware provider for the generative AI boom.",
    marketCap: "$2.9T",
  },
  financials: {
    revenue: "$130.5B (TTM)",
    netIncome: "$72.9B (TTM)",
    eps: "$29.32",
    peRatio: "39.2x",
    debt: "$8.5B",
    cashFlow: "$60.8B (FCF)",
  },
  market: {
    strengths: [
      "Dominant market share in AI training GPUs (>80%)",
      "Proprietary CUDA ecosystem creates high switching costs",
      "Strong relationships with hyperscalers (Microsoft, Google, Amazon)",
      "Data center revenue growing at 122% YoY",
      "First-mover advantage in AI infrastructure",
    ],
    weaknesses: [
      "Highly concentrated customer base among hyperscalers",
      "Significant valuation premium limits margin of safety",
      "Revenue dependent on continued AI capital expenditure cycle",
      "Supply chain constraints affecting delivery timelines",
    ],
    competitors: [
      "AMD (Radeon Instinct GPUs)",
      "Intel (Gaudi AI accelerators)",
      "Google (TPU custom silicon)",
      "Amazon (Trainium/Inferentia)",
      "Qualcomm (AI inference edge chips)",
    ],
  },
  news: [
    {
      title: "NVIDIA Blackwell GPU Architecture Ships to Major Cloud Providers",
      summary:
        "NVIDIA began volume shipments of its Blackwell B200 GPU architecture to Microsoft Azure, Google Cloud, and Amazon AWS. The new generation offers 4x the training performance of H100 at comparable power efficiency.",
      impact: "Positive",
    },
    {
      title: "US Export Restrictions Tightened on AI Chips to China",
      summary:
        "The Biden administration expanded restrictions on advanced semiconductor exports to China, affecting NVIDIA's H800 and A800 products. China represented approximately 17% of data center revenue.",
      impact: "Negative",
    },
    {
      title: "NVIDIA Partners with Leading Pharmaceutical Companies for AI Drug Discovery",
      summary:
        "NVIDIA announced BioNeMo partnerships with Pfizer, Novartis, and AstraZeneca to accelerate drug discovery using AI, opening a new vertical market beyond traditional cloud computing.",
      impact: "Positive",
    },
    {
      title: "Competitor AMD Releases MI300X with Competitive HBM Memory Configuration",
      summary:
        "AMD launched its MI300X accelerator with 192GB HBM3 memory, offering competitive performance for large language model inference workloads at a lower price point.",
      impact: "Neutral",
    },
  ],
  risks: [
    "Geopolitical risk: US-China export restrictions could eliminate ~17% of revenue",
    "Cyclicality: AI infrastructure spending may moderate after hyperscaler capex peak",
    "Valuation risk: P/E of 39x leaves little room for earnings misses",
    "Customer concentration: Top 5 customers represent >60% of data center revenue",
    "Regulatory risk: Potential antitrust scrutiny of CUDA ecosystem lock-in",
    "Competition: AMD, Intel, and custom silicon from hyperscalers could erode share",
  ],
  opportunities: [
    "Autonomous vehicles: NVIDIA Drive platform positions the company for a $10T+ TAM",
    "Robotics: Humanoid robot AI processing is an emerging large market",
    "Healthcare AI: Drug discovery, medical imaging, and genomics represent $500B+ TAM",
    "Sovereign AI: National AI infrastructure investments across 50+ countries",
    "Edge AI inference: As AI moves to edge devices, NVIDIA's Jetson platform scales",
    "Software monetization: CUDA, cuDNN, and NIM microservices create recurring revenue",
  ],
  recommendation: {
    decision: "Invest",
    score: 87,
    confidence: 82,
    thesis:
      "NVIDIA holds an unmatched structural advantage in the AI compute infrastructure cycle. The CUDA ecosystem creates durable switching costs that protect margins even as competition intensifies. With data center revenue growing at triple-digit rates, multiple new verticals opening (healthcare, robotics, automotive), and the Blackwell architecture extending its performance lead, NVIDIA remains the highest-conviction AI infrastructure investment despite its premium valuation.",
    positives: [
      "Dominant market share with durable competitive moat",
      "Accelerating revenue from the global AI infrastructure buildout",
      "Multiple new verticals (robotics, healthcare, autonomous driving) expanding TAM",
      "Management track record of executing technological transitions",
      "Blackwell architecture extends performance leadership through 2026",
    ],
    negatives: [
      "Premium valuation at 39x earnings requires sustained execution",
      "Geopolitical headwinds from US-China export restrictions",
      "Customer concentration risk among a small number of hyperscalers",
      "Revenue growth may moderate as AI capex cycle normalizes",
    ],
  },
  sources: [
    {
      title: "NVIDIA Q4 FY2025 Earnings Release",
      url: "https://investor.nvidia.com/financial-information/quarterly-earnings",
    },
    {
      title: "NVIDIA Annual Report 2025 (10-K)",
      url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=NVDA",
    },
    {
      title: "Reuters: NVIDIA Blackwell Shipments Begin",
      url: "https://www.reuters.com",
    },
    {
      title: "Bloomberg: US AI Chip Export Restrictions",
      url: "https://www.bloomberg.com",
    },
    {
      title: "Yahoo Finance: NVDA Stock Analysis",
      url: "https://finance.yahoo.com/quote/NVDA",
    },
  ],
};

// ---------------------------------------------------------------------------
// Mock History Entries
// ---------------------------------------------------------------------------

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "mock-nvda-001",
    companyName: "NVIDIA Corporation",
    recommendation: "Invest",
    score: 87,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    report: MOCK_NVIDIA_REPORT,
  },
  {
    id: "mock-msft-002",
    companyName: "Microsoft Corporation",
    recommendation: "Invest",
    score: 84,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    report: {
      ...MOCK_NVIDIA_REPORT,
      id: "mock-msft-002",
      company: {
        name: "Microsoft Corporation",
        ticker: "MSFT",
        industry: "Cloud & Enterprise Software",
        headquarters: "Redmond, Washington, USA",
        description: "Microsoft is a global technology leader in cloud computing, productivity software, and AI services.",
        marketCap: "$3.1T",
      },
      recommendation: { ...MOCK_NVIDIA_REPORT.recommendation, decision: "Invest", score: 84, confidence: 88 },
    },
  },
  {
    id: "mock-tsla-003",
    companyName: "Tesla, Inc.",
    recommendation: "Watch",
    score: 63,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    report: {
      ...MOCK_NVIDIA_REPORT,
      id: "mock-tsla-003",
      company: {
        name: "Tesla, Inc.",
        ticker: "TSLA",
        industry: "Electric Vehicles & Clean Energy",
        headquarters: "Austin, Texas, USA",
        description: "Tesla designs and manufactures electric vehicles, battery energy storage, and solar products.",
        marketCap: "$820B",
      },
      recommendation: { ...MOCK_NVIDIA_REPORT.recommendation, decision: "Watch", score: 63, confidence: 71 },
    },
  },
  {
    id: "mock-reli-004",
    companyName: "Reliance Industries",
    recommendation: "Watch",
    score: 68,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    report: {
      ...MOCK_NVIDIA_REPORT,
      id: "mock-reli-004",
      company: {
        name: "Reliance Industries Limited",
        ticker: "RELIANCE.NS",
        industry: "Conglomerate",
        headquarters: "Mumbai, Maharashtra, India",
        description: "Reliance Industries is India's largest conglomerate operating across petrochemicals, retail, telecom, and digital services.",
        marketCap: "₹19.2T",
      },
      recommendation: { ...MOCK_NVIDIA_REPORT.recommendation, decision: "Watch", score: 68, confidence: 74 },
    },
  },
];
