export type SourceType =
  | "website"
  | "forum"
  | "social_account"
  | "news_site"
  | "registry"
  | "other";

export type ScanFrequency = "6h" | "12h" | "24h" | "manual";

export interface SourceRecord {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  watchlistIds: string[];
  keywords: string[];
  entities: string[];
  frequency: ScanFrequency;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  approved: boolean;
  riskNotes: string;
  accessNotes: string;
  lastScanned: string;
}

export interface WatchlistRecord {
  id: string;
  name: string;
  subjects: string[];
  aliases: string[];
  companyNames: string[];
  directors: string[];
  domains: string[];
  keywords: string[];
  hashtags: string[];
  excludedTerms: string[];
  priority: "LOW" | "MEDIUM" | "HIGH";
  linkedCaseIds: string[];
}

export const SOURCE_REGISTRY: SourceRecord[] = [
  {
    id: "src-icij",
    name: "ICIJ Investigations",
    url: "https://icij.org/investigations",
    type: "news_site",
    watchlistIds: ["wl-sanctions", "wl-ownership"],
    keywords: ["leaks", "beneficial ownership", "offshore"],
    entities: ["Panama Papers", "LeakTruth"],
    frequency: "24h",
    priority: "HIGH",
    status: "ACTIVE",
    approved: true,
    riskNotes: "Fresh leaks require extra preservation.",
    accessNotes: "Website public, RSS preferred.",
    lastScanned: "03:47 UTC",
  },
  {
    id: "src-occrp",
    name: "OCCRP",
    url: "https://occrp.org/en",
    type: "news_site",
    watchlistIds: ["wl-sanctions"],
    keywords: ["corruption", "offshore finance"],
    entities: ["OCCRP", "Aleph Archive"],
    frequency: "12h",
    priority: "HIGH",
    status: "ACTIVE",
    approved: true,
    riskNotes: "Ensure archive of original PDF references.",
    accessNotes: "Public stories, watch for embargoed updates.",
    lastScanned: "02:39 UTC",
  },
  {
    id: "src-doj",
    name: "DOJ Press",
    url: "https://justice.gov/news",
    type: "registry",
    watchlistIds: ["wl-sanctions"],
    keywords: ["indictment", "charging", "evidence"],
    entities: ["DOJ", "USAO"],
    frequency: "6h",
    priority: "HIGH",
    status: "ACTIVE",
    approved: true,
    riskNotes: "High sensitivity documents, archive immediately.",
    accessNotes: "Government site, stable HTML.",
    lastScanned: "04:12 UTC",
  },
  {
    id: "src-telegram-osint",
    name: "OSINT Telegram",
    url: "https://t.me/osint_team",
    type: "forum",
    watchlistIds: ["wl-ownership"],
    keywords: ["tool updates", "signal"],
    entities: ["OSINT.team"],
    frequency: "12h",
    priority: "MEDIUM",
    status: "PAUSED",
    approved: false,
    riskNotes: "Need legal review before collecting from chat logs.",
    accessNotes: "Public chat, watch for deleted posts.",
    lastScanned: "N/A",
  },
];

export const WATCHLISTS: WatchlistRecord[] = [
  {
    id: "wl-sanctions",
    name: "Sanctions Watch",
    subjects: ["Arktis Holdings SA", "Cascade Logistics"],
    aliases: ["Arktis Group", "Cascade Freight"],
    companyNames: ["Arktis Holdings", "Cascade Logistics Ltd."],
    directors: ["G.M. Rojas", "L. Faraday"],
    domains: ["arktispay.com", "cascade-logistics.co.uk"],
    keywords: ["payments", "shipments", "shell company"],
    hashtags: ["#sanctions", "#AML"],
    excludedTerms: ["job board", "press office"],
    priority: "HIGH",
    linkedCaseIds: ["CASE-2025-0013", "CASE-2025-0009"],
  },
  {
    id: "wl-ownership",
    name: "Ownership Mapping",
    subjects: ["Meridian Capital Ltd", "Redwood Media Group"],
    aliases: ["Meridian Capital", "Redwood Media"],
    companyNames: ["Meridian Capital Ltd", "Redwood Media Group"],
    directors: ["I. Navarro"],
    domains: ["meridiancapital.com", "redwoodmediagroup.com"],
    keywords: ["beneficial ownership", "Panama"],
    hashtags: ["#ownership", "#leaks"],
    excludedTerms: ["investment blog"],
    priority: "MEDIUM",
    linkedCaseIds: ["CASE-2025-0014", "CASE-2025-0010"],
  },
];
