// src/data/resumeData.ts
// ============================================
// SINGLE SOURCE OF TRUTH — Edit this file only.
// All pages pull from here. Change once, updates everywhere.
// ============================================

export const personal = {
    name: "Varun Reddy Gutha",
    title: "Full Stack Engineer & AI Developer",
    location: "Charlotte, NC",
    email: "vgutha@charlotte.edu",
    phone: "980-403-1098",
    linkedin: "https://www.linkedin.com/in/varun-reddy-gutha-1499241aa/",
    github: "https://github.com/varunredd",
    twitter: "",
    resumePath: "/assets/Varun_Reddy_Gutha_Resume.pdf",
    availability: "Available for Full-Time Roles — May 2026",
    visa: "F-1 Visa (OPT-eligible)",
    tagline:
      "I build backend systems and AI-powered applications — microservices, RAG pipelines, and everything in between.",
  };
  
  export const stats = {
    yearsExperience: "2+",
    projects: "8+",
    technologies: "20+",
  };
  
  export const education = [
    {
      school: "University of North Carolina at Charlotte",
      degree: "Master of Science, Computer Science",
      concentration: "AI & Machine Learning",
      dates: "Sep 2024 – May 2026",
      location: "Charlotte, North Carolina",
    },
  ];
  
  export const experience = [
    {
      company: "Duke Energy",
      role: "Software Engineer Intern",
      dates: "Jan 2025 – Present",
      location: "Charlotte, NC",
      bullets: [
        "Building Spring Boot services that expose ML model predictions as REST APIs for internal energy analytics tools — load forecasting and usage anomaly detection consumed by downstream dashboards.",
        "Set up a model-serving layer with FastAPI that wraps trained scikit-learn/XGBoost models behind versioned endpoints, with input validation, structured logging, and Redis caching.",
        "Writing integration tests for prediction APIs and collaborating with the data science team to validate model outputs against historical data.",
      ],
    },
    {
      company: "Brane Enterprises Pvt Ltd",
      role: "Software Development Engineer",
      dates: "Jan 2023 – Dec 2024",
      location: "Hyderabad, India",
      bullets: [
        "Split a monolith into 8 services (6 Spring Boot, 2 .NET Core) with OpenAPI contracts so 3 teams could release independently. Release cycle went from 2 weeks to 3 days.",
        "Owned the auth layer end-to-end — OAuth 2.0 login, JWT token refresh, session management with Spring Security, and a granular RBAC system for patient data. Team passed its first security review with zero findings.",
        "Integrated Razorpay and PayPal gateways for billing, tested full flows in sandbox, and wired webhook callbacks. Set up AWS S3 with signed URLs for patient documents.",
        "Fixed a slow patient dashboard caused by unindexed joins across 3 PostgreSQL tables — added composite indexes and a Redis cache, dropping p95 by 45% to under 500ms.",
      ],
    },
  ];
  
  export const projects = [
    {
      title: "RAG Document Q&A Engine",
      tech: [
        "Python",
        "FastAPI",
        "LangChain",
        "OpenAI API",
        "FAISS",
        "Sentence Transformers",
        "React",
      ],
      description:
        "Upload PDFs, ask questions in plain English, get cited answers. FastAPI backend chunks documents, generates embeddings, stores in FAISS, and retrieves relevant chunks at query time. LangChain orchestrates the retrieval + LLM call. React frontend with streaming responses.",
      github: "https://github.com/varunredd/rag-qa-engine",
      featured: true,
    },
    {
      title: "ML Video Extractor & Ranking",
      tech: [
        "Python",
        "FastAPI",
        "CLIP/Transformers",
        "Celery",
        "Redis",
        "React",
      ],
      description:
        "Search pipeline that extracts key frames from long videos, generates CLIP embeddings, and ranks scenes against plain-text queries via FastAPI. Celery workers behind Redis queues keep the React UI responsive during processing.",
      github: "",
      featured: true,
    },
    {
      title: "MERN E-Commerce with Admin Panel",
      tech: [
        "React",
        "Node/Express",
        "MongoDB",
        "JWT",
        "PayPal",
        "Cloudinary",
        "Redux Toolkit",
        "Tailwind",
      ],
      description:
        "Single admin dashboard for products, orders, and Cloudinary media uploads with role-based access. Integrated PayPal sandbox checkout with webhook callbacks.",
      github: "",
      featured: false,
    },
    {
      title: "E-Commerce Web Application",
      tech: [
        "Spring Boot",
        "Spring Security",
        "OAuth2/JWT",
        "REST",
        "PostgreSQL",
        "Stripe",
        "Docker",
      ],
      description:
        "OAuth2 login with Spring Security for customers and admins under one RBAC flow. Stripe checkout with success/failure routing, tested against Stripe test keys. Dockerized for one-command setup.",
      github: "",
      featured: false,
    },
  ];
  
  export const skills = {
    languages: ["Java", "Python", "JavaScript/TypeScript", "SQL"],
    aiml: [
      "PyTorch",
      "Hugging Face Transformers",
      "LangChain",
      "OpenAI API",
      "CLIP",
      "FAISS",
      "Sentence Transformers",
      "RAG",
      "Prompt Engineering",
    ],
    backend: [
      "Spring Boot",
      "Spring Security",
      "FastAPI",
      "Node.js/Express",
      "REST",
      "GraphQL",
      "Microservices",
      "OAuth 2.0",
      "JWT",
      "RBAC",
    ],
    frontend: ["React.js", "Redux Toolkit", "Tailwind CSS", "Next.js"],
    data: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Apache Kafka"],
    cloud: [
      "AWS (EC2, S3, Lambda, SageMaker)",
      "Docker",
      "GitHub Actions",
      "Jenkins",
    ],
    testing: [
      "JUnit",
      "Mockito",
      "Postman/Newman",
      "OpenAPI/Swagger",
      "CloudWatch",
    ],
  };
  
  export const quickLinks = [
    {
      title: "About Me",
      description:
        "My background, education at UNC Charlotte, and 2+ years of building backend systems.",
      href: "/about",
    },
    {
      title: "Projects",
      description:
        "From RAG pipelines and CLIP-based search to full-stack e-commerce platforms.",
      href: "/projects",
    },
    {
      title: "Skills",
      description:
        "Java, Python, Spring Boot, FastAPI, LangChain, React — and how I use them.",
      href: "/skills",
    },
  ];
  