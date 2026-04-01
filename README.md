# 🧭 Career Compass — AI-Powered Career Platform

> **Final Year B.Tech CSE Project** | MERN Stack +groq api + Mongoose

A full-stack AI-powered web application that analyzes resumes, identifies skill gaps, recommends jobs, provides curated learning paths, and tracks your career growth.

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | JWT-based Register/Login with email |
| 📄 Resume Analyzer | Upload PDF/DOCX/TXT → grocq parses and scores (ATS 0–100) |
| 🎯 Skill Gap Analysis | Critical/Important gaps with real learning resources |
| 💼 Job Recommendations | AI-matched jobs with direct LinkedIn apply links |
| 📚 Learning Paths | Curated courses, videos, articles from top platforms |
| 📈 Progress Tracker | Visual charts, completion tracking, XP points |
| 🏆 Gamification | Points & badges for completing skills and uploading resumes |
| 👤 Profile Settings | Edit role, experience, LinkedIn/GitHub links |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Recharts, React Toastify, Lucide React  
**Backend:** Node.js, Express.js, Mongoose (MongoDB)  
**Database:** MongoDB via Mongoose ODM  
**AI Engine:** Anthropic Claude API (`claude-sonnet-4-20250514`)  
**Auth:** JWT + bcryptjs  
**File Parsing:** pdf-parse, mammoth (DOCX)

---

## 📁 Project Structure

```
career-compass/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Resume.js          # Resume + AI analysis schema
│   │   └── Progress.js        # Skill progress tracking schema
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Profile
│   │   ├── resume.js          # Upload, Analyze, History
│   │   └── progress.js        # Skill tracking CRUD
│   ├── server.js              # Express app entry
│   └── .env.example           # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js       # Global auth state
        ├── pages/
        │   ├── HomePage.jsx         # Landing page
        │   ├── LoginPage.jsx        # Login
        │   ├── RegisterPage.jsx     # Register
        │   └── DashboardPage.jsx    # Dashboard layout + routing
        ├── components/dashboard/
        │   ├── Overview.jsx         # Dashboard home
        │   ├── ResumeUpload.jsx     # Resume upload + results
        │   ├── SkillGapAnalysis.jsx # Skill gaps + resources
        │   ├── JobRecommendations.jsx # Job cards + LinkedIn links
        │   ├── LearningPaths.jsx    # Learning resources + tracking
        │   ├── ProgressTracker.jsx  # Charts + progress list
        │   └── ProfileSettings.jsx  # Profile editor
        ├── App.js
        ├── App.css
        └── index.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Anthropic API Key ([get one here](https://console.anthropic.com/))

---

### 1. Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd career-compass

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment

```bash
# In the backend/ directory
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/career_compass
JWT_SECRET=your_super_secret_key_change_this
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

### 3. Run the App

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload & analyze resume |
| GET | `/api/resume/latest` | Get latest resume analysis |
| GET | `/api/resume/history` | Get all past uploads |
| GET | `/api/resume/:id` | Get specific resume |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get all tracked skills |
| POST | `/api/progress` | Start tracking a skill |
| PUT | `/api/progress/:id` | Update skill progress |
| GET | `/api/progress/stats/summary` | Get stats summary |

---

## 🗄️ Mongoose Models

### User
- name, email, password (hashed), currentRole, targetRole, experience
- skills[], linkedinUrl, githubUrl, points, badges[]

### Resume
- user (ref), fileName, rawText
- parsedData: { name, email, phone, education[], experience[], skills[], projects[] }
- analysis: { atsScore, skillGaps[], jobRecommendations[], learningPaths[], strengths[], weaknesses[] }
- status: pending | processing | completed | failed

### Progress
- user (ref), skill, status, completionPercentage, resourcesAccessed[], targetDate

---

## 🎮 Gamification

| Action | Points |
|--------|--------|
| Upload & analyze resume | +50 XP |
| Complete a skill | +100 XP |
| Track a new skill | +10 XP |

---

## 📸 Pages Overview

1. **Home Page** — Landing with hero, features, stats, CTA
2. **Login / Register** — Minimal auth forms with validation
3. **Dashboard Overview** — ATS score, quick stats, top gaps, job snippets
4. **Resume Analyzer** — Drag-drop upload, AI analysis results, parsed info
5. **Skill Gap Analysis** — Color-coded gaps with resource links
6. **Job Recommendations** — Filterable job cards with LinkedIn apply buttons
7. **Learning Paths** — Structured resources with progress tracking
8. **Progress Tracker** — Recharts bar + pie charts, XP display
9. **Profile Settings** — Editable profile, badges display

---

## 👨‍💻 Team Members
- Vinay Kumar — 2201270100116
- Chhavi Kumar — 2101270100033
- Prashant Singh — 2201270100078
- Sagar Bharti — 2201270100092

---

## 📄 License
MIT — For educational/academic purposes.
