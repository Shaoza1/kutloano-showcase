import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Profile data for CV generation
const profileData = {
  name: "Kutloano Moshao",
  title: "BSc Hons (Computing) • Full-Stack & AI-Curious Developer",
  tagline: "Building intelligent, user-centered solutions with modern web technologies and AI integration",
  university: "Botho University",
  degree: "BSc Hons in Computing",
  graduationDate: "November 2025",
  location: "Botswana",
  email: "kutloano.moshao@example.com",
  phone: "+267 xxx xxx xxx",
  github: "https://github.com/kutloanom",
  linkedin: "https://linkedin.com/in/kutloano-moshao",
  bio: "Passionate full-stack developer with a strong foundation in modern web technologies and emerging AI applications. Currently completing my Honours in Computing, I specialize in creating scalable web applications, progressive web apps, and intelligent systems that solve real-world problems.",
  skills: {
    frontend: ["React", "Vue.js", "Tailwind CSS", "TypeScript", "Progressive Web Apps"],
    backend: ["Python/Flask", "Node.js", "MySQL", "Firebase", "JWT Authentication"],
    ai: ["Machine Learning", "CNN/Computer Vision", "Natural Language Processing", "TensorFlow/Keras", "Data Analysis"],
    tools: ["Git/GitHub", "Docker", "Vercel/Netlify", "Figma", "VS Code"]
  },
  projects: [
    {
      title: "AgroSense - Smart Agriculture Advisor",
      description: "AI-powered PWA for modern farming with disease detection and offline capabilities",
      technologies: ["React", "Flask", "TensorFlow", "PWA", "Firebase"]
    },
    {
      title: "Store Management System",
      description: "Enterprise-grade inventory and sales platform with barcode scanning",
      technologies: ["Python", "Flask", "MySQL", "JWT", "Barcode API"]
    },
    {
      title: "Todo PWA Redesign",
      description: "Modern Kanban + Calendar integration with enhanced productivity features",
      technologies: ["Vue.js", "PWA", "IndexedDB", "Tailwind CSS"]
    }
  ],
  certifications: [
    "Cisco Intro to Cybersecurity (2024)",
    "Python Essentials 1 - Cisco Networking Academy (2024)"
  ]
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Track CV download
    const { error: trackingError } = await supabase
      .from("cv_downloads")
      .insert({
        download_type: "pdf",
        user_agent: req.headers.get("user-agent"),
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip")
      });

    if (trackingError) {
      console.error("Failed to track CV download:", trackingError);
    }

    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${profileData.name} - CV</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
        }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
        .name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .title { font-size: 16px; color: #6b7280; margin-bottom: 10px; }
        .contact-info { font-size: 14px; color: #4b5563; }
        .section { margin-bottom: 25px; }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e40af; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 5px; 
            margin-bottom: 15px; 
        }
        .bio { font-size: 15px; line-height: 1.7; color: #374151; text-align: justify; }
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .skill-category h4 { color: #1e40af; font-size: 14px; margin-bottom: 8px; }
        .skill-list { list-style: none; }
        .skill-list li { 
            background: #f3f4f6; 
            padding: 4px 8px; 
            margin: 3px 0; 
            border-radius: 4px; 
            font-size: 13px; 
            display: inline-block; 
            margin-right: 5px; 
        }
        .project { margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .project-title { font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .project-desc { font-size: 14px; color: #374151; margin-bottom: 8px; }
        .project-tech { font-size: 12px; color: #6b7280; }
        .education-item { margin-bottom: 15px; }
        .degree { font-weight: bold; color: #1e40af; }
        .university { color: #6b7280; font-size: 14px; }
        .cert-item { 
            background: #e0f2fe; 
            padding: 8px 12px; 
            margin: 5px 0; 
            border-radius: 6px; 
            font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${profileData.name}</div>
        <div class="title">${profileData.title}</div>
        <div class="contact-info">
            ${profileData.email} • ${profileData.phone} • ${profileData.location}<br>
            ${profileData.github} • ${profileData.linkedin}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="bio">${profileData.bio}</div>
    </div>

    <div class="section">
        <div class="section-title">Technical Skills</div>
        <div class="skills-grid">
            <div class="skill-category">
                <h4>Frontend Development</h4>
                <ul class="skill-list">
                    ${profileData.skills.frontend.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-category">
                <h4>Backend Development</h4>
                <ul class="skill-list">
                    ${profileData.skills.backend.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-category">
                <h4>AI & Machine Learning</h4>
                <ul class="skill-list">
                    ${profileData.skills.ai.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-category">
                <h4>Tools & Technologies</h4>
                <ul class="skill-list">
                    ${profileData.skills.tools.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Featured Projects</div>
        ${profileData.projects.map(project => `
            <div class="project">
                <div class="project-title">${project.title}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-tech"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        <div class="education-item">
            <div class="degree">${profileData.degree}</div>
            <div class="university">${profileData.university} • Expected ${profileData.graduationDate}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Certifications</div>
        ${profileData.certifications.map(cert => `<div class="cert-item">✓ ${cert}</div>`).join('')}
    </div>
</body>
</html>`;

    // For now, we'll return the HTML content as a downloadable file
    // In a production environment, you'd want to use a PDF generation library
    const response = new Response(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": "attachment; filename=\"Kutloano_Moshao_CV.html\"",
        ...corsHeaders,
      },
    });

    console.log("CV generated successfully");
    return response;

  } catch (error: any) {
    console.error("Error in generate-cv-pdf function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate CV" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);