from flask import Flask, render_template, request,redirect, url_for
from datetime import datetime, timedelta
from export import generate_excel
import smtplib
import json
from email.message import EmailMessage


import os
import datetime

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "materials.json")

 
# Home route to display the form
@app.route("/")
def home():
    return render_template("home.html")



def load_materials():
    try:
        with open(FILE_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


@app.route("/form", methods=["GET", "POST"])
def index():
    materialslist = load_materials()
    if request.method == "POST":

        form_data = request.form.to_dict()
        materials = request.form.getlist("material[]")
        quantities = request.form.getlist("quantity[]")
        units = request.form.getlist("measure[]")

        

        print("Materials received in form_data:", materials)  # Debugging line

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)  # Debugging line
        excel_file = generate_excel(form_data,materials, quantities, units)

        # ✅ Send email
        send_email(excel_file, form_data)

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))

    return render_template("PaintForm.html", materialslist =materialslist )

@app.route("/success")
def success():
    return render_template("success.html")



@app.route('/export-excel', methods=['POST'])
def export_excel():
    data = request.get_json()
    form_data = data.get('formData', {})
    print ("Received form data in /export-excel route:", form_data)  # Debugging line
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
    receiver1 = "T.Shaliyehsabou@shell.com"

    msg1 = EmailMessage()
    msg1['Subject'] = "STCH Maintenance"
    msg1['From'] = sender
    msg1['To'] = receiver1
    msg1.set_content("Attached is the submitted Paint form.")

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
    receiver2 = "T.Shaliyehsabou@shell.com"

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
