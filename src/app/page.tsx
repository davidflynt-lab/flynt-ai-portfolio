"use client";

import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectModal from "@/components/ProjectModal";
import ContactButton from "@/components/ContactButton";
import { Project, ProjectId, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const PILL_SPRING = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 };
const KNOB_SPRING = { type: "spring" as const, stiffness: 700, damping: 32 };
const ENTER_EASE = [0.22, 1, 0.36, 1] as const;

type FilterKey = "all" | ProjectId;

interface ImpactFilter {
    key: FilterKey;
    label: string;
}

/** Impact Lens: each pill spotlights one project card. */
const IMPACT_FILTERS: ImpactFilter[] = [
    { key: "all", label: `All Systems (${projects.length})` },
    { key: "stellar-cyber", label: "2,800 WAU Threat AI" },
    { key: "papertrail", label: "85% Confidence Threshold UI" },
    { key: "amazon", label: "Global Series Customization" },
    { key: "cisco", label: "6 Mo → 2 Wk Test Automation" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Spring physics theme switch ─── */
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Dark mode"
        onClick={onToggle}
        className={cn(
            "flex h-8 w-14 shrink-0 items-center rounded-full bg-surface p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60",
            isDark ? "justify-end" : "justify-start"
        )}
    >
        <motion.span
            layout
            transition={KNOB_SPRING}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground shadow-elevation dark:bg-foreground dark:text-background"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                    transition={KNOB_SPRING}
                >
                    {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </motion.span>
            </AnimatePresence>
        </motion.span>
    </button>
);

const Index = () => {
    const [isDark, setIsDark] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
    const [hoveredFilter, setHoveredFilter] = useState<FilterKey | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Hover previews a lens; otherwise the clicked lens stays engaged.
    const lens = hoveredFilter ?? activeFilter;
    const spotlightId: ProjectId | null = lens === "all" ? null : lens;

    const toggleTheme = useCallback(() => {
        const next = !isDark;
        const apply = () => {
            document.documentElement.classList.toggle("dark", next);
            flushSync(() => setIsDark(next));
        };
        // Cross fade the whole page where View Transitions are supported.
        if (typeof document.startViewTransition === "function" && !prefersReducedMotion()) {
            document.startViewTransition(apply);
        } else {
            apply();
        }
    }, [isDark]);

    const selectFilter = (key: FilterKey) => {
        setActiveFilter(key);
        if (key === "all") return;
        // Bring the spotlit card into view if it is off screen.
        const card = document.getElementById(`project-${key}`);
        if (!card) return;
        const { top, bottom } = card.getBoundingClientRect();
        if (top < 140 || bottom > window.innerHeight) {
            card.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        }
    };

    const closeModal = useCallback(() => setSelectedProject(null), []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-background text-foreground">
                {/* ─── Header ─── */}
                <motion.header
                    className="fixed inset-x-0 top-0 z-40 bg-background/70 backdrop-blur-2xl backdrop-saturate-150"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: ENTER_EASE }}
                >
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="whitespace-nowrap text-sm font-semibold tracking-tight">David Flynt</span>
                            <span className="text-sm text-muted-foreground/40" aria-hidden="true">
                                |
                            </span>
                            <ContactButton />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden whitespace-nowrap text-sm text-muted-foreground md:inline">
                                Lead Product Designer & Design Engineer
                            </span>
                            <span className="hidden text-sm text-muted-foreground/40 md:inline" aria-hidden="true">
                                |
                            </span>
                            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                        </div>
                    </div>
                </motion.header>

                <main>
                    {/* ─── Hero ─── */}
                    <section className="mx-auto max-w-7xl px-6 pb-12 pt-36 md:pb-16 md:pt-44">
                        <motion.h1
                            className="max-w-5xl text-[44px] font-semibold leading-[0.98] tracking-display sm:text-6xl md:text-7xl lg:text-[92px]"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, ease: ENTER_EASE }}
                        >
                            Designing the Interface <br className="hidden md:block" />
                            of Intelligence
                        </motion.h1>
                        <motion.p
                            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: ENTER_EASE }}
                        >
                            8+ years architecting AI native systems, agentic workflows, and enterprise developer
                            platforms. Combining systems thinking and human in the loop craft with production code
                            fluency in React, Next.js, TypeScript, Claude Code, and Cursor.
                        </motion.p>
                    </section>

                    {/* ─── Impact Lens filter bar (sticks under the header while browsing) ─── */}
                    <motion.section
                        aria-label="Impact Lens"
                        className="sticky top-16 z-30 bg-background/70 backdrop-blur-2xl backdrop-saturate-150"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: ENTER_EASE }}
                    >
                        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
                            <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:inline">
                                Impact Lens
                            </span>
                            <div className="no-scrollbar -mx-6 min-w-0 flex-1 overflow-x-auto px-6 lg:mx-0 lg:px-0">
                                <div
                                    className="inline-flex gap-1 rounded-full bg-surface p-1.5"
                                    onMouseLeave={() => setHoveredFilter(null)}
                                >
                                    {IMPACT_FILTERS.map((filter) => {
                                        const isLit = lens === filter.key;
                                        return (
                                            <button
                                                key={filter.key}
                                                type="button"
                                                aria-pressed={activeFilter === filter.key}
                                                onClick={() => selectFilter(filter.key)}
                                                onMouseEnter={() => setHoveredFilter(filter.key)}
                                                onFocus={() => setHoveredFilter(filter.key)}
                                                onBlur={() => setHoveredFilter(null)}
                                                className={cn(
                                                    "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60",
                                                    isLit ? "text-background" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {isLit && (
                                                    <motion.span
                                                        layoutId="activeFilter"
                                                        className="absolute inset-0 rounded-full bg-foreground shadow-elevation"
                                                        transition={PILL_SPRING}
                                                    />
                                                )}
                                                <span className="relative z-10">{filter.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* ─── 2x2 Bento showcase ─── */}
                    <section aria-label="Selected work" className="mx-auto max-w-7xl px-6 pb-28 pt-8">
                        <ProjectGrid spotlightId={spotlightId} onProjectSelect={setSelectedProject} />
                    </section>
                </main>

                <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={closeModal} />
            </div>
        </MotionConfig>
    );
};

export default Index;
