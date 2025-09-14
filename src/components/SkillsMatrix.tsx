"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillsMatrixProps {
  skills: {
    frontend: Skill[];
    backend: Skill[];
    ai: Skill[];
    tools: Skill[];
  };
}

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", label: "All Skills", color: "gradient" },
    { id: "frontend", label: "Frontend", color: "hero" },
    { id: "backend", label: "Backend", color: "secondary" },
    { id: "ai", label: "AI/ML", color: "accent" },
    { id: "tools", label: "Tools", color: "outline" },
  ];

  const allSkills = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.ai,
    ...skills.tools,
  ];

  const filteredSkills = activeCategory === "all" 
    ? allSkills 
    : allSkills.filter(skill => skill.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Skills & Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across different domains
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? category.color as any : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="transition-all duration-300"
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${skill.category}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="glass hover-lift h-full border-0">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="text-xs capitalize"
                    >
                      {skill.category}
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ 
                          duration: 1, 
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                        className="h-full gradient-primary rounded-full relative"
                      >
                        <motion.div
                          animate={{ x: [-100, 100] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.1
                          }}
                          className="absolute inset-0 bg-white/20 w-20 transform -skew-x-12"
                        />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Skill Level Indicator */}
                  <div className="mt-4 text-right">
                    <span className="text-xs font-medium text-muted-foreground">
                      {skill.level >= 80 ? "Expert" : 
                       skill.level >= 60 ? "Advanced" : 
                       skill.level >= 40 ? "Intermediate" : "Beginner"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: "Technologies", value: allSkills.length },
            { label: "Expert Level", value: allSkills.filter(s => s.level >= 80).length },
            { label: "Categories", value: Object.keys(skills).length },
            { label: "Avg Proficiency", value: Math.round(allSkills.reduce((acc, s) => acc + s.level, 0) / allSkills.length) + "%" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gradient mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}