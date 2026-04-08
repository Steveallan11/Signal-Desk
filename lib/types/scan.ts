export interface ScanSignal {
  id: string;
  sourceId: string;
  source: string;
  category: string;
  title: string;
  summary: string;
  link: string;
  timestamp: string;
}

export interface ScanFeedResponse {
  fetchedAt: string;
  signals: ScanSignal[];
  totalSignals: number;
}
