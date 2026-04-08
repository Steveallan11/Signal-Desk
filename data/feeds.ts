export type ScanTier = 1 | 2 | 3;

export type ScanFrequency = "DAILY" | "EVERY_3_DAYS" | "WEEKLY" | "ON_DEMAND";

export interface ScanSource {
  id: string;
  name: string;
  url: string;
  tier: ScanTier;
  category:
    | "INVESTIGATIVE_JOURNALISM"
    | "ENFORCEMENT"
    | "SOCIAL_MEDIA"
    | "DATABASE"
    | "FORUM"
    | "POLICY"
    | "CRYPTO"
    | "OTHER";
  platform?: string;
  notes: string;
}

export interface RoutineStep {
  timeUTC: string;
  description: string;
  focus?: string;
}

export interface ScoreCheckbox {
  label: string;
  key: string;
}

export const TIER1_SOURCES: ScanSource[] = [
  {
    id: "icij",
    name: "ICIJ",
    url: "https://icij.org/investigations",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "New investigations, database updates",
  },
  {
    id: "occrp",
    name: "OCCRP",
    url: "https://occrp.org/en",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Corruption, organized crime, offshore finance",
  },
  {
    id: "bellingcat",
    name: "Bellingcat",
    url: "https://bellingcat.com",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "New investigations, methodology, tool updates",
  },
  {
    id: "finance-uncovered",
    name: "Finance Uncovered",
    url: "https://financeuncovered.org",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "UK financial crime, tax, offshore property",
  },
  {
    id: "global-witness",
    name: "Global Witness",
    url: "https://globalwitness.org/en/blog",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Corporate corruption, dirty money",
  },
  {
    id: "transparency",
    name: "Transparency International",
    url: "https://transparency.org/en/news",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Corruption reports, enforcement updates",
  },
  {
    id: "bureau",
    name: "The Bureau of Investigative Journalism",
    url: "https://thebureauinvestigates.com",
    tier: 1,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "UK-focused financial crime and corporate investigations",
  },
  {
    id: "ofac-new",
    name: "OFAC New Actions",
    url: "https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "Daily sanction designations",
  },
  {
    id: "doj",
    name: "DOJ Press Releases",
    url: "https://justice.gov/news",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "Indictments, guilty pleas, settlements",
  },
  {
    id: "ofsi",
    name: "OFSI UK Sanctions",
    url: "https://gov.uk/government/collections/ofsi-enforcement",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "UK sanctions designations",
  },
  {
    id: "companies-house-news",
    name: "Companies House News",
    url: "https://companieshouse.gov.uk/about/news",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "Registry enforcement, strike-offs",
  },
  {
    id: "fca",
    name: "UK FCA Enforcement",
    url: "https://fca.org.uk/news/press-releases",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "UK financial crime enforcement",
  },
  {
    id: "fincen",
    name: "FinCEN Advisories",
    url: "https://fincen.gov/resources/advisories",
    tier: 1,
    category: "ENFORCEMENT",
    notes: "AML alerts and typologies",
  },
];

export const TIER2_SOURCES: ScanSource[] = [
  {
    id: "aleph",
    name: "OCCRP Aleph",
    url: "https://aleph.occrp.org",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Document sets and entity updates",
  },
  {
    id: "propublica",
    name: "ProPublica",
    url: "https://propublica.org/investigations",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "US corporate/government investigations",
  },
  {
    id: "ddosecrets",
    name: "Distributed Denial of Secrets",
    url: "https://ddosecrets.com",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Public-interest document releases",
  },
  {
    id: "ftmn",
    name: "Follow The Money",
    url: "https://ftm.eu",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "European financial investigations",
  },
  {
    id: "vsquare",
    name: "VSquare / Investigace.cz",
    url: "https://vsquare.org",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Central/Eastern Europe investigations",
  },
  {
    id: "reporting-democracy",
    name: "Reporting Democracy",
    url: "https://reportingdemocracy.org",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Balkan corruption and organized crime",
  },
  {
    id: "gfi",
    name: "Global Financial Integrity",
    url: "https://gfintegrity.org/reports",
    tier: 2,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Illicit financial flows data",
  },
  {
    id: "eu-sanctions",
    name: "EU Sanctions Map",
    url: "https://sanctionsmap.eu",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "EU designations",
  },
  {
    id: "un-sanctions",
    name: "UN Security Council Sanctions",
    url: "https://un.org/securitycouncil/sanctions",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "Global sanctions regimes",
  },
  {
    id: "opensanctions-blog",
    name: "OpenSanctions Blog",
    url: "https://opensanctions.org/articles",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "Data updates and entity matches",
  },
  {
    id: "trmlabs",
    name: "TRM Labs Blog",
    url: "https://trmlabs.com/resources/blog",
    tier: 2,
    category: "CRYPTO",
    notes: "Crypto crime and sanctions evasion",
  },
  {
    id: "chainalysis",
    name: "Chainalysis Blog",
    url: "https://chainalysis.com/blog",
    tier: 2,
    category: "CRYPTO",
    notes: "Blockchain crime reports",
  },
  {
    id: "kharon",
    name: "Kharon Brief",
    url: "https://kharon.com/brief",
    tier: 2,
    category: "CRYPTO",
    notes: "Sanctions evasion and corporate risk",
  },
  {
    id: "elliptic-blog",
    name: "Elliptic Blog",
    url: "https://elliptic.co/blog",
    tier: 2,
    category: "CRYPTO",
    notes: "Crypto sanctions and exchange investigations",
  },
  {
    id: "aml-intel",
    name: "AML Intelligence",
    url: "https://amlintelligence.com",
    tier: 2,
    category: "POLICY",
    notes: "UK AML enforcement and compliance news",
  },
  {
    id: "global-investigations-review",
    name: "Global Investigations Review",
    url: "https://globalinvestigationsreview.com",
    tier: 2,
    category: "POLICY",
    notes: "Corporate investigations, enforcement",
  },
  {
    id: "compliance-week",
    name: "Compliance Week",
    url: "https://complianceweek.com",
    tier: 2,
    category: "POLICY",
    notes: "Regulatory updates, enforcement actions",
  },
  {
    id: "law360",
    name: "Law360 White Collar",
    url: "https://law360.com/whitecollar",
    tier: 2,
    category: "POLICY",
    notes: "US corporate crime and indictments",
  },
  {
    id: "acams",
    name: "ACAMS Today",
    url: "https://acams.org/en/media/article",
    tier: 2,
    category: "POLICY",
    notes: "AML case studies and typologies",
  },
  {
    id: "money-laundering-watch",
    name: "Money Laundering Watch",
    url: "https://moneylaunderingnews.com",
    tier: 2,
    category: "POLICY",
    notes: "AML enforcement and analysis",
  },
  {
    id: "rusi",
    name: "RUSI Publications",
    url: "https://rusi.org/publications",
    tier: 2,
    category: "POLICY",
    notes: "Financial crime, sanctions policy",
  },
  {
    id: "land-registry",
    name: "UK Land Registry Blog",
    url: "https://landregistry.data.gov.uk",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "Property ownership data updates",
  },
  {
    id: "nca",
    name: "NCA News",
    url: "https://nationalcrimeagency.gov.uk/news",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "UK organized crime operations",
  },
  {
    id: "sfo",
    name: "Serious Fraud Office",
    url: "https://sfo.gov.uk/press-room",
    tier: 2,
    category: "ENFORCEMENT",
    notes: "UK corporate fraud investigations",
  },
  {
    id: "tax-justice",
    name: "Tax Justice Network",
    url: "https://taxjustice.net/blog",
    tier: 2,
    category: "POLICY",
    notes: "Tax haven data and ownership gaps",
  },
];

export const TIER3_SOURCES: ScanSource[] = [
  {
    id: "carnegie",
    name: "Carnegie Endowment",
    url: "https://carnegieendowment.org",
    tier: 3,
    category: "POLICY",
    notes: "Kleptocracy and corruption analysis",
  },
  {
    id: "c4ads",
    name: "C4ADS",
    url: "https://c4ads.org",
    tier: 3,
    category: "POLICY",
    notes: "Illicit networks and sanctions busting",
  },
  {
    id: "chatham-house",
    name: "Chatham House",
    url: "https://chathamhouse.org/publications",
    tier: 3,
    category: "POLICY",
    notes: "Financial crime policy",
  },
  {
    id: "transparency-uk",
    name: "Transparency International UK",
    url: "https://transparency.org.uk/news",
    tier: 3,
    category: "POLICY",
    notes: "UK-specific corruption reports",
  },
  {
    id: "taxjustice-reports",
    name: "Tax Justice Network Reports",
    url: "https://taxjustice.net/reports",
    tier: 3,
    category: "POLICY",
    notes: "Annual indices and country reports",
  },
  {
    id: "global-witness-reports",
    name: "Global Witness Reports",
    url: "https://globalwitness.org/en/campaigns",
    tier: 3,
    category: "INVESTIGATIVE_JOURNALISM",
    notes: "Deep report releases",
  },
  {
    id: "record",
    name: "The Record (Recorded Future)",
    url: "https://therecord.media",
    tier: 3,
    category: "CRYPTO",
    notes: "Cybercrime, ransomware, crypto",
  },
  {
    id: "coindesk",
    name: "CoinDesk Investigations",
    url: "https://coindesk.com/tag/investigations",
    tier: 3,
    category: "CRYPTO",
    notes: "Exchange fraud and regulatory actions",
  },
  {
    id: "cryptoslate",
    name: "CryptoSlate Investigations",
    url: "https://cryptoslate.com/investigations",
    tier: 3,
    category: "CRYPTO",
    notes: "Emerging crypto crime stories",
  },
  {
    id: "decrypt",
    name: "Decrypt Investigations",
    url: "https://decrypt.co/investigations",
    tier: 3,
    category: "CRYPTO",
    notes: "Crypto fraud and enforcement",
  },
];

export const SOCIAL_ACCOUNTS = [
  "@Bellingcat",
  "@OCCRP",
  "@ICIJorg",
  "@GrahamBarrow",
  "@TomBergin",
  "@TRMLabs",
  "@Elliptic",
  "@NatSecGeek",
  "@kzau",
  "@olivermoody",
  "@FinancialCrime",
  "@EliotHiggins",
  "@carolineorr",
];

export const SOCIAL_SEARCHES = [
  '"Companies House" fraud OR shell',
  '"beneficial ownership" UK',
  '"sanctions evasion" 2026',
  '"money laundering" indictment',
  "OFAC designation",
  '"offshore" "UK property"',
  '"due diligence" scandal',
  '"shell company" investigation',
  '"Pandora Papers" OR "Panama Papers" new',
  '"beneficial owner" register gap',
];

export const DATABASES = [
  {
    name: "ICIJ Offshore Leaks",
    url: "https://offshoreleaks.icij.org",
    purpose: "Panama/Pandora/Paradise Papers entity search",
  },
  {
    name: "OCCRP Aleph",
    url: "https://aleph.occrp.org",
    purpose: "Document and entity search across leaks",
  },
  {
    name: "OpenSanctions",
    url: "https://opensanctions.org",
    purpose: "Sanctions and PEP database",
  },
  {
    name: "OpenCorporates",
    url: "https://opencorporates.com",
    purpose: "Global company registry search",
  },
  {
    name: "Companies House",
    url: "https://find-and-update.company-information.service.gov.uk",
    purpose: "UK company search",
  },
  {
    name: "Register of Overseas Entities",
    url: "https://find-and-update.company-information.service.gov.uk/register-an-overseas-entity",
    purpose: "UK overseas property ownership",
  },
  {
    name: "UK Land Registry",
    url: "https://landregistry.data.gov.uk",
    purpose: "UK property ownership",
  },
  {
    name: "OFAC SDN List",
    url: "https://sanctionssearch.ofac.treas.gov",
    purpose: "US sanctions search",
  },
  {
    name: "EU Sanctions",
    url: "https://sanctionsmap.eu",
    purpose: "EU sanctions search",
  },
  {
    name: "World-Check (Refinitiv)",
    url: "https://refinitiv.com/en/financial-data/risk-intelligence",
    purpose: "PEP and sanctions (paid) lookup",
  },
];

export const FORUM_FEEDS: ScanSource[] = [
  {
    id: "bellingcat-discord",
    name: "Bellingcat Discord",
    url: "https://discord.gg/bellingcat",
    tier: 1,
    category: "FORUM",
    platform: "Discord",
    notes: "Live investigations, pre-publication chatter",
  },
  {
    id: "osint-team",
    name: "OSINT.team",
    url: "https://t.me/osint_team",
    tier: 1,
    category: "FORUM",
    platform: "Telegram",
    notes: "Tool updates and community finds",
  },
  {
    id: "occrp-telegram",
    name: "OCCRP Telegram",
    url: "https://t.me/occrp",
    tier: 1,
    category: "FORUM",
    platform: "Telegram",
    notes: "Story alerts",
  },
  {
    id: "reddit-osint",
    name: "r/OSINT",
    url: "https://reddit.com/r/OSINT",
    tier: 1,
    category: "FORUM",
    platform: "Reddit",
    notes: "Tools and community investigations",
  },
  {
    id: "reddit-moneylaundering",
    name: "r/moneylaundering",
    url: "https://reddit.com/r/moneylaundering",
    tier: 1,
    category: "FORUM",
    platform: "Reddit",
    notes: "Cases and enforcement news",
  },
  {
    id: "reddit-corrupt",
    name: "r/Corrupt",
    url: "https://reddit.com/r/Corrupt",
    tier: 1,
    category: "FORUM",
    platform: "Reddit",
    notes: "Corruption stories",
  },
  {
    id: "reddit-unitedkingdom",
    name: "r/unitedkingdom",
    url: "https://reddit.com/r/unitedkingdom",
    tier: 1,
    category: "FORUM",
    platform: "Reddit",
    notes: "UK fraud threads",
  },
];

export const ROUTINE_STEPS: RoutineStep[] = [
  {
    timeUTC: "07:00",
    description: "Check OFAC, DOJ, OCCRP, ICIJ, Companies House, FCA, Tier 1 social accounts, and searches",
  },
  {
    timeUTC: "14:00",
    description: "Review Bellingcat channels, Finance Uncovered, TRM/Chainalysis, Reddit/Telegram communities",
  },
  {
    timeUTC: "18:00",
    description: "Score discoveries, categorize outputs, and report to CEO",
  },
];

export const RSS_FEEDS = [
  "https://icij.org/feed/",
  "https://occrp.org/en/feed.rss",
  "https://bellingcat.com/feed/",
  "https://financeuncovered.org/feed/",
  "https://globalwitness.org/en/feed/",
  "https://thebureauinvestigates.com/feed/",
  "https://justice.gov/feed/press-releases/rss.xml",
  "https://fca.org.uk/news/rss.xml",
  "https://trmlabs.com/feed/",
  "https://elliptic.co/feed/",
  "https://opensanctions.org/articles/feed/",
  "https://taxjustice.net/feed/",
  "https://transparency.org/en/feed",
  "https://moneylaunderingnews.com/feed/",
];

export const STORY_SCORING_CHECKLIST: ScoreCheckbox[] = [
  { key: "publicSubject", label: "Subject is a public figure, company, or institution" },
  { key: "publicRecord", label: "Sufficient public record exists" },
  { key: "newAngle", label: "Story is not saturated by major outlets" },
  { key: "structure", label: "Corporate structure or financial chain exists" },
  { key: "signalDeskMatch", label: "Connects to Signal Desk niches" },
  { key: "videoPotential", label: "Has video content potential" },
  { key: "evidenceReady", label: "Enough data for evidence-backed report" },
];
