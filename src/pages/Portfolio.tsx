"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SkillsMatrix from "@/components/SkillsMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import Education from "@/components/Education";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";

export default function Portfolio() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view
    trackPageView('portfolio');
    
    // Update document title for better SEO and accessibility
    document.title = `${profileData.name} - Full-Stack Developer Portfolio`;
    
    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profileData.name,
      "jobTitle": "Full-Stack Developer",
      "description": profileData.tagline,
      "url": "https://kutloano-portfolio.vercel.app",
      "sameAs": [
        profileData.github,
        profileData.linkedin
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": profileData.university
      },
      "knowsAbout": profileData.skills.frontend.map(skill => skill.name)
        .concat(profileData.skills.backend.map(skill => skill.name))
    };

    // Add JSON-LD structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <main className="min-h-screen">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        {/* Navigation */}
        <Navigation profile={profileData} />
        
        <div id="main-content">
          {/* Hero Section */}
          <Hero profile={profileData} />
          
          {/* Skills Matrix */}
          <SkillsMatrix skills={profileData.skills} />
          
          {/* Featured Projects */}
          <ProjectShowcase projects={projectsData.featured} />
          
          {/* Education & Certifications */}
          <Education profile={profileData} />
          
          {/* Blog & Insights */}
          <Blog />
          
          {/* Contact */}
          <Contact profile={profileData} />
          
          {/* Performance Monitor */}
          <PerformanceMonitor />
        </div>
        
        {/* Footer */}
        <Footer profile={profileData} />
      </main>
      <Toaster />
    </ThemeProvider>
  );
}