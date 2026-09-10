import pandas as pd
import io
from flask import Flask, request
 
def fire_pumpsExcel(form_data):
 
    print(form_data)
    # ✅ Define consistent column order (important!)
   
    columns = [
        "Operator","Contractor","Equipment","Location","Purpose","Arrival Date","In Service Date","Initial Meter Read","Start Time","Stop Time","Run Duration","Departure Date","Final Meter Read",
        "Total Hours","Visual Emissions","Mfr","Model Number","Serial Number","Horsepower","Fuel","On-Site Status","Comments",
    ]

    purpose = form_data.get("purpose")
    if purpose == "Other":
        purpose = form_data.get("other_purpose") or "Other"

    run_duration = form_data.get("run_duration")
    if run_duration:
             hours, minutes = map(int, run_duration.split(":"))
             total_run = hours + (minutes / 60)
    else:
             total_run = 0

    vendor = form_data.get("vendor")
        
    if vendor == "Other":
        vendor = form_data.get("other_vendor") or "Other"          
     
    # ✅ Convert incoming form data keys to match column names
    data = {
        "Operator": form_data.get("operator"),
        "Contractor":vendor,
        "Equipment": form_data.get("equipment"),
        "Location": form_data.get("location"),
        "Purpose": purpose,
        "Arrival Date": form_data.get("arrivalDate"),
        "In Service Date": form_data.get("date"),
        "Initial Meter Read": form_data.get("initialMeterRead"),
        "Start Time":form_data.get("start_time"),
        "Stop Time":form_data.get("stop_time"),
        "Run Duration":total_run,
        "Departure Date": form_data.get("departureDate"),
        "Final Meter Read": form_data.get("finalMeterRead"),
        "Total Hours": float(form_data.get("total_hours") or 0),
        "Visual Emissions":form_data.get("visual_emissions"),
        "Mfr": form_data.get("mfr"),
        "Model Number": form_data.get("model_number"),
        "Serial Number": form_data.get("serial_number"),
        "Horsepower": form_data.get("horsepower"),
        "Fuel": form_data.get("fuel"),
        "On-Site Status": form_data.get("onsiteStatus"),
        "Comments": form_data.get("comments")  
 
    }
   
    print("Export form data portabke engine:",data)
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
