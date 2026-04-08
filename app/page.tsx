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
