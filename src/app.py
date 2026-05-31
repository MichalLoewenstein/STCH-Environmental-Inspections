from flask import Flask, render_template, request
from datetime import datetime, timedelta

import os
import datetime

app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))
 
# Home route to display the form
@app.route("/", methods=["GET", "POST"])


def index():
    total_time = None
    error = None

    if request.method == "POST":
            # Get form data
            name = request.form.get("name", "").strip()
            email = request.form.get("email", "").strip()
            phone = request.form.get("phone", "").strip()

            # Basic validation
            if not name or not email or not phone:
                raise ValueError("Please fill in all required fields.")


    return render_template("PaintForm.html")


if __name__ == "__main__":
    app.run(debug=True)
