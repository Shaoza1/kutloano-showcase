"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Github, 
  Heart, 
  Eye, 
  Star,
  Play,
  Code2,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: {
    views: number;
    likes: number;
    stars: number;
  };
}

interface InteractiveProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
}

export default function InteractiveProjectCard({ 
  project, 
  onViewDetails 
}: InteractiveProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localMetrics, setLocalMetrics] = useState(project.metrics || { views: 0, likes: 0, stars: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Track view when component mounts
    if (!hasViewed) {
      trackInteraction('view');
      setHasViewed(true);
    }
  }, []);

  const trackInteraction = async (type: 'view' | 'demo_click' | 'github_click' | 'like') => {
    try {
      await supabase.from('project_interactions').insert({
        project_id: project.id,
        interaction_type: type,
        visitor_session: generateSessionId(),
        metadata: {
          project_title: project.title,
          timestamp: new Date().toISOString()
        }
      });

      // Update local metrics
      if (type === 'like') {
        setLocalMetrics(prev => ({
          ...prev,
          likes: prev.likes + (isLiked ? -1 : 1)
        }));
        setIsLiked(!isLiked);
      } else if (type === 'view') {
        setLocalMetrics(prev => ({
          ...prev,
          views: prev.views + 1
        }));
      }
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const generateSessionId = () => {
    const stored = sessionStorage.getItem('visitor_session');
    if (stored) return stored;
    
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('visitor_session', newSession);
    return newSession;
  };

  const handleLike = async () => {
    await trackInteraction('like');
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${project.title} ${isLiked ? 'removed from' : 'added to'} your favorites!`,
    });
  };

  const handleDemoClick = () => {
    trackInteraction('demo_click');
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank');
    }
  };

  const handleGithubClick = () => {
    trackInteraction('github_click');
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="relative overflow-hidden glass border-primary/20 hover:border-primary/40 transition-all duration-300">
        {project.featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isLiked 
                ? 'bg-red-500/20 text-red-500' 
                : 'bg-white/20 text-white hover:bg-red-500/20 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Overlay with metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <div className="flex gap-4 text-white">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{localMetrics.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{localMetrics.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">{localMetrics.stars}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.liveUrl && (
              <Button 
                size="sm" 
                onClick={handleDemoClick}
                className="flex-1 group/btn"
              >
                <Play className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                Live Demo
              </Button>
            )}
            
            {project.githubUrl && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleGithubClick}
                className="flex-1"
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            )}
            
            {onViewDetails && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onViewDetails(project)}
                className="px-3"
              >
                <Code2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Performance indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Fast Loading</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{localMetrics.views} views</span>
              <span>{localMetrics.likes} likes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}