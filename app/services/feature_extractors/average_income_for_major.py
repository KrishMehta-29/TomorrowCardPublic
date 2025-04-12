import json
import re
from openai import OpenAI
import requests
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def average_income_for_major(resume_data):
    major = resume_data.get("major", "an unspecified major")
    prompt = (
        f"What is the average annual salary 5 years after graduation for someone who majored in {major}? These are their previous employments: {', '.join([f'{experience.get("title")}@{experience.get("company")}' for experience in resume_data.get('experience', [])])}\n"
        f"Respond in the following format:\nAnswer: <amount in USD>\nReason: <brief explanation>"
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