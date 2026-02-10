# PathNexusAI 🎓

**AI-Powered Career Guidance & Student Development Platform**

PathNexusAI is a comprehensive platform that combines AI-driven career guidance, mental health analytics, skill assessment, and real-time collaboration tools to help students navigate their career journey.

---

## 🌟 Features

### 🎯 Core AI Features

- **AI "Future-Self" Career Simulator** - Monte Carlo simulations for career path predictions
- **Mental Health & Burnout Analytics** - Predictive wellness tracking with automated interventions
- **AI "Career Co-Pilot" Skills Scorer** - Prompt engineering assessment with badge certification
- **Career Roadmap Navigator** - Integration with roadmap.sh for curated learning paths
- **AI Chatbot** - Local LLM-powered assistant using Ollama

### 💬 Communication & Collaboration

- **Student Chatroom** - Real-time group chat with WebRTC video conferencing
- **Mentor Chat** - 1-on-1 messaging with college and industry mentors
- **Video Calls** - Multi-user video conferencing with WebRTC

### 📊 Career Tools

- **Resume ATS Scorer** - AI-powered resume analysis
- **Skill Recommendations** - Personalized skill development suggestions
- **Career Guidance** - AI-driven career path recommendations
- **Quiz & Certifications** - Interactive assessments

---

## 🛠️ Tech Stack

### Frontend

- **React** 18+ with Vite
- **React Router** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Socket.io-client** for real-time communication
- **Axios** for HTTP requests
- **React Hot Toast** for notifications
- **Tailwind CSS** for styling

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for WebSocket communication
- **Axios** for ML server communication

### ML Server

- **Python** 3.11+
- **FastAPI** for API endpoints
- **Ollama** for local LLM (llama3.1:8b)
- **NumPy & SciPy** for Monte Carlo simulations
- **HTTPX** for async HTTP requests

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **Python** (v3.11 or higher)
   - Download: https://www.python.org/downloads/

3. **MongoDB** (v6.0 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

4. **Ollama** (Latest version)
   - Download: https://ollama.ai/download
   - **Required Model**: llama3.1:8b

### Install Ollama Model

After installing Ollama, run:

```bash
ollama pull llama3.1:8b
```

Verify installation:

```bash
ollama list
```

You should see `llama3.1:8b` in the list.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PathNexusAI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add the following:
# MONGO_URI=mongodb://localhost:27017/pathnexusai
# PORT=5000

# Start the server
npm start
```

The backend will run on **http://localhost:5000**

### 3. ML Server Setup

```bash
cd ml

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the ML server
uvicorn main:app --reload --port 8000
```

The ML server will run on **http://localhost:8000**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## 🎮 Running the Project

### Start All Servers

You need **3 terminal windows**:

#### Terminal 1 - Backend

```bash
cd backend
npm start
```

#### Terminal 2 - ML Server

```bash
cd ml
.\venv\Scripts\Activate.ps1  # Windows
# or
source venv/bin/activate      # macOS/Linux

uvicorn main:app --reload --port 8000
```

#### Terminal 3 - Frontend

```bash
cd frontend
npm run dev
```

### Verify Everything is Running

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **ML Server**: http://localhost:8000
- **Ollama**: http://localhost:11434

---

## 📁 Project Structure

```
PathNexusAI/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   └── student/     # Student-specific pages
│   │   ├── components/      # Reusable components
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── models/              # Mongoose models
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
│
└── ml/                       # Python ML server
    ├── career_simulator.py   # Monte Carlo simulations
    ├── burnout_detector.py   # Wellness analytics
    ├── prompt_evaluator.py   # Skill assessment
    ├── main.py              # FastAPI server
    └── requirements.txt     # Python dependencies
```

---

## 🔧 Configuration

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/pathnexusai
PORT=5000
```

### Ollama Configuration

- **Model**: llama3.1:8b
- **API URL**: http://localhost:11434
- **Temperature**: 0.7
- **Top P**: 0.9

---

## 🎯 Key Features Usage

### 1. Career Simulator

- Navigate to `/career-simulator`
- Enter career details (role, salary, experience)
- Run Monte Carlo simulation
- View 5-year projections and risk analysis

### 2. Wellness Dashboard

- Navigate to `/wellness`
- Track daily activities
- View burnout risk meter
- Get automated wellness recommendations

### 3. AI Skills Assessment

- Navigate to `/ai-assessment`
- Complete 5-question prompt engineering test
- Receive real-time scoring
- Earn certification badges

### 4. Student Chatroom

- Navigate to `/chatroom`
- Join group chat with other students
- Start video calls with WebRTC
- See online users in real-time

### 5. Roadmap Navigator

- Navigate to `/roadmap`
- Search for career paths (e.g., "Frontend", "Python")
- Browse by category
- Get redirected to roadmap.sh resources

---

## 🐛 Troubleshooting

### Ollama Not Running

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start Ollama service
ollama serve
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Port Already in Use

```bash
# Find process using port (Windows)
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Video Call Not Working

1. Allow camera/microphone permissions in browser
2. Check if camera is not used by another application
3. Try using HTTPS (some browsers require it for WebRTC)
4. Check browser console for errors

---

## 📦 Dependencies

### Frontend

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.0",
  "recharts": "^2.10.0",
  "socket.io-client": "^4.6.0",
  "axios": "^1.6.0",
  "react-hot-toast": "^2.4.1"
}
```

### Backend

```json
{
  "express": "^4.18.0",
  "mongoose": "^8.0.0",
  "socket.io": "^4.6.0",
  "axios": "^1.6.0",
  "cors": "^2.8.5",
  "body-parser": "^1.20.0"
}
```

### ML Server

```txt
fastapi==0.104.1
uvicorn==0.24.0
httpx==0.25.1
numpy==1.26.2
scipy==1.15.2
pydantic==2.5.0
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed by the PathNexusAI Team

---

## 🙏 Acknowledgments

- **Ollama** for local LLM capabilities
- **roadmap.sh** for career roadmap integration
- **MongoDB** for database
- **React** and **FastAPI** communities

---

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact: support@pathnexusai.com

---

**Made with ❤️ for students worldwide**
