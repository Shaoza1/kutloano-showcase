"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Building Offline-First PWAs with React and IndexedDB",
    excerpt: "Learn how to create progressive web applications that work seamlessly offline using modern web technologies and smart caching strategies.",
    category: "Frontend",
    readTime: "8 min read",
    publishedAt: "2024-03-15",
    tags: ["React", "PWA", "IndexedDB", "Offline"],
    image: "/blog/pwa-guide.png"
  },
  {
    id: 2,
    title: "Computer Vision in Agriculture: My Experience Building AgroSense",
    excerpt: "A deep dive into implementing CNN models for crop disease detection and the challenges of deploying AI in agricultural settings.",
    category: "AI/ML",
    readTime: "12 min read",
    publishedAt: "2024-02-28",
    tags: ["AI", "Computer Vision", "Agriculture", "TensorFlow"],
    image: "/blog/agrosense-ai.png"
  },
  {
    id: 3,
    title: "Modern Authentication Patterns with JWT and Refresh Tokens",
    excerpt: "Implementing secure, scalable authentication systems with proper token management and role-based access control.",
    category: "Backend",
    readTime: "10 min read",
    publishedAt: "2024-02-10",
    tags: ["JWT", "Authentication", "Security", "Backend"],
    image: "/blog/auth-patterns.png"
  },
  {
    id: 4,
    title: "From Idea to Production: Lessons from Building a Store Management System",
    excerpt: "Real-world insights from developing an enterprise-grade inventory management system, including architecture decisions and scaling considerations.",
    category: "Case Study",
    readTime: "15 min read",
    publishedAt: "2024-01-20",
    tags: ["Case Study", "Enterprise", "Architecture", "Python"],
    image: "/blog/store-system.png"
  }
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 gradient-primary rounded-xl">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Insights & <span className="text-gradient">Learning</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical deep-dives, project case studies, and insights from my development journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-0 hover-lift group overflow-hidden h-full">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn p-0 h-auto hover:bg-transparent"
                  >
                    Read full article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            View All Articles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}