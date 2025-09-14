"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface ProjectFilterProps {
  projects: any[];
  onFilteredProjectsChange: (projects: any[]) => void;
}

export default function ProjectFilter({ projects, onFilteredProjectsChange }: ProjectFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.category || []))
  );

  // Filter projects based on search term and selected tags
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some((tech: string) => 
                           tech.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => project.category?.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Update parent component when filtered projects change
  React.useEffect(() => {
    onFilteredProjectsChange(filteredProjects);
  }, [filteredProjects, onFilteredProjectsChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass border-0"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="text-xs text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="mt-4 text-sm text-muted-foreground">
        {filteredProjects.length === projects.length ? (
          `Showing all ${projects.length} projects`
        ) : (
          `Showing ${filteredProjects.length} of ${projects.length} projects`
        )}
        {selectedTags.length > 0 && (
          <span className="ml-2">
            filtered by: {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="ml-1 text-xs">
                {tag}
              </Badge>
            ))}
          </span>
        )}
      </div>
    </motion.div>
  );
}