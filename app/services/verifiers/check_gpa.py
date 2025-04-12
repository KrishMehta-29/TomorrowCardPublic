import json
import os
os.makedirs("verifications", exist_ok=True)

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