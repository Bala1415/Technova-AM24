import os
import json
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import tempfile

# Import utilities from the existing project
from utils.resume_analyzer import ResumeAnalyzer
from utils.ai_resume_analyzer import AIResumeAnalyzer
from utils.resume_builder import ResumeBuilder

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Analyzers
resume_analyzer = ResumeAnalyzer()
ai_analyzer = AIResumeAnalyzer()
resume_builder = ResumeBuilder()

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET'])
def home():
    return "Resume Analyzer API is running. Use the frontend to interact."

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Resume Analyzer API"})

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract Text
        text = ""
        if filename.lower().endswith('.pdf'):
            # Re-open file for extraction or pass path
            with open(filepath, 'rb') as f:
                text = ai_analyzer.extract_text_from_pdf(f)
        elif filename.lower().endswith('.docx'):
             with open(filepath, 'rb') as f:
                text = ai_analyzer.extract_text_from_docx(f)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # Run Analysis
        # 1. Basic Static Analysis
        job_requirements = request.form.get('job_requirements')
        try:
             job_requirements = json.loads(job_requirements) if job_requirements else {}
        except:
             job_requirements = {}

        static_analysis = resume_analyzer.analyze_resume({'raw_text': text}, job_requirements)
        
        # 2. AI Analysis (using Local Ollama)
        ai_analysis = {}
        # We don't need to check for GOOGLE_API_KEY anymore
        job_role = request.form.get('job_role', 'General')
        print(f"Running AI Analysis with Ollama for role: {job_role}")
        ai_analysis = ai_analyzer.analyze_resume_with_ollama(text, job_role=job_role)
        
        # Cleanup
        os.remove(filepath)
        
        return jsonify({
            "success": True,
            "text": text,
            "static_analysis": static_analysis,
            "ai_analysis": ai_analysis
        })

    except Exception as e:
        print(f"Error analyzing resume: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Call ResumeBuilder
        # Ensure data matches the expected format of ResumeBuilder
        # ResumeBuilder expects a dict with 'template' and other fields
        
        doc_buffer = resume_builder.generate_resume(data)
        
        # Send back the file
        return send_file(
            doc_buffer,
            as_attachment=True,
            download_name='resume.docx',
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        print(f"Error generating resume: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
