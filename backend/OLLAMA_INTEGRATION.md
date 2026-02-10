# Ollama Integration with Backend

Your local Ollama llama3.1:8b is now connected to the backend! 🎉

## Architecture

```
Frontend (React)
    ↓
Backend (Express/Node.js) ←→ Ollama (llama3.1:8b)
    ↓                              ↑
ML Server (FastAPI) ───────────────┘
```

## Available Endpoints

### 1. Check Ollama Status

```bash
GET http://localhost:5000/ollama/status
```

### 2. Simple Prompt

```bash
POST http://localhost:5000/ollama/prompt
Content-Type: application/json

{
  "prompt": "Explain machine learning in simple terms",
  "temperature": 0.7,
  "top_p": 0.9
}
```

### 3. Chat with Context

```bash
POST http://localhost:5000/ollama/chat
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "What is Python?"},
    {"role": "assistant", "content": "Python is a programming language..."},
    {"role": "user", "content": "What are its main uses?"}
  ]
}
```

## Usage in Frontend

```javascript
// Check if Ollama is running
const checkOllama = async () => {
  const response = await axios.get("http://localhost:5000/ollama/status");
  console.log(response.data); // { success: true, running: true }
};

// Send a prompt
const askOllama = async () => {
  const response = await axios.post("http://localhost:5000/ollama/prompt", {
    prompt: "Write a Python function to calculate factorial",
    temperature: 0.7,
  });
  console.log(response.data.response);
};

// Chat with context
const chatWithOllama = async () => {
  const response = await axios.post("http://localhost:5000/ollama/chat", {
    messages: [
      { role: "user", content: "Hello!" },
      { role: "assistant", content: "Hi! How can I help you?" },
      { role: "user", content: "Tell me about AI" },
    ],
  });
  console.log(response.data.response);
};
```

## Configuration

The Ollama helper is located at:

- **Helper**: `backend/utils/ollamaHelper.js`
- **Routes**: `backend/routes/ollamaRoutes.js`

Default settings:

- **Model**: llama3.1:8b
- **API URL**: http://localhost:11434/api/generate
- **Temperature**: 0.7
- **Top P**: 0.9
- **Timeout**: 30 seconds

## What's Connected Now

✅ **ML Server (Port 8000)** → Ollama (for career simulation, burnout detection, prompt evaluation)
✅ **Backend (Port 5000)** → Ollama (for direct LLM queries, chat, and custom prompts)

Both servers can now use your local Ollama instance independently!
