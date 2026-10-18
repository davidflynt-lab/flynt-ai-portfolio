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
}

export interface ImpactItem {
    /** Lead metric, e.g. "2,800 WAU". */
    metric: string;
    detail: string;
}

export interface Project {
    id: ProjectId;
    title: string;
    role: string;
    timeline: string;
    /** One sentence summary shown on the bento card. */
    cardSummary: string;
    /** Brand tint for the 16:9 media stage. */
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

/**
 * Accent tinted backdrop for 16:9 media stages. Uses translucent layers of the
 * project accent (6 digit hex) so it reads correctly over light and dark surfaces.
 */
export const accentStage = (accentColor: string): string =>
    `radial-gradient(120% 100% at 50% 0%, ${accentColor}3d 0%, ${accentColor}1f 48%, ${accentColor}0f 100%)`;

export const projects: Project[] = [
    {
        id: "stellar-cyber",
        title: "Stellar Cyber | AI Investigation Notebook",
        role: "Product Designer, AI & Security Lead",
        timeline: "Jan 2023 to July 2025 (Series B to Series C growth)",
        cardSummary:
            "Unified fragmented security workflows and natural language query translation for 2,800 weekly active users.",
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
            "Supporting 2,800 weekly active technical users on an enterprise Open XDR platform, behavioral telemetry revealed a massive workflow bottleneck: while 1,110 security analysts actively hunted threats every week, standalone query builder tools saw only 18 pageviews. Analysts struggled to write complex Elasticsearch syntax manually, and jumping across disconnected tabs caused severe alert fatigue and cold storage search timeouts.",
        architecture:
            "Rather than slapping a black box chatbot onto legacy tables, I built an interactive consensus prototype for the AI Investigation Notebook to align product and engineering around model latency, hallucination recovery, and API feasibility. I designed natural language security query workflows that translated analyst intent into inspectable, editable backend query syntax so analysts could codrive searches with full control. Standardized CVE progressive disclosure specs pairing compact severity cues with on demand exploit telemetry and architected asynchronous cold storage query flows.",
        impact: [
            {
                metric: "2,800 WAU",
                detail: "Scaled core platform UX across enterprise security teams from Series B to Series C.",
            },
            {
                metric: "1,110 vs. 18 Telemetry Insight",
                detail:
                    "Used hard behavioral data to unify threat hunting and natural language query creation into a single workspace, supporting executive targets to cut Mean Time to Resolve (MTTR).",
            },
            {
                metric: "$150K ARR Preserved",
                detail:
                    "Asynchronous cold storage search architecture eliminated query timeouts for high volume enterprise tenants and modernized multi tenant role based access control (RBAC).",
            },
        ],
    },
    {
        id: "papertrail",
        title: "PaperTrail | AI Financial Observability Platform",
        role: "Founding Lead Product Designer & Architect",
        timeline: "July 2025 to Present (Georgia Tech CREATE X Accelerator)",
        cardSummary:
            "0 to 1 product strategy, calibrated trust mechanics, and production Next.js/TypeScript engineering for rental property owners.",
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
            "Rental property owners and hospitality hosts managing unstructured paper receipts face a critical trust gap with AI financial tools: blind automation creates tax audit liabilities when models hallucinate, while manually reviewing bounding boxes on every line item causes cognitive overload and ruins unit economics.",
        architecture:
            "Partnering with my data scientist cofounder, I architected the 0 to 1 product strategy and shipped the production frontend directly in React, Next.js, TypeScript, and Tailwind CSS using Cursor and Claude Code. I engineered human in the loop supervision patterns centered on an 85% confidence threshold: high confidence extractions flow cleanly, while under 85% fields automatically flag exception recovery states for side by side human verification. Beyond static dashboards, I structured proactive AI financial guidance and status transparency.",
        impact: [
            {
                metric: "85% Confidence Threshold UI",
                detail:
                    "Calibrated user trust, surfaced inline exception recovery states, and protected unit inference margins while guaranteeing 100% audit control.",
            },
            {
                metric: "Usability Research (n=8 Operators)",
                detail:
                    "Conducted testing with 8 property owners, replacing high friction date pickers with prescoped tax year context chips and architecting real time batch review workflows.",
            },
            {
                metric: "Georgia Tech CREATE X",
                detail:
                    "Selected for Georgia Tech's startup accelerator program and launched live at Demo Day (papertrail.finance).",
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
            "Working within Amazon's global design system and strict mobile interaction standards, I designed a 4 step inline customization architecture: (1) Toggle on Customize editions, (2) Tap inline Swap triggers per book, (3) Select desired format and publisher edition in a clean bottom sheet, and (4) Confirm via immediate popover feedback (Book 1 substituted) with real time bundle price recalculation.",
        impact: [
            {
                metric: "Global Consumer Scale",
                detail:
                    "Passed rigorous Amazon executive design reviews and launched worldwide to millions of mobile shoppers.",
            },
            {
                metric: "Data Science Experimentation",
                detail:
                    "Partnered with data science teams on multivariate A/B testing to evaluate discovery and purchase completion while meeting strict WCAG accessibility standards.",
            },
        ],
    },
    {
        id: "cisco",
        title: "Cisco | Mass Infrastructure Observability & Smart Debug",
        role: "Product Designer, Mass Infrastructure Group",
        timeline: "Dec 2017 to Feb 2022",
        cardSummary:
            "Unified Single Pane of Glass orchestration and ML failure diagnostics for 500+ hardware and network engineers.",
        accentColor: "#0055FF",
        logoUrl: "/logos/Cisco_logo.svg",
        projectUrl: "https://youtu.be/V1cqrAJ-KXE?si=vqGmNxrnwOwwA664",
        thumbnail: "/images/cisco-hero.png",
        gallery: [
            {
                url: "/images/cisco-hero.png",
                type: "image",
                caption:
                    "Unified Single Pane of Glass test orchestration workspace for 500+ global engineers.",
            },
            // Pending assets (not yet in /public). Uncomment once the files are added:
            // { url: "/projects/cisco/csc-01.mp4", type: "video", caption: "Smart Debug machine learning probability scores predicting software versus hardware root causes." },
            // { url: "/projects/cisco/csc-02.png", type: "image", caption: "Synchronized syslog and execution log split view eliminating manual log scraping." },
            // { url: "/projects/cisco/csc-03.png", type: "image", caption: "Visual topology workspace orchestrating 10,000+ automated hardware test cases." },
        ],
        challenge:
            "In Cisco's Mass Infrastructure Group, hardware and network engineers certifying enterprise routers across 10,000+ test cases had to context switch across a dozen fragmented internal tools. Diagnosing whether a test failure stemmed from a software bug or a hardware defect required manual log scraping, stretching router certification cycles to 6 months.",
        architecture:
            "Embedded directly within the frontend engineering org, I unified fragmented developer and network tools into a cohesive Single Pane of Glass orchestration workspace. I designed the UX architecture for Smart Debug, an early machine learning observability tool that surfaced failure probability scores to help engineers triage root causes and prevent downtime.",
        impact: [
            {
                metric: "6 Months → 2 Weeks",
                detail:
                    "Contributed to slashing hardware test certification cycles from six months down to two weeks through unified workflow orchestration.",
            },
            {
                metric: "500+ Engineers Across 5 Global Teams",
                detail:
                    "Helped establish and govern an enterprise design system and reusable telemetry component library adopted across five global engineering organizations.",
            },
        ],
    },
];
