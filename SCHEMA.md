# SCHEMA.md — Signal Desk Data Model
### Core Object Schemas

---

## Case

```json
{
  "case_id": "string — UUID, e.g. CASE-2024-0001",
  "title": "string — short descriptive title",
  "requester": "string — client name or internal user ID",
  "requester_verified": "boolean — identity confirmed",
  "case_type": "enum — DUE_DILIGENCE | SANCTIONS_MAPPING | NARRATIVE_MONITORING | JOURNALISM | PUBLIC_INTEREST | WATCHLIST",
  "priority": "enum — LOW | MEDIUM | HIGH | CRITICAL",
  "status": "enum — see CASE_WORKFLOW.md for full status list",
  "subject_entities": ["array of entity_ids"],
  "central_question": "string — the single question this case must answer",
  "geography": "string — country/region/global",
  "date_range": {
    "start": "ISO 8601 date or null",
    "end": "ISO 8601 date or null (null = open / ongoing)"
  },
  "risk_level": "enum — LOW | MEDIUM | HIGH | CRITICAL",
  "allowed_source_categories": ["array of category strings from Tool Registry"],
  "evidence_threshold": "integer — minimum number of independent confirmed sources required",
  "output_type": "enum — MEMO | DOSSIER | MONITORING_ALERT | NARRATIVE_REPORT | WATCHLIST_ALERT",
  "assigned_agents": ["array of agent IDs"],
  "budget_limit": "number — maximum spend for this case in £/$ (optional)",
  "budget_used": "number — running total",
  "notes": "string — case manager notes",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime",
  "closed_at": "ISO 8601 datetime or null"
}
```

---

## Entity

```json
{
  "entity_id": "string — UUID",
  "type": "enum — PERSON | COMPANY | DOMAIN | SOCIAL_ACCOUNT | LOCATION | VESSEL | VEHICLE | OTHER",
  "primary_name": "string",
  "aliases": ["array of strings — known alternative names, trading names, usernames"],
  "identifiers": {
    "company_number": "string or null",
    "registered_country": "string or null",
    "lei": "string or null — Legal Entity Identifier",
    "sanctions_id": "string or null",
    "domain": "string or null",
    "social_handles": ["array of strings"],
    "other": ["array of {type, value} objects"]
  },
  "entity_status": "enum — ACTIVE | DISSOLVED | SUSPECTED | CONFIRMED | ALIAS_OF",
  "linked_cases": ["array of case_ids"],
  "related_entities": ["array of {entity_id, relationship_type} objects"],
  "notes": "string",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

---

## Evidence

```json
{
  "evidence_id": "string — UUID",
  "case_id": "string — case_id reference",
  "source_name": "string — name of the source (e.g. Companies House, OpenCorporates)",
  "source_url": "string — original URL",
  "source_category": "enum — CORPORATE | FINANCIAL | GEOSPATIAL | SOCIAL_MEDIA | PEOPLE | WEB_DOMAIN | TRANSPORT | IMAGE_VIDEO | PUBLIC_RECORD | NEWS_MEDIA | SANCTIONS | OTHER",
  "collected_by": "string — agent ID or tool name",
  "collected_at": "ISO 8601 datetime",
  "preserved": "boolean",
  "preserved_at": "ISO 8601 datetime or null",
  "archive_location": "string — archive URL or local path",
  "hash": "string — SHA-256 of preserved content, or null",
  "media_type": "enum — WEB_PAGE | PDF | IMAGE | VIDEO | SPREADSHEET | TEXT | DATABASE_RECORD | OTHER",
  "extracted_text": "string — key extracted text or structured data",
  "summary": "string — brief human-readable summary of what this evidence shows",
  "tool_used": "string — tool_id from registry",
  "provenance_notes": "string — how was this found, any chain-of-custody notes",
  "risk_flags": ["array of strings — e.g. PERSONAL_DATA, DISPUTED_SOURCE, DELETED_SINCE, PAYWALL"],
  "linked_claims": ["array of claim_ids that reference this evidence"],
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

---

## Claim

```json
{
  "claim_id": "string — UUID",
  "case_id": "string — case_id reference",
  "statement": "string — clear, single-sentence factual or inferential claim",
  "claim_type": "enum — FACT | INFERENCE | ALLEGATION | HYPOTHESIS",
  "linked_evidence_ids": ["array of evidence_ids"],
  "status": "enum — CONFIRMED | PARTIAL | INFERRED | UNRESOLVED | CONTRADICTED",
  "confidence": "enum — HIGH | MEDIUM | LOW | UNRESOLVED",
  "confidence_rationale": "string — brief explanation of why this confidence level was assigned",
  "independent_source_count": "integer — number of distinct independent sources supporting this claim",
  "reviewer_notes": "string — verification agent notes",
  "legal_flag": "boolean — flagged by Legal Reviewer",
  "legal_notes": "string or null",
  "included_in_report": "boolean",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

---

## Report

```json
{
  "report_id": "string — UUID",
  "case_id": "string — case_id reference",
  "report_type": "enum — MEMO | DOSSIER | MONITORING_ALERT | NARRATIVE_REPORT | WATCHLIST_ALERT",
  "version": "integer — starts at 1, increments on each revision",
  "draft": "string — full report text (markdown or structured JSON)",
  "final": "string — approved final version",
  "linked_claim_ids": ["array of claim_ids included in this report"],
  "linked_evidence_ids": ["array of all evidence_ids referenced"],
  "qa_status": "enum — PENDING | PASSED | PASSED_WITH_FLAGS | FAILED",
  "qa_log": "string — QA Agent findings and flags",
  "qa_completed_at": "ISO 8601 datetime or null",
  "legal_status": "enum — PENDING | CLEAR | CONDITIONAL | BLOCKED",
  "legal_notes": "string — Legal Reviewer notes",
  "legal_reviewed_at": "ISO 8601 datetime or null",
  "approval_status": "enum — PENDING | APPROVED | REJECTED | REVISION_REQUIRED",
  "approval_notes": "string — Human reviewer notes",
  "approved_by": "string — human reviewer ID or null",
  "approved_at": "ISO 8601 datetime or null",
  "delivered_at": "ISO 8601 datetime or null",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

---

## Tool Registry Entry

```json
{
  "tool_id": "string — UUID or slug e.g. tools-opencorporates",
  "name": "string",
  "category": "enum — MAPS_SATELLITES | GEOLOCATION | IMAGE_VIDEO | SOCIAL_MEDIA | PEOPLE | WEBSITES | COMPANIES_FINANCE | CONFLICT | TRANSPORT | ENVIRONMENT_WILDLIFE | ARCHIVING | DATA_ANALYSIS",
  "description": "string",
  "official_url": "string",
  "source_of_truth": "string — e.g. Bellingcat CSV, internal addition",
  "access_type": "enum — FREE | FREEMIUM | PAID | SUBSCRIPTION | API_ONLY | MANUAL_ONLY",
  "pricing": "string — free description of pricing, or null",
  "login_required": "boolean",
  "api_available": "boolean",
  "evidence_type": "string — what kind of evidence this tool returns",
  "collection_method": "enum — WEB_INTERFACE | API | CSV_EXPORT | MANUAL | BROWSER_EXTENSION",
  "use_cases": ["array of strings"],
  "limitations": "string",
  "legal_notes": "string — jurisdiction restrictions, TOS notes, privacy considerations",
  "risk_level": "enum — LOW | MEDIUM | HIGH",
  "status": "enum — APPROVED | UNDER_REVIEW | RESTRICTED | DEPRECATED",
  "tags": ["array of strings"],
  "bellingcat_category": "string — original category from Bellingcat CSV",
  "bellingcat_original_name": "string — original name in CSV for deduplication",
  "sync_version": "string — version hash from last Bellingcat sync",
  "last_synced_at": "ISO 8601 datetime",
  "added_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

---

## Sync Log (Toolkit Ingestion)

```json
{
  "sync_id": "string — UUID",
  "source": "string — e.g. Bellingcat GitHub CSV Release",
  "source_version": "string — GitHub release tag or commit hash",
  "sync_triggered_by": "string — agent ID or manual",
  "records_checked": "integer",
  "records_added": "integer",
  "records_updated": "integer",
  "records_deprecated": "integer",
  "records_flagged": "integer",
  "registry_hash": "string — SHA-256 of full registry state after sync",
  "notes": "string — any anomalies or manual interventions",
  "synced_at": "ISO 8601 datetime"
}
```

---

## Case Event Log (Audit Trail)

```json
{
  "event_id": "string — UUID",
  "case_id": "string",
  "event_type": "enum — STATUS_CHANGE | AGENT_ASSIGNED | EVIDENCE_ADDED | CLAIM_CREATED | REPORT_DRAFTED | QA_COMPLETED | LEGAL_REVIEWED | APPROVED | DELIVERED | ESCALATED | BLOCKED | NOTE",
  "agent_id": "string — who triggered this event",
  "previous_value": "string or null",
  "new_value": "string or null",
  "notes": "string",
  "occurred_at": "ISO 8601 datetime"
}
```

Every state change in Signal Desk writes an Event Log entry. This is the audit trail.
