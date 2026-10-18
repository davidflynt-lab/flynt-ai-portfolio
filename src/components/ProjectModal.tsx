"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ExternalLink, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Project, accentStage, getThumb } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    initialActiveThumbnail?: number;
}

/** Gallery videos loop this many times, then rest on their final frame. */
const MAX_LOOPS = 3;

const SHEET_SPRING = { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.9 };
const SNAP_SPRING = { type: "spring" as const, stiffness: 500, damping: 38 };

const FOCUSABLE = 'a[href], button:not([disabled]), video, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab focus inside the given container (dialog accessibility). */
const trapFocus = (container: HTMLElement | null, event: KeyboardEvent) => {
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.tabIndex >= 0
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
    }
};

const glassButton =
    "flex h-10 w-10 items-center justify-center rounded-full bg-glass text-foreground backdrop-blur-2xl backdrop-saturate-150 shadow-elevation transition-[scale,background-color] duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60";

const NARRATIVE_LABEL = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground";

// Inner component mounts fresh each time the modal opens, so state resets naturally.
const ProjectModalContent = ({
    project,
    onClose,
    initialActiveThumbnail = 0,
}: {
    project: Project;
    onClose: () => void;
    initialActiveThumbnail?: number;
}) => {
    const { gallery, accentColor } = project;
    const [activeIndex, setActiveIndex] = useState(() =>
        Math.min(Math.max(initialActiveThumbnail, 0), gallery.length - 1)
    );
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const loopCountRef = useRef(0);
    const sheetRef = useRef<HTMLDivElement>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const maximizeButtonRef = useRef<HTMLButtonElement>(null);

    const currentMedia = gallery[activeIndex];
    const isVideo = currentMedia.type === "video";
    const hasSwitcher = gallery.length > 1;
    const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;

    // Lock page scroll, move focus into the dialog, and restore both on close.
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus({ preventScroll: true });
        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.({ preventScroll: true });
        };
    }, []);

    // Escape closes the lightbox first, then the sheet. Tab stays inside the top layer.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                if (isLightboxOpen) {
                    setIsLightboxOpen(false);
                    maximizeButtonRef.current?.focus({ preventScroll: true });
                } else {
                    onClose();
                }
            } else if (event.key === "Tab") {
                trapFocus(isLightboxOpen ? lightboxRef.current : sheetRef.current, event);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, onClose]);

    const selectMedia = (index: number) => {
        if (index === activeIndex) return;
        loopCountRef.current = 0;
        setIsPlaying(true);
        setActiveIndex(index);
    };

    // Loop exactly MAX_LOOPS times, then pause on the final frame.
    const handleVideoEnded = () => {
        const video = videoRef.current;
        if (!video) return;
        loopCountRef.current += 1;
        if (loopCountRef.current < MAX_LOOPS) {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
    };

    const toggleMainVideo = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            if (video.ended || loopCountRef.current >= MAX_LOOPS) {
                loopCountRef.current = 0;
                video.currentTime = 0;
            }
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    };

    const openLightbox = () => {
        videoRef.current?.pause();
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        maximizeButtonRef.current?.focus({ preventScroll: true });
    };

    return (
        <>
            {/* ─── Backdrop ─── */}
            <motion.div
                className="fixed inset-0 z-50 bg-scrim backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* ─── Floating sheet ─── */}
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    ref={sheetRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                    className="pointer-events-auto relative w-[94vw] max-w-7xl overflow-hidden rounded-[40px] bg-background shadow-[0_48px_120px_-32px_rgb(0_0_0/0.45)] dark:bg-surface"
                    initial={{ opacity: 0, y: 56, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.98 }}
                    transition={SHEET_SPRING}
                >
                    <div className="no-scrollbar max-h-[92vh] overflow-y-auto overscroll-contain">
                        {/* ─── Top Area: uncropped 16:9 media stage ─── */}
                        <div className="relative p-3">
                            <div
                                className="relative aspect-video overflow-hidden rounded-[30px]"
                                style={{ background: accentStage(accentColor) }}
                            >
                                <div
                                    className={cn(
                                        "absolute inset-4 md:inset-8 lg:inset-10",
                                        hasSwitcher ? "md:bottom-28 lg:bottom-28" : "md:bottom-24 lg:bottom-24"
                                    )}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={currentMedia.url}
                                            className="absolute inset-0"
                                            initial={{ opacity: 0, scale: 0.985 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.995 }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            {isVideo ? (
                                                <video
                                                    ref={videoRef}
                                                    className="h-full w-full cursor-pointer object-contain drop-shadow-[0_24px_40px_rgb(0_0_0/0.22)]"
                                                    src={currentMedia.url}
                                                    poster={currentMedia.poster}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    preload="auto"
                                                    onClick={toggleMainVideo}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === " ") {
                                                            event.preventDefault();
                                                            toggleMainVideo();
                                                        }
                                                    }}
                                                    onPlay={() => setIsPlaying(true)}
                                                    onPause={() => setIsPlaying(false)}
                                                    onEnded={handleVideoEnded}
                                                    tabIndex={0}
                                                    aria-label={`${currentMedia.caption} Press to play or pause.`}
                                                />
                                            ) : (
                                                <Image
                                                    src={currentMedia.url}
                                                    alt={currentMedia.caption}
                                                    fill
                                                    sizes="(min-width: 1280px) 1180px, 92vw"
                                                    loading="eager"
                                                    className="object-contain drop-shadow-[0_24px_40px_rgb(0_0_0/0.22)]"
                                                />
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Paused indicator */}
                                    <AnimatePresence>
                                        {isVideo && !isPlaying && (
                                            <motion.div
                                                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={SNAP_SPRING}
                                            >
                                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-glass text-foreground shadow-lifted backdrop-blur-2xl">
                                                    <Play className="ml-1 h-6 w-6 fill-current" />
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Top right controls: fullscreen lightbox + close */}
                                <div className="absolute right-4 top-4 z-20 flex items-center gap-2 md:right-5 md:top-5">
                                    <button
                                        ref={maximizeButtonRef}
                                        type="button"
                                        onClick={openLightbox}
                                        className={glassButton}
                                        aria-label="View fullscreen"
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        ref={closeButtonRef}
                                        type="button"
                                        onClick={onClose}
                                        className={glassButton}
                                        aria-label="Close project"
                                    >
                                        <X className="h-[18px] w-[18px]" />
                                    </button>
                                </div>
                            </div>

                            {/* ─── Floating glass switcher (overlays stage on md+, sits below on mobile) ─── */}
                            <div className="mt-3 flex justify-center md:absolute md:inset-x-3 md:bottom-8 md:mt-0">
                                <div className="flex max-w-full flex-col items-center gap-3 rounded-[26px] p-2 max-md:bg-surface max-md:dark:bg-white/[0.06] md:flex-row md:bg-glass md:pr-5 md:shadow-lifted md:backdrop-blur-2xl md:backdrop-saturate-150">
                                    {hasSwitcher && (
                                        <div className="flex shrink-0 items-center gap-2" role="group" aria-label="Project media">
                                            {gallery.map((item, idx) => {
                                                const thumb = getThumb(item);
                                                const isActive = idx === activeIndex;
                                                return (
                                                    <button
                                                        key={item.url}
                                                        type="button"
                                                        onClick={() => selectMedia(idx)}
                                                        aria-label={`Show media ${idx + 1}: ${item.caption}`}
                                                        aria-pressed={isActive}
                                                        className={cn(
                                                            "relative h-10 w-16 rounded-[14px] transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60",
                                                            isActive ? "opacity-100" : "opacity-50 hover:opacity-90"
                                                        )}
                                                    >
                                                        {isActive && (
                                                            <motion.span
                                                                layoutId={`thumb-indicator-${project.id}`}
                                                                className="absolute -inset-[3px] rounded-[17px] ring-2 ring-foreground"
                                                                transition={SNAP_SPRING}
                                                            />
                                                        )}
                                                        <span className="absolute inset-0 overflow-hidden rounded-[14px] bg-background">
                                                            {thumb ? (
                                                                <Image src={thumb} alt="" fill sizes="64px" className="object-cover" />
                                                            ) : (
                                                                <Play className="m-auto h-full w-3 fill-current text-muted-foreground" />
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "flex min-h-10 items-center gap-3 px-3 pb-1 md:max-w-[460px] md:px-0 md:pb-0",
                                            !hasSwitcher && "md:px-3"
                                        )}
                                        aria-live="polite"
                                    >
                                        <span className="shrink-0 font-mono text-[11px] tabular-nums tracking-wider text-muted-foreground">
                                            {counter}
                                        </span>
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.p
                                                key={currentMedia.url}
                                                className="font-mono text-[12px] uppercase leading-snug tracking-wide text-foreground"
                                                initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {currentMedia.caption}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Project header ─── */}
                        <header className="flex flex-col gap-5 px-8 pt-6 md:pt-8">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/logo inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2.5 transition-[scale] duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 dark:bg-white/[0.06]"
                                >
                                    <Image
                                        src={project.logoUrl}
                                        alt={`${project.title.split(" | ")[0]} logo`}
                                        width={120}
                                        height={32}
                                        unoptimized
                                        className="h-5 w-auto brightness-0 dark:invert"
                                    />
                                    <ExternalLink
                                        className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover/logo:text-foreground"
                                        aria-hidden="true"
                                    />
                                    <span className="sr-only">(opens project site in a new tab)</span>
                                </a>
                                <p className="font-mono text-[12px] uppercase leading-relaxed tracking-wider text-muted-foreground">
                                    {project.role} · {project.timeline}
                                </p>
                            </div>
                            <h2
                                id="project-modal-title"
                                className="max-w-4xl text-3xl font-semibold leading-[1.05] tracking-display text-foreground md:text-5xl"
                            >
                                {project.title}
                            </h2>
                        </header>

                        {/* ─── Bottom Area: 3 column architectural grid ─── */}
                        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-3">
                            <section className="flex flex-col gap-4" aria-labelledby="narrative-challenge">
                                <h3 id="narrative-challenge" className={NARRATIVE_LABEL}>
                                    01 / The Challenge
                                </h3>
                                <p className="text-[15px] leading-relaxed text-muted-foreground">{project.challenge}</p>
                            </section>

                            <section className="flex flex-col gap-4" aria-labelledby="narrative-architecture">
                                <h3 id="narrative-architecture" className={NARRATIVE_LABEL}>
                                    02 / System Architecture
                                </h3>
                                <p className="text-[15px] leading-relaxed text-muted-foreground">{project.architecture}</p>
                            </section>

                            <section className="flex flex-col gap-4" aria-labelledby="narrative-impact">
                                <h3 id="narrative-impact" className={NARRATIVE_LABEL}>
                                    03 / Verified Impact
                                </h3>
                                <ul className="flex flex-col gap-5">
                                    {project.impact.map((item) => (
                                        <li key={item.metric} className="flex flex-col gap-1.5">
                                            <span className="flex items-center gap-2 text-[17px] font-semibold leading-snug tracking-tight text-foreground">
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{ backgroundColor: accentColor }}
                                                    aria-hidden="true"
                                                />
                                                {item.metric}
                                            </span>
                                            <span className="text-[15px] leading-relaxed text-muted-foreground">{item.detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ─── Fullscreen lightbox ─── */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        ref={lightboxRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${project.title} fullscreen media`}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4 md:p-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            aria-label="Exit fullscreen"
                            autoFocus
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="relative h-full w-full">
                            {isVideo ? (
                                <video
                                    className="h-full w-full cursor-pointer object-contain"
                                    src={currentMedia.url}
                                    poster={currentMedia.poster}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onClick={(event) => {
                                        const video = event.currentTarget;
                                        if (video.paused) video.play().catch(() => {});
                                        else video.pause();
                                    }}
                                />
                            ) : (
                                <Image
                                    src={currentMedia.url}
                                    alt={currentMedia.caption}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                />
                            )}
                        </div>

                        <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-8 pb-8 pt-16 text-center font-mono text-[12px] uppercase tracking-wide text-white/90">
                            {currentMedia.caption}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const ProjectModal = ({ project, isOpen, onClose, initialActiveThumbnail }: ProjectModalProps) => (
    <AnimatePresence>
        {isOpen && project && (
            <ProjectModalContent
                key={project.id}
                project={project}
                onClose={onClose}
                initialActiveThumbnail={initialActiveThumbnail}
            />
        )}
    </AnimatePresence>
);

export default ProjectModal;
