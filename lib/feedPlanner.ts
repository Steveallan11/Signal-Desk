import {
  DATABASES,
  FORUM_FEEDS,
  ROUTINE_STEPS,
  ScanSource,
  ScanTier,
  SOCIAL_ACCOUNTS,
  SOCIAL_SEARCHES,
  STORY_SCORING_CHECKLIST,
  TIER1_SOURCES,
  TIER2_SOURCES,
  TIER3_SOURCES,
} from "@/data/feeds";

export interface ScheduledRun {
  window: string;
  focus: string;
  sources: ScanSource[];
  social?: { accounts: string[]; searches: string[] };
}

export interface FeedAlert {
  id: string;
  source: ScanSource;
  reason: string;
  trendingScore: number;
}

export interface StoryScore {
  total: number;
  checked: Record<string, boolean>;
}

const tierMap: Record<ScanTier, ScanSource[]> = {
  1: TIER1_SOURCES,
  2: TIER2_SOURCES,
  3: TIER3_SOURCES,
};

export function buildScheduledRuns(): ScheduledRun[] {
  return ROUTINE_STEPS.map((step) => {
    const tierSources =
      step.timeUTC === "07:00"
        ? [...TIER1_SOURCES, ...FORUM_FEEDS]
        : step.timeUTC === "14:00"
        ? [...TIER1_SOURCES, ...TIER2_SOURCES, ...FORUM_FEEDS]
        : [...TIER1_SOURCES, ...TIER2_SOURCES, ...TIER3_SOURCES, ...FORUM_FEEDS];

    return {
      window: step.timeUTC,
      focus: step.description,
      sources: tierSources,
      social: {
        accounts: SOCIAL_ACCOUNTS,
        searches: SOCIAL_SEARCHES,
      },
    };
  });
}

export function suggestTopFeedAlerts(
  alerts: FeedAlert[],
  limit = 5
): FeedAlert[] {
  return [...alerts]
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

export function scoreStory(checked: Record<string, boolean>): StoryScore {
  const total = STORY_SCORING_CHECKLIST.reduce(
    (sum, box) => sum + (checked[box.key] ? 1 : 0),
    0
  );

  return { total, checked };
}

export function describeSourcesByTier(tier: ScanTier): string[] {
  const sources = tierMap[tier] || [];
  return sources.map((source) => `${source.name} (${source.url})`);
}

export function getKeyDatabases(): string[] {
  return DATABASES.map((db) => `${db.name} — ${db.purpose}`);
}
