"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Maximize2, ExternalLink, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Project, getThumb, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (project: Project) => void;
    initialActiveThumbnail?: number;
}

/** Gallery videos loop this many times, then rest on their final frame. */
const MAX_LOOPS = 3;

const SHEET_SPRING = { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.9 };

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
    "flex h-11 w-11 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground transition-colors duration-150 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60";

const NARRATIVE_LABEL = "text-base font-semibold leading-snug text-neutral-900 dark:text-white";

// The shell stays mounted while cases change so focus and scroll lock remain stable.
const ProjectModalContent = ({
    project,
    isOpen,
    onClose,
    onNavigate,
    initialActiveThumbnail = 0,
}: {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (project: Project) => void;
    initialActiveThumbnail?: number;
}) => {
    const { gallery, accentColor } = project;
    const reducedMotion = useReducedMotion();
    const [selection, setSelection] = useState(() => ({
        projectId: project.id,
        index: Math.min(Math.max(initialActiveThumbnail, 0), gallery.length - 1),
    }));
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [scrolledProject, setScrolledProject] = useState<string | null>(null);
    const [videoState, setVideoState] = useState<{ url: string; paused: boolean } | null>(null);
    const [lightboxVideoPaused, setLightboxVideoPaused] = useState(true);
    const [lastProjectId, setLastProjectId] = useState(project.id);

    if (lastProjectId !== project.id) {
        setLastProjectId(project.id);
        setSelection({ projectId: project.id, index: 0 });
        setScrolledProject(null);
        setVideoState(null);
    }

    const videoRef = useRef<HTMLVideoElement>(null);
    const loopCountRef = useRef(0);
    const sheetRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const maximizeButtonRef = useRef<HTMLButtonElement>(null);

    const activeIndex = selection.projectId === project.id ? selection.index : 0;
    const currentMedia = gallery[activeIndex];
    const hasScrolled = scrolledProject === project.id;
    const videoPaused = videoState?.url === currentMedia.url ? videoState.paused : true;
    const stageBackground = {
        papertrail: "linear-gradient(135deg, #00a08e, #00d6c5)",
        "stellar-cyber": "#f28c29",
        amazon: "#34c759",
        cisco: "#0189ff",
    }[project.id];
    const isVideo = currentMedia.type === "video";
    const hasSwitcher = gallery.length > 1;
    const projectIndex = projects.findIndex((item) => item.id === project.id);
    const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
    const nextProject = projects[(projectIndex + 1) % projects.length];
    const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;

    // Lock page scroll, move focus into the dialog, and restore both on close.
    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus({ preventScroll: true });
        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.({ preventScroll: true });
        };
    }, [isOpen]);

    useLayoutEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        loopCountRef.current = 0;
    }, [project.id]);

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
            } else if (!isLightboxOpen && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                const target = event.target as HTMLElement | null;
                if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "")) return;
                event.preventDefault();
                onNavigate(event.key === "ArrowLeft" ? previousProject : nextProject);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, onClose, onNavigate, previousProject, nextProject]);

    const selectMedia = (index: number) => {
        if (index < 0 || index >= gallery.length || index === activeIndex) return;
        loopCountRef.current = 0;
        setVideoState({ url: gallery[index].url, paused: true });
        setSelection({ projectId: project.id, index });
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

    const mediaCaption = currentMedia.caption.startsWith("FIG ")
        ? currentMedia.caption
        : `FIG ${String(activeIndex + 1).padStart(2, "0")} · ${currentMedia.caption}`;

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm transform-gpu [backface-visibility:hidden] [will-change:transform]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.18 }}
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center transform-gpu [backface-visibility:hidden] [will-change:transform]">
                <motion.div
                    ref={sheetRef}
                    role="dialog"
                    aria-modal={!isLightboxOpen}
                    aria-hidden={isLightboxOpen || undefined}
                    inert={isLightboxOpen}
                    aria-labelledby="project-modal-title"
                    className="pointer-events-auto relative flex h-[92dvh] w-[94vw] max-w-7xl flex-col overflow-hidden rounded-[24px] bg-white shadow-lifted [contain:paint] dark:bg-[#0a0b0e]"
                    initial={reducedMotion ? false : { opacity: 0, y: 32, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: 1 }}
                    transition={reducedMotion ? { duration: 0 } : SHEET_SPRING}
                >
                    <div className="z-30 grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 border-b border-foreground/10 bg-background px-3 py-2 dark:bg-surface sm:px-5">
                        <span className="truncate font-mono text-sm tabular-nums text-neutral-700 dark:text-neutral-300" aria-label={`Case ${projectIndex + 1} of ${projects.length}`}>{String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                        <nav aria-label="Case study navigation" className="flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-1 font-mono text-sm text-neutral-300">
                            <button type="button" onClick={() => onNavigate(previousProject)} aria-label={`Previous case: ${previousProject.title}`} className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Prev</button>
                            <span className="text-neutral-600" aria-hidden="true">|</span>
                            <button type="button" onClick={() => onNavigate(nextProject)} aria-label={`Next case: ${nextProject.title}`} className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white">Next <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
                        </nav>
                        <div className="flex justify-end gap-1">
                            <button ref={maximizeButtonRef} type="button" onClick={openLightbox} className={glassButton} aria-label="View fullscreen">
                                <Maximize2 className="h-4 w-4" />
                            </button>
                            <button ref={closeButtonRef} type="button" onClick={onClose} className={glassButton} aria-label="Close project">
                                <X className="h-[18px] w-[18px]" />
                            </button>
                        </div>
                    </div>
                    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16"
                        onScroll={(event) => {
                            if (!hasScrolled && event.currentTarget.scrollTop > 0) setScrolledProject(project.id);
                        }}>
                        <div>
                        <header className="flex flex-col gap-3 px-5 pb-5 pt-5 md:px-8 md:pb-6 md:pt-6">
                            <div className="flex min-h-11 items-center">
                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60">
                                    <Image src={project.logoUrl} alt={`${project.title.split(" | ")[0]} logo`} width={120} height={32} unoptimized className="h-5 w-auto brightness-0 dark:invert" />
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                    <span className="sr-only">(opens project site in a new tab)</span>
                                </a>
                            </div>
                            <h2 id="project-modal-title" className="max-w-5xl text-2xl font-semibold leading-tight tracking-display text-foreground md:text-[32px]">
                                {project.title}
                            </h2>
                            <p className="font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                                {project.role} · {project.timeline}
                            </p>
                            <p className="max-w-4xl font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"><span className="font-semibold text-neutral-900 dark:text-white">Scope:</span> {project.ownership}</p>
                            <div className="max-w-4xl space-y-2 text-[15px] leading-relaxed text-neutral-900 dark:text-white">
                                <p><span className="font-semibold">The problem:</span> {project.problemSummary}</p>
                                <p><span className="font-semibold">The decision:</span> {project.summary}</p>
                            </div>
                        </header>

                        <figure className="border-y border-foreground/10">
                            <div className="bg-neutral-100 dark:bg-neutral-900/50" style={{ background: stageBackground }}>
                            <div className="relative mx-auto w-full overflow-hidden rounded-2xl"
                                style={{ background: stageBackground, aspectRatio: currentMedia.aspectRatio ?? 16 / 9, maxWidth: `min(100%, calc(52dvh * ${currentMedia.aspectRatio ?? 16 / 9})${currentMedia.nativeWidth ? `, ${currentMedia.nativeWidth}px` : ""})` }}>
                                    <div key={currentMedia.url} className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                        {isVideo ? (
                                            <><video ref={videoRef} data-papertrail-hero={project.id === "papertrail" && currentMedia.url === project.previewVideo || undefined} className={cn("h-full w-full cursor-pointer object-contain", project.id === "stellar-cyber" && currentMedia.url === project.previewVideo && "origin-left scale-105")}
                                                src={currentMedia.url} poster={currentMedia.poster ?? currentMedia.thumb} autoPlay={!reducedMotion} muted playsInline preload="metadata"
                                                onClick={toggleMainVideo}
                                                onPlay={() => setVideoState({ url: currentMedia.url, paused: false })} onPause={() => setVideoState({ url: currentMedia.url, paused: true })}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault(); toggleMainVideo();
                                                    }
                                                }}
                                                onEnded={handleVideoEnded}
                                                tabIndex={0} aria-label={`${currentMedia.caption} Press to play or pause.`} />
                                                {videoPaused && <button type="button" onClick={toggleMainVideo} aria-label="Play video" className="absolute grid h-14 w-14 place-items-center rounded-full bg-black/75 text-white shadow-lg transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" /></button>}</>
                                        ) : currentMedia.imagePosition ? (
                                            <Image src={currentMedia.url} alt={currentMedia.caption} fill sizes="(min-width: 1280px) 1200px, 94vw" loading="eager"
                                                className="object-cover" style={{ objectPosition: currentMedia.imagePosition, transform: `scale(${currentMedia.imageScale ?? 1})`, transformOrigin: "75% 0%" }} />
                                        ) : currentMedia.nativeWidth ? (
                                            <Image src={currentMedia.url} alt={currentMedia.caption} width={currentMedia.nativeWidth} height={Math.round(currentMedia.nativeWidth / (currentMedia.aspectRatio ?? 16 / 9))}
                                                sizes="(min-width: 1280px) 960px, 94vw" loading="eager"
                                                className="h-auto max-h-full w-full object-contain" style={{ maxWidth: currentMedia.nativeWidth }} />
                                        ) : (
                                            <Image src={currentMedia.url} alt={currentMedia.caption} fill sizes="(min-width: 1280px) 960px, 94vw" loading="eager" className="object-contain" />
                                        )}

                                    </div>
                            </div>
                            </div>
                            <figcaption className="flex flex-col gap-3 border-t border-foreground/10 px-5 py-4 md:flex-row md:items-center md:gap-5 md:px-8">
                                {hasSwitcher && (
                                    <div className="flex max-w-full shrink-0 gap-2 overflow-x-auto pb-1" role="group" aria-label="Project media">
                                        {gallery.map((item, idx) => {
                                            const thumb = getThumb(item);
                                            const isActive = idx === activeIndex;
                                            return (
                                                <button key={item.url} type="button" onClick={() => selectMedia(idx)}
                                                    aria-label={`Show media ${idx + 1}: ${item.caption}`} aria-pressed={isActive}
                                                    className={cn("relative h-11 w-16 overflow-hidden rounded-md border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60",
                                                        isActive ? "border-foreground" : "border-foreground/15 hover:border-foreground/60")}>
                                                    {thumb ? <Image src={thumb} alt="" fill sizes="64px" className="object-cover" /> : <Play className="m-auto h-4 w-4 fill-current" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="flex items-start gap-3 font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300" aria-live="polite" aria-atomic="true">
                                    <span className="shrink-0 tabular-nums">{counter}</span>
                                    <p>{mediaCaption}</p>
                                </div>
                            </figcaption>
                            {currentMedia.annotations && (
                                <div className="flex flex-wrap gap-2 px-5 pb-4 md:px-8" aria-label="Visual details">
                                    {currentMedia.annotations.map((annotation) => (
                                        <span key={annotation} className="rounded-full border border-foreground/15 px-3 py-1 font-mono text-sm text-foreground">{annotation}</span>
                                    ))}
                                </div>
                            )}
                        </figure>

                        <motion.p
                            initial={false}
                            animate={{ opacity: hasScrolled ? 0 : 0.5 }}
                            transition={{ duration: reducedMotion ? 0 : 0.18 }}
                            aria-hidden={hasScrolled}
                            className="pointer-events-none px-5 pt-4 font-mono text-sm text-foreground md:px-8"
                        >
                            Scroll for case study details ↓
                        </motion.p>

                        <div className="grid grid-cols-1 gap-8 px-5 py-8 md:grid-cols-3 md:px-8">
                            <section className="flex flex-col gap-4" aria-labelledby="narrative-challenge">
                                <h3 id="narrative-challenge" className={NARRATIVE_LABEL}>01 / The Challenge</h3>
                                <p className="text-[15px] leading-relaxed text-muted-foreground">{project.challenge}</p>
                            </section>
                            <section className="flex flex-col gap-4" aria-labelledby="narrative-architecture">
                                <h3 id="narrative-architecture" className={NARRATIVE_LABEL}>02 / Decisions & Tradeoffs</h3>
                                <p className="text-[15px] leading-relaxed text-muted-foreground">{project.architecture}</p>
                                {project.decisionComparison && <dl className="space-y-3 text-[15px] leading-relaxed text-muted-foreground"><div><dt className="font-semibold text-foreground">Alternative and cost</dt><dd>{project.decisionComparison.alternative}</dd></div><div><dt className="font-semibold text-foreground">Choice</dt><dd>{project.decisionComparison.choice}</dd></div></dl>}
                                {project.workflow && <ol className="flex flex-col gap-4" aria-label="Investigation workflow">
                                    {project.workflow.map((step, index) => <li key={step.title} className="text-[15px] leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">{index + 1}. {step.title}.</span> {step.detail}</li>)}
                                </ol>}
                            </section>
                            <section className="flex flex-col gap-4" aria-labelledby="narrative-impact">
                                <h3 id="narrative-impact" className={NARRATIVE_LABEL}>03 / Outcomes & Evidence</h3>
                                <ul className="flex flex-col gap-6">
                                    {project.impact.map((item) => (
                                        <li key={item.metric} className="flex flex-col gap-2">
                                            <span className="flex items-start gap-2 text-[17px] font-semibold leading-snug tracking-tight text-foreground">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                                                {item.metric}
                                            </span>
                                            {item.provenance && (
                                                <span className="font-mono text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">{item.provenance}</span>
                                            )}
                                            <span className="text-[15px] leading-relaxed text-muted-foreground">{item.detail}</span>
                                        </li>
                                    ))}
                                </ul>
                                {project.relatedWork && <div className="border-t border-foreground/10 pt-4"><h4 className="text-[15px] font-semibold leading-snug text-foreground">{project.relatedWork.title}</h4><p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{project.relatedWork.detail}</p></div>}
                            </section>
                        </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div ref={lightboxRef} role="dialog" aria-modal="true" aria-label={`${project.title} fullscreen media`}
                        className="fixed inset-0 z-[100] flex flex-col bg-black px-4 pb-4 pt-20 md:px-10 md:pb-8"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}>
                        <button type="button" onClick={closeLightbox}
                            className="absolute right-6 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            aria-label="Exit fullscreen" autoFocus><X className="h-5 w-5" /></button>
                        <div className="relative min-h-0 flex-1 flex items-center justify-center" style={{ background: stageBackground }}>
                            {isVideo ? (
                                <><video className="h-full w-full cursor-pointer object-contain" src={currentMedia.url} poster={currentMedia.poster ?? currentMedia.thumb} autoPlay={!reducedMotion} loop={!reducedMotion} muted playsInline
                                    onPlay={() => setLightboxVideoPaused(false)} onPause={() => setLightboxVideoPaused(true)}
                                    onClick={(event) => {
                                        const video = event.currentTarget;
                                        if (video.paused) video.play().catch(() => {});
                                        else video.pause();
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            const video = event.currentTarget;
                                            if (video.paused) video.play().catch(() => {});
                                            else video.pause();
                                        }
                                    }}
                                    tabIndex={0} aria-label={`${currentMedia.caption} Press to play or pause.`} />
                                    {lightboxVideoPaused && <span aria-hidden="true" className="pointer-events-none absolute grid h-14 w-14 place-items-center rounded-full bg-black/75 text-white"><Play className="ml-1 h-6 w-6 fill-current" /></span>}</>
                            ) : currentMedia.imagePosition ? (
                                <Image src={currentMedia.url} alt={currentMedia.caption} fill sizes="100vw" className="object-contain" />
                            ) : currentMedia.nativeWidth ? (
                                <Image src={currentMedia.url} alt={currentMedia.caption} width={currentMedia.nativeWidth} height={Math.round(currentMedia.nativeWidth / (currentMedia.aspectRatio ?? 16 / 9))} sizes="100vw"
                                    className="h-auto max-h-full w-full object-contain" style={{ maxWidth: currentMedia.nativeWidth }} />
                            ) : (
                                <Image src={currentMedia.url} alt={currentMedia.caption} fill sizes="100vw" className="object-contain" />
                            )}
                        </div>
                        <p className="shrink-0 pt-4 text-center font-mono text-sm leading-relaxed text-neutral-300">{mediaCaption}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const ProjectModal = ({ project, isOpen, onClose, onNavigate, initialActiveThumbnail }: ProjectModalProps) => (
    <AnimatePresence mode="wait">
        {isOpen && project && (
            <ProjectModalContent
                project={project}
                isOpen={isOpen}
                onClose={onClose}
                onNavigate={onNavigate}
                initialActiveThumbnail={initialActiveThumbnail}
            />
        )}
    </AnimatePresence>
);

export default ProjectModal;
