"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Maximize2 } from "lucide-react";
import { Project } from "@/lib/projects";
import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    initialActiveThumbnail?: number;
}

const MAX_LOOPS = 3;

// Section IDs for synced scrolling
const SECTION_IDS = ["logline", "narrative", "impact"];

// Inner component that holds state and logic — mounts fresh each time modal opens
const ProjectModalContent = ({ project, onClose, initialActiveThumbnail = 0 }: { project: Project; onClose: () => void; initialActiveThumbnail?: number }) => {
    const [activeThumbnail, setActiveThumbnail] = useState(initialActiveThumbnail);
    const videoRef = useRef<HTMLVideoElement>(null);
    const lightboxVideoRef = useRef<HTMLVideoElement>(null);
    const loopCountRef = useRef(0);
    const [isPaused, setIsPaused] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Only needed for thumbnail logic if project changes while open
    // But since we mount fresh, we don't strictly need a reset effect here unless project prop changes.
    // The previous code had a reset effect on isOpen. Now mount = reset.

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
    const handleVideoClick = (e: React.MouseEvent) => {
        // Toggle play/pause for the specific video element clicked
        const video = e.currentTarget as HTMLVideoElement;
        if (video.paused) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    };

    // Wrapper for main video click to handle global pause state if needed
    const handleMainVideoClick = () => {
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
    }

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

    const currentMedia = project.gallery[activeThumbnail];
    const isVideo = currentMedia?.type === "video";

    return (
        <>
            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            {isVideo ? (
                                <video
                                    ref={lightboxVideoRef}
                                    className="w-full h-full object-contain max-h-screen"
                                    src={currentMedia.url}
                                    poster={currentMedia.poster}
                                    autoPlay
                                    controls={false}
                                    onClick={handleVideoClick}
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={currentMedia.url}
                                    alt="Lightbox view"
                                    className="w-full h-full object-contain max-h-screen"
                                />
                            )}
                            {/* Caption in Lightbox - optional but good for consistency */}
                            {currentMedia?.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                                    <p className="text-sm md:text-base font-bold text-white max-w-4xl mx-auto text-center drop-shadow-md">
                                        {currentMedia.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


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
                    className="bg-card w-full max-w-7xl h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
                    style={{
                        border: "1px solid rgba(243, 236, 220, 0.12)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors"
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
                    <div className="w-full md:w-2/3 bg-black relative flex flex-col justify-center bg-neutral-900 group">
                        {/* Maximize Icon */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(true);
                            }}
                            className="absolute top-4 right-16 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                            title="Fullscreen"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>

                        {/* Main Media Area */}
                        <div
                            className="relative w-full h-full flex items-center justify-center bg-neutral-900 cursor-pointer overflow-hidden"
                            onClick={isVideo ? handleMainVideoClick : undefined}
                            style={{ cursor: isVideo ? "pointer" : "default" }}
                        >
                            <AnimatePresence mode="wait">
                                {isVideo ? (
                                    <motion.video
                                        key={currentMedia.url}
                                        ref={videoRef}
                                        className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                                        src={currentMedia.url}
                                        poster={currentMedia.poster}
                                        autoPlay
                                        muted
                                        playsInline
                                        preload="auto"
                                        controls={false}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <motion.img
                                        key={currentMedia.url}
                                        src={currentMedia.url}
                                        alt={`${project.title} media`}
                                        className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Caption Overlay - High Contrast Scrim */}
                            {currentMedia?.caption && (
                                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-16 pb-6 px-6">
                                    <p className="text-xs md:text-[13px] uppercase tracking-widest font-bold text-white shadow-black/80 drop-shadow-lg leading-relaxed">
                                        {currentMedia.caption}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Switcher */}
                        {project.gallery &&
                            project.gallery.length > 0 && (
                                <div
                                    className="h-20 bg-neutral-950 p-3 flex gap-3 overflow-x-auto shrink-0 z-30"
                                    style={{
                                        borderTop:
                                            "1px solid rgba(243, 236, 220, 0.08)",
                                    }}
                                >
                                    {project.gallery.map(
                                        (item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleThumbnailClick(idx);
                                                }}
                                                className="relative aspect-video rounded hover:opacity-100 transition-all"
                                                style={{
                                                    border:
                                                        activeThumbnail ===
                                                            idx
                                                            ? "2px solid #F3ECDC"
                                                            : "1px solid rgba(255,255,255,0.1)",
                                                    opacity:
                                                        activeThumbnail ===
                                                            idx
                                                            ? 1
                                                            : 0.5,
                                                }}
                                            >
                                                {item.thumb ? (
                                                    <img src={item.thumb} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                                        {item.type === 'video' ? (
                                                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/50 border-b-[4px] border-b-transparent" />
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                        )}
                                                    </div>
                                                )}
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
                                {/* Project Logo — Natural Colors */}
                                <div className="flex items-center gap-3">
                                    {project.projectUrl ? (
                                        <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-70 transition-opacity block"
                                        >
                                            <img
                                                src={project.logoUrl}
                                                alt={`${project.title} logo`}
                                                className="h-7 w-auto object-contain"
                                                style={{ opacity: 0.9 }}
                                            />
                                        </a>
                                    ) : (
                                        <img
                                            src={project.logoUrl}
                                            alt={`${project.title} logo`}
                                            className="h-7 w-auto object-contain"
                                            style={{ opacity: 0.9 }}
                                        />
                                    )}
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
                                    {project.impact.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm"
                                        >
                                            <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                            <span
                                                style={{
                                                    color: "rgba(243, 236, 220, 0.85)",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Custom Sections (Technical Logic / Alignment) */}
                            {project.customSections?.map((section, idx) => (
                                <div
                                    key={idx}
                                    className="space-y-4 pt-8 scroll-mt-8"
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
                                        {section.title}
                                    </h3>
                                    <div className="space-y-6">
                                        {section.content.map(
                                            (block, bIdx) => (
                                                <div
                                                    key={bIdx}
                                                    className="space-y-2"
                                                >
                                                    <h4
                                                        className="text-sm font-bold"
                                                        style={{
                                                            color: "#F3ECDC",
                                                        }}
                                                    >
                                                        {block.heading}
                                                    </h4>
                                                    <p
                                                        className="text-sm leading-relaxed"
                                                        style={{
                                                            color: "rgba(243, 236, 220, 0.65)",
                                                        }}
                                                    >
                                                        {block.body}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

const ProjectModal = ({ project, isOpen, onClose, initialActiveThumbnail }: ProjectModalProps) => {
    // If no project is selected but we are 'open', we should probably not render or render empty?
    // But sticking to existing logic: if !project return null
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && <ProjectModalContent project={project} onClose={onClose} initialActiveThumbnail={initialActiveThumbnail} />}
        </AnimatePresence>
    );
};

export default ProjectModal;
