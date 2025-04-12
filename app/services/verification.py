import json
from app.services.verifiers.check_gpa import check_gpa
from app.services.verifiers.email_school import email_school_for_transcript
from app.services.verifiers.backgroundcheck import background_check_api
from app.services.verifiers.creditcheck import credit_check_api
from app.services.verifiers.check_employment_history import check_employment_history
from app.services.verifiers.check_courses_vs_major import check_courses_vs_major
from app.services.verifiers.check_school_and_classes import check_school_and_classes


# --- 8. Final Aggregator ---
def aggregate_verifications(resume_data, transcript_data, transcript_path, id):
    check_gpa(resume_data, transcript_data, id)
    email_school_for_transcript(resume_data.get("name", "Student"), transcript_data.get("school", "Unknown School"), transcript_path, id)
    background_check_api(resume_data, id)
    credit_check_api(resume_data, id)
    check_employment_history(resume_data, id)
    check_courses_vs_major(transcript_data, resume_data, id)
    check_school_and_classes(transcript_data, id)

    files = [
        f"gpa_check_{id}.json",
        f"transcript_email_check_{id}.json",
        f"background_check_{id}.json",
        f"credit_check_{id}.json",
        f"employment_check_{id}.json",
        f"class_vs_major_check_{id}.json",
        f"school_and_class_check_{id}.json"
    ]
    
    results = {}
    for f in files:
        with open(f"verifications/{f}") as file:
            key = f.replace(f"_check_{id}.json", "")
            results[key] = json.load(file)
    return results

