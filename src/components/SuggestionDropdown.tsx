import { motion } from "framer-motion";
import { User, Code, Rocket } from "lucide-react";

const suggestions = [
    {
        icon: User,
        prefix: "David Flynt",
        highlight: "Lead Product Designer (Staff Level)",
    },
    {
        icon: Code,
        prefix: "David Flynt",
        highlight: "AI Prototyper (React/Vibe Code)",
    },
    {
        icon: Rocket,
        prefix: "David Flynt",
        highlight: "Founder of PaperTrail",
    },
];

const SuggestionDropdown = () => {
    return (
        <motion.div
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {suggestions.map((suggestion, index) => (
                <motion.div
                    key={index}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                >
                    <suggestion.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{suggestion.prefix}</span>
                    <span className="text-foreground font-medium text-sm">{suggestion.highlight}</span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default SuggestionDropdown;
