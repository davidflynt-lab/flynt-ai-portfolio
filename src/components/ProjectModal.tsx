"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ChevronRight } from "lucide-react";
import { Project } from "@/lib/projects";
import { useState, useRef, useEffect } from "react";

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
    const [loopCount, setLoopCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setActiveThumbnail(0);
            setLoopCount(0);
        }
    }, [isOpen]);

    // Handle video loop logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            if (loopCount < MAX_LOOPS - 1) {
                setLoopCount(prev => prev + 1);
                video.currentTime = 0;
                video.play();
            } else {
                // Pause on first frame after 3 loops
                video.currentTime = 0;
                video.pause();
            }
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [loopCount]);

    // Handle hover to restart loop cycle
    const handleVideoMouseEnter = () => {
        setIsHovered(true);
        const video = videoRef.current;
        if (video) {
            setLoopCount(0);
            video.currentTime = 0;
            video.play();
        }
    };

    const handleVideoMouseLeave = () => {
        setIsHovered(false);
    };

    // Handle thumbnail click with synced scrolling
    const handleThumbnailClick = (idx: number) => {
        setActiveThumbnail(idx);

        // Scroll to corresponding section
        const sectionId = SECTION_IDS[idx];
        if (sectionId && sidebarRef.current) {
            const targetElement = sidebarRef.current.querySelector(`#section-${sectionId}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (!project) return null;

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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Modal Content */}
                        <div
                            className="bg-card w-full max-w-6xl h-full max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Column: Media */}
                            <div className="w-full md:w-2/3 bg-black relative flex flex-col">
                                {/* Main Video Player Area */}
                                <div
                                    className="flex-1 relative bg-neutral-900 group"
                                    onMouseEnter={handleVideoMouseEnter}
                                    onMouseLeave={handleVideoMouseLeave}
                                >
                                    {/* Video player */}
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={project.heroVideo}
                                        autoPlay
                                        muted
                                        playsInline
                                    />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer">
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail Switcher (if multiple) */}
                                {project.thumbnails && project.thumbnails.length > 0 && (
                                    <div className="h-24 bg-neutral-950 border-t border-white/10 p-4 flex gap-3 overflow-x-auto">
                                        {project.thumbnails.map((thumb, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleThumbnailClick(idx)}
                                                className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${activeThumbnail === idx ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                                    }`}
                                            >
                                                <div className="w-full h-full bg-neutral-800" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Narrative */}
                            <div
                                ref={sidebarRef}
                                className="w-full md:w-1/3 bg-card border-l border-white/10 overflow-y-auto"
                            >
                                <div className="p-8 space-y-8">
                                    {/* Header */}
                                    <div className="space-y-4">
                                        <div className="px-3 py-1 inline-flex rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                            {project.badge}
                                        </div>
                                        <h2 className="text-3xl font-bold text-foreground leading-tight">{project.title}</h2>
                                    </div>

                                    {/* Logline */}
                                    <div id="section-logline" className="space-y-2 scroll-mt-8">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Logline</h3>
                                        <p className="text-lg text-foreground font-medium leading-relaxed">
                                            {project.logline}
                                        </p>
                                    </div>

                                    {/* The Narrative */}
                                    <div id="section-narrative" className="space-y-3 scroll-mt-8">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">The AI Narrative</h3>
                                        <p className="text-base text-muted-foreground leading-relaxed">
                                            {project.narrative}
                                        </p>
                                    </div>

                                    {/* Technical Impact */}
                                    <div id="section-impact" className="space-y-3 pt-4 border-t border-white/5 scroll-mt-8">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Technical Impact</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm text-foreground/90">
                                                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span>{project.impact}</span>
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
