import os
import textwrap
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from google.generativeai import GenerativeModel, configure
from IPython.display import Markdown
from fastapi.middleware.cors import CORSMiddleware

# Securely load API key (consider storing this as an environment variable)
GOOGLE_API_KEY = "AIzaSyALQl3IlQPXT_dD8k5kvBA9j3aXenmfDAg"
configure(api_key=GOOGLE_API_KEY)

# Initialize the generative model
model = GenerativeModel('gemini-2.5-flash')

# Markdown formatter
def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

# FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for request body
class ContentRequest(BaseModel):
    subject: str
    topic: str
    level: str
    content_type: str

@app.post("/generate_content")
async def generate_content(request: ContentRequest):
    prompt = f"""
    Generate a {request.content_type.lower()} for a {request.level.lower()} level {request.subject} class covering {request.topic}.
    
    REQUIREMENTS:
    - Generate exactly 10 multiple choice questions
    - Return ONLY valid JSON format without any additional text
    - Use this exact JSON structure:
    
    {{
      "title": "Quiz Title Here",
      "questions": [
        {{
          "id": "Q1",
          "question": "Specific question based on the scenario",
          "answers": [
            "A) First option",
            "B) Second option", 
            "C) Third option",
            "D) Fourth option"
          ]
        }}
      ],
      "answer_key": {{
        "Q1": "A",
        "Q2": "B"
      }}
    }}
    
    IMPORTANT FORMAT RULES:
    - Question IDs must be strings like "Q1", "Q2", etc.
    - Answers array must contain exactly 4 options prefixed with A), B), C), D)
    - Answer keys must reference question IDs with single letters (A, B, C, D)
    - Do not include any markdown formatting like ```json
    - Ensure the JSON is parseable and valid
    
    Generate the quiz now following these exact specifications.
    """

    try:
        response = model.generate_content(prompt)
        return {"generated_content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server using: uvicorn main:app --reload
