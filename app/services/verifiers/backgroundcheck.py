import json
import os
os.makedirs("verifications", exist_ok=True)

def background_check_api(resume_data, id):
    # Simulate API response
    response = {"val": "Background Check Complete, No Issues Found", "reason": None}  # Assume clean background
    with open(f"verifications/background_check_{id}.json", "w") as f:
        json.dump(response, f)
    return response