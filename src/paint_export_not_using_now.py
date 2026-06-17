from flask import Flask, render_template, request,redirect, url_for, make_response, send_file
from datetime import datetime, timedelta
from export import generate_excel
from boilerExport import generate_boilerExcel
from CEBflareExport import generate_flareExcel
from portable_engine_log import generate_portableExcel
from generator import generate_generatorExcel
import smtplib
import json
from email.message import EmailMessage
from datetime import datetime, timezone
import os
import datetime

from test import load_materials

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "materials.json")
@app.route("/paint", methods=["GET", "POST"])
def index():

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
            else:
                final_name = m

            final_materials.append({
                "name": final_name,
                "quantity": qty,
                "unit": unit
            })
            

        # ✅ Generate Excel
        excel_file = generate_excel(form_data, final_materials)

       
# ✅ Save file temporarily
        file_path = os.path.join(BASE_DIR, "temp.xlsx")
        with open(file_path, "wb") as f:
            f.write(excel_file.getbuffer())

        # ✅ Redirect to success page
        return redirect(url_for("success", download = "paint"))

    return render_template("forms/PaintForm.html")

@app.route("/download")
def download():
    file_path = os.path.join(BASE_DIR, "temp.xlsx")

    return send_file(
        file_path,
        as_attachment=True,
        download_name="Paint_Form.xlsx"
    )
