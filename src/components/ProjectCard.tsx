import { motion } from "framer-motion";

interface ProjectCardProps {
    title: string;
    badge: string;
    isHero?: boolean;
    index: number;
}

const badgeColors: Record<string, string> = {
    "AI & Search": "bg-aurora-cyan/20 text-cyan-400 border-cyan-400/30",
    "Founder": "bg-aurora-violet/20 text-violet-400 border-violet-400/30",
    "Scale": "bg-aurora-blue/20 text-blue-400 border-blue-400/30",
    "ML Tools": "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
};

const ProjectCard = ({ title, badge, isHero = false, index }: ProjectCardProps) => {
    return (
        <motion.div
            className={`relative rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer h-full flex flex-col ${isHero ? "col-span-1 row-span-1 md:col-span-1 md:row-span-1" : ""
                }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -8 }}
        >
            {/* Video placeholder - larger aspect ratio */}
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex-1">
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Animated gradient overlay on hover */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(135deg, hsl(187 94% 43% / 0.1), hsl(263 70% 50% / 0.1))`,
                    }}
                />

                {/* Play icon hint */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                    >
                        <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-foreground font-medium text-base leading-tight">
                        {title}
                    </h3>
                    <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border shrink-0 ${badgeColors[badge] || "bg-muted text-muted-foreground border-border"
                            }`}
                    >
                        {badge}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
