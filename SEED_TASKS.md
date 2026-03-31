# SEED_TASKS.md — First 10 Tasks, Review Gates & Commercialisation

---

## TOP 10 FIRST TASKS TO SEED IN PAPERCLIP

These are the founding tasks for Signal Desk. Seed them in the order listed.
Each task must be completed before the one after it can function properly.

---

### TASK 1 — Write the Company Goal
**Assigned to:** Human (you)
**Description:** Enter the Signal Desk company goal into Paperclip's company goal field.
Use the exact text from COMPANY_BRIEF.md. This is the north star every agent references.

```
Goal text:
"Run a lawful public-source intelligence desk. Accept structured case briefs, assign specialist
agents to collect and verify public-source evidence, produce auditable reports with confidence
ratings and preserved proof, and gate every external delivery behind QA, legal, and human approval.
Never collect private data, never compromise accounts, never publish unreviewed claims about
identifiable people or companies."
```

---

### TASK 2 — Hire the CEO Agent
**Assigned to:** Human (you)
**Description:** Create the CEO / Chief of Investigations agent in Paperclip.
- Name: Chief of Investigations
- Role: CEO
- System prompt: Paste the full AGENT 1 section from AGENTS.md
- Heartbeat: Every 4 hours
- First instruction: "Review the company goal. Confirm you understand the hard guardrails in SOUL.md.
  Report a brief status summary on your first heartbeat."

---

### TASK 3 — Hire the Intake & Scoping Agent
**Assigned to:** CEO
**Description:** Create the Intake & Scoping agent.
- System prompt: Paste AGENT 2 section from AGENTS.md
- Heartbeat: Event-driven + 12-hour check for stalled cases

---

### TASK 4 — Hire the Tool Librarian Agent and Run First Sync
**Assigned to:** CEO
**Description:** Create the Tool Librarian agent.
- System prompt: Paste AGENT 3 section from AGENTS.md
- Heartbeat: 06:00 and 18:00 UTC daily
- First task: "Fetch the latest Bellingcat toolkit CSV release from GitHub.
  Download all category CSV files. Parse and normalise each record.
  Import into the tool registry. Log the sync. Report back with counts:
  records imported, categories covered, any tools flagged for review."

---

### TASK 5 — Review and Approve Initial Tool Registry
**Assigned to:** Human (you)
**Description:** After Task 4 completes, review the tool registry output.
- Check the UNDER_REVIEW tools flagged by the Tool Librarian
- Approve tools in the COMPANIES_FINANCE and ARCHIVING categories first (MVP priority)
- Set status: APPROVED for safe, well-known tools
- Set status: RESTRICTED for any tools with legal concerns
- Set status: UNDER_REVIEW for anything unfamiliar

**This is the most important manual step before any case work can begin.**

---

### TASK 6 — Hire the Companies & Finance Collection Agent
**Assigned to:** CEO
**Description:** Create the first specialist collection agent.
- System prompt: Paste AGENT 4e section from AGENTS.md
- Focus: Corporate due diligence, beneficial ownership, sanctions, adverse media
- This is the MVP niche agent — invest the most in its prompt quality

---

### TASK 7 — Hire the Archiving & Preservation Agent
**Assigned to:** CEO
**Description:** Create the Preservation Agent.
- System prompt: Paste AGENT 4h section from AGENTS.md
- Heartbeat: Event-driven + daily audit at 02:00 UTC
- This agent must be assigned to every case, no exceptions

---

### TASK 8 — Hire the Verification, QA, and Legal Agents
**Assigned to:** CEO
**Description:** Create the three review-stage agents:
- Verification Agent (AGENT 5 from AGENTS.md)
- QA / Fact-Check Agent (AGENT 7)
- Legal / Ethics Reviewer Agent (AGENT 8)
- All are event-driven, no regular heartbeat needed

---

### TASK 9 — Run a Test Case (Internal Dry Run)
**Assigned to:** CEO
**Description:** Create a test case using a publicly known company (e.g. a well-documented
public company with published accounts). Run it through the full pipeline:
- Scoping → Collection → Preservation → Verification → Report → QA → Legal → Human Approval
- The purpose is to validate the pipeline, not produce a real client deliverable.
- Document any gaps, broken handoffs, or missing tool registry entries.
- Human reviewer: approve or reject the test report and note what needs improving.

---

### TASK 10 — Set Up the Human Approval Queue
**Assigned to:** Human (you)
**Description:** Configure the Paperclip approval workflow so that:
- Every report reaches a human approval task before delivery
- You receive a notification when a report is pending approval
- The approval task includes the checklist from HEARTBEAT.md
- SLA: 24 hours standard, 4 hours for CRITICAL
- No report can be delivered without your explicit approval action

---

## MUST-HAVE REVIEW GATES BEFORE EXTERNAL DELIVERY

These are non-negotiable checkpoints. Every single one must pass before a report leaves Signal Desk.

| Gate | Owner | Passes When |
|------|-------|-------------|
| 1. Case scoped | Intake Agent | Case has central question, risk level, allowed sources, evidence threshold |
| 2. High-risk human pre-approval | Human | Risk Level HIGH/CRITICAL cases approved before collection begins |
| 3. Preservation complete | Preservation Agent | Every evidence item has a preserved_at timestamp and archive_location |
| 4. Verification complete | Verification Agent | Every claim has a status and confidence band |
| 5. Evidence threshold met | Verification Agent | Minimum independent sources reached per case brief |
| 6. No CONFIRMED claims with <2 sources | Verification Agent | Confirmed status requires 2+ independent sources |
| 7. QA passed | QA Agent | qa_status: PASSED or PASSED_WITH_FLAGS |
| 8. Legal cleared | Legal Agent | legal_status: CLEAR or CONDITIONAL (conditions met) |
| 9. No doxxing | Legal Agent | No private addresses, phone numbers, family data without lawful basis |
| 10. Confidence ratings present | Report Writer | Every major claim has a confidence band in the report |
| 11. Evidence index present | Report Writer | Report includes full list of evidence items with archive locations |
| 12. Scope/limitations stated | Report Writer | Report includes what was not looked at and why |
| 13. Human final approval | Human reviewer | approval_status: APPROVED |

**All 13 gates must be satisfied. No exceptions.**

---

## RECOMMENDED FIRST COMMERCIALISATION NICHE

### Corporate Due Diligence & Beneficial Ownership

**Why this is the right first niche:**

- **Clear legal framework.** KYC, AML, and sanctions compliance are legal obligations
  for banks, law firms, and professional services firms. The use case is unambiguous.
- **Client budget exists.** Compliance teams have procurement budgets. The cost of
  a failed KYC check vastly exceeds the cost of a research desk report.
- **Lower individual-rights risk.** Corporate subjects have reduced privacy expectations
  compared to private individuals. Company registrations, accounts, and ownership
  filings are public by design.
- **Standardised output format.** Due diligence memos follow a well-understood structure
  that legal and compliance professionals already know how to use.
- **Tool registry alignment.** The COMPANIES_FINANCE, ARCHIVING, and WEBSITES categories
  in the Bellingcat toolkit map directly to this use case.
- **Scalable.** Each case is bounded, deliverable, and repeatable. Volume builds revenue
  without proportionate risk increase.
- **Audit trail is the product.** The preserved evidence and confidence ratings are not
  just quality controls — they are a selling point for regulated clients who need to
  show their own regulators how they conducted due diligence.

**Target first clients:**
- Boutique law firms (M&A, cross-border transactions)
- Independent financial advisers (FCA regulated)
- Due diligence and risk consulting firms
- Compliance-as-a-service platforms (white-label)
- Investigative journalists needing corporate research support

**MVP report format: Corporate Due Diligence Memo**

Sections:
1. Subject overview (company name, number, jurisdiction, incorporated date)
2. Beneficial ownership map (directors, shareholders, PSC register)
3. Sanctions and PEP screening results
4. Adverse media summary (with confidence ratings and source links)
5. Web / domain footprint
6. Key person summary (directors and significant persons)
7. Risk summary and flags
8. Evidence index
9. Confidence statement
10. Scope and limitations

**Pricing model (indicative):**
- Standard company check (UK registered): £150–£350
- International ownership mapping: £500–£1,500
- Complex multi-jurisdiction structure: £2,000+
- Ongoing monitoring (quarterly updates): subscription

**Differentiator:** Not just a database lookup. Every finding is linked to preserved
evidence, every claim carries a confidence rating, and every report is human-reviewed
before delivery. Clients get auditability they can show to regulators.
