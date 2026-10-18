# TASK: BUILD & DEPLOY PORTFOLIO V2 (v2-redesign)

Execute the full V2 redesign across src/lib/projects.ts, src/app/page.tsx, src/components/ProjectCard.tsx, and src/components/ProjectModal.tsx.

## 1. DESIGN SYSTEM
- Theme: Default to Crisp Gallery Light Mode (#FFFFFF background, #F4F4F6 squircle containers, #09090B primary ink, #52525B muted text) with a spring physics Dark Mode toggle in the top header (#000000 background, #0E0E11 cards, #FAFAFA text).
- Geometry: Zero 1px borders on cards or modals. Use rounded-[36px] to rounded-[40px] squircle containers and subtle surface elevation.
- Typography: Load Geist (tight -0.04em tracking for display titles and clean body copy) and Geist Mono (11px to 12px uppercase technical telemetry and captions).
- Strict Zero Hyphen Rule: Never use hyphens in compound modifiers (write "AI native", "human in the loop", "zero to one", "role based", "multi book", "under 85%").
- Strict Metric Lock: Remove all legacy V1 metrics (NO 99.2%, NO 177%, NO 40% MTTR, NO 15 years). Always state "8+ years" of experience.

## 2. HERO & INTERACTIVE IMPACT LENS
- Header Left: David Flynt | Expandable Contact me pill (davidflynt@gmail.com copy to clipboard).
- Header Right: Lead Product Designer & Design Engineer | Theme Toggle.
- Hero H1: Designing the Interface of Intelligence
- Hero Subhead: 8+ years architecting AI native systems, agentic workflows, and enterprise developer platforms. Combining systems thinking and human in the loop craft with production code fluency in React, Next.js, TypeScript, Claude Code, and Cursor.
- Impact Lens Filter Bar: Remove the V1 fake search bar and dropdown. Replace with a horizontal spring animated pill bar using Framer Motion layoutId="activeFilter":
  1. All Systems (4) (shows all)
  2. 2,800 WAU Threat AI (spotlights stellar-cyber)
  3. 85% Confidence Threshold UI (spotlights papertrail)
  4. Global Series Customization (spotlights amazon)
  5. 6 Mo → 2 Wk Test Automation (spotlights cisco)
  Clicking or hovering a pill spotlights the matching project card below and dims non matching cards to opacity-40 scale-[0.98].

## 3. 2x2 BENTO SHOWCASE CARDS (ProjectCard.tsx)
- Change project grid from 4 vertical columns to a spacious 2 column Bento Grid (grid-cols-1 lg:grid-cols-2 gap-8).
- Each card features a bold 16:9 squircle stage tinted with the project accentColor so desktop and mobile media are never cropped on the sides.
- Keep existing working video hover autoplay and poster thumbnail paths intact.
- Below the media stage inside the card, display: Project Logo, Title, Role & Timeline (12px Geist Mono), and the 1 line cardSummary.

## 4. APPLE SHEET MODAL & 3 COLUMN NARRATIVE (ProjectModal.tsx)
- Wide floating sheet (max-w-7xl w-[94vw] rounded-[40px], zero internal borders).
- Top Area (Uncropped 16:9 Media Stage): Displays active video or image uncropped (object-contain) inside the project accentColor stage. Click video to play or pause. Keep top right fullscreen lightbox button and clickable project logo with ExternalLink icon.
- Floating Glass Switcher: Center thumbnail selector and 12px Geist Mono caption in a floating glass pill bar.
- Bottom Area (3 Column Architectural Grid): Render 01 / THE CHALLENGE, 02 / SYSTEM ARCHITECTURE, and 03 / VERIFIED IMPACT side by side in a clean 3 column layout (grid-cols-1 md:grid-cols-3 gap-8 p-8).

## 5. MASTER VERIFIED DATA (src/lib/projects.ts)
Preserve all existing working gallery and thumbnail file paths in /public/projects/... and /public/images/... and update project objects to this exact order and copy:

1. Stellar Cyber (id: "stellar-cyber", accentColor: "#FF5500")
   - Title: Stellar Cyber | AI Investigation Notebook
   - Role: Product Designer, AI & Security Lead · Jan 2023 to July 2025 (Series B to Series C growth)
   - Card Summary: Unified fragmented security workflows and natural language query translation for 2,800 weekly active users.
   - URL: https://stellarcyber.ai/ai-investigator-natural-language-threat-hunting/
   - Challenge: Supporting 2,800 weekly active technical users on an enterprise Open XDR platform, behavioral telemetry revealed a massive workflow bottleneck: while 1,110 security analysts actively hunted threats every week, standalone query builder tools saw only 18 pageviews. Analysts struggled to write complex Elasticsearch syntax manually, and jumping across disconnected tabs caused severe alert fatigue and cold storage search timeouts.
   - Architecture: Rather than slapping a black box chatbot onto legacy tables, I built an interactive consensus prototype for the AI Investigation Notebook to align product and engineering around model latency, hallucination recovery, and API feasibility. I designed natural language security query workflows that translated analyst intent into inspectable, editable backend query syntax so analysts could codrive searches with full control. Standardized CVE progressive disclosure specs pairing compact severity cues with on demand exploit telemetry and architected asynchronous cold storage query flows.
   - Impact Bullets:
     - 2,800 WAU: Scaled core platform UX across enterprise security teams from Series B to Series C.
     - 1,110 vs. 18 Telemetry Insight: Used hard behavioral data to unify threat hunting and natural language query creation into a single workspace, supporting executive targets to cut Mean Time to Resolve (MTTR).
     - $150K ARR Preserved: Asynchronous cold storage search architecture eliminated query timeouts for high volume enterprise tenants and modernized multi tenant role based access control (RBAC).
   - Gallery Captions:
     - ai-hero.mp4: Natural language threat hunting translating analyst intent into inspectable backend queries.
     - ai-01.png: Persistent AI Investigation Notebook unifying 1,110 weekly threat hunters into a single workspace.
     - ai-02.mp4: Inspectable query translation with progressive CVE telemetry disclosure on hover.
     - ai-03.png: Contextual time range scoping designed to prevent cold storage query timeouts.

2. PaperTrail (id: "papertrail", accentColor: "#00E599")
   - Title: PaperTrail | AI Financial Observability Platform
   - Role: Founding Lead Product Designer & Architect · July 2025 to Present (Georgia Tech CREATE X Accelerator)
   - Card Summary: 0 to 1 product strategy, calibrated trust mechanics, and production Next.js/TypeScript engineering for rental property owners.
   - URL: https://papertrail.finance
   - Challenge: Rental property owners and hospitality hosts managing unstructured paper receipts face a critical trust gap with AI financial tools: blind automation creates tax audit liabilities when models hallucinate, while manually reviewing bounding boxes on every line item causes cognitive overload and ruins unit economics.
   - Architecture: Partnering with my data scientist cofounder, I architected the 0 to 1 product strategy and shipped the production frontend directly in React, Next.js, TypeScript, and Tailwind CSS using Cursor and Claude Code. I engineered human in the loop supervision patterns centered on an 85% confidence threshold: high confidence extractions flow cleanly, while under 85% fields automatically flag exception recovery states for side by side human verification. Beyond static dashboards, I structured proactive AI financial guidance and status transparency.
   - Impact Bullets:
     - 85% Confidence Threshold UI: Calibrated user trust, surfaced inline exception recovery states, and protected unit inference margins while guaranteeing 100% audit control.
     - Usability Research (n=8 Operators): Conducted testing with 8 property owners, replacing high friction date pickers with prescoped tax year context chips and architecting real time batch review workflows.
     - Georgia Tech CREATE X: Selected for Georgia Tech's startup accelerator program and launched live at Demo Day (papertrail.finance).
   - Gallery Captions:
     - pt-hero.mp4: End to end mobile receipt capture with optimistic UI states built in Next.js and TypeScript.
     - pt-01.png: Real time financial observability dashboard with tax readiness health indicators.
     - pt-02.mp4: Natural language expense filtering validated through usability research with 8 property operators.
     - pt-03.mp4: 85% confidence threshold UI flagging uncertain fields with amber exception cues for human verification.

3. Amazon Books (id: "amazon", accentColor: "#00C805")
   - Title: Amazon Books | Series Customization & Mobile Growth
   - Role: UX Designer (Contract) · July 2022 to Oct 2022
   - Card Summary: High volume mobile edition swap and checkout flows shipped globally to millions of readers.
   - URL: https://www.amazon.com/b?ie=UTF8&node=13633915011
   - Challenge: Millions of readers purchasing multi book series on Amazon Mobile encountered rigid bundle states. Book collectors who already owned specific editions or preferred matching formats (hardcover vs paperback vs media tie in) lacked a lightweight way to customize individual books inside the Buy the Series checkout flow without abandoning the funnel.
   - Architecture: Working within Amazon's global design system and strict mobile interaction standards, I designed a 4 step inline customization architecture: (1) Toggle on Customize editions, (2) Tap inline Swap triggers per book, (3) Select desired format and publisher edition in a clean bottom sheet, and (4) Confirm via immediate popover feedback (Book 1 substituted) with real time bundle price recalculation.
   - Impact Bullets:
     - Global Consumer Scale: Passed rigorous Amazon executive design reviews and launched worldwide to millions of mobile shoppers.
     - Data Science Experimentation: Partnered with data science teams on multivariate A/B testing to evaluate discovery and purchase completion while meeting strict WCAG accessibility standards.
   - Gallery Captions:
     - amazon-hero.png: 4 step progressive series customization flow shipped globally on Amazon Mobile.
     - amzn-01.png: Bottom sheet edition swap interaction handling dense format and publisher metadata.
     - amzn-02.png: Localization analysis transitioning from regional manga layouts to global print bundles.
     - amzn-03.png: System explorations for high velocity mobile bundle discovery.

4. Cisco (id: "cisco", accentColor: "#0055FF")
   - Title: Cisco | Mass Infrastructure Observability & Smart Debug
   - Role: Product Designer, Mass Infrastructure Group · Dec 2017 to Feb 2022
   - Card Summary: Unified Single Pane of Glass orchestration and ML failure diagnostics for 500+ hardware and network engineers.
   - URL: https://youtu.be/V1cqrAJ-KXE?si=vqGmNxrnwOwwA664
   - Challenge: In Cisco's Mass Infrastructure Group, hardware and network engineers certifying enterprise routers across 10,000+ test cases had to context switch across a dozen fragmented internal tools. Diagnosing whether a test failure stemmed from a software bug or a hardware defect required manual log scraping, stretching router certification cycles to 6 months.
   - Architecture: Embedded directly within the frontend engineering org, I unified fragmented developer and network tools into a cohesive Single Pane of Glass orchestration workspace. I designed the UX architecture for Smart Debug, an early machine learning observability tool that surfaced failure probability scores to help engineers triage root causes and prevent downtime.
   - Impact Bullets:
     - 6 Months → 2 Weeks: Contributed to slashing hardware test certification cycles from six months down to two weeks through unified workflow orchestration.
     - 500+ Engineers Across 5 Global Teams: Helped establish and govern an enterprise design system and reusable telemetry component library adopted across five global engineering organizations.
   - Gallery Captions:
     - cisco-hero.png: Unified Single Pane of Glass test orchestration workspace for 500+ global engineers.
     - csc-01.mp4: Smart Debug machine learning probability scores predicting software versus hardware root causes.
     - csc-02.png: Synchronized syslog and execution log split view eliminating manual log scraping.
     - csc-03.png: Visual topology workspace orchestrating 10,000+ automated hardware test cases.
