import pandas as pd
import io

def generate_boilerExcel(form_data):


    print(form_data)
    # ✅ Define consistent column order (important!)
    columns = [
       "Operator", "Email", "Phone", 
        "Boiler Number", "Date", "Time", "Water Level",
        "Blow Down Water Column", "Blow Down Sight Glass", "Blow Down Low Water Cut Out", 
        "Bottom Blow Boiler", "Checked Burner Ring For Proper Flame Pattern", "Checked Excess Oxygen For Proper Level",
        "Checked For Excess Combustibles", "Visually Checked Entire Boiler", "Visible Emissions" , 
        "Time Smoke First Observed", "Time Smoke Cleared", "Comments"
    ]

    # ✅ Convert incoming form data keys to match column names
    data = {
        "Operator": form_data.get("operator"),
        "Email": form_data.get("email"),
        "Phone": form_data.get("phone"),
        "Boiler Number": form_data.get("boilerNumber"),
        "Date": form_data.get("date"),
        "Time": form_data.get("time"),
        "Water Level": form_data.get("check_water_level"),
        "Blow Down Water Column": form_data.get("blowDownWaterColumn"), 
        "Blow Down Sight Glass": form_data.get("blowDownSightGlass"), 
        "Blow Down Low Water Cut Out": form_data.get("blowDownLowWaterCutOut"), 
        "Bottom Blow Boiler": form_data.get("bottomBlowBoiler"), 
        "Checked Burner Ring For Proper Flame Pattern": form_data.get("checkedBurnerRingForProperFlamePattern"),  
        "Checked Excess Oxygen For Proper Level": form_data.get("checkedExcessOxygenForProperLevel"), 
        "Checked For Excess Combustibles": form_data.get("checkedForExcessCombustibles"), 
        "Visually Checked Entire Boiler": form_data.get("visuallyCheckedEntireBoiler"),  
        "Visible Emissions" : form_data.get("emissions"), 
        "Time Smoke First Observed": form_data.get("timeSmokeFirstObserved"), 
        "Time Smoke Cleared": form_data.get("timeSmokeCleared"),  
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