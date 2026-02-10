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
        narrative: "I led the transition from manual data entry to agentic data validation. We used multimodal LLMs to parse complex receipts but the real design challenge was the Trust UI. I designed a side by side verification system that only interrupts the user when the AI confidence score drops below a specific threshold.",
        impactLabel: "Technical Impact",
        impact: "Reduced manual entry from 45s to 4s. Achieved 100% beta retention by ensuring the AI felt like a partner rather than a black box that made invisible mistakes."
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
        narrative: "Security analysts suffer from alert fatigue. My goal was to visualize the AI Chain of Thought. I designed an interface that reveals why the AI is investigating a specific threat allowing analysts to calibrate their trust in the autonomous decisions of the system.",
        impactLabel: "Technical Impact",
        impact: "Reduced MTTR by 40% and enabled junior analysts to execute complex forensic workflows previously reserved for senior staff."
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
        narrative: "Designed a zero friction impulse buy mechanism that integrates into a massive established design system. We focused on micro interactions that mimic the physical act of picking up a book using a tap to cart animation.",
        impactLabel: "Outcome",
        impact: "Launched a mobile widget for millions of users where a 1% change in placement drove significant revenue growth."
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
        narrative: "Network engineers spend most of their time debugging logs. I designed SmartDebug to highlight anomalies and convert raw JSON logs into a human readable timeline. We focused on Exception UI to handle system failures gracefully.",
        impactLabel: "Outcome",
        impact: "Standardized test automation workflows across global engineering teams and drastically reduced root cause identification time."
    }
];
