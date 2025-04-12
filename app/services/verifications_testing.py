import json
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from openai import OpenAI
import requests
from parse_resume_transcript import parse_resume, parse_transcript, extract_text_from_pdf

import os
os.makedirs("verifications", exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# --- 1. GPA Consistency Check ---
def check_gpa(resume_data, transcript_data):
    resume_gpa = float(resume_data.get("GPA", -1))
    transcript_gpa = float(transcript_data.get("GPA", -1))
    reason = None
    if abs(resume_gpa - transcript_gpa) > 0.05:
        reason = f"GPA on resume ({resume_gpa}) does not match transcript ({transcript_gpa})"
    result = {"val": transcript_gpa, "reason": reason}
    with open("verifications/gpa_check.json", "w") as f:
        json.dump(result, f)
    return result

# --- 2. Email School for Transcript Verification ---
def email_school_for_transcript(student_name, school, transcript_path):
    registrar_email = "fake.regis123@gmail.com"
    sender_email = "ritiagarwal2002@gmail.com"
    app_password = os.getenv("GMAIL_APP_PASSWORD")  # store your app password in env

    subject = "Transcript Verification Request"
    body = f"Hello,\n\nPlease confirm if {student_name} has attended {school} and if the attached transcript is valid.\n\nThanks,\nTomorrowCard Team"

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = registrar_email

    msg.attach(MIMEText(body, "plain"))

    with open(transcript_path, "rb") as f:
        part = MIMEApplication(f.read(), Name=os.path.basename(transcript_path))
        part['Content-Disposition'] = f'attachment; filename=\"{os.path.basename(transcript_path)}\"'
        msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
        result = {"val": True, "reason": None}
    except Exception as e:
        result = {"val": False, "reason": str(e)}

    with open("verifications/transcript_email_check.json", "w") as f:
        json.dump(result, f)

    return result


# --- 3. Automatic Background Check ---
def background_check_api(resume_data):
    # Simulate API response
    response = {"val": True, "reason": None}  # Assume clean background
    with open("verifications/background_check.json", "w") as f:
        json.dump(response, f)
    return response

# --- 4. Automatic Credit Check ---
def credit_check_api(resume_data):
    # Simulate API response
    response = {"val": True, "score": 725, "reason": None}
    with open("verifications/credit_check.json", "w") as f:
        json.dump(response, f)
    return response

import re

def is_affirmative_response(content):
    return bool(re.match(r'^\s*yes\b', content.strip(), re.IGNORECASE))

# --- 5. Resume Employment Check via ChatGPT ---
def check_employment_history(resume_data):
    checked_history = []
    employment_history = resume_data.get("experience", [])
    for job in employment_history:
        company = job.get("company")
        title = job.get("title")
        prompt = f"Does the company '{company}' exist and is the job title '{title}' plausible for a student resume? Respond yes or no and provide a short reason."
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        content = response.choices[0].message.content
        # print(content)
        # reason = None if "yes" in content.lower() else content.strip()
        if is_affirmative_response(content):
            reason = None
        else:
            reason = content
        job_result = {"company": company, "title": title, "reason": reason}
        checked_history.append(job_result)
    with open("verifications/employment_check.json", "w") as f:
        json.dump({"val": checked_history}, f)
    return checked_history

# --- 6. Cross Check Classes with Major (GPT) ---
def check_courses_vs_major(transcript_data, resume_data):
    major = resume_data.get("major", "")
    if major == "":
        print("getting major from transcript")
        major = transcript_data.get("major", "")
    courses = transcript_data.get("courses", [])
    course_names = ", ".join([course["name"] for course in courses])

    reason = None

    prompt = f"A student majoring in {major} took these classes: {course_names}. Do these classes align well with the major? Answer yes or no and explain."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    course_alignment_reason = None if is_affirmative_response(content) else content

    result = {
        "val": course_alignment_reason is None,
        "reason": reason or course_alignment_reason
    }

    with open("verifications/class_vs_major_check.json", "w") as f:
        json.dump(result, f)

    return result

# --- 7. Validate School and Course Codes ---
def check_school_and_classes(transcript_data):
    school = transcript_data.get("school", "")
    courses = transcript_data.get("courses", [])
    course_names = ", ".join([course["name"] for course in courses])
    prompt = f"Is '{school}' a real accredited college, and do these classes appear to be courses offered by it: {course_names}?"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content
    reason = None if is_affirmative_response(content) else content.strip()
    result = {"val": True if reason is None else False, "reason": reason}
    with open("verifications/school_and_class_check.json", "w") as f:
        json.dump(result, f)
    return result

# --- 8. Final Aggregator ---
def aggregate_verifications(resume_data, transcript_data, transcript_path):
    check_gpa(resume_data, transcript_data)
    email_school_for_transcript(resume_data.get("name", "Student"), transcript_data.get("school", "Unknown School"), transcript_path)
    background_check_api(resume_data)
    credit_check_api(resume_data)
    check_employment_history(resume_data)
    check_courses_vs_major(transcript_data, resume_data)
    check_school_and_classes(transcript_data)

    files = [
        "gpa_check.json",
        "transcript_email_check.json",
        "background_check.json",
        "credit_check.json",
        "employment_check.json",
        "class_vs_major_check.json",
        "school_and_class_check.json"
    ]
    results = {}
    for f in files:
        with open(f"verifications/{f}") as file:
            key = f.replace("_check.json", "")
            results[key] = json.load(file)
    return results

# resume_text = extract_text_from_pdf("uploads/Fake_Unbelievable_Resume_Chintu_Kumar.pdf")
resume_text = extract_text_from_pdf("uploads/riti_resume_compact.pdf")
resume_data = parse_resume(resume_text)
transcript_text = extract_text_from_pdf("uploads/rwcgi60.pdf")
# transcript_text = extract_text_from_pdf("uploads/Fake_Transcript_Rajeev_Sharma.pdf")
transcript_data = parse_transcript(transcript_text)
# print(resume_data)
# print(type(resume_data))

# print(background_check_api(resume_data))
# print(credit_check_api(resume_data))
# print(email_school_for_transcript("Riti Agarwal", "Caltech", "uploads/rwcgi60.pdf"))

print(aggregate_verifications(resume_data, transcript_data, "uploads/rwcgi60.pdf"))