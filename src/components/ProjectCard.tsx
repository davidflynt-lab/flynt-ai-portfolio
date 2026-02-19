"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectCardProps {
    title: string;
    badge: string;
    description: string;
    logoUrl?: string;
    projectUrl?: string; // Added prop
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
    projectUrl, // Destructure prop
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
    // Simplified: Native loop attribute is used instead per request.

    // Attach ended listener
    // Removed as we use native loop now.

    const handleMouseEnter = () => {
        setIsHovered(true);
        const video = videoRef.current;
        if (video && previewVideo) {
            // Ensure it plays if paused (though autoPlay handles most cases)
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

                {/* Video Fallback Thumbnail — static image behind video */}
                {!heroImage && thumbnail && (
                    <img
                        src={thumbnail}
                        alt={`${title} thumbnail`}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            // Always visible as base layer, video fades in on top
                            zIndex: 0
                        }}
                    />
                )}

                {/* Preview video — always mounted, plays on hover */}
                {previewVideo && (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        src={previewVideo}
                        autoPlay
                        loop
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
                {/* Logo — corrected for natural brand colors */}
                {logoUrl && (
                    projectUrl ? (
                        <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity block z-20 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={logoUrl}
                                alt={`${title} logo`}
                                className="h-7 w-auto"
                            />
                        </a>
                    ) : (
                        <img
                            src={logoUrl}
                            alt={`${title} logo`}
                            className="h-7 w-auto"
                        />
                    )
                )}

                {/* Description — "technical metadata" look */}
                <p
                    className="text-[10px] uppercase tracking-widest leading-relaxed font-bold shadow-black/80 drop-shadow-md"
                    style={{ color: "rgba(243, 236, 220, 0.85)" }}
                >
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ProjectCard;
