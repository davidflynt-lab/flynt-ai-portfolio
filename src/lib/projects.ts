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
    /** Concise labels for the visible details in an image. */
    annotations?: string[];
    /** Source aspect ratio preserves uncropped detail views. */
    aspectRatio?: number;
    /** Optional crop position for a focused view of an original image. */
    imagePosition?: string;
    /** Zoom within the media stage while retaining the unmodified source. */
    imageScale?: number;
}

export interface ImpactItem {
    /** Lead metric, e.g. "2,800 WAU". */
    metric: string;
    detail: string;
    provenance?: string;
}

export interface Project {
    id: ProjectId;
    title: string;
    role: string;
    timeline: string;
    /** One sentence summary shown on the bento card. */
    cardSummary: string;
    cardProof: string;
    /** Core decision shown before the project media. */
    summary: string;
    /** Scannable contribution and collaborators for the case study header. */
    ownership: string;
    scopeHeader: { role: string; scope: string; shipped: string };
    /** Brand accent for metric markers. */
    accentColor: string;
    logoUrl: string;
    projectUrl: string;
    /** Poster still shown on the card before hover. */
    thumbnail: string;
    /** Optional video that autoplays on card hover. */
    previewVideo?: string;
    /** Background bleed for the hero poster and video media stages. */
    stageBackground?: string;
    gallery: GalleryItem[];
    challenge: string;
    architecture: string;
    workflow?: { title: string; detail: string }[];
    relatedWork?: { title: string; detail: string };
    impact: ImpactItem[];
}

/** Returns the best still for a gallery item's switcher thumbnail. */
export const getThumb = (item: GalleryItem): string | undefined =>
    item.thumb ?? item.poster ?? (item.type === "image" ? item.url : undefined);

export const projects: Project[] = [
    {
        "id": "papertrail",
        "title": "PaperTrail | AI Expense Review for Property Owners",
        "role": "Founding Lead Product Designer & Architect",
        "timeline": "July 2025 to Present (Georgia Tech Create X)",
        "cardSummary": "0 to 1 product strategy, threshold based review mechanics, and production React/Next.js/TypeScript engineering for property owners.",
        "summary": "Built the production receipt review experience so owners can check uncertain extractions and correct every field before saving.",
        "ownership": "Product direction, interaction architecture, tax schemas, and frontend in Next.js, React, and Tailwind. Partner: Trinh Ngo, data science, extraction pipelines, and model evaluation.",
        "scopeHeader": { "role": "Co-Founder & Design Engineer", "scope": "2-person team (Design + Data Science)", "shipped": "Working private beta" },
        "accentColor": "#00E599",
        "logoUrl": "/logos/Papertrail_logo.svg",
        "projectUrl": "https://papertrail.finance",
        "thumbnail": "/projects/papertrail/pt-hero-thumb.png",
        "previewVideo": "/projects/papertrail/pt-hero.mp4",
        "stageBackground": "linear-gradient(180deg, #35BFA3 0%, #2DB79A 50%, #23AE92 100%)",
        "gallery": [
            {
                "url": "/projects/papertrail/pt-hero.mp4",
                "type": "video",
                "poster": "/projects/papertrail/pt-hero-thumb.png",
                "caption": "End to end mobile receipt capture and review loop shipped in React, Next.js, and TypeScript."
            },
            {
                "url": "/projects/papertrail/receipt-review-example.png",
                "type": "image",
                "nativeWidth": 2287,
                "aspectRatio": 1.466,
                "caption": "Matched Whole Foods receipt and editable review form. The date field shows a validation cue; the amber confidence cue appears in the separate review clip.",
                "annotations": ["1. Date needs attention", "2. Compare the receipt", "3. Correct before saving"]
            },
            {
                "url": "/projects/papertrail/pt-03.mp4",
                "type": "video",
                "thumb": "/projects/papertrail/pt-03-thumb.png",
                "poster": "/projects/papertrail/pt-03-thumb.png",
                "caption": "A separate review clip: an amber date cue draws attention to an uncertain field, and the owner selects a date.",
                "annotations": ["1. Notice the amber cue", "2. Review the date", "3. Select a date"]
            },
            {
                "url": "/projects/papertrail/pt-01.png",
                "type": "image",
                "thumb": "/projects/papertrail/pt-01-thumb.png",
                "caption": "Desktop expense dashboard with property summaries and tax readiness indicators."
            },
            {
                "url": "/projects/papertrail/pt-02.mp4",
                "type": "video",
                "thumb": "/projects/papertrail/pt-02-thumb.png",
                "caption": "Expense filtering and tax year context chips informed by testing with 8 property operators."
            }
        ],
        "challenge": "Property owners managing paper receipts need to trust the record without trusting every model prediction. Incorrect extraction or categorization can create costly cleanup at tax time. We considered coordinate based source highlighting, but its added model cost was too high for the early product. We kept the receipt beside editable fields instead.",
        "architecture": "I led product strategy and responsive UX, shipping production UI in React, Next.js, TypeScript, and Tailwind CSS. Confidence review rule: fields below 85% confidence receive an amber cue, while every field stays editable. We chose side by side receipt inspection after deferring source highlighting because of model cost, and started with single receipt review before exploring batch processing.",
        "impact": [
            {
                "metric": "Working Private Beta · 8 Operators",
                "detail": "Early usability testing with 8 property operators and short term rental hosts informed the single receipt review flow and a direction for batch review. Batch processing remains on the roadmap.",
                "provenance": "Early participants included friends and family."
            },
            {
                "metric": "20+ Waitlist Signups",
                "detail": "Collected in person at Georgia Tech Create X Demo Day.",
                "provenance": "Waitlist signups, not active users."
            }
        ],
        "cardProof": "85% Confidence Rule · n=8 Operator Research · Georgia Tech Create X"
    },
    {
        "id": "stellar-cyber",
        "title": "Stellar Cyber | AI Investigation Notebook",
        "role": "Product Designer, AI & Security Lead",
        "timeline": "Jan 2023 to July 2025 (Series B to Series C growth)",
        "cardSummary": "Interactive consensus prototyping and inspectable natural language query workflows on a platform serving 2,800 weekly active technical users.",
        "summary": "Turned analyst questions into inspectable, editable queries while keeping investigation context in one workspace.",
        "ownership": "Product design and AI security interactions for Investigator and Query Studio. Partners: product management and backend engineering.",
        "scopeHeader": { "role": "Product Designer, AI & Security Lead", "scope": "Embedded with Eng & CE", "shipped": "Enterprise production (~2,800 platform WAU)" },
        "accentColor": "#FF5500",
        "logoUrl": "/logos/Stellar_logo.svg",
        "projectUrl": "https://stellarcyber.ai/ai-investigator-natural-language-threat-hunting/",
        "thumbnail": "/projects/stellar-cyber/ai-hero-thumb.png",
        "previewVideo": "/projects/stellar-cyber/ai-hero.mp4",
        "gallery": [
            {
                "url": "/projects/stellar-cyber/ai-hero.mp4",
                "type": "video",
                "poster": "/projects/stellar-cyber/ai-hero-thumb.png",
                "caption": "Natural language threat hunting translating analyst intent into inspectable backend queries."
            },
            {
                "url": "/projects/stellar-cyber/query-studio-detail.png",
                "type": "image",
                "nativeWidth": 1702,
                "aspectRatio": 3.3438,
                "caption": "Query Studio iteration: natural language prompt and generated Elasticsearch syntax. The editable query interaction is shown in the Investigator demo.",
                "annotations": ["1. Natural language prompt", "2. Generated syntax for inspection"]
            },
            {
                "url": "/projects/stellar-cyber/investigator-query-detail.png",
                "type": "image",
                "nativeWidth": 2246,
                "aspectRatio": 3,
                "imagePosition": "50% 0%",
                "imageScale": 1.5,
                "caption": "Later AI Investigator demo: the analyst's question, generated query, and inline edit control remain visible in the investigation.",
                "annotations": ["1. Analyst question", "2. Generated query", "3. Inline edit control"]
            },
            {
                "url": "/projects/stellar-cyber/ai-01.png",
                "type": "image",
                "thumb": "/projects/stellar-cyber/ai-01-thumb.png",
                "caption": "Persistent investigation notebook showing queries, results, and investigation context in one workspace."
            },
            {
                "url": "/projects/stellar-cyber/ai-02.mp4",
                "type": "video",
                "thumb": "/projects/stellar-cyber/ai-02-thumb.png",
                "caption": "Inspectable query translation with progressive CVE details on demand."
            },
            {
                "url": "/projects/stellar-cyber/ai-03.png",
                "type": "image",
                "thumb": "/projects/stellar-cyber/ai-03-thumb.png",
                "caption": "Time range scoping controls in Query Studio. Historical searches also informed the separate cold storage workflow."
            }
        ],
        "challenge": "Analysts needed to investigate across disconnected tools while translating questions into complex query syntax. A later June 2025 Mixpanel snapshot provides platform context: 1,110 weekly active threat hunters and 18 standalone query builder pageviews in the same week. These are different measures, and the snapshot followed the original prototype.",
        "architecture": "Engineering raised concerns about model latency, translation accuracy, and backend limits. I built an interactive prototype in code and Figma showing inspectable, editable query syntax. It helped align product and engineering around persistent query blocks in the investigation workflow. We kept results and follow up context together, with progressive CVE disclosure for deeper investigation.",
        "workflow": [
            { "title": "Natural language prompt", "detail": "An analyst asks a question in plain English." },
            { "title": "Generated syntax", "detail": "The system produces inspectable Elasticsearch or Lucene query syntax." },
            { "title": "Inspect and refine", "detail": "The analyst can adjust the syntax or change date and field ranges before running the query." },
            { "title": "Execute the query", "detail": "The query runs against platform telemetry with its logic visible to the analyst." },
            { "title": "Explore results", "detail": "High severity alerts surface first, with raw log payloads available on demand." }
        ],
        "relatedWork": {
            "title": "Related Work: Cold-Storage Telemetry Escalation",
            "detail": "For a separate customer retention effort, I designed asynchronous query states, execution estimates, and progress indicators. Backend engineering delivered execution and Customer Engineering handled the escalation; together, the work contributed to preserving a $150K annual renewal."
        },
        "impact": [
            {
                "metric": "2,800 WAU",
                "detail": "Led AI and investigation UX on the core platform during Series B to Series C growth.",
                "provenance": "Source: Mixpanel platform telemetry, June 2 to June 8, 2025."
            },
            {
                "metric": "1,110 Active Hunters vs. 18 Query Pageviews",
                "detail": "In June 2025, Mixpanel reported 1,110 weekly active threat hunters and 18 standalone query builder pageviews in the same week. This later platform snapshot provides context; it did not trigger the earlier prototype.",
                "provenance": "Source: Mixpanel, June 2 to June 8, 2025. Weekly active users and pageviews are different measures."
            }
        ],
        "cardProof": "2,800 platform WAU · Inspectable AI queries · Cold-storage UX contributed to $150K renewal"
    },
    {
        "id": "amazon",
        "title": "Amazon Books | Series Customization & Mobile Growth",
        "role": "UX Designer (Contract)",
        "timeline": "July 2022 to Oct 2022",
        "cardSummary": "Product detail page bulk purchase and inline edition swap flows shipped globally on Amazon Mobile.",
        "summary": "Kept edition swaps inside the series purchase flow, with immediate confirmation and updated bundle pricing.",
        "ownership": "UX Designer (Contract), owning the Buy Next in Series widget and Edition Swap flow. Partner: Books Studio product manager.",
        "scopeHeader": { "role": "UX Designer (Contract)", "scope": "Amazon Mobile Books team", "shipped": "Shipped 4-step flow on Amazon Mobile" },
        "accentColor": "#00C805",
        "logoUrl": "/logos/Amazon_logo.svg",
        "projectUrl": "https://www.amazon.com/b?ie=UTF8&node=13633915011",
        "thumbnail": "/projects/amazon/amazon-hero.png",
        "gallery": [
            {
                "url": "/projects/amazon/amazon-hero.png",
                "type": "image",
                "caption": "FIG 01 · Four step inline series customization flow on the Amazon Mobile Product Detail Page."
            },
            {
                "url": "/projects/amazon/amzn-01.png",
                "type": "image",
                "aspectRatio": 1.003440366972477,
                "caption": "FIG 02 · Edition comparison and substitution confirmation. Research showed collectors wanted to choose substitutions themselves.",
                "annotations": ["1. Compare available editions", "2. Choose a replacement", "3. Confirm the updated bundle"]
            },
            {
                "url": "/projects/amazon/amzn-02.png",
                "type": "image",
                "aspectRatio": 1.02,
                "caption": "FIG 03 · Source comparison: Japan manga selection baseline beside the US print edition exploration."
            },
            {
                "url": "/projects/amazon/amzn-03.png",
                "type": "image",
                "aspectRatio": 2.1652173913043478,
                "caption": "FIG 04 · Original research artifact: an unmoderated usability study with 20 participants and the Indiscriminate to Collector persona spectrum."
            },
            {
                "url": "/projects/amazon/amzn-research-insights.png",
                "type": "image",
                "aspectRatio": 1.7186379928315412,
                "caption": "FIG 05 · Original research findings: matching sets, price perception, and customer opposition to automatic substitutions."
            },
            {
                "url": "/projects/amazon/amzn-iteration.png",
                "type": "image",
                "aspectRatio": 1.8568773234200744,
                "caption": "FIG 06 · Original annotated exploration: inline swap, format comparison, and confirmation. Labeled future proposal in the source."
            }
        ],
        "challenge": "The Japan manga baseline emphasized selecting uniform volumes. Research with 20 readers showed why print editions needed more control: customers cared about matching covers and formats, availability, and price. The research identified Indiscriminate and Collector personas, with most participants leaning toward collecting. Customers did not want automatic substitutions when a volume was unavailable.",
        "architecture": "I designed a four step inline customization flow on the mobile Product Detail Page: enable Customize editions, choose Swap on a volume, compare formats and publisher metadata in a bottom sheet, then confirm the substitution with immediate feedback and an updated bundle price. The four step Buy Next in Series flow shipped on Amazon Mobile; the gallery also labels a separate future concept exploration from the original documentation.",
        "impact": [
            {
                "metric": "Global Amazon Mobile Rollout",
                "detail": "Validated through multivariate experimentation and Amazon design review before the global mobile rollout.",
                "provenance": "Rollout confirmation: former project PM. Design flow and research: original project Figma documentation."
            },
            {
                "metric": "20 Participant Usability Study",
                "detail": "Research on matching editions, availability, and price informed customer controlled substitutions and richer format comparison.",
                "provenance": "Source: original Bulk series purchasing research findings artifact, 2022."
            }
        ],
        "cardProof": "n=20 User Study · Shipped Globally on Amazon Mobile (iOS & Android)"
    },
    {
        "id": "cisco",
        "title": "Cisco | CAFY & CQE Infrastructure Observability",
        "role": "Product Designer, Mass Infrastructure Group",
        "timeline": "Dec 2017 to Feb 2022",
        "cardSummary": "Test orchestration, Smart Debug diagnostics, and developer tooling for 500+ engineers.",
        "summary": "Unified five fragmented internal test tools into the CAFY and CQE developer ecosystem for 500+ engineers, contributing to a reduction in router certification time from six months to two weeks.",
        "ownership": "Product design for systems and automation, embedded in frontend engineering and governing the design system across five testing tools.",
        "scopeHeader": { "role": "Product Designer, Mass Infrastructure Group", "scope": "500+ Platform Engineers", "shipped": "Internal CQE production platform" },
        "accentColor": "#0055FF",
        "logoUrl": "/logos/Cisco_logo.svg",
        "projectUrl": "https://youtu.be/V1cqrAJ-KXE?si=vqGmNxrnwOwwA664",
        "thumbnail": "/projects/cisco/csc-ml-diagnosis.png",
        "gallery": [
            {
                "url": "/projects/cisco/csc-ml-diagnosis.png",
                "type": "image",
                "nativeWidth": 1139,
                "aspectRatio": 1.7523076923076923,
                "caption": "FIG 01 · CQE Run Monitor: model predictions for script issues, defect links, and failure summaries. Cisco Live 2020 demo, 44:15."
            },
            {
                "url": "/projects/cisco/csc-smart-build.png",
                "type": "image",
                "nativeWidth": 1139,
                "aspectRatio": 1.8550488599348534,
                "caption": "FIG 02 · Smart Build configuration analysis: this example shows 24 packages, 500 test cases, 69.25% coverage, and estimated runtime. Configuration text redacted for publication. Cisco Live 2020 demo, 37:30."
            },
            {
                "url": "/projects/cisco/csc-correlated-logs.png",
                "type": "image",
                "nativeWidth": 1139,
                "aspectRatio": 1.7523076923076923,
                "caption": "FIG 03 · Smart Debug: execution logs and device syslogs aligned by timestamp for comparison. Cisco Live 2020 demo, 41:35."
            },
            {
                "url": "/projects/cisco/csc-scale-metrics.png",
                "type": "image",
                "nativeWidth": 1224,
                "aspectRatio": 11.127272727272727,
                "caption": "FIG 04 · Public CQE scale slide: 10,000+ test cases, 35+ packages, 6 platforms, 500+ daily test runs, and 500+ active engineers. Cisco Live 2020."
            },
            {
                "url": "/images/cisco-hero.png",
                "type": "image",
                "nativeWidth": 1920,
                "caption": "FIG 05 · Internal CAFY developer portal: onboarding microsite and visual explorations for framework adoption."
            }
        ],
        "challenge": "The task: An infrastructure engineer investigates a failed router build across a library of 10,000+ automated test cases. The friction: Disconnected stack traces and CLI logs made it difficult to distinguish a test script bug, harness failure, or hardware regression.",
        "architecture": "The decision: Partnering with infrastructure engineers, I designed Smart Debug to bring timestamp correlated execution and device logs together with model failure predictions and readable diagnostic summaries. The tradeoff: Surface failure patterns first, while keeping detailed CLI diagnostics available for deeper investigation. I also illustrated and animated the CQE launch video, voiced by Gus Woythaler.",
        "impact": [
            {
                "metric": "6 Months → 2 Weeks",
                "detail": "Reported team outcome: contributed to reducing router certification from six months to two weeks through unified orchestration and test automation for a platform supporting 500+ active engineers.",
                "provenance": "Reported project outcome from internal work; the public demo illustrates the supporting workflows."
            },
            {
                "metric": "500+ Active Engineers",
                "detail": "Public CQE scale included 10,000+ test cases, 35+ automation packages, and 500+ daily active test runs across six IOS XR platforms.",
                "provenance": "Source: Cisco DevNet, CQE at Cisco Live, 2020, scale slide at 9:50."
            }
        ],
        "cardProof": "500+ Active Engineers · 10,000+ Test Cases · 6 Mo → 2 Wk Qualification"
    }
];
