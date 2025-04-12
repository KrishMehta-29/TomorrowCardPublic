# THIS IS DEPRACATED

from flask import Flask, request, render_template_string
import os
import re
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

with open("colleges.json") as f:
    COLLEGES = json.load(f)


# HTML Template
HTML = """
<!doctype html>
<html lang="en">
<head>
    <title>Student Upload Form</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Bootstrap CSS and JS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Select2 CSS and JS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <style>
        body {
            background-color: #f8f9fa;
        }
        .container {
            margin-top: 60px;
            max-width: 600px;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        }
        h2 {
            margin-bottom: 30px;
        }
        .form-label {
            font-weight: 500;
        }
    </style>
</head>
<body>
<div class="container">
    <h2 class="text-center">Upload Resume and Transcript</h2>
    <form method="post" enctype="multipart/form-data">
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="school" class="form-label">School</label>
            <select name="school" id="school" class="form-select" required>
                {% for college in colleges %}
                    <option value="{{ college }}">{{ college }}</option>
                {% endfor %}
            </select>
        </div>
        <div class="mb-3">
            <label for="resume" class="form-label">Resume (PDF)</label>
            <input type="file" name="resume" accept=".pdf" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="transcript" class="form-label">Transcript (PDF)</label>
            <input type="file" name="transcript" accept=".pdf" class="form-control" required>
        </div>
        <div class="d-grid">
            <button type="submit" class="btn btn-primary">Upload</button>
        </div>
    </form>
</div>

<script>
$(document).ready(function() {
    $('#school').select2({
        placeholder: 'Select or type your college',
        tags: true,
        allowClear: true,
        width: '100%'
    });
});
</script>
</body>
</html>
"""



def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[a-zA-Z0-9]{2,}$"
    return re.match(pattern, email)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        school = request.form['school']

        if not is_valid_email(email):
            return "Invalid email format. Please enter a valid email address."
        
        resume = request.files['resume']
        transcript = request.files['transcript']

        # Save files locally
        resume_filename = secure_filename(resume.filename)
        transcript_filename = secure_filename(transcript.filename)
        resume_path = os.path.join(UPLOAD_FOLDER, resume_filename)
        transcript_path = os.path.join(UPLOAD_FOLDER, transcript_filename)

        resume.save(resume_path)
        transcript.save(transcript_path)

        return f"Thanks {name}, your files have been saved locally!"

    return render_template_string(HTML, colleges=COLLEGES)

if __name__ == '__main__':
    app.run(debug=True)
