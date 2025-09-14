# Kutloano Moshao - Professional Portfolio

A modern, responsive, and accessible portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion. Showcases full-stack development skills, AI projects, and professional experience.

## 🌟 Features

- **Modern Design System**: Professional blue-purple gradient theme with glass morphism effects
- **Fully Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion powered micro-interactions and scroll animations
- **SEO Optimized**: Structured data, meta tags, and accessibility features
- **Performance Focused**: Optimized images, smooth scrolling, and fast loading
- **Interactive Components**: Skills matrix with proficiency indicators, project showcases
- **Contact Form**: Functional contact form with validation
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/kutloanom/portfolio

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:8080`

## 📝 Content Management

All content is stored in JSON files for easy editing without touching code:

### Profile Information
Edit `src/data/profile.json` to update:
- Personal information (name, title, contact details)
- Skills and proficiency levels
- Education details
- Certifications
- Social media links

### Projects
Edit `src/data/projects.json` to:
- Add new projects
- Update project descriptions
- Modify technology stacks
- Update project links and metrics

### Adding New Projects
```json
{
  "id": "project-id",
  "title": "Project Title",
  "subtitle": "Short Description",
  "description": "Detailed description",
  "technologies": ["React", "TypeScript", "etc"],
  "category": ["Web", "AI", "PWA"],
  "status": "Production",
  "year": "2024",
  "links": {
    "live": "https://project-url.com",
    "github": "https://github.com/username/repo"
  }
}
```

## 🎨 Customization

### Design System
The design system is defined in:
- `src/index.css` - CSS variables and utility classes
- `tailwind.config.ts` - Tailwind configuration and theme extension

### Colors
Modify the color palette by editing CSS variables in `src/index.css`:
```css
:root {
  --primary: 239 84% 67%;  /* Main brand color */
  --accent: 271 91% 65%;   /* Secondary accent */
  /* ... other colors */
}
```

### Components
Each component is modular and can be customized:
- `src/components/Hero.tsx` - Landing section
- `src/components/SkillsMatrix.tsx` - Skills visualization
- `src/components/ProjectShowcase.tsx` - Project gallery
- `src/components/Education.tsx` - Education and certifications
- `src/components/Contact.tsx` - Contact form and information

## 📁 Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── Hero.tsx     # Hero section
│   ├── SkillsMatrix.tsx
│   ├── ProjectShowcase.tsx
│   ├── Education.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── data/            # JSON content files
│   ├── profile.json
│   └── projects.json
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── pages/           # Page components
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance Optimization

The portfolio is optimized for performance:
- **Lazy loading**: Images load as needed
- **Code splitting**: Components load on demand  
- **Optimized assets**: Compressed images and fonts
- **Smooth animations**: Hardware-accelerated CSS and Framer Motion
- **SEO**: Structured data and meta tags for search engines

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding Dependencies
```bash
# Add new package
npm install package-name

# Add dev dependency  
npm install --save-dev package-name
```

## 📱 PWA Features

To enable PWA features:
1. Add a web app manifest
2. Implement service worker
3. Add offline capabilities

## 🧪 Testing

```bash
# Run unit tests (if added)
npm run test

# Run E2E tests (if added)  
npm run test:e2e
```

## 📈 Analytics

To add analytics:
1. Add Google Analytics or Plausible
2. Update the tracking code in `src/pages/Portfolio.tsx`
3. Configure in your analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support:
- Email: kutloano.moshao@example.com
- GitHub: [@kutloanom](https://github.com/kutloanom)
- LinkedIn: [kutloano-moshao](https://linkedin.com/in/kutloano-moshao)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Animations by [Framer Motion](https://framer.com/motion)
- Icons from [Lucide](https://lucide.dev)

---

**Made with ❤️ by Kutloano Moshao**