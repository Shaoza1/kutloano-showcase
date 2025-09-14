"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";

interface EducationProps {
  profile: {
    name: string;
    degree: string;
    university: string;
    graduationDate: string;
    location: string;
    education: {
      modules: string[];
    };
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  };
}

export default function Education({ profile }: EducationProps) {
  return (
    <section id="education" className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Education & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic foundation and professional certifications that support my technical expertise
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Degree Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-0 h-full">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 gradient-primary rounded-2xl">
                    <GraduationCap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{profile.degree}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{profile.university}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Expected {profile.graduationDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-6">
                  <h4 className="font-semibold mb-4 text-lg">Key Modules</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {profile.education.modules.map((module, index) => (
                      <motion.div
                        key={module}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{module}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-0 h-full">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 gradient-primary rounded-2xl">
                    <Award className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Professional Certifications</h3>
                    <p className="text-muted-foreground">Industry-recognized credentials</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {profile.certifications.map((cert, index) => (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="group p-6 gradient-card rounded-2xl border border-border/50 hover-lift"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {cert.name}
                          </h4>
                          <p className="text-muted-foreground mb-2">{cert.issuer}</p>
                          <Badge variant="secondary" className="text-xs">
                            {cert.date}
                          </Badge>
                        </div>
                        
                        {/* Certification Badge Placeholder */}
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                          <Award className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1, delay: index * 0.3 }}
                          viewport={{ once: true }}
                          className="h-full gradient-primary"
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Additional Learning */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="p-6 border-2 border-dashed border-border/50 rounded-2xl text-center"
                  >
                    <div className="text-muted-foreground mb-2">
                      <Award className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">Continuous Learning</p>
                      <p className="text-xs mt-1">Always pursuing new skills and certifications</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}