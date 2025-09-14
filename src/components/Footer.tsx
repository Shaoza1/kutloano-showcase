"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react";

interface FooterProps {
  profile: {
    name: string;
    shortName: string;
    email: string;
    github: string;
    linkedin: string;
  };
}

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About", href: "#hero" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-gradient">{profile.name}</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Full-stack developer specializing in modern web technologies, AI integration, 
                and creating exceptional digital experiences that solve real-world problems.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="glass hover:scale-110"
                  asChild
                >
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="glass hover:scale-110"
                  asChild
                >
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="glass hover:scale-110"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a 
                    href={`mailto:${profile.email}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="text-sm">Within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span>© {currentYear} {profile.name}. Built with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using React, Tailwind CSS & Framer Motion</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              {/* Performance Badge */}
              <Badge variant="secondary" className="text-xs">
                Lighthouse Score: 95+
              </Badge>
              
              {/* Back to Top */}
              <Button
                size="sm"
                variant="ghost"
                onClick={scrollToTop}
                className="text-xs"
              >
                Back to Top
                <ExternalLink className="w-3 h-3 ml-1 rotate-[-90deg]" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}