import json
import os
import random

os.makedirs("verifications", exist_ok=True)


def credit_check_api(resume_data, id):
    # Simulate API response
    response = {"val": "Credit Check Complete, No Issues Found", "score": random.randint(650, 750), "reason": None}
    with open(f"verifications/credit_check_{id}.json", "w") as f:
        json.dump(response, f)
    return response