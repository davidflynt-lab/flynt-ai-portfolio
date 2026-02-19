export interface Project {
    id: string;
    title: string;
    badge: string;
    description: string;
    logoUrl?: string;
    projectUrl?: string;
    thumbnail?: string; // For the card preview
    previewVideo: string; // For the card hover
    heroMedia?: string; // Keep for backward compat or fallback
    heroType?: "video" | "image";
    gallery: Array<{
        url: string;
        type: "video" | "image";
        caption?: string;
        thumb?: string; // Optional custom thumbnail for the button
        poster?: string; // Video poster
    }>;
    logline: string;
    narrativeLabel: string;
    narrative: string;
    impactLabel: string;
    impact: string[];
    // caption: string; // Moved to gallery items
    customSections?: Array<{
        title: string; // The section title, e.g. "The Technical Logic (Systems View)"
        content: Array<{ heading: string; body: string }>;
    }>;
}

export const projects: Project[] = [
    {
        id: "papertrail",
        title: "PaperTrail",
        badge: "Lead Designer, AI Fintech",
        description: "AI POWERED EXPENSE AUTOMATION • 99.2% OCR ACCURACY",
        logoUrl: "/logos/Papertrail_logo.svg",
        projectUrl: "https://papertrail.finance",
        thumbnail: "/projects/papertrail/pt-hero-thumb.png",
        previewVideo: "/projects/papertrail/pt-hero.mp4",
        gallery: [
            {
                url: "/projects/papertrail/pt-hero.mp4",
                type: "video",
                poster: "/projects/papertrail/pt-hero-thumb.png",
                caption: "SIDE BY SIDE VERIFICATION UI FOR LOW CONFIDENCE DATA PARSING"
            },
            {
                url: "/projects/papertrail/pt-01.png",
                type: "image",
                thumb: "/projects/papertrail/pt-01-thumb.png",
                caption: "Financial Intelligence: Tax-ready dashboard with 99.2% extraction accuracy."
            },
            {
                url: "/projects/papertrail/pt-02.mp4",
                type: "video",
                thumb: "/projects/papertrail/pt-02-thumb.png",
                caption: "Human-to-SQL Translation: Turning search intent into precise financial queries."
            },
            {
                url: "/projects/papertrail/pt-03.mp4",
                type: "video",
                thumb: "/projects/papertrail/pt-03-thumb.png",
                caption: "The Trust Layer: Surfacing AI uncertainty with pulsing audit states."
            }
        ],
        heroMedia: "/projects/papertrail/pt-hero.mp4",
        heroType: "video",
        logline: "AI Driven Financial Document Intelligence",
        narrativeLabel: "The AI Narrative",
        narrative: "Landlords don't have a data entry problem; they have a trust problem. They need to know the data is accurate without reviewing every single receipt. I structured the Trust Architecture for agentic data validation. By implementing confidence threshold interruption, we created a side by side verification workflow that only engages the user when the model is uncertain, turning a black box process into a glass box experience. This shifted the paradigm from manual entry to exception handling, resulting in a 4 second verification loop.",
        impactLabel: "Technical Impact",
        impact: [
            "91% reduction in manual entry (45s to 4s)",
            "100% Beta retention and 99%+ extraction accuracy"
        ],
        customSections: [
            {
                title: "The Technical Logic (Systems View)",
                content: [
                    {
                        heading: "Explainability",
                        body: "We surfaced the model's confidence score directly on the field level, color coded for instant scanning. This transparency built trust, allowing users to rely on the system's high confidence assertions."
                    },
                    {
                        heading: "Optimistic UI",
                        body: "The interface assumes success, pre filling high confidence data and only flagging anomalies. This approach maintains flow while ensuring data integrity where it matters most."
                    },
                    {
                        heading: "Data Integrity",
                        body: "Original receipt images are always preserved alongside the extracted data for auditability. This dual record system ensures that the source of truth is never lost, even in the event of model hallucination."
                    }
                ]
            }
        ]
    },
    {
        id: "stellar-cyber",
        title: "AI Investigator",
        badge: "Product Designer, Lead AI SecOps",
        description: "AGENTIC THREAT INVESTIGATION • 40% FASTER MTTR",
        logoUrl: "/logos/Stellar_logo.svg",
        projectUrl: "https://stellarcyber.ai/ai-investigator-natural-language-threat-hunting/",
        thumbnail: "/projects/stellar-cyber/ai-hero-thumb.png",
        previewVideo: "/projects/stellar-cyber/ai-hero.mp4",
        gallery: [
            {
                url: "/projects/stellar-cyber/ai-hero.mp4",
                type: "video",
                poster: "/projects/stellar-cyber/ai-hero-thumb.png",
                caption: "VISUALIZING THE AI REASONING CHAIN DURING ACTIVE THREAT TRIAGE"
            },
            {
                url: "/projects/stellar-cyber/ai-01.png",
                type: "image",
                thumb: "/projects/stellar-cyber/ai-01-thumb.png",
                caption: "Persistent Investigations: A structured workspace for saving and sharing hunts."
            },
            {
                url: "/projects/stellar-cyber/ai-02.mp4",
                type: "video",
                thumb: "/projects/stellar-cyber/ai-02-thumb.png",
                caption: "The Translation Logic: Mapping natural language to ElasticSearch with contextual popovers."
            },
            {
                url: "/projects/stellar-cyber/ai-03.png",
                type: "image",
                thumb: "/projects/stellar-cyber/ai-03-thumb.png",
                caption: "Anticipatory Design: Intent-based suggestions to reduce cognitive load."
            }
        ],
        heroMedia: "/projects/stellar-cyber/ai-hero.mp4",
        heroType: "video",
        logline: "AI Investigator & Open XDR Platform",
        narrativeLabel: "The AI Narrative",
        narrative: "Security analysts are drowning in logs, creating a noise floor that hides critical threats. I focused on Agentic AI for Autonomous Threat Investigation. The interface visualizes the Chain of Thought reasoning during active triage, allowing analysts to audit the system logic trace without slowing down the remediation loop. By correlating disparate signal sources into a coherent narrative, we established a single timeline of truth.",
        impactLabel: "Technical Impact",
        impact: [
            "40% reduction in Mean Time to Respond (MTTR)",
            "Scaled platform from Series B to industry leading Open XDR provider"
        ],
        customSections: [
            {
                title: "The Alignment Narration (The Conflict)",
                content: [
                    {
                        heading: "The Conflict",
                        body: "Engineers wanted to show every raw log. Analysts needed a story. There was a fundamental tension between data completeness and cognitive load."
                    },
                    {
                        heading: "The Influence",
                        body: "I drove a distinct shift towards narrative driven interfaces, prioritizing the 'why' over the 'what'. This required close collaboration with engineering to restructure how backend signals were aggregated."
                    },
                    {
                        heading: "The Resolution",
                        body: "We established a progressive disclosure pattern that presented the AI's conclusion first, with deep dive evidence available on demand. This became the standard for our 'AI Investigator' persona."
                    },
                    {
                        heading: "The Notebook Architecture",
                        body: "We introduced a 'Notebook' interface that allowed analysts to fork the AI's investigation. This pivotal feature transformed the system from a black box oracle into a collaborative workspace, enabling human experts to validate, correct, and extend the AI's reasoning without breaking the chain of custody."
                    }
                ]
            }
        ]
    },
    {
        id: "amazon-books",
        title: "Amazon Books",
        badge: "UX Designer, Growth",
        description: "Zero friction impulse buy · millions of users",
        logoUrl: "/logos/Amazon_logo.svg",
        projectUrl: "https://www.amazon.com/b?ie=UTF8&node=13633915011",
        previewVideo: "",
        gallery: [
            {
                url: "/images/amazon-hero.png",
                type: "image",
                caption: "ZERO FRICTION IMPULSE BUY FLOW AT CONSUMER SCALE"
            },
            {
                url: "/images/amazon-hero.png",
                type: "image",
                caption: "ZERO FRICTION IMPULSE BUY FLOW AT CONSUMER SCALE"
            },
            {
                url: "/images/amazon-hero.png",
                type: "image",
                caption: "ZERO FRICTION IMPULSE BUY FLOW AT CONSUMER SCALE"
            }
        ],
        heroMedia: "/images/amazon-hero.png",
        heroType: "image",
        logline: "Bridging the physical and digital retail gap for the world largest bookstore.",
        narrativeLabel: "The Design Narrative",
        narrative: "Designed a zero friction impulse buy mechanism for millions of users. The challenge was integrating robust commerce flows into a legacy codebase while maintaining the trust and stability required for high velocity transactions at consumer scale.",
        impactLabel: "Outcome",
        impact: [
            "Launched a mobile widget for millions of users where a 1% change in placement drove significant revenue growth."
        ],
    },
    {
        id: "cisco-ml-tools",
        title: "Cisco",
        badge: "Lead Product Designer, AI/ML NetOps",
        description: "ML driven observability · months to days",
        logoUrl: "/logos/Cisco_logo.svg",
        projectUrl: "https://youtu.be/V1cqrAJ-KXE?si=vqGmNxrnwOwwA664",
        previewVideo: "",
        gallery: [
            {
                url: "/images/cisco-hero.png",
                type: "image",
                caption: "ML DRIVEN OBSERVABILITY DASHBOARD FOR SYSTEM ANOMALIES"
            },
            {
                url: "/images/cisco-hero.png",
                type: "image",
                caption: "ML DRIVEN OBSERVABILITY DASHBOARD FOR SYSTEM ANOMALIES"
            },
            {
                url: "/images/cisco-hero.png",
                type: "image",
                caption: "ML DRIVEN OBSERVABILITY DASHBOARD FOR SYSTEM ANOMALIES"
            }
        ],
        heroMedia: "/images/cisco-hero.png",
        heroType: "image",
        logline: "Modernizing legacy network infrastructure with ML driven observability and automation.",
        narrativeLabel: "The Design Narrative",
        narrative: "Modernized legacy network infrastructure through ML driven observability. I applied systems engineering principles to convert raw data into actionable insights, reducing the noise ratio for engineers debugging critical system failures.",
        impactLabel: "Outcome",
        impact: [
            "Standardized test automation workflows across global engineering teams and drastically reduced root cause identification time."
        ],
    }
];
