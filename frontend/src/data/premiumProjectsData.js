import {
  FaBrain,
  FaNetworkWired,
  FaMicrochip,
  FaDatabase,
  FaChartLine,
  FaCogs,
  FaGraduationCap,
  FaEye,
  FaCoins,
  FaShieldAlt,
} from 'react-icons/fa'

export const premiumProjects = [
  {
    id: '01',
    number: '01',
    name: 'NeuroX AI',
    subtitle: 'Intelligent Autonomous AI Agent Platform',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Ollama', 'LangChain', 'FAISS', 'SQLite'],
    description:
      'An intelligent autonomous AI agent platform designed to perform tasks, process information, and provide AI-powered assistance using language models and retrieval-based capabilities.',
    Icon: FaBrain,
    accent: '#a855f7',
    features: [
      'Autonomous multi-step task execution engine',
      'Local model integration powered by Ollama',
      'FAISS semantic similarity retrieval store',
      'Real-time streaming agent response interface',
    ],
  },
  {
    id: '02',
    number: '02',
    name: 'SynapX AI',
    subtitle: 'Collaborative Multi-Agent Intelligence System',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'CrewAI', 'LangGraph', 'Ollama', 'PostgreSQL'],
    description:
      'A collaborative multi-agent AI system where multiple intelligent agents work together to solve complex tasks, coordinate workflows, and generate intelligent results.',
    Icon: FaNetworkWired,
    accent: '#34e0a1',
    features: [
      'Multi-agent role coordination and crew orchestration',
      'LangGraph cyclical state graphs for agent reflection',
      'Distributed task delegation and consensus review',
      'Persistent PostgreSQL conversation history',
    ],
  },
  {
    id: '03',
    number: '03',
    name: 'Aether AI',
    subtitle: 'Personal AI Assistant with Long-Term Memory',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Ollama', 'ChromaDB', 'Sentence Transformers'],
    description:
      'A personalized AI assistant designed to provide intelligent conversations and retain relevant information using long-term memory and semantic search.',
    Icon: FaMicrochip,
    accent: '#22d3ee',
    features: [
      'Persistent episodic and factual vector memory in ChromaDB',
      'Semantic embeddings with Sentence Transformers',
      'Adaptive conversational persona personalization',
      'Privacy-first local LLM inference via Ollama',
    ],
  },
  {
    id: '04',
    number: '04',
    name: 'Cognix AI',
    subtitle: 'Intelligent Knowledge Management System',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'RAG', 'LangChain', 'FAISS', 'PyMuPDF'],
    description:
      'An AI-powered knowledge management system that processes documents, extracts valuable information, and enables intelligent question answering using Retrieval-Augmented Generation.',
    Icon: FaDatabase,
    accent: '#8b7cff',
    features: [
      'Multi-format document ingestion (PDF, DOCX, TXT)',
      'High-speed document parsing using PyMuPDF',
      'Hybrid dense-sparse RAG retrieval with citations',
      'Interactive document QA assistant workspace',
    ],
  },
  {
    id: '05',
    number: '05',
    name: 'Nexora AI',
    subtitle: 'Predictive Analytics and Intelligence Platform',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost'],
    description:
      'A predictive analytics platform that analyzes datasets, identifies patterns, and generates data-driven predictions using machine learning algorithms.',
    Icon: FaChartLine,
    accent: '#38bdf8',
    features: [
      'Automated exploratory data analysis pipelines',
      'Gradient boosted prediction models with XGBoost',
      'Feature importance and SHAP value explainability',
      'Dynamic metric dashboard with statistical charting',
    ],
  },
  {
    id: '06',
    number: '06',
    name: 'OmniX AI',
    subtitle: 'Autonomous Workflow Automation System',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Activepieces', 'Ollama', 'REST APIs', 'PostgreSQL'],
    description:
      'An intelligent workflow automation platform designed to automate repetitive tasks, connect applications, and integrate AI-powered capabilities into business workflows.',
    Icon: FaCogs,
    accent: '#6366f1',
    features: [
      'Visual workflow canvas and trigger-action pipelines',
      'Activepieces open ecosystem connector integration',
      'Autonomous decision nodes governed by local LLMs',
      'Resilient webhook retries and execution logs',
    ],
  },
  {
    id: '07',
    number: '07',
    name: 'Mindora AI',
    subtitle: 'Personalized AI Learning Platform',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Ollama', 'Scikit-learn', 'FAISS', 'SQLite'],
    description:
      'An AI-powered learning platform that provides personalized learning experiences, intelligent recommendations, and adaptive educational assistance.',
    Icon: FaGraduationCap,
    accent: '#a855f7',
    features: [
      'Adaptive curriculum generator tailored to user pace',
      'Semantic concept recommendation using FAISS',
      'Interactive quiz generation and AI tutoring dialog',
      'Progress analytics and skill mastery tracking',
    ],
  },
  {
    id: '08',
    number: '08',
    name: 'Vortex AI',
    subtitle: 'Real-Time Computer Vision and Video Analytics',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'OpenCV', 'YOLO', 'PyTorch'],
    description:
      'A real-time computer vision platform that analyzes images and video streams to detect objects and extract meaningful visual information using deep learning.',
    Icon: FaEye,
    accent: '#06b6d4',
    features: [
      'Real-time object detection powered by YOLO models',
      'Multi-stream video processing with OpenCV',
      'Spatial tracking, bounding box annotations, and heatmaps',
      'PyTorch GPU-accelerated inference backend',
    ],
  },
  {
    id: '09',
    number: '09',
    name: 'Quantix AI',
    subtitle: 'Intelligent Financial Analytics Platform',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Pandas', 'Scikit-learn', 'XGBoost', 'Recharts'],
    description:
      'An intelligent financial analytics platform that analyzes financial datasets, identifies trends, generates predictive insights, and visualizes analytical results.',
    Icon: FaCoins,
    accent: '#34e0a1',
    features: [
      'Time-series forecasting and volatility modeling',
      'Portfolio risk analysis and scenario simulation',
      'Automated technical indicators and trend detection',
      'Interactive financial charting powered by Recharts',
    ],
  },
  {
    id: '10',
    number: '10',
    name: 'Zynexa AI',
    subtitle: 'AI-Powered Cybersecurity Threat Detection System',
    category: 'Artificial Intelligence',
    technologies: ['Python', 'Django', 'React.js', 'Scikit-learn', 'XGBoost', 'Scapy', 'PostgreSQL'],
    description:
      'An AI-powered cybersecurity platform designed to analyze network traffic, identify suspicious patterns, and support threat detection using machine learning techniques.',
    Icon: FaShieldAlt,
    accent: '#ec4899',
    features: [
      'Real-time packet inspection and extraction using Scapy',
      'Anomaly detection classifier for zero-day threat patterns',
      'Automated incident triage and severity scoring',
      'Comprehensive audit trails stored in PostgreSQL',
    ],
  },
]

// Distinct Web Application Projects category reserved for future additions
export const webApplicationProjects = [
  {
    id: 'web-01',
    number: 'W01',
    name: 'CloudCommerce Platform',
    subtitle: 'Enterprise Headless E-Commerce System',
    category: 'Web Application Projects',
    status: 'Upcoming / Future Addition',
    technologies: ['React.js', 'Node.js', 'Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
    description:
      'A scalable enterprise e-commerce platform featuring multi-tenant store management, headless storefronts, real-time inventory synchronization, and unified payment workflows.',
    badge: 'Coming Soon',
  },
  {
    id: 'web-02',
    number: 'W02',
    name: 'Nexus SaaS Hub',
    subtitle: 'Multi-Tenant Subscription & Analytics Portal',
    category: 'Web Application Projects',
    status: 'Upcoming / Future Addition',
    technologies: ['React.js', 'Django', 'PostgreSQL', 'Docker', 'Celery', 'TailwindCSS'],
    description:
      'An all-in-one SaaS starter architecture with built-in RBAC permissions, subscription billing, automated workspace provisioning, and responsive administrative dashboards.',
    badge: 'Coming Soon',
  },
  {
    id: 'web-03',
    number: 'W03',
    name: 'TaskFlow Agile Portal',
    subtitle: 'Real-Time Collaborative Project Management',
    category: 'Web Application Projects',
    status: 'Upcoming / Future Addition',
    technologies: ['React.js', 'FastAPI', 'WebSockets', 'MongoDB', 'Redis', 'Docker'],
    description:
      'A real-time project management and team collaboration web application with Kanban boards, live presence tracking, sprint estimation, and granular activity logging.',
    badge: 'Coming Soon',
  },
]

export const projectCategoriesList = [
  { id: 'ai', label: 'AI Projects', count: 10, isPrimary: true },
  { id: 'web', label: 'Web Application Projects', count: 'Future Additions', isPrimary: false },
]
