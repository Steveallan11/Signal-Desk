export interface CaseBrief {
  id: string;
  caseId: string;
  title: string;
  summary: string;
  score: number;
  trending: boolean;
  viralityPotential: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
}

export const CASE_BRIEFS: CaseBrief[] = [
  {
    id: "brief-001",
    caseId: "CASE-2025-0014",
    title: "Meridian Capital beneficial ownership chain",
    summary:
      "Public filings plus Panama Papers entities show a complex BVI chain that can be mapped to a Geneva HQ and luxury assets.",
    score: 9,
    trending: true,
    viralityPotential: "HIGH",
    tags: ["ownership", "panama", "luxury"],
  },
  {
    id: "brief-002",
    caseId: "CASE-2025-0013",
    title: "Arktis Holdings sanctions exposure wave",
    summary:
      "New regulatory filings plus social chatter reveal connections to sanctioned vessels and payment processors.",
    score: 8,
    trending: true,
    viralityPotential: "MEDIUM",
    tags: ["sanctions", "crypto", "payments"],
  },
  {
    id: "brief-003",
    caseId: "CASE-2025-0012",
    title: "Novus Pharma adverse media event",
    summary:
      "Recent allegations about product efficacy are tied to a network of shell companies and UK distributors.",
    score: 7,
    trending: false,
    viralityPotential: "MEDIUM",
    tags: ["pharma", "media", "compliance"],
  },
  {
    id: "brief-004",
    caseId: "CASE-2025-0009",
    title: "Cascade Logistics ownership chain",
    summary:
      "Cascade appears to be routing freight for sanctioned entities; quick verification of ownership might surface new clients.",
    score: 6,
    trending: false,
    viralityPotential: "LOW",
    tags: ["logistics", "sanctions"],
  },
  {
    id: "brief-005",
    caseId: "CASE-2025-0010",
    title: "Redwood Media web infrastructure audit",
    summary:
      "Infrastructure overlaps with dark web domains and offshore hosting; prepping due diligence with recall of prior audits.",
    score: 7,
    trending: true,
    viralityPotential: "MEDIUM",
    tags: ["infrastructure", "hosting"],
  },
];

export interface BriefFilterOptions {
  limit?: number;
  trendingOnly?: boolean;
  minScore?: number;
}

export function getTopBriefs(options: BriefFilterOptions = {}): CaseBrief[] {
  const { limit = 5, trendingOnly = false, minScore = 0 } = options;
  return CASE_BRIEFS.filter((brief) => {
    if (trendingOnly && !brief.trending) {
      return false;
    }
    return brief.score >= minScore;
  })
    .sort((a, b) => (b.score - a.score) || (b.trending === a.trending ? 0 : b.trending ? 1 : -1))
    .slice(0, limit);
}
