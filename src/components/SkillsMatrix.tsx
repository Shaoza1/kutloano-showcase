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
    cloud: Skill[];
  };
}

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", label: "All Skills", color: "gradient" },
    { id: "frontend", label: "Frontend", color: "hero" },
    { id: "backend", label: "Backend", color: "secondary" },
    { id: "ai", label: "AI/ML", color: "accent" },
    { id: "cloud", label: "Cloud", color: "outline" },
  ];

  const allSkills = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.ai,
    ...skills.cloud,
  ];

  let filteredSkills = allSkills;
  if (activeCategory === "frontend") filteredSkills = skills.frontend;
  if (activeCategory === "backend") filteredSkills = skills.backend;
  if (activeCategory === "ai") filteredSkills = skills.ai;
  if (activeCategory === "cloud") filteredSkills = skills.cloud;

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

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${activeCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="glass hover-lift h-full border-0">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {skill.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                        className="h-full gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                  
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
      </div>
    </section>
  );
}