"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CourseCard from "./CourseCard";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Course {
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
  is_published?: boolean;
}

export default function CoursesLabs() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_courses')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(courses.map(c => c.provider))];
    return ["all", ...uniqueProviders];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (selectedProvider === "all") return courses;
    return courses.filter(c => c.provider === selectedProvider);
  }, [courses, selectedProvider]);

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="courses" className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Courses & <span className="text-gradient">Labs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional development, certifications, and hands-on lab work demonstrating practical skills and continuous learning
          </p>
        </motion.div>

        {/* Provider Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {providers.map((provider) => (
            <Button
              key={provider}
              variant={selectedProvider === provider ? "gradient" : "outline"}
              size="sm"
              onClick={() => handleProviderChange(provider)}
              className="capitalize"
            >
              {provider === "all" ? "All Providers" : provider}
            </Button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Courses Grid */}
        {!loading && filteredCourses.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Courses found in storage: {courses.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}