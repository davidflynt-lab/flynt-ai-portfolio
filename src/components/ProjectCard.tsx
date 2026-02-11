"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectCardProps {
    title: string;
    badge: string;
    description: string;
    logoUrl?: string;
    thumbnail?: string;
    heroImage?: string;
    previewVideo: string;
    isHero?: boolean;
    index: number;
    onClick?: () => void;
}

const MAX_LOOPS = 3;

const ProjectCard = ({
    title,
    badge: _badge,
    description,
    logoUrl,
    thumbnail,
    heroImage,
    previewVideo,
    isHero = false,
    index,
    onClick,
}: ProjectCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const loopCountRef = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    // Does this card have a video preview?
    const hasVideo = !!previewVideo;

    // Handle video ended — loop up to MAX_LOOPS then pause on final frame
    const handleVideoEnded = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        loopCountRef.current += 1;
        if (loopCountRef.current < MAX_LOOPS) {
            video.currentTime = 0;
            video.play().catch(() => { });
        } else {
            // Pause on the final frame (don't reset to 0)
            video.pause();
        }
    }, []);

    // Attach ended listener
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener("ended", handleVideoEnded);
        return () => video.removeEventListener("ended", handleVideoEnded);
    }, [handleVideoEnded]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        const video = videoRef.current;
        if (video && previewVideo) {
            loopCountRef.current = 0;
            video.currentTime = 0;
            video.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        const video = videoRef.current;
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <motion.div
            layoutId={`card-${title}`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-2xl overflow-hidden bg-card border border-[#F3ECDC]/8 group cursor-pointer ${isHero ? "col-span-1" : ""
                }`}
            style={{ aspectRatio: "4 / 5" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -6 }}
        >
            {/* ─── Background layer ─── */}
            <div className="absolute inset-0">
                {/* Static gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#111111]" />

                {/* Static hero image background — for projects with .png images */}
                {heroImage && (
                    <img
                        src={heroImage}
                        alt={`${title} preview`}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            opacity: isHovered && hasVideo ? 0 : 1,
                            transition: "opacity 0.4s ease",
                        }}
                    />
                )}

                {/* Static thumbnail video — for projects with video thumbnails */}
                {!heroImage && thumbnail && (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={thumbnail}
                        muted
                        playsInline
                        preload="auto"
                        style={{
                            opacity: isHovered ? 0 : 1,
                            transition: "opacity 0.4s ease",
                        }}
                    />
                )}

                {/* Preview video — always mounted, plays on hover */}
                {previewVideo && (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={previewVideo}
                        muted
                        playsInline
                        preload="auto"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            transition: "opacity 0.4s ease",
                        }}
                    />
                )}

                {/* Gradient fade from bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>

            {/* ─── Hover shimmer edge ─── */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: "inset 0 0 0 1px rgba(243, 236, 220, 0.12)",
                }}
            />

            {/* ─── Bottom 1/3: Logo + Description ─── */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-start gap-2"
                style={{ minHeight: "33.33%" }}
                animate={{
                    y: isHovered ? 20 : 0,
                    opacity: isHovered ? 0 : 1,
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                {/* Logo — corrected filter for true off-white */}
                {logoUrl && (
                    <img
                        src={logoUrl}
                        alt={`${title} logo`}
                        className="h-7 w-auto"
                        style={{
                            filter:
                                "brightness(0) saturate(100%) invert(94%) sepia(7%) saturate(1062%) hue-rotate(313deg) brightness(101%) contrast(92%)",
                        }}
                    />
                )}

                {/* Description — "technical metadata" look */}
                <p
                    className="text-[10px] uppercase tracking-widest leading-relaxed font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    style={{ color: "rgba(243, 236, 220, 0.85)" }}
                >
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ProjectCard;
