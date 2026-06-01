from flask import Flask, render_template, request
from datetime import datetime, timedelta
from export import generate_excel
import smtplib
from email.message import EmailMessage


import os
import datetime

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))
 
# Home route to display the form
@app.route("/")
def home():
    return render_template("home.html")


from flask import request, render_template, redirect, url_for

@app.route("/form", methods=["GET", "POST"])
def index():

    if request.method == "POST":

        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        excel_file = generate_excel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data)

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))

    return render_template("PaintForm.html")

@app.route("/success")
def success():
    return render_template("success.html")



@app.route('/export-excel', methods=['POST'])
def export_excel():
    data = request.get_json()
    form_data = data.get('formData', {})

    return generate_excel(form_data)

    

import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone

def send_email(excel_file,form_data):

    sender = "devorawork2026@gmail.com"
    password = "pwgbpczelqlwqkqb"

    # =========================
    # ✅ FIRST EMAIL 
    # =========================
    receiver1 = "ellen.hall@shell.com"

    msg1 = EmailMessage()
    msg1['Subject'] = "New Form Submission"
    msg1['From'] = sender
    msg1['To'] = receiver1
    msg1.set_content("Attached is the submitted form.")

    excel_file.seek(0)
    msg1.add_attachment(
        excel_file.read(),
        maintype='application',
        subtype='octet-stream',
        filename='form_data.xlsx'
    )

    # =========================
    # ✅ SECOND EMAIL 
    # =========================
    receiver2 = "michal.lowenstein@shell.com"

    utc_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    msg2 = EmailMessage()
    msg2['Subject'] = "User Login Details"
    msg2['From'] = sender
    msg2['To'] = receiver2
    name = form_data.get("name")
    email_input = form_data.get("email")
    phone = form_data.get("phone")

    msg2.set_content(f"""
        User logged into STCH Maintenance:

        Name: {name}
        Email: {email_input}
        Phone: {phone}
        Time (UTC): {utc_time}
      """)

    # =========================
    # ✅ SEND BOTH EMAILS (same connection)
    # =========================
    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login(sender, password)

        smtp.send_message(msg1)  # ✅ first email
        smtp.send_message(msg2)  # ✅ second email

    print("✅ Both emails sent successfully")


if __name__ == "__main__":
    app.run(debug=True)
