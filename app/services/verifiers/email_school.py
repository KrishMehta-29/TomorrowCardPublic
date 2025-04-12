from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import smtplib
import json
import os
os.makedirs("verifications", exist_ok=True)

def email_school_for_transcript(student_name, school, transcript_path):
    registrar_email = "fake.regis123@gmail.com"
    sender_email = "ritiagarwal2002@gmail.com"
    app_password = os.getenv("GMAIL_APP_PASSWORD")  

    subject = "Transcript Verification Request"
    body = f"Hello,\n\nPlease confirm if {student_name} has attended {school} and if the attached transcript is valid.\n\nThanks,\nTomorrowCard Team"

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = registrar_email

    msg.attach(MIMEText(body, "plain"))

    with open(transcript_path, "rb") as f:
        part = MIMEApplication(f.read(), Name=os.path.basename(transcript_path))
        part['Content-Disposition'] = f'attachment; filename=\"{os.path.basename(transcript_path)}\"'
        msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
        result = {"val": "Transcript Email Sent Successfully to Registrar", "reason": None}
    except Exception as e:
        result = {"val": "Failed to Send Transcript Email to Registrar", "reason": str(e)}

    with open("verifications/transcript_email_check.json", "w") as f:
        json.dump(result, f)

    return result