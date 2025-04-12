from flask import jsonify, request
from . import index_bp  # Import the blueprint
import os
import uuid
from app.services.flows import verify_resume_and_transcript, predict_all_features_flow, getCurrentProcesses

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = "app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@index_bp.route('/')
def index():
    return jsonify("Hello World")

@index_bp.route('/upload', methods=['POST', 'OPTIONS'])
def upload_files():
    # Handle preflight OPTIONS requests for CORS
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight request accepted"})
        return response
    
    # Check if the post request has the file parts
    if 'resume' not in request.files or 'transcript' not in request.files:
        return jsonify({"error": "Missing resume or transcript file"}), 400
    
    resume_file = request.files['resume']
    transcript_file = request.files['transcript']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if resume_file.filename == '' or transcript_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Generate a random ID for both files
        random_id = str(uuid.uuid4())
        
        # Make sure the upload directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Get file extensions from original filenames
        resume_ext = os.path.splitext(resume_file.filename)[1].lower() or '.pdf'
        transcript_ext = os.path.splitext(transcript_file.filename)[1].lower() or '.pdf'
        
        # Save resume file with proper extension
        resume_filename = f"{random_id}_resume{resume_ext}"
        resume_path = os.path.join(UPLOAD_FOLDER, resume_filename)
        resume_file.save(resume_path)
        
        # Save transcript file with proper extension
        transcript_filename = f"{random_id}_transcript{transcript_ext}"
        transcript_path = os.path.join(UPLOAD_FOLDER, transcript_filename)
        transcript_file.save(transcript_path)
        
        # Return success response with file information
        return jsonify({
            "resume_filename": resume_filename,
            "transcript_filename": transcript_filename,
            "id": random_id
        })
    except Exception as e:
        return jsonify({"error": f"File upload failed: {str(e)}"}), 500

@index_bp.route('/verify', methods=['POST', 'OPTIONS'])
def verify_documents():
    # Handle preflight OPTIONS requests for CORS
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight request accepted"})
        return response
    data = request.json
    
    if not data or 'resume_filename' not in data or 'transcript_filename' not in data:
        return jsonify({"error": "Missing resume_filename or transcript_filename"}), 400
    
    resume_filename = data['resume_filename']
    transcript_filename = data['transcript_filename']
    id = data['id']

    
    resume_path = os.path.join(UPLOAD_FOLDER, resume_filename)
    transcript_path = os.path.join(UPLOAD_FOLDER, transcript_filename)
    
    # Check if files exist
    if not os.path.exists(resume_path) or not os.path.exists(transcript_path):
        return jsonify({"error": "One or both files do not exist"}), 404
    
    try:
        # Run verification
        verification_results = verify_resume_and_transcript(resume_path, transcript_path, id)
        return jsonify({"verification_results": verification_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@index_bp.route('/predict', methods=['POST', 'OPTIONS'])
def predict_features():
    # Handle preflight OPTIONS requests for CORS
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight request accepted"})
        return response
    data = request.json
    
    if not data or 'resume_filename' not in data:
        return jsonify({"error": "Missing resume_filename"}), 400
    
    resume_filename = data['resume_filename']
    resume_path = os.path.join(UPLOAD_FOLDER, resume_filename)
    
    # Check if file exists
    if not os.path.exists(resume_path):
        return jsonify({"error": "Resume file does not exist"}), 404
    
    try:
        # Run prediction
        prediction_results = predict_all_features_flow(resume_path)
        return jsonify({"prediction_results": prediction_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@index_bp.route('/get_current_processes', methods=['GET', 'OPTIONS'])
def get_current_processes():
    # Handle preflight OPTIONS requests for CORS
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight request accepted"})
        return response
    id = request.args.get('id')
    
    if id is None:
        return jsonify({"error": "Missing id"}), 400
    print(id)
    try:
        # Get current processes
        processes = getCurrentProcesses(id)
        return jsonify({"processes": processes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500