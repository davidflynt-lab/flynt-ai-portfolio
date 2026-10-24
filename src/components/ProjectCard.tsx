"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
    onClick?: () => void;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard({ project, index, onClick }, ref) {
    const { title, role, timeline, cardSummary, logoUrl, thumbnail, previewVideo } = project;
    const reducedMotion = useReducedMotion();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Preview video plays on hover unless the visitor prefers reduced motion.
    const isActive = isHovered && !reducedMotion;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (isActive) {
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
        }
    }, [isActive]);

    return (
        <motion.div
            ref={ref}
            layout
            id={`project-${project.id}`}
            className="scroll-mt-40"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, delay: reducedMotion ? 0 : index * 0.03 }}
        >
            <article
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-surface shadow-elevation transition-[translate,box-shadow] duration-[180ms] ease-out motion-safe:hover:-translate-y-1 hover:shadow-lifted"
            >
                {/* Uncropped media uses the framing already present in the source asset. */}
                <div
                    className="relative aspect-video overflow-hidden bg-background"
                    style={{ background: project.stageBackground }}
                >
                    <div className="absolute inset-0">
                        <Image
                            src={thumbnail}
                            data-papertrail-hero={project.id === "papertrail" || undefined}
                            alt={project.id === "cisco" ? "CQE Run Monitor with model failure predictions and diagnostic summaries" : `${title} preview`}
                            fill
                            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 92vw"
                            preload={index < 2}
                            className="object-contain"
                        />
                        {previewVideo && (
                            <video
                                ref={videoRef}
                                data-papertrail-hero={project.id === "papertrail" || undefined}
                                className="absolute inset-0 h-full w-full object-contain transition-opacity duration-[180ms] motion-reduce:transition-none"
                                src={previewVideo}
                                poster={thumbnail}
                                loop
                                muted
                                playsInline
                                preload="none"
                                aria-hidden="true"
                                style={{ opacity: isActive ? 1 : 0 }}
                            />
                        )}
                    </div>
                </div>

                {project.id === "cisco" && <p className="px-5 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:px-6">Artifact · CQE Run Monitor</p>}

                {/* ─── Card body ─── */}
                <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-6 sm:px-6">
                    {/* Source logos are cream; render them as ink in light mode and white in dark mode */}
                    <Image
                        src={logoUrl}
                        alt=""
                        width={120}
                        height={32}
                        unoptimized
                        className="h-6 w-auto self-start brightness-0 dark:invert"
                    />

                    <h3 className="text-xl font-semibold leading-tight tracking-display text-foreground sm:text-2xl">
                        {/* Stretched button: the whole card is the hit target */}
                        <button
                            type="button"
                            onClick={onClick}
                            className="text-left outline-none after:absolute after:inset-0 after:rounded-[24px] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-foreground/60"
                        >
                            {title}
                        </button>
                    </h3>

                    <p className="font-mono text-[12px] uppercase leading-relaxed tracking-wider text-muted-foreground">
                        {role} · {timeline}
                    </p>

                    <p className="text-[15px] leading-relaxed text-muted-foreground">{cardSummary}</p>
                    <p className="mt-auto border-t border-foreground/10 pt-3 font-mono text-[11px] leading-relaxed text-foreground">{project.cardProof}</p>
                </div>
            </article>
        </motion.div>
    );
});

export default ProjectCard;
