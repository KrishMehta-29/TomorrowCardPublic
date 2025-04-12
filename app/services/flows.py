from app.services.verification import aggregate_verifications
from app.services.feature_extraction import predict_all_features
from app.services.parse_resume_transcript import parse_resume, parse_transcript, extract_text_from_pdf
import os
import json

def verify_resume_and_transcript(resume_path, transcript_path, id):
    resume_text = extract_text_from_pdf(resume_path)
    resume_data = parse_resume(resume_text)

    transcript_text = extract_text_from_pdf(transcript_path)
    transcript_data = parse_transcript(transcript_text)

    return aggregate_verifications(resume_data, transcript_data, transcript_path, id)

def predict_all_features_flow(resume_path):
    resume_text = extract_text_from_pdf(resume_path)
    resume_data = parse_resume(resume_text)

    return predict_all_features(resume_data)

def getCurrentProcesses(id):
    files = {
        f"gpa_check_{id}.json": ("GPA Verification Processing", "GPA Verification Complete"),
        f"transcript_email_check_{id}.json": ("Sending Email to Verify Transcript", "Email sent to college to verify transcript"),
        f"background_check_{id}.json": ("Sending Background Check Request", "Background check complete"),
        f"credit_check_{id}.json": ("Sending Credit Check Request", "Credit check complete"),
        f"employment_check_{id}.json": ("Resume Employment Legitimacy Check Processing", "Resume Employment Legitimacy Check Complete"),
        f"class_vs_major_check_{id}.json": ("Transcript Classes Legitimacy Check Processing", "Transcript Classes Legitimacy Check Complete"),
        f"school_and_class_check_{id}.json": ("Verifying Transcript Classes for Major", "Transcript Classes Verified for Major")
    }

    results = {}
    for f, (name, completed_name) in files.items():
        key = f.replace(f"_check_{id}.json", "")
        if os.path.exists(f"verifications/{f}"):
            with open(f"verifications/{f}") as file:
                results[key] = completed_name
        else: 
            results[key] = name

    return results
        


    
