import { BusinessBrandConfig, PageSeoMeta, ServiceCategory } from '../types';

/**
 * Centralized Business & Branding Configuration
 * Editable placeholder settings until the client provides finalized assets & copy.
 */
export const siteConfig: {
  brand: BusinessBrandConfig;
  api: {
    baseUrl: string;
    timeoutMs: number;
    endpoints: {
      leads: string;
      leadDetail: (id: string) => string;
      leadsExport: string;
    };
  };
  services: Array<{
    id: ServiceCategory;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    iconName: string;
  }>;
  whyChooseUs: Array<{
    title: string;
    description: string;
    iconName: string;
  }>;
  seoDefaults: PageSeoMeta;
} = {
  brand: {
    companyName: 'Your Business Solutions Ltd',
    tradingName: 'Your Business',
    tagline: 'Delivering Reliable Professional Services & Scalable Solutions',
    shortDescription:
      'We provide modern, dependable solutions designed to help commercial enterprises and growing businesses streamline operations and achieve measurable results.',
    contactEmail: 'enquiries@yourbusiness.example.com',
    contactPhone: '+44 (0) 20 7946 0990',
    formattedPhone: '+442079460990',
    displayAddress: '100 Business Central Way, Suite 400, London, EC1A 1BB, United Kingdom',
    businessHours: 'Monday – Friday: 08:30 – 17:30 (GMT)',
    serviceAreas: ['Nationwide Coverage', 'Regional Hubs', 'Remote & On-site Advisory'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/placeholder',
      twitter: 'https://twitter.com/placeholder',
      facebook: 'https://facebook.com/placeholder',
    },
  },

  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000,
    endpoints: {
      leads: '/leads',
      leadDetail: (id: string) => `/leads/${id}`,
      leadsExport: '/leads/export',
    },
  },

  services: [
    {
      id: 'consulting',
      title: 'Strategic Business Consulting',
      tagline: 'Evidence-based advice tailored to your market challenges.',
      description:
        'Thorough analysis of operational workflows, competitive benchmarking, and structured roadmaps engineered to accelerate growth and mitigate risk.',
      features: [
        'Comprehensive operational audits',
        'Growth and efficiency roadmaps',
        'Risk assessment & mitigation plans',
        'Executive advisory & alignment',
      ],
      iconName: 'TrendingUp',
    },
    {
      id: 'managed_services',
      title: 'Managed Operational Services',
      tagline: 'End-to-end management with predictable service level agreements.',
      description:
        'Dedicated professional support and day-to-day management to optimize your business systems, maintain high uptime, and free your team to focus on core priorities.',
      features: [
        'Guaranteed response SLAs',
        'Proactive monitoring and maintenance',
        'Dedicated account management',
        'Periodic performance reviews',
      ],
      iconName: 'ShieldCheck',
    },
    {
      id: 'enterprise_solutions',
      title: 'Enterprise Infrastructure Solutions',
      tagline: 'Robust architectures designed for high performance and compliance.',
      description:
        'Scalable implementations built around strict regulatory requirements, security standards, and seamless interoperability across your technical stack.',
      features: [
        'Secure architecture blueprinting',
        'Integration with existing platforms',
        'Industry compliance readiness',
        'Scalable deployment frameworks',
      ],
      iconName: 'Layers',
    },
    {
      id: 'digital_transformation',
      title: 'Digital Process Modernization',
      tagline: 'Transitioning legacy processes into modern digital workflows.',
      description:
        'We help modern organizations modernize legacy operations, automate repetitive overhead, and introduce reliable cloud-ready solutions.',
      features: [
        'Legacy process auditing',
        'Workflow automation design',
        'Cloud-native tool adoption',
        'Staff onboarding & knowledge transfer',
      ],
      iconName: 'Workflow',
    },
    {
      id: 'custom_development',
      title: 'Tailored Technical Solutions',
      tagline: 'Custom-built modules engineered to solve exact operational needs.',
      description:
        'Purpose-built digital tools, internal portals, and bespoke integrations created when off-the-shelf software cannot meet specialized business demands.',
      features: [
        'Custom requirement engineering',
        'Modern, extensible tech stack',
        'Comprehensive technical documentation',
        'Ongoing maintenance and upgrades',
      ],
      iconName: 'Cpu',
    },
    {
      id: 'other',
      title: 'Specialized Enquiries & Advisory',
      tagline: 'Custom scope discussions for specialized client requirements.',
      description:
        'Have a unique requirement that does not fit predefined categories? Our senior team conducts exploratory calls to evaluate feasibility and scope custom engagements.',
      features: [
        'Exploratory feasibility calls',
        'Custom statement of work (SOW)',
        'Multi-disciplinary team allocation',
        'Flexible engagement models',
      ],
      iconName: 'HelpCircle',
    },
  ],

  whyChooseUs: [
    {
      title: 'Transparent Communication',
      description:
        'Clear project scopes, predictable timelines, and proactive progress reporting at every stage of the engagement.',
      iconName: 'MessageSquare',
    },
    {
      title: 'Rigorous Quality Standards',
      description:
        'Tested methodologies, documented procedures, and strict quality verification embedded across all service deliverables.',
      iconName: 'CheckCircle2',
    },
    {
      title: 'Client-Centric Approach',
      description:
        'Solutions engineered around your specific operational constraints and commercial objectives, never one-size-fits-all.',
      iconName: 'Users',
    },
    {
      title: 'Commitment to Compliance',
      description:
        'Data privacy, security best practices, and confidentiality agreements strictly observed throughout every interaction.',
      iconName: 'Lock',
    },
  ],

  seoDefaults: {
    title: 'Your Business | Professional Solutions & Services',
    description:
      'Professional solutions and reliable corporate services tailored to meet your business needs. Request a free, no-obligation quote today.',
    keywords: [
      'professional services',
      'business consulting',
      'operational solutions',
      'enterprise services',
      'lead generation',
      'free quote',
    ],
    canonicalUrl: 'https://www.yourbusiness.example.com',
    ogType: 'website',
  },
};
