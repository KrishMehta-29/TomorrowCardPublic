from app.services.verification import aggregate_verifications
from app.services.feature_extraction import predict_all_features
from app.services.parse_resume_transcript import parse_resume, parse_transcript, extract_text_from_pdf

def verify_resume_and_transcript(resume_path, transcript_path):
    resume_text = extract_text_from_pdf(resume_path)
    resume_data = parse_resume(resume_text)

    transcript_text = extract_text_from_pdf(transcript_path)
    transcript_data = parse_transcript(transcript_text)

    return aggregate_verifications(resume_data, transcript_data, transcript_path)

def predict_all_features_flow(resume_path):
    resume_text = extract_text_from_pdf(resume_path)
    resume_data = parse_resume(resume_text)

    return predict_all_features(resume_data)



