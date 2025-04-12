import json
from app.services.verifiers.check_gpa import check_gpa
from app.services.verifiers.email_school import email_school_for_transcript
from app.services.verifiers.backgroundcheck import background_check_api
from app.services.verifiers.creditcheck import credit_check_api
from app.services.verifiers.check_employment_history import check_employment_history
from app.services.verifiers.check_courses_vs_major import check_courses_vs_major
from app.services.verifiers.check_school_and_classes import check_school_and_classes


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

