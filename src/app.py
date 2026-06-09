from flask import Flask, render_template, request,redirect, url_for, make_response
from datetime import datetime, timedelta
from export import generate_excel
from boilerExport import generate_boilerExcel
from CEBflareExport import generate_flareExcel
import smtplib
import json
from email.message import EmailMessage
from datetime import datetime, timezone
import os
import datetime

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "materials.json")

 
# Home route to display the form
@app.route("/")
def QRScreen():
    return render_template("QRscreen.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/boiler", methods=["GET", "POST"])
def Boiler():

    if request.method == "POST":
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_boilerExcel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data, subject= "STCH Maintenance Boiler")

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    response = make_response(render_template('BoilerForm.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

@app.route("/Generator", methods=["GET", "POST"])
def Generator():

    if request.method == "POST":
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_boilerExcel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data, subject= "STCH Maintenance Boiler")

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    response = make_response(render_template('Generator.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response


def load_materials():
    try:
        with open(FILE_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []
    
@app.route("/flare", methods=["GET", "POST"])
def flare():

    if request.method == "POST":
                # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_flareExcel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data, subject= "STCH Maintenance CEB_Flare")

        
        # ✅ Navigate to success page
        return redirect(url_for("success"))
    
    response = make_response(render_template('CEB_Flare.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response


@app.route("/paint", methods=["GET", "POST"])
def index():

    materialslist = load_materials()

    if request.method == "POST":

        form_data = request.form.to_dict()
        materials = request.form.getlist("material[]")
        quantities = request.form.getlist("quantity[]")
        units = request.form.getlist("measure[]")
        other_material = request.form.getlist("other_material[]")

        final_materials = []

        # ✅ Process ALL rows
        for i in range(len(materials)):
            m = materials[i].strip()
            qty = quantities[i].strip() if i < len(quantities) else ""
            unit = units[i].strip() if i < len(units) else ""
            other = other_material[i].strip() if i < len(other_material) else ""

            # ✅ Resolve actual material name
            if m == "Other":
                if not other:
                    raise ValueError(f"❌ Missing material name at row {i+1}")

                final_name = other

                # ✅ Add to JSON if new
                add_material(final_name)

            else:
                final_name = m

            # ✅ Build unified export structure
            final_materials.append({
                "name": final_name,
                "quantity": qty,
                "unit": unit
            })

        print("✅ Final materials for export:", final_materials)

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ ✅ FIX: send final_materials
        excel_file = generate_excel(form_data, final_materials)


        return redirect(url_for("success",excel_file=excel_file,form_data=form_data, subject= "STCH Maintenance Paint and Soundblasting"))


    # ✅ GET request → return response WITH no-cache headers
    response = make_response(render_template("PaintForm.html", materialslist=materialslist))

    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response



def add_material(name):
    name = name.strip()
    if not name:
        return

    # ✅ Load existing materials
    try:
        with open(FILE_PATH, "r") as f:
            materials = json.load(f)
            if not isinstance(materials, list):
                materials = []
    except (FileNotFoundError, json.JSONDecodeError):
        materials = []

    # ✅ Check if already exists (case-insensitive)
    existing_names = [m.strip().lower() for m in materials if isinstance(m, str)]

    if name.lower() in existing_names:
        print(f"Material '{name}' already exists")
        return

    # ✅ Add new material
    #materials.append(name)

    # ✅ Save immediately (THIS is what you wanted)
    #with open(FILE_PATH, "w") as f:
        json.dump(materials, f, indent=4)

    print(f"✅ Added '{name}' to materials.json")


from flask import request

@app.route("/success")
def success():
    excel_file = request.args.get("excel_file")
    subject = request.args.get("subject")
    form_data = request.args.get("form_data")
    print("In success route")
    # 👉 Call your email function here
    send_email(excel_file, form_data, subject= subject)

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

def send_email(excel_file,form_data, subject):

    sender = "devorawork2026@gmail.com"
    password = "pwgbpczelqlwqkqb"

    # =========================
    # ✅ FIRST EMAIL 
    # =========================
    receiver1 = "T.Shaliyehsabou@shell.com"

    msg1 = EmailMessage()
    msg1['Subject'] = subject
    msg1['From'] = sender
    msg1['To'] = receiver1
    msg1.set_content("Attached is the submitted Paint form.")

    
    utc_now = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M-%S")

    excel_file.seek(0)
    msg1.add_attachment(
        excel_file.read(),
        maintype='application',
        subtype='octet-stream',
        filename=f'{subject}_{utc_now}.xlsx'
    )

    # =========================
    # ✅ SECOND EMAIL 
    # =========================
    receiver2 = ["T.Shaliyehsabou@shell.com","Michal.Lowenstein@shell.com"]

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
        print("✅ Excel created and email sent")
        print("create a reference to the email server and log in successfully")

        smtp.send_message(msg1)  # ✅ first email
        smtp.send_message(msg2)  # ✅ second email

    print("✅ Both emails sent successfully")


if __name__ == "__main__":
    app.run(debug=True)
