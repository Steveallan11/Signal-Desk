import { useState } from "react";

const CASES = [
  { id: "CASE-2025-0014", title: "Meridian Capital Ltd — Beneficial Ownership", type: "DUE_DILIGENCE", priority: "HIGH", status: "LEGAL_REVIEW", subject: "Meridian Capital Ltd", risk: "HIGH", agent: "Companies & Finance", updated: "2h ago", claims: 12, evidence: 34, qaStatus: "PASSED" },
  { id: "CASE-2025-0013", title: "Arktis Holdings SA — Sanctions Exposure", type: "SANCTIONS_MAPPING", priority: "CRITICAL", status: "PENDING_APPROVAL", subject: "Arktis Holdings SA", risk: "CRITICAL", agent: "Companies & Finance", updated: "4h ago", claims: 8, evidence: 21, qaStatus: "PASSED" },
  { id: "CASE-2025-0012", title: "Novus Pharma Group — Adverse Media Monitor", type: "NARRATIVE_MONITORING", priority: "MEDIUM", status: "ACTIVE", subject: "Novus Pharma Group", risk: "MEDIUM", agent: "Social Monitoring", updated: "1h ago", claims: 5, evidence: 18, qaStatus: "PENDING" },
  { id: "CASE-2025-0011", title: "Baltic Ventures Ltd — Director Background", type: "DUE_DILIGENCE", priority: "MEDIUM", status: "DELIVERED", subject: "Baltic Ventures Ltd", risk: "MEDIUM", agent: "Companies & Finance", updated: "1d ago", claims: 15, evidence: 42, qaStatus: "PASSED" },
  { id: "CASE-2025-0010", title: "Redwood Media Group — Web Infrastructure", type: "DUE_DILIGENCE", priority: "LOW", status: "VERIFICATION", subject: "Redwood Media Group", risk: "LOW", agent: "Web/Domain", updated: "3h ago", claims: 6, evidence: 14, qaStatus: "PENDING" },
  { id: "CASE-2025-0009", title: "Cascade Logistics — Ownership Chain", type: "DUE_DILIGENCE", priority: "HIGH", status: "SCOPED", subject: "Cascade Logistics", risk: "HIGH", agent: "Unassigned", updated: "30m ago", claims: 0, evidence: 0, qaStatus: "PENDING" },
];

const AGENTS = [
  { id: "ceo", name: "Chief of Investigations", role: "CEO", status: "ACTIVE", lastBeat: "12m ago", activeCases: 6, tasksToday: 14 },
  { id: "intake", name: "Intake & Scoping", role: "Intake", status: "ACTIVE", lastBeat: "2h ago", activeCases: 1, tasksToday: 3 },
  { id: "toollib", name: "Tool Librarian", role: "Registry", status: "ACTIVE", lastBeat: "1h ago", activeCases: 0, tasksToday: 2 },
  { id: "corps", name: "Companies & Finance", role: "Collection", status: "ACTIVE", lastBeat: "45m ago", activeCases: 3, tasksToday: 8 },
  { id: "archive", name: "Archiving & Preservation", role: "Preservation", status: "ACTIVE", lastBeat: "20m ago", activeCases: 4, tasksToday: 22 },
  { id: "verify", name: "Verification", role: "Verification", status: "IDLE", lastBeat: "3h ago", activeCases: 1, tasksToday: 5 },
  { id: "writer", name: "Report Writer", role: "Reporting", status: "IDLE", lastBeat: "5h ago", activeCases: 0, tasksToday: 1 },
  { id: "qa", name: "QA / Fact-Check", role: "QA", status: "ACTIVE", lastBeat: "1h ago", activeCases: 1, tasksToday: 4 },
  { id: "legal", name: "Legal / Ethics Reviewer", role: "Legal", status: "ACTIVE", lastBeat: "2h ago", activeCases: 1, tasksToday: 2 },
];

const APPROVALS = [
  { id: "APR-041", case: "CASE-2025-0013", title: "Arktis Holdings SA — Sanctions", urgency: "CRITICAL", waitingHours: 2, qaStatus: "PASSED", legalStatus: "CONDITIONAL" },
];

const REGISTRY_STATS = [
  { category: "Companies & Finance", approved: 18, review: 3, total: 21 },
  { category: "Archiving", approved: 12, review: 1, total: 13 },
  { category: "Social Media", approved: 9, review: 4, total: 13 },
  { category: "Websites", approved: 14, review: 2, total: 16 },
  { category: "People", approved: 6, review: 5, total: 11 },
  { category: "Geolocation", approved: 11, review: 2, total: 13 },
];

const EVENTS = [
  { time: "14:23", agent: "Legal Reviewer", event: "CASE-2025-0013 marked CONDITIONAL — sanctions hit requires human review", type: "flag" },
  { time: "13:58", agent: "QA Agent", event: "CASE-2025-0013 QA passed with 0 flags", type: "pass" },
  { time: "13:41", agent: "Preservation Agent", event: "34 evidence items archived for CASE-2025-0014", type: "info" },
  { time: "12:07", agent: "Tool Librarian", event: "Bellingcat sync complete — 3 new tools added, 1 deprecated", type: "sync" },
  { time: "11:30", agent: "CEO", event: "CASE-2025-0009 scoped — assigned to Companies & Finance agent", type: "assign" },
  { time: "10:14", agent: "Verification Agent", event: "CASE-2025-0012 — 2 claims flagged as LOW confidence, collection gap noted", type: "flag" },
  { time: "09:00", agent: "CEO", event: "Heartbeat: 6 active cases reviewed, 1 pending approval escalated", type: "info" },
];

const STATUS_META = {
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
  PENDING_APPROVAL: { label: "Awaiting Approval", color: "#eab308" },
  APPROVED: { label: "Approved", color: "#22c55e" },
  DELIVERED: { label: "Delivered", color: "#059669" },
  PAUSED: { label: "Paused", color: "#94a3b8" },
};

const RISK_COLORS = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#7c3aed",
};

export default function SignalDesk() {
  const [activeTab, setActiveTab] = useState("cases");
  const [selectedCase, setSelectedCase] = useState(null);

  const pendingApprovals = CASES.filter(c => c.status === "PENDING_APPROVAL").length;
  const activeCases = CASES.filter(c => !["DELIVERED", "CLOSED"].includes(c.status)).length;
  const totalEvidence = CASES.reduce((sum, c) => sum + c.evidence, 0);

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0a0c10",
      color: "#c9d1d9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
        .hover-row:hover { background: rgba(99,102,241,0.07) !important; cursor: pointer; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.1em; padding: 10px 20px; transition: all 0.2s; }
        .tab-btn.active { color: #e2e8f0; border-bottom: 2px solid #6366f1; }
        .tab-btn:not(.active) { color: #64748b; border-bottom: 2px solid transparent; }
        .tab-btn:hover:not(.active) { color: #94a3b8; }
        .stat-card { background: #0d1117; border: 1px solid #1e2530; border-radius: 6px; padding: 20px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; letter-spacing: 0.08em; font-weight: 500; }
        .approve-btn { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; letter-spacing: 0.05em; transition: background 0.2s; }
        .approve-btn:hover { background: #4f46e5; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .scanline { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); z-index: 1000; }
      `}</style>

      <div className="scanline" />

      {/* Header */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2530", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} className="pulse" />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: "0.15em", color: "#e2e8f0" }}>SIGNAL DESK</span>
          <span style={{ color: "#30363d", fontSize: 12 }}>|</span>
          <span style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>LAWFUL PUBLIC-SOURCE INTELLIGENCE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {pendingApprovals > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d1b00", border: "1px solid #92400e", borderRadius: 4, padding: "4px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} className="pulse" />
              <span style={{ fontSize: 11, color: "#f59e0b", letterSpacing: "0.08em" }}>{pendingApprovals} AWAITING APPROVAL</span>
            </div>
          )}
          <span style={{ fontSize: 11, color: "#4b5563" }}>31 MAR 2026 · 14:31 UTC</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#0a0c10", borderBottom: "1px solid #1a1f27", padding: "12px 32px", display: "flex", gap: 32 }}>
        {[
          { label: "ACTIVE CASES", value: activeCases, accent: "#6366f1" },
          { label: "PENDING APPROVAL", value: pendingApprovals, accent: "#eab308" },
          { label: "EVIDENCE ITEMS", value: totalEvidence, accent: "#3b82f6" },
          { label: "AGENTS ONLINE", value: AGENTS.filter(a => a.status === "ACTIVE").length, accent: "#22c55e" },
          { label: "TOOLS APPROVED", value: REGISTRY_STATS.reduce((s, r) => s + r.approved, 0), accent: "#8b5cf6" },
          { label: "LAST SYNC", value: "1h ago", accent: "#64748b" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 9, color: "#4b5563", letterSpacing: "0.12em" }}>{s.label}</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: s.accent, fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Approval banner */}
      {APPROVALS.length > 0 && (
        <div style={{ background: "#1a1200", borderBottom: "2px solid #92400e", padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, color: "#f59e0b", letterSpacing: "0.12em", background: "#451a03", padding: "2px 8px", borderRadius: 2 }}>HUMAN ACTION REQUIRED</span>
            <span style={{ fontSize: 12, color: "#fcd34d" }}>{APPROVALS[0].title} — Legal status CONDITIONAL · Waiting {APPROVALS[0].waitingHours}h</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="approve-btn" style={{ background: "#166534", border: "1px solid #166534" }}>APPROVE DELIVERY</button>
            <button className="approve-btn" style={{ background: "#7f1d1d", border: "1px solid #7f1d1d" }}>REQUEST REVISION</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2530", padding: "0 32px", display: "flex" }}>
        {[["cases","CASES"],["agents","AGENTS"],["registry","TOOL REGISTRY"],["log","EVENT LOG"]].map(([id, label]) => (
          <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>

        {/* CASES TAB */}
        {activeTab === "cases" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>CASE PORTFOLIO — {CASES.length} CASES</span>
              <button className="approve-btn" style={{ fontSize: 10 }}>+ NEW CASE</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2530" }}>
                  {["CASE ID","TITLE","TYPE","RISK","STATUS","EVIDENCE","CLAIMS","QA","UPDATED"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 9, color: "#4b5563", letterSpacing: "0.12em", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CASES.map(c => {
                  const sm = STATUS_META[c.status] || { label: c.status, color: "#64748b" };
                  return (
                    <tr key={c.id} className="hover-row" onClick={() => setSelectedCase(selectedCase?.id === c.id ? null : c)}
                      style={{ borderBottom: "1px solid #111820", background: selectedCase?.id === c.id ? "rgba(99,102,241,0.08)" : "transparent" }}>
                      <td style={{ padding: "12px", fontSize: 11, color: "#6366f1" }}>{c.id}</td>
                      <td style={{ padding: "12px", fontSize: 11, color: "#d1d5db", maxWidth: 240 }}>{c.title}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em" }}>{c.type.replace("_", " ")}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge" style={{ background: RISK_COLORS[c.risk] + "22", color: RISK_COLORS[c.risk], border: `1px solid ${RISK_COLORS[c.risk]}44` }}>{c.risk}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 10, color: sm.color, letterSpacing: "0.05em" }}>● {sm.label}</span>
                      </td>
                      <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>{c.evidence}</td>
                      <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>{c.claims}</td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge" style={{
                          background: c.qaStatus === "PASSED" ? "#052e16" : "#1c1917",
                          color: c.qaStatus === "PASSED" ? "#86efac" : "#78716c",
                          border: `1px solid ${c.qaStatus === "PASSED" ? "#14532d" : "#292524"}`
                        }}>{c.qaStatus}</span>
                      </td>
                      <td style={{ padding: "12px", fontSize: 10, color: "#4b5563" }}>{c.updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Case detail panel */}
            {selectedCase && (
              <div style={{ marginTop: 20, background: "#0d1117", border: "1px solid #1e2530", borderRadius: 6, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#6366f1", letterSpacing: "0.12em", marginBottom: 6 }}>{selectedCase.id}</div>
                    <div style={{ fontSize: 14, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{selectedCase.title}</div>
                  </div>
                  <button onClick={() => setSelectedCase(null)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    ["Case Type", selectedCase.type.replace("_"," ")],
                    ["Risk Level", selectedCase.risk],
                    ["Status", STATUS_META[selectedCase.status]?.label || selectedCase.status],
                    ["Assigned Agent", selectedCase.agent],
                    ["Evidence Items", selectedCase.evidence],
                    ["Claims", selectedCase.claims],
                    ["QA Status", selectedCase.qaStatus],
                    ["Last Updated", selectedCase.updated],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background: "#111820", borderRadius: 4, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "12px 14px", background: "#080b0f", borderRadius: 4, border: "1px solid #1a1f27" }}>
                  <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: "0.1em", marginBottom: 8 }}>PIPELINE PROGRESS</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {["SCOPED","ACTIVE","VERIFICATION","QA_PASSED","LEGAL_REVIEW","PENDING_APPROVAL","DELIVERED"].map((s, i, arr) => {
                      const statuses = ["SCOPED","ACTIVE","VERIFICATION","QA_PASSED","LEGAL_REVIEW","PENDING_APPROVAL","DELIVERED"];
                      const currentIdx = statuses.indexOf(selectedCase.status);
                      const thisIdx = statuses.indexOf(s);
                      const done = thisIdx < currentIdx;
                      const current = thisIdx === currentIdx;
                      return (
                        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: done ? "#6366f1" : current ? "#eab308" : "#1e2530", border: `2px solid ${done ? "#6366f1" : current ? "#eab308" : "#1e2530"}`, marginBottom: 4 }} />
                            <span style={{ fontSize: 8, color: done ? "#6366f1" : current ? "#eab308" : "#2d3748", letterSpacing: "0.05em", textAlign: "center" }}>{STATUS_META[s]?.label || s}</span>
                          </div>
                          {i < arr.length - 1 && <div style={{ height: 1, background: done ? "#6366f1" : "#1e2530", flex: 0, width: 0 }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === "agents" && (
          <div>
            <div style={{ marginBottom: 20, fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>AGENT ROSTER — {AGENTS.length} AGENTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {AGENTS.map(a => (
                <div key={a.id} style={{ background: "#0d1117", border: `1px solid ${a.status === "ACTIVE" ? "#1a2535" : "#1a1f27"}`, borderRadius: 6, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 4 }}>{a.name}</div>
                      <span style={{ fontSize: 9, color: "#6366f1", letterSpacing: "0.1em" }}>{a.role.toUpperCase()}</span>
                    </div>
                    <span className="badge" style={{
                      background: a.status === "ACTIVE" ? "#052e16" : "#1c1917",
                      color: a.status === "ACTIVE" ? "#86efac" : "#78716c",
                      border: `1px solid ${a.status === "ACTIVE" ? "#14532d" : "#292524"}`,
                    }}>
                      {a.status === "ACTIVE" && <span className="pulse">● </span>}{a.status}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[["LAST BEAT", a.lastBeat], ["CASES", a.activeCases], ["TASKS TODAY", a.tasksToday]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.1em", marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 13, color: "#94a3b8" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOL REGISTRY TAB */}
        {activeTab === "registry" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>TOOL REGISTRY — BELLINGCAT SYNC</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#4b5563" }}>Last sync: 1h ago · v2025-03-31</span>
                <button className="approve-btn" style={{ fontSize: 10 }}>SYNC NOW</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {REGISTRY_STATS.map(r => (
                <div key={r.category} style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 6, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{r.category}</span>
                    <span style={{ fontSize: 10, color: "#4b5563" }}>{r.total} tools</span>
                  </div>
                  <div style={{ display: "flex", gap: 2, height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ background: "#6366f1", flex: r.approved }} />
                    <div style={{ background: "#f59e0b", flex: r.review }} />
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 9, color: "#6366f1", letterSpacing: "0.08em" }}>● {r.approved} APPROVED</span>
                    <span style={{ fontSize: 9, color: "#f59e0b", letterSpacing: "0.08em" }}>● {r.review} UNDER REVIEW</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: "#0d1117", border: "1px solid #1a2535", borderRadius: 6, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", marginBottom: 12 }}>SYNC HISTORY</div>
              {[
                { version: "v2025-03-31", date: "Today 13:00", added: 3, updated: 7, deprecated: 1 },
                { version: "v2025-03-30", date: "Yesterday 18:00", added: 0, updated: 2, deprecated: 0 },
                { version: "v2025-03-30", date: "Yesterday 06:00", added: 0, updated: 4, deprecated: 0 },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "8px 0", borderBottom: i < 2 ? "1px solid #111820" : "none" }}>
                  <span style={{ fontSize: 10, color: "#6366f1", width: 100 }}>{s.version}</span>
                  <span style={{ fontSize: 10, color: "#4b5563", width: 120 }}>{s.date}</span>
                  <span style={{ fontSize: 9, color: "#22c55e" }}>+{s.added} added</span>
                  <span style={{ fontSize: 9, color: "#f59e0b" }}>~{s.updated} updated</span>
                  <span style={{ fontSize: 9, color: "#ef4444" }}>-{s.deprecated} deprecated</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENT LOG TAB */}
        {activeTab === "log" && (
          <div>
            <div style={{ marginBottom: 20, fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>EVENT LOG — TODAY</div>
            <div style={{ background: "#0d1117", border: "1px solid #1e2530", borderRadius: 6, overflow: "hidden" }}>
              {EVENTS.map((e, i) => {
                const typeColors = { flag: "#f97316", pass: "#22c55e", info: "#6366f1", sync: "#8b5cf6", assign: "#3b82f6" };
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "12px 16px", borderBottom: i < EVENTS.length - 1 ? "1px solid #111820" : "none" }}>
                    <span style={{ fontSize: 11, color: "#374151", minWidth: 40, fontFeatureSettings: '"tnum"' }}>{e.time}</span>
                    <div style={{ width: 2, alignSelf: "stretch", background: typeColors[e.type] || "#374151", borderRadius: 1, opacity: 0.7 }} />
                    <div>
                      <span style={{ fontSize: 9, color: typeColors[e.type] || "#374151", letterSpacing: "0.1em", marginRight: 8 }}>{e.agent.toUpperCase()}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{e.event}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#0d1117", borderTop: "1px solid #1a1f27", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ fontSize: 9, color: "#374151", letterSpacing: "0.08em" }}>LAWFUL SOURCES ONLY</span>
          <span style={{ fontSize: 9, color: "#374151", letterSpacing: "0.08em" }}>EVIDENCE-BACKED CLAIMS</span>
          <span style={{ fontSize: 9, color: "#374151", letterSpacing: "0.08em" }}>HUMAN APPROVAL REQUIRED</span>
        </div>
        <span style={{ fontSize: 9, color: "#1e2530", letterSpacing: "0.08em" }}>SIGNAL DESK v0.1 · POWERED BY PAPERCLIP</span>
      </div>
    </div>
  );
}
