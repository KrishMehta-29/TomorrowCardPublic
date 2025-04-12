import fitz  # PyMuPDF
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
load_dotenv()

def extract_text_from_pdf(path):
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

resume_function = {
    "name": "extract_resume_info",
    "description": "Extract structured resume information",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "school": {"type": "string"},
            "major": {"type": "string"},
            "GPA": {"type": "number"},
            "skills": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Programming and technical skills"
            },
            "experience": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "company": {"type": "string"},
                        "title": {"type": "string"}
                    },
                    "required": ["company", "title"]
                },
                "description": "All work experience: internships, research, jobs"
            }
        },
        "required": ["name", "email", "school", "major", "GPA", "skills", "experience"]
    }
}

transcript_function = {
    "name": "parse_transcript",
    "description": "Extract structured data from a college transcript",
    "parameters": {
        "type": "object",
        "properties": {
            "school": {
                "type": "string",
                "description": "Full name of the university or college"
            },
            "GPA": {
                "type": "number",
                "description": "Final GPA as a float (e.g., 3.85)"
            },
            "courses": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string"},
                        "name": {"type": "string"},
                        "grade": {"type": "string"}
                    },
                    "required": ["name", "grade"]
                },
                "description": "List of all courses with code, name, and grade"
            }
        },
        "required": ["school", "GPA", "courses"]
    }
}

def parse_resume(text):
    prompt = f"""
    Extract the following fields from this resume.

    **Rules:**
    - GPA must be a float (e.g. 3.9) - Ensure you are getting the students GPA and not the max GPA.
    - Major should be the field of study only
    - Skills should include technical tools, languages, or frameworks only
    - Include ALL past work experience under 'experience': internships, research, teaching, part-time jobs
    - Each experience must contain the company/lab name and job title (separate fields)

    Respond ONLY with a valid JSON object matching this schema:
    {{
    "name": "Full Name",
    "email": "email@domain.com",
    "school": "University Name",
    "major": "Computer Science",
    "GPA": 4.0,
    "skills": ["Python", "TensorFlow", "Git"],
    "experience": [
        {{
        "company": "Juniper Networks",
        "title": "Machine Learning Intern"
        }},
        {{
        "company": "Murray Lab, Caltech",
        "title": "Research Student"
        }}
    ]
    }}

    Resume:
    \"\"\"
    {text}
    \"\"\"
    """

    response = client.chat.completions.create(
        model="gpt-4o",  # Function calling supported here
        messages=[{"role": "user", "content": prompt}],
        functions=[resume_function],
        function_call={"name": "extract_resume_info"},
        temperature=0
    )

    # Function call data is here:
    return json.loads(response.choices[0].message.function_call.arguments)


def parse_transcript(text):
    prompt = f"""
    You are a transcript parsing agent. Extract the following:

    - School name (e.g. 'California Institute of Technology')
    - Final GPA (as a float like 3.89) (this is the students GPA)
    - A list of courses, each with:
    - Course code (if present, else "")
    - Course name
    - Grade (letter grade only)

    Output must follow this JSON format:
    {{
    "school": "California Institute of Technology",
    "GPA": 3.9,
    "courses": [
        {{"code": "CS 101", "name": "Intro to Programming", "grade": "A"}},
        {{"code": "", "name": "Modern Physics", "grade": "B+"}}
    ]
    }}

    Transcript:
    \"\"\"
    {text}
    \"\"\"
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        functions=[transcript_function],
        function_call={"name": "parse_transcript"},
        temperature=0
    )
    return json.loads(response.choices[0].message.function_call.arguments)





