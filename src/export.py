# excel_export.py

import pandas as pd
import io
from flask import send_file

def generate_excel(form_data):
    df = pd.DataFrame([form_data])

    output = io.BytesIO()
    df.to_excel(output, index=False)
    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="form_data.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )