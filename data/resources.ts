export type ResourceType = "VIDEO" | "IMAGE" | "DOCUMENT" | "MAP" | "TEXT";

export interface CaseResource {
  id: string;
  caseId: string;
  title: string;
  type: ResourceType;
  description: string;
  source: string;
  link: string;
  tags: string[];
  timestamp: string;
  badge?: "NEW" | "TRENDING" | "CRITICAL";
}

export const CASE_RESOURCES: CaseResource[] = [
  {
    id: "res-001",
    caseId: "CASE-2025-0014",
    title: "ICIJ Ownership Tracker",
    type: "DOCUMENT",
    description: "Beneficial ownership tree exported from the Pandora Papers dataset.",
    source: "ICIJ Offshore Leaks",
    link: "https://offshoreleaks.icij.org/stories/meridian",
    tags: ["ownership", "papers", "beneficial"],
    timestamp: "2026-03-28",
    badge: "TRENDING",
  },
  {
    id: "res-002",
    caseId: "CASE-2025-0014",
    title: "Satellite Visual — Headquarters",
    type: "MAP",
    description: "Geolocated imagery showing the headquarters compound in Geneva.",
    source: "Planet Labs / Sentinel",
    link: "https://maps.signaldesk.co/meridian-hq",
    tags: ["geolocation", "satellite", "property"],
    timestamp: "2026-03-29",
  },
  {
    id: "res-003",
    caseId: "CASE-2025-0014",
    title: "Meridian Capital Interview Cut",
    type: "VIDEO",
    description: "Embedded clip with analyst explaining the ownership stitch.",
    source: "Internal Evidence Locker",
    link: "https://signaldesk.co/embed/meridian-interview",
    tags: ["video", "interview", "analytic"],
    timestamp: "2026-04-01",
    badge: "NEW",
  },
  {
    id: "res-004",
    caseId: "CASE-2025-0013",
    title: "OCCRP Sanctions Bulletin",
    type: "TEXT",
    description: "Summary text excerpt detailing newly exposed shell company relationships.",
    source: "OCCRP",
    link: "https://occrp.org/en/sanctions/arktis",
    tags: ["sanctions", "text"],
    timestamp: "2026-04-02",
  },
  {
    id: "res-005",
    caseId: "CASE-2025-0013",
    title: "Flowchart — Ownership Chain",
    type: "IMAGE",
    description: "Annotated flowchart produced by researchers linking cross-border entities.",
    source: "Internal Charting",
    link: "https://signaldesk.co/flowcharts/arktis",
    tags: ["chart", "image"],
    timestamp: "2026-04-01",
    badge: "CRITICAL",
  },
  {
    id: "res-006",
    caseId: "CASE-2025-0012",
    title: "Finance Uncovered Briefing",
    type: "DOCUMENT",
    description: "PDF investigation into adverse media coverage of Novus Pharma supply chain.",
    source: "Finance Uncovered",
    link: "https://financeuncovered.org/novus-media",
    tags: ["brief", "pdf"],
    timestamp: "2026-03-31",
  },
  {
    id: "res-007",
    caseId: "CASE-2025-0012",
    title: "Adverse Media Timeline",
    type: "MAP",
    description: "Timeline map layering media hits with geographic mentions.",
    source: "Signal Desk Visuals",
    link: "https://signaldesk.co/maps/novus-timeline",
    tags: ["timeline", "map"],
    timestamp: "2026-04-02",
  },
];
