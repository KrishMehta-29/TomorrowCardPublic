import re
from openai import OpenAI
import json
import os
os.makedirs("verifications", exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def is_affirmative_response(content):
    return bool(re.match(r'^\s*yes\b', content.strip(), re.IGNORECASE))

def check_employment_history(resume_data, id):
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
        if is_affirmative_response(content):
            reason = None
        else:
            reason = content
        job_result = {"company": company, "title": title, "reason": reason}
        checked_history.append(job_result)
    with open(f"verifications/employment_check_{id}.json", "w") as f:
        json.dump({"val": checked_history}, f)
    return checked_history