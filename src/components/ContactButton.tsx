"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";

const EMAIL = "davidflynt@gmail.com";

const ContactButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
        } catch {
            // Fallback for older browsers
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

        // Clear any existing timer
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    }, []);

    return (
        <motion.button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                if (!isCopied) setIsHovered(false);
            }}
            className="relative flex items-center gap-2 rounded-full cursor-pointer overflow-hidden"
            style={{
                border: "1px solid rgba(243, 236, 220, 0.25)",
                backgroundColor: "rgba(243, 236, 220, 0.06)",
                padding: "6px 14px",
            }}
            animate={{
                width: isCopied ? 140 : isHovered ? 260 : 120,
            }}
            transition={{
                width: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
        >
            <AnimatePresence mode="wait">
                {isCopied ? (
                    <motion.div
                        key="copied"
                        className="flex items-center gap-2 whitespace-nowrap"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Check
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "#4ade80" }}
                        />
                        <span
                            className="text-xs font-medium"
                            style={{ color: "#4ade80" }}
                        >
                            Email copied!
                        </span>
                    </motion.div>
                ) : isHovered ? (
                    <motion.div
                        key="email"
                        className="flex items-center gap-2 whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Copy
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "#F3ECDC" }}
                        />
                        <span
                            className="text-xs font-medium"
                            style={{ color: "#F3ECDC" }}
                        >
                            {EMAIL}
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="default"
                        className="flex items-center gap-2 whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Mail
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "rgba(243, 236, 220, 0.7)" }}
                        />
                        <span
                            className="text-xs font-medium"
                            style={{ color: "rgba(243, 236, 220, 0.7)" }}
                        >
                            Contact me
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ContactButton;
