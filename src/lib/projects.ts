export type ProjectId = "stellar-cyber" | "papertrail" | "amazon" | "cisco";

export type MediaType = "video" | "image";

export interface GalleryItem {
    url: string;
    type: MediaType;
    caption: string;
    /** Still used by the modal thumbnail switcher. */
    thumb?: string;
    /** Poster frame for video items. */
    poster?: string;
    /** Native source width caps enlargement of static artwork. */
    nativeWidth?: number;
}

export interface ImpactItem {
    /** Lead metric, e.g. "2,800 WAU". */
    metric: string;
    detail: string;
    provenance: string;
}

export interface Project {
    id: ProjectId;
    title: string;
    role: string;
    timeline: string;
    /** One sentence summary shown on the bento card. */
    cardSummary: string;
    /** Core decision shown before the project media. */
    summary: string;
    /** Brand accent for metric markers. */
    accentColor: string;
    logoUrl: string;
    projectUrl: string;
    /** Poster still shown on the card before hover. */
    thumbnail: string;
    /** Optional video that autoplays on card hover. */
    previewVideo?: string;
    gallery: GalleryItem[];
    challenge: string;
    architecture: string;
    impact: ImpactItem[];
}

/** Returns the best still for a gallery item's switcher thumbnail. */
export const getThumb = (item: GalleryItem): string | undefined =>
    item.thumb ?? item.poster ?? (item.type === "image" ? item.url : undefined);

const projectCatalog: Project[] = [
    {
        id: "papertrail",
        title: "PaperTrail | AI Financial Observability Platform",
        role: "Founding Lead Product Designer & Architect",
        timeline: "July 2025 to Present (Georgia Tech CREATE X Accelerator)",
        cardSummary:
            "0 to 1 product strategy, calibrated trust mechanics, and production Next.js/TypeScript engineering for rental property owners.",
        summary: "Built the production receipt review experience so owners can check uncertain extractions and correct every field before saving.",
        accentColor: "#00E599",
        logoUrl: "/logos/Papertrail_logo.svg",
        projectUrl: "https://papertrail.finance",
        thumbnail: "/projects/papertrail/pt-hero-thumb.png",
        previewVideo: "/projects/papertrail/pt-hero.mp4",
        gallery: [
            {
                url: "/projects/papertrail/pt-hero.mp4",
                type: "video",
                poster: "/projects/papertrail/pt-hero-thumb.png",
                caption:
                    "End to end mobile receipt capture with optimistic UI states built in Next.js and TypeScript.",
            },
            {
                url: "/projects/papertrail/pt-01.png",
                type: "image",
                thumb: "/projects/papertrail/pt-01-thumb.png",
                caption:
                    "Real time financial observability dashboard with tax readiness health indicators.",
            },
            {
                url: "/projects/papertrail/pt-02.mp4",
                type: "video",
                thumb: "/projects/papertrail/pt-02-thumb.png",
                caption:
                    "Natural language expense filtering validated through usability research with 8 property operators.",
            },
            {
                url: "/projects/papertrail/pt-03.mp4",
                type: "video",
                thumb: "/projects/papertrail/pt-03-thumb.png",
                caption:
                    "85% confidence threshold UI flagging uncertain fields with amber exception cues for human verification.",
            },
        ],
        challenge:
            "Property owners need accurate expense records without checking every receipt from scratch. Model errors create uncertainty around property assignment and expense categorization. We considered source highlighting, but coordinate extraction added model cost, so we kept the receipt beside editable fields and focused attention on uncertainty.",
        architecture:
            "Rejected full background categorization in favor of owner verification. I built a receipt and form review loop where fields below the 85% confidence design threshold receive an amber cue. Owners can compare the source and edit every value before saving. Partnering with my data scientist cofounder, I shipped the production frontend in React, Next.js, TypeScript, and Tailwind CSS using Cursor and Claude Code.",
        impact: [
            {
                metric: "85% Confidence Design Threshold",
                detail:
                    "Fields below the 85% confidence threshold receive an amber review cue. Owners can compare the receipt, correct any field, and verify the record before saving.",
                provenance: "Design rule: below 85% triggers an amber review cue.",
            },
            {
                metric: "Usability Research (n=8 Operators)",
                detail:
                    "Testing with 8 property owners led us to replace complex calendar date pickers with prescoped tax year context chips. The beta reviews one receipt at a time; batch processing remains on the roadmap.",
                provenance: "Validated through usability testing with 8 property operators and short-term rental hosts.",
            },
            {
                metric: "Georgia Tech CREATE X",
                detail:
                    "Selected for Georgia Tech's startup accelerator program and launched live at Demo Day (papertrail.finance).",
                provenance: "Source: Georgia Tech CREATE X accelerator participation and Demo Day launch.",
            },
        ],
    },
    {
        id: "stellar-cyber",
        title: "Stellar Cyber | AI Investigation Notebook",
        role: "Product Designer, AI & Security Lead",
        timeline: "Jan 2023 to July 2025 (Series B to Series C growth)",
        cardSummary:
            "Unified fragmented security workflows and natural language query translation for 2,800 weekly active users.",
        summary: "Turned analyst questions into inspectable, editable queries while keeping investigation context in one workspace.",
        accentColor: "#FF5500",
        logoUrl: "/logos/Stellar_logo.svg",
        projectUrl: "https://stellarcyber.ai/ai-investigator-natural-language-threat-hunting/",
        thumbnail: "/projects/stellar-cyber/ai-hero-thumb.png",
        previewVideo: "/projects/stellar-cyber/ai-hero.mp4",
        gallery: [
            {
                url: "/projects/stellar-cyber/ai-hero.mp4",
                type: "video",
                poster: "/projects/stellar-cyber/ai-hero-thumb.png",
                caption:
                    "Natural language threat hunting translating analyst intent into inspectable backend queries.",
            },
            {
                url: "/projects/stellar-cyber/ai-01.png",
                type: "image",
                thumb: "/projects/stellar-cyber/ai-01-thumb.png",
                caption:
                    "Persistent AI Investigation Notebook unifying 1,110 weekly threat hunters into a single workspace.",
            },
            {
                url: "/projects/stellar-cyber/ai-02.mp4",
                type: "video",
                thumb: "/projects/stellar-cyber/ai-02-thumb.png",
                caption:
                    "Inspectable query translation with progressive CVE telemetry disclosure on hover.",
            },
            {
                url: "/projects/stellar-cyber/ai-03.png",
                type: "image",
                thumb: "/projects/stellar-cyber/ai-03-thumb.png",
                caption:
                    "Contextual time range scoping designed to prevent cold storage query timeouts.",
            },
        ],
        challenge:
            "Supporting 2,800 weekly active technical users on an enterprise Open XDR platform, behavioral telemetry revealed a massive workflow bottleneck: while 1,110 security analysts actively hunted threats every week, standalone query builder tools saw only 18 pageviews. Analysts had to write complex Elasticsearch syntax and move between disconnected tools. Large historical searches also needed clear progress states and asynchronous data recall.",
        architecture:
            "Rejected an opaque auto executing chat assistant because analysts need to verify queries during live investigations. I designed natural language inputs that compile into inspectable, editable Elasticsearch syntax cards. An interactive prototype aligned product and engineering around latency, model error recovery, and API feasibility. CVE disclosure specs and asynchronous cold storage flows extended that approach to deeper investigation.",
        impact: [
            {
                metric: "2,800 WAU",
                detail: "Scaled core platform UX across enterprise security teams from Series B to Series C.",
                provenance: "Source: Mixpanel platform telemetry across the Series B to C rollout, 2023 to 2025.",
            },
            {
                metric: "1,110 Active Hunters vs. 18 Query Pageviews",
                detail:
                    "A seven-day Mixpanel telemetry review showed 1,110 weekly active threat hunters and just 18 standalone query builder pageviews. That disparity helped inform our decision to bring query creation directly into the investigation workflow.",
                provenance: "Source: 7 day Mixpanel behavioral baseline comparing weekly active hunters with query pageviews.",
            },
            {
                metric: "$150K ARR Preserved",
                detail:
                    "Contributed to retaining an enterprise renewal by shipping asynchronous cold storage query recall workflows.",
                provenance: "Source: enterprise renewal retained following the cold storage workflow release.",
            },
        ],
    },
    {
        id: "amazon",
        title: "Amazon Books | Series Customization & Mobile Growth",
        role: "UX Designer (Contract)",
        timeline: "July 2022 to Oct 2022",
        cardSummary:
            "High volume mobile edition swap and checkout flows shipped globally to millions of readers.",
        summary: "Kept edition swaps inside the series purchase flow, with immediate confirmation and updated bundle pricing.",
        accentColor: "#00C805",
        logoUrl: "/logos/Amazon_logo.svg",
        projectUrl: "https://www.amazon.com/b?ie=UTF8&node=13633915011",
        thumbnail: "/images/amazon-hero.png",
        gallery: [
            {
                url: "/images/amazon-hero.png",
                type: "image",
                caption:
                    "4 step progressive series customization flow shipped globally on Amazon Mobile.",
            },
            // Pending assets (not yet in /public). Uncomment once the files are added:
            // { url: "/projects/amazon/amzn-01.png", type: "image", caption: "Bottom sheet edition swap interaction handling dense format and publisher metadata." },
            // { url: "/projects/amazon/amzn-02.png", type: "image", caption: "Localization analysis transitioning from regional manga layouts to global print bundles." },
            // { url: "/projects/amazon/amzn-03.png", type: "image", caption: "System explorations for high velocity mobile bundle discovery." },
        ],
        challenge:
            "Millions of readers purchasing multi book series on Amazon Mobile encountered rigid bundle states. Book collectors who already owned specific editions or preferred matching formats (hardcover vs paperback vs media tie in) lacked a lightweight way to customize individual books inside the Buy the Series checkout flow without abandoning the funnel.",
        architecture:
            "Worked within Amazon Shopping component constraints and rejected sending users to separate product pages. I designed a 4 step inline edition swap: (1) Toggle on Customize editions, (2) Tap inline Swap triggers per book, (3) Select desired format and publisher edition in a clean bottom sheet, and (4) Confirm via immediate popover feedback (Book 1 substituted) with real time bundle price recalculation.",
        impact: [
            {
                metric: "Global Consumer Scale",
                detail:
                    "Validated through multivariate experimentation and Amazon design review before the global mobile rollout.",
                provenance: "Source: Amazon design reviews, multivariate experiments, and global mobile rollout.",
            },
            {
                metric: "Data Science Experimentation",
                detail:
                    "Partnered with data science teams on multivariate A/B testing to evaluate discovery and purchase completion while meeting accessibility standards.",
                provenance: "Source: collaboration with the data science team on discovery and purchase completion experiments.",
            },
        ],
    },
    {
        id: "cisco",
        title: "Cisco | CAFY & CQE Developer Ecosystem",
        role: "Product Designer, Mass Infrastructure Group",
        timeline: "Dec 2017 to Feb 2022",
        cardSummary:
            "Unified developer workflows, framework onboarding, and diagnostic tools for 500+ hardware and network engineers.",
        summary: "Unified five fragmented internal test tools into the CAFY and CQE developer ecosystem for 500+ engineers, contributing to a reduction in router certification time from six months to two weeks.",
        accentColor: "#0055FF",
        logoUrl: "/logos/Cisco_logo.svg",
        projectUrl: "https://youtu.be/V1cqrAJ-KXE?si=vqGmNxrnwOwwA664",
        thumbnail: "/images/cisco-hero.png",
        gallery: [
            {
                url: "/images/cisco-hero.png",
                type: "image",
                nativeWidth: 1920,
                caption:
                    "FIG 01 · Internal CAFY Developer Portal: Self-serve onboarding microsite driving framework adoption across 5 global engineering orgs.",
            },
            // Pending assets (not yet in /public). Uncomment once the files are added:
            // { url: "/projects/cisco/csc-01.mp4", type: "video", caption: "Smart Debug machine learning probability scores predicting software versus hardware root causes." },
            // { url: "/projects/cisco/csc-02.png", type: "image", caption: "Synchronized syslog and execution log split view eliminating manual log scraping." },
            // { url: "/projects/cisco/csc-03.png", type: "image", caption: "Visual topology workspace orchestrating 10,000+ automated hardware test cases." },
        ],
        challenge:
            "In Cisco's Mass Infrastructure Group, hardware and network engineers certifying enterprise routers across 10,000+ test cases had to context switch across a dozen fragmented internal tools. Diagnosing whether a test failure stemmed from a software bug or a hardware defect required manual log scraping, stretching router certification cycles to 6 months.",
        architecture:
            "Embedded within frontend engineering, I consolidated 5 CLI and web diagnostic tools into a unified CQE workflow. Smart Debug surfaced ML failure probability scores inline so engineers could triage likely root causes before reviewing raw logs. The portal shown here provided the entry point to that ecosystem.",
        impact: [
            {
                metric: "6 Months → 2 Weeks",
                detail:
                    "Contributed to reducing router OS certification cycles through unified workflow orchestration and test automation.",
                provenance: "Source: router OS certification cycle across 10,000+ automated test cases.",
            },
            {
                metric: "500+ Engineers Across 5 Global Teams",
                detail:
                    "Helped establish and govern an enterprise design system and reusable telemetry component library adopted across five global engineering organizations.",
                provenance: "Scope: 500+ engineers across five global engineering teams.",
            },
        ],
    },
];

/** Reverse chronological editorial order also drives the project grid and card preloads. */
const projectOrder: ProjectId[] = ["papertrail", "stellar-cyber", "amazon", "cisco"];
export const projects: Project[] = projectOrder.map((id) => projectCatalog.find((project) => project.id === id)!);
