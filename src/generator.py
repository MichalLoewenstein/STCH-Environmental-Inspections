import pandas as pd
import io

def generate_generatorExcel(form_data):


    print(form_data)
    # ✅ Define consistent column order (important!)
    columns = [
       "Inspector Name", "Vendor", "Generator", "Date", "Start Time", "Stop Time", "Run Duration","Starting Hours","Clock Run Hours","Run Reason" ,"Visible Emissions","Comment Visible Emissions","Comments"
    ]

    vendor = form_data.get("vendor")

    if vendor == "Other":
        vendor = form_data.get("other_vendor")

    run_reason = form_data.get("run_reason")

    if run_reason == "Other":
        run_reason = form_data.get("other_run_reason")

    # ✅ Convert incoming form data keys to match column names
    data = {
        "Inspector Name": form_data.get("inspector"),
        "Vendor": vendor,
        "Generator": form_data.get("generator"),
        "Date": form_data.get("date"),
        "Start Time": form_data.get("start_time"),
        "Stop Time": form_data.get("stop_time"),
        "Run Duration": form_data.get("run_duration"),
        "Starting Hours": form_data.get("starting_hours"),
        "Clock Run Hours": form_data.get("clock_run_hours"),
        "Run Reason": run_reason,
        "Visible Emissions": form_data.get("emissions"),
        "Comment Visible Emissions": form_data.get("visibleEmissionComment"),
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