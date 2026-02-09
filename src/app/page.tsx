"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuroraBackground from "@/components/AuroraBackground";
import SearchInput from "@/components/SearchInput";
import ProjectGrid from "@/components/ProjectGrid";

const Index = () => {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora background */}
      <AuroraBackground />

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">David Flynt</span>
          <span className="mx-2">/</span>
          <span>Lead Product Designer, AI</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Searching for an AI-native Lead Designer?
            </h1>
            <p className="text-sm text-muted-foreground">
              Watch the AI run a background check, or skip straight to the evidence below.
            </p>
          </motion.div>

          {/* Search input */}
          <SearchInput onComplete={() => setShowProjects(true)} />
        </motion.div>

        {/* Project grid - anchored to bottom */}
        <ProjectGrid visible={showProjects} />
      </div>

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
