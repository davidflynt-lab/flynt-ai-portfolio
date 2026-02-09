import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ArrowRight } from "lucide-react";

const projects = [
    {
        title: "Stellar Cyber: AI Investigator",
        badge: "AI & Search",
        isHero: true,
    },
    {
        title: "PaperTrail",
        badge: "Founder",
    },
    {
        title: "Amazon Books",
        badge: "Scale",
    },
    {
        title: "Cisco CQE",
        badge: "ML Tools",
    },
];

interface ProjectGridProps {
    visible: boolean;
}

const ProjectGrid = ({ visible }: ProjectGridProps) => {
    if (!visible) return null;

    return (
        <motion.div
            className="pb-8 px-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className="container max-w-6xl mx-auto">
                {/* Header - aligned to top of grid */}
                <motion.div
                    className="flex items-center justify-between mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="px-4 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground">
                        Projects
                    </div>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                        Browse all
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Grid - with proper spacing */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            title={project.title}
                            badge={project.badge}
                            isHero={project.isHero}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectGrid;
