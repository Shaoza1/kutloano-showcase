"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Github, 
  Code, 
  Monitor, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  BarChart3
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ProjectModalProps {
  project: any;
  trigger: React.ReactNode;
}

export default function ProjectModal({ project, trigger }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { trackProjectView } = useAnalytics();

  const handleOpen = () => {
    trackProjectView(project.id, project.title);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images?.length - 1 : prev - 1
    );
  };

  return (
    <Dialog onOpenChange={(open) => open && handleOpen()}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {project.category?.map((cat: string) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                {project.links?.live && (
                  <Button size="sm" asChild>
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.links?.github && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{project.year}</p>
                  <p className="text-sm text-muted-foreground">Year</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{project.duration}</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{project.team}</p>
                  <p className="text-sm text-muted-foreground">Team</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{project.status}</p>
                  <p className="text-sm text-muted-foreground">Status</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-64 lg:h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              
              {project.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {project.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Implementation
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h3>Project Overview</h3>
                <p>{project.longDescription}</p>
                
                <h4>Problem Statement</h4>
                <p>{project.problem}</p>
                
                <h4>Solution</h4>
                <p>{project.solution}</p>
                
                <h4>Key Features</h4>
                <ul>
                  {project.keyFeatures?.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Technical Architecture</h3>
                    <div className="space-y-3">
                      {Object.entries(project.architecture || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="text-muted-foreground text-sm">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech: string) => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Development Approach</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {project.approach?.map((step: string, index: number) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>

                <h3 className="font-semibold mt-6">Challenges & Solutions</h3>
                <div className="space-y-4">
                  {project.challenges?.map((item: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm mb-2">Challenge:</h4>
                        <p className="text-sm text-muted-foreground mb-3">{item.challenge}</p>
                        <h4 className="font-medium text-sm mb-2">Solution:</h4>
                        <p className="text-sm">{item.solution}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {project.results?.metrics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.results.metrics.map((metric: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{metric.value}</p>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {project.results?.impact && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Impact & Results</h3>
                    <p className="text-sm">{project.results.impact}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}