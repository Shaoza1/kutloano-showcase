# Kutloano Moshao - Professional Portfolio

A modern, responsive, and accessible portfolio website showcasing full-stack development skills, AI projects, and professional experience. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🌟 Live Demo

**Portfolio**: [https://kutloano-showcase.vercel.app](https://kutloano-showcase.vercel.app)

## 🚀 Features

### **Professional Presentation**
- **Modern Design System**: Blue-purple gradient theme with glass morphism effects
- **Fully Responsive**: Mobile-first design optimized for all devices
- **Smooth Animations**: Framer Motion powered micro-interactions and scroll animations
- **SEO Optimized**: Structured data, meta tags, and accessibility features

### **Interactive Components**
- **Skills Matrix**: Filterable skills with proficiency indicators (Frontend, Backend, AI/ML, Cloud)
- **Project Showcase**: Real project screenshots with detailed case study modals
- **Certificate Management**: PDF certificate downloads with badge display
- **Contact Form**: Multiple contact methods (WhatsApp, Telegram, Email, Direct Call)
- **Admin Dashboard**: Comprehensive content management system

### **Real Data Integration**
- **Contact Information**: Real phone (+266 5758 6176), email, Lesotho location
- **Work Experience**: Sokul Automation (AWS IoT Intern), IMZ Marketing (Sales Executive)
- **Projects**: AgroSense (live demo), Sesotho AI Platform with real GitHub repositories
- **Certifications**: 3 Cisco certifications with actual badges and PDF downloads
- **Education**: 22 Botho University modules, UNDP AI Hackathon Finalist

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Vite** - Fast build tool and development server

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Functions** - Serverless functions for contact form and CV generation
- **Row Level Security** - Secure data access policies

### **UI Components**
- **shadcn/ui** - Modern, accessible UI components
- **Lucide Icons** - Beautiful, consistent iconography
- **Custom Components** - Tailored components for portfolio needs

## 📁 Project Structure

```
kutloano-showcase/
├── public/
│   ├── badges/              # Certification badge images
│   ├── certificates/        # PDF certificates (8 files)
│   ├── projects/           # Project screenshots
│   │   ├── agrosense/      # AgroSense platform screenshots (24 images)
│   │   └── sesotho-ai/     # Sesotho AI platform screenshots (7 images)
│   ├── data/               # Static data files
│   └── resume.json         # Resume data in JSON Resume format
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── Hero.tsx       # Landing section with certifications
│   │   ├── SkillsMatrix.tsx    # Skills visualization with filtering
│   │   ├── ProjectShowcase.tsx # Project gallery with modals
│   │   ├── Education.tsx       # Education and certifications
│   │   ├── Contact.tsx         # Contact form and methods
│   │   └── CoursesLabs.tsx     # Certificate management
│   ├── data/              # JSON content files
│   │   ├── profile.json   # Personal information and skills
│   │   └── projects.json  # Project details and metadata
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── pages/             # Page components
├── supabase/              # Backend configuration
│   ├── functions/         # Serverless functions
│   └── migrations/        # Database schema
└── Configuration files    # Build and deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/pieterportfolio111/kutloano-showcase.git

# Navigate to project directory
cd kutloano-showcase

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:8080`

## 📝 Content Management

All content is stored in JSON files for easy editing:

### Profile Information (`src/data/profile.json`)
- Personal information (name, title, contact details)
- Skills and proficiency levels (Frontend, Backend, AI/ML, Cloud)
- Education details and modules
- Certifications with badge references
- Work experience and achievements

### Projects (`src/data/projects.json`)
- Featured projects with detailed case studies
- Technology stacks and categories
- Real project URLs and GitHub repositories
- Project screenshots and architecture details
- Results and impact metrics

### Resume Data (`public/resume.json`)
- JSON Resume format for structured data
- Work experience and education
- Skills and certifications
- Projects and achievements

## 🎨 Customization

### Design System
The design system uses CSS variables defined in `src/index.css`:
```css
:root {
  --primary: 239 84% 67%;  /* Main brand color */
  --accent: 271 91% 65%;   /* Secondary accent */
  --background: 0 0% 100%; /* Background color */
  --foreground: 222.2 84% 4.9%; /* Text color */
}
```

### Adding New Projects
```json
{
  "id": "project-id",
  "title": "Project Title",
  "subtitle": "Short Description",
  "description": "Detailed description",
  "technologies": ["React", "TypeScript", "Node.js"],
  "category": ["Web", "AI", "Production"],
  "status": "Production",
  "year": "2025",
  "links": {
    "live": "https://project-url.com",
    "github": "https://github.com/username/repo"
  },
  "images": [
    "/projects/project-name/screenshot1.png",
    "/projects/project-name/screenshot2.png"
  ]
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy automatically on every push

### Manual Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance Features

- **Lazy Loading**: Images and components load as needed
- **Code Splitting**: Optimized bundle sizes
- **Optimized Assets**: Compressed images and fonts
- **Smooth Animations**: Hardware-accelerated CSS and Framer Motion
- **SEO Optimization**: Meta tags, structured data, and accessibility

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌟 Key Features Showcase

### **AgroSense Platform**
- **Live Demo**: [https://agrosense-client-kappa.vercel.app/](https://agrosense-client-kappa.vercel.app/)
- **UNDP AI Hackathon Finalist** - Advanced to Phase 2 finals
- **AI-Powered**: Crop disease detection using GPT-4 Vision and Gemini
- **Offline-First**: PWA architecture for rural connectivity
- **Sesotho Language Support**: Fuzzy keyword matching for voice commands

### **Sesotho AI Platform**
- **Research-Based**: Using gold-standard Sesotho News Dataset
- **Government Partnership Potential**: Designed for 1.85M Sesotho speakers
- **Production-Ready**: Sentiment analysis and NLP capabilities

### **Professional Certifications**
- **Cisco Networking Academy**: 3 certifications with actual badges
- **Certificate Downloads**: PDF certificates with permanent storage
- **Badge Display**: Real certification badges in Education section

## 📞 Contact Information

- **Email**: kutloano.moshao111@gmail.com
- **Phone**: +266 5758 6176
- **Location**: Maseru, Lesotho
- **LinkedIn**: [kutloano-moshao-1aa5003a1](https://www.linkedin.com/in/kutloano-moshao-1aa5003a1/)
- **GitHub**: [kutloanom](https://github.com/kutloanom)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Animations by [Framer Motion](https://framer.com/motion)
- Icons from [Lucide](https://lucide.dev)
- Backend by [Supabase](https://supabase.com)

---

**Made with ❤️ by Kutloano Moshao** | **UNDP AI Hackathon Finalist** | **Full-Stack Developer & AI Innovator**