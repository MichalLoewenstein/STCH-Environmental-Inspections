import pandas as pd
import io

def generate_excel(form_data, materials):

    # ✅ Base columns
    columns = [
       "Activity", "Company", "Name", "Email", "Phone", "Location",
        "Date", "Start Time", "End Time",
        "Break", "Total Time"
    ]

    total_time = form_data.get("total_time")

    if total_time:
        hours, minutes = map(int, total_time.split(":"))
        total_minutes = hours * 60 + minutes
    
    else:
        total_minutes = 0

    print(total_minutes)  



    data = {
        "Activity": form_data.get("activity"),
        "Company": form_data.get("company"),
        "Name": form_data.get("name"),
        "Email": form_data.get("email"),
        "Phone": form_data.get("phone"),
        "Location": form_data.get("location"),
        "Date": form_data.get("date"),
        "Start Time": form_data.get("start_time"),
        "End Time": form_data.get("end_time"),
        "Break": form_data.get("break"),
        "Total Time": total_minutes
    }

    max_materials = 5

    # ✅ ✅ LOOP OVER final_materials (NOT separate lists)
    for i in range(max_materials):

        name_col = f"Material {i+1} Name"
        qty_col = f"Material {i+1} Quantity"
        unit_col = f"Material {i+1} Unit"

        columns.append(name_col)
        columns.append(qty_col)
        columns.append(unit_col)

        if i < len(materials):
            material = materials[i]

            # ✅ Extract values from dictionary
            name = material.get("name", "")
            quantity = material.get("quantity", "")
            unit = material.get("unit", "")

        else:
            name = ""
            quantity = ""
            unit = ""

        # ✅ ✅ Clean output
        data[name_col] = name
        data[qty_col] = quantity
        data[unit_col] = unit

    # ✅ Build dataframe
    df = pd.DataFrame([data], columns=columns)

    output = io.BytesIO()

    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='WorkLog')

        workbook = writer.book
        worksheet = writer.sheets['WorkLog']

        (max_row, max_col) = df.shape

        worksheet.add_table(
            0, 0, max_row, max_col - 1,
            {
                'columns': [{'header': col} for col in df.columns],
                'style': 'Table Style Medium 2'
            }
        )

        worksheet.set_column(0, max_col - 1, 20)

    output.seek(0)

    return output