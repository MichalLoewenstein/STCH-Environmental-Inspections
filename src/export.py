import pandas as pd
import io

def generate_excel(form_data):
    df = pd.DataFrame([form_data])

    output = io.BytesIO()
    df.to_excel(output, index=False)
    output.seek(0)

    return output   # ✅ return memory file for email