import ProjectCard from "./ProjectCard";
import { AnimatePresence, motion } from "framer-motion";
import { projects, Project, ProjectId } from "@/lib/projects";

interface ProjectGridProps {
    filterId: ProjectId | null;
    onProjectSelect: (project: Project) => void;
}

/** Spacious 2 column bento grid of showcase cards. */
const ProjectGrid = ({ filterId, onProjectSelect }: ProjectGridProps) => (
    <motion.div layout className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
        {projects.filter((project) => !filterId || project.id === filterId).map((project, index) => (
            <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => onProjectSelect(project)}
            />
        ))}
        </AnimatePresence>
    </motion.div>
);

export default ProjectGrid;
