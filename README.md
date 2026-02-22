<p align="center">
  <img src="https://img.shields.io/badge/PathNexusAI-AI%20Career%20Guide-gold?style=for-the-badge&logo=graduation-cap" alt="PathNexusAI" />
</p>

<h1 align="center">🎓 PathNexusAI</h1>

<p align="center">
  <strong>AI-Powered Career Guidance & Student Development Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Ollama-LLM-black?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 📖 Overview

**PathNexusAI** is a comprehensive AI-driven platform designed to empower students in their career journey. It combines **machine learning**, **real-time communication**, and **interactive tools** to provide career guidance, mental health support, skill assessments, exam preparation roadmaps, and mentor connections — all in one place.

> _Built with a sleek white, black, and gold professional theme._

---

## ✨ Features

### 🤖 AI-Powered Intelligence

| Feature                   | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Career Simulator**      | Monte Carlo simulations to predict career outcomes with salary, growth & risk analysis |
| **AI Chatbot**            | Local LLM-powered assistant using Ollama (llama3.1:8b) for personalized guidance       |
| **Career Guidance**       | AI-driven career path recommendations based on student profiles                        |
| **Skill Recommendations** | Personalized skill development suggestions powered by ML                               |
| **AI Skills Assessment**  | Prompt engineering tests with real-time scoring and badge certifications               |

### 📊 Career & Academic Tools

| Feature                      | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| **Resume ATS Analyzer**      | AI-powered resume scoring with ATS compatibility feedback     |
| **Resume Builder**           | Interactive resume creation tool                              |
| **Exam Preparation**         | Structured roadmaps for **JEE**, **NEET**, and **GATE** exams |
| **Career Roadmap Navigator** | Curated learning paths integrated with roadmap.sh             |
| **Quiz & Certifications**    | Interactive assessments with certification tracking           |

### 💬 Communication & Collaboration

| Feature                        | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| **Student Chatroom**           | Real-time group chat with WebRTC video conferencing |
| **Mentor Chat**                | 1-on-1 messaging with college and industry mentors  |
| **Video Calls**                | Multi-user video conferencing powered by WebRTC     |
| **College & Industry Mentors** | Browse, connect, and get feedback from mentors      |

### 💚 Wellness & Development

| Feature                | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| **Wellness Dashboard** | Predictive burnout tracking with automated wellness interventions |
| **Task Management**    | Assigned tasks from college mentors with progress tracking        |
| **Profile Management** | Student profiles with face registration for attendance            |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  React 18 • Vite • Tailwind CSS • Framer Motion         │
│  Recharts • Socket.io-client • Axios                    │
├─────────────────────────────────────────────────────────┤
│                   BACKEND (Node.js)                      │
│  Express.js • MongoDB/Mongoose • Socket.io              │
│  RESTful API • Real-time WebSocket Events               │
├─────────────────────────────────────────────────────────┤
│                ML SERVICE (Python/FastAPI)                │
│  FastAPI • Ollama (LLM) • NumPy • SciPy                 │
│  Monte Carlo Simulations • NLP Processing               │
├─────────────────────────────────────────────────────────┤
│                     DATABASE                             │
│  MongoDB (Mongoose ODM)                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software    | Version | Download                                                                                                                  |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Node.js** | v18+    | [nodejs.org](https://nodejs.org/)                                                                                         |
| **Python**  | v3.11+  | [python.org](https://www.python.org/downloads/)                                                                           |
| **MongoDB** | v6.0+   | [mongodb.com](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| **Ollama**  | Latest  | [ollama.ai](https://ollama.ai/download)                                                                                   |

### Install the Ollama LLM Model

```bash
# Pull the required model
ollama pull llama3.1:8b

# Verify installation
ollama list
# You should see llama3.1:8b in the output
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/PathNexusAI.git
cd PathNexusAI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
echo "MONGO_URI=mongodb://localhost:27017/pathnexusai" > .env
echo "PORT=5000" >> .env

# Start the backend server
npm start
```

> ✅ Backend runs on **http://localhost:5000**

### 3. ML Service Setup

```bash
cd ml

# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\Activate.ps1

# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the ML server
uvicorn main:app --reload --port 8000
```

> ✅ ML Server runs on **http://localhost:8000**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

> ✅ Frontend runs on **http://localhost:5173**

---

## ▶️ Running the Application

You need **3 terminal windows** running simultaneously:

```
┌──────────────────┬────────────────────────────────────────────┬──────────────────────┐
│    Terminal       │    Command                                 │    URL                │
├──────────────────┼────────────────────────────────────────────┼──────────────────────┤
│ 1. Backend       │ cd backend && npm start                    │ localhost:5000        │
│ 2. ML Service    │ cd ml && uvicorn main:app --reload --port 8000 │ localhost:8000   │
│ 3. Frontend      │ cd frontend && npm run dev                 │ localhost:5173        │
└──────────────────┴────────────────────────────────────────────┴──────────────────────┘
```

> **Note:** Make sure **MongoDB** and **Ollama** are running before starting the servers.

### Quick Start (All-in-one)

```bash
# Terminal 1 — Backend
cd backend && npm start

# Terminal 2 — ML Service (activate venv first)
cd ml && .\venv\Scripts\Activate.ps1 && uvicorn main:app --reload --port 8000

# Terminal 3 — Frontend
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
PathNexusAI/
│
├── frontend/                       # React Frontend (Vite)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   ├── Sidebar.jsx         # Side navigation
│   │   │   └── Footer.jsx          # Page footer
│   │   ├── pages/
│   │   │   ├── student/            # Student pages
│   │   │   │   ├── CareerSimulator.jsx
│   │   │   │   ├── CareerGuidance.jsx
│   │   │   │   ├── ExamPreparation.jsx   # JEE/NEET/GATE roadmaps
│   │   │   │   ├── RoadmapNavigator.jsx
│   │   │   │   ├── WellnessDashboard.jsx
│   │   │   │   ├── AISkillsAssessment.jsx
│   │   │   │   ├── Chat.jsx
│   │   │   │   ├── StudentChatroom.jsx
│   │   │   │   ├── Chatbot.jsx
│   │   │   │   ├── RecommendSkills.jsx
│   │   │   │   ├── ResumeScore.jsx
│   │   │   │   ├── Quiz.jsx
│   │   │   │   ├── Certification.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Tasks.jsx
│   │   │   │   ├── AllCollegeMentors.jsx
│   │   │   │   └── AllIndustryMentors.jsx
│   │   │   ├── ats/                # ATS module
│   │   │   │   ├── ResumeAnalyzer.jsx
│   │   │   │   └── ResumeBuilder.jsx
│   │   │   ├── college/            # College mentor pages
│   │   │   ├── industry/           # Industry mentor pages
│   │   │   ├── psycho/             # Psychologist pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── App.css                 # Global styles
│   │   └── index.css               # Theme variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                        # Node.js Backend (Express)
│   ├── models/                     # Mongoose schemas
│   ├── controllers/                # Route handlers
│   ├── routes/                     # API route definitions
│   ├── config/                     # Database & app config
│   ├── utils/                      # Utility functions
│   └── server.js                   # Express server entry point
│
├── ml/                             # Python ML Service (FastAPI)
│   ├── main.py                     # FastAPI server & endpoints
│   ├── career_simulator.py         # Monte Carlo career simulations
│   ├── burnout_detector.py         # Wellness & burnout analytics
│   ├── prompt_evaluator.py         # AI skills scoring
│   ├── resume_analyzer_engine.py   # ATS resume analysis
│   └── requirements.txt           # Python dependencies
│
├── .gitignore
└── README.md
```

---

## 🔧 Environment Configuration

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/pathnexusai
PORT=5000
```

### ML Service (`ml/.env`) _(optional)_

```env
GEMINI_API_KEY=your_gemini_api_key_here    # If using Gemini for resume analysis
OLLAMA_HOST=http://localhost:11434          # Ollama API URL
```

### Ollama Configuration

| Parameter   | Value                    |
| ----------- | ------------------------ |
| Model       | `llama3.1:8b`            |
| API URL     | `http://localhost:11434` |
| Temperature | `0.7`                    |
| Top P       | `0.9`                    |

---

## 🎯 Feature Guide

### 1. 🎯 Career Simulator (`/career-simulator`)

Enter your career details (role, salary, experience) and run Monte Carlo simulations to see 5-year projections with salary growth, risk analysis, and success probability.

### 2. 💚 Wellness Dashboard (`/wellness`)

Track daily activities, view burnout risk score, and receive AI-generated wellness recommendations based on your patterns.

### 3. 🤖 AI Skills Assessment (`/ai-assessment`)

Take a 5-question prompt engineering test, get real-time AI scoring, and earn certification badges based on performance.

### 4. 📋 Exam Preparation (`/exam-prep`)

Access detailed roadmaps for **JEE**, **NEET**, and **GATE** exams with phase-by-phase study plans, subject-wise topics, pro tips, and recommended resources.

### 5. 💬 Student Chatroom (`/chatroom`)

Join real-time group chat with fellow students, start WebRTC video calls, and see who's online.

### 6. 🗺️ Roadmap Navigator (`/roadmap`)

Search and explore career paths (Frontend, Backend, DevOps, etc.) with links to curated roadmap.sh resources.

### 7. 📄 Resume ATS Analyzer (`/ats`)

Upload your resume, specify a target job role, and get ATS compatibility scores with actionable improvement suggestions.

---

## 🐛 Troubleshooting

<details>
<summary><b>Ollama Not Running</b></summary>

```bash
# Check if Ollama is active
curl http://localhost:11434/api/tags

# Start Ollama manually
ollama serve
```

</details>

<details>
<summary><b>MongoDB Connection Issues</b></summary>

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

</details>

<details>
<summary><b>Port Already in Use</b></summary>

```bash
# Windows — find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

</details>

<details>
<summary><b>Video Call Not Working</b></summary>

1. Allow camera/microphone permissions in browser
2. Ensure camera is not used by another app
3. Try using HTTPS (some browsers require it for WebRTC)
4. Check browser console for errors

</details>

---

## 📦 Key Dependencies

### Frontend

| Package          | Version  | Purpose                 |
| ---------------- | -------- | ----------------------- |
| react            | ^18.2.0  | UI framework            |
| react-router-dom | ^6.20.0  | Client-side routing     |
| framer-motion    | ^10.16.0 | Animations              |
| recharts         | ^2.10.0  | Data visualization      |
| socket.io-client | ^4.6.0   | Real-time communication |
| axios            | ^1.6.0   | HTTP requests           |
| react-hot-toast  | ^2.4.1   | Toast notifications     |

### Backend

| Package   | Version | Purpose               |
| --------- | ------- | --------------------- |
| express   | ^4.18.0 | Web framework         |
| mongoose  | ^8.0.0  | MongoDB ODM           |
| socket.io | ^4.6.0  | WebSocket server      |
| cors      | ^2.8.5  | Cross-origin requests |

### ML Service

| Package | Version | Purpose              |
| ------- | ------- | -------------------- |
| fastapi | 0.104.1 | API framework        |
| uvicorn | 0.24.0  | ASGI server          |
| numpy   | 1.26.2  | Numerical computing  |
| scipy   | 1.15.2  | Scientific computing |
| httpx   | 0.25.1  | Async HTTP client    |

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m "Add YourFeature"`
4. **Push** to the branch: `git push origin feature/YourFeature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed by the **PathNexusAI Team**

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) — Local LLM capabilities
- [roadmap.sh](https://roadmap.sh/) — Career roadmap resources
- [MongoDB](https://www.mongodb.com/) — Database
- [React](https://react.dev/) & [FastAPI](https://fastapi.tiangolo.com/) — Framework communities

---

<p align="center">
  <strong>Made with ❤️ for students worldwide</strong>
</p>
