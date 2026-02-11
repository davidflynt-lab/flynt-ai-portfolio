"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Project } from "@/lib/projects";
import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const MAX_LOOPS = 3;

// Section IDs for synced scrolling
const SECTION_IDS = ["logline", "narrative", "impact"];

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    const [activeThumbnail, setActiveThumbnail] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const loopCountRef = useRef(0);
    const [isPaused, setIsPaused] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setActiveThumbnail(0);
            loopCountRef.current = 0;
            setIsPaused(false);
        }
    }, [isOpen]);

    // Handle video ended — loop exactly MAX_LOOPS times then pause on final frame
    const handleVideoEnded = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        loopCountRef.current += 1;
        if (loopCountRef.current < MAX_LOOPS) {
            video.currentTime = 0;
            video.play().catch(() => { });
        } else {
            video.pause();
            setIsPaused(true);
        }
    }, []);

    // Attach ended listener
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener("ended", handleVideoEnded);
        return () => video.removeEventListener("ended", handleVideoEnded);
    }, [handleVideoEnded]);

    // Click to toggle play/pause on the entire video area
    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            if (isPaused) {
                loopCountRef.current = 0;
                setIsPaused(false);
                video.currentTime = 0;
            }
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    };

    // Handle thumbnail click with synced scrolling
    const handleThumbnailClick = (idx: number) => {
        setActiveThumbnail(idx);

        const sectionId = SECTION_IDS[idx];
        if (sectionId && sidebarRef.current) {
            const targetElement = sidebarRef.current.querySelector(
                `#section-${sectionId}`
            );
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    };

    if (!project) return null;

    const isVideo = project.heroType === "video";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {/* Modal Content */}
                        <div
                            className="bg-card w-full max-w-6xl h-full max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
                            style={{
                                border: "1px solid rgba(243, 236, 220, 0.12)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    color: "rgba(243, 236, 220, 0.7)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0, 0, 0, 0.7)";
                                    e.currentTarget.style.color =
                                        "rgba(243, 236, 220, 1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0, 0, 0, 0.5)";
                                    e.currentTarget.style.color =
                                        "rgba(243, 236, 220, 0.7)";
                                }}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Column: Media */}
                            <div className="w-full md:w-2/3 bg-black relative flex flex-col">
                                {/* Main Media Area */}
                                <div
                                    className="flex-1 relative bg-neutral-900 cursor-pointer"
                                    onClick={isVideo ? handleVideoClick : undefined}
                                    style={{ cursor: isVideo ? "pointer" : "default" }}
                                >
                                    {isVideo ? (
                                        <video
                                            ref={videoRef}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            src={project.heroMedia}
                                            autoPlay
                                            muted
                                            playsInline
                                            preload="auto"
                                        />
                                    ) : (
                                        <img
                                            src={project.heroMedia}
                                            alt={`${project.title} hero`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}

                                    {/* Caption Overlay */}
                                    {project.caption && (
                                        <div className="absolute bottom-4 left-6 z-20 pointer-events-none mix-blend-plus-lighter">
                                            <p
                                                className="text-[10px] uppercase tracking-widest font-medium"
                                                style={{ color: "rgba(243, 236, 220, 0.5)" }}
                                            >
                                                {project.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Switcher */}
                                {project.thumbnails &&
                                    project.thumbnails.length > 0 && (
                                        <div
                                            className="h-24 bg-neutral-950 p-4 flex gap-3 overflow-x-auto"
                                            style={{
                                                borderTop:
                                                    "1px solid rgba(243, 236, 220, 0.08)",
                                            }}
                                        >
                                            {project.thumbnails.map(
                                                (thumb, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            handleThumbnailClick(
                                                                idx
                                                            )
                                                        }
                                                        className="relative aspect-video rounded-md overflow-hidden transition-all"
                                                        style={{
                                                            border:
                                                                activeThumbnail ===
                                                                    idx
                                                                    ? "2px solid #F3ECDC"
                                                                    : "2px solid transparent",
                                                            opacity:
                                                                activeThumbnail ===
                                                                    idx
                                                                    ? 1
                                                                    : 0.6,
                                                        }}
                                                    >
                                                        <div className="w-full h-full bg-neutral-800" />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Right Column: Narrative */}
                            <div
                                ref={sidebarRef}
                                className="w-full md:w-1/3 bg-card overflow-y-auto"
                                style={{
                                    borderLeft:
                                        "1px solid rgba(243, 236, 220, 0.08)",
                                }}
                            >
                                <div className="p-8 space-y-8">
                                    {/* Header */}
                                    <div className="space-y-4">
                                        {/* BETA tag — universal for all projects */}
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                                style={{
                                                    color: "#F3ECDC",
                                                    border: "1px solid rgba(243, 236, 220, 0.25)",
                                                    backgroundColor:
                                                        "rgba(243, 236, 220, 0.06)",
                                                }}
                                            >
                                                Beta
                                            </span>
                                        </div>

                                        <h2
                                            className="text-3xl font-bold leading-tight"
                                            style={{ color: "#F3ECDC" }}
                                        >
                                            {project.title}
                                        </h2>

                                        {/* Role subtitle */}
                                        <p
                                            className="text-xs uppercase tracking-widest"
                                            style={{
                                                color: "rgba(243, 236, 220, 0.45)",
                                            }}
                                        >
                                            {project.badge}
                                        </p>
                                    </div>

                                    {/* Logline */}
                                    <div
                                        id="section-logline"
                                        className="space-y-2 scroll-mt-8"
                                    >
                                        <h3
                                            className="text-sm font-medium uppercase tracking-widest"
                                            style={{
                                                color: "rgba(243, 236, 220, 0.45)",
                                            }}
                                        >
                                            Logline
                                        </h3>
                                        <p
                                            className="text-lg font-medium leading-relaxed"
                                            style={{ color: "#F3ECDC" }}
                                        >
                                            {project.logline}
                                        </p>
                                    </div>

                                    {/* Dynamic Narrative Section */}
                                    <div
                                        id="section-narrative"
                                        className="space-y-3 scroll-mt-8"
                                    >
                                        <h3
                                            className="text-sm font-medium uppercase tracking-widest"
                                            style={{
                                                color: "rgba(243, 236, 220, 0.45)",
                                            }}
                                        >
                                            {project.narrativeLabel}
                                        </h3>
                                        <p
                                            className="text-base leading-relaxed"
                                            style={{
                                                color: "rgba(243, 236, 220, 0.65)",
                                            }}
                                        >
                                            {project.narrative}
                                        </p>
                                    </div>

                                    {/* Dynamic Impact/Outcome Section */}
                                    <div
                                        id="section-impact"
                                        className="space-y-3 pt-4 scroll-mt-8"
                                        style={{
                                            borderTop:
                                                "1px solid rgba(243, 236, 220, 0.06)",
                                        }}
                                    >
                                        <h3
                                            className="text-sm font-medium uppercase tracking-widest"
                                            style={{
                                                color: "rgba(243, 236, 220, 0.45)",
                                            }}
                                        >
                                            {project.impactLabel}
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm">
                                                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span
                                                    style={{
                                                        color: "rgba(243, 236, 220, 0.85)",
                                                    }}
                                                >
                                                    {project.impact}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
