from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import json
import os
import uuid
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from resume_helper import *
from utils.resume_analyzer import ResumeAnalyzer
from utils.ai_resume_analyzer import AIResumeAnalyzer
from utils.resume_builder import ResumeBuilder
from career_simulator import simulate_career_path
from burnout_detector import detect_burnout
from prompt_evaluator import assess_prompt_engineering
import nltk
import cv2
import numpy as np

nltk.download("punkt")
nltk.download("stopwords")

# Ollama Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"

async def query_ollama(prompt: str, stream: bool = False):
    """
    Query Ollama with optimized settings for better performance.
    
    Args:
        prompt: The prompt to send to Ollama
        stream: Whether to stream the response (faster perceived response)
    
    Returns:
        The generated text response
    """
    async with httpx.AsyncClient(timeout=120.0) as client:  # Increased timeout to 120s
        try:
            response = await client.post(
                OLLAMA_API_URL,
                json={
                    "model": MODEL_NAME,
                    "prompt": prompt,
                    "stream": False,  # Set to False for now, can enable streaming later
                    "options": {
                        "num_predict": 512,  # Limit response length for faster generation
                        "temperature": 0.7,   # Balanced creativity
                        "top_p": 0.9,
                        "top_k": 40
                    }
                },
                timeout=120.0  # 2 minutes timeout for complex prompts
            )
            response.raise_for_status()
            result = response.json().get("response", "")
            print(f"✓ Ollama response generated ({len(result)} chars)")
            return result
        except httpx.TimeoutException:
            print(f"⚠ Ollama Timeout: Request took longer than 120 seconds")
            return "Response generation timed out. Please try a simpler prompt or check if Ollama is running on GPU."
        except httpx.ConnectError:
            print(f"⚠ Ollama Connection Error: Is Ollama running on port 11434?")
            return "Could not connect to Ollama. Please ensure Ollama is running (ollama serve)."
        except Exception as e:
            print(f"❌ Ollama Error: {e}")
            return f"Error: {str(e)}"


app = FastAPI()

# Initialize Analyzers
resume_analyzer = ResumeAnalyzer()
ai_analyzer = AIResumeAnalyzer()
resume_builder = ResumeBuilder()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

DATABASE_FILE = "database/embeddings.json"

if not os.path.exists(DATABASE_FILE):
    os.makedirs(os.path.dirname(DATABASE_FILE), exist_ok=True)  
    with open(DATABASE_FILE, 'w') as f:
        json.dump({}, f)

async def generate_response(text: str):
    prompt = f'''You are a helpful mentor chatbot. Respond to the following in a supportive, educational, and engaging way and give full answer: {text}'''
    response_text = await query_ollama(prompt)
    
    if response_text:
        return response_text
    return "I'm sorry, I couldn't generate a response. Please try again."

class ChatRequest(BaseModel):
    text: str

class SkillRecommendationRequest(BaseModel):
    job_name: str

class CareerGuidanceRequest(BaseModel):
    skills: list
    interests: list

class CareerSimulationRequest(BaseModel):
    careerPath: str
    comparisonPath: str = None
    userProfile: dict = None

class BurnoutAnalysisRequest(BaseModel):
    activityLog: list

class PromptAssessmentRequest(BaseModel):
    question: str
    userPrompt: str
    assessmentType: str

class InterviewQuestionRequest(BaseModel):
    jobRole: str
    difficulty: str = "medium"


# @app.post("/add_face/")  # Commented out - requires deepface
# async def add_face(file: UploadFile = File(...), student_name: str = ""):
#     """
#     Endpoint to add a new face to the database (stored in JSON file).
#     The face will be embedded and saved with the student's name.
#     """
#     if not student_name:
#         raise HTTPException(status_code=400, detail="Student name must be provided.")
# 
#     file_bytes = await file.read()
#     np_img = np.frombuffer(file_bytes, np.uint8)
#     img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
# 
#     faces = detect_faces(img)
# 
#     if len(faces) == 0:
#         raise HTTPException(status_code=400, detail="No faces detected in the image.")
# 
#     face_img, _ = faces[0] 
#     embedding = extract_embeddings(face_img)
# 
#     embeddings_db = load_embeddings()
# 
#     if student_name in embeddings_db:
#         embeddings_db[student_name].append(embedding)
#     else:
#         embeddings_db[student_name] = [embedding]
# 
#     save_embeddings(embeddings_db)
# 
#     return {"message": f"Face for {student_name} added successfully."}


# @app.post("/process_attendance/")  # Commented out - requires deepface
# async def process_attendance(file: UploadFile = File(...)):
#     """
#     Endpoint to process attendance by matching faces in an uploaded image.
#     It returns the names of the students whose faces are detected.
#     """
#     file_bytes = await file.read()
#     np_img = np.frombuffer(file_bytes, np.uint8)
#     img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
# 
#     faces = detect_faces(img)
# 
#     if len(faces) == 0:
#         raise HTTPException(status_code=400, detail="No faces detected in the image.")
# 
#     recognized_students = []
# 
#     embeddings_db = load_embeddings()
# 
#     for face_img, _ in faces:
#         embedding = extract_embeddings(face_img)
# 
#         name = recognize_face(embedding, embeddings_db)
# 
#         if name != "Unknown":
#             recognized_students.append(name)
# 
#     if recognized_students:
#         return {"recognized_faces": recognized_students}
#     else:
#         raise HTTPException(status_code=404, detail="No recognized faces found in the image.")


@app.post("/score_resume/")
async def score_resume(
    resume: UploadFile = File(...),
    job_desc: UploadFile = File(None)
):
    resume_path = f"uploads/{str(uuid.uuid4())}_{resume.filename}"
    os.makedirs(os.path.dirname(resume_path), exist_ok=True)
    with open(resume_path, 'wb') as f:
        f.write(await resume.read())
    
    jd_path = None
    if job_desc:
        jd_path = f"uploads/{str(uuid.uuid4())}_{job_desc.filename}"
        with open(jd_path, 'wb') as f:
            f.write(await job_desc.read())
        jd_text = extract_text_from_path(jd_path)
    else:
        jd_text = "python machine learning big data cloud"
    
    rt = extract_text_from_path(resume_path)
    jt = process_tokens(jd_text)
    rk = process_tokens(rt)
    s = calculate_score(jt, rk)
    
    return {
        "resume_saved_at": resume_path,
        "job_desc_saved_at": jd_path,
        "score": s
    }


@app.post("/chatbot/")
async def chatbot(request: ChatRequest):
    """
    Endpoint for the chatbot to interact with the user. This acts as a mentor or guide.
    """
    response_text = await generate_response(request.text)
    return {"response": response_text}


@app.post("/recommend_skills/")
async def recommend_skills(request: SkillRecommendationRequest):
    """
    Endpoint to recommend skills based on job title. 
    The response will be a comma-separated list of skills needed for the job.
    """
    job_name = request.job_name
    prompt = f"List the most important skills required for the job of {job_name}. Return the skills in a comma-separated list."
    
    try:
        response_text = await query_ollama(prompt)
        if response_text:
            skills = response_text.strip().replace("\n", ", ")
            return {"skills": skills}
        return {"message": "No skills found, please rephrase your request."}
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}


@app.post("/career_guidance/")
async def career_guidance(request: CareerGuidanceRequest):
    """
    Endpoint for generating a career roadmap based on a list of skills and interests.
    Returns a roadmap in plaintext without markdown.
    """
    skills = ", ".join(request.skills)
    interests = ", ".join(request.interests)
    
    prompt = f"Given the following skills: {skills} and interests: {interests}, provide a big career roadmap to help the user develop professionally. Make sure to not use markdown formatting."
    
    try:
        roadmap = await query_ollama(prompt)
        if roadmap:
             return {"roadmap": roadmap.strip()}
        
        return {"message": "No roadmap found, please rephrase your request."}
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}


# NEW ENDPOINTS FOR ADVANCED FEATURES

@app.post("/simulate_career")
async def simulate_career(request: CareerSimulationRequest):
    try:
        result = simulate_career_path(request.careerPath, request.comparisonPath, request.userProfile)
        return result
    except Exception as e:
        return {"error": f"Simulation failed: {str(e)}"}

@app.post("/detect_burnout")
async def detect_burnout_endpoint(request: BurnoutAnalysisRequest):
    try:
        result = detect_burnout(request.activityLog)
        return result
    except Exception as e:
        return {"error": f"Burnout analysis failed: {str(e)}"}

@app.post("/assess_prompt_engineering")
async def assess_prompt(request: PromptAssessmentRequest):
    try:
        ai_output = await query_ollama(request.userPrompt)
        result = assess_prompt_engineering(request.question, request.userPrompt, ai_output)
        return result
    except Exception as e:
        return {"error": f"Assessment failed: {str(e)}"}

@app.post("/generate_assessment")
async def generate_assessment(request: dict):
    try:
        questions = [
            {"id": "Q1", "text": "Write a prompt to generate a detailed project plan for a mobile app"},
            {"id": "Q2", "text": "Create a prompt to debug a Python function with specific error handling"},
            {"id": "Q3", "text": "Write a prompt to generate test cases for an e-commerce checkout flow"},
            {"id": "Q4", "text": "Create a prompt to refactor legacy code with modern best practices"},
            {"id": "Q5", "text": "Write a prompt to generate API documentation from code comments"},
        ]
        return {"questions": questions}
    except Exception as e:
        return {"error": f"Question generation failed: {str(e)}"}

@app.post("/generate_interview_questions")
async def generate_interview_questions(request: InterviewQuestionRequest):
    try:
        questions = [
            {"id": 1, "question": f"Tell me about your experience with {request.jobRole}", "type": "behavioral"},
            {"id": 2, "question": f"What are the key skills needed for {request.jobRole}?", "type": "technical"},
        ]
        return {"questions": questions, "jobRole": request.jobRole}
    except Exception as e:
        return {"error": f"Interview question generation failed: {str(e)}"}

@app.post("/evaluate_interview_response")
async def evaluate_interview_response(request: dict):
    try:
        question = request.get("question")
        user_response = request.get("response")
        prompt = f"As an interview coach, evaluate: Question: {question}, Response: {user_response}"
        feedback = await query_ollama(prompt)
        return {"score": 75, "feedback": feedback}
    except Exception as e:
        return {"error": f"Evaluation failed: {str(e)}"}



@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form("General"),
    job_requirements: str = Form("{}")
):
    try:
        # Save file temporarily
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ['.pdf', '.docx']:
             raise HTTPException(status_code=400, detail="Unsupported file format")

        temp_filename = f"uploads/{uuid.uuid4()}{file_ext}"
        os.makedirs("uploads", exist_ok=True)
        
        # Read file content
        file_content = await file.read()
        
        with open(temp_filename, "wb") as buffer:
            buffer.write(file_content)
            
        # Extract Text
        file_size = os.path.getsize(temp_filename)
        print(f"Processing Resume: {file.filename} (Size: {file_size} bytes)")

        text = ""
        if file_ext == '.pdf':
            try:
               # Pass the file content bytes directly
               text = ai_analyzer.extract_text_from_pdf(file_content)
               print(f"PDF extraction successful, text length: {len(text)}")
            except Exception as extract_err:
               print(f"PDF Extraction Error: {extract_err}")
               import traceback
               traceback.print_exc()
        elif file_ext == '.docx':
            try:
               # Pass the file content bytes directly
               text = ai_analyzer.extract_text_from_docx(file_content)
               print(f"DOCX extraction successful, text length: {len(text)}")
            except Exception as extract_err:
                print(f"DOCX Extraction Error: {extract_err}")
                import traceback
                traceback.print_exc()
        
        if text is None:
            text = ""
        
        cleaned_text = text.strip()
        print(f"Extracted Text Length: {len(cleaned_text)}")
        print(f"First 200 chars: {cleaned_text[:200]}")
        
        if len(cleaned_text) < 50:
            return {
                "success": False,
                "error": "Could not extract sufficient text. Please ensure the resume is a text-based PDF/DOCX, not an image/scan.",
                "text": text,
                "static_analysis": {"ats_score": 0, "suggestions": ["Upload a text-based PDF/DOCX."]},
                "ai_analysis": {"ats_score": 0, "resume_score": 0}
            }


        # Run Analysis
        try:
             requirements_dict = json.loads(job_requirements)
        except:
             requirements_dict = {}

        static_analysis = resume_analyzer.analyze_resume({'raw_text': text}, requirements_dict)
        
        # AI Analysis using Gemini
        print(f"Running AI Analysis with Gemini for role: {job_role}")
        ai_analysis = ai_analyzer.analyze_resume_with_gemini(text, job_role=job_role)
        
        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        return {
            "success": True,
            "text": text,
            "static_analysis": static_analysis,
            "ai_analysis": ai_analysis
        }

    except Exception as e:
        print(f"Error analyzing resume: {e}")
        return {"error": str(e)}

@app.post("/generate-resume")
async def generate_resume(data: dict):
    try:
        # Generate resume document
        doc_buffer = resume_builder.generate_resume(data)
        
        # Return as downloadable file
        return StreamingResponse(
            iter([doc_buffer.getvalue()]),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": "attachment; filename=resume.docx"}
        )

    except Exception as e:
        print(f"Error generating resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

