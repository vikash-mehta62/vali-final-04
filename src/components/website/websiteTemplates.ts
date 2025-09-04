
/**
 * Website Templates Library
 * Provides pre-designed templates for the website generator
 */

export interface WebsiteTemplateStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  headerTextColor: string;
  footerColor: string;
  footerTextColor: string;
  fontFamily: string;
  borderRadius?: string;
  buttonStyle?: string;
  cardStyle?: string;
}

export interface WebsiteTemplateSection {
  title: string;
  content: string;
  layout?: 'standard' | 'two-column' | 'image-left' | 'image-right' | 'full-width';
  backgroundImage?: string;
}

export interface WebsiteTemplate {
  name: string;
  description: string;
  category: 'business' | 'ecommerce' | 'personal' | 'professional' | 'specialized';
  sections: WebsiteTemplateSection[];
  style: WebsiteTemplateStyle;
  features?: string[];
}

export const websiteTemplates: Record<string, WebsiteTemplate> = {
  default: {
    name: "Modern Business",
    description: "A clean, professional template for businesses of all sizes",
    category: "business",
    sections: [
      {
        title: "Welcome to {{businessName}}",
        content: "{{businessDescription}}",
        layout: "standard"
      },
      {
        title: "Our Services",
        content: "We offer a range of services to meet your needs. Contact us to learn more about how {{businessName}} can help you achieve your goals.",
        layout: "two-column"
      },
      {
        title: "About Us",
        content: "{{businessName}} is committed to delivering excellence in everything we do. We pride ourselves on our customer service and attention to detail.",
        layout: "standard"
      },
      {
        title: "Contact Us",
        content: "Get in touch with {{businessName}} today. We're always happy to hear from potential clients and answer any questions you may have.",
        layout: "standard"
      }
    ],
    style: {
      primaryColor: "#4f46e5",
      secondaryColor: "#f9fafb",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      headingColor: "#111827",
      headerTextColor: "#ffffff",
      footerColor: "#1f2937",
      footerTextColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      borderRadius: "0.375rem",
      buttonStyle: "rounded",
      cardStyle: "shadow"
    },
    features: [
      "Responsive design",
      "Mobile-friendly navigation",
      "Contact form",
      "Service showcase"
    ]
  },
  
  ecommerce: {
    name: "E-commerce Shop",
    description: "Perfect for online stores and product showcases",
    category: "ecommerce",
    sections: [
      {
        title: "Shop at {{businessName}}",
        content: "Discover our premium collection of products at {{businessName}}. {{businessDescription}}",
        layout: "standard"
      },
      {
        title: "Featured Products",
        content: "Check out our bestsellers and new arrivals. {{businessName}} offers high-quality products at competitive prices.",
        layout: "image-right"
      },
      {
        title: "Customer Reviews",
        content: "Don't just take our word for it. Our customers love shopping at {{businessName}}. Read their testimonials and see why we're rated 5 stars.",
        layout: "two-column"
      },
      {
        title: "Shipping & Returns",
        content: "{{businessName}} offers fast shipping and hassle-free returns. We want you to be completely satisfied with your purchase.",
        layout: "standard"
      }
    ],
    style: {
      primaryColor: "#18181b",
      secondaryColor: "#f4f4f5",
      backgroundColor: "#ffffff",
      textColor: "#27272a",
      headingColor: "#18181b",
      headerTextColor: "#ffffff",
      footerColor: "#27272a",
      footerTextColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      borderRadius: "0.25rem",
      buttonStyle: "square",
      cardStyle: "bordered"
    },
    features: [
      "Product gallery",
      "Shopping cart integration",
      "Customer reviews section",
      "Featured products showcase"
    ]
  },
  
  restaurant: {
    name: "Restaurant/Cafe",
    description: "Showcase your menu and culinary creations",
    category: "specialized",
    sections: [
      {
        title: "Welcome to {{businessName}}",
        content: "Experience the finest dining at {{businessName}}. {{businessDescription}}",
        layout: "image-left"
      },
      {
        title: "Our Menu",
        content: "At {{businessName}}, we serve a variety of delicious dishes made with the freshest ingredients. Our menu changes seasonally to ensure we're always serving the best.",
        layout: "two-column"
      },
      {
        title: "Reservations",
        content: "Make a reservation at {{businessName}} today. Join us for lunch, dinner, or weekend brunch.",
        layout: "standard"
      },
      {
        title: "Visit Us",
        content: "{{businessName}} is located in the heart of the city. We're open Monday to Sunday, from 11am to 11pm. We look forward to serving you!",
        layout: "standard"
      }
    ],
    style: {
      primaryColor: "#7c2d12",
      secondaryColor: "#fef3c7",
      backgroundColor: "#ffffff",
      textColor: "#422006",
      headingColor: "#7c2d12",
      headerTextColor: "#ffffff",
      footerColor: "#422006",
      footerTextColor: "#fef3c7",
      fontFamily: "Georgia, serif",
      borderRadius: "0.5rem",
      buttonStyle: "rounded",
      cardStyle: "elegant"
    },
    features: [
      "Menu showcase",
      "Reservation system",
      "Location map",
      "Operating hours display"
    ]
  },
  
  portfolio: {
    name: "Professional Portfolio",
    description: "Showcase your work and professional achievements",
    category: "professional",
    sections: [
      {
        title: "{{businessName}}",
        content: "{{businessDescription}}",
        layout: "full-width"
      },
      {
        title: "My Work",
        content: "Browse through my portfolio to see examples of my previous work. Each project demonstrates my skills and expertise in different areas.",
        layout: "image-right"
      },
      {
        title: "Skills & Expertise",
        content: "I specialize in a range of services including web design, graphic design, and content creation. With years of experience, I deliver high-quality results for all my clients.",
        layout: "two-column"
      },
      {
        title: "Let's Work Together",
        content: "Interested in working with me? Get in touch to discuss your project requirements and how I can help bring your vision to life.",
        layout: "standard"
      }
    ],
    style: {
      primaryColor: "#0f172a",
      secondaryColor: "#f8fafc",
      backgroundColor: "#ffffff",
      textColor: "#334155",
      headingColor: "#0f172a",
      headerTextColor: "#ffffff",
      footerColor: "#0f172a",
      footerTextColor: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      borderRadius: "0.125rem",
      buttonStyle: "minimal",
      cardStyle: "subtle"
    },
    features: [
      "Project gallery",
      "Resume/CV section",
      "Skills showcase",
      "Contact form"
    ]
  },
  
  blog: {
    name: "Modern Blog",
    description: "Share your thoughts and articles with style",
    category: "personal",
    sections: [
      {
        title: "Welcome to {{businessName}}",
        content: "{{businessDescription}}",
        layout: "standard"
      },
      {
        title: "Latest Articles",
        content: "Stay updated with our latest articles and insights. We cover a range of topics including technology, lifestyle, and industry trends.",
        layout: "two-column"
      },
      {
        title: "About the Author",
        content: "Learn more about the writer behind {{businessName}} and why we're passionate about sharing knowledge and insights with our readers.",
        layout: "image-left"
      },
      {
        title: "Subscribe",
        content: "Never miss an update. Subscribe to our newsletter to receive the latest articles directly in your inbox.",
        layout: "standard"
      }
    ],
    style: {
      primaryColor: "#6366f1",
      secondaryColor: "#f1f5f9",
      backgroundColor: "#ffffff",
      textColor: "#475569",
      headingColor: "#1e293b",
      headerTextColor: "#ffffff",
      footerColor: "#1e293b",
      footerTextColor: "#f1f5f9",
      fontFamily: "Georgia, serif",
      borderRadius: "0.375rem",
      buttonStyle: "rounded",
      cardStyle: "bordered"
    },
    features: [
      "Article display",
      "Newsletter subscription",
      "Author profile",
      "Categories and tags"
    ]
  }
};

// Helper function to get templates by category
export const getTemplatesByCategory = (category: string) => {
  return Object.entries(websiteTemplates)
    .filter(([_, template]) => template.category === category)
    .reduce((acc, [key, template]) => {
      acc[key] = template;
      return acc;
    }, {} as Record<string, WebsiteTemplate>);
};
