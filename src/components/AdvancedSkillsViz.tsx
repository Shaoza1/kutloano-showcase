"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  Code, 
  Database,
  Cloud,
  Palette,
  Zap,
  Brain
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
  experience: string;
  projects: number;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'design' | 'ai';
  trending?: boolean;
  certifications?: string[];
}

const skillIcons = {
  frontend: Code,
  backend: Database,
  database: Database,
  cloud: Cloud,
  design: Palette,
  ai: Brain
};

export default function AdvancedSkillsViz() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animationDelay, setAnimationDelay] = useState(0);

  const skills: Skill[] = [
    {
      name: "React/Next.js",
      level: 95,
      experience: "3+ years",
      projects: 15,
      category: "frontend",
      trending: true,
      certifications: ["React Developer Certification"]
    },
    {
      name: "TypeScript",
      level: 90,
      experience: "2+ years",
      projects: 12,
      category: "frontend",
      trending: true
    },
    {
      name: "Node.js",
      level: 88,
      experience: "3+ years",
      projects: 10,
      category: "backend"
    },
    {
      name: "Python",
      level: 85,
      experience: "2+ years",
      projects: 8,
      category: "backend",
      certifications: ["Python Institute PCAP"]
    },
    {
      name: "PostgreSQL",
      level: 82,
      experience: "2+ years",
      projects: 6,
      category: "database"
    },
    {
      name: "AWS",
      level: 78,
      experience: "1+ years",
      projects: 5,
      category: "cloud",
      certifications: ["AWS Cloud Practitioner"]
    },
    {
      name: "Figma/UI Design",
      level: 80,
      experience: "2+ years",
      projects: 12,
      category: "design"
    },
    {
      name: "AI/ML",
      level: 75,
      experience: "1+ years",
      projects: 4,
      category: "ai",
      trending: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Skills', icon: TrendingUp },
    { id: 'frontend', label: 'Frontend', icon: Code },
    { id: 'backend', label: 'Backend', icon: Database },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'cloud', label: 'Cloud', icon: Cloud },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'ai', label: 'AI/ML', icon: Brain }
  ];

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  useEffect(() => {
    setAnimationDelay(0);
  }, [selectedCategory]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold mb-4">
            Skills <span className="text-gradient">Proficiency</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization of my technical expertise across different domains
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredSkills.map((skill, index) => {
              const Icon = skillIcons[skill.category];
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass hover:border-primary/40 transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                        </div>
                        {skill.trending && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Proficiency</span>
                          <span className="text-sm text-primary font-bold">{skill.level}%</span>
                        </div>
                        <Progress 
                          value={skill.level} 
                          className="h-2"
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{skill.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{skill.projects} projects</span>
                        </div>
                      </div>

                      {/* Certifications */}
                      {skill.certifications && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Certified</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skill.certifications.map((cert) => (
                              <Badge key={cert} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="text-center glass">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {skills.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Core Technologies
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center glass">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {skills.reduce((acc, skill) => acc + skill.projects, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Projects
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center glass">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {skills.filter(skill => skill.certifications).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Certifications
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center glass">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Avg. Proficiency
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}