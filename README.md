# 🧭 Career Compass — AI-Powered Career Platform

 MERN Stack + Groq API + Mongoose

A full-stack AI-powered web application that analyzes resumes, identifies skill gaps, recommends jobs, provides curated learning paths, and tracks your career growth.

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | JWT-based Register/Login with email |
| 📄 Resume Analyzer | Upload PDF/DOCX/TXT → Groq AI parses and scores (ATS 0–100) |
| 🎯 Skill Gap Analysis | Critical/Important gaps with real learning resources |
| 💼 Job Recommendations | AI-matched jobs with direct LinkedIn apply links |
| 📚 Learning Paths | Curated courses, videos, articles from top platforms |
| 📈 Progress Tracker | Visual charts, completion tracking, XP points |
| 🏆 Gamification | Points & badges for completing skills and uploading resumes |
| 👤 Profile Settings | Edit role, experience, LinkedIn/GitHub links |

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | [https://careercompasswithai.vercel.app](https://careercompasswithai.vercel.app) |
| ⚙️ Backend API (Render) | [https://career-compass-h.onrender.com](https://career-compass-h.onrender.com) |
| ✅ Health Check | [https://career-compass-h.onrender.com/api/health](https://career-compass-h.onrender.com/api/health) |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Recharts, React Toastify, Font Awesome  
**Backend:** Node.js, Express.js, Mongoose (MongoDB)  
**Database:** MongoDB Atlas  
**AI Engine:** Groq API (llama-3.3-70b-versatile)  
**Auth:** JWT + bcryptjs  
**File Parsing:** pdf-parse, mammoth (DOCX)  
**Hosting:** Vercel (Frontend) + Render (Backend)

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
        │   └── AuthContext.js       # Global auth state + axios base URL
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
- MongoDB Atlas account (or local MongoDB)
- Groq API Key ([get one here](https://console.groq.com/))

---

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/prashantsinghsola/career-compass.git
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
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_change_this
GROQ_API_KEY=your-groq-api-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
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

## 🚢 Deployment

### Frontend — Vercel
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable in **Vercel → Settings → Environment Variables**:
   ```
   REACT_APP_API_URL = https://career-compass-h.onrender.com
   ```
4. Save & **Redeploy** → Live at: **https://careercompasswithai.vercel.app**

### Backend — Render
1. Push to GitHub
2. Create a Web Service on [render.com](https://render.com)
3. Add environment variables in **Render → Environment**:
   ```
   MONGO_URI       = your-mongodb-atlas-uri
   JWT_SECRET      = your-secret-key
   GROQ_API_KEY    = your-groq-api-key
   NODE_ENV        = production
   FRONTEND_URL    = https://careercompasswithai.vercel.app
   ```
4. Deploy → Live at: **https://career-compass-h.onrender.com**

---

## 🔌 API Endpoints

**Base URL (Production):** `https://career-compass-h.onrender.com`

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

## 👥 Team

| Name | LinkedIn |
|------|----------|
| Prashant Singh | [linkedin.com/in/prashant-singh-78ps](https://www.linkedin.com/in/prashant-singh-78ps/) |
| Sagar Bharti | [linkedin.com/in/sagarbharti](https://www.linkedin.com/in/sagarbharti) |
| Chhavi Kumar | [linkedin.com/in/chhavi-kumar-988395338](https://www.linkedin.com/in/chhavi-kumar-988395338) |
| Vinay Mavi | [linkedin.com/in/vinay-kumar-4b4b15319](https://www.linkedin.com/in/vinay-kumar-4b4b15319/) |

© 2026 Career Compass · IIMT Final Year B.Tech CSE Project
