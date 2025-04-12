import re
from openai import OpenAI
import json
import os
os.makedirs("verifications", exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def is_affirmative_response(content):
    return bool(re.match(r'^\s*yes\b', content.strip(), re.IGNORECASE))

def check_courses_vs_major(transcript_data, resume_data):
    major = resume_data.get("major", "")
    if major == "":
        print("getting major from transcript")
        major = transcript_data.get("major", "")
    courses = transcript_data.get("courses", [])
    course_names = ", ".join([course["name"] for course in courses])

    prompt = f"A student majoring in {major} took these classes: {course_names}. Do these classes align well with the major? Answer yes or no and explain."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    course_alignment = is_affirmative_response(content)

    prompt2 = f"A student is taking major: {major}. Does this seem like a legitimate major at university? Answer yes or no and explain in a few words."
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt2}],
        temperature=0
    )
    major_content = response.choices[0].message.content.strip()
    major_legitimacy = is_affirmative_response(major_content)

    result = {
        "major": { "val": major, "reason": major_content if not major_legitimacy else None },
        "val": [ {"course": course["name"], "grade": course.get("grade"), "code": course.get("code")} for course in courses ],
        "reason": content if not course_alignment else None
    }

    with open("verifications/class_vs_major_check.json", "w") as f:
        json.dump(result, f)

    return result