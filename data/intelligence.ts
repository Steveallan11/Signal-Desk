import { ScanSource, TIER1_SOURCES, TIER2_SOURCES } from '@/data/feeds';

export type ScanStatus = 'RUNNING' | 'COMPLETE' | 'QUEUED';

export interface LiveScanStatus {
  id: string;
  source: ScanSource;
  status: ScanStatus;
  lastChecked: string;
  nextRun: string;
  notes: string;
  confidence: number; // 0-1 for signal strength
}

export interface UploadRecord {
  id: string;
  caseId: string;
  title: string;
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'MAP' | 'RAW_DATA' | 'TEXT';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED';
  timestamp: string;
  uploadedBy: string;
  notes: string;
}

const pickSource = (id: string): ScanSource => {
  const source = [...TIER1_SOURCES, ...TIER2_SOURCES].find((entry) => entry.id === id);
  if (!source) {
    throw new Error(`Missing scan source ${id}`);
  }
  return source;
};

export const LIVE_SCANS: LiveScanStatus[] = [
  {
    id: 'scan-icij',
    source: pickSource('icij'),
    status: 'RUNNING',
    lastChecked: '2m ago',
    nextRun: '08:15 UTC',
    notes: 'New entity flagged by the ICIJ watchlist',
    confidence: 0.68,
  },
  {
    id: 'scan-ofac',
    source: pickSource('ofac-new'),
    status: 'COMPLETE',
    lastChecked: '14:05 UTC',
    nextRun: '07:00 UTC',
    notes: 'Sanctions feed ingested, awaiting classification',
    confidence: 0.92,
  },
  {
    id: 'scan-doj',
    source: pickSource('doj'),
    status: 'QUEUED',
    lastChecked: '10:52 UTC',
    nextRun: '11:00 UTC',
    notes: 'Queued for press release crawl',
    confidence: 0.42,
  },
  {
    id: 'scan-occrp',
    source: pickSource('occrp'),
    status: 'RUNNING',
    lastChecked: '9m ago',
    nextRun: '09:40 UTC',
    notes: 'Document crawler gathering new entity records',
    confidence: 0.55,
  },
];

export const UPLOAD_LOG: UploadRecord[] = [
  {
    id: 'upload-001',
    caseId: 'CASE-2025-0014',
    title: 'Document import: Panama Papers snapshot',
    type: 'DOCUMENT',
    status: 'COMPLETED',
    timestamp: '14:20 UTC',
    uploadedBy: 'SignalBot',
    notes: 'Auto-ingested from Dropbox watch',
  },
  {
    id: 'upload-002',
    caseId: 'CASE-2025-0013',
    title: 'Image: Flowchart extract',
    type: 'IMAGE',
    status: 'PROCESSING',
    timestamp: '13:45 UTC',
    uploadedBy: 'Archivist',
    notes: 'Pending OCR alignment',
  },
  {
    id: 'upload-003',
    caseId: 'CASE-2025-0012',
    title: 'Transcript: Novus briefing',
    type: 'TEXT',
    status: 'QUEUED',
    timestamp: '12:58 UTC',
    uploadedBy: 'Intake Bot',
    notes: 'Awaiting verification before ingestion',
  },
];
