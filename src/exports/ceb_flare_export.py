import pandas as pd
import io

def generate_flareExcel(form_data):


    print(form_data)
    # ✅ Define consistent column order (important!)s
    columns = [
       "Date", "Inspection Time", "Operator", 
        "SP-1 (Inches)", "SP-2 (Inches)", "KP-1 (Inches)", "Pilot Gas Pressure (PSIG)",
        "Supplemental NG Flow (SCFM)", "Main flame visible?", "Pilot flame visible?", 
        "Waste Gas Flow (SCFM)", "Waste Gas Temperature(Faranheit)", "CEB (On,Off)",
        "Supplemental NG Flow (SCFM) 2", "Stack Temperature(Faranheit)", "Is maintenance complete?" , 
        "Flare Visible Emissions?", "CEB Visible Emissions?", "Comments"
    ]

    # ✅ Convert incoming form data keys to match column names
    data = {
        "Date": form_data.get("date"),
        "Inspection Time": form_data.get("time"),
        "Operator": form_data.get("operator"),
        "SP-1 (Inches)": form_data.get("sp1"),
        "SP-2 (Inches)": form_data.get("sp2"),
        "KP-1 (Inches)": form_data.get("kp1"),
        "Pilot Gas Pressure (PSIG)": form_data.get("pilot_gas_pressure"),
        "Supplemental NG Flow (SCFM)": form_data.get("supplemental_ng_flow1"), 
        "Main flame visible?": form_data.get("main_flame_visible"), 
        "Pilot flame visible?": form_data.get("pilot_flame_visible"), 
        "Waste Gas Flow (SCFM)": form_data.get("waste_gas_flow"), 
        "Waste Gas Temperature(Faranheit)": form_data.get("waste_gas_temp"),  
        "CEB (On,Off)": form_data.get("CEBchoice"), 
        "Supplemental NG Flow (SCFM) 2": form_data.get("supplemental_ng_flow2"), 
        "Stack Temperature(Faranheit)": form_data.get("stacktemperature"),  
        "Is maintenance complete?" : form_data.get("maintaincomplete"), 
        "Flare Visible Emissions?": form_data.get("flarevisemission"), 
        "CEB Visible Emissions?": form_data.get("CEBvisemission"),  
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