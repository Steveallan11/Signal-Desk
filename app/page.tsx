"use client";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  AGENTS,
  APPROVALS,
  CASES,
  CaseRecord,
  EVENTS,
  RISK_COLORS,
  REGISTRY_STATS,
  STATUS_META,
} from "@/data/dashboard";
import { getTopBriefs } from "@/data/caseBriefs";
import { CASE_RESOURCES, CaseResource, ResourceType } from "@/data/resources";
import {
  ROUTINE_STEPS,
  STORY_SCORING_CHECKLIST,
} from "@/data/feeds";
import { buildScheduledRuns, getKeyDatabases } from "@/lib/feedPlanner";
import { LIVE_SCANS, UPLOAD_LOG } from "@/data/intelligence";
import {
  SOURCE_REGISTRY,
  WATCHLISTS,
  SourceRecord,
  WatchlistRecord,
  SourceType,
  ScanFrequency,
} from "@/data/sourceRegistry";

const tabs = [
  { id: "cases", label: "CASES" },
  { id: "agents", label: "AGENTS" },
  { id: "registry", label: "TOOL REGISTRY" },
  { id: "log", label: "EVENT LOG" },
  { id: "feeds", label: "FEEDS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const pipelineSteps: Array<{
  id: string;
  label: string;
}> = [
  { id: "SCOPED", label: "Scoped" },
  { id: "ACTIVE", label: "Active" },
  { id: "VERIFICATION", label: "Verifying" },
  { id: "QA_PASSED", label: "QA Passed" },
  { id: "LEGAL_REVIEW", label: "Legal Review" },
  { id: "PENDING_APPROVAL", label: "Awaiting Approval" },
  { id: "DELIVERED", label: "Delivered" },
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

const parseCommaList = (input: string): string[] =>
  input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("cases");
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(CASES[0]);
  const [modalResource, setModalResource] = useState<CaseResource | null>(null);
  const [uploadLabel, setUploadLabel] = useState("Operational evidence drop");
  const [pendingFiles, setPendingFiles] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([
    "07:00 UTC · Tier 1 morning scan complete",
    "08:14 UTC · Discord + Telegram sync",
    "09:02 UTC · Manual signal pulse",
  ]);
  const [sources, setSources] = useState<SourceRecord[]>(SOURCE_REGISTRY);
  const [watchlists, setWatchlists] = useState<WatchlistRecord[]>(WATCHLISTS);
  const [newSourceMessage, setNewSourceMessage] = useState<string | null>(null);
  const [sourceForm, setSourceForm] = useState<SourceFormState>(() => ({
    ...DEFAULT_SOURCE_FORM,
  }));
  const [watchlistForm, setWatchlistForm] = useState<WatchlistFormState>(() => ({
    ...DEFAULT_WATCHLIST_FORM,
  }));

  const stats = useMemo(() => {
    const pendingApprovals = CASES.filter(
      (c) => c.status === "PENDING_APPROVAL"
    ).length;
    const activeCases = CASES.filter(
      (c) => !["DELIVERED", "PAUSED"].includes(c.status)
    ).length;
    const totalEvidence = CASES.reduce((total, c) => total + c.evidence, 0);
    return { pendingApprovals, activeCases, totalEvidence };
  }, []);

  const onlineAgents = AGENTS.filter((agent) => agent.status === "ACTIVE")
    .length;
  const scheduledRuns = useMemo(() => buildScheduledRuns(), []);
  const intelResources = useMemo(
    () =>
      CASE_RESOURCES.filter((resource) => resource.caseId === selectedCase?.id),
    [selectedCase]
  );
  const recommendedBriefs = useMemo(() => {
    const briefs = getTopBriefs({ limit: 5, minScore: 6 });
    if (!selectedCase) {
      return briefs;
    }
    const caseSpecific = briefs.filter((brief) => brief.caseId === selectedCase.id);
    return caseSpecific.length ? caseSpecific : briefs;
  }, [selectedCase]);
  const caseUploads = useMemo(
    () =>
      selectedCase ? UPLOAD_LOG.filter((upload) => upload.caseId === selectedCase.id) : [],
    [selectedCase]
  );

  const renderPendingApproval = () => {
    if (!APPROVALS.length) {
      return null;
    }
    const approval = APPROVALS[0];
    return (
      <div className="approval-banner">
        <div className="approval-label">
          <span className="approval-pill">HUMAN ACTION REQUIRED</span>
          <span className="approval-title">
            {approval.title} — Legal status {approval.legalStatus} · Waiting{" "}
            {approval.waitingHours}h
          </span>
        </div>
        <div className="approval-actions">
          <button className="approve-btn approve-cta">APPROVE DELIVERY</button>
          <button className="approve-btn approve-alert">
            REQUEST REVISION
          </button>
        </div>
      </div>
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPendingFiles(event.target.files?.length ?? 0);
  };

  const handleUploadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.querySelector(
      'input[name="evidenceFiles"]'
    ) as HTMLInputElement | null;
    const count = fileInput?.files?.length ?? 0;
    if (!count) {
      setUploadStatus("Add at least one file before pushing to the locker.");
      return;
    }
    setUploadStatus(
      `Queued ${count} file${count === 1 ? "" : "s"} for ingestion on ${
        selectedCase?.id || "the workspace"
      }.`
    );
    setPendingFiles(0);
    if (fileInput) {
      fileInput.value = "";
    }
    form.reset();
  };

  const handleForceScan = (sourceName: string) => {
    const now = new Date();
    const timestamp = `${now
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")} UTC`;
    setScanHistory((prev) =>
      [`${timestamp} · ${sourceName} force-run requested`, ...prev].slice(0, 4)
    );
  };


  const updateSourceForm = (field: keyof SourceFormState, value: string | boolean | string[]) => {
    setSourceForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleWatchlistSelection = (watchlistId: string) => {
    setSourceForm((prev) => {
      const exists = prev.watchlistIds.includes(watchlistId);
      return {
        ...prev,
        watchlistIds: exists
          ? prev.watchlistIds.filter((id) => id !== watchlistId)
          : [...prev.watchlistIds, watchlistId],
      };
    });
  };

  const handleSourceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sourceForm.name.trim() || !sourceForm.url.trim()) {
      setNewSourceMessage("Name and URL are required.");
      return;
    }
    const newSource: SourceRecord = {
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
      lastScanned: "Pending",
    };
    setSources((prev) => [newSource, ...prev]);
    setSourceForm({ ...DEFAULT_SOURCE_FORM });
    setNewSourceMessage("Source added. Preservation will archive it shortly.");
    setTimeout(() => setNewSourceMessage(null), 4000);
  };

  const handleWatchlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!watchlistForm.name.trim()) {
      return;
    }
    const newWatchlist: WatchlistRecord = {
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
    setWatchlists((prev) => [newWatchlist, ...prev]);
    setWatchlistForm({ ...DEFAULT_WATCHLIST_FORM });
  };

  const toggleSourceStatus = (id: string, target: SourceRecord["status"]) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, status: target, lastScanned: source.lastScanned } : source
      )
    );
  };

  const archiveSource = (id: string) => {
    setSources((prev) =>
      prev.map((source) => (source.id === id ? { ...source, status: "ARCHIVED" } : source))
    );
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((source) => source.id !== id));
  };

  const toggleApproval = (id: string) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, approved: !source.approved } : source
      )
    );
  };

  const renderStatusBadge = (status: string) => {
    const meta = STATUS_META[status as keyof typeof STATUS_META];
    if (!meta) {
      return null;
    }
    return (
      <span
        className="badge"
        style={{ color: meta.color, border: `1px solid ${meta.color}44` }}
      >
        ◉ {meta.label}
      </span>
    );
  };

  const renderStatsBar = () => (
    <div className="stats-bar">
      {[
        {
          label: "ACTIVE CASES",
          value: stats.activeCases,
          accent: "#6366f1",
        },
        {
          label: "PENDING APPROVAL",
          value: stats.pendingApprovals,
          accent: "#eab308",
        },
        {
          label: "EVIDENCE ITEMS",
          value: stats.totalEvidence,
          accent: "#3b82f6",
        },
        {
          label: "AGENTS ONLINE",
          value: onlineAgents,
          accent: "#22c55e",
        },
        {
          label: "TOOLS APPROVED",
          value: REGISTRY_STATS.reduce((sum, stat) => sum + stat.approved, 0),
          accent: "#8b5cf6",
        },
        { label: "LAST SYNC", value: "1h ago", accent: "#64748b" },
      ].map((stat) => (
        <div className="stat-card" key={stat.label}>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value" style={{ color: stat.accent }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );

  const renderTabs = () => (
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
  );

  const renderBriefPanel = () => {
    if (!selectedCase || !recommendedBriefs.length) {
      return null;
    }
    return (
      <div className="briefs-panel">
        <div className="briefs-panel__header">
          <span>Intelligence Briefing</span>
          <span className="briefs-panel__tag">Automated signal feed</span>
        </div>
        <div className="briefs-grid">
          {recommendedBriefs.map((brief) => (
            <div key={brief.id} className="brief-card">
              <div className="brief-card__head">
                <div className="brief-card__title">{brief.title}</div>
                <span
                  className={`brief-score ${
                    brief.trending ? "brief-score--trend" : ""
                  }`}
                >
                  {brief.score}
                </span>
              </div>
              <p className="brief-card__summary">{brief.summary}</p>
              <div className="brief-card__meta">
                <span>Virality {brief.viralityPotential}</span>
                {brief.trending && <span>Trending</span>}
              </div>
              <div className="brief-card__tags">
                {brief.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="brief-card__actions">
                <button type="button" className="approve-btn brief-card__button">
                  QUEUE FOR COLLECTION
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadPanel = () => {
    if (!selectedCase) {
      return null;
    }
    return (
      <div className="upload-panel">
        <div className="upload-panel__header">
          <span>Evidence Upload & Live Ingestion</span>
          <span className="upload-panel__meta">
            {selectedCase.id} · {selectedCase.agent}
          </span>
        </div>
        <form className="upload-form" onSubmit={handleUploadSubmit}>
          <label className="upload-form__field">
            <span>Batch label</span>
            <input
              value={uploadLabel}
              onChange={(event) => setUploadLabel(event.target.value)}
              placeholder="Describe this drop"
            />
          </label>
          <label className="upload-drop">
            <span>
              {pendingFiles
                ? `${pendingFiles} file${pendingFiles === 1 ? "" : "s"} selected`
                : "Drop files or browse"}
            </span>
            <input
              type="file"
              name="evidenceFiles"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <div className="upload-form__actions">
            <span className="upload-form__note">Live pipeline is ready</span>
            <button type="submit" className="approve-btn">
              PUSH TO LOCKER
            </button>
          </div>
        </form>
        {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
        <div className="upload-history">
          <div className="upload-history__title">Recent ingest log</div>
          {caseUploads.length ? (
            <ul>
              {caseUploads.map((upload) => (
                <li key={upload.id}>
                  <span className="upload-history__title">{upload.title}</span>
                  <span>
                    {upload.status} · {upload.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No uploads queued for this case yet.</p>
          )}
        </div>
      </div>
    );
  };

  const renderLiveScanPanel = () => {
    if (!selectedCase) {
      return null;
    }
    const statusColors: Record<
      (typeof LIVE_SCANS)[number]["status"],
      string
    > = {
      RUNNING: "#22c55e",
      COMPLETE: "#6366f1",
      QUEUED: "#fbbf24",
    };
    return (
      <div className="live-scan-panel">
        <div className="live-scan-panel__header">
          <span>Live feed ingestion</span>
          <button
            type="button"
            className="approve-btn live-scan-panel__cta"
            onClick={() => handleForceScan("Signal Desk flywheel")}
          >
            FORCE SWEEP
          </button>
        </div>
        <div className="live-scan-grid">
          {LIVE_SCANS.map((scan) => (
            <div key={scan.id} className="live-scan-row">
              <div className="live-scan-row__title">
                <span>{scan.source.name}</span>
                <span className="live-scan-row__tier">Tier {scan.source.tier}</span>
              </div>
              <div className="live-scan-row__status-line">
                <span
                  className="live-scan-status"
                  style={{ color: statusColors[scan.status] }}
                >
                  {scan.status}
                </span>
                <span className="live-scan-row__meta">
                  Last {scan.lastChecked} · Next {scan.nextRun}
                </span>
              </div>
              <div className="scan-progress">
                <div
                  className="scan-progress__bar"
                  style={{ width: `${Math.round(scan.confidence * 100)}%` }}
                />
              </div>
              <p className="live-scan-row__notes">{scan.notes}</p>
              <button
                type="button"
                className="approve-btn live-scan-row__btn"
                onClick={() => handleForceScan(scan.source.name)}
              >
                FORCE UPDATE
              </button>
            </div>
          ))}
        </div>
        <div className="scan-history">
          <div className="scan-history__title">Manual scan log</div>
          <div className="scan-history__entries">
            {scanHistory.map((entry, index) => (
              <span key={`${entry}-${index}`}>{entry}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const resourceTypeColors: Record<ResourceType, string> = {
    VIDEO: "#f43f5e",
    IMAGE: "#22d3ee",
    DOCUMENT: "#a855f7",
    MAP: "#14b8a6",
    TEXT: "#f59e0b",
  };

  const renderResources = () => {
    if (!selectedCase) return null;
    if (!intelResources?.length) {
      return null;
    }

    return (
      <div className="resource-panel">
        <div className="resource-panel__header">
          <span>Resource Library</span>
          <span className="resource-panel__count">
            {intelResources.length} asset{intelResources.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="resource-grid">
          {intelResources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div
                className="resource-type"
                style={{ background: resourceTypeColors[resource.type] }}
              >
                <span>{resource.type}</span>
              </div>
              <div className="resource-card__body">
                <div className="resource-title">{resource.title}</div>
                <div className="resource-desc">{resource.description}</div>
              </div>
              <div className="resource-meta">
                <span>{resource.source}</span>
                <span>{resource.timestamp}</span>
              </div>
              <div className="resource-tags">
                {resource.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
          <div className="resource-actions">
             <button type="button" onClick={() => setModalResource(resource)}>
               Inspect
             </button>
          </div>
              {resource.badge && (
                <span className={`resource-badge resource-badge--${resource.badge.toLowerCase()}`}>
                  {resource.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCaseDetail = () => {
    if (!selectedCase) {
      return null;
    }
    const currentIndex = pipelineSteps.findIndex(
      (step) => step.id === selectedCase.status
    );
    return (
      <div className="case-detail">
        <div className="case-detail__header">
          <div>
            <div className="case-id">{selectedCase.id}</div>
            <div className="case-title">{selectedCase.title}</div>
          </div>
          <button onClick={() => setSelectedCase(null)} className="close-btn">
            ×
          </button>
        </div>
        <div className="case-detail__grid">
          {[
            ["Case Type", selectedCase.type.replace("_", " ")],
            ["Risk Level", selectedCase.risk],
            [
              "Status",
              STATUS_META[selectedCase.status]?.label || selectedCase.status,
            ],
            ["Assigned Agent", selectedCase.agent],
            ["Evidence Items", selectedCase.evidence],
            ["Claims", selectedCase.claims],
            ["QA Status", selectedCase.qaStatus],
            ["Last Updated", selectedCase.updated],
          ].map(([label, value]) => (
            <div className="case-detail__tile" key={label}>
              <div className="case-detail__label">{label}</div>
              <div className="case-detail__value">{value}</div>
            </div>
          ))}
        </div>
        <div className="case-detail__pipeline">
          <div className="case-detail__pipeline-label">PIPELINE PROGRESS</div>
          <div className="pipeline-line">
            {pipelineSteps.map((step, index) => {
              const done = index < currentIndex;
              const current = index === currentIndex;
              return (
                <div className="pipeline-step" key={step.id}>
                  <div
                    className="pipeline-dot"
                    style={{
                      borderColor: done ? "#6366f1" : current ? "#eab308" : "#1e2530",
                      backgroundColor: done
                        ? "#6366f1"
                        : current
                        ? "#eab308"
                        : "#0d1117",
                    }}
                  />
                  <span
                    className="pipeline-label"
                    style={{ color: done ? "#6366f1" : current ? "#eab308" : "#2d3748" }}
                  >
                    {step.label}
                  </span>
                  {index < pipelineSteps.length - 1 && (
                    <div
                      className="pipeline-bar"
                      style={{ backgroundColor: done ? "#6366f1" : "#1e2530" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {renderBriefPanel()}
        {renderUploadPanel()}
        {renderLiveScanPanel()}
        {renderResources()}
      </div>
    );
  };

  const renderCasesTab = () => (
    <div>
      <div className="cases-header">
        <span className="cases-title">CASE PORTFOLIO — {CASES.length} CASES</span>
        <button className="approve-btn">+ NEW CASE</button>
      </div>
      <div className="cases-table">
        <div className="cases-table__head">
          {[
            "CASE ID",
            "TITLE",
            "TYPE",
            "RISK",
            "STATUS",
            "EVIDENCE",
            "CLAIMS",
            "QA",
            "UPDATED",
          ].map((label) => (
            <div key={label} className="cases-table__cell cases-table__cell--head">
              {label}
            </div>
          ))}
        </div>
        {CASES.map((c) => (
          <div
            key={c.id}
            className={`cases-table__row hover-row ${
              selectedCase?.id === c.id ? "cases-table__row--active" : ""
            }`}
            onClick={() =>
              setSelectedCase((prev) => (prev?.id === c.id ? null : c))
            }
          >
            <div className="cases-table__cell">{c.id}</div>
            <div className="cases-table__cell cases-table__cell--title">
              {c.title}
            </div>
            <div className="cases-table__cell">
              <span className="cases-table__meta">{c.type.replace("_", " ")}</span>
            </div>
            <div className="cases-table__cell">
              <span
                className="badge"
                style={{
                  color: RISK_COLORS[c.risk],
                  border: `1px solid ${RISK_COLORS[c.risk]}44`,
                  background: `${RISK_COLORS[c.risk]}22`,
                }}
              >
                {c.risk}
              </span>
            </div>
            <div className="cases-table__cell">{renderStatusBadge(c.status)}</div>
            <div className="cases-table__cell cases-table__cell--center">
              {c.evidence}
            </div>
            <div className="cases-table__cell cases-table__cell--center">
              {c.claims}
            </div>
            <div className="cases-table__cell">{c.qaStatus}</div>
            <div className="cases-table__cell cases-table__cell--muted">
              {c.updated}
            </div>
          </div>
        ))}
      </div>
      {renderCaseDetail()}
    </div>
  );

  const renderAgentsTab = () => (
    <div>
      <div className="section-title">AGENT ROSTER — {AGENTS.length} AGENTS</div>
      <div className="agents-grid">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card__header">
              <div>
                <div className="agent-card__title">{agent.name}</div>
                <div className="agent-card__role">{agent.role.toUpperCase()}</div>
              </div>
              <span
                className="badge"
                style={{
                  color: agent.status === "ACTIVE" ? "#86efac" : "#78716c",
                  border: `1px solid ${
                    agent.status === "ACTIVE" ? "#14532d" : "#292524"
                  }`,
                  background: agent.status === "ACTIVE" ? "#052e16" : "#1c1917",
                }}
              >
                {agent.status === "ACTIVE" && <span className="pulse">• </span>}
                {agent.status}
              </span>
            </div>
            <div className="agent-card__metrics">
              {[
                ["LAST BEAT", agent.lastBeat],
                ["CASES", agent.activeCases],
                ["TASKS TODAY", agent.tasksToday],
              ].map(([label, value]) => (
                <div key={label} className="agent-card__metric">
                  <div className="agent-card__metric-label">{label}</div>
                  <div className="agent-card__metric-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSourceRegistryPanel = () => {
    if (!sources.length) {
      return <p className="source-registry__empty">No sources configured yet.</p>;
    }
    return (
      <div className="source-registry">
        <div className="source-registry__grid">
          {sources.map((source) => {
            const watchlistNames = source.watchlistIds
              .map((id) => watchlists.find((watchlist) => watchlist.id === id)?.name)
              .filter(Boolean)
              .join(", ");
            return (
              <div
                key={source.id}
                className={`source-card source-card--${source.status.toLowerCase()}`}
              >
                <div className="source-card__head">
                  <div>
                    <div className="source-card__name">{source.name}</div>
                    <div className="source-card__url">{source.url}</div>
                  </div>
                  <div className="source-card__badges">
                    <span className="badge badge--small">{source.type}</span>
                    <span className="badge badge--small">{source.frequency}</span>
                    <span
                      className="badge badge--small"
                      style={{
                        borderColor:
                          source.priority === "HIGH"
                            ? "#f97316"
                            : source.priority === "MEDIUM"
                            ? "#facc15"
                            : "#22c55e",
                      }}
                    >
                      {source.priority}
                    </span>
                  </div>
                </div>
                <div className="source-card__meta">
                  <div>Watchlists: {watchlistNames || "–"}</div>
                  <div>Keywords: {source.keywords.join(", ") || "–"}</div>
                  <div>Entities: {source.entities.join(", ") || "–"}</div>
                </div>
                <div className="source-card__notes">
                  <p>{source.riskNotes}</p>
                  <p>{source.accessNotes}</p>
                </div>
                <div className="source-card__footer">
                  <span>Last scanned {source.lastScanned}</span>
                  <div className="source-card__buttons">
                    <button
                      type="button"
                      className="approve-btn source-card__button"
                      onClick={() =>
                        toggleSourceStatus(
                          source.id,
                          source.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
                        )
                      }
                    >
                      {source.status === "ACTIVE" ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      className="approve-btn source-card__button source-card__button--ghost"
                      onClick={() => toggleApproval(source.id)}
                    >
                      {source.approved ? "Revoke approval" : "Approve source"}
                    </button>
                    <button
                      type="button"
                      className="approve-btn source-card__button source-card__button--ghost"
                      onClick={() => archiveSource(source.id)}
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      className="approve-btn source-card__button source-card__button--ghost"
                      onClick={() => removeSource(source.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <form className="source-registry__form" onSubmit={handleSourceSubmit}>
          <div className="source-registry__form-grid">
            <label>
              Source name
              <input
                value={sourceForm.name}
                onChange={(event) => updateSourceForm("name", event.target.value)}
                placeholder="Signal Desk Watchlist"
              />
            </label>
            <label>
              Source URL
              <input
                value={sourceForm.url}
                onChange={(event) => updateSourceForm("url", event.target.value)}
                placeholder="https://example.com/feed"
              />
            </label>
            <label>
              Type
              <select
                value={sourceForm.type}
                onChange={(event) =>
                  updateSourceForm("type", event.target.value as SourceType)
                }
              >
                {SOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Frequency
              <select
                value={sourceForm.frequency}
                onChange={(event) =>
                  updateSourceForm("frequency", event.target.value as ScanFrequency)
                }
              >
                {SCAN_FREQUENCIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select
                value={sourceForm.priority}
                onChange={(event) =>
                  updateSourceForm(
                    "priority",
                    event.target.value as SourceRecord["priority"]
                  )
                }
              >
                {PRIORITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Keywords (comma separated)
            <input
              value={sourceForm.keywords}
              onChange={(event) => updateSourceForm("keywords", event.target.value)}
            />
          </label>
          <label>
            Entities & watch targets
            <input
              value={sourceForm.entities}
              onChange={(event) => updateSourceForm("entities", event.target.value)}
            />
          </label>
          <div className="source-registry__watchlist-checks">
            {watchlists.map((watchlist) => (
              <label key={watchlist.id} className="source-registry__watchlist-label">
                <input
                  type="checkbox"
                  checked={sourceForm.watchlistIds.includes(watchlist.id)}
                  onChange={() => toggleWatchlistSelection(watchlist.id)}
                />
                {watchlist.name}
              </label>
            ))}
          </div>
          <label>
            Risk notes
            <textarea
              rows={2}
              value={sourceForm.riskNotes}
              onChange={(event) => updateSourceForm("riskNotes", event.target.value)}
            />
          </label>
          <label>
            Access notes
            <textarea
              rows={2}
              value={sourceForm.accessNotes}
              onChange={(event) => updateSourceForm("accessNotes", event.target.value)}
            />
          </label>
          <div className="source-registry__form-footer">
            <label className="source-registry__approved">
              <input
                type="checkbox"
                checked={sourceForm.approved}
                onChange={(event) => updateSourceForm("approved", event.target.checked)}
              />
              Approved for scanning
            </label>
            <button type="submit" className="approve-btn">
              Add source
            </button>
          </div>
          {newSourceMessage && (
            <div className="source-registry__message">{newSourceMessage}</div>
          )}
        </form>
      </div>
    );
  };

  const renderWatchlistPanel = () => (
    <>
      <div className="watchlist-grid">
        {watchlists.map((watchlist) => (
          <div key={watchlist.id} className="watchlist-card">
            <div className="watchlist-card__head">
              <span className="watchlist-card__name">{watchlist.name}</span>
              <span className="watchlist-card__priority">{watchlist.priority}</span>
            </div>
            <div className="watchlist-card__body">
              <p>
                <strong>Subjects:</strong> {watchlist.subjects.join(", ") || "–"}
              </p>
              <p>
                <strong>Keywords:</strong> {watchlist.keywords.join(", ") || "–"}
              </p>
              <p>
                <strong>Linked Cases:</strong>{" "}
                {watchlist.linkedCaseIds.length ? watchlist.linkedCaseIds.join(", ") : "–"}
              </p>
              <p>
                <strong>Domains:</strong> {watchlist.domains.join(", ") || "–"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form className="source-registry__form" onSubmit={handleWatchlistSubmit}>
        <div className="source-registry__form-grid">
          <label>
            Watchlist name
            <input
              value={watchlistForm.name}
              onChange={(event) =>
                setWatchlistForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </label>
          <label>
            Priority
            <select
              value={watchlistForm.priority}
              onChange={(event) =>
                setWatchlistForm((prev) => ({
                  ...prev,
                  priority: event.target.value as WatchlistRecord["priority"],
                }))
              }
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
        </div>
        <label>
          Subjects (comma separated)
          <input
            value={watchlistForm.subjects}
            onChange={(event) =>
              setWatchlistForm((prev) => ({ ...prev, subjects: event.target.value }))
            }
          />
        </label>
        <label>Keywords</label>
        <input
          value={watchlistForm.keywords}
          onChange={(event) =>
            setWatchlistForm((prev) => ({ ...prev, keywords: event.target.value }))
          }
        />
        <label>
          Linked case IDs (comma separated)
          <input
            value={watchlistForm.linkedCaseIds}
            onChange={(event) =>
              setWatchlistForm((prev) => ({ ...prev, linkedCaseIds: event.target.value }))
            }
          />
        </label>
        <button type="submit" className="approve-btn">
          Create watchlist
        </button>
      </form>
    </>
  );

  const renderRegistryTab = () => (
    <div>
      <div className="section-header">
        <span className="section-title">TOOL REGISTRY — BELLINGCAT SYNC</span>
        <div className="section-actions">
          <span className="section-note">Last sync: 1h ago · v2025-03-31</span>
          <button className="approve-btn">SYNC NOW</button>
        </div>
      </div>
      <div className="registry-grid">
        {REGISTRY_STATS.map((stat) => (
          <div key={stat.category} className="registry-card">
            <div className="registry-card__header">
              <span className="registry-card__label">{stat.category}</span>
              <span className="registry-card__total">{stat.total} tools</span>
            </div>
            <div className="registry-card__bars">
              <div
                className="registry-card__approved"
                style={{ flex: stat.approved }}
              />
              <div
                className="registry-card__review"
                style={{ flex: stat.review }}
              />
            </div>
            <div className="registry-card__legend">
              <span className="legend-approved">• {stat.approved} APPROVED</span>
              <span className="legend-review">• {stat.review} UNDER REVIEW</span>
            </div>
          </div>
        ))}
      </div>
      <div className="registry-history">
        {[
          {
            version: "v2025-03-31",
            date: "Today 13:00",
            added: 3,
            updated: 7,
            deprecated: 1,
          },
          {
            version: "v2025-03-30",
            date: "Yesterday 18:00",
            added: 0,
            updated: 2,
            deprecated: 0,
          },
          {
            version: "v2025-03-30",
            date: "Yesterday 06:00",
            added: 0,
            updated: 4,
            deprecated: 0,
          },
        ].map((item, index) => (
          <div
            key={`${item.version}-${index}`}
            className="history-row"
            style={{ borderBottom: index < 2 ? "1px solid #111820" : "none" }}
          >
            <span className="history-version">{item.version}</span>
            <span className="history-date">{item.date}</span>
            <span className="history-added">+{item.added} added</span>
            <span className="history-updated">~{item.updated} updated</span>
            <span className="history-deprecated">-{item.deprecated} deprecated</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEventLogTab = () => (
    <div>
      <div className="section-title">EVENT LOG — TODAY</div>
      <div className="event-log">
        {EVENTS.map((event, index) => {
          const typeColors: Record<typeof event.type, string> = {
            flag: "#f97316",
            pass: "#22c55e",
            info: "#6366f1",
            sync: "#8b5cf6",
            assign: "#3b82f6",
          };
          return (
            <div key={index} className="event-row">
              <span className="event-time">{event.time}</span>
              <div
                className="event-marker"
                style={{ background: typeColors[event.type] }}
              />
              <div>
                <span
                  className="event-agent"
                  style={{ color: typeColors[event.type] }}
                >
                  {event.agent.toUpperCase()}
                </span>
                <span className="event-text">{event.event}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCheckList = () => (
    <div className="checklist">
      <div className="section-title">STORY SCORING CHECKLIST</div>
      <div className="checklist-grid">
        {STORY_SCORING_CHECKLIST.map((box) => (
          <label key={box.key} className="checklist-item">
            <input type="checkbox" disabled />
            <span>{box.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderFeedsTab = () => (
    <div>
      <div className="section-title">FEED SCHEDULE & SCORE GUIDANCE</div>
      <div className="feed-grid">
        {scheduledRuns.map((run) => (
          <div key={run.window} className="feed-card">
            <div className="feed-card__header">
              <div>
                <div className="feed-card__title">{run.window} UTC</div>
                <div className="feed-card__subtitle">{run.focus}</div>
              </div>
            </div>
            <div className="feed-card__body">
              <div className="feed-card__label">Sources (excerpt)</div>
              <ul className="feed-card__list">
                {run.sources.slice(0, 5).map((source) => (
                  <li key={source.id}>{source.name}</li>
                ))}
              </ul>
              <div className="feed-card__label">Social</div>
              <div className="feed-card__meta">
                Accounts: {run.social?.accounts.slice(0, 4).join(", ")}…
              </div>
              <div className="feed-card__meta">
                Searches: {run.social?.searches.slice(0, 3).join(" · ")}…
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderCheckList()}
      <div className="section-title">KEY DATABASES</div>
      <ul className="database-list">
        {getKeyDatabases().map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
      </div>
    );

  const renderResourceModal = () => {
      if (!modalResource) return null;
      return (
        <div className="modal-overlay" onClick={() => setModalResource(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{modalResource.title}</div>
                <div className="modal-subtitle">
                  {modalResource.type} · {modalResource.source}
                </div>
              </div>
              <button className="close-btn" onClick={() => setModalResource(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{modalResource.description}</p>
              <p className="modal-meta">
                Recorded {modalResource.timestamp} · {modalResource.tags.join(", ")}
              </p>
              <a
                href={modalResource.link}
                target="_blank"
                rel="noreferrer"
                className="modal-link"
              >
                Open resource
              </a>
        </div>
      </div>
      <div className="section-title">SOURCE REGISTRY</div>
      {renderSourceRegistryPanel()}
      <div className="section-title">SOURCE WATCHLISTS</div>
      {renderWatchlistPanel()}
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
          <span className="branding__sub">|</span>
          <span className="branding__tag">LAWFUL PUBLIC-SOURCE INTELLIGENCE</span>
        </div>
        <div className="header__actions">
          {stats.pendingApprovals > 0 && (
            <div className="header__badge">
              <div className="indicator pulse" />
              <span>{stats.pendingApprovals} AWAITING APPROVAL</span>
            </div>
          )}
          <span className="header__timestamp">31 MAR 2026 · 14:31 UTC</span>
        </div>
      </header>
      {renderStatsBar()}
      {renderPendingApproval()}
      {renderTabs()}
        <main className="content">
          {activeTab === "cases" && renderCasesTab()}
          {activeTab === "agents" && renderAgentsTab()}
          {activeTab === "registry" && renderRegistryTab()}
          {activeTab === "log" && renderEventLogTab()}
          {activeTab === "feeds" && renderFeedsTab()}
          {renderResourceModal()}
        </main>
      <footer className="page__footer">
        <div className="footer__info">
          <span>LAWFUL SOURCES ONLY</span>
          <span>EVIDENCE-BACKED CLAIMS</span>
          <span>HUMAN APPROVAL REQUIRED</span>
        </div>
        <span className="footer__brand">
          SIGNAL DESK v0.1 · POWERED BY PAPERCLIP
        </span>
      </footer>
    </div>
  );
}
