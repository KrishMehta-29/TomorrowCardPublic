import json
import re
from openai import OpenAI
import requests
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

# 🔧 Your original tool schema
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

def predict_internship_salary(resume_data):
    experience = resume_data.get("experience", [])
    valid_experience = [
        {"company": job.get("company", ""), "title": job.get("title", "")}
        for job in experience if job.get("company") and job.get("title")
    ]

    if not valid_experience:
        return {"val": None, "reason": "No valid experience entries found in resume."}

    # ✅ Step 1: Get estimates from web
    system_prompt_1 = (
        "You are a compensation analyst. Estimate the average **monthly** salary in USD for each internship. "
        "Use current market data and similar roles. You can search the web. "
        "Do not return 0 unless it's truly unpaid."
    )
    user_prompt_1 = (
        f"Here is the list of internships:\n{json.dumps(valid_experience, indent=2)}\n\n"
        "Return your estimates as a list like this:\n"
        '[{"company": "CompanyName", "title": "Intern Title", "avg_pay_usd_per_month": 5000}, ...]'
    )

    try:
        search_response = client.chat.completions.create(
            model="gpt-4o-mini-search-preview",
            messages=[
                {"role": "system", "content": system_prompt_1},
                {"role": "user", "content": user_prompt_1}
            ],
            web_search_options={}  # ✅ Enables search
        )

        raw_salary_output = search_response.choices[0].message.content.strip()
        print(raw_salary_output)

        # ✅ Step 2: Reformat output using tools + gpt-4o
        system_prompt_2 = "You are a data parser. Convert this into structured data using the provided function."
        user_prompt_2 = f"Please format the following data into the correct schema:\n{raw_salary_output}"

        structure_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt_2},
                {"role": "user", "content": user_prompt_2}
            ],
            tools=tools,
            tool_choice="auto"
        )

        tool_call = structure_response.choices[0].message.tool_calls[0]
        parsed = json.loads(tool_call.function.arguments)
        return {"val": parsed["internship_salaries"], "reason": "Used web + structured function call"}

    except Exception as e:
        return {"val": None, "reason": f"Failed during salary estimation: {str(e)}"}
