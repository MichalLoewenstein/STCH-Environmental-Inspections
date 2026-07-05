import pandas as pd
import io
from flask import Flask, request

def generate_portableExcel(form_data):


    print(form_data)
    # ✅ Define consistent column order (important!)
    columns = [
       "Operator", "Equipment", "Other Equipment", "Location", "Purpose", "Arrival Date", "In Service Date", "Initial Meter Read", "Departure Date","Final Meter Read","Total Hours",
       "Horsepower" ,"Manufacturer","Model Number", "Serial Number", "Manufacture Date", "Tier", "Fuel", "On-Site Status",  "Comments"
    ]

    equipment = form_data.get("equipment")

    if equipment == "Other":
        equipment = form_data.get("other_equipment") or "Other"

    purpose = form_data.get("purpose")

    if purpose == "Other":
        purpose = form_data.get("other_purpose") or "Other"


    # ✅ Convert incoming form data keys to match column names
    data = {
        "Operator": form_data.get("operator"),
        "Equipment": equipment,
        "Other Equipment": form_data.get("other_equipment"),
        "Location": form_data.get("location"),
        "Purpose": purpose,
        "Arrival Date": form_data.get("arrivalDate"),
        "In Service Date": form_data.get("inServiceDate"),
        "Initial Meter Read": form_data.get("initialMeterRead"),
        "Departure Date": form_data.get("departureDate"),
        "Final Meter Read": form_data.get("finalMeterRead"),
        "Total Hours": float(request.form.get("totalHours") or 0),
        "Horsepower": form_data.get("horsepower"),
        "Manufacturer": form_data.get("manufacturer"),
        "Model Number": form_data.get("modelNumber"),
        "Serial Number": form_data.get("serialNumber"),
        "Manufacture Date": form_data.get("manufactureDate"),
        "Tier": form_data.get("tier"),
        "Fuel": form_data.get("fuel"),
        "On-Site Status": form_data.get("onsiteStatus"),
        "Comments": form_data.get("comments")  

    }
   

# columns inferred automatically
    df = pd.DataFrame([data], columns=columns)

    output = io.BytesIO()

    # ✅ Use Excel writer with xlsxwriter (supports tables)
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='WorkLog')

        workbook = writer.book
        worksheet = writer.sheets['WorkLog']

        # ✅ Add Excel Table (THIS is the key for Power Automate)
        (max_row, max_col) = df.shape

        worksheet.add_table(
            0, 0, max_row, max_col - 1,
            {
                'columns': [{'header': col} for col in df.columns],
                'style': 'Table Style Medium 2'
            }
        )

        # ✅ Optional column width (nice UX)
        worksheet.set_column(0, max_col - 1, 20)

    output.seek(0)

    return output



import json
import os

def save_new_engine(form_data):
    file_path = "data/portable_engine_inventory.json"

    # ✅ Load existing data
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            engines = json.load(f)
    else:
        engines = []

    # ✅ Create new engine object
    new_engine = {
        "equipment": form_data.get("other_equipment"),
        "manufacturer": form_data.get("manufacturer"),
        "model_number": form_data.get("modelNumber"),
        "serial_number": form_data.get("serialNumber"),
        "manufacture_date": form_data.get("manufactureDate"),
        "horsepower": form_data.get("horsepower"),
        "tier": form_data.get("tier"),
        "fuel": form_data.get("fuel")
    }

    # ✅ Prevent duplicates (important)
    exists = any(
        e["model_number"] == new_engine["model_number"] and
        e["serial_number"] == new_engine["serial_number"]
        for e in engines
    )

    if not exists:
        engines.append(new_engine)

        # ✅ Save back to file
        with open(file_path, "w") as f:
            json.dump(engines, f, indent=4)

        print("✅ New engine saved")
    else:
        print("⚠️ Engine already exists")