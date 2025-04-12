import json
import os
os.makedirs("verifications", exist_ok=True)

def background_check_api(resume_data):
    # Simulate API response
    response = {"val": "Background Check Complete, No Issues Found", "reason": None}  # Assume clean background
    with open("verifications/background_check.json", "w") as f:
        json.dump(response, f)
    return response