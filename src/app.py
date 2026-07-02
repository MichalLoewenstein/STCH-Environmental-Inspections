from flask import Flask, jsonify, render_template, request,redirect, url_for, make_response, send_file
from datetime import datetime, timedelta
from paint_sandblast_export import generate_excel
from boiler_export import generate_boilerExcel
from ceb_flare_export import generate_flareExcel
from portable_engine_export import generate_portableExcel
from portable_engine_export import save_new_engine
from generator_export import generate_generatorExcel
import smtplib
import json
from email.message import EmailMessage
from datetime import datetime, timezone
import os
import datetime
import json

#from test import load_materials

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "materials.json")


# Home route to display the form
@app.route("/")
def QRScreen():
    return render_template("qr_screen.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/paint", methods=["GET", "POST"])
def index():

    
 # Load materials
    json_file = os.path.join("data", "paint_materials.json")
    
    with open(
    os.path.join(app.root_path, "data", "paint_materials.json"),
    "r"
) as f:
        MATERIALS = json.load(f)


        
# Sort alphabetically but keep "Other" last
    MATERIALS = sorted(
        MATERIALS,
        key=lambda x: (x.lower() == "other", x.lower())
    )

    if request.method == "POST":

        form_data = request.form.to_dict()
        materials = request.form.getlist("material[]")
        quantities = request.form.getlist("quantity[]")
        units = request.form.getlist("measure[]")
        other_material = request.form.getlist("other_material[]")

        final_materials = []

        for i in range(len(materials)):
            m = materials[i].strip()
            qty = quantities[i].strip() if i < len(quantities) else ""
            unit = units[i].strip() if i < len(units) else ""
            other = other_material[i].strip() if i < len(other_material) else ""
        
            if m == "Other":
                if not other:
                    raise ValueError(f"Missing material name at row {i+1}")
                final_name = other
            # Add to JSON 
                existing_materials = [x.lower() for x in MATERIALS]
                
                if final_name.lower() not in existing_materials:
                    MATERIALS.append(final_name)
                    

                    
                    # Re-sort before saving
                    MATERIALS = sorted(
                        MATERIALS,
                        key=lambda x: (x.lower() == "other", x.lower())
                    )

                    with open(
                         os.path.join(app.root_path, "data", "paint_materials.json"),
                                  "w"
                                ) as f:
                                    json.dump(MATERIALS, f, indent=4)

            else:
                final_name = m

            final_materials.append({
                "name": final_name,
                "quantity": qty,
                "unit": unit,
                "is_other": m == "Other"
            })
            
        print("✅ Final materials:", final_materials)

        if not form_data:
                raise ValueError("No form data submitted")

        # ✅ Generate Excel
        excel_file = generate_excel(form_data, final_materials)

        # ✅ ✅ SEND EMAIL HERE (before redirect)
        send_email(
            excel_file,
            form_data,
            subject="STCH Maintenance Paint and Sandblasting"
        )

        print("✅ Excel + Email done")

        # ✅ Then redirect ONLY
        return redirect(url_for("success"))

    response = make_response(render_template("forms/paint_sandblast.html", materials=MATERIALS))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'


    return response



from flask import request

@app.route("/success")
def success():
   

    download = request.args.get("download")
    return render_template("success.html", download=download)



import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone

def send_email(excel_file,form_data, subject):

    sender = "devorawork2026@gmail.com"
    password = "pwgbpczelqlwqkqb"

    # =========================
    # ✅ FIRST EMAIL 
    # =========================
    receiver1 = ["T.Shaliyehsabou@shell.com"]

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
    receiver2 = ["T.Shaliyehsabou@shell.com"]

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
    with smtplib.SMTP("smtp.gmail.com", 587,timeout=10) as smtp:
        smtp.starttls()
        smtp.login(sender, password)
        print("✅ Excel created and email sent")
        print("create a reference to the email server and log in successfully")

        smtp.send_message(msg1)  # ✅ first email
        smtp.send_message(msg2)  # ✅ second email

    print("✅ Both emails sent successfully")


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
    

    response = make_response(render_template('forms/boiler.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response

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
    
    response = make_response(render_template('forms/ceb_flare.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response



@app.route("/generator", methods=["GET", "POST"])
def Generator():

    if request.method == "POST":
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_generatorExcel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data, subject= "STCH Maintenance Emergency Generator Run Log")

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    response = make_response(render_template('forms/generator.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response


@app.route("/portableEngine", methods=["GET", "POST"])
def portableEngine():

    if request.method == "POST":

        model_number = request.form.get("modelNumber") or request.form.get("modelNumberOther")
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()
        
        if not form_data:
            raise ValueError("No form data submitted")



#  overwrite the value in form_data
        form_data["modelNumber"] = model_number
        
        form_data.pop("modelNumberOther", None)

    # SAVE ONLY if user used "Other"
        if request.form.get("equipment") == "Other":
            save_new_engine(form_data)

        print("Final model number:", model_number)


        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_portableExcel(form_data)

        # ✅ Send email
        send_email(excel_file, form_data, subject= "STCH Maintenance Portable Engine")

        print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    response = make_response(render_template('forms/portable_engine.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response


@app.route("/api/engines")
def get_engines():
    with open(os.path.join(app.root_path, "data", "portable_engine_inventory.json"), "r") as f:
        data = json.load(f)
    
    data = sorted(
        data,
        key=lambda x: (
            (x.get("equipment") or "").lower(),
            (x.get("manufacturer") or "").lower(),
            (x.get("model_number") or "").lower()
        )
    )
    
    return jsonify(data)

@app.route("/api/equipment")
def get_equipment():
    with open(os.path.join(app.root_path, "data", "portable_engine_inventory.json"), "r") as f:
        data = json.load(f)

    # ✅ Extract unique equipment values
    equipment_set = {e.get("equipment") for e in data if e.get("equipment")}

    equipment_list = sorted(equipment_set, key=str.lower)

    return jsonify(equipment_list)


if __name__ == "__main__":
    app.run(debug=True)
