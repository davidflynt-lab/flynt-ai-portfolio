export interface Project {
    id: string;
    title: string;
    badge: string;
    logoUrl?: string;
    heroVideo: string;
    thumbnails: string[];
    logline: string;
    narrative: string;
    impact: string;
}

export const projects: Project[] = [
    {
        id: "papertrail",
        title: "PaperTrail",
        badge: "Founder",
        logoUrl: "/logos/Papertrail_logo.svg",
        heroVideo: "/placeholder-video.mp4",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Founding Designer. Automating the \"Admin Tax\" for landlords with 99.2% OCR accuracy.",
        narrative: "PaperTrail reimagines expense tracking by leveraging multimodal LLMs to instantly parse receipts, categorize expenses, and detect anomalies. Instead of manual data entry, users simply capture and confirm, trusting the AI to handle the semantic understanding of complex financial documents.",
        impact: "Reduced average user session time from 45 seconds to 4 seconds per receipt. Achieved 99.2% accuracy in data extraction across 50+ diverse receipt formats."
    },
    {
        id: "stellar-cyber",
        title: "Stellar Cyber: AI Investigator",
        badge: "AI & Search",
        logoUrl: "/logos/Stellar_logo.svg",
        heroVideo: "/placeholder-video.mp4",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Lead AI Designer. Reducing threat investigation time (MTTI) by 70% via agentic co-pilots.",
        narrative: "The AI Investigator isn't just a black box; it's a transparent partner. By exposing the 'thought process' of the security agent—showing how it correlates alerts, verifies threats, and rules out false positives—we built a Trust Calibration interface that allows security analysts to verify the AI's logic without slowing down.",
        impact: "Increased analyst trust scores by 40% and reduced mean time to response (MTTR) for high-severity incidents by 65%. Successfully deployed to over 200 enterprise SOCs."
    },
    {
        id: "amazon-books",
        title: "Amazon Books",
        badge: "Scale",
        logoUrl: "/logos/Amazon_logo.svg",
        heroVideo: "/placeholder-video.mp4",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Senior Designer. Drove 22% conversion lift via cross-platform \"Buy Next\" series widgets.",
        narrative: "Focused on micro-interactions and frictionless tap-to-cart animations for millions of users. Proves scale and design system mastery.",
        impact: "Successfully launched a mobile widget that increased cross-platform conversion and revenue."
    },
    {
        id: "cisco-ml-tools",
        title: "Cisco: ML Tools",
        badge: "ML Tools",
        logoUrl: "/logos/Cisco_logo.svg",
        heroVideo: "/placeholder-video.mp4",
        thumbnails: ["/placeholder-thumb-1.jpg", "/placeholder-thumb-2.jpg", "/placeholder-thumb-3.jpg"],
        logline: "Product Designer. Slashed hardware certification cycles from months to days via ML-powered observability.",
        narrative: "Converting raw JSON logs into human-readable timelines. Focused on 'Exception UI'—designing for when automation fails.",
        impact: "Standardized test automation workflows, significantly reducing root-cause identification time."
    }
];
