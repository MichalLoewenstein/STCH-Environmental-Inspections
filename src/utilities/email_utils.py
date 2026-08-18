import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage


def send_email(excel_file, form_data, subject):
    sender = "devorawork2026@gmail.com"
    password = "pwgbpczelqlwqkqb"

    receiver1 = ["dvora.libersohn@shell.com"]

    msg1 = EmailMessage()
    msg1["Subject"] = subject
    msg1["From"] = sender
    msg1["To"] = receiver1
    msg1.set_content("Attached is the submitted form.")

    utc_now = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M-%S")

    excel_file.seek(0)
    msg1.add_attachment(
        excel_file.read(),
        maintype="application",
        subtype="octet-stream",
        filename=f"{subject}_{utc_now}.xlsx",
    )

    receiver2 = ["dvora.libersohn@shell.com"]
    utc_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    msg2 = EmailMessage()
    msg2["Subject"] = "User Login Details"
    msg2["From"] = sender
    msg2["To"] = receiver2
    name = form_data.get("name")
    email_input = form_data.get("email")
    phone = form_data.get("phone")

    msg2.set_content(
        f"""
        User logged into STCH Environmental Inspections:

        Name: {name}
        Email: {email_input}
        Phone: {phone}
        Time (UTC): {utc_time}
        """
    )

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as smtp:
        smtp.starttls()
        smtp.login(sender, password)
        smtp.send_message(msg1)
        smtp.send_message(msg2)
