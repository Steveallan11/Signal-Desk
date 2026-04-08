"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { buildScheduledRuns, getKeyDatabases } from "@/lib/feedPlanner";
import {
  SOURCE_REGISTRY,
  WATCHLISTS,
  SourceRecord,
  WatchlistRecord,
  SourceType,
  ScanFrequency,
} from "@/data/sourceRegistry";
import type { ScanFeedResponse, ScanSignal } from "@/lib/types/scan";

const tabs = [
  { id: "cases", label: "CASES" },
  { id: "agents", label: "AGENTS" },
  { id: "registry", label: "SOURCE REGISTRY" },
  { id: "log", label: "EVENT LOG" },
  { id: "feeds", label: "FEEDS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type CaseType = "DUE_DILIGENCE" | "SANCTIONS_MAPPING" | "NARRATIVE_MONITORING";

type CaseStatus =
  | "INTAKE"
  | "SCOPED"
  | "ACTIVE"
  | "VERIFICATION"
  | "VERIFICATION_COMPLETE"
  | "DRAFT_COMPLETE"
  | "QA_REVISION"
  | "QA_PASSED"
  | "LEGAL_REVIEW"
  | "LEGAL_BLOCKED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "DELIVERED"
  | "PAUSED";

interface CaseRecord {
  id: string;
  title: string;
  type: CaseType;
  priority: CasePriority;
  status: CaseStatus;
  subject: string;
  risk: CasePriority;
  agent: string;
  updated: string;
  claims: number;
  evidence: number;
  qaStatus: "PASSED" | "PENDING";
  signal: ScanSignal;
}

interface AgentRecord {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "IDLE";
  lastBeat: string;
  activeCases: number;
  tasksToday: number;
}

type AlertStatus = "NEW" | "ESCALATED" | "PRESERVED" | "DISMISSED";

interface AlertRecord {
  id: string;
  signalId: string;
  sourceId: string;
  sourceName: string;
  watchlistId: string;
  matchedTerm: string;
  excerpt: string;
  timestamp: string;
  relevance: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
  caseId?: string;
  status: AlertStatus;
}

interface EventRecord {
  time: string;
  agent: string;
  event: string;
  type: "flag" | "pass" | "info" | "sync" | "assign";
}

const AGENT_ROSTER: AgentRecord[] = [
  { id: "ceo", name: "Chief Investigator", role: "CEO", status: "ACTIVE", lastBeat: "5m ago", activeCases: 7, tasksToday: 12 },
  { id: "intake", name: "Intake & Scoping", role: "Intake", status: "ACTIVE", lastBeat: "18m ago", activeCases: 1, tasksToday: 4 },
  { id: "toollib", name: "Tool Librarian", role: "Registry", status: "ACTIVE", lastBeat: "33m ago", activeCases: 0, tasksToday: 3 },
  { id: "collection", name: "Companies & Finance", role: "Collection", status: "ACTIVE", lastBeat: "12m ago", activeCases: 3, tasksToday: 8 },
  { id: "archive", name: "Archiving & Preservation", role: "Preservation", status: "ACTIVE", lastBeat: "8m ago", activeCases: 4, tasksToday: 17 },
  { id: "verify", name: "Verification", role: "Verification", status: "IDLE", lastBeat: "40m ago", activeCases: 1, tasksToday: 5 },
  { id: "writer", name: "Report Writer", role: "Reporting", status: "IDLE", lastBeat: "1h ago", activeCases: 0, tasksToday: 2 },
  { id: "qa", name: "QA Agent", role: "QA", status: "ACTIVE", lastBeat: "22m ago", activeCases: 2, tasksToday: 6 },
  { id: "legal", name: "Legal / Ethics", role: "Legal", status: "ACTIVE", lastBeat: "35m ago", activeCases: 1, tasksToday: 3 },
];

const STATUS_META: Record<CaseStatus, { label: string; color: string }> = {
  INTAKE: { label: "Intake", color: "#64748b" },
  SCOPED: { label: "Scoped", color: "#6366f1" },
  ACTIVE: { label: "Active", color: "#3b82f6" },
  VERIFICATION: { label: "Verifying", color: "#8b5cf6" },
  VERIFICATION_COMPLETE: { label: "Verified", color: "#7c3aed" },
  DRAFT_COMPLETE: { label: "Draft", color: "#f59e0b" },
  QA_REVISION: { label: "QA Revision", color: "#ef4444" },
  QA_PASSED: { label: "QA Passed", color: "#10b981" },
  LEGAL_REVIEW: { label: "Legal Review", color: "#f97316" },
  LEGAL_BLOCKED: { label: "Blocked", color: "#dc2626" },
  PENDING_APPROVAL: { label: "Awaiting Approval", color: "#fbbf24" },
  APPROVED: { label: "Approved", color: "#22c55e" },
  DELIVERED: { label: "Delivered", color: "#059669" },
  PAUSED: { label: "Paused", color: "#94a3b8" },
};

const PIPELINE_STAGES = [
  { id: "collection", label: "Collection", owner: "Companies & Finance", status: "in-progress", note: "Signal ingestion + preservation." },
  { id: "verification", label: "Verification", owner: "Verification", status: "pending", note: "Claims under review." },
  { id: "report", label: "Report Writer", owner: "Report Writer", status: "pending", note: "Drafting memo." },
  { id: "qa", label: "QA", owner: "QA Agent", status: "pending", note: "Fact-checking." },
  { id: "legal", label: "Legal", owner: "Legal Reviewer", status: "pending", note: "Ethics + defamation review." },
  { id: "human", label: "Human Gate", owner: "CEO / Board", status: "pending", note: "Awaiting human approval." },
];

const SOURCE_TYPES: SourceType[] = [
  "website",
  "forum",
  "social_account",
  "news_site",
  "registry",
  "other",
];

const SCAN_FREQUENCIES: ScanFrequency[] = ["6h", "12h", "24h", "manual"];

const PRIORITY_LEVELS: SourceRecord["priority"][] = ["LOW", "MEDIUM", "HIGH"];

interface SourceFormState {
  name: string;
  url: string;
  type: SourceType;
  frequency: ScanFrequency;
  priority: SourceRecord["priority"];
  keywords: string;
  entities: string;
  watchlistIds: string[];
  riskNotes: string;
  accessNotes: string;
  approved: boolean;
}

interface WatchlistFormState {
  name: string;
  priority: WatchlistRecord["priority"];
  subjects: string;
  aliases: string;
  companyNames: string;
  directors: string;
  domains: string;
  keywords: string;
  hashtags: string;
  excludedTerms: string;
  linkedCaseIds: string;
}

const DEFAULT_SOURCE_FORM: SourceFormState = {
  name: "",
  url: "",
  type: "website",
  frequency: "24h",
  priority: "MEDIUM",
  keywords: "",
  entities: "",
  watchlistIds: [],
  riskNotes: "",
  accessNotes: "",
  approved: true,
};

const DEFAULT_WATCHLIST_FORM: WatchlistFormState = {
  name: "",
  priority: "MEDIUM",
  subjects: "",
  aliases: "",
  companyNames: "",
  directors: "",
  domains: "",
  keywords: "",
  hashtags: "",
  excludedTerms: "",
  linkedCaseIds: "",
};

const parseCommaList = (input: string) =>
  input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const derivePriority = (category: string): CasePriority => {
  if (category.includes("ENFORCEMENT")) return "CRITICAL";
  if (category.includes("INVESTIGATIVE")) return "HIGH";
  return "MEDIUM";
};

const buildCasesFromSignals = (signals: ScanSignal[]): CaseRecord[] => {
  if (!signals.length) return [];
  const statuses: CaseStatus[] = [
    "SCOPED",
    "ACTIVE",
    "VERIFICATION",
    "LEGAL_REVIEW",
    "PENDING_APPROVAL",
  ];
  return signals.slice(0, 8).map((signal, index) => ({
    id: `CASE-${signal.id.slice(-8).toUpperCase()}`,
    title: signal.title,
    type: (index % 3 === 0 && "DUE_DILIGENCE") || (index % 3 === 1 && "SANCTIONS_MAPPING") || "NARRATIVE_MONITORING",
    priority: derivePriority(signal.category),
    status: statuses[index % statuses.length],
    subject: signal.source,
    risk: index % 2 === 0 ? "HIGH" : "MEDIUM",
    agent: index % 2 === 0 ? "Companies & Finance" : "Social Monitoring",
    updated: new Date(signal.timestamp).toLocaleTimeString("en-GB", { timeZone: "UTC" }),
    claims: 3 + index,
    evidence: 6 + index * 2,
    qaStatus: index % 2 === 0 ? "PASSED" : "PENDING",
    signal,
  }));
};

const buildAlertsFromSignals = (
  signals: ScanSignal[],
  watchlists: WatchlistRecord[],
  cases: CaseRecord[]
): AlertRecord[] => {
  if (!signals.length) return [];
  return signals.slice(0, 6).map((signal, index) => {
    const watchlist = watchlists[index % watchlists.length];
    const assignedCase = cases[index % cases.length];
    const severity = index % 2 === 0 ? "HIGH" : index % 3 === 0 ? "LOW" : "MEDIUM";
    return {
      id: `alert-${signal.id}`,
      signalId: signal.id,
      sourceId: signal.sourceId,
      sourceName: signal.source,
      watchlistId: watchlist?.id ?? "",
      matchedTerm: signal.category,
      excerpt: signal.summary || signal.title,
      timestamp: new Date(signal.timestamp).toLocaleTimeString("en-GB", { timeZone: "UTC" }),
      relevance: 6 + (index % 4),
      severity,
      caseId: assignedCase?.id,
      status: "NEW",
    };
  });
};

const buildEventLogFromSignals = (signals: ScanSignal[]): EventRecord[] =>
  signals.slice(0, 5).map((signal, index) => ({
    time: new Date(signal.timestamp).toLocaleTimeString("en-GB", { timeZone: "UTC" }),
    agent: index % 2 === 0 ? "Preservation" : "Tool Librarian",
    event: `${signal.source} signal ingested (${signal.category})`,
    type: index % 3 === 0 ? "sync" : index % 3 === 1 ? "info" : "flag",
  }));

const statusBadge = (status: CaseStatus) => {
  const meta = STATUS_META[status];
  return (
    <span className="badge" style={{ color: meta.color, border: `1px solid ${meta.color}44` }}>
      * {meta.label}
    </span>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("cases");
  const [scanResponse, setScanResponse] = useState<ScanFeedResponse | null>(null);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [sources, setSources] = useState<SourceRecord[]>(SOURCE_REGISTRY);
  const [watchlists, setWatchlists] = useState<WatchlistRecord[]>(WATCHLISTS);
  const [modalSignal, setModalSignal] = useState<ScanSignal | null>(null);
  const [newSourceMessage, setNewSourceMessage] = useState<string | null>(null);
  const [sourceForm, setSourceForm] = useState<SourceFormState>(() => ({ ...DEFAULT_SOURCE_FORM }));
  const [watchlistForm, setWatchlistForm] = useState<WatchlistFormState>(() => ({ ...DEFAULT_WATCHLIST_FORM }));
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchSignals = async () => {
      try {
        const response = await fetch("/api/scan-feed");
        if (!response.ok) throw new Error("Signal feed not ready");
        const payload: ScanFeedResponse = await response.json();
        if (cancelled) return;
        setScanResponse(payload);
        const derivedCases = buildCasesFromSignals(payload.signals);
        setCases(derivedCases);
        setSelectedCaseId((prev) => prev ?? derivedCases[0]?.id ?? null);
        setAlerts(buildAlertsFromSignals(payload.signals, watchlists, derivedCases));
        setEvents(buildEventLogFromSignals(payload.signals));
      } catch (error) {
        console.error("Live scan failed", error);
        setRefreshMessage("Live signal feed unavailable");
      }
    };
    fetchSignals();
    const interval = setInterval(fetchSignals, 180000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [watchlists]);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? null,
    [cases, selectedCaseId]
  );

  const stats = useMemo(() => {
    const pendingApprovals = cases.filter((c) => c.status === "PENDING_APPROVAL").length;
    const activeCases = cases.filter((c) => ["ACTIVE", "VERIFICATION"].includes(c.status)).length;
    const totalEvidence = cases.reduce((total, caseItem) => total + caseItem.evidence, 0);
    return {
      pendingApprovals,
      activeCases,
      totalEvidence,
      signalVolume: scanResponse?.totalSignals ?? 0,
    };
  }, [cases, scanResponse]);

  const handleSourceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sourceForm.name.trim() || !sourceForm.url.trim()) {
      setNewSourceMessage("Name and URL required.");
      return;
    }
    const record: SourceRecord = {
      id: `src-${Date.now()}`,
      name: sourceForm.name.trim(),
      url: sourceForm.url.trim(),
      type: sourceForm.type,
      watchlistIds: [...sourceForm.watchlistIds],
      keywords: parseCommaList(sourceForm.keywords),
      entities: parseCommaList(sourceForm.entities),
      frequency: sourceForm.frequency,
      priority: sourceForm.priority,
      status: "ACTIVE",
      approved: sourceForm.approved,
      riskNotes: sourceForm.riskNotes.trim(),
      accessNotes: sourceForm.accessNotes.trim(),
      lastScanned: "pending",
    };
    setSources((prev) => [record, ...prev]);
    setSourceForm({ ...DEFAULT_SOURCE_FORM });
    setNewSourceMessage("Source registered. Live scan will include it shortly.");
    setTimeout(() => setNewSourceMessage(null), 3500);
  };

  const handleWatchlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!watchlistForm.name.trim()) return;
    const record: WatchlistRecord = {
      id: `wl-${Date.now()}`,
      name: watchlistForm.name.trim(),
      priority: watchlistForm.priority,
      subjects: parseCommaList(watchlistForm.subjects),
      aliases: parseCommaList(watchlistForm.aliases),
      companyNames: parseCommaList(watchlistForm.companyNames),
      directors: parseCommaList(watchlistForm.directors),
      domains: parseCommaList(watchlistForm.domains),
      keywords: parseCommaList(watchlistForm.keywords),
      hashtags: parseCommaList(watchlistForm.hashtags),
      excludedTerms: parseCommaList(watchlistForm.excludedTerms),
      linkedCaseIds: parseCommaList(watchlistForm.linkedCaseIds),
    };
    setWatchlists((prev) => [record, ...prev]);
    setWatchlistForm({ ...DEFAULT_WATCHLIST_FORM });
  };

  const refreshFeed = async () => {
    setRefreshMessage("Refreshing live feed...");
    try {
      const response = await fetch("/api/scan-feed");
      if (!response.ok) throw new Error("Refresh failed");
      const payload: ScanFeedResponse = await response.json();
      setScanResponse(payload);
      const derivedCases = buildCasesFromSignals(payload.signals);
      setCases(derivedCases);
      setAlerts(buildAlertsFromSignals(payload.signals, watchlists, derivedCases));
      setEvents(buildEventLogFromSignals(payload.signals));
      setRefreshMessage("Live scan refreshed");
    } catch (error) {
      console.error("refresh error", error);
      setRefreshMessage("Unable to refresh live feed");
    }
    setTimeout(() => setRefreshMessage(null), 2500);
  };

  const preserveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((record) =>
        record.id === alertId ? { ...record, status: "PRESERVED" } : record
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((record) =>
        record.id === alertId ? { ...record, status: "DISMISSED" } : record
      )
    );
  };

  const selectedSignal = modalSignal ?? selectedCase?.signal ?? null;

  const renderStatsBar = () => (
    <div className="stats-bar">
      {[{
        label: "ACTIVE CASES",
        value: stats.activeCases,
        accent: "#6366f1",
      }, {
        label: "PENDING APPROVAL",
        value: stats.pendingApprovals,
        accent: "#fbbf24",
      }, {
        label: "EVIDENCE ITEMS",
        value: stats.totalEvidence,
        accent: "#3b82f6",
      }, {
        label: "SIGNALS RECEIVED",
        value: stats.signalVolume,
        accent: "#22c55e",
      }].map((stat) => (
        <div className="stat-card" key={stat.label}>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value" style={{ color: stat.accent }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );

  const renderPendingApproval = () => {
    const caseAwaiting = cases.find((c) => c.status === "PENDING_APPROVAL");
    if (!caseAwaiting) return null;
    return (
      <div className="approval-banner">
        <div className="approval-label">
          <span className="approval-pill">HUMAN ACTION REQUIRED</span>
          <span className="approval-title">
            {caseAwaiting.title} - awaiting Legal review
          </span>
        </div>
        <div className="approval-actions">
          <button className="approve-btn approve-cta">APPROVE DELIVERY</button>
          <button className="approve-btn approve-alert">REQUEST REVISION</button>
        </div>
      </div>
    );
  };

  const casesTable = () => (
    <div className="cases-table">
      <div className="cases-table__head">
        {["CASE ID", "TITLE", "TYPE", "STATUS", "PRIORITY", "AGENT", "CLAIMS", "EVIDENCE"].map((label) => (
          <div className="cases-table__cell cases-table__cell--head" key={label}>{label}</div>
        ))}
      </div>
      {cases.map((caseItem) => (
        <div
          key={caseItem.id}
          className={`cases-table__row hover-row ${selectedCase?.id === caseItem.id ? "cases-table__row--active" : ""}`}
          onClick={() => setSelectedCaseId(caseItem.id)}
        >
          <div className="cases-table__cell">{caseItem.id}</div>
          <div className="cases-table__cell cases-table__cell--title">
            <strong>{caseItem.title}</strong>
            <div className="cases-table__meta">{caseItem.subject}</div>
          </div>
          <div className="cases-table__cell">{caseItem.type.replace("_", " ")}</div>
          <div className="cases-table__cell">{statusBadge(caseItem.status)}</div>
          <div className="cases-table__cell">{caseItem.priority}</div>
          <div className="cases-table__cell">{caseItem.agent}</div>
          <div className="cases-table__cell">{caseItem.claims}</div>
          <div className="cases-table__cell">{caseItem.evidence}</div>
        </div>
      ))}
    </div>
  );

  const renderCaseDetail = () => {
    if (!selectedCase) return <p className="case-detail__empty">No live case selected yet.</p>;
    return (
      <div className="case-detail__body">
        <div>
          <p className="case-detail__subject">{selectedCase.subject}</p>
          <p>{selectedCase.signal.summary || "Summary not available yet."}</p>
          <p className="case-detail__meta">
            Signal captured {selectedCase.signal.timestamp} | Source {selectedCase.signal.source}
          </p>
          <button className="approve-btn" onClick={() => setModalSignal(selectedCase.signal)}>
            VIEW SIGNAL DETAIL
          </button>
        </div>
        <div className="case-detail__stats">
          <span>Updated {selectedCase.updated}</span>
          <span>QA {selectedCase.qaStatus}</span>
          <span>Risk {selectedCase.risk}</span>
        </div>
      </div>
    );
  };

  const renderAgentsTab = () => (
    <div>
      <div className="section-title">AGENT ROSTER</div>
      <div className="agents-grid">
        {AGENT_ROSTER.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card__head">
              <span>{agent.name}</span>
              <span className={`agent-card__status ${agent.status === "ACTIVE" ? "active" : "idle"}`}>{agent.status}</span>
            </div>
            <p className="agent-card__role">{agent.role}</p>
            <div className="agent-card__meta">
              <span>{agent.activeCases} cases</span>
              <span>{agent.tasksToday} tasks today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSourceRegistryPanel = () => (
    <div>
      <div className="registry-grid">
        {sources.map((source) => (
          <div key={source.id} className="registry-card">
            <div className="registry-card__header">
              <span>{source.name}</span>
              <span className="registry-card__status">{source.status}</span>
            </div>
            <a className="registry-card__link" href={source.url} target="_blank" rel="noreferrer">
              Open source
            </a>
            <div className="registry-card__meta">Last scanned {source.lastScanned}</div>
          </div>
        ))}
      </div>
      <form className="source-registry__form" onSubmit={handleSourceSubmit}>
        <div className="source-registry__form-grid">
          <label>
            Name
            <input value={sourceForm.name} onChange={(event) => setSourceForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label>
            URL
            <input value={sourceForm.url} onChange={(event) => setSourceForm((prev) => ({ ...prev, url: event.target.value }))} />
          </label>
        </div>
        <button type="submit" className="approve-btn">
          Register Source
        </button>
        {newSourceMessage && <p className="source-registry__message">{newSourceMessage}</p>}
      </form>
    </div>
  );

  const renderAlertInbox = () => {
    if (!alerts.length) return <p className="alert-inbox__empty">No alerts yet.</p>;
    return (
      <div className="alert-inbox">
        <div className="alert-inbox__header">
          <span>Alert inbox</span>
          <button className="approve-btn" onClick={refreshFeed}>REFRESH SIGNALS</button>
        </div>
        {refreshMessage && <div className="alert-inbox__note">{refreshMessage}</div>}
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-row alert-row--${alert.status.toLowerCase()}`}>
            <div className="alert-row__meta">
              <span>{alert.sourceName}</span>
              <span>{alert.matchedTerm}</span>
              <span>{alert.timestamp}</span>
            </div>
            <p>{alert.excerpt}</p>
            <div className="alert-row__actions">
              <span className="alert-row__score">Relevance {alert.relevance}</span>
              <button className="approve-btn" onClick={() => preserveAlert(alert.id)} disabled={alert.status !== "NEW"}>
                PRESERVE
              </button>
              <button className="approve-btn alert-row__button--ghost" onClick={() => dismissAlert(alert.id)}>
                DISMISS
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPipelinePanel = () => (
    <div className="pipeline-panel">
      {PIPELINE_STAGES.map((stage) => (
        <div key={stage.id} className={`pipeline-stage pipeline-stage--${stage.status}`}>
          <div className="pipeline-stage__head">
            <span>{stage.label}</span>
            <span>{stage.owner}</span>
          </div>
          <p className="pipeline-stage__note">{stage.note}</p>
          <div className="pipeline-stage__footer">
            <span className="pipeline-stage__status">{stage.status}</span>
            <button className="approve-btn pipeline-stage__button">Mark complete</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventLogTab = () => (
    <div>
      <div className="event-log">
        {events.map((event, index) => (
          <div key={`${event.time}-${index}`} className="event-row">
            <span className="event-time">{event.time}</span>
            <div className="event-marker" />
            <div>
              <span className="event-agent">{event.agent}</span>
              <span className="event-text">{event.event}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedsTab = () => (
    <div>
      <div className="feed-grid">
        {buildScheduledRuns().map((run) => (
          <div key={run.window} className="feed-card">
            <div className="feed-card__header">
              <div>
                <div className="feed-card__title">{run.window} UTC</div>
                <div className="feed-card__subtitle">{run.focus}</div>
              </div>
            </div>
            <div className="feed-card__body">
              <div className="feed-card__label">Sources</div>
              <ul className="feed-card__list">
                {run.sources.slice(0, 4).map((source) => (
                  <li key={source.id}>{source.name}</li>
                ))}
              </ul>
              <div className="feed-card__meta">
                Accounts: {(run.social?.accounts ?? []).slice(0, 3).join(", ")}...
              </div>
            </div>
          </div>
        ))}
      </div>
      <ul className="database-list">
        {getKeyDatabases().map((db) => (
          <li key={db}>{db}</li>
        ))}
      </ul>
    </div>
  );

  const renderModal = () => {
    if (!modalSignal) return null;
    return (
      <div className="modal-overlay" onClick={() => setModalSignal(null)}>
        <div className="modal-card" onClick={(event) => event.stopPropagation()}>
          <div className="modal-header">
            <div>
              <div className="modal-title">{modalSignal.title}</div>
              <div className="modal-subtitle">{modalSignal.source}</div>
            </div>
            <button className="close-btn" onClick={() => setModalSignal(null)}>X</button>
          </div>
          <div className="modal-body">
            <p>{modalSignal.summary}</p>
            <a href={modalSignal.link} target="_blank" rel="noreferrer" className="modal-link">
              Open source
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="scanline" />
      <header className="page__header">
        <div className="branding">
          <div className="indicator pulse" />
          <span className="branding__title">SIGNAL DESK</span>
          <span className="branding__tag">LIVE PUBLIC-SOURCE INTELLIGENCE</span>
        </div>
        <div className="header__actions">
          {refreshMessage && <span className="header__badge">{refreshMessage}</span>}
          <span className="header__timestamp">{new Date().toUTCString()}</span>
        </div>
      </header>
      {renderStatsBar()}
      {renderPendingApproval()}
      <div className="tab-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <main className="content">
        {activeTab === "cases" && (
          <div>
            <div className="cases-header">
              <span className="cases-title">CASE PORTFOLIO</span>
              <span className="cases-count">{cases.length} live cases</span>
            </div>
            {casesTable()}
            <div className="case-detail">{renderCaseDetail()}</div>
          </div>
        )}
        {activeTab === "agents" && renderAgentsTab()}
        {activeTab === "registry" && (
          <div>
            <div className="section-title">SOURCE REGISTRY</div>
            {renderSourceRegistryPanel()}
            <div className="section-title">ALERT INBOX</div>
            {renderAlertInbox()}
            <div className="section-title">PIPELINE</div>
            {renderPipelinePanel()}
          </div>
        )}
        {activeTab === "log" && renderEventLogTab()}
        {activeTab === "feeds" && renderFeedsTab()}
      </main>
      {renderModal()}
      <footer className="page__footer">
        <div className="footer__info">
          <span>LAW-ABIDING SOURCES ONLY</span>
          <span>HUMAN APPROVAL REQUIRED</span>
        </div>
        <span className="footer__brand">SIGNAL DESK LIVE � v0.2</span>
      </footer>
    </div>
  );
}
