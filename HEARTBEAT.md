# HEARTBEAT.md — Signal Desk Agent Scheduling Guide

Each agent in Signal Desk operates on a defined heartbeat — the schedule on which it
wakes up, checks its task queue, acts, and reports. This file defines the recommended
heartbeat for each role and what each agent should do on each cycle.

---

## CEO / Chief of Investigations

**Heartbeat:** Every 4 hours (6x per day)

**On each cycle:**
1. Review all cases with status: ACTIVE or BLOCKED
2. Check for new cases in status: SCOPED (awaiting assignment)
3. Assign newly scoped cases to appropriate collection agents
4. Review cases where a collection phase has completed → assign Verification Agent
5. Review cases where verification is complete → assign Report Writer
6. Review reports in QA or Legal review → check for blockers
7. Escalate any case with Risk Level: HIGH or CRITICAL that has not yet had human review
8. Check budget usage across active agents — flag overspend
9. Log a brief status note for each active case (heartbeat journal)
10. Identify and surface any case that has been stalled >24 hours

**Budget role:** CEO owns the per-case and per-agent budget limits. Any agent task
estimated above the budget ceiling requires CEO approval before execution.

**Escalation triggers (immediate, outside heartbeat schedule):**
- Legal / Ethics Reviewer sets legal_status: BLOCKED
- Any agent reports a task it cannot complete lawfully
- Human approval queue has been waiting >12 hours with no response

---

## Intake & Scoping Agent

**Heartbeat:** On-demand (event-driven)

**Trigger:** New case request received

**On activation:**
1. Parse incoming request
2. Run through scoping checklist (see AGENTS.md)
3. Flag and reject any request that falls outside lawful scope
4. Produce Case object with status: SCOPED
5. Notify CEO for assignment approval
6. If requester identity or purpose is unclear → set status: PENDING_CLARIFICATION

**Secondary heartbeat:** Every 12 hours, check for any cases in PENDING_CLARIFICATION
status that have been waiting >24 hours → escalate to human board.

---

## Tool Librarian Agent

**Heartbeat:** Twice daily (06:00 and 18:00 UTC)

**On each cycle:**
1. Check the Bellingcat GitHub CSV release for a new version/commit hash
2. If updated: download new CSV assets by category, run normalisation and deduplication,
   update registry, log sync with version hash and timestamp
3. If unchanged: log "no changes" with timestamp
4. Flag any tools that are newly added and not yet APPROVED
5. Flag any tools where the official_url returns a 404 or error
6. Flag any tools whose legal_notes have changed
7. Publish a daily tool-sync summary to the CEO agent task queue

**On-demand queries (from other agents):**
- Respond immediately to tool-selection queries with filtered registry results
- Log every query so the CEO can see which tools are being used per case

**Sync version control:**
- Each sync stores: sync_id, timestamp, source_version, records_added,
  records_updated, records_deprecated, hash of full registry state

---

## Collection Agents (4a–4g)

**Heartbeat:** On-demand per case + optional scheduled monitor

**On activation (per case assignment):**
1. Read the Case object and Case Brief
2. Query the Tool Librarian for approved tools relevant to this case type and scope
3. Begin collection using approved tools only
4. For each piece of collected material → create an Evidence object immediately
5. Notify the Preservation Agent to archive each evidence item as it is collected
6. On completion of collection phase → update case status and notify CEO

**For ongoing monitoring cases (narrative monitoring, watchlist):**
- Scheduled heartbeat: every 6–24 hours depending on case priority
  - CRITICAL monitoring: every 6 hours
  - HIGH priority monitoring: every 12 hours
  - STANDARD monitoring: every 24 hours
- On each monitor cycle: check for new content matching case parameters,
  create Evidence objects for new findings, notify CEO of significant changes

**Budget control:**
- Each collection agent task should declare an estimated token/API cost before starting
- Tasks exceeding budget ceiling require CEO approval

---

## Archiving & Preservation Agent

**Heartbeat:** On-demand, triggered by collection agents + daily audit

**On activation (per evidence item):**
1. Receive Evidence object reference from collection agent
2. Attempt to archive source URL using approved archiving tools (Wayback Machine,
   archive.today, etc.)
3. Store local snapshot if archiving fails
4. Generate hash of preserved content
5. Update Evidence object with: preserved_at timestamp, archive_location, hash
6. Flag if preservation failed (source deleted, blocked, etc.)

**Daily audit heartbeat (02:00 UTC):**
1. Review all Evidence objects in active cases that lack a preserved_at timestamp
2. Attempt preservation on any unpreserved items
3. Report count of unpreserved items to CEO

**CIR principle:** Preservation should happen as early as possible. This agent should
be running in parallel with or immediately after each collection agent, not after analysis.

---

## Verification Agent

**Heartbeat:** On-demand, triggered when collection + preservation is marked complete

**On activation:**
1. Read all Evidence objects for the case
2. Review each proposed claim
3. Assign claim status and confidence band (see AGENTS.md)
4. Identify gaps and flag additional collection needs to CEO
5. Produce Claim objects with all fields populated
6. Update case status: VERIFICATION_COMPLETE
7. Notify CEO

**Quality check before completing:**
- Every claim in the report must have at least one linked Evidence ID
- No claim can have status: CONFIRMED if it has fewer than 2 independent sources
- All INFERRED claims must include a rationale note

---

## Report Writer Agent

**Heartbeat:** On-demand, triggered by CEO after Verification is complete

**On activation:**
1. Read Case, all verified Claim objects, all Evidence objects
2. Select appropriate report format for case type
3. Draft report following mandatory structure (see AGENTS.md)
4. Every claim in the report must reference its Claim ID and Evidence IDs
5. Include scope/limitations statement
6. Mark report status: DRAFT_COMPLETE
7. Notify QA Agent

---

## QA / Fact-Check Agent

**Heartbeat:** On-demand, triggered when report status = DRAFT_COMPLETE

**On activation:**
1. Read report draft and all linked Claim + Evidence objects
2. Check every factual statement for evidence linkage
3. Produce QA log with flags
4. Set qa_status
5. If PASSED or PASSED_WITH_FLAGS → notify Legal / Ethics Reviewer
6. If FAILED → return to Report Writer with QA log

**Target turnaround:** QA should complete within 1 heartbeat cycle (≤4 hours).

---

## Legal / Ethics Reviewer Agent

**Heartbeat:** On-demand, triggered when qa_status = PASSED or PASSED_WITH_FLAGS

**On activation:**
1. Read report, QA log, and case brief
2. Run through legal / ethics checklist (see AGENTS.md)
3. Assign legal_status: CLEAR / CONDITIONAL / BLOCKED
4. Write legal notes section for the report
5. If BLOCKED → escalate immediately to CEO and human board
6. If CLEAR or CONDITIONAL → notify CEO that report is ready for human approval

**Target turnaround:** Legal review should complete within 1 working day.
For CRITICAL risk cases, escalate immediately regardless of time.

---

## Human Board (Approval Gate)

**Not a Paperclip agent. This is a human workflow step.**

**Paperclip implementation:** Set up as an Approval task in Paperclip with:
- Reviewer: designated human (owner or appointed reviewer)
- SLA: 24 hours for standard cases, 4 hours for urgent/critical
- Escalation: if SLA exceeded, CEO agent pings reminder and logs the delay

**Approval checklist for human reviewer:**
- [ ] Central question is answered
- [ ] All key claims have confidence ratings
- [ ] All evidence is preserved and linked
- [ ] QA status is PASSED or PASSED_WITH_FLAGS
- [ ] Legal status is CLEAR or CONDITIONAL (conditions met)
- [ ] Report does not contain doxxing or privacy-violating content
- [ ] Requester identity and purpose are confirmed
- [ ] Output format matches what was requested
- [ ] Scope/limitations statement is present

Only when all boxes are ticked: set approval_status: APPROVED → release for delivery.
