"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import StippledHero from "@/components/StippledHero";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectModal from "@/components/ProjectModal";
import ContactButton from "@/components/ContactButton";
import ContactLinks from "@/components/ContactLinks";
import { Project, ProjectId, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const SHOW_WAVE_BANNER = true;

const PILL_SPRING = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 };
const KNOB_SPRING = { type: "spring" as const, stiffness: 700, damping: 32 };
const ENTER_EASE = [0.22, 1, 0.36, 1] as const;

type FilterKey = "all" | ProjectId;

interface ImpactFilter {
    key: FilterKey;
    label: string;
}

/** Filters change the displayed work only after explicit selection. */
const IMPACT_FILTERS: ImpactFilter[] = [
    { key: "all", label: `All Work (${projects.length})` },
    { key: "papertrail", label: "0→1 Fintech AI · PaperTrail" },
    { key: "stellar-cyber", label: "Enterprise Threat AI · Stellar Cyber" },
    { key: "amazon", label: "Mobile Commerce · Amazon Books" },
    { key: "cisco", label: "Developer Systems · Cisco" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PROJECT_CHANGE = "portfolio-project-change";
const subscribeToProject = (notify: () => void) => {
    window.addEventListener("popstate", notify);
    window.addEventListener(PROJECT_CHANGE, notify);
    return () => {
        window.removeEventListener("popstate", notify);
        window.removeEventListener(PROJECT_CHANGE, notify);
    };
};
const readProjectId = () => new URLSearchParams(window.location.search).get("project") ?? "";
const serverProjectId = () => "";

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
    const heroRef = useRef<HTMLElement>(null);
    const [isDark, setIsDark] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
    const projectId = useSyncExternalStore(subscribeToProject, readProjectId, serverProjectId);
    const selectedProject = projects.find((project) => project.id === projectId) ?? null;

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
    };

    const openModal = useCallback((project: Project) => {
        const url = new URL(window.location.href);
        url.searchParams.set("project", project.id);
        window.history.pushState({ ...window.history.state, portfolioModal: true }, "", url);
        window.dispatchEvent(new Event(PROJECT_CHANGE));
    }, []);

    const navigateCase = useCallback((project: Project) => {
        const url = new URL(window.location.href);
        url.searchParams.set("project", project.id);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new Event(PROJECT_CHANGE));
    }, []);

    const closeModal = useCallback(() => {
        if (window.history.state?.portfolioModal) {
            window.history.back();
        } else {
            const url = new URL(window.location.href);
            url.searchParams.delete("project");
            window.history.replaceState(window.history.state, "", url);
            window.dispatchEvent(new Event(PROJECT_CHANGE));
        }
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-background text-foreground">
                {/* ─── Header ─── */}
                <motion.header
                    className="fixed inset-x-0 top-0 z-40 bg-background/70 text-foreground backdrop-blur-2xl backdrop-saturate-150"
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
                            <div className="flex shrink-0 items-center gap-1">
                                <ContactButton />
                                <ContactLinks includeEmail={false} placement="below" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden whitespace-nowrap text-sm text-muted-foreground lg:inline">
                                Agentic Workflows, AI Systems & Dev Platforms
                            </span>
                            <span className="hidden text-sm text-muted-foreground/40 lg:inline" aria-hidden="true">
                                |
                            </span>
                            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                        </div>
                    </div>
                </motion.header>

                <main>
                    <StippledHero sectionRef={heroRef} suspended={!!selectedProject} showBanner={SHOW_WAVE_BANNER} />

                    {/* ─── Impact Lens filter bar (sticks under the header while browsing) ─── */}
                    <motion.section
                        aria-label="Filter work"
                        className="sticky top-16 z-30 bg-background/70 backdrop-blur-2xl backdrop-saturate-150"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: ENTER_EASE }}
                    >
                        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
                            <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:inline">
                                Selected work
                            </span>
                            <div className="no-scrollbar -mx-6 min-w-0 flex-1 overflow-x-auto px-6 lg:mx-0 lg:px-0">
                                <div
                                    className="inline-flex gap-1 rounded-full bg-surface p-1.5"
                                >
                                    {IMPACT_FILTERS.map((filter) => {
                                        const isLit = activeFilter === filter.key;
                                        return (
                                            <button
                                                key={filter.key}
                                                type="button"
                                                aria-pressed={activeFilter === filter.key}
                                                onClick={() => selectFilter(filter.key)}
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
                    <section id="work" aria-label="Selected work" className="mx-auto max-w-7xl scroll-mt-36 px-6 pb-28 pt-8">
                        <ProjectGrid filterId={activeFilter === "all" ? null : activeFilter} onProjectSelect={openModal} />
                    </section>
                </main>

                <footer className="border-t border-zinc-200 dark:border-zinc-800">
                    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-md">
                            <p className="text-sm font-medium leading-relaxed">David Flynt — Lead Product Designer &amp; Design Engineer · San Francisco Bay Area</p>
                            <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">Architected in Next.js, TypeScript &amp; Tailwind CSS.</p>
                        </div>
                        <nav aria-label="Contact and links" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                            <ContactLinks />
                            <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" href="https://github.com/davidflynt-lab" target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a>
                            <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" href="https://papertrail.finance" target="_blank" rel="noopener noreferrer">Live Product: papertrail.finance ↗<span className="sr-only"> (opens in a new tab)</span></a>
                        </nav>
                    </div>
                </footer>

                <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={closeModal} onNavigate={navigateCase} />
            </div>
        </MotionConfig>
    );
};

export default Index;
