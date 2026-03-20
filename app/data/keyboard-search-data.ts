// ─────────────────────────────────────────────────────────────────────────────
// keyboard-search-data.ts
// All project data for the KeyboardSearchSection.
// Three keyword layers per project make search work for both tech-savvy
// students ("react", "mongodb") and non-tech students ("login page", "college")
// ─────────────────────────────────────────────────────────────────────────────

export interface TechItem {
  name: string
  icon: string   // lucide-react icon name — rendered dynamically in card
  color: string  // text color class
  bgColor: string // background color class
}

export interface ProjectData {
  id: string
  title: string
  category: string
  description: string
  techStack: TechItem[]
  price: string
  deliveryDays: string
  complexity: "basic" | "frontend" | "fullstack" | "complete"
  features: string[]
  accentColor: string
  // ── Search keyword layers ───────────────────────────────────────────────
  techKeywords: string[]      // actual tech names: "react", "node", "mongodb"
  featureKeywords: string[]   // feature names: "login", "dashboard", "payment"
  intentKeywords: string[]    // plain English: "college project", "shopping site"
}

// ── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS: ProjectData[] = [
  // ── BASIC ──────────────────────────────────────────────────────────────────
  {
    id: "portfolio-site",
    title: "Portfolio Website",
    category: "Static Site",
    description:
      "Clean, responsive personal portfolio with hero, projects, skills, contact sections. Perfect for showcasing your work to professors and recruiters.",
    techStack: [
      { name: "HTML/CSS", icon: "Globe",   color: "text-orange-700", bgColor: "bg-orange-50" },
      { name: "Tailwind",  icon: "Layout",  color: "text-sky-700",    bgColor: "bg-sky-50"    },
      { name: "JavaScript",icon: "Code2",   color: "text-yellow-700", bgColor: "bg-yellow-50" },
    ],
    price: "₹599",
    deliveryDays: "2",
    complexity: "basic",
    features: ["Responsive design", "Contact form", "Project showcase", "Smooth scroll"],
    accentColor: "#10B981",
    techKeywords: ["html", "css", "javascript", "tailwind", "bootstrap", "static"],
    featureKeywords: ["portfolio", "about", "contact", "projects", "skills", "resume"],
    intentKeywords: ["portfolio", "personal site", "show work", "resume site", "simple website", "profile", "developer portfolio"],
  },
  {
    id: "landing-page",
    title: "Responsive Landing Page",
    category: "Static Site",
    description:
      "High-converting landing page with hero section, features grid, testimonials, pricing table, and CTA. Ideal for startups or college events.",
    techStack: [
      { name: "HTML/CSS", icon: "Globe",   color: "text-orange-700", bgColor: "bg-orange-50" },
      { name: "Tailwind",  icon: "Layout",  color: "text-sky-700",    bgColor: "bg-sky-50"    },
      { name: "JavaScript",icon: "Code2",   color: "text-yellow-700", bgColor: "bg-yellow-50" },
    ],
    price: "₹499",
    deliveryDays: "2",
    complexity: "basic",
    features: ["Hero + CTA", "Pricing table", "Testimonials", "Mobile responsive"],
    accentColor: "#10B981",
    techKeywords: ["html", "css", "javascript", "tailwind", "responsive"],
    featureKeywords: ["landing page", "hero", "cta", "pricing", "testimonials", "features"],
    intentKeywords: ["landing page", "business site", "product page", "startup page", "event page", "company website", "simple site"],
  },
  {
    id: "college-department-site",
    title: "College Department Website",
    category: "Static Site",
    description:
      "Multi-page college department site with faculty listing, course catalog, notice board, gallery, and contact. Great for college projects.",
    techStack: [
      { name: "HTML/CSS",  icon: "Globe",    color: "text-orange-700", bgColor: "bg-orange-50"  },
      { name: "Bootstrap", icon: "Layout",   color: "text-purple-700", bgColor: "bg-purple-50"  },
      { name: "JavaScript",icon: "Code2",    color: "text-yellow-700", bgColor: "bg-yellow-50"  },
    ],
    price: "₹799",
    deliveryDays: "3",
    complexity: "basic",
    features: ["Faculty listing", "Course catalog", "Notice board", "Gallery", "Multi-page"],
    accentColor: "#10B981",
    techKeywords: ["html", "css", "bootstrap", "javascript", "static", "multi-page"],
    featureKeywords: ["faculty", "courses", "notices", "gallery", "department"],
    intentKeywords: ["college website", "department site", "university", "school website", "academic", "college project", "mini project"],
  },

  // ── FRONTEND ───────────────────────────────────────────────────────────────
  {
    id: "todo-app",
    title: "Todo / Task Manager App",
    category: "React App",
    description:
      "Feature-rich task manager with CRUD operations, priority tags, due dates, and filters. Uses localStorage for persistence — no backend needed.",
    techStack: [
      { name: "React",      icon: "Code2",    color: "text-cyan-700",   bgColor: "bg-cyan-50"   },
      { name: "JavaScript", icon: "Code2",    color: "text-yellow-700", bgColor: "bg-yellow-50" },
      { name: "CSS",        icon: "Layout",   color: "text-pink-700",   bgColor: "bg-pink-50"   },
    ],
    price: "₹899",
    deliveryDays: "3",
    complexity: "frontend",
    features: ["Add / Edit / Delete", "Priority tags", "Due dates", "Filter by status", "LocalStorage"],
    accentColor: "#3B82F6",
    techKeywords: ["react", "javascript", "css", "localstorage", "hooks", "state"],
    featureKeywords: ["todo", "tasks", "add delete", "filter", "priority", "crud", "list"],
    intentKeywords: ["todo app", "task manager", "task list", "notes", "simple react app", "react project", "mini project", "college project"],
  },
  {
    id: "weather-app",
    title: "Weather Forecast App",
    category: "React + API",
    description:
      "Real-time weather app using OpenWeatherMap API. Search any city, get current weather, 5-day forecast, humidity, wind speed, and UV index.",
    techStack: [
      { name: "React",   icon: "Code2",  color: "text-cyan-700",  bgColor: "bg-cyan-50"  },
      { name: "Axios",   icon: "Server", color: "text-blue-700",  bgColor: "bg-blue-50"  },
      { name: "API",     icon: "Globe",  color: "text-green-700", bgColor: "bg-green-50" },
    ],
    price: "₹1099",
    deliveryDays: "3",
    complexity: "frontend",
    features: ["Live weather data", "5-day forecast", "City search", "Humidity & wind", "Responsive UI"],
    accentColor: "#3B82F6",
    techKeywords: ["react", "api", "axios", "openweather", "rest api", "javascript"],
    featureKeywords: ["weather", "forecast", "search city", "temperature", "real-time", "api"],
    intentKeywords: ["weather app", "api app", "forecast", "react project", "temperature app", "live data app", "mini project"],
  },
  {
    id: "quiz-app",
    title: "Interactive Quiz App",
    category: "React App",
    description:
      "Timed quiz app with multiple categories, MCQ format, score tracking, leaderboard, and results summary. Perfect for college exam prep tools.",
    techStack: [
      { name: "React",      icon: "Code2",  color: "text-cyan-700",   bgColor: "bg-cyan-50"   },
      { name: "JavaScript", icon: "Code2",  color: "text-yellow-700", bgColor: "bg-yellow-50" },
      { name: "Context API",icon: "Server", color: "text-purple-700", bgColor: "bg-purple-50" },
    ],
    price: "₹1299",
    deliveryDays: "4",
    complexity: "frontend",
    features: ["MCQ format", "Countdown timer", "Score tracking", "Result summary", "Multiple categories"],
    accentColor: "#3B82F6",
    techKeywords: ["react", "javascript", "context api", "state management", "hooks"],
    featureKeywords: ["quiz", "mcq", "timer", "score", "questions", "results", "categories"],
    intentKeywords: ["quiz app", "exam app", "test app", "mcq questions", "study tool", "college project", "react project"],
  },
  {
    id: "notes-app",
    title: "Notes App",
    category: "React App",
    description:
      "Rich-text notes app with create/edit/delete, colour tags, search, and pin-to-top. All notes saved in localStorage — offline-ready.",
    techStack: [
      { name: "React",      icon: "Code2",  color: "text-cyan-700",   bgColor: "bg-cyan-50"   },
      { name: "LocalStorage",icon: "Database",color: "text-amber-700", bgColor: "bg-amber-50" },
      { name: "CSS",        icon: "Layout", color: "text-pink-700",   bgColor: "bg-pink-50"   },
    ],
    price: "₹999",
    deliveryDays: "3",
    complexity: "frontend",
    features: ["Create / Edit / Delete notes", "Color tags", "Search notes", "Pin important notes", "Offline-ready"],
    accentColor: "#3B82F6",
    techKeywords: ["react", "localstorage", "javascript", "css", "hooks"],
    featureKeywords: ["notes", "create edit delete", "search", "tags", "pin", "save"],
    intentKeywords: ["notes app", "notepad", "diary", "memo app", "write notes", "save notes", "simple app"],
  },

  // ── FULLSTACK ──────────────────────────────────────────────────────────────
  {
    id: "student-management",
    title: "Student Management System",
    category: "Full Stack MERN",
    description:
      "Complete student management portal for colleges — add/edit students, manage marks, attendance, timetable, and generate reports. Admin + teacher login.",
    techStack: [
      { name: "React",    icon: "Code2",    color: "text-cyan-700",    bgColor: "bg-cyan-50"    },
      { name: "Node.js",  icon: "Server",   color: "text-green-700",   bgColor: "bg-green-50"   },
      { name: "MongoDB",  icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { name: "Express",  icon: "Server",   color: "text-gray-700",    bgColor: "bg-gray-50"    },
    ],
    price: "₹2499",
    deliveryDays: "6",
    complexity: "fullstack",
    features: ["Admin + teacher login", "Student CRUD", "Marks & grades", "Attendance tracking", "PDF reports"],
    accentColor: "#8B5CF6",
    techKeywords: ["react", "node", "nodejs", "mongodb", "express", "mern", "jwt", "rest api"],
    featureKeywords: ["login", "dashboard", "crud", "students", "marks", "grades", "attendance", "admin panel", "reports"],
    intentKeywords: ["student management", "college system", "marks system", "teacher portal", "admin panel", "student data", "college project", "major project"],
  },
  {
    id: "attendance-system",
    title: "Attendance Management System",
    category: "Full Stack MERN",
    description:
      "Digital attendance system for teachers to mark, view, and export attendance. Students can check their own attendance percentage and history.",
    techStack: [
      { name: "React",   icon: "Code2",    color: "text-cyan-700",    bgColor: "bg-cyan-50"    },
      { name: "Node.js", icon: "Server",   color: "text-green-700",   bgColor: "bg-green-50"   },
      { name: "MongoDB", icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
    ],
    price: "₹1999",
    deliveryDays: "5",
    complexity: "fullstack",
    features: ["Mark attendance", "Attendance %", "Teacher & student login", "Export reports", "Monthly view"],
    accentColor: "#8B5CF6",
    techKeywords: ["react", "node", "mongodb", "express", "mern", "jwt"],
    featureKeywords: ["attendance", "mark present absent", "login", "dashboard", "reports", "percentage"],
    intentKeywords: ["attendance system", "attendance app", "present absent", "teacher app", "classroom management", "daily attendance", "college project", "mini project"],
  },
  {
    id: "blog-platform",
    title: "Blog Platform",
    category: "Full Stack Next.js",
    description:
      "Full-featured blog platform with rich text editor, categories, tags, comments, and user authentication. Admin dashboard for managing posts.",
    techStack: [
      { name: "Next.js",  icon: "Globe",    color: "text-gray-700",    bgColor: "bg-gray-50"    },
      { name: "MongoDB",  icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { name: "Tailwind", icon: "Layout",   color: "text-sky-700",     bgColor: "bg-sky-50"     },
    ],
    price: "₹2999",
    deliveryDays: "7",
    complexity: "fullstack",
    features: ["Rich text editor", "Categories & tags", "Comments", "Auth (login/register)", "Admin dashboard"],
    accentColor: "#8B5CF6",
    techKeywords: ["nextjs", "next.js", "mongodb", "react", "tailwind", "auth", "api routes"],
    featureKeywords: ["blog", "create post", "edit post", "comments", "categories", "tags", "login", "admin"],
    intentKeywords: ["blog platform", "blog site", "articles", "write blog", "publish posts", "content management", "cms", "full stack project"],
  },

  // ── COMPLETE ───────────────────────────────────────────────────────────────
  {
    id: "ecommerce-auth",
    title: "E-Commerce with Auth & Payments",
    category: "Complete Web App",
    description:
      "Production-ready online store with product listings, cart, wishlist, Razorpay/Stripe payments, order tracking, and full admin panel.",
    techStack: [
      { name: "React",    icon: "Code2",    color: "text-cyan-700",    bgColor: "bg-cyan-50"    },
      { name: "Node.js",  icon: "Server",   color: "text-green-700",   bgColor: "bg-green-50"   },
      { name: "MongoDB",  icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { name: "Stripe",   icon: "Zap",      color: "text-purple-700",  bgColor: "bg-purple-50"  },
    ],
    price: "₹4999",
    deliveryDays: "12",
    complexity: "complete",
    features: ["Product catalog", "Cart & wishlist", "Razorpay/Stripe", "Order tracking", "Admin panel", "Login / Register"],
    accentColor: "#F97316",
    techKeywords: ["react", "node", "mongodb", "stripe", "razorpay", "mern", "jwt", "express", "payment gateway"],
    featureKeywords: ["shopping cart", "payment", "login", "register", "orders", "admin", "wishlist", "products", "checkout"],
    intentKeywords: ["shopping site", "e-commerce", "online store", "buy sell", "payment", "cart", "shop", "ecommerce", "amazon clone", "complete project"],
  },
  {
    id: "hospital-management",
    title: "Hospital Management System",
    category: "Complete Web App",
    description:
      "Comprehensive hospital system covering patient registration, doctor scheduling, appointment booking, billing, and medical records management.",
    techStack: [
      { name: "React",   icon: "Code2",    color: "text-cyan-700",    bgColor: "bg-cyan-50"    },
      { name: "Node.js", icon: "Server",   color: "text-green-700",   bgColor: "bg-green-50"   },
      { name: "MongoDB", icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { name: "Express", icon: "Server",   color: "text-gray-700",    bgColor: "bg-gray-50"    },
    ],
    price: "₹4499",
    deliveryDays: "10",
    complexity: "complete",
    features: ["Patient registration", "Doctor scheduling", "Appointment booking", "Billing system", "Medical records", "Reports"],
    accentColor: "#F97316",
    techKeywords: ["react", "node", "mongodb", "express", "mern", "jwt", "rest api"],
    featureKeywords: ["patients", "doctors", "appointments", "billing", "medical records", "dashboard", "login", "reports"],
    intentKeywords: ["hospital system", "clinic management", "doctor app", "patient management", "medical system", "healthcare", "appointment system", "major project"],
  },
  {
    id: "job-portal",
    title: "Job Portal",
    category: "Complete Web App",
    description:
      "Full job portal with employer and candidate roles. Employers post jobs, candidates apply with resume upload, application tracking, and smart job matching.",
    techStack: [
      { name: "Next.js",  icon: "Globe",    color: "text-gray-700",    bgColor: "bg-gray-50"    },
      { name: "MongoDB",  icon: "Database", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { name: "Node.js",  icon: "Server",   color: "text-green-700",   bgColor: "bg-green-50"   },
      { name: "Auth.js",  icon: "Lock",     color: "text-red-700",     bgColor: "bg-red-50"     },
    ],
    price: "₹3999",
    deliveryDays: "10",
    complexity: "complete",
    features: ["Job listings", "Apply with resume", "Employer dashboard", "Application tracking", "Job search & filters", "Auth (2 roles)"],
    accentColor: "#F97316",
    techKeywords: ["nextjs", "next.js", "mongodb", "node", "auth", "jwt", "rest api", "react"],
    featureKeywords: ["jobs", "apply", "resume upload", "employer", "candidate", "dashboard", "login", "filter", "search"],
    intentKeywords: ["job portal", "job board", "recruitment", "career site", "hiring app", "apply jobs", "job search", "linkedin clone", "major project", "final year project"],
  },
]

// ── Suggestion pills for mobile ───────────────────────────────────────────────
export const SUGGESTION_PILLS: { label: string; query: string }[] = [
  { label: "🎓 College Project", query: "college project"   },
  { label: "🔐 Login System",    query: "login"             },
  { label: "⚛️ React App",       query: "react"             },
  { label: "📊 Dashboard",       query: "dashboard"         },
  { label: "🌐 Portfolio",       query: "portfolio"         },
  { label: "🛒 Shopping Site",   query: "shopping"          },
  { label: "📋 Attendance",      query: "attendance"        },
  { label: "💻 Full Stack",      query: "fullstack"         },
  { label: "💰 Under ₹1000",     query: "under 1000"        },
  { label: "⚡ Quick Delivery",  query: "2 days"            },
]

// ── Complexity config ─────────────────────────────────────────────────────────
export const COMPLEXITY_CONFIG: Record<
  ProjectData["complexity"],
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  basic: {
    label:       "Basic",
    color:       "text-emerald-700",
    bgColor:     "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  frontend: {
    label:       "Frontend",
    color:       "text-blue-700",
    bgColor:     "bg-blue-50",
    borderColor: "border-blue-200",
  },
  fullstack: {
    label:       "Full Stack",
    color:       "text-purple-700",
    bgColor:     "bg-purple-50",
    borderColor: "border-purple-200",
  },
  complete: {
    label:       "Complete App",
    color:       "text-orange-700",
    bgColor:     "bg-orange-50",
    borderColor: "border-orange-200",
  },
}

// ── Typewriter hints shown in monitor when no query ───────────────────────────
export const TYPEWRITER_HINTS = [
  "try: login system",
  "try: react app",
  "try: portfolio",
  "try: college project",
  "try: shopping site",
  "try: attendance",
  "try: full stack",
  "try: dashboard",
]
