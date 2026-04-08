export type AlertStatus = 'NEW' | 'ESCALATED' | 'PRESERVED' | 'DISMISSED';

export interface AlertRecord {
  id: string;
  sourceId: string;
  watchlistId: string;
  matchedTerm: string;
  excerpt: string;
  timestamp: string;
  relevance: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  caseId?: string;
  status: AlertStatus;
}

export const ALERTS: AlertRecord[] = [
  {
    id: 'alert-001',
    sourceId: 'src-icij',
    watchlistId: 'wl-ownership',
    matchedTerm: 'beneficial ownership',
    excerpt: 'Redwood Media Group and Meridian Capital appear on the leaked ownership tree...',
    timestamp: '03:49 UTC',
    relevance: 9,
    severity: 'HIGH',
    caseId: 'CASE-2025-0014',
    status: 'NEW',
  },
  {
    id: 'alert-002',
    sourceId: 'src-occrp',
    watchlistId: 'wl-sanctions',
    matchedTerm: 'payment processor',
    excerpt: 'Alert triggered when Arktis proxy payment processor appeared in sanctions submission...',
    timestamp: '04:01 UTC',
    relevance: 8,
    severity: 'HIGH',
    caseId: 'CASE-2025-0013',
    status: 'NEW',
  },
  {
    id: 'alert-003',
    sourceId: 'src-doj',
    watchlistId: 'wl-sanctions',
    matchedTerm: 'indictment',
    excerpt: 'DOJ press release hints at imminent charging for sanctioned vessel owner...',
    timestamp: '04:08 UTC',
    relevance: 7,
    severity: 'MEDIUM',
    caseId: 'CASE-2025-0010',
    status: 'NEW',
  },
];
