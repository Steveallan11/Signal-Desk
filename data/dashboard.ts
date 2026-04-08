export type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type CaseType = "DUE_DILIGENCE" | "SANCTIONS_MAPPING" | "NARRATIVE_MONITORING";

export type CaseStatus =
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

export interface CaseRecord {
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
}

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "IDLE";
  lastBeat: string;
  activeCases: number;
  tasksToday: number;
}

export interface ApprovalRecord {
  id: string;
  case: string;
  title: string;
  urgency: CasePriority;
  waitingHours: number;
  qaStatus: "PASSED" | "FAILED" | "PENDING";
  legalStatus: "CONDITIONAL" | "CLEAR" | "BLOCKED";
}

export interface RegistryStat {
  category: string;
  approved: number;
  review: number;
  total: number;
}

export interface EventRecord {
  time: string;
  agent: string;
  event: string;
  type: "flag" | "pass" | "info" | "sync" | "assign";
}

export interface StatusMeta {
  label: string;
  color: string;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const CASES: CaseRecord[] = [
  {
    id: "CASE-2025-0014",
    title: "Meridian Capital Ltd - Beneficial Ownership",
    type: "DUE_DILIGENCE",
    priority: "HIGH",
    status: "LEGAL_REVIEW",
    subject: "Meridian Capital Ltd",
    risk: "HIGH",
    agent: "Companies & Finance",
    updated: "2h ago",
    claims: 12,
    evidence: 34,
    qaStatus: "PASSED",
  },
  {
    id: "CASE-2025-0013",
    title: "Arktis Holdings SA - Sanctions Exposure",
    type: "SANCTIONS_MAPPING",
    priority: "CRITICAL",
    status: "PENDING_APPROVAL",
    subject: "Arktis Holdings SA",
    risk: "CRITICAL",
    agent: "Companies & Finance",
    updated: "4h ago",
    claims: 8,
    evidence: 21,
    qaStatus: "PASSED",
  },
  {
    id: "CASE-2025-0012",
    title: "Novus Pharma Group - Adverse Media Monitor",
    type: "NARRATIVE_MONITORING",
    priority: "MEDIUM",
    status: "ACTIVE",
    subject: "Novus Pharma Group",
    risk: "MEDIUM",
    agent: "Social Monitoring",
    updated: "1h ago",
    claims: 5,
    evidence: 18,
    qaStatus: "PENDING",
  },
  {
    id: "CASE-2025-0011",
    title: "Baltic Ventures Ltd - Director Background",
    type: "DUE_DILIGENCE",
    priority: "MEDIUM",
    status: "DELIVERED",
    subject: "Baltic Ventures Ltd",
    risk: "MEDIUM",
    agent: "Companies & Finance",
    updated: "1d ago",
    claims: 15,
    evidence: 42,
    qaStatus: "PASSED",
  },
  {
    id: "CASE-2025-0010",
    title: "Redwood Media Group - Web Infrastructure",
    type: "DUE_DILIGENCE",
    priority: "LOW",
    status: "VERIFICATION",
    subject: "Redwood Media Group",
    risk: "LOW",
    agent: "Web/Domain",
    updated: "3h ago",
    claims: 6,
    evidence: 14,
    qaStatus: "PENDING",
  },
  {
    id: "CASE-2025-0009",
    title: "Cascade Logistics - Ownership Chain",
    type: "DUE_DILIGENCE",
    priority: "HIGH",
    status: "SCOPED",
    subject: "Cascade Logistics",
    risk: "HIGH",
    agent: "Unassigned",
    updated: "30m ago",
    claims: 0,
    evidence: 0,
    qaStatus: "PENDING",
  },
];

export const AGENTS: AgentRecord[] = [
  {
    id: "ceo",
    name: "Chief of Investigations",
    role: "CEO",
    status: "ACTIVE",
    lastBeat: "12m ago",
    activeCases: 6,
    tasksToday: 14,
  },
  {
    id: "intake",
    name: "Intake & Scoping",
    role: "Intake",
    status: "ACTIVE",
    lastBeat: "2h ago",
    activeCases: 1,
    tasksToday: 3,
  },
  {
    id: "toollib",
    name: "Tool Librarian",
    role: "Registry",
    status: "ACTIVE",
    lastBeat: "1h ago",
    activeCases: 0,
    tasksToday: 2,
  },
  {
    id: "corps",
    name: "Companies & Finance",
    role: "Collection",
    status: "ACTIVE",
    lastBeat: "45m ago",
    activeCases: 3,
    tasksToday: 8,
  },
  {
    id: "archive",
    name: "Archiving & Preservation",
    role: "Preservation",
    status: "ACTIVE",
    lastBeat: "20m ago",
    activeCases: 4,
    tasksToday: 22,
  },
  {
    id: "verify",
    name: "Verification",
    role: "Verification",
    status: "IDLE",
    lastBeat: "3h ago",
    activeCases: 1,
    tasksToday: 5,
  },
  {
    id: "writer",
    name: "Report Writer",
    role: "Reporting",
    status: "IDLE",
    lastBeat: "5h ago",
    activeCases: 0,
    tasksToday: 1,
  },
  {
    id: "qa",
    name: "QA / Fact-Check",
    role: "QA",
    status: "ACTIVE",
    lastBeat: "1h ago",
    activeCases: 1,
    tasksToday: 4,
  },
  {
    id: "legal",
    name: "Legal / Ethics Reviewer",
    role: "Legal",
    status: "ACTIVE",
    lastBeat: "2h ago",
    activeCases: 1,
    tasksToday: 2,
  },
];

export const APPROVALS: ApprovalRecord[] = [
  {
    id: "APR-041",
    case: "CASE-2025-0013",
    title: "Arktis Holdings SA - Sanctions",
    urgency: "CRITICAL",
    waitingHours: 2,
    qaStatus: "PASSED",
    legalStatus: "CONDITIONAL",
  },
];

export const REGISTRY_STATS: RegistryStat[] = [
  { category: "Companies & Finance", approved: 18, review: 3, total: 21 },
  { category: "Archiving", approved: 12, review: 1, total: 13 },
  { category: "Social Media", approved: 9, review: 4, total: 13 },
  { category: "Websites", approved: 14, review: 2, total: 16 },
  { category: "People", approved: 6, review: 5, total: 11 },
  { category: "Geolocation", approved: 11, review: 2, total: 13 },
];

export const EVENTS: EventRecord[] = [
  {
    time: "14:23",
    agent: "Legal Reviewer",
    event: "CASE-2025-0013 marked CONDITIONAL - sanctions hit requires human review",
    type: "flag",
  },
  {
    time: "13:58",
    agent: "QA Agent",
    event: "CASE-2025-0013 QA passed with 0 flags",
    type: "pass",
  },
  {
    time: "13:41",
    agent: "Preservation Agent",
    event: "34 evidence items archived for CASE-2025-0014",
    type: "info",
  },
  {
    time: "12:07",
    agent: "Tool Librarian",
    event: "Bellingcat sync complete - 3 new tools added, 1 deprecated",
    type: "sync",
  },
  {
    time: "11:30",
    agent: "CEO",
    event: "CASE-2025-0009 scoped - assigned to Companies & Finance agent",
    type: "assign",
  },
  {
    time: "10:14",
    agent: "Verification Agent",
    event: "CASE-2025-0012 - 2 claims flagged as LOW confidence, collection gap noted",
    type: "flag",
  },
  {
    time: "09:00",
    agent: "CEO",
    event: "Heartbeat: 6 active cases reviewed, 1 pending approval escalated",
    type: "info",
  },
];

export const STATUS_META: Record<CaseStatus, StatusMeta> = {
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

export const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#7c3aed",
};
