# SIGNAL DESK — CONTENT PUBLISHING ENGINE
## Full Specification: Cases as Public Content

---

## THE CORE CONCEPT

Signal Desk publishes investigations the way Bellingcat publishes methodology —
not as raw data dumps, but as structured, evidence-led stories with a clear
narrative arc. Every published case serves two purposes simultaneously:

1. **Proof of work** — demonstrates what Signal Desk can do
2. **Content marketing** — builds audience across platforms

The published case IS the product demo. A compliance director watching a
10-minute deep dive on how we traced a shell company chain is watching
a sales pitch that doesn't feel like one.

---

## CONTENT TIERS

### TIER 1 — The Reel (60 seconds)
Platform: TikTok, Instagram Reels, YouTube Shorts, LinkedIn Video
Goal: Reach. Hook. Drive to longer content.
Format: One finding. One reveal. One question answered.
Production: ElevenLabs VO + Runway/Kling visuals + animated document overlay

### TIER 2 — The Walkthrough (3–8 minutes)
Platform: YouTube, LinkedIn, website case page
Goal: Credibility. Show methodology. OSINT community respect.
Format: Animated document with voiceover — the actual evidence on screen
Production: Document-to-video animation + ElevenLabs VO + HeyGen presenter

### TIER 3 — The Deep Dive (10–20 minutes)
Platform: YouTube primary, website embed
Goal: Authority. Full investigation narrative. SEO. Journalist trust.
Format: Documentary structure — setup, investigation, findings, confidence ratings
Production: Full AI production pipeline (all tools combined)

### TIER 4 — The Published Report (static)
Platform: Signal Desk website case page
Goal: Permanent evidence record. Searchable. Linkable. Citable.
Format: HTML case page + downloadable PDF with redactions where needed

---

## THE CASE PAGE SYSTEM

Every published investigation gets a dedicated case page on the Signal Desk website.

### URL structure:
signaldesk.co.uk/cases/[case-slug]
e.g. signaldesk.co.uk/cases/operation-bigaud

### Case page sections:
1. **Case header** — case ID, date, type, subject (if named), central question
2. **Executive summary** — 2 paragraphs, plain English
3. **Embedded video** — the deep dive or walkthrough sits here
4. **Key findings** — each with confidence rating and evidence badge
5. **Evidence timeline** — visual scrollable timeline of collected evidence
6. **Document viewer** — embedded redacted report PDF
7. **Methodology notes** — which tools were used, why
8. **Related cases** — cross-links to similar investigations
9. **Short form clips** — the reels embedded below the main video
10. **Contact CTA** — "Need this kind of research? Submit a brief."

### Redaction policy for public cases:
- Client identity: ALWAYS redacted
- Subject identity: named if they are a public figure AND story is already published
- Specific evidence archive URLs: included (that's the point)
- Internal case IDs and agent logs: stripped before publication

---

## THE AI PRODUCTION PIPELINE

### Tool Stack by Output Type

```
SHORT FORM REEL (60s)
─────────────────────
Script          → Claude (30-50 words VO + visual directions)
Voiceover       → ElevenLabs (measured, authoritative male or female voice)
Document visuals→ Animated in CapCut / Adobe Express or Runway
Footage/visuals → Runway Gen-3 or Kling (satellite views, city aerials,
                  abstract corporate imagery — no faces generated)
Titles/captions → Auto-captions + Signal Desk brand overlay
Export          → 9:16 vertical for TikTok/Reels, 16:9 crop for LinkedIn

ANIMATED WALKTHROUGH (3-8 min)
───────────────────────────────
Script          → Claude (full narration script with visual cues)
Voiceover       → ElevenLabs (same consistent voice across all content)
Document slides → Keynote or Google Slides exported as video
                  Animate: evidence cards sliding in, redaction bars
                  appearing and lifting, confidence badges populating,
                  connection lines drawing between entities
Presenter       → HeyGen avatar (optional — use for intro/outro only)
B-roll          → Runway aerial shots, abstract corporate imagery
                  Stock: Pexels/Pixabay for news-adjacent footage
Assembly        → CapCut Pro or DaVinci Resolve
Export          → 16:9 1080p for YouTube/website, 1:1 crop for LinkedIn

DEEP DIVE DOCUMENTARY (10-20 min)
──────────────────────────────────
Script          → Claude (full documentary script, chapter structure)
Voiceover       → ElevenLabs (consistent voice, slightly slower pace)
Presenter intro → HeyGen avatar — 60-90 second intro to camera
Document scenes → Animated evidence walkthrough sections (as above)
Map/satellite   → Runway-generated or actual Google Maps/satellite
                  screenshots (public, lawful)
Timeline visual → Custom animated timeline (HTML/CSS or After Effects)
Case photos     → Only public domain or published press images
                  (never AI-generated faces of real subjects)
Chapter cards   → Branded full-screen chapter separators
Assembly        → DaVinci Resolve
Export          → 16:9 1080p YouTube, chapter markers, full description
```

---

## THE REEL FORMULA

Every 60-second reel follows this exact structure:

```
0:00–0:05  THE HOOK
           One sentence that makes them stop scrolling.
           e.g. "A sitting prime minister bought a $22 million
           chateau and hid it from his own government.
           Here's the paper trail."

0:05–0:15  THE SETUP
           Who. What. When. Why it matters.
           One or two sentences. Document visual behind VO.

0:15–0:40  THE EVIDENCE
           The three key findings, rapid-fire.
           Each one: evidence card animates in, confidence
           badge appears, source name flashes up.
           This is the "how did they find that?" moment.

0:40–0:52  THE REVEAL / PUNCHLINE
           The most significant confirmed finding.
           Delivered clean over a single visual.

0:52–1:00  THE SIGNAL DESK FRAME
           "Full investigation at signaldesk.co.uk"
           Logo. Tagline: "Evidence-backed. Human-reviewed."
```

---

## THE DEEP DIVE DOCUMENTARY STRUCTURE

Every long-form documentary follows this chapter structure:

```
CHAPTER 1: THE QUESTION (1-2 min)
What are we investigating? Why does it matter?
What is the one question we're trying to answer?
Hook the viewer with the stakes.

CHAPTER 2: THE SUBJECT (2-3 min)
Who or what is under investigation?
Public record background. Entity map introduction.
Visual: animated entity relationship diagram building on screen.

CHAPTER 3: THE METHODOLOGY (1-2 min)
How did Signal Desk approach this?
Which tools were used? What sources were queried?
Visual: tool cards appearing from the registry.
This builds credibility with the OSINT audience.

CHAPTER 4: THE COLLECTION (3-4 min)
Walk through the evidence collection, piece by piece.
Each evidence item: source named, tool used, archived.
Visual: evidence cards populating a timeline.
Redacted items shown with redaction bars.

CHAPTER 5: THE VERIFICATION (2-3 min)
What does the evidence actually support?
Confirmed findings vs inferences vs unresolved questions.
Confidence ratings explained and applied.
Visual: claims table building with colour-coded confidence bands.

CHAPTER 6: THE FINDINGS (2-3 min)
The answer to the central question.
Plain English. Confidence-rated.
What is confirmed. What is partial. What remains unknown.

CHAPTER 7: THE GAPS (1 min)
What we couldn't find. What would change the picture.
This is the credibility section — only weak investigations
pretend to have found everything.

CHAPTER 8: THE SIGNAL DESK FRAME (30 sec)
Full report available at signaldesk.co.uk/cases/[slug]
Submit a brief: brief@signaldesk.co.uk
```

---

## FIRST SIX EPISODES — PRODUCTION ROADMAP

These are the first six investigations to produce as public content.
Mix of famous documented cases (for reach) and methodology showcases.

---

### EP 001 — OPERATION BIGAUD
**Subject:** Andrej Babiš / Chateau Bigaud / Pandora Papers
**Why first:** Already fully researched in our pipeline simulation.
All source material ready. High public recognition.
**Formats:** Reel + Deep Dive + Case Page
**Reel hook:** "A prime minister bought a $22M chateau and forgot to tell anyone."
**Documentary title:** "The Chateau, The Shell Companies, and the Paper Trail"
**Key visual:** BVI → DC → Monaco corporate chain animating as a map

---

### EP 002 — THE STORK'S NEST
**Subject:** Babiš EU subsidy fraud case (separate from Bigaud)
**Why:** Companion piece to EP001. Same subject, different fraud type.
Demonstrates how OSINT builds picture over time.
**Formats:** Walkthrough (8 min) + Reel + Case Page
**Reel hook:** "He applied for a €2M subsidy for small businesses.
The 'small business' was his."

---

### EP 003 — FOLLOW THE MONEY: BVI BASICS
**Subject:** Educational — how British Virgin Islands shell companies work
**Why:** Evergreen OSINT education. Massive search volume.
Positions Signal Desk as the explainer for this topic.
**Formats:** Deep Dive (12 min) + animated walkthrough
**Documentary title:** "Why Every Major Scandal Has a BVI Company"
**This is a methodology episode, not a case episode**

---

### EP 004 — THE KING'S PROPERTIES
**Subject:** King Abdullah II of Jordan / Pandora Papers / Malibu mansions
**Why:** High name recognition, fully documented by ICIJ,
strong visual story (satellite imagery of properties).
**Formats:** Reel + Deep Dive + Case Page
**Reel hook:** "Three beachfront mansions in Malibu. Bought through
offshore companies. By a king whose people were protesting poverty."

---

### EP 005 — HOW TO READ A PSC REGISTER
**Subject:** Educational — UK beneficial ownership records
**Why:** Directly relevant to our MVP commercial niche.
Compliance and legal audiences will share this.
**Formats:** Animated walkthrough (5 min) + Case Page
**This is a tool tutorial episode**

---

### EP 006 — SANCTIONED
**Subject:** How Russian oligarch asset concealment works post-2022
**Why:** Huge topical relevance. Complex ownership chains = perfect
showcase for Signal Desk methodology.
**Formats:** Deep Dive (15 min) + Reel + Case Page
**Source material:** Published RUSI, Transparency International,
OCCRP reporting — fully public record

---

## SCRIPT TEMPLATE — 60-SECOND REEL
### Operation Bigaud

```
VISUAL: Black screen. Single white text fades in.

VO: "In 2009, a man bought a $22 million chateau on the French Riviera."

VISUAL: Aerial shot of Mougins, France. Runway-generated or stock.

VO: "He hid it inside three shell companies — British Virgin Islands,
     Washington D.C., Monaco."

VISUAL: Animated corporate chain. Three boxes connecting with red lines.
        Labels: BLAKEY FINANCE LTD (BVI) → [DC ENTITY] → SCP BIGAUD (MONACO)

VO: "Four years later, he became Prime Minister of the Czech Republic."

VISUAL: News headline cards animating in. "Andrej Babiš — PM"

VO: "The chateau never appeared in a single asset declaration."

VISUAL: Asset declaration document. Red stamp: ABSENT.
        Confidence badge: HIGH CONFIDENCE — EVD-005

VO: "France opened a money laundering investigation in 2022.
     It's still running."

VISUAL: French court building aerial. Text overlay: OCLCIFF INVESTIGATION — ONGOING

VO: "Every finding in this story came from public records."

VISUAL: Signal Desk logo. Evidence index scrolling behind it.

VO: "Full investigation: signaldesk.co.uk"

VISUAL: End card. "Evidence-backed. Human-reviewed. Signal Desk."
```

---

## SCRIPT TEMPLATE — ANIMATED WALKTHROUGH
### Operation Bigaud (8-minute version)

```
[INTRO — 0:00]
VO: "This is a Signal Desk investigation walkthrough.
     We're going to show you exactly how we traced the corporate
     structure behind one of the Pandora Papers' most documented cases —
     step by step, source by source, with every piece of evidence
     preserved and confidence-rated."

[CASE BRIEF CARD ANIMATES IN — 0:20]
VISUAL: Case brief document slides onto screen.
        Fields populate one by one: Case ID, Subject, Central Question,
        Geography, Risk Level, Evidence Threshold.

VO: "Case CASE-2025-0021. Operation Bigaud.
     Central question: what is the complete corporate ownership chain
     used to secretly acquire Chateau Bigaud — and does it exhibit
     hallmarks consistent with concealment of beneficial ownership?"

[TOOL SELECTION — 1:00]
VISUAL: Tool registry cards appear. Each one: name, category, access type.
        OCCRP Aleph. OpenCorporates. ICIJ Offshore Leaks. Companies House.
        OpenSanctions. Wayback Machine. archive.today.

VO: "Before any collection begins, the Tool Librarian agent selects
     approved tools from our registry. All public. All lawful.
     All logged against the case."

[EVIDENCE COLLECTION — 2:00]
VISUAL: Evidence cards build a timeline, left to right.
        Each card: EVD-001, source name, tool used, archive badge.

VO: "Collection runs in parallel with preservation.
     As each piece of evidence is found, it's immediately archived.
     [EVD-001 highlights]
     ICIJ Pandora Papers report — archived to archive.today.
     Timestamp logged. Hash generated."

[Each evidence item gets 20-30 seconds of animated walkthrough]

[CORPORATE CHAIN — 4:30]
VISUAL: Animated map builds. BVI → DC → Monaco → Chateau.
        Red lines connecting. Company names labelling each node.
        $22M figure appears at the BVI end.

VO: "The structure: Blakey Finance Ltd in the British Virgin Islands
     receives $22 million. Funds move through a Washington D.C. entity
     — name still unconfirmed in public registries —
     to Monaco SCI SCP Bigaud. Structured as a back-to-back loan
     from Babiš to himself."

[CONFIDENCE RATINGS TABLE — 6:00]
VISUAL: Claims table builds. Each row: claim, status, confidence, sources.
        Colour coding: green for CONFIRMED, amber for PARTIAL, red for UNRESOLVED.

VO: "Verification. Every claim assessed against the evidence.
     The core ownership chain: HIGH confidence. Three independent sources.
     The source of the original $22 million: UNRESOLVED.
     That's what the French investigation is trying to establish."

[OUTRO — 7:30]
VO: "Full report, evidence index, and archive links at
     signaldesk.co.uk/cases/operation-bigaud.
     If you need this kind of research for your own case,
     the brief is open."
```

---

## THE WEBSITE CASE PAGE SPEC

Every published case gets a page built to this spec:

### signaldesk.co.uk/cases/[slug]

```
HERO SECTION
────────────
Case ID badge          e.g. CASE-2025-0021
Classification badge   e.g. PUBLIC INTEREST · JOURNALIST SUPPORT
Headline               "The $22M Chateau: How a Prime Minister
                        Hid His Property in Three Shell Companies"
Subhead                Central question, one sentence
Key stats row          Evidence items · Confirmed findings · Confidence level
Date published         31 March 2026

VIDEO SECTION
─────────────
Primary embed          Deep dive documentary (YouTube embed)
Secondary row          Short-form reels (3 clips, horizontal scroll)

FINDINGS SECTION
────────────────
For each confirmed claim:
  - Claim statement
  - Confidence badge (HIGH / MEDIUM / LOW)
  - Status badge (CONFIRMED / PARTIAL / UNRESOLVED)
  - Evidence count (e.g. "3 independent sources")
  - Expand button → shows linked evidence items

EVIDENCE TIMELINE
─────────────────
Horizontal scrollable timeline
Each node: EVD-ID, date collected, source name, archive badge
Click → opens evidence card with full provenance

DOCUMENT VIEWER
───────────────
Embedded PDF of redacted report
Download button
Redaction policy note

METHODOLOGY PANEL
─────────────────
Tools used (from registry, with links)
Collection method
Preservation method
Review stages completed

RELATED CASES
─────────────
3 related case cards

CONTACT CTA
───────────
"Signal Desk research your organisation."
Brief submission link
```

---

## PUBLISHING CADENCE

```
WEEK 1:    EP001 Reel + Case Page launch
WEEK 2:    EP001 Deep Dive publishes (YouTube + embed on case page)
WEEK 3:    EP002 Reel
WEEK 4:    EP003 Educational walkthrough (BVI basics)
WEEK 5:    EP002 Deep Dive
WEEK 6:    EP004 Reel
WEEK 7:    EP005 Tutorial walkthrough
WEEK 8:    EP004 Deep Dive + EP006 Reel teaser
```

One reel per week minimum.
One long-form piece every two weeks.
Every piece of content links back to the case page.
Every case page has the submit-a-brief CTA.

---

## PLATFORM DISTRIBUTION MATRIX

| Content | YouTube | TikTok | Instagram | LinkedIn | Website |
|---------|---------|--------|-----------|----------|---------|
| Deep Dive | PRIMARY | — | — | share link | embed |
| Walkthrough | upload | — | — | native upload | embed |
| Reel | Shorts | PRIMARY | Reels | native | embed |
| Case page | — | link in bio | link in bio | article link | PRIMARY |
| Report PDF | — | — | — | document post | PRIMARY |

---

## VOICE AND VISUAL IDENTITY FOR VIDEO

**Voice (ElevenLabs):**
Character: authoritative, measured, slightly grave. Not dramatic.
Think: documentary narrator, not true crime podcast.
Pace: slower than social media average. Lets evidence breathe.
Consistent voice across ALL content — this becomes the Signal Desk audio brand.
Suggested ElevenLabs voice type: "News presenter" or "Documentary"

**Visual identity in video:**
- Colour: black, off-white paper, red accents — same as website
- Typography: Playfair Display for headlines, IBM Plex Mono for data/labels
- Document aesthetic: evidence cards look like actual documents
- Redaction bars: used deliberately as visual motif (lift to reveal)
- No AI-generated faces of real people — ever
- Satellite/aerial imagery: Runway-generated abstract, or actual public satellite
- Corporate chain diagrams: clean, minimal, animated line-by-line

**HeyGen presenter (optional, intro/outro only):**
Use for: channel intros, series launches, direct-to-camera explainers
Do NOT use for: actual case narration (keep that voice-only)
Presenter appearance: professional, neutral, no uniform or costume
This is the "face" of Signal Desk when one is needed

---

## LEGAL NOTES FOR PUBLISHED CONTENT

Before any case content publishes:

1. Subject must be a public figure OR story must already be fully published
   in credible media (ICIJ, BBC, Guardian, Le Monde, etc.)

2. All claims in video and on case page must match the verified claims
   in the internal case report — no inflation for drama

3. Confidence ratings must appear on screen for all major claims

4. "Subject denies wrongdoing" or equivalent must be stated where on record

5. No AI-generated imagery of real people's faces or likenesses

6. Source citations must appear in video description and on case page

7. Human review of script AND final video before publication

8. Legal note in video description:
   "This investigation is based entirely on published public-record sources.
   Signal Desk has not accessed any private or restricted information.
   All findings reflect the published record as of [date]."
