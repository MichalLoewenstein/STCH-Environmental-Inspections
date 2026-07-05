from flask import Flask, jsonify, render_template, request,redirect, url_for, make_response, send_file
from datetime import datetime, timedelta
from paint_sandblast_export import generate_excel
from boiler_export import generate_boilerExcel
from ceb_flare_export import generate_flareExcel
from portable_engine_export import generate_portableExcel
from portable_engine_export import save_new_engine
from generator_export import generate_generatorExcel
from email_utils import send_email
from response_utils import render_with_no_cache
from materials_utils import add_material, load_materials
from portable_engine_utils import load_engine_inventory, save_new_engine
import json
import os
import datetime
import json


app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

# Home route to display the form
@app.route("/")
def QRScreen():
    return render_template("qr_screen.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/paint", methods=["GET", "POST"])
def index():

    # Load the paint materials list once for the page and form handling.
    MATERIALS = load_materials()

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
                MATERIALS = add_material(final_name, MATERIALS)

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

    return render_with_no_cache("forms/paint_sandblast.html", materials=MATERIALS)



from flask import request

@app.route("/success")
def success():
   
    download = request.args.get("download")
    return render_template("success.html", download=download)


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
    

    return render_with_no_cache("forms/boiler.html")

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
    
    return render_with_no_cache("forms/ceb_flare.html")



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
    

    return render_with_no_cache("forms/generator.html")


@app.route("/portable_engine", methods=["GET", "POST"])
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

    # Save the custom engine entry only when the user selected "Other".
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
    

    return render_with_no_cache("forms/portable_engine.html")


@app.route("/api/engines")
def get_engines():
    # Read the portable engine inventory once and return it sorted for the dropdown.
    data = load_engine_inventory()
    
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
    # Build a unique list of equipment names for the form dropdown.
    data = load_engine_inventory()

    # ✅ Extract unique equipment values
    equipment_set = {e.get("equipment") for e in data if e.get("equipment")}

    equipment_list = sorted(equipment_set, key=str.lower)

    return jsonify(equipment_list)


if __name__ == "__main__":
    app.run(debug=True)
