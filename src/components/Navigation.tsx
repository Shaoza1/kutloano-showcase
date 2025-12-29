"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Download } from "lucide-react";
import { downloadLatestCV } from "@/lib/cvUtils";

interface NavigationProps {
  profile: {
    name: string;
    shortName: string;
  };
}

export default function Navigation({ profile }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: "About", href: "#hero" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Courses", href: "#courses" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass backdrop-blur-xl border-b border-border/50" : ""
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection("#hero")}
              className="text-xl font-bold text-gradient hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profile.shortName}
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-medium transition-colors relative ${
                    activeSection === item.href.substring(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.href.substring(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
              
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-4"
                onClick={async () => {
                  try {
                    await downloadLatestCV();
                  } catch (error) {
                    console.error('Failed to download CV:', error);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                CV
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left py-3 text-sm font-medium transition-colors touch-manipulation ${
                    activeSection === item.href.substring(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full touch-manipulation"
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await downloadLatestCV();
                  } catch (error) {
                    console.error('Failed to download CV:', error);
                  }
                }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}