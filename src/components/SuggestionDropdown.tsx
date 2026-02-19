import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Code, Rocket, Brain, Shield, Database } from "lucide-react";

interface Suggestion {
    icon: any;
    prefix: string;
    highlight: string;
    projectId: string;
    galleryIndex: number;
}

const suggestionsA: Suggestion[] = [
    {
        icon: User,
        prefix: "David Flynt",
        highlight: "Designs AI reducing MTTR by 40%",
        projectId: "stellar-cyber",
        galleryIndex: 0
    },
    {
        icon: Shield,
        prefix: "David Flynt",
        highlight: "Builds trust for non-deterministic AI",
        projectId: "papertrail",
        galleryIndex: 3
    },
    {
        icon: Brain,
        prefix: "David Flynt",
        highlight: "Expert in explainable AI interfaces",
        projectId: "stellar-cyber",
        galleryIndex: 2
    },
];

const suggestionsB: Suggestion[] = [
    {
        icon: Database,
        prefix: "David Flynt",
        highlight: "Tax-ready dashboard with 99.2% accuracy",
        projectId: "papertrail",
        galleryIndex: 1
    },
    {
        icon: Rocket,
        prefix: "David Flynt",
        highlight: "Intent-based suggestions to reduce load",
        projectId: "stellar-cyber",
        galleryIndex: 3
    },
    {
        icon: Code,
        prefix: "David Flynt",
        highlight: "Turning search intent into SQL",
        projectId: "papertrail",
        galleryIndex: 2
    },
];

interface SuggestionDropdownProps {
    onSuggestionClick: (projectId: string, galleryIndex: number) => void;
}

const SuggestionDropdown = ({ onSuggestionClick }: SuggestionDropdownProps) => {
    const [currentSet, setCurrentSet] = useState<"A" | "B">("A");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSet((prev) => (prev === "A" ? "B" : "A"));
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const activeSuggestions = currentSet === "A" ? suggestionsA : suggestionsB;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="glass rounded-xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-black/40">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSet}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeSuggestions.map((suggestion, index) => (
                            <motion.div
                                key={`${currentSet}-${index}`}
                                className="px-4 py-3 flex items-center gap-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0 group"
                                onClick={() => onSuggestionClick(suggestion.projectId, suggestion.galleryIndex)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.4, ease: "easeOut" }}
                            >
                                <suggestion.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#F3ECDC] transition-colors" />
                                <span className="text-muted-foreground text-sm">{suggestion.prefix}</span>
                                <span className="text-foreground font-medium text-sm text-[#F3ECDC]">{suggestion.highlight}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SuggestionDropdown;
