import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects, Project } from "@/lib/projects";

interface ProjectGridProps {
    visible: boolean;
    onProjectSelect: (project: Project) => void;
}

const ProjectGrid = ({ visible, onProjectSelect }: ProjectGridProps) => {
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
                        Work
                    </div>
                </motion.div>

                {/* Grid - with proper spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            badge={project.badge}
                            description={project.description}
                            logoUrl={project.logoUrl}
                            projectUrl={project.projectUrl}
                            thumbnail={project.thumbnail}
                            heroImage={project.heroType === "image" ? project.heroMedia : undefined}
                            previewVideo={project.previewVideo}
                            isHero={index === 0}
                            index={index}
                            onClick={() => onProjectSelect(project)}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectGrid;
