import pandas as pd
import io

def generate_excel(form_data,materials, quantities, units):

    # ✅ Define consistent column order (important!)
    columns = [
       "Company", "Name", "Email", "Phone", "Location",
        "Date", "Start Time", "End Time",
        "Break", "Total Time"
    ]

    # ✅ Convert incoming form data keys to match column names
    data = {
        "Company": form_data.get("company"),
        "Name": form_data.get("name"),
        "Email": form_data.get("email"),
        "Phone": form_data.get("phone"),
        "Location": form_data.get("location"),
        "Date": form_data.get("date"),
        "Start Time": form_data.get("start_time"),
        "End Time": form_data.get("end_time"),
        "Break": form_data.get("break"),
        "Total Time": form_data.get("total_time")
    }
    max_materials = 5

    for i in range(max_materials):
        name_col = f"Material {i+1} Name"
        qty_col = f"Material {i+1} Quantity"

        columns.append(name_col)
        columns.append(qty_col)

        material = materials[i] if i < len(materials) else ""
        quantity = quantities[i] if i < len(quantities) else ""
        unit = units[i] if i < len(units) else ""

        data[name_col] = material
        data[qty_col] = f"{quantity} {unit}".strip()



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