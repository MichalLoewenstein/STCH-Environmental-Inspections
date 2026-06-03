import pandas as pd
import io

def generate_boilerExcel(form_data):

    # ✅ Define consistent column order (important!)
    columns = [
       "Operator 1", "Operator 2", "Operator 3", "Operator 4", "Email", "Phone", 
        "Date", "Boiler Number", "Water Level 1",
        "Water Level 2", "Water Level 3", "Water Level 4"
    ]

    # ✅ Convert incoming form data keys to match column names
    data = {
        "Operator 1": form_data.get("operator1"),
        "Operator 2": form_data.get("operator2"),
        "Operator 3": form_data.get("operator3"),
        "Operator 4": form_data.get("operator4"),
        "Email": form_data.get("email"),
        "Phone": form_data.get("phone"),
        "Date": form_data.get("date"),
        "Boiler Number": form_data.get("boilerNumber"),
        "Water Level 1": form_data.get("check_water_level"),
        "Water Level 2": form_data.get("waterlevel2"),
        "Water Level 3": form_data.get("waterlevel3"),
        "Water Level 4": form_data.get("waterlevel4")

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