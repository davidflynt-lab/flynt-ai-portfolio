export interface Project {
    id: string;
    title: string;
    badge: string;
    description: string;
    logoUrl?: string;
    thumbnail?: string;
    previewVideo: string;
    heroMedia: string;
    heroType: "video" | "image";
    thumbnails: string[];
    logline: string;
    narrativeLabel: string;
    narrative: string;
    impactLabel: string;
    impact: string[];
    caption: string;
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
        thumbnail: "/videos/pt.mp4",
        previewVideo: "/videos/pt.mp4",
        heroMedia: "/videos/pt.mp4",
        heroType: "video",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "AI Driven Financial Document Intelligence",
        narrativeLabel: "The AI Narrative",
        narrative: "Landlords don't have a data entry problem; they have a trust problem. They need to know the data is accurate without reviewing every single receipt. I structured the Trust Architecture for agentic data validation. By implementing confidence threshold interruption, we created a side by side verification workflow that only engages the user when the model is uncertain, turning a black box process into a glass box experience. This shifted the paradigm from manual entry to exception handling, resulting in a 4 second verification loop.",
        impactLabel: "Technical Impact",
        impact: [
            "91% reduction in manual entry (45s to 4s)",
            "100% Beta retention and 99%+ extraction accuracy"
        ],
        caption: "SIDE BY SIDE VERIFICATION UI FOR LOW CONFIDENCE DATA PARSING",
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
        previewVideo: "",
        heroMedia: "/images/stellar-hero.png",
        heroType: "image",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "AI Investigator & Open XDR Platform",
        narrativeLabel: "The AI Narrative",
        narrative: "Security analysts are drowning in logs, creating a noise floor that hides critical threats. I focused on Agentic AI for Autonomous Threat Investigation. The interface visualizes the Chain of Thought reasoning during active triage, allowing analysts to audit the system logic trace without slowing down the remediation loop. By correlating disparate signal sources into a coherent narrative, we established a single timeline of truth.",
        impactLabel: "Technical Impact",
        impact: [
            "40% reduction in Mean Time to Respond (MTTR)",
            "Scaled platform from Series B to industry leading Open XDR provider"
        ],
        caption: "VISUALIZING THE AI REASONING CHAIN DURING ACTIVE THREAT TRIAGE",
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
        previewVideo: "",
        heroMedia: "/images/amazon-hero.png",
        heroType: "image",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Bridging the physical and digital retail gap for the world largest bookstore.",
        narrativeLabel: "The Design Narrative",
        narrative: "Designed a zero friction impulse buy mechanism for millions of users. The challenge was integrating robust commerce flows into a legacy codebase while maintaining the trust and stability required for high velocity transactions at consumer scale.",
        impactLabel: "Outcome",
        impact: [
            "Launched a mobile widget for millions of users where a 1% change in placement drove significant revenue growth."
        ],
        caption: "ZERO FRICTION IMPULSE BUY FLOW AT CONSUMER SCALE"
    },
    {
        id: "cisco-ml-tools",
        title: "Cisco",
        badge: "Lead Product Designer, AI/ML NetOps",
        description: "ML driven observability · months to days",
        logoUrl: "/logos/Cisco_logo.svg",
        previewVideo: "",
        heroMedia: "/images/cisco-hero.png",
        heroType: "image",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Modernizing legacy network infrastructure with ML driven observability and automation.",
        narrativeLabel: "The Design Narrative",
        narrative: "Modernized legacy network infrastructure through ML driven observability. I applied systems engineering principles to convert raw data into actionable insights, reducing the noise ratio for engineers debugging critical system failures.",
        impactLabel: "Outcome",
        impact: [
            "Standardized test automation workflows across global engineering teams and drastically reduced root cause identification time."
        ],
        caption: "ML DRIVEN OBSERVABILITY DASHBOARD FOR SYSTEM ANOMALIES"
    }
];
