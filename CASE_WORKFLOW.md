# CASE_WORKFLOW.md — Signal Desk Case Pipeline
### From Intake to Delivery

---

## Pipeline Overview

Every case in Signal Desk passes through 10 mandatory stages.
No stage may be skipped. Each stage produces an output that gates the next stage.

```
STAGE 1  →  Intake & Request Parsing
STAGE 2  →  Scoping & Case Brief
STAGE 3  →  CEO Review & Assignment
STAGE 4  →  Tool Selection
STAGE 5  →  Collection (+ parallel Preservation)
STAGE 6  →  Verification & Confidence Rating
STAGE 7  →  Report Drafting
STAGE 8  →  QA / Fact-Check
STAGE 9  →  Legal / Ethics Review
STAGE 10 →  Human Approval → Delivery
```

---

## STAGE 1 — Intake & Request Parsing

**Owner:** Intake & Scoping Agent
**Input:** Raw client or internal request
**Trigger:** New case request received

**Actions:**
- Parse request for: subject, question, geography, timeframe, output needed
- Check requester identity is confirmed
- Check stated purpose is lawful
- If purpose is unclear or potentially unlawful → REJECT with explanation
- If purpose is potentially sensitive but lawful → flag for Risk Level: HIGH review

**Output:** Draft Case object (status: INTAKE)

**Gate:** Purpose must be articulable and lawful to proceed.

---

## STAGE 2 — Scoping & Case Brief

**Owner:** Intake & Scoping Agent
**Input:** Draft Case object

**Actions:**
- Define central question (single sentence)
- Identify and create Entity objects for all subject entities
- Set geography scope (country/region/global)
- Set date range (or open if monitoring)
- Assign Risk Level: LOW / MEDIUM / HIGH / CRITICAL
- List allowed source categories (from Tool Registry)
- Set evidence threshold (minimum number of independent confirmed sources required)
- Define required output type
- Write a 2-3 sentence case description

**Risk Level criteria:**
| Level    | Trigger condition                                                      |
|----------|------------------------------------------------------------------------|
| LOW      | Public company, no individual subjects, low reputational sensitivity   |
| MEDIUM   | Named individual who is a public figure in their professional capacity |
| HIGH     | Private individual, significant reputational risk, legal sensitivity   |
| CRITICAL | Organised crime, national security, personal safety implications       |

**Output:** Case object with status: SCOPED
**Notification:** CEO agent

**Gate:** Risk Level must be assigned. Evidence threshold must be set.

---

## STAGE 3 — CEO Review & Assignment

**Owner:** CEO Agent
**Input:** SCOPED Case object

**Actions:**
- Review case brief
- If Risk Level HIGH or CRITICAL → escalate to human approval before collection
- If approved → assign collection agents appropriate to case scope
- Always assign Preservation Agent
- Log assignment decisions
- Set case status: ACTIVE

**Output:** Case object with status: ACTIVE, assigned_agents populated
**Budget:** Set per-agent budget limits for this case

**Gate for HIGH/CRITICAL:** Human must approve before collection begins.

---

## STAGE 4 — Tool Selection

**Owner:** Assigned collection agents (advised by Tool Librarian)
**Input:** Case object, allowed source categories

**Actions:**
- Each collection agent queries Tool Librarian for approved tools matching their category
- Tool Librarian returns filtered registry results
- Agent selects tools and logs planned tool usage against the case
- Flags any tool with legal notes for CEO awareness

**Output:** Tool selection log appended to Case object
**Gate:** Only tools in the registry with status: APPROVED may be used.

---

## STAGE 5 — Collection (+ Parallel Preservation)

**Owner:** Assigned collection agents + Preservation Agent (in parallel)
**Input:** ACTIVE Case object with tool selection

**Actions (Collection agents):**
- Begin systematic collection using approved tools only
- For each item found → create Evidence object immediately
- Record: source_name, source_url, source_category, collected_by, collected_at
- Notify Preservation Agent for each new Evidence object
- Do not begin analysis — collection and preservation must complete first

**Actions (Preservation Agent, running in parallel):**
- For each new Evidence object → attempt archiving
- Store archive URL, timestamp, hash
- Update Evidence object with preserved_at and archive_location
- Flag any items that could not be preserved

**Collection rules:**
- Public sources only
- No login to private accounts
- No social engineering
- Document every tool used
- If a source disappears during collection → flag immediately and preserve what was captured

**Output:**
- Evidence objects with status: COLLECTED and (ideally) PRESERVED
- Preservation Agent log

**Gate:** Collection may not proceed to verification until Preservation Agent has
processed all evidence items. Unpreserved items must be explained.

**Scope creep rule:** If collection reveals the subject has a significantly larger
footprint than the case brief anticipated → pause and escalate to CEO for scope review
before continuing.

---

## STAGE 6 — Verification & Confidence Rating

**Owner:** Verification Agent
**Input:** All Evidence objects for the case

**Actions:**
- For each proposed finding, assess supporting evidence
- Create Claim objects for each finding
- Assign claim status: CONFIRMED / PARTIAL / INFERRED / UNRESOLVED / CONTRADICTED
- Assign confidence band: HIGH / MEDIUM / LOW / UNRESOLVED
- Identify evidence gaps → flag to CEO for potential additional collection round
- Separate confirmed facts from supported inferences in the claim log

**Claim status definitions:**
| Status        | Meaning                                                                      |
|---------------|------------------------------------------------------------------------------|
| CONFIRMED     | Directly supported by 2+ independent, preserved, verified sources            |
| PARTIAL       | Supported by evidence but not complete or fully corroborated                 |
| INFERRED      | Logical conclusion from confirmed facts, not directly evidenced              |
| UNRESOLVED    | Insufficient evidence to confirm or deny; question remains open              |
| CONTRADICTED  | Evidence contradicts the claim or points in opposing directions              |

**Confidence band definitions:**
| Band       | Meaning                                                                         |
|------------|---------------------------------------------------------------------------------|
| HIGH       | Confirmed by multiple independent preserved verified sources                    |
| MEDIUM     | Supported by one or two credible preserved sources with no contradicting evidence|
| LOW        | Single source, unverified, or significant uncertainty remains                   |
| UNRESOLVED | Cannot be assessed with current evidence                                        |

**Output:** Claim objects with all fields populated
**Case status update:** VERIFICATION_COMPLETE

**Gate:** No report may be drafted until Verification Agent has reviewed all evidence
and produced Claim objects.

---

## STAGE 7 — Report Drafting

**Owner:** Report Writer Agent
**Input:** Case, all Claim objects, all Evidence objects

**Actions:**
- Select appropriate report format
- Draft report following mandatory structure:
  1. Header: Case ID, date, requester, case type
  2. Executive summary: central question + one-paragraph answer
  3. Key findings: each with claim status, confidence band, evidence references
  4. Detailed findings (by section for dossiers)
  5. Unresolved questions section
  6. Evidence index
  7. Confidence summary statement
  8. Scope and limitations statement
  9. [Legal / ethics notes — populated by Legal Reviewer in next stage]
- Every claim in the report must reference its Claim ID
- Every Claim ID must link to at least one Evidence ID
- Mark INFERRED claims clearly as inferences, not facts

**Output:** Report object with status: DRAFT_COMPLETE
**Gate:** Report cannot include any claim that lacks a Claim ID. Report cannot omit
the scope/limitations section or the confidence summary.

---

## STAGE 8 — QA / Fact-Check

**Owner:** QA / Fact-Check Agent
**Input:** DRAFT_COMPLETE Report

**Actions:**
- Read every factual claim in the report
- Cross-reference each against linked Claim and Evidence objects
- Flag: UNSUPPORTED / OVERSTATED / MISLABELLED / MISSING_CITATION
- Produce QA log
- Set qa_status: PASSED / PASSED_WITH_FLAGS / FAILED

**If FAILED:** Return to Report Writer with QA log. Case status: QA_REVISION.
**If PASSED or PASSED_WITH_FLAGS:** Notify Legal / Ethics Reviewer.

**Gate:** No report with qa_status: FAILED may proceed to Legal review.

---

## STAGE 9 — Legal / Ethics Review

**Owner:** Legal / Ethics Reviewer Agent
**Input:** Report with qa_status: PASSED or PASSED_WITH_FLAGS

**Actions:**
- Check all claims about identifiable individuals for defamation risk
- Check for doxxing or privacy violation in any finding
- Check jurisdiction-specific risks for subject and client
- Check safety implications of publication
- Add legal notes section to report
- Set legal_status: CLEAR / CONDITIONAL / BLOCKED

**If BLOCKED:** Immediate escalation to CEO and human board with written rationale.
**If CONDITIONAL:** List specific conditions in report. CEO notifies human board.
**If CLEAR:** Notify CEO that report is ready for human approval.

**Gate:** No report may proceed to human approval with legal_status: BLOCKED.

---

## STAGE 10 — Human Approval → Delivery

**Owner:** Human reviewer (the human on the board)
**Input:** Report with qa_status: PASSED and legal_status: CLEAR or CONDITIONAL

**Actions:**
- Human reads report, QA log, and Legal notes
- Runs through approval checklist (see HEARTBEAT.md)
- Sets approval_status: APPROVED / REJECTED / REVISION_REQUIRED

**If APPROVED:**
- Report is released for delivery
- Case status: DELIVERED
- Delivered_at timestamp recorded
- Client notified

**If REJECTED or REVISION_REQUIRED:**
- Written reason logged
- Case returned to appropriate stage

**Hard rule:** This stage cannot be automated, bypassed, or delegated to an AI agent.
Human judgment is the final gate.

---

## Case Statuses (Full List)

| Status                | Description                                                 |
|-----------------------|-------------------------------------------------------------|
| INTAKE                | Request received, not yet scoped                            |
| PENDING_CLARIFICATION | Requester identity or purpose unclear — awaiting response   |
| SCOPED                | Case brief complete, awaiting CEO assignment                |
| ACTIVE                | Assigned and in collection                                  |
| PRESERVATION_PENDING  | Collection complete, preservation in progress               |
| VERIFICATION          | Evidence preserved, verification in progress                |
| VERIFICATION_COMPLETE | Verification done, awaiting report drafting                 |
| DRAFT_COMPLETE        | Report drafted, awaiting QA                                 |
| QA_REVISION           | QA failed, revision required                                |
| QA_PASSED             | QA complete, awaiting Legal review                          |
| LEGAL_REVIEW          | Legal review in progress                                    |
| LEGAL_BLOCKED         | Blocked by Legal — human review required                    |
| PENDING_APPROVAL      | Awaiting human sign-off                                     |
| APPROVED              | Human approved — ready for delivery                         |
| DELIVERED             | Delivered to client                                         |
| REJECTED              | Rejected by human reviewer                                  |
| PAUSED                | On hold — scope issue, budget, or external factor           |
| CLOSED                | Case complete and archived                                  |
