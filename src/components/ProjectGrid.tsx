import ProjectCard from "./ProjectCard";
import { projects, Project, ProjectId } from "@/lib/projects";

interface ProjectGridProps {
    /** Project currently highlighted by the Impact Lens, or null for all. */
    spotlightId: ProjectId | null;
    onProjectSelect: (project: Project) => void;
}

/** Spacious 2 column bento grid of showcase cards. */
const ProjectGrid = ({ spotlightId, onProjectSelect }: ProjectGridProps) => (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {projects.map((project, index) => (
            <ProjectCard
                key={project.id}
                project={project}
                index={index}
                spotlit={spotlightId === project.id}
                dimmed={spotlightId !== null && spotlightId !== project.id}
                onClick={() => onProjectSelect(project)}
            />
        ))}
    </div>
);

export default ProjectGrid;
