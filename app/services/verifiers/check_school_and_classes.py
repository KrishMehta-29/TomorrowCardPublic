import re
from openai import OpenAI
import json
import os
os.makedirs("verifications", exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def is_affirmative_response(content):
    return bool(re.match(r'^\s*yes\b', content.strip(), re.IGNORECASE))

def check_school_and_classes(transcript_data, id):
    school = transcript_data.get("school", "")
    courses = transcript_data.get("courses", [])
    course_names = ", ".join([course["name"] for course in courses])
    prompt = f"Is '{school}' a real accredited college, and do these classes appear to be courses offered by it: {course_names}?"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    reason = None if is_affirmative_response(content) else content
    result = {"val": school, "reason": reason}
    with open(f"verifications/school_and_class_check_{id}.json", "w") as f:
        json.dump(result, f)
    return result