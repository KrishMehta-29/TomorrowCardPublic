import json
import re
from openai import OpenAI
import requests
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def predict_internship_salary(resume_data):
    experience = resume_data.get("experience", [])
    valid_experience = [
        {"company": job.get("company", ""), "title": job.get("title", "")}
        for job in experience if job.get("company") and job.get("title")
    ]

    if not valid_experience:
        return {"val": None, "reason": "No valid experience entries found in resume."}

    system_prompt = (
        "You are a compensation analyst. Estimate the average **monthly** salary in USD for each internship. "
        "Use current market data and similar roles. Do not return 0 unless it's truly unpaid."
    )

    user_prompt = (
        f"Here is the list of internships:\n{json.dumps(valid_experience, indent=2)}\n\n"
        "Return the salary list using the structured function."
    )

    tools = [{
        "type": "function",
        "function": {
            "name": "return_internship_salaries",
            "description": "Return estimated monthly salaries (USD) for each internship listed",
            "parameters": {
                "type": "object",
                "properties": {
                    "internship_salaries": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "company": {"type": "string"},
                                "title": {"type": "string"},
                                "avg_pay_usd_per_month": {"type": "number"}
                            },
                            "required": ["company", "title", "avg_pay_usd_per_month"]
                        }
                    }
                },
                "required": ["internship_salaries"]
            }
        }
    }]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            tools=tools,
            tool_choice="auto"
        )

        tool_call = response.choices[0].message.tool_calls[0]
        parsed = json.loads(tool_call.function.arguments)
        salaries = parsed["internship_salaries"]

        # 🔁 Fix 0 salaries with direct GPT questions
        fixed_salaries = []
        for s in salaries:
            if s["avg_pay_usd_per_month"] > 0:
                fixed_salaries.append(s)
            else:
                # Try re-asking GPT for just this role
                title = s["title"]
                company = s["company"]
                followup_prompt = (
                    f"What is the average monthly pay in USD for a {title} at {company}?\n"
                    "Just give the number only."
                )
                try:
                    retry = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[{"role": "user", "content": followup_prompt}],
                        temperature=0
                    )
                    gpt_output = retry.choices[0].message.content.strip()
                    salary_guess = int(''.join(c for c in gpt_output if c.isdigit()))
                    s["avg_pay_usd_per_month"] = salary_guess
                except:
                    s["avg_pay_usd_per_month"] = None  # still fallback if GPT fails
                fixed_salaries.append(s)

        return {"val": fixed_salaries, "reason": "Generated with function call + GPT fallback for missing estimates"}

    except Exception as e:
        return {"val": None, "reason": f"Function call failed: {str(e)}"}