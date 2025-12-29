import { supabase } from '@/integrations/supabase/client';

const certificatesData = [
  {
    id: "python-essentials-1",
    title: "Python Essentials 1",
    subtitle: "PCAP - Programming Essentials in Python",
    description: "Comprehensive Python programming fundamentals covering syntax, data structures, and object-oriented programming concepts.",
    provider: "Cisco Networking Academy",
    course_type: "Certification",
    completion_date: "2025-07-07",
    duration: "70 hours",
    skills_learned: ["Python Programming", "Data Structures", "OOP", "File Handling", "Exception Handling"],
    document_name: "Python Essential 1.pdf",
    document_type: "pdf",
    document_size: 2048000,
    document_url: "/certificates/Python Essential 1.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 1
  },
  {
    id: "cybersecurity-essentials",
    title: "Introduction To Cybersecurity",
    subtitle: "Network Security Fundamentals",
    description: "Essential cybersecurity concepts including threat analysis, risk management, and security protocols.",
    provider: "Cisco Networking Academy",
    course_type: "Certification",
    completion_date: "2025-07-19",
    duration: "30 hours",
    skills_learned: ["Network Security", "Threat Analysis", "Risk Management", "Security Protocols", "Incident Response"],
    document_name: "Introduction To Cybersecurity.pdf",
    document_type: "pdf",
    document_size: 1856000,
    document_url: "/certificates/Introduction To Cybersecurity.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 2
  },
  {
    id: "packet-tracer",
    title: "Getting Started with Cisco Packet Tracer",
    subtitle: "Network Simulation and Modeling",
    description: "Hands-on experience with Cisco Packet Tracer for network simulation, configuration, and troubleshooting.",
    provider: "Cisco Networking Academy",
    course_type: "Certification",
    completion_date: "2025-10-14",
    duration: "2 hours",
    skills_learned: ["Network Simulation", "Cisco Packet Tracer", "Network Configuration", "Troubleshooting", "Network Design"],
    document_name: "Getting_Started_with_Cisco_Packet_Tracer_certificate_kutloano-moshao-bothouniversity-com.pdf",
    document_type: "pdf",
    document_size: 1750000,
    document_url: "/certificates/Getting_Started_with_Cisco_Packet_Tracer_certificate_kutloano-moshao-bothouniversity-com.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 3
  },
  {
    id: "virtual-internship-sokul",
    title: "Virtual Internship Program",
    subtitle: "Sokul Automation - 360 Hours",
    description: "Completed 360 hours of live delivery and work experience at Sokul Automation. Developed remote work, group work, and presentation skills while completing project-based virtual internship.",
    provider: "Virtual Internships",
    course_type: "Internship",
    completion_date: "2024-10-11",
    duration: "360 hours",
    skills_learned: ["Remote Work", "Group Collaboration", "Project Management", "Presentation Skills", "Career Development"],
    document_name: "Kutloano Moshao - emkay618@gmail.com - End of Program Certificate.pdf",
    document_type: "pdf",
    document_size: 1500000,
    document_url: "/certificates/Kutloano Moshao - emkay618@gmail.com - End of Program Certificate.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 4
  },
  {
    id: "virtual-internship-report",
    title: "Virtual Internship Report",
    subtitle: "End of Program Documentation",
    description: "Comprehensive report documenting the virtual internship experience, project outcomes, and skills development during the 360-hour program.",
    provider: "Virtual Internships",
    course_type: "Report",
    completion_date: "2024-10-11",
    duration: "360 hours",
    skills_learned: ["Technical Documentation", "Project Analysis", "Reflection", "Professional Writing"],
    document_name: "Kutloano Moshao - emkay618@gmail.com - End of Program Report.pdf",
    document_type: "pdf",
    document_size: 2000000,
    document_url: "/certificates/Kutloano Moshao - emkay618@gmail.com - End of Program Report.pdf",
    is_featured: false,
    is_published: true,
    sort_order: 5
  },
  {
    id: "botho-award-feb-june-2022",
    title: "Academic Excellence Award",
    subtitle: "Feb-June 2022 Semester",
    description: "Academic excellence award received for outstanding performance during the Feb-June 2022 semester at Botho University.",
    provider: "Botho University",
    course_type: "Academic Award",
    completion_date: "2022-06-30",
    duration: "1 semester",
    skills_learned: ["Academic Excellence", "Consistent Performance", "Dedication"],
    document_name: "Feb-June-2022.pdf",
    document_type: "pdf",
    document_size: 1200000,
    document_url: "/certificates/Feb-June-2022.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 6
  },
  {
    id: "botho-award-jan-june-2024",
    title: "Academic Excellence Award",
    subtitle: "Jan-June 2024 Semester",
    description: "Academic excellence award received for outstanding performance during the Jan-June 2024 semester at Botho University.",
    provider: "Botho University",
    course_type: "Academic Award",
    completion_date: "2024-06-30",
    duration: "1 semester",
    skills_learned: ["Academic Excellence", "Consistent Performance", "Leadership"],
    document_name: "Jan-June-2024.pdf",
    document_type: "pdf",
    document_size: 1200000,
    document_url: "/certificates/Jan-June-2024.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 7
  },
  {
    id: "botho-award-july-dec-2024",
    title: "Academic Excellence Award",
    subtitle: "July-Dec 2024 Semester",
    description: "Academic excellence award received for outstanding performance during the July-Dec 2024 semester at Botho University.",
    provider: "Botho University",
    course_type: "Academic Award",
    completion_date: "2024-12-31",
    duration: "1 semester",
    skills_learned: ["Academic Excellence", "Consistent Performance", "Innovation"],
    document_name: "July-Dec-2024.pdf",
    document_type: "pdf",
    document_size: 1200000,
    document_url: "/certificates/July-Dec-2024.pdf",
    is_featured: true,
    is_published: true,
    sort_order: 8
  }
];

export async function migrateCertificatesToSupabase() {
  try {
    // First, clear existing data
    await supabase.from('portfolio_courses').delete().neq('id', '');
    
    // Insert new data
    const { data, error } = await supabase
      .from('portfolio_courses')
      .insert(certificatesData);

    if (error) {
      console.error('Migration error:', error);
      return { success: false, error };
    }

    console.log('Migration successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}