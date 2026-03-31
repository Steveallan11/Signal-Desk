# SIGNAL DESK — SHORT FORM VIDEO BIBLE
## Style Guide + 3 Production-Ready Scripts

---

## THE LOOK AND FEEL

**Reference: Dirty Money (Netflix) title sequence meets Bellingcat methodology thread**

Not true crime. Not news anchors. Not talking heads.
Pure kinetic typography. Documents. Data. Evidence.
The video IS the paper trail.

### Visual Language

**Background:** Pure black (#0a0a0a) for 80% of the video.
Flash to off-white paper (#f5f0e8) only for document inserts.
Never grey. Never gradient. Black or paper, nothing between.

**Typography — three roles only:**
- HEADLINE SERIF: Playfair Display Black — for the big reveal moments
  Size: 52–72px. Centred. Full frame. Staggered letter reveal.
- DATA MONO: IBM Plex Mono — for evidence IDs, source names, timestamps
  Size: 14–18px. Left-aligned. Typewriter effect.
- BODY SERIF: IBM Plex Serif Light — for the VO supporting text
  Size: 22–28px. Upper third or lower third. Never mid-frame.

**The only colours:**
- #0a0a0a — black (background, 80% of runtime)
- #f5f0e8 — paper (document inserts, 20% of runtime)
- #c41a1a — red (ONLY for: evidence badges, confidence ratings,
  the Signal Desk dot, key numbers, redaction bars)
- #ffffff — pure white (VO text on black)
- #86efac — green (ARCHIVED ✓ badges only)

**No other colours. Ever.**

### Motion Language

**The Five Moves — use only these:**

1. **THE STAMP** — text slams into frame from 120% scale, settles in 8 frames.
   Use for: opening hook, key findings, case numbers.

2. **THE REDACT** — a solid red bar covers text, then drags right to reveal.
   Use for: revealing a company name, a jurisdiction, a key fact.
   The lift takes exactly 12 frames.

3. **THE TYPEWRITER** — characters appear left to right at 2 per frame.
   Use for: evidence IDs, source names, URLs, timestamps.
   Always IBM Plex Mono.

4. **THE CUT** — hard cut to black between scenes. No transitions.
   Hold black for exactly 4 frames before next card.
   Never dissolve. Never wipe.

5. **THE WIRE** — thin red line draws itself across the screen, connecting two points.
   Use for: corporate chain connections, entity links.
   Draws over 18 frames at constant speed.

**Camera:** Static frame only. Zero movement.
The text moves. The frame does not. Ever.

### Sound Design

**Music:** Single sustained low drone (C2, sawtooth, 40% reverb).
No beat. No melody. Sits under everything.
Fades out completely on the final frame.

**SFX — the only sounds:**
- Stamp impact: deep thud (80ms) on every STAMP animation
- Typewriter tick: mechanical click at 24Hz during TYPEWRITER sequences
- Redact reveal: paper drag sound (cassette scrub sample, 400ms)
- Wire draw: soft electrical hum (18 frames, fades with the line)
- Hard cut: brief silence (4 frames) — the absence of sound IS the effect

**Voiceover (ElevenLabs settings):**
- Voice: "Daniel" (deep, measured, British-adjacent)
  or "George" (authoritative, neutral)
- Stability: 0.85 | Similarity: 0.75 | Style: 0.2
- Speaking rate: 0.88 (slightly slower than default)
- No music under VO. VO speaks in silence.
  Drone resumes on the 4-frame black cut after VO lines.

### The Confidence Badge System

Every finding gets a badge. Always bottom-right of the evidence card.
Badge appears via STAMP move, 4 frames after the finding text.

```
██████████████
█ HIGH        █  — #052e16 bg / #86efac text
██████████████

██████████████
█ MEDIUM      █  — #451a03 bg / #fcd34d text
██████████████

██████████████
█ PARTIAL     █  — #1e1b4b bg / #a5b4fc text
██████████████

██████████████
█ UNRESOLVED  █  — #1c1917 bg / #78716c text
██████████████
```

### Safe Zones for 9:16

```
┌────────────────────┐
│  ← 60px            │  ← TOP SAFE ZONE (platform UI)
│  ┌──────────────┐  │
│  │              │  │
│  │  CONTENT     │  │
│  │  AREA        │  │
│  │              │  │
│  │              │  │
│  │              │  │
│  └──────────────┘  │
│  ← 120px           │  ← BOTTOM SAFE ZONE (captions/buttons)
└────────────────────┘
  ← 40px side margins
```

Headlines: vertically centred in content area
Evidence cards: upper 40% of content area
VO text: lower 30% of content area
Badges: bottom-right of evidence cards, never below 120px from bottom
Signal Desk logo: top-left, always in safe zone

---

## SCRIPT 001 — "THE $22 MILLION CHATEAU"
### Operation Bigaud — 58 seconds

**For:** TikTok / Reels / YouTube Shorts
**Target audience:** General — high shareability
**Hook strategy:** Injustice + wealth contrast + paper trail
**ElevenLabs character count:** ~310 words

---

```
╔══════════════════════════════════════════════════════════════════╗
║  SIGNAL DESK · SHORT FORM SCRIPT                                ║
║  EP001-REEL-A · "THE $22 MILLION CHATEAU"                       ║
║  Duration: 0:58 · Format: 9:16 vertical · 24fps                 ║
║  ElevenLabs voice: Daniel · Rate: 0.88                          ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 001 · 0:00–0:03 · BLACK SCREEN · NO AUDIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Pure black. 72 frames silence.
  Then — STAMP MOVE — single white word slams to centre:
  Font: Playfair Display Black, 68px
  ┌─────────────────────────────┐
  │                             │
  │         CZECH               │
  │        REPUBLIC             │
  │          2013               │
  │                             │
  └─────────────────────────────┘
  Hold 18 frames. Hard cut to black. 4 frame silence.

AUDIO: None. Pure silence.
PRODUCTION NOTE: The silence is the hook. Don't add anything.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 002 · 0:03–0:07 · THE CONTEXT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. TYPEWRITER effect — top third of frame, IBM Plex Mono 16px, red:
  > ANDREJ BABIŠ ENTERS POLITICS
  Completes over 24 frames.
  Then STAMP move — white Playfair Display 42px, centre:
  ┌─────────────────────────────┐
  │  "I'll fight corruption.    │
  │   I'll make politicians     │
  │   declare their assets."    │
  └─────────────────────────────┘
  Hold 36 frames.

VO: [Measured. Flat. No emotion.]
  "In 2013, Andrej Babiš entered Czech politics.
   He campaigned on transparency."

AUDIO: Typewriter tick during TYPEWRITER. Stamp thud on quote.
PRODUCTION NOTE: VO speaks into silence. No drone yet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 003 · 0:07–0:12 · THE PIVOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut to black. 4 frames silence.
  Drone begins — low, sustained.
  REDACT MOVE: full-width red bar slides in from left.
  Holds for 12 frames covering the empty frame.
  Then drags right, revealing white Playfair Display Black 58px:
  ┌─────────────────────────────┐
  │                             │
  │      He forgot to           │
  │      mention one            │
  │         thing.              │
  │                             │
  └─────────────────────────────┘
  Stamp thud on reveal. Hold 36 frames.

VO: "He forgot to mention one thing."
AUDIO: Redact drag sound. Then stamp thud. Drone underneath.
PRODUCTION NOTE: Pause in VO matches the redact reveal exactly.
  Script the ElevenLabs pause by writing [pause 0.8s] in the prompt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 004 · 0:12–0:20 · THE EVIDENCE CARD #1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash cut to PAPER (#f5f0e8) background — the document insert.
  Evidence card slides up from bottom:
  ┌─────────────────────────────────┐
  │ EVD-001 · ICIJ PANDORA PAPERS   │  ← IBM Plex Mono 11px, red
  │─────────────────────────────────│
  │ In 2009, Babiš moved $22M       │  ← IBM Plex Serif 18px, ink
  │ through a British Virgin        │
  │ Islands shell company.          │
  │                                 │
  │ Company: BLAKEY FINANCE LTD     │  ← Mono, typewriter reveal
  │ Jurisdiction: BVI               │
  │                           ░░░░  │  ← ARCHIVED badge, green
  │                        HIGH ░░  │  ← confidence badge, green
  └─────────────────────────────────┘
  Evidence card holds 60 frames.

VO: "In 2009 — four years before entering politics —
   he moved twenty-two million dollars
   through a shell company in the British Virgin Islands."

AUDIO: Card slide sound (subtle paper). Typewriter ticks on company/jurisdiction.
Confidence badge STAMP thud.
PRODUCTION NOTE: Drone drops 20% volume under VO on paper background.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 005 · 0:20–0:28 · THE CHAIN REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut to BLACK.
  Three entity boxes appear via STAMP, timed to VO beats:
  [beat 1] Box 1 STAMPS in — top of frame
  ┌──────────────────┐
  │  🇧🇻  BVI         │
  │  BLAKEY FINANCE  │
  └──────────────────┘
  [beat 2] WIRE draws down from Box 1 — red line, 18 frames
           "$22M" appears beside wire in red Playfair 28px
  [beat 3] Box 2 STAMPS in — middle of frame
  ┌──────────────────┐
  │  🇺🇸  WASHINGTON  │
  │  D.C. ENTITY     │
  │  [UNCONFIRMED]   │  ← faded text
  └──────────────────┘
  [beat 4] WIRE draws down again
           "LOAN" text in red
  [beat 5] Box 3 STAMPS in — bottom of frame, red border
  ┌──────────────────┐  ← red border
  │  🇲🇨  MONACO      │
  │  SCP BIGAUD      │
  └──────────────────┘
  Then below SCP Bigaud — WIRE draws right to a photo-style rectangle:
  Runway-generated aerial: French chateau, Mougins.
  Label: CHATEAU BIGAUD · MOUGINS, FRANCE

VO: "It went through Washington D.C.
   Then Monaco.
   Then — a chateau."

AUDIO: Three STAMP thuds timed to VO beats.
Two WIRE sounds between boxes. Final STAMP on chateau reveal.
PRODUCTION NOTE: Each VO word "Washington D.C." / "Monaco" / "a chateau"
  lands exactly with its STAMP thud. Time in ElevenLabs first,
  then animate to the audio file.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 006 · 0:28–0:35 · THE PROPERTY CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash to PAPER background.
  Property details TYPEWRITER onto screen, Mono:
  ┌───────────────────────────────┐
  │ CHATEAU BIGAUD · MOUGINS, FR  │
  │ 9.4 ACRES                     │
  │ 5 BEDROOMS · 14 BATHROOMS     │
  │ CINEMA · 2 POOLS · WINE CELLAR│
  │ TENNIS COURT                  │
  │                               │
  │ PURCHASE PRICE: $22,000,000   │  ← red, Playfair 28px, STAMP
  │ DECLARED TO CZECH GOVT: NO    │  ← red
  └───────────────────────────────┘

VO: "Five bedrooms. Fourteen bathrooms.
   A cinema. Two pools.
   Twenty-two million dollars.
   Not declared to his government."

AUDIO: Typewriter on all spec lines. STAMP on purchase price.
Hard thud on "NOT DECLARED."
PRODUCTION NOTE: "NOT DECLARED" gets the heaviest stamp thud in the video.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 007 · 0:35–0:42 · THE INVESTIGATION CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut to BLACK.
  REDACT bar slides in from left. Drags right to reveal:
  ┌─────────────────────────────┐
  │  FRANCE OPENS               │
  │  MONEY LAUNDERING           │
  │  INVESTIGATION              │
  │  FEBRUARY 2022              │
  └─────────────────────────────┘
  Playfair Display Black, 48px white.
  STAMP on each line, 8 frames apart.
  Then TYPEWRITER bottom-third, red Mono:
  > OCLCIFF · STATUS: ONGOING

VO: "France opened a money laundering investigation.
   It's still running."

AUDIO: Four sequential stamp thuds on each reveal line.
Typewriter on OCLCIFF line.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 008 · 0:42–0:50 · THE SOURCE FRAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash PAPER background.
  Clean document card:
  ┌────────────────────────────────┐
  │ EVERY FINDING IN THIS VIDEO    │  ← Playfair Bold 22px
  │ CAME FROM A PUBLIC RECORD.     │
  │                                │
  │ ICIJ Pandora Papers ✓          │  ← Mono 14px, typewriter
  │ ICIJ Offshore Leaks DB ✓       │
  │ Czech Official Declarations ✓  │
  │ Le Monde / ICIJ Investigation ✓│
  │ French OCLCIFF Public Report ✓ │
  │                                │
  │ 8/8 EVIDENCE ITEMS PRESERVED   │  ← red Mono, STAMP
  └────────────────────────────────┘

VO: "Every finding. Public record.
   Zero private sources.
   All preserved."

AUDIO: Typewriter on each source line. Final STAMP on "8/8 PRESERVED."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 009 · 0:50–0:58 · END CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut to BLACK.
  Drone fades to silence over 48 frames.
  Signal Desk logo appears — STAMP, centre frame.
  Red dot blinks once.
  Below logo — TYPEWRITER, white Mono 16px:
  > SIGNAL DESK
  > EVIDENCE-BACKED. HUMAN-REVIEWED.
  > signaldesk.co.uk/cases/operation-bigaud
  Bottom frame — red Mono 12px:
  > FULL INVESTIGATION + EVIDENCE INDEX AT LINK IN BIO

VO: [Quieter, more direct]
  "Full investigation at Signal Desk.
   Every source preserved.
   Every claim rated."

AUDIO: Logo STAMP. Typewriter on URL. No drone. Silence under final VO.
PRODUCTION NOTE: End in silence. Don't add a music swell. The absence
  of the drone is intentional — it lands heavier.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST PRODUCTION NOTES — SCRIPT 001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ElevenLabs prompt:
"[Speaking very slowly and deliberately, like a documentary narrator.
Flat affect. No emotional inflection. Measured pace with brief pauses
between sentences.]"

ElevenLabs pause codes to insert in script:
- "[pause 0.6s]" between "one thing." and next sentence
- "[pause 0.4s]" between "Washington D.C." / "Monaco" / "a chateau"
- "[pause 0.8s]" before "Not declared to his government."

Runway prompt for chateau aerial:
"Cinematic aerial drone shot, Mougins France, hilltop village,
terracotta rooftops, summer, golden hour light, wide establishing shot,
photorealistic, 4K, no people visible, lush green hillside"

CapCut / DaVinci export:
- Format: MP4 H.264, 9:16, 1080x1920, 24fps
- Audio: 48kHz stereo, VO normalised to -14 LUFS
- Captions: White, IBM Plex Mono, 24px, safe zone, auto-generated
  then corrected for ICIJ / OCLCIFF / Babiš spellings
```

---

## SCRIPT 002 — "THE LOAN TO YOURSELF"
### How the Back-to-Back Scheme Works — 45 seconds
### OSINT Education / Methodology Series

**Target audience:** Compliance professionals, journalists, OSINT community
**Hook strategy:** "Here's how it works" — explains a technique
**Tone:** More clinical than Script 001. Pure explanation.

---

```
╔══════════════════════════════════════════════════════════════════╗
║  SIGNAL DESK · SHORT FORM SCRIPT                                ║
║  EP001-REEL-B · "THE LOAN TO YOURSELF"                          ║
║  Duration: 0:45 · Format: 9:16 vertical · 24fps                 ║
║  ElevenLabs voice: Daniel · Rate: 0.85                          ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 001 · 0:00–0:04 · HOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. STAMP — white Playfair Black 62px:
  ┌──────────────────────┐
  │  HOW DO YOU          │
  │  HIDE $22M           │
  │  FROM YOUR OWN       │
  │  GOVERNMENT?         │
  └──────────────────────┘
  Each line stamps in 6 frames apart. Total: 30 frames.

VO: "How do you hide twenty-two million dollars
   from your own government?"

AUDIO: Four stamp thuds, 6 frames apart. No drone yet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 002 · 0:04–0:07 · THE ANSWER SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut. 4 frame black. Drone begins.
  REDACT reveal:
  ┌──────────────────────┐
  │  You loan it         │
  │  to yourself.        │
  └──────────────────────┘
  Playfair Italic, 54px white. STAMP after redact lift.

VO: "You loan it to yourself."
AUDIO: Redact drag. Then heavy STAMP thud.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 003 · 0:07–0:22 · THE MECHANISM — ANIMATED DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL: BLACK BACKGROUND
  Step-by-step diagram builds on screen as VO speaks.
  Each beat: new element STAMPS in timed to VO.

  [beat 1 — "Step one"]
  Box appears top-centre:
  ┌────────────────────┐
  │ YOU                │  ← white Mono
  │ (individual)       │
  └────────────────────┘
  Step label TYPEWRITER bottom-left: > STEP 1 OF 3

  [beat 2 — "offshore shell company"]
  WIRE draws down from YOU box.
  "$22M" appears in red beside wire.
  Box appears below:
  ┌────────────────────┐
  │ OFFSHORE COMPANY   │  ← Mono, white
  │ e.g. BVI           │
  └────────────────────┘

  [beat 3 — "lend it back"]
  WIRE draws from OFFSHORE COMPANY back up to a new box:
  The wire is DASHED red — different from the solid wire.
  ┌────────────────────┐
  │ "LOAN REPAYMENT"   │  ← Mono white
  │ on paper only      │
  └────────────────────┘
  Step label updates: > STEP 2 OF 3

  [beat 4 — "buy the asset"]
  WIRE draws from LOAN box to:
  ┌────────────────────┐  ← red border
  │ REAL ASSET         │
  │ e.g. PROPERTY      │
  └────────────────────┘
  Step label: > STEP 3 OF 3

VO: "Step one: move money into an offshore shell company.
   Step two: have that company lend it back to you —
   on paper, as a loan.
   Step three: use the 'loan' to buy an asset."

AUDIO: STAMP thuds and WIRE sounds timed to each VO beat.
Typewriter on step labels.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 004 · 0:22–0:30 · THE CONSEQUENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Hard cut black. Drone rises slightly.
  Two columns appear, STAMP:

  ┌──────────────┐  ┌──────────────┐
  │ WHAT IT      │  │ WHAT IT      │
  │ LOOKS LIKE   │  │ DOES         │
  │              │  │              │
  │ A legitimate │  │ Hides the    │
  │ company loan │  │ source of    │
  │              │  │ funds        │
  │              │  │ Reduces tax  │
  │              │  │ on gains     │
  └──────────────┘  └──────────────┘

  Red vertical divider line between columns — WIRE draws top to bottom.

VO: "On paper, it looks like a legitimate company loan.
   What it actually does: hides where the money came from.
   And potentially reduces tax."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 005 · 0:30–0:38 · THE INVESTIGATOR QUOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash PAPER background.
  Quote card slides up:
  ┌────────────────────────────────┐
  │ ❝ This scheme seems to me      │
  │   like from a textbook for     │
  │   investigators. It even has   │
  │   an English name:             │
  │                                │
  │   LOAN BACK. ❞                 │  ← red Playfair Italic 32px STAMP
  │                                │
  │ — Kamil Kouba                  │  ← Mono 13px
  │   Former Financial Crime       │
  │   Investigator                 │
  │                                │
  │ Source: Investigace.cz / ICIJ  │  ← Mono 11px, grey
  └────────────────────────────────┘

VO: [reads the quote exactly]
  "This scheme seems to me like from a textbook for investigators.
   It even has an English name. Loan back."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 006 · 0:38–0:45 · END CARD (METHODOLOGY TAG)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. STAMP — white Playfair 36px:
  "This is how we found it."
  Hold 24 frames. Hard cut.
  Signal Desk logo + dot.
  TYPEWRITER:
  > METHODOLOGY SERIES · EP001
  > signaldesk.co.uk

VO: "This is how we found it."
  [pause 1.2s]
  "Signal Desk. Public sources only."

PRODUCTION NOTE: The 1.2s pause after "found it" is intentional weight.
```

---

## SCRIPT 003 — "THE ASSET DECLARATION THAT WASN'T"
### The missing declarations — 52 seconds
### Designed for LinkedIn and compliance audience

**Target audience:** Compliance officers, KYC/AML professionals
**Hook strategy:** Professional obligation framing — speaks directly to the audience's job
**Tone:** Most clinical of the three. Almost procedural.

---

```
╔══════════════════════════════════════════════════════════════════╗
║  SIGNAL DESK · SHORT FORM SCRIPT                                ║
║  EP001-REEL-C · "THE ASSET DECLARATION THAT WASN'T"             ║
║  Duration: 0:52 · Format: 9:16 vertical + 1:1 LinkedIn crop     ║
║  ElevenLabs voice: Daniel · Rate: 0.82 (slowest of the three)   ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 001 · 0:00–0:05 · THE PROFESSIONAL HOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. No drone. Silence.
  TYPEWRITER — red Mono 18px, top-third:
  > CZECH ASSET DECLARATION ACT
  > SECTION 12(1)
  Then STAMP — white Playfair 42px:
  ┌──────────────────────────┐
  │ "All politicians must     │
  │  declare all assets."    │
  └──────────────────────────┘

VO: "Czech law. Politicians must declare all assets."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 002 · 0:05–0:10 · THE DECLARATION DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash PAPER background. Drone begins quietly.
  Simulated asset declaration form — Mono font throughout:
  ┌────────────────────────────────────┐
  │ CZECH REPUBLIC — ASSET DECLARATION │
  │ Declarant: ANDREJ BABIŠ · 2017     │
  │────────────────────────────────────│
  │ Property holdings:                 │
  │  · Agrofert trust interests    ✓   │
  │  · Czech residential property  ✓   │
  │  · Investment portfolios       ✓   │
  │                                    │
  │  · Chateau Bigaud, France      —   │  ← ABSENT — appears in red
  │  · Blakey Finance Ltd (BVI)    —   │  ← ABSENT
  │  · SCP Bigaud (Monaco)         —   │  ← ABSENT
  └────────────────────────────────────┘
  The three ABSENT lines appear last, each with a red dash,
  via STAMP with thud — three beats.

VO: "In 2017, Prime Minister Babiš filed his asset declaration.
   Agrofert. Czech properties. Investment portfolios.
   [pause 0.8s]
   The chateau: not listed.
   The BVI company: not listed.
   The Monaco entity: not listed."

AUDIO: Each "not listed" VO line timed to its STAMP thud.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 003 · 0:22–0:32 · THE COMPLIANCE FRAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. Drone rises.
  REDACT bar covers full frame — holds 12 frames.
  Lifts to reveal two columns:

  LEFT COLUMN:                    RIGHT COLUMN:
  ┌─────────────────────┐         ┌────────────────────┐
  │ WHAT A KYC ANALYST  │         │ WHAT THE CZECH     │
  │ WOULD FLAG          │         │ RECORDS SHOWED     │
  ├─────────────────────┤         ├────────────────────┤
  │ ✗ Asset source      │         │ $22M — origin      │
  │   unexplained       │         │ UNRESOLVED         │
  │ ✗ Offshore          │         │ BVI entity in ICIJ │
  │   structure noted   │         │ leaked database    │
  │ ✗ PEP status        │         │ CONFIRMED PEP      │
  │ ✗ Declaration       │         │ 5 years omitted    │
  │   discrepancy       │         │ HIGH confidence    │
  └─────────────────────┘         └────────────────────┘

  Confidence badges appear bottom of right column:
  HIGH · HIGH · HIGH · UNRESOLVED

VO: "From a KYC perspective:
   unexplained asset source.
   Known offshore structure.
   PEP status.
   Declaration discrepancy spanning five years.
   [pause 0.6s]
   This is what public records already show."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 004 · 0:32–0:42 · THE EVIDENCE SOURCE CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Flash PAPER. Evidence card.
  ┌───────────────────────────────┐
  │ EVD-005 · OFFICIAL SOURCE     │  ← red Mono
  │ Czech Asset Declaration Forms │
  │ Via: Investigace.cz / ICIJ    │
  │                               │
  │ Type: GOVERNMENT RECORD       │
  │ Preserved: Wayback Machine ✓  │
  │ Confidence: HIGH              │
  └───────────────────────────────┘

VO: "Source: Czech government records.
   Obtained by Investigace.cz.
   Preserved. Verified. High confidence."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAME 005 · 0:42–0:52 · THE COMPLIANCE CTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:
  Black. Drone fades.
  STAMP — white Playfair Black 46px:
  "This is what a due diligence
   report should look like."

  Hard cut. Signal Desk logo.
  TYPEWRITER:
  > EVIDENCE-BACKED. AUDITABLE.
  > signaldesk.co.uk

VO: "This is what a due diligence report should look like.
   [pause 1.0s]
   Signal Desk."

PRODUCTION NOTE: For LinkedIn 1:1 crop — shift all text elements
  to centre-frame safe zone (no bottom 20% on square crop).
  Export second version 1:1 at 1080x1080, same 24fps.
```

---

## PRODUCTION CHECKLIST — FOR EVERY REEL

```
PRE-PRODUCTION
□ Script finalised and timed (read aloud with stopwatch)
□ ElevenLabs VO generated — check all proper nouns
  (Babiš / ICIJ / OCLCIFF / Investigace.cz / Mougins)
□ VO audio exported as WAV 48kHz stereo
□ Drone audio licensed and ready
□ All SFX prepared: stamp / typewriter / redact / wire
□ Runway prompt written for any AI visuals needed

PRODUCTION
□ Timeline built to VO audio file (lock picture to audio)
□ All STAMP animations: 8-frame settle from 120% scale
□ All TYPEWRITER: 2 characters per frame, IBM Plex Mono only
□ All REDACT: 12-frame lift from left to right
□ All WIRE: 18-frame draw at constant speed
□ All CUT-TO-BLACK: exactly 4 frames silence
□ Confidence badges: STAMP 4 frames after finding text
□ Safe zones checked on actual phone (not just desktop preview)
□ Captions: auto-generated then corrected for proper nouns

POST-PRODUCTION
□ Audio mix: VO at -14 LUFS / Drone at -26 LUFS / SFX at -20 LUFS
□ No music under VO — ever
□ Final frame: Signal Desk logo + URL visible for minimum 4 seconds
□ Export 9:16 for TikTok / Reels / Shorts
□ Export 1:1 crop for LinkedIn
□ Legal note in caption/description

CAPTION TEMPLATE:
[Hook line from video]

In 2009, [subject] used a shell company chain across 4 jurisdictions
to secretly acquire [asset]. Here's the paper trail.

All findings from public records. Sources:
→ ICIJ Pandora Papers
→ ICIJ Offshore Leaks Database
→ Czech official asset declarations
→ Le Monde / ICIJ French investigation report

Full investigation + evidence index: signaldesk.co.uk/cases/operation-bigaud

This content is based on published public-record sources only.
No private data was accessed. Signal Desk does not assert criminality —
that is a matter for investigators and courts.

#OSINT #PandoraPapers #OpenSourceIntelligence #DueDiligence
#InvestigativeJournalism #Compliance #Bellingcat

LEGAL NOTE IN DESCRIPTION (mandatory):
"This investigation is based entirely on published public-record sources.
Signal Desk has not accessed any private, restricted, or unpublished
information. Andrej Babiš has publicly stated he did nothing illegal or
wrong. The French investigation is ongoing. All findings reflect the
published record as of [date]."
```
