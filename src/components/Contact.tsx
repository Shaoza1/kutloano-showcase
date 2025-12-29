"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, Github, Linkedin, Calendar, Download, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";

interface ContactProps {
  profile: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
  };
}

export default function Contact({ profile }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCVDownload = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/cv-upload`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch CV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Kutloano_Moshao_CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "CV Downloaded!",
        description: "Your CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error('CV download error:', error);
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-cv-pdf`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Kutloano_Moshao_CV.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (fallbackError) {
        toast({
          title: "Download Error",
          description: "Failed to download CV. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      };

      // Direct mailto link - guaranteed to work
      const emailBody = `From: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
      const mailtoLink = `mailto:kutloano.moshao111@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.location.href = mailtoLink;
      
      toast({
        title: "Email client opened",
        description: "Your email app has opened. Click Send to deliver your message.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Please email me directly at kutloano.moshao111@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate on your next project? Get in touch and let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always excited to discuss new opportunities, collaborate on interesting projects, 
                or simply connect with fellow developers. Whether you have a project in mind or just 
                want to say hello, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="glass border-0 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 gradient-primary rounded-2xl">
                        <Mail className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Email
                        </h4>
                        <p className="text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="glass border-0 hover-lift cursor-pointer" onClick={() => window.location.href = 'tel:+26657586176'}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 gradient-primary rounded-2xl">
                        <Phone className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Direct Call
                        </h4>
                        <p className="text-muted-foreground">+266 5758 6176</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="glass border-0 hover-lift cursor-pointer" onClick={() => window.open('https://wa.me/26657586176', '_blank')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 gradient-primary rounded-2xl">
                        <MessageSquare className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          WhatsApp Business
                        </h4>
                        <p className="text-muted-foreground">+266 5758 6176</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="glass border-0 hover-lift cursor-pointer" onClick={() => window.open('https://t.me/+26657586176', '_blank')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 gradient-primary rounded-2xl">
                        <Send className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Telegram
                        </h4>
                        <p className="text-muted-foreground">+266 5758 6176</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Connect on Social</h4>
              <div className="flex gap-4">
                <Button
                  size="icon-lg"
                  variant="glass"
                  className="hover:scale-110"
                  asChild
                >
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6" />
                  </a>
                </Button>
                
                <Button
                  size="icon-lg"
                  variant="glass"
                  className="hover:scale-110"
                  asChild
                >
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Download CV */}
            <div className="pt-8">
              <Button 
                size="lg" 
                variant="outline" 
                className="group w-full"
                onClick={handleCVDownload}
              >
                <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Download CV (PDF)
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 gradient-primary rounded-xl">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Send a Message</h3>
                    <p className="text-muted-foreground text-sm">I'll respond within 24 hours</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        className="glass border-0"
                        placeholder="Write your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        className="glass border-0"
                        placeholder="Write your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="glass border-0"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      className="glass border-0"
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      className="glass border-0 min-h-[120px] resize-none"
                      placeholder="Tell me about your project, ideas, or how we can work together..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    variant="gradient"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}