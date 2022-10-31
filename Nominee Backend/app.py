from flask import Flask
import os
import smtplib
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask.globals import request, session
from dotenv import load_dotenv

app = Flask(__name__)

smtp = smtplib.SMTP("smtp.gmail.com", 587)
load_dotenv()


@app.route("/")
def hello_world():
    return "hi"


# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------
# Sending Verification otp using mail
@app.route("/email_verification", methods=["POST"])
def send_verification_mail():
    try:
        client_mail = request.json["email"]

        # Generate OTP
        otp = random.randint(1000, 9999)
        hostname = (
            os.environ.get("APP_URL")
            + "/verify?otp="
            + str(otp)
            + "&"
            + "email="
            + client_mail
        )
        # Invoking smtp to send mail
        smtp.starttls()
        smtp.login(os.environ.get("APP_MAIL"), os.environ.get("APP_PASSWORD"))

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Dehitas email verification."
        msg["From"] = os.environ.get("APP_MAIL")
        msg["To"] = client_mail

        html = f"""
            Hi User,<br/>
            <p>Please click on the <a href='{hostname}'>link</a> to verify.</p><br/>
            Thank You,<br/>
            Team DEHITAS
        """

        part1 = MIMEText(html, "html")

        msg.attach(part1)

        smtp.sendmail(os.environ.get("APP_MAIL"), client_mail, msg.as_string())
        smtp.close()
        response_body = {"status": 200, "data": "sent"}
        return response_body

    except Exception as e:
        print(e)
        return None
