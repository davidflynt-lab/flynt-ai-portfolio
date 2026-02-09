import { useState, useEffect, useCallback, useRef } from "react";
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
    const hasCompletedOnce = useRef(false);

    const fullText = "Who is David Flynt?";
    const placeholderText = "Ask Flynt.AI about David...";

    const startTypingAnimation = useCallback(() => {
        let currentIndex = 0;
        const typingDelay = 120; // Slower typing speed
        let suggestionsShown = false;

        setDisplayText("");
        setIsTyping(true);
        setShowSuggestions(false);

        const typeNextChar = () => {
            if (currentIndex < fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex + 1));
                currentIndex++;

                // Show suggestions after a few characters
                if (currentIndex > 5 && !suggestionsShown) {
                    setShowSuggestions(true);
                    suggestionsShown = true;
                }

                setTimeout(typeNextChar, typingDelay);
            } else {
                setIsTyping(false);
                // Pause for 2 seconds to let user read suggestions
                setTimeout(() => {
                    if (!hasCompletedOnce.current) {
                        hasCompletedOnce.current = true;
                        onComplete();
                    }
                    // After pause, restart the loop
                    setTimeout(() => {
                        startTypingAnimation();
                    }, 500);
                }, 2000);
            }
        };

        setTimeout(typeNextChar, 800);
    }, [onComplete]);

    useEffect(() => {
        startTypingAnimation();
    }, [startTypingAnimation]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            <motion.div
                className="glass-strong rounded-full px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Plus icon */}
                <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Input area */}
                <div className="flex-1 relative">
                    {displayText.length === 0 && (
                        <span className="text-muted-foreground text-sm">{placeholderText}</span>
                    )}
                    <span className="text-foreground text-sm">
                        {displayText}
                        {isTyping && (
                            <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-typing-cursor" />
                        )}
                    </span>
                </div>

                {/* Disabled arrow button */}
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center opacity-40 cursor-not-allowed">
                    <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </div>
            </motion.div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {showSuggestions && <SuggestionDropdown />}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
