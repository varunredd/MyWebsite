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
    linkedinHandle: "/in/varun-reddy-gutha-1499241aa",
    github: "https://github.com/varunredd",
    githubHandle: "@varunredd",
    twitter: "",
    resumePath: "/assets/Varun_Reddy_Gutha_Resume.pdf",
    availability: "Available for Full-Time Roles — May 2026",
    visa: "F-1 Visa (OPT-eligible)",
    tagline:
      "I build backend systems and AI-powered applications — microservices, RAG pipelines, and everything in between.",
    summary:
      "Software Engineer with 2+ years of experience building backend systems and web applications, now focused on applying AI/ML to production software. Currently interning at Duke Energy where I integrate ML-driven analytics into Spring Boot services.",
    mission:
      "I build software to turn ideas into products people trust. My compass is simple: clean architecture, performance, security, and respect for the user.",
  };
  
  export const stats = {
    yearsExperience: "2+",
    projects: "8+",
    technologies: "20+",
  };
  
  export const education = [
    {
      school: "University of North Carolina at Charlotte",
      degree: "Master of Science in Computer Science",
      concentration: "AI & Machine Learning",
      dates: "Sep 2024 – May 2026",
      location: "Charlotte, North Carolina",
      description:
        "Graduate study focused on building reliable, user-centered software. Coursework: Software Development — Design & Implementation, Data Structures & Algorithms, Machine Learning, Computer Communication & Networks, Mobile Application Development, Artificial Intelligence, and Data Mining.",
    },
  ];
  
  export const experience = [
    {
      company: "Duke Energy",
      role: "Software Engineer Intern",
      dates: "Jan 2025 – Present",
      location: "Charlotte, NC",
      description:
        "Building Spring Boot services that expose ML model predictions as REST APIs for internal energy analytics tools, and setting up model-serving infrastructure with FastAPI.",
      bullets: [
        "Building Spring Boot services that expose ML model predictions as REST APIs for internal energy analytics tools — load forecasting and usage anomaly detection consumed by downstream dashboards.",
        "Set up a model-serving layer with FastAPI that wraps trained scikit-learn/XGBoost models behind versioned endpoints, with input validation, structured logging, and Redis caching.",
        "Writing integration tests for prediction APIs and collaborating with the data science team to validate model outputs against historical data.",
      ],
      skills: [
        "Spring Boot",
        "FastAPI",
        "Python",
        "scikit-learn",
        "XGBoost",
        "Redis",
        "REST APIs",
        "Java",
      ],
    },
    {
      company: "Brane Enterprises Pvt Ltd",
      role: "Software Development Engineer",
      dates: "Jan 2023 – Dec 2024",
      location: "Hyderabad, India",
      description:
        "Built and shipped end-to-end features across microservices, owned the auth layer, integrated payment gateways, and optimized database performance.",
      bullets: [
        "Split a monolith into 8 services (6 Spring Boot, 2 .NET Core) with OpenAPI contracts so 3 teams could release independently. Release cycle went from 2 weeks to 3 days.",
        "Owned the auth layer end-to-end — OAuth 2.0 login, JWT token refresh, session management with Spring Security, and a granular RBAC system for patient data. Team passed its first security review with zero findings.",
        "Integrated Razorpay and PayPal gateways for billing, tested full flows in sandbox, and wired webhook callbacks. Set up AWS S3 with signed URLs for patient documents.",
        "Fixed a slow patient dashboard caused by unindexed joins across 3 PostgreSQL tables — added composite indexes and a Redis cache, dropping p95 by 45% to under 500ms.",
      ],
      skills: [
        "Spring Boot",
        "Spring Security",
        ".NET Core",
        "OAuth 2.0",
        "JWT",
        "RBAC",
        "PostgreSQL",
        "Redis",
        "Docker",
        "AWS S3",
        "Java",
        "CI/CD",
      ],
    },
  ];
  
  export const projects = [
    {
      id: "rag-qa-engine",
      title: "RAG Document Q&A Engine",
      tech: [
        "Python",
        "FastAPI",
        "LangChain",
        "OpenAI API",
        "FAISS",
        "Sentence Transformers",
        "React",
        "PostgreSQL",
      ],
      description:
        "Upload PDFs/docs, ask questions in plain English, get cited answers. FastAPI backend chunks documents, generates embeddings with Sentence Transformers, stores them in FAISS, and retrieves the most relevant chunks at query time. LangChain orchestrates the retrieval + LLM call. React frontend with streaming responses.",
      features: [
        "PDF/Document Upload & Chunking",
        "Sentence Transformer Embeddings",
        "FAISS Vector Search",
        "LangChain RAG Pipeline",
        "Cited Answers with Sources",
        "React Streaming UI",
      ],
      github: "https://github.com/varunredd/rag-qa-engine",
      featured: true,
    },
    {
      id: "ml-video-extractor",
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
        "Search pipeline that extracts key frames from long videos, generates CLIP embeddings, and ranks scenes against plain-text queries via FastAPI. Celery workers behind Redis queues keep the React UI responsive while processing videos up to 2 hours long.",
      features: [
        "Key Frame Extraction",
        "CLIP Embedding Generation",
        "Text-to-Scene Ranking",
        "Celery + Redis Task Queue",
        "Long Video Processing (2hr+)",
        "React Search Interface",
      ],
      github: "",
      featured: true,
    },
    {
      id: "ecommerce-spring",
      title: "E-Commerce Platform (Spring Boot)",
      tech: [
        "Spring Boot",
        "Spring Security",
        "OAuth2/JWT",
        "PostgreSQL",
        "Stripe",
        "Docker",
      ],
      description:
        "OAuth2 login with Spring Security for customers and admins under one RBAC flow. Stripe checkout with success/failure routing, tested against Stripe test keys. Dockerized for one-command setup.",
      features: [
        "OAuth2/JWT Authentication",
        "Role-Based Access Control",
        "Stripe Payment Integration",
        "Sandbox-Tested Checkout",
        "Docker Containerization",
        "Admin + Customer Flows",
      ],
      github: "",
      featured: false,
    },
    {
      id: "mern-ecommerce",
      title: "MERN E-Commerce App",
      tech: [
        "React",
        "Node/Express",
        "MongoDB",
        "JWT",
        "PayPal",
        "Cloudinary",
      ],
      description:
        "Single admin dashboard for products, orders, and Cloudinary media uploads with role-based access. Integrated PayPal sandbox checkout with webhook callbacks.",
      features: [
        "MERN Stack Architecture",
        "PayPal Payment Gateway",
        "JWT Authentication",
        "Cloudinary Image Upload",
        "Admin Dashboard",
        "Redux State Management",
      ],
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
      "Vector Databases (Pinecone/ChromaDB)",
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
      "AWS (EC2, S3, Lambda, SageMaker, API Gateway)",
      "Docker",
      "GitHub Actions",
      "Jenkins",
    ],
    testing: [
      "JUnit",
      "Mockito",
      "Postman",
      "OpenAPI/Swagger",
      "Git",
      "Maven",
      "Jira",
      "Agile/Scrum",
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
  