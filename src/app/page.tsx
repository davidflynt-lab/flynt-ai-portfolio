"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBackground from "@/components/AuroraBackground";
import SearchInput from "@/components/SearchInput";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/lib/projects";

const Index = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Star field background — behind everything */}
      <div className="star-field" />

      {/* Aurora background */}
      <AuroraBackground />

      {/* Beta Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-blue-500/20 backdrop-blur-md text-center py-2 border-b border-blue-500/10">
        <p className="text-xs font-medium text-blue-200">
          Flynt.AI Beta — <a href="https://davidflynt.wixstudio.com/davidflynt" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer hover:text-off-white">View Legacy Portfolio</a>
        </p>
      </div>

      {/* Header - moved down slightly to accommodate banner */}
      <motion.header
        className="fixed top-8 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="text-sm text-muted-foreground pointer-events-auto">
          <span className="text-foreground font-medium">David Flynt</span>
          <span className="mx-2">/</span>
          <span>Lead Product Designer, AI</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium pointer-events-auto">
          Available for Staff Roles
        </div>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero section - centered in top 60% of viewport */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12"
          style={{ minHeight: '55vh' }}
          animate={{
            y: showProjects ? -30 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Heading */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-normal text-off-white mb-4 leading-[1.15] tracking-tight"
              style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif' }}
            >
              Designing the Interface<br />of Intelligence
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Watch the AI run a background check, or skip straight to the evidence below.
            </p>
          </motion.div>

          {/* Search input */}
          <SearchInput onComplete={() => setShowProjects(true)} />
        </motion.div>

        {/* Project grid - anchored to bottom */}
        <ProjectGrid
          visible={showProjects}
          onProjectSelect={setSelectedProject}
        />
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Subtle vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 4% / 0.4) 100%)`,
        }}
      />
    </div>
  );
};

export default Index;
