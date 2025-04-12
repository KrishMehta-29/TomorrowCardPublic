import json
import re
from openai import OpenAI
import requests
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def predict_career_path(resume_data):
    name = resume_data.get("name", "The student")
    school = resume_data.get("school", "their school")
    major = resume_data.get("major", "an unspecified major")
    gpa = resume_data.get("GPA", "N/A")
    prompt = (
        f"Based on the following student profile, would you predict they are more likely to go to grad school or industry?\n"
        f"Name: {name}\nSchool: {school}\nMajor: {major}\nGPA: {gpa}\nPrevious Employments: {', '.join([f'{experience.get("title")}@{experience.get("company")}' for experience in resume_data.get('experience', [])])}\n"
        f"Respond in the following format:\nAnswer: Grad School or Industry\nReason: <one-line reason>"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    answer_match = re.search(r"(?i)Answer:\s*(.*)", content)
    reason_match = re.search(r"(?i)Reason:\s*(.*)", content)
    val = answer_match.group(1).strip() if answer_match else None
    reason = reason_match.group(1).strip() if reason_match else content
    return {"val": val, "reason": reason}