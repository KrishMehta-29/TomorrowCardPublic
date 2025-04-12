import json
import re
from openai import OpenAI
from dotenv import load_dotenv
from app.services.feature_extractors.average_income_for_college import average_income_for_college
from app.services.feature_extractors.average_income_for_major import average_income_for_major
from app.services.feature_extractors.predict_career_path import predict_career_path
from app.services.feature_extractors.predict_intership_salary import predict_internship_salary

load_dotenv()
client = OpenAI()


def predict_all_features(resume_data):
    predictions = {}
    predictions["average_income_for_major"] = average_income_for_major(resume_data)
    predictions["average_income_for_college"] = average_income_for_college(resume_data)
    predictions["predict_internship_salary"] = predict_internship_salary(resume_data)
    predictions["predict_career_path"] = predict_career_path(resume_data)
    return predictions
    


    