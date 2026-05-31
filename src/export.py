
def export_excel():
    data = request.get_json()
    form_data = data.get('formData', {})

    # ✅ Convert form into a table (1 row example)
    df = pd.DataFrame([form_data])

    # ✅ Create Excel in memory
    output = io.BytesIO()
    df.to_excel(output, index=False)

    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="form_data.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
