# TOOLKIT_INGESTION.md — Bellingcat CSV Toolkit Ingestion System

---

## Purpose

Signal Desk uses the Bellingcat Open Source Toolkit as its primary tool registry source.
This document describes the sync system that ingests, normalises, and maintains
the tool registry from the Bellingcat GitHub CSV release.

---

## Source

**Repository:** github.com/bellingcat/toolkit
**Release type:** GitHub Releases, marked pre-release, updated nightly
**Assets:** CSV files by category, plus a combined CSV
**URL pattern:** `https://github.com/bellingcat/toolkit/releases/latest`

The Tool Librarian Agent monitors this release endpoint for new versions and
triggers a sync whenever the version hash changes.

---

## Bellingcat CSV Categories → Signal Desk Registry Categories

| Bellingcat Category         | Signal Desk enum                  |
|-----------------------------|-----------------------------------|
| Maps & Satellites           | MAPS_SATELLITES                   |
| Geolocation                 | GEOLOCATION                       |
| Image/Video                 | IMAGE_VIDEO                       |
| Social Media                | SOCIAL_MEDIA                      |
| People                      | PEOPLE                            |
| Websites                    | WEBSITES                          |
| Companies & Finance         | COMPANIES_FINANCE                 |
| Conflict                    | CONFLICT                          |
| Transport                   | TRANSPORT                         |
| Environment & Wildlife      | ENVIRONMENT_WILDLIFE              |
| Archiving                   | ARCHIVING                         |
| Data Organisation & Analysis| DATA_ANALYSIS                     |

---

## Sync Process — Step by Step

### Step 1: Version Check

```
Tool Librarian Agent → GET https://api.github.com/repos/bellingcat/toolkit/releases/latest
Extract: tag_name, published_at, assets list
Compare tag_name to last stored sync_version in Sync Log
If unchanged → log "no change", exit
If changed → proceed to Step 2
```

### Step 2: Download CSV Assets

```
For each asset in release.assets where asset.name ends in .csv:
  Download to temp storage
  Compute SHA-256 of downloaded file
  Log: filename, category, download_url, file_hash, download_timestamp
```

### Step 3: Parse and Normalise Each Row

For each row in each CSV:

```
Input fields expected from Bellingcat CSV (actual field names may vary):
  - name (tool name)
  - description
  - url / link
  - category (from filename or column)
  - tags (comma-separated)
  - pricing / cost
  - notes / comments

Normalisation:
  - Map category to Signal Desk enum
  - Trim whitespace from all string fields
  - Normalise URL (ensure https, remove trailing slash)
  - Parse tags into array
  - Set access_type from pricing text:
      "free" → FREE
      "freemium" → FREEMIUM
      "paid" / "subscription" → PAID
      "api" → API_ONLY
      null / unknown → FREEMIUM (conservative default)
  - Set login_required: true if notes mention login, account, or sign-in
  - Set api_available: true if URL is an API endpoint or notes mention API
  - Set risk_level: LOW by default; set MEDIUM if category is PEOPLE or SOCIAL_MEDIA;
    set HIGH if notes mention legal restrictions or sensitive jurisdiction
  - Set status: UNDER_REVIEW for all new entries (Tool Librarian or human must APPROVE)
  - Preserve: bellingcat_category (original), bellingcat_original_name (original name)
```

### Step 4: Deduplication

```
For each normalised record:
  Check if a record with the same official_url already exists in registry
  If exists:
    Compare all fields
    If changed → update record, log fields changed, increment updated count
    If unchanged → skip, increment checked count
  If not exists:
    Insert new record with status: UNDER_REVIEW
    Increment added count
```

### Step 5: Deprecation Check

```
For each tool in registry where source_of_truth = "Bellingcat CSV":
  If tool's bellingcat_original_name NOT found in latest CSV download:
    Set status: DEPRECATED
    Log deprecation with reason: "Not found in latest Bellingcat CSV release"
    Notify CEO agent: "X tools deprecated in latest sync"
```

### Step 6: Post-Sync Audit

```
For any new UNDER_REVIEW tools:
  Tool Librarian generates a review summary for CEO:
    - Tool name, category, URL, description, access type, risk level
    - Recommended action: APPROVE / REVIEW_NEEDED / RESTRICT
  CEO (or human reviewer for HIGH-risk tools) sets status to APPROVED / RESTRICTED
```

### Step 7: Write Sync Log

```
Create SyncLog record:
  sync_id: UUID
  source: "Bellingcat GitHub CSV Release"
  source_version: release tag_name
  sync_triggered_by: "tool_librarian_agent"
  records_checked: N
  records_added: N
  records_updated: N
  records_deprecated: N
  records_flagged: N (those that need human review)
  registry_hash: SHA-256 of full registry state
  synced_at: ISO 8601 now
```

---

## Tool Query Interface (for other agents)

The Tool Librarian responds to structured queries from other agents:

### Query Types

**By category:**
```
query: { category: "COMPANIES_FINANCE", status: "APPROVED" }
returns: [ ...tool objects ]
```

**By use case keyword:**
```
query: { use_case_contains: "beneficial ownership" }
returns: [ ...tool objects ]
```

**By access type:**
```
query: { access_type: "FREE", login_required: false }
returns: [ ...tool objects ]
```

**By risk level:**
```
query: { risk_level: ["LOW", "MEDIUM"] }
returns: [ ...tool objects ]
```

**Combined (typical agent call):**
```
query: {
  category: "ARCHIVING",
  status: "APPROVED",
  access_type: ["FREE", "FREEMIUM"]
}
returns: [ ...tool objects ]
```

All queries are logged against the requesting case_id for audit purposes.

---

## Manually Added Tools

Tools can be added to the registry outside the Bellingcat sync:

```
source_of_truth: "Internal"
status: UNDER_REVIEW (until CEO approves)
sync_version: null
last_synced_at: null
```

Internal tools are not affected by Bellingcat sync deprecation checks.
They must be reviewed and deprecated manually.

---

## Priority Tool Categories for MVP (Corporate Due Diligence)

The following categories should be prioritised and fully populated for the MVP:

1. **COMPANIES_FINANCE** — core for beneficial ownership, sanctions, adverse media
2. **ARCHIVING** — essential for preservation discipline
3. **WEBSITES** — domain/infrastructure research
4. **PEOPLE** — key person research (with HIGH risk designation on relevant tools)
5. **DATA_ANALYSIS** — synthesis and cross-referencing

Suggested first-pass approved tools (well-known, low legal risk):
- OpenCorporates — company search globally
- Companies House (UK) — UK company register
- OCCRP Aleph — investigative data platform
- OpenSanctions — sanctions and PEP data
- Wayback Machine — archiving
- archive.today — archiving
- WHOIS / DomainTools — domain research
- Shodan — web infrastructure (with legal note)
- Google Cache — web archiving
- Arachni / URLscan.io — web scanning
