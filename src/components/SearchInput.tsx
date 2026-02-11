"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUp } from "lucide-react";
import SuggestionDropdown from "./SuggestionDropdown";

interface SearchInputProps {
    onComplete: () => void;
}

const SearchInput = ({ onComplete }: SearchInputProps) => {
    const [displayText, setDisplayText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isTyping, setIsTyping] = useState(true);

    // Ref prevents the animation from re-triggering on every render
    const hasFinished = useRef(false);

    const fullText = "Ask about David’s work...";
    const placeholderText = "Ask about David’s work...";

    useEffect(() => {
        // If it already ran once, don't run it again
        if (hasFinished.current) return;

        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex + 1));
                currentIndex++;

                // Reveal suggestions mid-sentence for an "intelligent" feel
                if (currentIndex === 6) {
                    setShowSuggestions(true);
                }
            } else {
                // Stop the interval and lock the state
                clearInterval(typingInterval);
                setIsTyping(false);
                hasFinished.current = true;

                // Trigger the grid reveal after a slight beat
                setTimeout(() => {
                    onComplete();
                }, 800);
            }
        }, 80); // Snappy speed for a modern feel

        return () => clearInterval(typingInterval);
    }, [onComplete]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <motion.div
                className="glass-strong rounded-full px-4 py-3 flex items-center gap-3 glass-reflection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Fixed height container prevents the bar from "bouncing" */}
                <div className="flex-1 relative h-5 flex items-center overflow-hidden">
                    {displayText.length === 0 && (
                        <span className="text-muted-foreground text-sm absolute inset-0">{placeholderText}</span>
                    )}
                    <span className="text-foreground text-sm font-medium tracking-tight">
                        {displayText}
                        {isTyping && (
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block w-0.5 h-4 bg-aurora-cyan ml-1 align-middle"
                            />
                        )}
                    </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-40">
                    <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </div>
            </motion.div>

            <AnimatePresence>
                {showSuggestions && <SuggestionDropdown />}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
