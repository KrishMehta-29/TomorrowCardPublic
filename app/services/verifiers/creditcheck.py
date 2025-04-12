import json
import os
import random

os.makedirs("verifications", exist_ok=True)


def credit_check_api(resume_data):
    # Simulate API response
    response = {"val": "Credit Check Complete, No Issues Found", "score": random.randint(650, 750), "reason": None}
    with open("verifications/credit_check.json", "w") as f:
        json.dump(response, f)
    return response