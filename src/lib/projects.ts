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
    impact: string;
    caption: string;
}

export const projects: Project[] = [
    {
        id: "papertrail",
        title: "PaperTrail",
        badge: "Visionary and Lead Designer",
        description: "AI powered expense automation · 99.2% OCR accuracy",
        logoUrl: "/logos/Papertrail_logo.svg",
        thumbnail: "/videos/pt.mp4",
        previewVideo: "/videos/pt.mp4",
        heroMedia: "/videos/pt.mp4",
        heroType: "video",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Automating the admin tax for landlords with 99.2% OCR accuracy.",
        narrativeLabel: "The AI Narrative",
        narrative: "I structured the Trust Architecture for agentic data validation. By implementing confidence threshold interruption, we created a side by side verification workflow that only engages the user when the model is uncertain, turning a black box process into a glass box experience.",
        impactLabel: "Technical Impact",
        impact: "Reduced manual entry from 45s to 4s. Achieved 100% beta retention by ensuring the AI felt like a partner rather than a black box that made invisible mistakes.",
        caption: "SIDE BY SIDE VERIFICATION UI FOR LOW CONFIDENCE DATA PARSING"
    },
    {
        id: "stellar-cyber",
        title: "Stellar Cyber",
        badge: "Lead Designer",
        description: "Agentic threat investigation · 40% faster MTTR",
        logoUrl: "/logos/Stellar_logo.svg",
        previewVideo: "",
        heroMedia: "/images/stellar-hero.png",
        heroType: "image",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Orchestrating autonomous cybersecurity investigations through agentic UI.",
        narrativeLabel: "The AI Narrative",
        narrative: "Focused on Agentic AI for Autonomous Threat Investigation. The interface visualizes the Chain of Thought reasoning during active triage, allowing analysts to audit the system logic trace without slowing down the remediation loop.",
        impactLabel: "Technical Impact",
        impact: "Reduced MTTR by 40% and enabled junior analysts to execute complex forensic workflows previously reserved for senior staff.",
        caption: "VISUALIZING THE AI REASONING CHAIN DURING ACTIVE THREAT TRIAGE"
    },
    {
        id: "amazon-books",
        title: "Amazon Books",
        badge: "Lead Designer",
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
        impact: "Launched a mobile widget for millions of users where a 1% change in placement drove significant revenue growth.",
        caption: "ZERO FRICTION IMPULSE BUY FLOW AT CONSUMER SCALE"
    },
    {
        id: "cisco-ml-tools",
        title: "Cisco",
        badge: "Lead Designer",
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
        impact: "Standardized test automation workflows across global engineering teams and drastically reduced root cause identification time.",
        caption: "ML DRIVEN OBSERVABILITY DASHBOARD FOR SYSTEM ANOMALIES"
    }
];
