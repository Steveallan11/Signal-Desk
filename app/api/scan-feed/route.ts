import Parser from 'rss-parser';
import type { ScanFeedResponse, ScanSignal } from '@/lib/types/scan';

const FEEDS = [
  {
    id: 'icij',
    name: 'ICIJ Investigations',
    url: 'https://icij.org/feed/',
    category: 'Investigative Journalism',
  },
  {
    id: 'occrp',
    name: 'OCCRP News',
    url: 'https://occrp.org/en/feed.rss',
    category: 'Investigative Journalism',
  },
  {
    id: 'transparency',
    name: 'Transparency International',
    url: 'https://transparency.org/en/feed',
    category: 'Policy & Enforcement',
  },
];

const parser = new Parser({ timeout: 10000 });

const flattenEntries = async (): Promise<ScanSignal[]> => {
  const allSignals: ScanSignal[] = [];

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items.slice(0, 5);
      for (const entry of items) {
        allSignals.push({
          id: `${feed.id}-${entry.guid || entry.link || entry.title}`,
          sourceId: feed.id,
          source: feed.name,
          category: feed.category,
          title: entry.title || 'Untitled signal',
          summary: entry.contentSnippet || entry.summary || '',
          link: entry.link || '#',
          timestamp: entry.pubDate || entry.isoDate || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(`Failed to parse ${feed.id}`, error);
    }
  }

  return allSignals;
};

export async function GET() {
  const signals = await flattenEntries();
  const payload: ScanFeedResponse = {
    fetchedAt: new Date().toISOString(),
    signals,
    totalSignals: signals.length,
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
