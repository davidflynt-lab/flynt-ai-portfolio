"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";

const EMAIL = "davidflynt@gmail.com";

const LABEL_FADE = {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
    transition: { duration: 0.15 },
};

/** Expandable "Contact me" pill: reveals the email on hover or focus and copies it on click. */
const ContactButton = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = EMAIL;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        setIsCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsCopied(false);
            setIsExpanded(false);
        }, 1500);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const collapse = () => {
        if (!isCopied) setIsExpanded(false);
    };

    return (
        <motion.button
            layout
            type="button"
            onClick={handleClick}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={collapse}
            onFocus={() => setIsExpanded(true)}
            onBlur={collapse}
            aria-label={`Copy email address ${EMAIL}`}
            className="flex h-8 w-auto cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-surface px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
            transition={{ layout: { type: "spring", stiffness: 500, damping: 36 } }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {isCopied ? (
                    <motion.span key="copied" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400" {...LABEL_FADE}>
                        <Check className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-medium">Email copied</span>
                    </motion.span>
                ) : isExpanded ? (
                    <motion.span key="email" className="flex items-center gap-2 text-foreground" {...LABEL_FADE}>
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-medium">{EMAIL}</span>
                    </motion.span>
                ) : (
                    <motion.span key="default" className="flex items-center gap-2 text-muted-foreground" {...LABEL_FADE}>
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-medium">Contact me</span>
                    </motion.span>
                )}
            </AnimatePresence>
            <span className="sr-only" aria-live="polite">
                {isCopied ? "Email copied to clipboard" : ""}
            </span>
        </motion.button>
    );
};

export default ContactButton;
