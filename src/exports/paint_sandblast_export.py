import pandas as pd
import io

def generate_excel(form_data, materials):

    # ✅ Base columns
    columns = [
       "Company", "Name", "Activity", "Task", "Location",
        "Date", "Start Time", "End Time",
        "Break", "Total Time"
    ]


    company = form_data.get("company")

    if company == "Other":
        company = form_data.get("other_company") or "Other"

    total_time = form_data.get("total_time")

    if total_time:
        hours, minutes = map(int, total_time.split(":"))
        total_minutes = hours + (minutes / 60)
    
    else:
        total_minutes = 0


#  round to 2 decimal places
    total_minutes = round(total_minutes, 2)
    print(total_minutes)  


    data = {
        "Company": company,
        "Name": form_data.get("name"),
        "Activity": form_data.get("activity"),
        "Task": form_data.get("task"),
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
        other_col = f"Material {i+1} Other"
        
        columns.append(name_col)
        columns.append(qty_col)
        columns.append(unit_col)
        columns.append(other_col)

        if i < len(materials):
            material = materials[i]

            # ✅ Extract values from dictionary
            name = material.get("name", "")
            quantity = material.get("quantity", "")
            unit = material.get("unit", "")
            is_other = "Yes" if material.get("is_other") else "No"

        else:
            name = ""
            quantity = ""
            unit = ""
            is_other = ""

        # ✅ ✅ Clean output
        data[name_col] = name
        data[qty_col] = quantity
        data[unit_col] = unit
        data[other_col] = is_other

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