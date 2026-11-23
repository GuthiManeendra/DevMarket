import {
  FaRobot,
  FaBrain,
  FaNetworkWired,
  FaCogs,
  FaEye,
  FaCode,
  FaShieldAlt,
  FaUserTie,
  FaFileAlt,
  FaHeartbeat,
  FaVideo,
  FaBookOpen,
  FaPalette,
  FaFileInvoice,
  FaChartLine,
  FaHome,
  FaBoxes,
  FaCreditCard,
  FaSeedling,
  FaSmile,
  FaCar,
  FaHands,
  FaIndustry,
  FaShoppingCart,
  FaBriefcase,
  FaHotel,
  FaCalendarAlt,
  FaBuilding,
  FaComments,
  FaUsersCog,
  FaShippingFast,
  FaAward,
  FaWarehouse,
} from 'react-icons/fa'

export const PROJECT_CATEGORIES = [
  'All Categories',
  'Artificial Intelligence',
  'Agentic AI',
  'Generative AI',
  'Machine Learning',
  'Computer Vision',
  'Web Application Projects',
  'Full Stack Development',
]

export const projectsCatalog = [
  // ==========================================
  // CATEGORY 1: ARTIFICIAL INTELLIGENCE (1 - 5)
  // ==========================================
  {
    id: '1',
    slug: 'smart-customer-support-ticket-system',
    number: '01',
    title: 'Smart Customer Support and Ticket Management System',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Django', 'React', 'NLP', 'PostgreSQL'],
    shortDescription:
      'AI-driven automated customer inquiry triage and intelligent ticket classification system with semantic routing.',
    overview:
      'A smart enterprise support automation system that analyzes incoming support tickets, understands customer intent through NLP, predicts priority, and automatically routes issues to specialized teams while providing instant AI-assisted resolution suggestions.',
    problemStatement:
      'Modern customer support desks are overwhelmed by repetitive inquiries, slow triage times, and incorrect ticket assignments, leading to degraded SLA compliance and customer churn.',
    objectives: [
      'Automate ticket ingestion, intent classification, and sentiment tagging using NLP pipelines.',
      'Reduce ticket triage and first-response times by over 60% with context-aware smart responses.',
      'Provide support supervisors with an analytics dashboard tracking SLA adherence and resolution trends.',
    ],
    keyFeatures: [
      'Semantic ticket intent classification and auto-tagging',
      'Customer sentiment analysis to escalate frustrated users',
      'Automated smart suggested replies based on historical resolutions',
      'Role-based ticket assignment engine with dynamic workload balancing',
      'Real-time SLA status counters and escalation alerts',
    ],
    frontendArchitecture:
      'Responsive React single-page application built with modular components, interactive ticket queues, and state-driven filters.',
    backendArchitecture:
      'Django REST Framework services handling authentication, NLP classification jobs, webhook integrations, and ticket state transitions.',
    databaseInfo:
      'PostgreSQL relational schema storing ticket threads, customer metadata, agent assignments, and vectorized intent embeddings.',
    expectedModules: [
      'Authentication & Role Management Module',
      'NLP Classification & Scoring Engine',
      'Ticket Queue & Assignment Dashboard',
      'Resolution Knowledge Base Module',
      'Analytics & SLA Reporting Engine',
    ],
    projectWorkflow: [
      'Customer submits support request through portal or email webhook.',
      'Backend NLP worker processes request text, extracting entities, sentiment, and urgency.',
      'System classifies category and suggests matching draft responses.',
      'Ticket is assigned to the best-matching support agent according to current load.',
      'Agent reviews suggested response, edits if needed, and marks ticket resolved.',
    ],
    learningOutcomes: [
      'NLP text classification and sentiment analysis workflows.',
      'Building robust REST APIs with Django and PostgreSQL.',
      'Designing queue-based dashboard UIs with React state management.',
    ],
    icon: FaRobot,
    accentColor: '#8b7cff',
  },
  {
    id: '2',
    slug: 'intelligent-resume-screening-ranking-system',
    number: '02',
    title: 'Intelligent Resume Screening and Candidate Ranking System',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Flask', 'React', 'NLP', 'MySQL'],
    shortDescription:
      'Automated CV parsing and candidate-job matching platform using natural language scoring and skill extraction.',
    overview:
      'An intelligent talent acquisition platform that automatically parses resumes in varied document formats, extracts skills and experience, and ranks candidates objectively against job descriptions using semantic matching algorithms.',
    problemStatement:
      'HR professionals spend countless hours manually reviewing thousands of unstructured resumes, introducing human fatigue and subjective bias into the initial candidate screening phase.',
    objectives: [
      'Extract structured entities (skills, education, tenure) from PDF and DOCX resume formats.',
      'Compute semantic similarity scores between candidate profiles and job requirements.',
      'Eliminate manual filtering bottlenecks and generate unbiased candidate leaderboards.',
    ],
    keyFeatures: [
      'Multi-format resume document parsing and text extraction',
      'Skill ontology normalization and experience tenure calculation',
      'Semantic job description match scoring using cosine similarity',
      'Interactive recruiter screening dashboard with candidate ranking lists',
      'Automated candidate shortlist generation and exportable summaries',
    ],
    frontendArchitecture:
      'React frontend with file drag-and-drop uploaders, candidate comparison cards, and interactive score breakdown modals.',
    backendArchitecture:
      'Flask microservice architecture handling document OCR/parsing pipelines, NLP entity extraction, and match calculations.',
    databaseInfo:
      'MySQL relational database managing applicant profiles, normalized skill catalogs, job requisitions, and match scores.',
    expectedModules: [
      'Resume Ingestion & Parsing Service',
      'NLP Entity Recognition & Skill Normalizer',
      'Candidate Scoring & Ranking Engine',
      'Recruiter Comparison Dashboard',
      'Job Requisition Management Module',
    ],
    projectWorkflow: [
      'Recruiter uploads job description and bulk candidate resumes.',
      'Parser extracts plain text and identifies named entities (skills, degrees, years).',
      'Scoring algorithm evaluates candidate relevancy and generates match index.',
      'Recruiter inspects ranked candidate list and detailed skill match analysis.',
      'Shortlisted applicants are tagged for interview scheduling.',
    ],
    learningOutcomes: [
      'Document parsing and unstructured text processing in Python.',
      'Implementing entity extraction and vector similarity ranking.',
      'Building clean data-dense screening interfaces in React.',
    ],
    icon: FaUserTie,
    accentColor: '#34e0a1',
  },
  {
    id: '3',
    slug: 'personalized-recommendation-product-discovery-platform',
    number: '03',
    title: 'Personalized Recommendation and Product Discovery Platform',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    technologies: ['Python', 'FastAPI', 'React', 'Scikit-learn', 'MongoDB'],
    shortDescription:
      'Collaborative and content-based recommendation engine delivering tailored e-commerce discovery and user personalization.',
    overview:
      'A machine learning-driven recommendation platform that analyzes user browsing sessions, purchase histories, and item attributes to deliver personalized product feeds, complementary item suggestions, and targeted discovery widgets.',
    problemStatement:
      'Generic e-commerce storefronts fail to retain shoppers due to information overload and irrelevant product displays, causing cart abandonment and low conversion rates.',
    objectives: [
      'Build hybrid collaborative and content-based recommendation pipelines.',
      'Serve real-time personalized product feeds with sub-100ms API latency.',
      'Track user click-through rates and dynamically adapt recommendations to live session signals.',
    ],
    keyFeatures: [
      'Hybrid recommendation combining item collaborative filtering and content embeddings',
      'Real-time "Frequently Bought Together" affinity basket calculations',
      'Dynamic homepage recommendation carousel tailored to user tastes',
      'Cold-start mitigation strategy for newly added products and guests',
      'A/B testing instrumentation to measure conversion uplift',
    ],
    frontendArchitecture:
      'High-performance React application with responsive recommendation carousels, instant search filtering, and user session instrumentation.',
    backendArchitecture:
      'FastAPI asynchronous server providing high-throughput recommendation inference endpoints and session event logging.',
    databaseInfo:
      'MongoDB document database storing flexible product catalogs, user interaction logs, and precomputed recommendation matrices.',
    expectedModules: [
      'User Telemetry & Event Ingestion Service',
      'Collaborative Filtering Model Engine',
      'Content-Based Similarity Processor',
      'Real-Time Recommendation Serving API',
      'Storefront Showcase & Analytics UI',
    ],
    projectWorkflow: [
      'User interacts with store products (views, cart adds, bookmarks).',
      'Client streams interaction telemetry to FastAPI ingestion endpoints.',
      'Inference service retrieves candidate items using collaborative and content models.',
      'Items are re-ranked based on user affinities and stock status.',
      'React storefront displays customized discovery feeds in real time.',
    ],
    learningOutcomes: [
      'Implementing collaborative filtering algorithms with Scikit-learn.',
      'High-performance async API development using FastAPI.',
      'Designing schema-flexible recommendation stores in MongoDB.',
    ],
    icon: FaChartLine,
    accentColor: '#06b6d4',
  },
  {
    id: '4',
    slug: 'intelligent-document-classification-information-extraction',
    number: '04',
    title: 'Intelligent Document Classification and Information Extraction System',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    technologies: ['Python', 'Django', 'Transformers', 'React', 'SQLite'],
    shortDescription:
      'Transformer-based document analyzer extracting structured key-value entities from invoices, agreements, and receipts.',
    overview:
      'An enterprise AI solution leveraging transformer language models to automatically classify unstructured corporate documents (invoices, tax forms, NDAs, receipts) and extract critical key-value pairs into standardized JSON payloads.',
    problemStatement:
      'Manual data entry from invoices, legal forms, and receipts is error-prone, costly, and creates massive processing bottlenecks for enterprise operations.',
    objectives: [
      'Classify incoming documents into distinct domain categories with high precision.',
      'Extract critical entities such as invoice totals, dates, vendor details, and contractual terms.',
      'Provide an interactive human-in-the-loop review interface for low-confidence predictions.',
    ],
    keyFeatures: [
      'Document type classification using fine-tuned transformer models',
      'Structured entity extraction (dates, amounts, line items, vendor names)',
      'Confidence scoring with visual boundary highlights on original documents',
      'Human-in-the-loop verification editor for corrections',
      'Export extracted data to JSON, CSV, and downstream accounting APIs',
    ],
    frontendArchitecture:
      'React interface featuring document split-pane viewers, bounding-box overlays, and inline entity verification inputs.',
    backendArchitecture:
      'Django web application coordinating document ingestion, optical extraction, Hugging Face transformers inference, and audit history.',
    databaseInfo:
      'SQLite database storing document registries, classification tags, extracted fields, and operator review states.',
    expectedModules: [
      'Document Upload & Ingestion Pipeline',
      'Transformer Classification & NER Engine',
      'Split-View Document Verification UI',
      'Entity Extraction & Transformation Service',
      'Export & Integration Service',
    ],
    projectWorkflow: [
      'Operator uploads document PDF or scanned image.',
      'Transformer pipeline classifies document type (e.g., Invoice vs Contract).',
      'Entity recognition extracts structured key-value pairs with confidence metrics.',
      'Operator validates extracted data in the React split-pane viewer.',
      'Verified structured payload is saved and exported to enterprise storage.',
    ],
    learningOutcomes: [
      'Applying Transformer models for Named Entity Recognition and text classification.',
      'Building document annotation and validation UIs in React.',
      'Architecting reliable ingestion workflows with Django.',
    ],
    icon: FaFileInvoice,
    accentColor: '#10b981',
  },
  {
    id: '5',
    slug: 'smart-healthcare-risk-assessment-decision-support',
    number: '05',
    title: 'Smart Healthcare Risk Assessment and Decision Support System',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    technologies: ['Python', 'Flask', 'Scikit-learn', 'React', 'PostgreSQL'],
    shortDescription:
      'Predictive diagnostic decision support platform assessing clinical risk factors and patient health indicators.',
    overview:
      'A clinical decision support prototype designed to assist healthcare practitioners by analyzing patient vital signs, lab metrics, and demographic risk factors to generate predictive risk assessments for chronic conditions.',
    problemStatement:
      'Early detection of chronic disease complications is often delayed by fragmented medical data and clinicians lacking automated early-warning tools during routine screenings.',
    objectives: [
      'Predict patient risk profiles for chronic conditions using supervised learning models.',
      'Surface interpretable feature contributions so clinicians understand underlying risk drivers.',
      'Ensure strict data validation, privacy safeguards, and auditable prediction trails.',
    ],
    keyFeatures: [
      'Multi-factor clinical risk scoring across cardiovascular and metabolic indicators',
      'Explainable AI feature importance charts showing key diagnostic factors',
      'Interactive patient metric entry form with physiological range validation',
      'Historical patient risk trajectory and progress monitoring charts',
      'Comprehensive clinical assessment summary exportable to PDF',
    ],
    frontendArchitecture:
      'Accessible, clean React application styled for medical dashboards with intuitive risk gauge dials and interactive trend graphs.',
    backendArchitecture:
      'Flask REST backend handling input validation, machine learning inference pipelines, and role-restricted medical record APIs.',
    databaseInfo:
      'PostgreSQL database storing anonymized patient records, biometric metrics, model versions, and audit logs.',
    expectedModules: [
      'Patient Record Ingestion & Validation Module',
      'Clinical Risk Scoring ML Engine',
      'Explainable Prediction & Feature Breakdown Service',
      'Practitioner Assessment Dashboard',
      'Audit Logging & Privacy Compliance Module',
    ],
    projectWorkflow: [
      'Clinician enters or imports patient vitals, biometric history, and laboratory readings.',
      'Backend sanitizes inputs and executes trained predictive models.',
      'System calculates composite risk score and generates feature contribution breakdown.',
      'Clinician reviews risk tier, recommendations, and physiological trends.',
      'Assessment is preserved in patient record with timestamped practitioner notes.',
    ],
    learningOutcomes: [
      'Developing healthcare predictive models using Scikit-learn.',
      'Implementing interpretable AI techniques for non-technical stakeholders.',
      'Securing sensitive clinical data workflows with Flask and PostgreSQL.',
    ],
    icon: FaHeartbeat,
    accentColor: '#ef4444',
  },

  // ==========================================
  // CATEGORY 2: AGENTIC AI (6 - 10)
  // ==========================================
  {
    id: '6',
    slug: 'neurox-autonomous-multi-agent-task-execution',
    number: '06',
    title: 'NeuroX – Autonomous Multi-Agent Task Execution Platform',
    category: 'Agentic AI',
    difficulty: 'Advanced',
    technologies: ['Python', 'Django', 'React', 'LangGraph', 'Ollama'],
    shortDescription:
      'Autonomous multi-agent coordination architecture executing complex multi-step reasoning goals with self-correction.',
    overview:
      'An autonomous agentic platform built on LangGraph where autonomous agents plan, execute, critique, and self-correct multi-step technical workflows locally through Ollama, delivering end-to-end task automation.',
    problemStatement:
      'Single-prompt LLMs fail when tackling intricate real-world goals requiring iterative planning, external tool usage, evaluation loops, and state recovery upon errors.',
    objectives: [
      'Build cyclical agent graphs with planning, execution, and validation states.',
      'Support local, zero-cloud private LLM execution through Ollama integration.',
      'Deliver real-time visibility into agent reasoning trajectories and tool calls.',
    ],
    keyFeatures: [
      'Cyclical multi-agent graph orchestration powered by LangGraph',
      'Local model inference support using Ollama (Llama 3, Mistral, Qwen)',
      'Self-critique and autonomous retry mechanisms upon execution failure',
      'Integrated tool execution sandbox (code runner, search, calculator)',
      'Real-time streaming agent thoughts, tool logs, and execution graphs',
    ],
    frontendArchitecture:
      'React UI featuring dynamic DAG visualization of agent states, streaming thought timelines, and interactive tool output inspectors.',
    backendArchitecture:
      'Django backend managing agent run persistence, WebSocket communication, tool execution sandboxes, and LangGraph workflow runtime.',
    databaseInfo:
      'PostgreSQL database storing agent execution runs, state snapshots, tool invocation transcripts, and user prompts.',
    expectedModules: [
      'Agent Graph Configuration & State Machine',
      'Local Model Connector & Ollama Driver',
      'Sandboxed Tool Invocation Engine',
      'Live Execution Visualizer & WebSocket Gateway',
      'Run History & Performance Telemetry',
    ],
    projectWorkflow: [
      'User specifies high-level objective and available tool capabilities.',
      'Planner agent decomposes objective into atomic task graph.',
      'Executor agent invokes appropriate tools and produces intermediate artifacts.',
      'Critic agent evaluates output against task requirements; triggers refinement if deficient.',
      'Final synthesized output is streamed to client and saved to history.',
    ],
    learningOutcomes: [
      'Mastering LangGraph state machines and cyclical multi-agent workflows.',
      'Integrating local open-weight LLMs using Ollama.',
      'Building real-time reactive streaming web interfaces with React.',
    ],
    icon: FaBrain,
    accentColor: '#a855f7',
  },
  {
    id: '7',
    slug: 'synapx-collaborative-multi-agent-research-assistant',
    number: '07',
    title: 'SynapX – Collaborative Multi-Agent Research Assistant',
    category: 'Agentic AI',
    difficulty: 'Advanced',
    technologies: ['Python', 'CrewAI', 'FastAPI', 'React', 'PostgreSQL'],
    shortDescription:
      'Team of specialized autonomous agents collaborating on comprehensive literature review and technical synthesis.',
    overview:
      'A collaborative research automation system powered by CrewAI where discrete AI agents (Literature Researcher, Data Analyst, Technical Writer, and Fact-Checker) collaborate sequentially and hierarchically to generate rigorous research briefs.',
    problemStatement:
      'Synthesizing sprawling academic papers and industry literature requires multiple distinct cognitive tasks, resulting in high researcher fatigue and missed cross-domain connections.',
    objectives: [
      'Orchestrate role-playing AI agents with specialized prompts and tool permissions.',
      'Conduct automated multi-source research with citation tracking and bias checks.',
      'Format output into structured academic briefs complete with executive takeaways.',
    ],
    keyFeatures: [
      'Multi-agent role specialization (Researcher, Analyst, Critic, Formatter)',
      'Hierarchical task delegation with crew manager oversight',
      'Automated fact verification against source document excerpts',
      'Interactive agent chat room showing cross-agent deliberations',
      'Exportable research reports in Markdown, PDF, and HTML formats',
    ],
    frontendArchitecture:
      'React frontend showcasing live crew mission monitors, agent conversation feeds, and markdown report renderers.',
    backendArchitecture:
      'FastAPI asynchronous server managing CrewAI process lifecycles, background worker queues, and document vector stores.',
    databaseInfo:
      'PostgreSQL storing research briefs, reference bibliographies, agent team configurations, and session records.',
    expectedModules: [
      'Crew Configuration & Role Definition Module',
      'Literature Ingestion & Web Scraping Tool',
      'Fact-Checking & Validation Agent',
      'Multi-Agent Deliberation Channel',
      'Report Generation & Export Service',
    ],
    projectWorkflow: [
      'User enters research topic and depth criteria.',
      'Researcher agent searches repositories and extracts key passages.',
      'Analyst agent compiles empirical findings and synthesizes comparative matrices.',
      'Fact-checker verifies claims against retrieved citation contexts.',
      'Writer agent produces publication-ready research dossier.',
    ],
    learningOutcomes: [
      'Designing hierarchical agent swarms with CrewAI.',
      'Structuring async job runners in FastAPI.',
      'Building rich interactive multi-agent chat interfaces.',
    ],
    icon: FaNetworkWired,
    accentColor: '#34e0a1',
  },
  {
    id: '8',
    slug: 'autopilot-ai-autonomous-business-workflow-management',
    number: '08',
    title: 'AutoPilot AI – Autonomous Business Workflow Management System',
    category: 'Agentic AI',
    difficulty: 'Advanced',
    technologies: ['Python', 'LangGraph', 'Django', 'Activepieces'],
    shortDescription:
      'Self-directing business process automation executing conditional multi-app workflows with agentic decision nodes.',
    overview:
      'An enterprise automation platform marrying LangGraph autonomous decision loops with Activepieces workflow connectors, allowing intelligent agents to autonomously trigger webhooks, query databases, send notifications, and handle business edge-cases.',
    problemStatement:
      'Traditional rule-based automation engines (e.g. basic Zapier flows) break down whenever unexpected data shapes or novel business situations require nuanced judgment.',
    objectives: [
      'Embed LLM decision agents inside traditional multi-app automation pipelines.',
      'Connect open-source Activepieces integration blocks with agent reasoning nodes.',
      'Provide strict safety policies, human approval checkpoints, and replayable execution logs.',
    ],
    keyFeatures: [
      'Hybrid node canvas: deterministic integration blocks alongside autonomous agent nodes',
      'Activepieces open ecosystem connector integration (Slack, CRM, Email, Sheets)',
      'Autonomous exception recovery and contextual data transformation',
      'Human-in-the-loop approval gates for high-impact actions',
      'Granular audit trails detailing reasoning steps behind every automated action',
    ],
    frontendArchitecture:
      'React flowchart builder allowing users to design and monitor hybrid deterministic-agentic business automations.',
    backendArchitecture:
      'Django web services interfacing with Activepieces runner instances and LangGraph agent execution processes.',
    databaseInfo:
      'PostgreSQL database recording workflow definitions, run outcomes, credential stores, and approval requests.',
    expectedModules: [
      'Workflow Canvas & Graph Designer',
      'Agent Decision Node Runtime',
      'Connector Bridge & Webhook Listener',
      'Human Approval Escalation Service',
      'Execution Log & Telemetry Engine',
    ],
    projectWorkflow: [
      'Incoming event (e.g. new customer lead or invoice email) triggers workflow.',
      'Deterministic connectors normalize payload.',
      'Agentic node evaluates contextual nuances and chooses execution branch.',
      'If critical, system routes approval card to Slack or manager dashboard.',
      'Upon validation, connected downstream systems are updated automatically.',
    ],
    learningOutcomes: [
      'Combining agentic reasoning with enterprise workflow engines.',
      'Implementing human-in-the-loop escalation patterns in software.',
      'Integrating heterogeneous third-party APIs through open frameworks.',
    ],
    icon: FaCogs,
    accentColor: '#6366f1',
  },
  {
    id: '9',
    slug: 'devmate-ai-autonomous-software-development-assistant',
    number: '09',
    title: 'DevMate AI – Autonomous Software Development Assistant',
    category: 'Agentic AI',
    difficulty: 'Advanced',
    technologies: ['Python', 'LangGraph', 'FastAPI', 'Git Integration'],
    shortDescription:
      'Agentic coding assistant that inspects repositories, plans refactoring, and authors verified git commits.',
    overview:
      'An autonomous developer tool that analyzes codebases, understands issue tickets, formulates step-by-step refactoring plans, executes code modifications across multiple files, and validates changes by running test suites before authoring git branches.',
    problemStatement:
      'Developers spend considerable time on repetitive maintenance tasks like dependency bumps, lint remediation, boilerplate tests, and bug triage.',
    objectives: [
      'Enable multi-file code exploration, AST parsing, and targeted edits.',
      'Validate proposed changes against automated test runners before committing.',
      'Provide full transparency into diff proposals through interactive branch reviews.',
    ],
    keyFeatures: [
      'Repository AST indexing and symbol dependency graphing',
      'Step-by-step implementation planner with file modification diffs',
      'Automated test execution runner with iterative error fixing',
      'Local Git integration: creates branches, authors commit messages, and drafts PRs',
      'Interactive terminal and code review interface',
    ],
    frontendArchitecture:
      'React IDE-like dashboard featuring Monaco code editors, visual git diff inspectors, and terminal output streams.',
    backendArchitecture:
      'FastAPI server managing containerized repository sandboxes, git CLI wrappers, and LangGraph coding agents.',
    databaseInfo:
      'SQLite / PostgreSQL database keeping track of repository profiles, agent session logs, and commit histories.',
    expectedModules: [
      'Codebase Ingestion & AST Indexer',
      'Agentic Code Planner & Synthesizer',
      'Test Suite Runner & Validation Sandbox',
      'Git Branching & PR Authoring Module',
      'Web-Based Diff Reviewer UI',
    ],
    projectWorkflow: [
      'Developer assigns bug report or feature prompt to DevMate AI.',
      'Agent indexes repository files and identifies relevant modules.',
      'Agent drafts implementation plan and applies diffs in isolated sandbox.',
      'System executes project unit tests; if failing, agent inspects traceback and self-corrects.',
      'Validated changes are packaged into a git branch with clean commit summary.',
    ],
    learningOutcomes: [
      'Building agentic tools that interact with codebases and command lines.',
      'Implementing automated self-debugging and unit test loops.',
      'Creating rich code diff review interfaces in React.',
    ],
    icon: FaCode,
    accentColor: '#0ea5e9',
  },
  {
    id: '10',
    slug: 'researchflow-ai-multi-agent-research-report-platform',
    number: '10',
    title: 'ResearchFlow AI – Multi-Agent Research and Report Generation Platform',
    category: 'Agentic AI',
    difficulty: 'Advanced',
    technologies: ['Python', 'CrewAI', 'React', 'FAISS', 'Ollama'],
    shortDescription:
      'Multi-agent pipeline conducting web search, vector document retrieval, and publication-ready dossier generation.',
    overview:
      'An end-to-end intelligent research suite that coordinates multiple specialized agents to ingest document archives, execute semantic vector search in FAISS, draft comprehensive synthesis chapters, and compile annotated PDF reports.',
    problemStatement:
      'Analyst teams struggle to comb through large unstructured document archives and synthesise findings into coherent, verifiable briefing dossiers.',
    objectives: [
      'Combine dense vector retrieval (FAISS) with agentic query formulation.',
      'Coordinate writing and review agents for structured multi-chapter deliverables.',
      'Ensure zero hallucination through strict source grounding and citation anchors.',
    ],
    keyFeatures: [
      'Semantic document retrieval backed by FAISS vector index',
      'Multi-stage research pipeline: Discovery -> Outline -> Synthesis -> Editorial Review',
      'Automated footnotes and citation anchors mapping claims to source paragraphs',
      'Interactive knowledge graph visualizing relationships between extracted entities',
      'Multi-format export: PDF, DOCX, and Markdown',
    ],
    frontendArchitecture:
      'React portal offering research project setup wizards, real-time agent execution monitors, and document previewers.',
    backendArchitecture:
      'Python backend coordinating CrewAI agents, FAISS vector indexing, Ollama inference, and document compile tools.',
    databaseInfo:
      'PostgreSQL / SQLite database storing research dossiers, document chunks, user accounts, and citation indexes.',
    expectedModules: [
      'Document Archive & FAISS Vector Store',
      'Agentic Research Pipeline Coordinator',
      'Citation Grounding & Verification Engine',
      'Report Templating & Compilation Module',
      'Interactive Analytics & Graph Visualizer',
    ],
    projectWorkflow: [
      'User uploads technical documents or selects research domain.',
      'Document chunks are embedded and indexed into FAISS vector space.',
      'Research agent generates semantic queries to retrieve supporting evidence.',
      'Synthesizer agent authors chapters with grounded citation references.',
      'Editor agent reviews output for clarity and renders final formatted dossier.',
    ],
    learningOutcomes: [
      'Vector database integration using FAISS in Python.',
      'Building multi-step document generation pipelines with CrewAI.',
      'Designing clean editorial review workflows in modern web apps.',
    ],
    icon: FaBookOpen,
    accentColor: '#ec4899',
  },

  // ==========================================
  // CATEGORY 3: GENERATIVE AI (11 - 15)
  // ==========================================
  {
    id: '11',
    slug: 'visionai-text-to-video-generation-platform',
    number: '11',
    title: 'VisionAI – Text-to-Video Generation Platform',
    category: 'Generative AI',
    difficulty: 'Advanced',
    technologies: ['React', 'Django', 'Python', 'FFmpeg', 'Video Generation APIs'],
    shortDescription:
      'Generative synthesis studio rendering storyboard video sequences from descriptive text prompts and scripts.',
    overview:
      'A generative video creation platform that converts text scripts into visual storyboards, synthesizes scene keyframes using generative diffusion APIs, and stitches animations with sound effects and voiceovers via FFmpeg.',
    problemStatement:
      'Video production is prohibitively expensive and time-consuming for small marketing teams, educators, and content creators requiring fast visual prototypes.',
    objectives: [
      'Transform natural language prompts into cohesive multi-scene video clips.',
      'Coordinate frame generation, transition rendering, and audio synchronization via FFmpeg.',
      'Provide creators with a timeline editor to refine scenes before final render.',
    ],
    keyFeatures: [
      'Text-to-storyboard script parser with scene breakdown and shot descriptions',
      'Generative video and keyframe synthesis via state-of-the-art APIs',
      'Cloud video assembly and transition effects powered by FFmpeg',
      'Interactive timeline editor with clip trimming and voiceover synchronization',
      'Export in multiple aspect ratios (16:9 widescreen, 9:16 vertical reels)',
    ],
    frontendArchitecture:
      'React-based video studio interface featuring timeline scrubbers, scene cards, audio waveforms, and responsive video players.',
    backendArchitecture:
      'Django web framework with Celery distributed workers handling asynchronous render pipelines, asset caching, and FFmpeg processing.',
    databaseInfo:
      'PostgreSQL storing user projects, scene parameters, rendered media URLs, and generation credits.',
    expectedModules: [
      'Script Analysis & Scene Decomposer',
      'Generative Video API Integration Pipeline',
      'FFmpeg Media Stitching & Audio Mixer',
      'Timeline Canvas & Video Player UI',
      'Asset Management & Render Queue Service',
    ],
    projectWorkflow: [
      'Creator enters story premise or scene script.',
      'System analyzes prompt and generates multi-scene storyboard.',
      'Generative APIs synthesize video segments for each scene.',
      'FFmpeg stitches clips, adds seamless transitions, and layers audio.',
      'Final video renders and is available for instant streaming and download.',
    ],
    learningOutcomes: [
      'Integrating generative media APIs into full-stack web applications.',
      'Automating video compilation and audio mastering using FFmpeg.',
      'Building timeline editing controls in React.',
    ],
    icon: FaVideo,
    accentColor: '#f43f5e',
  },
  {
    id: '12',
    slug: 'storyforge-ai-story-script-generation-platform',
    number: '12',
    title: 'StoryForge AI – Intelligent Story and Script Generation Platform',
    category: 'Generative AI',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Django', 'React', 'Ollama'],
    shortDescription:
      'Creative writing copilot assisting narrative pacing, character dialogues, and branching interactive plots.',
    overview:
      'A specialized creative writing suite designed for novelists, screenwriters, and game developers, providing AI-assisted narrative worldbuilding, character voice consistency, plot outlining, and branching story path generation.',
    problemStatement:
      'Authors frequently experience creative roadblocks, character voice drift, and plot inconsistency when managing large narrative worlds across dozens of chapters.',
    objectives: [
      'Maintain character bible consistency and plot constraints across generations.',
      'Provide interactive branching options for choose-your-own-adventure storytelling.',
      'Run fully private local generation using open-weights via Ollama.',
    ],
    keyFeatures: [
      'Dynamic character bible and world lore keeper maintaining narrative memory',
      'Branching story path generator with node-based plot tree visualization',
      'Character dialogue tone modulator maintaining distinctive speaking styles',
      'Scene pacing analyzer flagging exposition drag or abrupt climaxes',
      'Exportable manuscript formats including Final Draft and standard EPUB',
    ],
    frontendArchitecture:
      'React frontend featuring distraction-free manuscript editors, branching graph visualizers, and character profile slide-overs.',
    backendArchitecture:
      'Django application handling manuscript persistence, lore retrieval algorithms, and local Ollama API streaming.',
    databaseInfo:
      'SQLite database storing manuscripts, chapter graphs, character metadata, and story lore vectors.',
    expectedModules: [
      'Manuscript Editor & Word Counter',
      'Character Bible & Lore Consistency Tracker',
      'Branching Plot Tree Visualizer',
      'Local Ollama Narrative Generator',
      'Book Formatting & Export Module',
    ],
    projectWorkflow: [
      'Author creates project and defines key characters, setting, and genre rules.',
      'Author drafts scenes with real-time AI continuations and dialogue polish.',
      'System validates character actions against established lore profile.',
      'Author branches plot into alternate storylines to explore narrative outcomes.',
      'Finished manuscript is formatted and exported.',
    ],
    learningOutcomes: [
      'Prompt engineering for long-context creative consistency.',
      'Building tree/graph data visualizers in React.',
      'Managing contextual memory in Django backends.',
    ],
    icon: FaBookOpen,
    accentColor: '#f59e0b',
  },
  {
    id: '13',
    slug: 'designcraft-ai-image-graphic-creation-platform',
    number: '13',
    title: 'DesignCraft AI – AI-Powered Image and Graphic Creation Platform',
    category: 'Generative AI',
    difficulty: 'Advanced',
    technologies: ['React', 'FastAPI', 'Python', 'Diffusers'],
    shortDescription:
      'Diffusion-based studio for creating visual assets, brand graphics, and parametric digital artwork.',
    overview:
      'A web-based creative graphics studio utilizing Hugging Face Diffusers to generate high-resolution marketing assets, social media banners, vector-style icons, and visual mockups from descriptive prompts with style controls.',
    problemStatement:
      'Marketing and product teams often need rapid custom graphics tailored to specific brand palettes, but commissioning designers for simple mockups slows down release velocity.',
    objectives: [
      'Provide an accessible interface for generative diffusion pipelines.',
      'Support brand palette conditioning, negative prompt controls, and aspect ratio tuning.',
      'Enable rapid image iteration through inpainting and variations.',
    ],
    keyFeatures: [
      'Text-to-image synthesis with resolution, step, and guidance scale tuning',
      'Pre-built curated design presets (3D Render, Flat Vector, Cyberpunk, Watercolor)',
      'Brand color palette locking and negative prompt filtering',
      'Interactive canvas for image inpainting and background removal',
      'High-resolution image gallery with tagging and batch downloads',
    ],
    frontendArchitecture:
      'React application with HTML5 Canvas drawing tools for inpainting masks, live prompt preview bars, and responsive media grids.',
    backendArchitecture:
      'FastAPI server managing GPU-accelerated Stable Diffusion pipelines, image post-processing, and asynchronous task queues.',
    databaseInfo:
      'PostgreSQL database storing generation parameters, user image libraries, style presets, and metadata.',
    expectedModules: [
      'Diffusion Model Execution Pipeline',
      'Canvas Inpainting & Masking Service',
      'Style Preset & Palette Controller',
      'Media Storage & Image Optimization',
      'User Gallery & Download Manager',
    ],
    projectWorkflow: [
      'User chooses style preset, enters descriptive prompt, and locks brand colors.',
      'FastAPI submits parameters to Diffusers inference engine.',
      'Model synthesizes image batch; progress updates stream to React client.',
      'User adjusts image with canvas inpainting or requests variations.',
      'High-resolution graphic is exported in PNG, WEBP, or SVG formats.',
    ],
    learningOutcomes: [
      'Deploying PyTorch and Diffusers models in production with FastAPI.',
      'Building interactive HTML5 canvas masking utilities in React.',
      'Managing asynchronous heavy-compute GPU workloads on the web.',
    ],
    icon: FaPalette,
    accentColor: '#ec4899',
  },
  {
    id: '14',
    slug: 'codegen-ai-code-generation-explanation-platform',
    number: '14',
    title: 'CodeGen AI – Intelligent Code Generation and Explanation Platform',
    category: 'Generative AI',
    difficulty: 'Intermediate',
    technologies: ['React', 'Python', 'FastAPI', 'Ollama'],
    shortDescription:
      'Interactive programming studio providing syntax generation, unit tests, and multi-language code explanation.',
    overview:
      'A developer productivity platform that generates production-ready code snippets, refactors legacy codebases, authors comprehensive unit test suites, and provides step-by-step logic explanations in plain English across 15+ programming languages.',
    problemStatement:
      'Engineers frequently grapple with unfamiliar APIs, legacy unannotated algorithms, and writing repetitive unit test boilerplate, reducing time spent on core business logic.',
    objectives: [
      'Generate idiomatically correct code across modern languages (Python, TS, Go, Rust).',
      'Translate technical code into plain-English algorithmic breakdowns for learning.',
      'Produce comprehensive unit test suites covering edge cases and error handling.',
    ],
    keyFeatures: [
      'Multi-language code generation from natural language specifications',
      'Line-by-line interactive code explainer highlighting algorithmic complexity',
      'Automated unit test generator targeting PyTest, Jest, and Go testing frameworks',
      'Code refactoring tool optimizing time complexity and code clarity',
      'Integrated Monaco code editor with syntax highlighting and instant copying',
    ],
    frontendArchitecture:
      'React frontend embedded with Monaco Code Editor, split-view comparison diffs, and syntax-highlighted markdown blocks.',
    backendArchitecture:
      'FastAPI server handling prompt engineering templates, token streaming, and local model inference via Ollama.',
    databaseInfo:
      'PostgreSQL or SQLite database storing user snippet snippets, history logs, and custom prompt templates.',
    expectedModules: [
      'Code Generation Engine & Prompt Orchestrator',
      'Code Explanation & Complexity Analyzer',
      'Unit Test Synthesizer Module',
      'Monaco Editor & Diff Viewer UI',
      'Snippet Library & Bookmark Manager',
    ],
    projectWorkflow: [
      'Developer enters task description or pastes an existing code snippet.',
      'Developer selects desired action (Generate, Explain, Test, Refactor).',
      'FastAPI streams LLM response tokens directly to the Monaco editor.',
      'User reviews code, examines complexity notes, and copies output.',
      'Snippet can be saved to user personal development notebook.',
    ],
    learningOutcomes: [
      'Integrating Monaco Editor in React applications.',
      'Streaming LLM completions using Server-Sent Events with FastAPI.',
      'Designing effective prompt templates for programming tasks.',
    ],
    icon: FaCode,
    accentColor: '#10b981',
  },
  {
    id: '15',
    slug: 'docugen-ai-automated-document-report-generation',
    number: '15',
    title: 'DocuGen AI – Automated Document and Report Generation Platform',
    category: 'Generative AI',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Django', 'LLMs', 'React', 'SQLite'],
    shortDescription:
      'Enterprise report synthesizer turning raw metrics, meeting notes, and bullet points into formatted executive briefs.',
    overview:
      'An automated document authoring system that aggregates unstructured project notes, spreadsheet data, and meeting transcripts to draft professionally formatted business reports, quarterly reviews, and technical project summaries.',
    problemStatement:
      'Corporate professionals spend hours weekly consolidating scattered bullets and metrics into polished, executive-ready documentation and client deliverables.',
    objectives: [
      'Transform unstructured bullet notes and CSVs into structured documents.',
      'Enforce consistent corporate styling, tone, and document hierarchy.',
      'Export high-fidelity PDF and Word reports with automated tables of contents.',
    ],
    keyFeatures: [
      'Multi-source ingestion: upload raw notes, transcripts, or tabular CSV data',
      'Customizable document templates (Business Case, Quarterly Review, Project Post-Mortem)',
      'Intelligent section drafting with automatic executive summaries',
      'Embedded data visualization tables and chart summaries',
      'One-click PDF compilation with corporate headers and footers',
    ],
    frontendArchitecture:
      'React interface featuring rich WYSIWYG editing, section re-ordering drag-and-drop, and live print preview.',
    backendArchitecture:
      'Django backend handling template interpolation, LLM document generation prompts, and server-side PDF compilation.',
    databaseInfo:
      'SQLite database storing report templates, generated document drafts, and user workspaces.',
    expectedModules: [
      'Template Builder & Document Schemas',
      'LLM Document Drafting Pipeline',
      'Rich Text Editor & Review Interface',
      'Data Summarization & Table Generator',
      'PDF / DOCX Export Compiler',
    ],
    projectWorkflow: [
      'User selects report template and uploads raw project notes or data sheets.',
      'LLM processes materials and populates each report section.',
      'User reviews and edits drafted sections in the rich text editor.',
      'System generates executive summary and key metrics callouts.',
      'Report compiles into high-resolution formatted PDF ready for distribution.',
    ],
    learningOutcomes: [
      'Document automation and PDF compilation in Python.',
      'Structured document synthesis using LLM prompt chains.',
      'Building rich text editing interfaces in React.',
    ],
    icon: FaFileAlt,
    accentColor: '#6366f1',
  },

  // ==========================================
  // CATEGORY 4: MACHINE LEARNING (16 - 20)
  // ==========================================
  {
    id: '16',
    slug: 'fraudshield-realtime-financial-fraud-detection',
    number: '16',
    title: 'FraudShield – Real-Time Financial Fraud Detection System',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    technologies: ['Python', 'Scikit-learn', 'Flask', 'React', 'PostgreSQL'],
    shortDescription:
      'High-throughput anomaly detection system identifying suspicious financial transactions with low false-positive rates.',
    overview:
      'A machine learning-powered financial fraud detection engine that evaluates banking transactions in real time, computes anomaly scores using Random Forest and Isolation Forest models, and alerts fraud analysts of suspicious behaviors.',
    problemStatement:
      'Financial institutions face billions in fraudulent chargebacks each year; static rule engines fail against emerging fraud patterns while producing high false-positive alarms.',
    objectives: [
      'Achieve sub-50ms transaction fraud scoring on streaming banking data.',
      'Maintain high sensitivity to rare fraudulent events with imbalanced learning techniques.',
      'Provide fraud investigators with clear risk explanations and transaction context.',
    ],
    keyFeatures: [
      'Real-time anomaly scoring combining Isolation Forests and XGBoost classifiers',
      'Imbalanced dataset optimization using SMOTE and threshold calibration',
      'Risk indicator breakdown (velocity checks, geographical anomalies, amount spikes)',
      'Fraud investigator review workbench with approve/freeze account actions',
      'Continuous model performance tracking and ROC-AUC telemetry',
    ],
    frontendArchitecture:
      'React monitoring console with live transaction feeds, color-coded risk flags, and interactive anomaly inspection cards.',
    backendArchitecture:
      'Flask microservice optimized for low-latency scoring, feature extraction pipelines, and database updates.',
    databaseInfo:
      'PostgreSQL database storing transaction logs, customer risk baselines, fraud alerts, and analyst audit decisions.',
    expectedModules: [
      'Transaction Ingestion & Feature Engineering Service',
      'Anomaly Detection & Scoring Pipeline',
      'Real-Time Alert Dispatcher',
      'Investigator Review Workbench',
      'Model Metrics & ROC Evaluation Monitor',
    ],
    projectWorkflow: [
      'Payment transaction payload arrives at Flask scoring endpoint.',
      'Feature pipeline extracts velocity, card history, and geolocation deviations.',
      'Trained ensemble model predicts fraud probability score.',
      'If score exceeds threshold, transaction is held and dispatched to investigator queue.',
      'Analyst inspects risk indicators and confirms or dismisses the fraud alert.',
    ],
    learningOutcomes: [
      'Handling severe class imbalance in machine learning problems.',
      'Real-time low-latency feature engineering and model serving.',
      'Designing mission-critical security and alert dashboards in React.',
    ],
    icon: FaShieldAlt,
    accentColor: '#ef4444',
  },
  {
    id: '17',
    slug: 'pricecast-real-estate-price-prediction-platform',
    number: '17',
    title: 'PriceCast – Intelligent Real Estate Price Prediction Platform',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    technologies: ['Python', 'XGBoost', 'Django', 'React', 'MySQL'],
    shortDescription:
      'Gradient-boosted valuation model predicting property prices based on geospatial, structural, and market variables.',
    overview:
      'A predictive real estate intelligence platform that evaluates residential property values by analyzing square footage, zip code demographics, proximity to amenities, historical sales trends, and property condition using an XGBoost regression model.',
    problemStatement:
      'Home buyers, sellers, and lenders often face conflicting or opaque property valuations that fail to incorporate micro-market dynamics and structural variables.',
    objectives: [
      'Predict property market prices with low Root Mean Squared Error (RMSE).',
      'Identify the top structural and neighborhood factors that drive property value appreciation.',
      'Provide interactive valuation calculators for prospective home buyers and realtors.',
    ],
    keyFeatures: [
      'Predictive valuation calculator with instant confidence interval estimates',
      'Geospatial amenity scoring (schools, transit, shopping centers)',
      'SHAP value feature explainability showing how specific features boost or reduce price',
      'Historical neighborhood price trend charts and investment return estimates',
      'Exportable comprehensive property valuation report',
    ],
    frontendArchitecture:
      'React frontend featuring interactive valuation sliders, map integration, and Chart.js price trend visualizers.',
    backendArchitecture:
      'Django backend hosting data preprocessing pipelines, XGBoost model serialization, and valuation APIs.',
    databaseInfo:
      'MySQL database storing historical property sales, neighborhood census data, and saved valuation records.',
    expectedModules: [
      'Property Feature Preprocessing & Encoder',
      'XGBoost Valuation Regression Model',
      'Geospatial Neighborhood Scoring Service',
      'Interactive Valuation Simulator UI',
      'Market Trends & Analytics Engine',
    ],
    projectWorkflow: [
      'User specifies property parameters (bedrooms, square feet, zip code, age).',
      'Backend normalizes features and queries neighborhood amenity metrics.',
      'Trained XGBoost model calculates estimated property valuation and price spread.',
      'System renders feature impact breakdown and comparable local sales.',
      'User saves valuation or downloads detailed PDF appraisal.',
    ],
    learningOutcomes: [
      'Regression modeling and hyperparameter tuning with XGBoost.',
      'Model interpretability and feature importance with SHAP.',
      'Integrating interactive data calculators in React with Django.',
    ],
    icon: FaHome,
    accentColor: '#34e0a1',
  },
  {
    id: '18',
    slug: 'demandpredict-retail-sales-forecasting-analytics',
    number: '18',
    title: 'DemandPredict – Retail Sales Forecasting and Analytics System',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Pandas', 'Prophet', 'FastAPI', 'React'],
    shortDescription:
      'Time-series forecasting platform projecting future store inventory demand, promotional impact, and seasonal trends.',
    overview:
      'A supply-chain demand forecasting platform leveraging Facebook Prophet and Pandas to analyze historical sales data, identify seasonal patterns, holiday spikes, and promotional lifts, helping retail managers prevent stockouts and overstocking.',
    problemStatement:
      'Retailers lose significant margins through stockouts during unexpected demand spikes and waste capital holding surplus inventory due to inaccurate seasonal projections.',
    objectives: [
      'Generate weekly and monthly SKU-level demand forecasts with Prophet.',
      'Incorporate holiday calendars and scheduled promotional campaigns into predictions.',
      'Provide inventory reorder suggestions based on projected lead times.',
    ],
    keyFeatures: [
      'Multi-SKU time-series demand forecasting with uncertainty intervals',
      'Seasonal decomposition isolating holiday surges and weekly sales cycles',
      'Simulated promotional impact sandbox allowing managers to test price drops',
      'Recommended reorder quantity alerts preventing warehouse stockouts',
      'Interactive historical vs forecasted demand comparison charts',
    ],
    frontendArchitecture:
      'React analytics dashboard with dynamic time-series charts, inventory alert badges, and SKU filtering.',
    backendArchitecture:
      'FastAPI server managing time-series training runs, data aggregation with Pandas, and forecasting endpoints.',
    databaseInfo:
      'PostgreSQL database storing historical SKU transactions, store locations, supplier lead times, and forecast models.',
    expectedModules: [
      'Sales History Ingestion & Cleaning Module',
      'Prophet Time-Series Modeling Engine',
      'Inventory Optimization & Reorder Recommender',
      'Forecasting Analytics & Charting UI',
      'Scenario Testing & Promotion Simulator',
    ],
    projectWorkflow: [
      'Store manager uploads or syncs historical point-of-sale data.',
      'Data pipeline cleans anomalies, imputes missing dates, and loads holiday regressors.',
      'Prophet model fits time-series trends and computes 90-day future demand curves.',
      'System flags SKUs likely to drop below safety stock thresholds.',
      'Manager reviews reorder schedule and exports purchase order proposals.',
    ],
    learningOutcomes: [
      'Time-series forecasting methodologies using Facebook Prophet.',
      'Data wrangling and time-indexed aggregation with Pandas.',
      'Building supply-chain analytics visualizations in React.',
    ],
    icon: FaBoxes,
    accentColor: '#10b981',
  },
  {
    id: '19',
    slug: 'creditscore-credit-risk-assessment-loan-eligibility',
    number: '19',
    title: 'CreditScore – Credit Risk Assessment and Loan Eligibility System',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Scikit-learn', 'Flask', 'React', 'MongoDB'],
    shortDescription:
      'Automated loan underwriting and creditworthiness assessment using supervised learning and risk scoring.',
    overview:
      'An automated underwriting decision support platform that evaluates loan applicants based on debt-to-income ratios, credit histories, employment stability, and banking metrics to predict default probability and recommend loan terms.',
    problemStatement:
      'Traditional loan underwriting is slow and heavily reliant on rigid credit agency scores, frequently disqualifying creditworthy applicants with non-traditional financial profiles.',
    objectives: [
      'Predict loan default probability with calibrated machine learning classifiers.',
      'Automate preliminary loan pre-approval workflows to accelerate loan turnaround.',
      'Ensure transparency and fairness by identifying primary contributing factors for loan decisions.',
    ],
    keyFeatures: [
      'Automated loan pre-qualification and default risk probability calculation',
      'Applicant debt-to-income and cash flow stability scorecards',
      'Dynamic loan term and interest rate recommendation based on risk tier',
      'Underwriter decision portal with approve, deny, or request collateral actions',
      'Fair lending audit trails and adverse action explanation generator',
    ],
    frontendArchitecture:
      'React application featuring multi-step loan application forms, instant qualification feedback, and underwriter dashboards.',
    backendArchitecture:
      'Flask microservice handling applicant data validation, Scikit-learn inference, and decision rule engines.',
    databaseInfo:
      'MongoDB database storing flexible applicant financial records, bank statements, loan offers, and audit logs.',
    expectedModules: [
      'Applicant Onboarding & Form Validation',
      'Credit Risk Classification Engine',
      'Loan Pricing & Term Recommendation Service',
      'Underwriter Workbench & Decision Portal',
      'Regulatory Compliance & Audit Logger',
    ],
    projectWorkflow: [
      'Applicant submits employment, income, existing debt, and requested loan amount.',
      'Backend normalizes financial data and passes variables to trained classifier.',
      'Model calculates risk percentile and determines baseline eligibility.',
      'System generates personalized loan terms (interest rate, max amount, tenure).',
      'Underwriter reviews application with full risk factor breakdown for final sign-off.',
    ],
    learningOutcomes: [
      'Binary classification and probability calibration with Scikit-learn.',
      'Implementing financial scoring rules and risk tiering.',
      'Building multi-step financial onboarding experiences in React.',
    ],
    icon: FaCreditCard,
    accentColor: '#f59e0b',
  },
  {
    id: '20',
    slug: 'cropsense-smart-crop-recommendation-yield-prediction',
    number: '20',
    title: 'CropSense – Smart Crop Recommendation and Yield Prediction System',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Scikit-learn', 'Django', 'React', 'SQLite'],
    shortDescription:
      'Precision agriculture decision tool recommending optimal crops and predicting harvest yield based on soil and climate.',
    overview:
      'A precision agriculture application that guides farmers and agricultural specialists by analyzing soil nutrient levels (N, P, K), pH, temperature, humidity, and rainfall to recommend the most profitable and resilient crops while forecasting seasonal yield.',
    problemStatement:
      'Farmers often rely on traditional guesswork or outdated seasonal habits, resulting in sub-optimal crop choices, degraded soil health, and lower harvest yields under changing weather patterns.',
    objectives: [
      'Recommend optimal crops for specific soil chemistries and climatic regions.',
      'Forecast expected harvest yield per acre based on historical agro-climatic data.',
      'Provide actionable fertilizer and irrigation guidance to optimize farm output.',
    ],
    keyFeatures: [
      'Soil nutrient-driven crop recommendation engine with multi-class classification',
      'Harvest yield estimator based on localized seasonal rainfall and temperature models',
      'Fertilizer deficiency detector with tailored soil treatment advice',
      'Interactive crop calendar showing optimal planting and harvesting windows',
      'Offline-friendly responsive interface accessible via mobile devices in rural areas',
    ],
    frontendArchitecture:
      'Mobile-first responsive React interface featuring soil input dials, crop profile cards, and seasonal timeline charts.',
    backendArchitecture:
      'Django application providing recommendation endpoints, crop encyclopedia data, and ML prediction services.',
    databaseInfo:
      'SQLite database storing crop requirements, soil threshold matrices, and regional weather benchmarks.',
    expectedModules: [
      'Soil & Climate Input Validator',
      'Crop Classification & Recommendation Engine',
      'Yield Prediction Regression Model',
      'Fertilizer Advisory & Soil Health Guide',
      'Crop Knowledge Base & Regional Almanac',
    ],
    projectWorkflow: [
      'User inputs Nitrogen, Phosphorus, Potassium, soil pH, and regional rainfall values.',
      'Model compares values against trained agricultural datasets.',
      'System presents ranked list of top 3 recommended crops with yield expectations.',
      'User views detailed growth timeline and fertilizer recommendations.',
      'Farmer can save profile and track seasonal planting outcomes.',
    ],
    learningOutcomes: [
      'Multi-class classification algorithms applied to environmental datasets.',
      'Designing mobile-first accessible agricultural applications.',
      'Structuring clean API backends with Django and SQLite.',
    ],
    icon: FaSeedling,
    accentColor: '#10b981',
  },

  // ==========================================
  // CATEGORY 5: COMPUTER VISION (21 - 25)
  // ==========================================
  {
    id: '21',
    slug: 'visionguard-intelligent-security-surveillance-platform',
    number: '21',
    title: 'VisionGuard – Intelligent Security Surveillance Platform',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    technologies: ['Python', 'OpenCV', 'YOLO', 'Django', 'React'],
    shortDescription:
      'Real-time CCTV stream analyzer identifying perimeter breaches, unauthorized personnel, and safety hazards.',
    overview:
      'An enterprise computer vision platform that ingests live CCTV video feeds, detects humans, vehicles, and suspicious objects using YOLOv8, tracks movement trajectories via OpenCV, and immediately triggers alerts upon restricted perimeter violations.',
    problemStatement:
      'Human monitoring of dozens of simultaneous CCTV feeds leads to fatigue, missed security incidents, and slow response times during active intrusions or safety hazards.',
    objectives: [
      'Perform real-time multi-object detection and tracking across concurrent camera streams.',
      'Define virtual tripwires and exclusion zones that trigger instant security alarms.',
      'Log video clip snapshots with bounding boxes for forensic audit trails.',
    ],
    keyFeatures: [
      'Real-time object detection and classification powered by YOLOv8',
      'Virtual tripwire and polygonal exclusion zone monitoring',
      'Multi-camera grid dashboard with live bounding box rendering',
      'Automated incident snapshot capture and alert notification dispatcher',
      'Historical incident replay and security telemetry heatmaps',
    ],
    frontendArchitecture:
      'React surveillance dashboard featuring multi-pane live video grids, alert ticker banners, and interactive boundary drawing tools.',
    backendArchitecture:
      'Django web services handling security user permissions, alert dispatching, and communication with background OpenCV/YOLO video workers.',
    databaseInfo:
      'PostgreSQL database storing camera configurations, intrusion events, security zones, and incident audit logs.',
    expectedModules: [
      'Video Stream Ingestion & Decoding Pipeline',
      'YOLOv8 Detection & Object Tracking Engine',
      'Virtual Zone & Tripwire Evaluation Logic',
      'Security Operations Center (SOC) Dashboard UI',
      'Alert Dispatcher & Incident Archiver',
    ],
    projectWorkflow: [
      'CCTV IP camera streams RTSP video to OpenCV ingestion pipeline.',
      'YOLOv8 model processes frames, detecting and tracking moving objects.',
      'Zone evaluation algorithm checks if object coordinates cross forbidden boundaries.',
      'Upon violation, system captures timestamped snapshot and emits alert via WebSockets.',
      'Security operator assesses live alert and initiates security protocol.',
    ],
    learningOutcomes: [
      'Deep learning object detection and spatial tracking with YOLO and OpenCV.',
      'Processing real-time streaming video feeds in Python.',
      'Building mission-critical operations center dashboards in React.',
    ],
    icon: FaEye,
    accentColor: '#06b6d4',
  },
  {
    id: '22',
    slug: 'facetrack-face-recognition-attendance-management',
    number: '22',
    title: 'FaceTrack – Face Recognition-Based Attendance Management System',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    technologies: ['Python', 'OpenCV', 'Face Recognition', 'Flask', 'MySQL'],
    shortDescription:
      'Contactless facial biometric attendance platform with anti-spoofing liveness verification and shift reporting.',
    overview:
      'A biometric attendance tracking solution that utilizes OpenCV and deep facial embeddings to identify employees instantly from video cameras, verify physical liveness to prevent photo spoofing, and automatically record clock-in timestamps into enterprise payroll databases.',
    problemStatement:
      'Traditional fingerprint biometric sensors and badge cards are prone to buddy-punching, hardware wear-and-tear, and hygiene concerns in high-traffic work environments.',
    objectives: [
      'Achieve sub-second facial recognition with high matching accuracy.',
      'Implement passive blink and micro-motion liveness detection to thwart photo spoofing.',
      'Generate automated daily, weekly, and monthly workforce attendance analytics.',
    ],
    keyFeatures: [
      'Facial feature extraction and 128-d biometric embedding matching',
      'Anti-spoofing liveness verification detecting blinks and head pose variations',
      'Instant attendance logging with precise entry/exit timestamps',
      'HR admin portal managing employee rosters, leave requests, and shift rules',
      'Automated attendance reports exportable to Excel and payroll software',
    ],
    frontendArchitecture:
      'React application with embedded camera capture views, live employee recognition feedback, and HR management tables.',
    backendArchitecture:
      'Flask backend hosting biometric embedding index, liveness detection verification, and attendance record APIs.',
    databaseInfo:
      'MySQL database storing employee profiles, encrypted facial embedding vectors, department rosters, and attendance logs.',
    expectedModules: [
      'Video Capture & Face Detection Pipeline',
      'Biometric Embedding & Recognition Matcher',
      'Anti-Spoofing Liveness Verification Service',
      'HR Attendance Management & Roster UI',
      'Payroll Integration & Export Engine',
    ],
    projectWorkflow: [
      'Employee approaches kiosk camera; OpenCV isolates face bounding box.',
      'Liveness module confirms human presence via blink/movement check.',
      'Recognition engine extracts 128-d vector and matches against database embeddings.',
      'System greets recognized employee and logs timestamped check-in.',
      'HR dashboard updates live attendance roster in real time.',
    ],
    learningOutcomes: [
      'Facial detection, alignment, and biometric embedding comparisons.',
      'Implementing anti-spoofing liveness checks in computer vision.',
      'Connecting biometric sensors with relational business databases.',
    ],
    icon: FaSmile,
    accentColor: '#34e0a1',
  },
  {
    id: '23',
    slug: 'roadsense-realtime-traffic-monitoring-vehicle-detection',
    number: '23',
    title: 'RoadSense – Real-Time Traffic Monitoring and Vehicle Detection System',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    technologies: ['Python', 'YOLO', 'OpenCV', 'FastAPI', 'React'],
    shortDescription:
      'Intelligent transportation system tracking vehicle density, speed anomalies, and road congestion indices.',
    overview:
      'A smart city traffic analytics platform that processes roadway camera streams, detects and classifies vehicles (cars, trucks, buses, motorcycles), calculates average traffic velocity, and visualizes real-time intersection congestion levels.',
    problemStatement:
      'Municipal traffic control centers lack dynamic, cost-effective visibility into intersection bottlenecks, resulting in unoptimized traffic signal timings and extended urban commute delays.',
    objectives: [
      'Classify vehicles into distinct categories with YOLO detection models.',
      'Calculate vehicle velocity and lane density metrics using spatial tracking.',
      'Provide city traffic planners with heatmaps and congestion forecasts.',
    ],
    keyFeatures: [
      'Multi-class vehicle detection (cars, commercial trucks, buses, two-wheelers)',
      'Vehicle velocity estimation and traffic volume counting per lane',
      'Congestion index rating with automatic bottleneck detection',
      'Interactive municipal traffic map with real-time intersection status',
      'Historical traffic flow reports assisting urban traffic signal timing plans',
    ],
    frontendArchitecture:
      'React dashboard featuring interactive GIS maps, real-time vehicle counter charts, and video stream inspection panels.',
    backendArchitecture:
      'FastAPI server managing high-speed video inference pipelines, telemetry message queues, and analytical aggregations.',
    databaseInfo:
      'PostgreSQL with TimescaleDB extension storing high-frequency vehicle counts, speed logs, and sensor coordinates.',
    expectedModules: [
      'Traffic Stream Processing & Video Decoder',
      'YOLO Vehicle Classification & Tracker',
      'Lane Velocity & Congestion Estimator',
      'Smart City Traffic Map & Analytics UI',
      'Historical Traffic Report Generator',
    ],
    projectWorkflow: [
      'Traffic camera video feeds stream to backend pipeline.',
      'YOLO identifies vehicles and assigns unique tracking IDs across frames.',
      'System calculates lane occupancy, flow rate, and average speed.',
      'Congestion index is updated and transmitted to React traffic dashboard.',
      'City planners examine bottleneck trends to optimize signal timing.',
    ],
    learningOutcomes: [
      'Real-time object tracking and velocity calculation in OpenCV.',
      'Handling high-throughput sensor telemetry with FastAPI.',
      'Designing spatial map-based data visualization dashboards.',
    ],
    icon: FaCar,
    accentColor: '#f59e0b',
  },
  {
    id: '24',
    slug: 'signspeak-realtime-sign-language-recognition',
    number: '24',
    title: 'SignSpeak – Real-Time Sign Language Recognition Platform',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    technologies: ['Python', 'MediaPipe', 'TensorFlow', 'React'],
    shortDescription:
      'Assistive communication platform translating American Sign Language (ASL) gestures into real-time text and speech.',
    overview:
      'An accessible assistive technology platform that captures hand and body gesture landmarks using Google MediaPipe, classifies dynamic sign language gestures with a recurrent neural network, and translates them into live on-screen text and synthesized audio.',
    problemStatement:
      'Communication barriers between deaf or hard-of-hearing sign language users and non-signers create significant accessibility hurdles in customer service, healthcare, and education.',
    objectives: [
      'Track 21 3D hand landmarks in real time via standard webcams.',
      'Classify complex dynamic sign language gestures with high temporal accuracy.',
      'Deliver fluid, low-latency text translation and text-to-speech audio playback.',
    ],
    keyFeatures: [
      'High-precision hand and body pose landmark tracking using MediaPipe',
      'Deep sequence classification model (LSTM / GRU) recognizing continuous signs',
      'Real-time sentence builder that constructs grammatically coherent phrases',
      'Integrated text-to-speech audio synthesizer voicing translated gestures',
      'Interactive sign language learning practice mode with visual landmark feedback',
    ],
    frontendArchitecture:
      'React web application utilizing client-side webcam streams, HTML5 canvas for landmark overlays, and Web Speech API for voice playback.',
    backendArchitecture:
      'Python / TensorFlow backend providing model training scripts, gesture dictionary definitions, and WebSocket translation endpoints.',
    databaseInfo:
      'SQLite or MongoDB database storing gesture datasets, landmark training arrays, and user vocabulary progress.',
    expectedModules: [
      'Webcam Video & MediaPipe Landmark Extractor',
      'Temporal Gesture Classification Model (LSTM)',
      'Sentence Formation & Grammar Engine',
      'Text-to-Speech Audio Synthesizer',
      'Interactive Learning & Practice Mode',
    ],
    projectWorkflow: [
      'User enables webcam; MediaPipe extracts 3D coordinates for 21 hand joints.',
      'Normalized landmark vectors are fed into recurrent neural network.',
      'Model predicts corresponding sign alphabet or vocabulary word.',
      'Sentence builder assembles words and triggers text-to-speech audio.',
      'Audience hears and reads translated gesture communication instantly.',
    ],
    learningOutcomes: [
      'Using Google MediaPipe for real-time 3D landmark extraction.',
      'Training sequence classification neural networks for gesture recognition.',
      'Developing accessible human-computer interfaces with React and Web Speech API.',
    ],
    icon: FaHands,
    accentColor: '#8b7cff',
  },
  {
    id: '25',
    slug: 'qualityvision-industrial-product-defect-detection',
    number: '25',
    title: 'QualityVision – Automated Industrial Product Defect Detection System',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    technologies: ['Python', 'OpenCV', 'PyTorch', 'Django', 'PostgreSQL'],
    shortDescription:
      'High-speed assembly line inspection model identifying manufacturing surface defects and structural flaws.',
    overview:
      'An automated visual quality assurance system designed for manufacturing lines that inspects components passing on conveyor belts, detects surface scratches, dents, and assembly deviations using PyTorch convolutional networks, and flags non-conforming items.',
    problemStatement:
      'Manual visual inspection on fast-moving manufacturing assembly lines is subject to inspector fatigue, inconsistent quality thresholds, and delayed defect discovery.',
    objectives: [
      'Detect and localize microscopic surface defects at high conveyor speeds.',
      'Classify defects into categorized failure types (scratches, cracks, misalignments).',
      'Provide factory floor managers with real-time yield analytics and reject alerts.',
    ],
    keyFeatures: [
      'High-speed visual surface anomaly detection using PyTorch vision models',
      'Defect segmentation highlighting exact flaw contours and dimensions',
      'Configurable defect severity tolerance thresholds for diverse product SKUs',
      'Factory floor live QA monitor with audio/visual reject alarms',
      'Statistical Process Control (SPC) yield charts tracking defect root causes',
    ],
    frontendArchitecture:
      'Industrial-grade React inspection UI with high-contrast inspection views, defect heatmaps, and batch yield dials.',
    backendArchitecture:
      'Django application interfacing with factory camera hardware, running PyTorch inference engines, and recording quality metrics.',
    databaseInfo:
      'PostgreSQL database storing batch inspection histories, defect coordinates, camera calibrations, and operator logs.',
    expectedModules: [
      'High-Speed Frame Capture & Lighting Calibration',
      'PyTorch Anomaly Segmentation Model',
      'Defect Classification & Sizing Service',
      'Factory Floor Live Quality Monitor',
      'Statistical Process Control (SPC) Reporting',
    ],
    projectWorkflow: [
      'Optical camera captures high-resolution frame of product on conveyor belt.',
      'Image preprocessing normalizes lighting and isolates product boundaries.',
      'PyTorch segmentation model pinpoints structural anomalies and scratches.',
      'If defect exceeds tolerance, pneumatic reject actuator is triggered.',
      'Factory dashboard logs flaw image and updates real-time batch yield rate.',
    ],
    learningOutcomes: [
      'Image segmentation and anomaly detection with PyTorch.',
      'Industrial computer vision pipeline design and lighting calibration.',
      'Building Statistical Process Control monitoring tools in React.',
    ],
    icon: FaIndustry,
    accentColor: '#ef4444',
  },

  // ==========================================
  // CATEGORY 6: WEB APPLICATION PROJECTS (26 - 30)
  // ==========================================
  {
    id: '26',
    slug: 'shopsphere-multivendor-ecommerce-marketplace',
    number: '26',
    title: 'ShopSphere – Multi-Vendor E-Commerce Marketplace',
    category: 'Web Application Projects',
    difficulty: 'Intermediate',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    shortDescription:
      'Multi-tenant online shopping marketplace with vendor portals, shopping cart, and unified payment processing.',
    overview:
      'A full-featured multi-vendor e-commerce platform allowing independent merchants to open digital storefronts, manage product inventories, and process customer orders, while providing shoppers with a unified checkout and review experience.',
    problemStatement:
      'Small retail vendors struggle to launch independent digital storefronts without expensive custom development or restrictive legacy marketplace fees.',
    objectives: [
      'Deliver isolated vendor dashboards for product catalog and payout management.',
      'Implement atomic shopping carts, discount coupons, and multi-item checkouts.',
      'Ensure high concurrency performance during seasonal promotional sales.',
    ],
    keyFeatures: [
      'Dedicated vendor portal with product CRUD, stock alerts, and payout tracking',
      'Customer storefront with multi-attribute filtering, search, and reviews',
      'Persistent shopping cart with guest and authenticated session merging',
      'Integrated payment gateway handling escrow payouts and order reconciliation',
      'Customer order tracking with real-time shipping status updates',
    ],
    frontendArchitecture:
      'Modern React application with Redux Toolkit state management, responsive product grids, and smooth cart drawer animations.',
    backendArchitecture:
      'Node.js and Express RESTful API with JWT authentication, role-based access control (Admin, Vendor, Customer), and rate limiting.',
    databaseInfo:
      'MongoDB database with schemas for products, vendors, user accounts, orders, reviews, and coupon codes.',
    expectedModules: [
      'Vendor Onboarding & Storefront Customizer',
      'Product Catalog & Inventory Management',
      'Shopping Cart & Checkout Engine',
      'Payment Gateway & Commission Payout Service',
      'Order Fulfillment & Shipment Tracker',
    ],
    projectWorkflow: [
      'Vendor registers, completes store profile, and lists products with variants.',
      'Customer browses items, adds to unified cart across multiple vendors.',
      'Customer completes secure checkout via integrated payment gateway.',
      'Orders are partitioned and routed to respective vendor dashboards.',
      'Vendors fulfill items; customer tracks tracking numbers until delivery.',
    ],
    learningOutcomes: [
      'Architecting multi-tenant e-commerce systems with MERN stack.',
      'Managing complex cart state and checkout sessions.',
      'Designing role-based permission architectures in Node.js.',
    ],
    icon: FaShoppingCart,
    accentColor: '#34e0a1',
  },
  {
    id: '27',
    slug: 'careerbridge-online-recruitment-job-management',
    number: '27',
    title: 'CareerBridge – Online Recruitment and Job Management Portal',
    category: 'Web Application Projects',
    difficulty: 'Intermediate',
    technologies: ['Angular', 'Java', 'Spring Boot', 'MySQL'],
    shortDescription:
      'Enterprise job board connecting applicants with hiring teams featuring applicant tracking and interview pipelines.',
    overview:
      'A robust recruitment and talent acquisition portal built with Angular and Java Spring Boot, enabling companies to publish job openings, track candidate progress through multi-stage hiring pipelines, and coordinate interview schedules.',
    problemStatement:
      'Hiring teams often manage candidate resumes across messy email inboxes and spreadsheets, leading to lost applicants, delayed responses, and poor employer branding.',
    objectives: [
      'Streamline recruitment workflows from job posting to formal job offer.',
      'Provide Kanban-style candidate stage progression (Applied, Screened, Interview, Offered).',
      'Deliver automated email updates to keep candidates informed at every milestone.',
    ],
    keyFeatures: [
      'Employer job requisition publisher with custom qualification questions',
      'Candidate applicant tracking board with drag-and-drop stage progression',
      'Applicant job search engine with location, salary, and remote filters',
      'Integrated interview scheduling with calendar invites and interviewer scorecards',
      'Company culture profile pages showcasing team reviews and perks',
    ],
    frontendArchitecture:
      'Angular single-page application using Angular Material components, reactive forms, and RxJS data streams.',
    backendArchitecture:
      'Enterprise Java Spring Boot microservice architecture with Spring Security, JWT authentication, and JPA/Hibernate ORM.',
    databaseInfo:
      'MySQL relational database managing normalized tables for users, companies, job listings, applications, and interview logs.',
    expectedModules: [
      'Authentication & Role-Based Authorization (Spring Security)',
      'Job Listing & Requisition Management',
      'Applicant Tracking System (ATS) Pipeline',
      'Interview Scheduling & Feedback Module',
      'Candidate Application Portal',
    ],
    projectWorkflow: [
      'Employer posts job requisition with department, salary, and prerequisites.',
      'Job seekers search portal and apply with resume upload and profile.',
      'Recruiter reviews applicants on Kanban board and advances candidates.',
      'System sends interview invites with calendar attachments to all parties.',
      'Hiring manager submits interview evaluation and triggers formal offer letter.',
    ],
    learningOutcomes: [
      'Developing enterprise web services using Java Spring Boot.',
      'Building structured component-based UIs with Angular and TypeScript.',
      'Database schema design and query optimization in MySQL.',
    ],
    icon: FaBriefcase,
    accentColor: '#f59e0b',
  },
  {
    id: '28',
    slug: 'stayease-hotel-reservation-property-management',
    number: '28',
    title: 'StayEase – Hotel Reservation and Property Management System',
    category: 'Web Application Projects',
    difficulty: 'Intermediate',
    technologies: ['React', 'Python', 'Django', 'PostgreSQL'],
    shortDescription:
      'Hospitality booking engine managing room inventories, stay dates, guest billing, and front-desk operations.',
    overview:
      'A hospitality management system that combines an intuitive customer room reservation portal with an administrative front-desk dashboard to manage room types, housekeeping statuses, seasonal room rates, and guest folio billing.',
    problemStatement:
      'Boutique hotels and bed-and-breakfasts struggle with double-bookings, manual room allocation errors, and complex seasonal price adjustments without an integrated reservation engine.',
    objectives: [
      'Prevent booking collisions through atomic room date availability verification.',
      'Provide front-desk managers with visual room occupancy calendar grids.',
      'Support dynamic seasonal pricing, discount packages, and guest invoicing.',
    ],
    keyFeatures: [
      'Interactive room availability calendar with date range picker',
      'Tiered room catalogs with photo galleries, amenities, and capacity specs',
      'Front-desk master grid showing check-ins, check-outs, and housekeeping states',
      'Integrated guest billing calculating taxes, room service, and payments',
      'Automated reservation confirmation emails with printable booking vouchers',
    ],
    frontendArchitecture:
      'React frontend featuring responsive booking date selectors, interactive room cards, and administrative calendar matrices.',
    backendArchitecture:
      'Django REST Framework managing transactional booking state, inventory concurrency locks, and payment processing.',
    databaseInfo:
      'PostgreSQL database storing room inventories, rate rules, reservations, guest folios, and housekeeping logs.',
    expectedModules: [
      'Guest Booking & Room Availability Engine',
      'Front-Desk Operations & Room Grid',
      'Rate Management & Seasonal Pricing Rule Engine',
      'Billing, Invoicing & Folio Management',
      'Housekeeping & Maintenance Scheduler',
    ],
    projectWorkflow: [
      'Guest selects travel dates, guest count, and preferred room type.',
      'Backend queries room availability and calculates dynamic rate quote.',
      'Guest confirms reservation with deposit payment.',
      'Front-desk calendar updates automatically and assigns specific room key.',
      'Upon check-out, system compiles incidental charges and issues final invoice.',
    ],
    learningOutcomes: [
      'Managing temporal date-range constraints and avoiding double-bookings.',
      'Building calendar-based operational dashboards in React.',
      'Implementing transactional billing models in Django.',
    ],
    icon: FaHotel,
    accentColor: '#10b981',
  },
  {
    id: '29',
    slug: 'eventora-event-management-ticket-booking-platform',
    number: '29',
    title: 'Eventora – Event Management and Ticket Booking Platform',
    category: 'Web Application Projects',
    difficulty: 'Intermediate',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    shortDescription:
      'Event publishing and ticketing portal with dynamic seating, QR check-in, and organizer analytics.',
    overview:
      'An end-to-end event ticketing ecosystem that enables organizers to host physical and virtual events, design tiered ticket structures, and monitor attendee sales, while attendees enjoy instant seat selection, digital tickets, and QR code verification.',
    problemStatement:
      'Event organizers face high ticketing fees, difficult attendee communication, and cumbersome physical badge check-in processes at event entrances.',
    objectives: [
      'Enable rapid event publication with tiered early-bird, VIP, and general tickets.',
      'Generate cryptographically signed QR code tickets for instantaneous venue check-in.',
      'Provide organizers with real-time revenue analytics and attendee rosters.',
    ],
    keyFeatures: [
      'Event creator wizard with venue location maps, schedules, and speaker bios',
      'Tiered ticket inventory with automated countdown clocks and quantity caps',
      'Digital ticket generator with downloadable PDF passes and secure QR codes',
      'Mobile-optimized gatekeeper scanner interface for rapid venue admission',
      'Organizer analytics tracking ticket velocity, revenue, and attendee demographics',
    ],
    frontendArchitecture:
      'Next.js 14 App Router application with server-side rendering for SEO optimization, TypeScript type safety, and Tailwind/Bootstrap styling.',
    backendArchitecture:
      'Node.js REST API with Redis caching for ticket inventory locking, JWT tokens, and automated email dispatchers.',
    databaseInfo:
      'PostgreSQL database managing events, ticket tiers, orders, check-in logs, and organizer payout balances.',
    expectedModules: [
      'Event Creation & Ticketing Tier Configurator',
      'High-Concurrency Ticket Purchase Engine',
      'QR Code Ticket Generation & Emailer',
      'Gatekeeper Mobile Check-in Scanner',
      'Organizer Revenue & Sales Analytics',
    ],
    projectWorkflow: [
      'Organizer publishes event details, ticket categories, and sales dates.',
      'Attendee selects ticket tier and completes payment transaction.',
      'System locks inventory and delivers unique digital ticket with signed QR code.',
      'At venue, event staff scans QR code using mobile device scanner.',
      'Attendee is authenticated and admitted in under one second.',
    ],
    learningOutcomes: [
      'Server-side rendering and static optimization with Next.js.',
      'Handling high-contention ticket inventory locking.',
      'Generating and verifying cryptographic QR passes in web applications.',
    ],
    icon: FaCalendarAlt,
    accentColor: '#8b7cff',
  },
  {
    id: '30',
    slug: 'estatehub-real-estate-listing-rental-management',
    number: '30',
    title: 'EstateHub – Real Estate Listing and Rental Management Platform',
    category: 'Web Application Projects',
    difficulty: 'Intermediate',
    technologies: ['Vue.js', 'PHP', 'Laravel', 'MySQL'],
    shortDescription:
      'Property rental platform with interactive map search, lease agreements, and tenant messaging.',
    overview:
      'A real estate listing and property rental platform connecting landlords, realtors, and prospective tenants with features for verified property listings, virtual tour embedding, interactive map exploration, and digital rental application workflows.',
    problemStatement:
      'Renting property is complicated by unverified online listings, hidden agent fees, and disjointed communication between landlords and prospective tenants.',
    objectives: [
      'Provide verified property listings with geo-coordinates, photos, and amenities.',
      'Enable map-driven neighborhood property discovery with boundary filtering.',
      'Streamline rental applications and landlord-tenant direct messaging.',
    ],
    keyFeatures: [
      'Interactive map search with radius clustering and neighborhood filter overlays',
      'Landlord listing manager with image uploaders and lease requirement settings',
      'Direct in-app messaging channel between prospective tenants and landlords',
      'Digital rental application submission with document attachment support',
      'Tenant bookmarking, saved searches, and price reduction email notifications',
    ],
    frontendArchitecture:
      'Vue.js 3 single-page application utilizing Pinia state management, Leaflet map components, and responsive cards.',
    backendArchitecture:
      'PHP Laravel framework with Eloquent ORM, robust validation requests, policy-based authorization, and clean REST endpoints.',
    databaseInfo:
      'MySQL database with spatial indexes storing properties, user profiles, rental applications, messages, and saved favorites.',
    expectedModules: [
      'User Authentication & Role Management (Landlord / Tenant)',
      'Property Catalog & Geolocation Search',
      'Direct Messaging & Inquiry Channel',
      'Rental Application Submission Pipeline',
      'Favorites & Saved Search Notification Engine',
    ],
    projectWorkflow: [
      'Landlord publishes property specs, photos, rent price, and deposit terms.',
      'Prospective tenant searches listings using interactive map and budget filters.',
      'Tenant schedules viewing or messages landlord directly through the portal.',
      'Tenant submits digital rental application with background documentation.',
      'Landlord approves application and generates lease summary.',
    ],
    learningOutcomes: [
      'Building reactive SPAs with Vue.js 3 and Pinia.',
      'Developing RESTful APIs with Laravel and Eloquent ORM.',
      'Integrating interactive geospatial map components into web applications.',
    ],
    icon: FaBuilding,
    accentColor: '#0ea5e9',
  },

  // ==========================================
  // CATEGORY 7: FULL STACK DEVELOPMENT (31 - 35)
  // ==========================================
  {
    id: '31',
    slug: 'connecthub-social-networking-realtime-messaging',
    number: '31',
    title: 'ConnectHub – Social Networking and Real-Time Messaging Platform',
    category: 'Full Stack Development',
    difficulty: 'Advanced',
    technologies: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    shortDescription:
      'Modern social networking hub featuring live chat channels, multimedia feeds, and instant push notifications.',
    overview:
      'A full-stack social networking and communication platform featuring dynamic activity feeds, user friendship networks, media posts with comments and reactions, and real-time private and group chat powered by WebSockets.',
    problemStatement:
      'Users demand responsive social applications with zero-delay messaging, live typing indicators, and instant content updates without needing page refreshes.',
    objectives: [
      'Deliver bi-directional low-latency messaging using Socket.IO WebSockets.',
      'Build scalable social feeds with infinite scroll and media optimization.',
      'Implement real-time notification dispatchers for likes, comments, and mentions.',
    ],
    keyFeatures: [
      'Real-time private and group messaging with typing indicators and read receipts',
      'Interactive activity feed with infinite scrolling, image uploads, and reactions',
      'Friendship network management (Send Request, Accept, Block, Follow)',
      'Instant notifications badge updating via WebSocket event broadcasts',
      'User profile customizer with avatars, bio headers, and activity timelines',
    ],
    frontendArchitecture:
      'React application with Context API for live socket states, modular chat drawers, and virtualized feed rendering.',
    backendArchitecture:
      'Node.js and Express server with Socket.IO rooms architecture, JWT session authentication, and Multer file uploaders.',
    databaseInfo:
      'MongoDB database with collections for users, posts, comments, conversations, messages, and notifications.',
    expectedModules: [
      'User Authentication & Profile Service',
      'Social Post & Multimedia Feed Engine',
      'Socket.IO Real-Time Chat Server',
      'Notification Dispatch & Presence Tracker',
      'Friendship Graph & Relationship Manager',
    ],
    projectWorkflow: [
      'User logs in; client establishes authenticated WebSocket connection.',
      'User posts status update or image; followers feeds update reactively.',
      'User opens chat conversation; client joins dedicated Socket.IO room.',
      'Messages stream bidirectionally with delivery status and typing cues.',
      'System emits live notification toasts when users interact with posts.',
    ],
    learningOutcomes: [
      'Architecting real-time WebSocket communication with Socket.IO.',
      'Managing live connection rooms and socket disconnections gracefully.',
      'Building full-stack social network data models in MongoDB.',
    ],
    icon: FaComments,
    accentColor: '#34e0a1',
  },
  {
    id: '32',
    slug: 'workdesk-employee-hr-management-system',
    number: '32',
    title: 'WorkDesk – Employee and HR Management System',
    category: 'Full Stack Development',
    difficulty: 'Advanced',
    technologies: ['Angular', 'Java', 'Spring Boot', 'MySQL'],
    shortDescription:
      'Enterprise organizational HR portal managing attendance, payroll processing, and KPI appraisals.',
    overview:
      'An enterprise human resource management system (HRMS) built for corporate operations, integrating employee lifecycle tracking, leave management, automated payroll generation with tax calculations, and quarterly performance appraisals.',
    problemStatement:
      'Mid-sized enterprises suffer administrative friction and payroll errors when employee attendance, leave balances, and compensation formulas are managed across disconnected tools.',
    objectives: [
      'Centralize workforce records from employee onboarding to offboarding.',
      'Automate monthly payroll calculations with deductions, allowances, and taxes.',
      'Provide self-service employee portals for leave requests and pay slip access.',
    ],
    keyFeatures: [
      'Employee directory with departmental hierarchies and role designations',
      'Leave management system with automated balance accrual and manager approvals',
      'Payroll processing engine calculating gross, deductions, taxes, and net salaries',
      'Downloadable PDF payslips with organizational branding and tax breakdowns',
      'Performance evaluation module with objective KPI scorecards and reviews',
    ],
    frontendArchitecture:
      'Angular application with Angular Material data tables, custom validators, and role-based route guards (Admin, HR, Employee).',
    backendArchitecture:
      'Java Spring Boot with Spring Security, Spring Data JPA, automated scheduled cron jobs, and Flyway database migrations.',
    databaseInfo:
      'MySQL database with high-integrity relational tables for employees, departments, leave balances, payroll runs, and appraisals.',
    expectedModules: [
      'Employee Lifecycle & Master Directory',
      'Leave Request & Approval Workflow',
      'Payroll Calculation & Pay Slip Generator',
      'Performance Appraisal & KPI Tracker',
      'Organizational Hierarchy & Department Manager',
    ],
    projectWorkflow: [
      'HR onboards new employee with designation, salary bracket, and manager.',
      'Employee applies for leave through self-service portal; manager approves.',
      'At month end, payroll engine calculates workdays, deductions, and net payouts.',
      'System generates individual digital payslips accessible to employees.',
      'Quarterly performance review cycle is triggered with multi-point manager feedback.',
    ],
    learningOutcomes: [
      'Enterprise full-stack architecture with Java Spring Boot and Angular.',
      'Complex business logic implementation in transactional payroll calculations.',
      'Role-based security enforcement across multi-tiered corporate applications.',
    ],
    icon: FaUsersCog,
    accentColor: '#6366f1',
  },
  {
    id: '33',
    slug: 'parcelpro-courier-logistics-management-platform',
    number: '33',
    title: 'ParcelPro – Courier and Logistics Management Platform',
    category: 'Full Stack Development',
    difficulty: 'Intermediate',
    technologies: ['React', 'Python', 'Django REST Framework', 'PostgreSQL'],
    shortDescription:
      'End-to-end logistics platform providing consignment dispatch, courier routing, and live tracking.',
    overview:
      'A comprehensive courier and freight management platform that facilitates package booking, shipping label generation with barcodes, hub-to-hub dispatch tracking, courier driver assignment, and public consignment status lookup.',
    problemStatement:
      'Logistics companies lose tracking precision and customer trust when parcels move through regional sorting hubs without automated scan checkpoints and transparent tracking.',
    objectives: [
      'Generate unique consignment tracking IDs with barcode shipping labels.',
      'Track package milestones across regional hubs (Booked, Dispatched, In-Transit, Delivered).',
      'Provide public tracking portals with milestone progress timelines.',
    ],
    keyFeatures: [
      'Consignment booking with weight, dimensions, and express delivery calculation',
      'Automated printable shipping label generation with Code128 barcodes',
      'Hub checkpoint barcode scanner interface updating parcel location in real time',
      'Driver assignment module with delivery confirmation and signature capture',
      'Public parcel tracking widget with visual delivery status timeline',
    ],
    frontendArchitecture:
      'React application with responsive tracking timeline visualizers, shipping calculators, and administrative sorting hub portals.',
    backendArchitecture:
      'Django REST Framework backend with Celery background tasks for notification dispatches and tracking updates.',
    databaseInfo:
      'PostgreSQL database storing shipments, checkpoint scans, customer addresses, vehicle fleets, and billing invoices.',
    expectedModules: [
      'Consignment Booking & Rate Calculator',
      'Shipping Label & Barcode Generation Service',
      'Hub Scanning & Milestones Tracking Module',
      'Courier Driver Route Assignment',
      'Public Tracking Portal & SMS Notifications',
    ],
    projectWorkflow: [
      'Customer or agent books parcel shipment; system computes freight fee.',
      'Platform generates shipping label with barcode attached to package.',
      'Parcel is scanned at origin hub, dispatch vehicle, and destination facility.',
      'Each scan updates package checkpoint timestamp and geographic location.',
      'Recipient tracks shipment progress online and signs upon physical delivery.',
    ],
    learningOutcomes: [
      'Designing event-driven milestone tracking state machines.',
      'Generating dynamic barcodes and printable documents in Python.',
      'Building operational logistics dashboards with Django REST and React.',
    ],
    icon: FaShippingFast,
    accentColor: '#f59e0b',
  },
  {
    id: '34',
    slug: 'skillmarket-freelance-services-project-marketplace',
    number: '34',
    title: 'SkillMarket – Freelance Services and Project Marketplace',
    category: 'Full Stack Development',
    difficulty: 'Advanced',
    technologies: ['Next.js', 'Node.js', 'NestJS', 'PostgreSQL'],
    shortDescription:
      'Service gig marketplace connecting freelance talent with clients featuring project milestones and escrow billing.',
    overview:
      'A two-sided freelance talent marketplace where businesses post project requirements and hire skilled professionals, featuring proposal bidding, contract milestones, secure escrow-style billing holds, in-app messaging, and talent reviews.',
    problemStatement:
      'Clients and freelance developers face payment disputes and scope creep when project milestones and deliverables lack formal escrow-style verification checkpoints.',
    objectives: [
      'Enable client project postings and freelancer proposal bidding.',
      'Implement milestone-based contract agreements with funded payment deposits.',
      'Facilitate secure deliverable submissions, revisions, and milestone approvals.',
    ],
    keyFeatures: [
      'Two-sided user profiles: Client hiring portal and Freelancer service showcase',
      'Project bidding system with custom proposals, hourly/fixed rates, and milestones',
      'Milestone escrow management holding client funds until deliverable approval',
      'Direct client-freelancer messaging with attachment sharing',
      'Mutual rating and review system building verified marketplace reputations',
    ],
    frontendArchitecture:
      'Next.js application with TypeScript, featuring smooth contract management workflows, proposal builders, and dashboard views.',
    backendArchitecture:
      'NestJS enterprise TypeScript backend with modular microservices, Prisma ORM, and WebSocket chat gateways.',
    databaseInfo:
      'PostgreSQL database storing user portfolios, project bids, contracts, milestones, and financial transaction records.',
    expectedModules: [
      'User Authentication & Talent Profiles',
      'Job Posting & Proposal Bidding Service',
      'Contract & Milestone Escrow Engine',
      'Work Submission & Deliverable Review System',
      'Ratings, Reviews & Reputation Service',
    ],
    projectWorkflow: [
      'Client posts project specification with budget and required skills.',
      'Freelancers submit competitive proposals with milestone breakdowns.',
      'Client hires freelancer and funds first project milestone.',
      'Freelancer completes milestone task and submits deliverables for review.',
      'Client inspects work, approves milestone release, and funds next phase.',
    ],
    learningOutcomes: [
      'Building scalable TypeScript enterprise backends with NestJS and Prisma.',
      'Developing complex financial escrow workflows and contract states.',
      'Mastering full-stack TypeScript architecture across Next.js and NestJS.',
    ],
    icon: FaAward,
    accentColor: '#10b981',
  },
  {
    id: '35',
    slug: 'stockmaster-inventory-warehouse-management-system',
    number: '35',
    title: 'StockMaster – Inventory and Warehouse Management System',
    category: 'Full Stack Development',
    difficulty: 'Advanced',
    technologies: ['React', 'C#', 'ASP.NET Core', 'SQL Server'],
    shortDescription:
      'Enterprise warehouse management system tracking stock levels, bin locations, and supply chain reorders.',
    overview:
      'A comprehensive warehouse and inventory operations platform built with React and ASP.NET Core that tracks item quantities across multiple physical facilities, manages bin/aisle locations, oversees purchase orders, and logs stock transfers.',
    problemStatement:
      'Warehouses experience inventory shrinkage, stock picking delays, and inaccurate stock counts when relying on legacy terminal screens or disconnected paper picking slips.',
    objectives: [
      'Maintain real-time multi-warehouse inventory quantities with audit logs.',
      'Guide warehouse pickers to exact aisle, shelf, and bin locations.',
      'Automate supplier purchase order generation when stock falls below reorder points.',
    ],
    keyFeatures: [
      'Multi-warehouse stock tracking with aisle, rack, shelf, and bin spatial coordinates',
      'Barcode and SKU scanning for rapid goods receipt and order picking',
      'Automated low-stock threshold triggers and supplier purchase order drafting',
      'Inter-facility stock transfer management with in-transit verification',
      'Comprehensive inventory valuation reports (FIFO / LIFO / Average Costing)',
    ],
    frontendArchitecture:
      'React application with fast keyboard shortcuts, responsive barcode scanning views, and data-dense inventory tables.',
    backendArchitecture:
      'C# and ASP.NET Core Web API with Entity Framework Core, LINQ queries, and high-performance transactional safety.',
    databaseInfo:
      'Microsoft SQL Server with normalized tables, foreign keys, stored procedures, and audit triggers for inventory balance integrity.',
    expectedModules: [
      'Inventory Catalog & SKU Master Data',
      'Warehouse Spatial Bin & Location Mapping',
      'Goods Inward (Receiving) & Quality Check',
      'Picking, Packing & Dispatch Operations',
      'Purchase Order & Supplier Reorder Automation',
    ],
    projectWorkflow: [
      'Shipment arrives at warehouse dock; staff scans goods into receiving bin.',
      'System assigns optimal storage rack and bin location based on item volume.',
      'Sales orders trigger automated pick-lists directing staff to item coordinates.',
      'Stock levels decrease in real time across the central SQL Server database.',
      'If quantity drops below reorder point, automated purchase order is sent to vendor.',
    ],
    learningOutcomes: [
      'Building high-performance enterprise APIs with C# and ASP.NET Core.',
      'Relational database design and transaction isolation in SQL Server.',
      'Designing high-efficiency operational logistics interfaces in React.',
    ],
    icon: FaWarehouse,
    accentColor: '#0ea5e9',
  },
]
