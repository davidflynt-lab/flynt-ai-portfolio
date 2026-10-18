"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Project, accentStage } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: Project;
    index: number;
    /** Highlighted by the Impact Lens filter bar. */
    spotlit?: boolean;
    /** Another card is spotlit, so this one recedes. */
    dimmed?: boolean;
    onClick?: () => void;
}

const ProjectCard = ({ project, index, spotlit = false, dimmed = false, onClick }: ProjectCardProps) => {
    const { title, role, timeline, cardSummary, logoUrl, thumbnail, previewVideo, accentColor } = project;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Preview video plays on hover, or while the Impact Lens spotlights this card.
    const isActive = isHovered || spotlit;

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
            id={`project-${project.id}`}
            className="scroll-mt-40"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28, delay: 0.15 + index * 0.08 }}
        >
            <article
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "group relative flex h-full flex-col rounded-[36px] bg-surface p-2.5 shadow-elevation",
                    "transition-[opacity,scale,translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-y-1 hover:shadow-lifted",
                    dimmed && "opacity-40 scale-[0.98]"
                )}
                style={spotlit ? { boxShadow: `0 40px 80px -48px ${accentColor}` } : undefined}
            >
                {/* ─── 16:9 accent tinted media stage (uncropped) ─── */}
                <div
                    className="relative aspect-video overflow-hidden rounded-[28px]"
                    style={{ background: accentStage(accentColor) }}
                >
                    <div className="absolute inset-4 sm:inset-6">
                        <Image
                            src={thumbnail}
                            alt={`${title} preview`}
                            fill
                            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 92vw"
                            preload={index < 2}
                            className="object-contain drop-shadow-[0_16px_24px_rgb(0_0_0/0.18)]"
                        />
                        {previewVideo && (
                            <video
                                ref={videoRef}
                                className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_16px_24px_rgb(0_0_0/0.18)] transition-opacity duration-500"
                                src={previewVideo}
                                poster={thumbnail}
                                loop
                                muted
                                playsInline
                                preload="auto"
                                aria-hidden="true"
                                style={{ opacity: isActive ? 1 : 0 }}
                            />
                        )}
                    </div>
                </div>

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
                            className="text-left outline-none after:absolute after:inset-0 after:rounded-[36px] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-foreground/60"
                        >
                            {title}
                        </button>
                    </h3>

                    <p className="font-mono text-[12px] uppercase leading-relaxed tracking-wider text-muted-foreground">
                        {role} · {timeline}
                    </p>

                    <p className="text-[15px] leading-relaxed text-muted-foreground">{cardSummary}</p>
                </div>
            </article>
        </motion.div>
    );
};

export default ProjectCard;
