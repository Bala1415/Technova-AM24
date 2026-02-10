from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import json
import os
import uuid
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from face_matching_helper import *
from resume_helper import *
import nltk
import cv2
import numpy as np

nltk.download("punkt")
nltk.download("stopwords")

# Ollama Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"

async def query_ollama(prompt: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                OLLAMA_API_URL,
                json={
                    "model": MODEL_NAME,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception as e:
            print(f"Ollama Error: {e}")
            return ""

app = FastAPI()

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


@app.post("/add_face/")
async def add_face(file: UploadFile = File(...), student_name: str = ""):
    """
    Endpoint to add a new face to the database (stored in JSON file).
    The face will be embedded and saved with the student's name.
    """
    if not student_name:
        raise HTTPException(status_code=400, detail="Student name must be provided.")

    file_bytes = await file.read()
    np_img = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    faces = detect_faces(img)

    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No faces detected in the image.")

    face_img, _ = faces[0] 
    embedding = extract_embeddings(face_img)

    embeddings_db = load_embeddings()

    if student_name in embeddings_db:
        embeddings_db[student_name].append(embedding)
    else:
        embeddings_db[student_name] = [embedding]

    save_embeddings(embeddings_db)

    return {"message": f"Face for {student_name} added successfully."}


@app.post("/process_attendance/")
async def process_attendance(file: UploadFile = File(...)):
    """
    Endpoint to process attendance by matching faces in an uploaded image.
    It returns the names of the students whose faces are detected.
    """
    file_bytes = await file.read()
    np_img = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    faces = detect_faces(img)

    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No faces detected in the image.")

    recognized_students = []

    embeddings_db = load_embeddings()

    for face_img, _ in faces:
        embedding = extract_embeddings(face_img)

        name = recognize_face(embedding, embeddings_db)

        if name != "Unknown":
            recognized_students.append(name)

    if recognized_students:
        return {"recognized_faces": recognized_students}
    else:
        raise HTTPException(status_code=404, detail="No recognized faces found in the image.")


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
