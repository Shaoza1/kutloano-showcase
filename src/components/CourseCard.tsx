"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Award, Calendar, Clock } from "lucide-react";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    provider: string;
    course_type: string | null;
    completion_date: string | null;
    duration: string | null;
    skills_learned: string[] | null;
    document_url: string | null;
    document_name: string | null;
    document_type: string | null;
    document_size: number | null;
    cover_image_url: string | null;
    is_featured: boolean;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const handleDownload = async () => {
    if (!course.document_url) return;

    try {
      const documentUrl = `${SUPABASE_URL}/storage/v1/object/public/course-documents/${course.document_url}`;
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = course.document_name || `${course.title}.${course.document_type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handlePreview = () => {
    if (!course.document_url) return;
    const documentUrl = `${SUPABASE_URL}/storage/v1/object/public/course-documents/${course.document_url}`;
    window.open(documentUrl, '_blank');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return <FileText className="w-5 h-5" />;
    
    const iconMap: Record<string, any> = {
      pdf: <FileText className="w-5 h-5 text-red-500" />,
      docx: <FileText className="w-5 h-5 text-blue-500" />,
      doc: <FileText className="w-5 h-5 text-blue-500" />,
      pptx: <FileText className="w-5 h-5 text-orange-500" />,
      ppt: <FileText className="w-5 h-5 text-orange-500" />,
    };
    
    return iconMap[type.toLowerCase()] || <FileText className="w-5 h-5" />;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="glass hover-lift h-full border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Cover Image or Gradient */}
          <div className="h-40 relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-muted">
            {course.cover_image_url && (
              <img 
                src={course.cover_image_url} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {course.is_featured && (
                <Badge variant="secondary" className="glass">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {course.course_type && (
                <Badge variant="outline" className="glass text-xs">
                  {course.course_type}
                </Badge>
              )}
            </div>
          </div>

          <div className="p-5">
            {/* Provider */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs font-semibold">
                {course.provider}
              </Badge>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-lg font-bold mb-1 line-clamp-2">
              {course.title}
            </h3>
            {course.subtitle && (
              <p className="text-sm text-accent font-medium mb-2">
                {course.subtitle}
              </p>
            )}

            {/* Description */}
            {course.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {course.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
              {course.completion_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(course.completion_date), 'MMM yyyy')}
                </div>
              )}
              {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </div>
              )}
            </div>

            {/* Skills */}
            {course.skills_learned && course.skills_learned.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {course.skills_learned.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {course.skills_learned.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{course.skills_learned.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Document Actions */}
            {course.document_url && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  {getFileIcon(course.document_type)}
                  <span className="font-medium">
                    {course.document_name || 'Course Document'}
                  </span>
                  {course.document_size && (
                    <span className="ml-auto">
                      {formatFileSize(course.document_size)}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreview}
                    className="w-full"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}