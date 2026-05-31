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
@app.route("/", methods=["GET", "POST"])


@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "POST":

        # ✅ Get all form data automatically
        form_data = request.form.to_dict()

        # Optional: basic validation
        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel from ALL fields
        excel_file = generate_excel(form_data)

        # ✅ Send email with Excel
        send_email(excel_file)

        print("✅ Excel created and email sent")

    return render_template("PaintForm.html")



@app.route('/export-excel', methods=['POST'])
def export_excel():
    data = request.get_json()
    form_data = data.get('formData', {})

    return generate_excel(form_data)

    

def send_email(excel_file):

    sender = "devorawork2026@gmail.com"
    password = "pwgbpczelqlwqkqb"
    receiver = "devolib@gmail.com"

    msg = EmailMessage()
    msg['Subject'] = "New Form Submission"
    msg['From'] = sender
    msg['To'] = receiver
    msg.set_content("Attached is the submitted form.")

    # ✅ Attach Excel from memory
    msg.add_attachment(excel_file.read(),
                       maintype='application',
                       subtype='octet-stream',
                       filename='form_data.xlsx')

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login(sender, password)
        smtp.send_message(msg)

    print("✅ Email sent successfully")

if __name__ == "__main__":
    app.run(debug=True)
