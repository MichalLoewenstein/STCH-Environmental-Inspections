from flask import Flask, jsonify, render_template, request,redirect, url_for, make_response, send_file
from datetime import datetime, timedelta
from exports.paint_sandblast_export import generate_excel
from exports.boiler_export import generate_boilerExcel
from exports.ceb_flare_export import generate_flareExcel
from exports.portable_engine_export import generate_portableExcel
from exports.generator_export import generate_generatorExcel
from exports.fire_pumps_export import fire_pumpsExcel
from utilities.boiler_utils import load_operator_options, save_new_operator
from utilities.email_utils import send_email
from utilities.operator_utils import load_form_operator_options, save_new_form_operator
from utilities.response_utils import render_with_no_cache
from utilities.materials_utils import add_material, load_materials
from utilities.portable_engine_utils import load_engine_inventory, save_new_engine,save_new_model
from utilities.fire_pumps_utils import load_fire_engine_inventory,save_fire_new_engine,save_fire_new_model
import json
import os
import datetime
import json


app = Flask(__name__,
template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../templates')),  
static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../static')))

# Home route to display the form
@app.route("/")
def QRScreen():
    return render_template("qr_screen.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/paint", methods=["GET", "POST"])
def index():

    # Load the paint materials list once for the page and form handling.
    MATERIALS = load_materials()

    if request.method == "POST":

        form_data = request.form.to_dict()
        materials = request.form.getlist("material[]")
        quantities = request.form.getlist("quantity[]")
        units = request.form.getlist("measure[]")
        other_material = request.form.getlist("other_material[]")

        final_materials = []

        for i in range(len(materials)):
            m = materials[i].strip()
            qty = quantities[i].strip() if i < len(quantities) else ""
            unit = units[i].strip() if i < len(units) else ""
            other = other_material[i].strip() if i < len(other_material) else ""
        
            if m == "Other":
                if not other:
                    raise ValueError(f"Missing material name at row {i+1}")
                final_name = other
                MATERIALS = add_material(final_name, MATERIALS)

            else:
                final_name = m

            final_materials.append({
                "name": final_name,
                "quantity": qty,
                "unit": unit,
                "is_other": m == "Other"
            })
            
        print("✅ Final materials:", final_materials)

        if not form_data:
                raise ValueError("No form data submitted")

        # ✅ Generate Excel
        excel_file = generate_excel(form_data, final_materials)

        # ✅ ✅ SEND EMAIL HERE (before redirect)
        send_email(
            excel_file,
            form_data,
            subject="STCH Environmental Inspections Paint and Sandblasting"
        )

        # print("✅ Excel + Email done")

        # ✅ Then redirect ONLY
        return redirect(url_for("success"))

    return render_with_no_cache("forms/paint_sandblast.html", materials=MATERIALS)


from flask import request

@app.route("/success")
def success():
   
    download = request.args.get("download")
    return render_template("success.html", download=download)


@app.route("/boiler", methods=["GET", "POST"])
def Boiler():

    if request.method == "POST":

        # Convert user inputs into a Python dictionary.
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")


        # -----------------------------------------
        # HANDLE OPERATOR
        # -----------------------------------------

        # Get the selected operator.
        operator = form_data.get("operator")

        # Get the value entered when "Other" is selected.
        other_operator = form_data.get(
            "other_operator",
            ""
        ).strip()


        # If the user selected "Other" and entered a new operator,
        # save it to the Boiler operator JSON file.
        if operator == "Other" and other_operator:

            save_new_form_operator(
                "boiler",
                form_data
            )

            print(
                "New Boiler operator saved:",
                other_operator
            )

            # Use the new operator as the actual operator.
            # This is the value that will be sent to Excel.
            form_data["operator"] = other_operator


        # Remove the helper field before generating the Excel file.
        form_data.pop("other_operator", None)


        # -----------------------------------------
        # GENERATE EXCEL
        # -----------------------------------------

        print(
            "Generating Excel with form data:",
            form_data
        )

        excel_file = generate_boilerExcel(form_data)


        # -----------------------------------------
        # SEND EMAIL
        # -----------------------------------------

        send_email(
            excel_file,
            form_data,
            subject="STCH Environmental Inspections Boiler"
        )


        # -----------------------------------------
        # NAVIGATE TO SUCCESS PAGE
        # -----------------------------------------

        return redirect(url_for("success"))


    return render_with_no_cache("forms/boiler.html")

    

@app.route("/flare", methods=["GET", "POST"])
def flare():

    if request.method == "POST":
                # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        operator = form_data.get("operator")
        other_operator = form_data.get("other_operator", "").strip()

        if operator == "Other" and other_operator:
            save_new_form_operator("ceb_flare", form_data)

            # Use the new operator as the actual operator
            form_data["operator"] = other_operator

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_flareExcel(form_data)

        # # ✅ Send email
        send_email(
            excel_file, 
            form_data, 
            subject= "STCH Environmental Inspections CEB_Flare"
            )

        
        # ✅ Navigate to success page
        return redirect(url_for("success"))
    
    return render_with_no_cache("forms/ceb_flare.html")



@app.route("/generator", methods=["GET", "POST"])
def Generator():

    if request.method == "POST":
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()

        if not form_data:
            raise ValueError("No form data submitted")

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_generatorExcel(form_data)

        # # ✅ Send email
        send_email(
            excel_file, 
            form_data, 
            subject= "STCH Environmental Inspections Emergency Generator Run Log"
            )

        # print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    return render_with_no_cache("forms/generator.html")


@app.route("/portable_engine", methods=["GET", "POST"])
def portableEngine():

    if request.method == "POST":

        model_choice=request.form.get("modelNumber")
        model_number=request.form.get("modelNumberOther")
        #equipment_choice=request.form.get("equipment")
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()
        
        if not form_data:
            raise ValueError("No form data submitted")

        # ---------------------------------------------------------
        # HANDLE OPERATOR
        # ---------------------------------------------------------

        # Get the value selected from the Operator dropdown.
        operator_choice = request.form.get("operator")

        other_operator = request.form.get(
            "other_operator",
            ""
        ).strip()


        # Only save a new operator when:
        # 1.The user selected "Other"
        # 2.The user entered a value in the Other Operator field
        
        if operator_choice == "Other" and other_operator:

            # Save the new operator into the JSON file belonging
            
            save_new_form_operator(
                "portable_engine",
                form_data
            )

            print("✅ New Portable Engine operator saved:", other_operator)

            # Replace "Other" with the actual operator 
        
            form_data["operator"] = other_operator

        else:

            # If the user selected an existing operator,
            # keep the selected operator as-is.
            form_data["operator"] = operator_choice


        # Remove the helper field because we only need the final
        # operator value in form_data.
        form_data.pop("other_operator", None)


#  overwrite the value in form_data
        form_data["modelNumber"] = model_number
        
        form_data.pop("modelNumberOther", None)

    # Save the custom engine entry only when the user selected "Other".
        if request.form.get("equipment") == "Other":
            save_new_engine(form_data)
            print("Final model number:", model_number)
        elif model_choice== "OTHER":
            save_new_model(form_data)
            print("Final model number:", model_number)

        
        is_other_model = (model_choice=="OTHER") 
        if is_other_model:
            form_data["modelNumber"]="Other"
            form_data["modelNumberOther"]=model_number
        else :
            form_data["modelNumberOther"]=""
        

        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = generate_portableExcel(form_data)

        # # ✅ Send email
        send_email(
            excel_file, 
            form_data, 
            subject= "STCH Environmental Inspections Portable Engine"
            )

        # print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    return render_with_no_cache("forms/portable_engine.html")

@app.route("/fire_pumps", methods=["GET", "POST"])
def firePumps():

    if request.method == "POST":

        #equipment_choice=request.form.get("equipment")
        # converts user inputs into python dictionary
        form_data = request.form.to_dict()
        
        if not form_data:
            raise ValueError("No form data submitted")


        # ✅ Generate Excel
        print("Generating Excel with form data:", form_data)
        excel_file = fire_pumpsExcel(form_data)

        # # ✅ Send email
        send_email(
            excel_file, 
            form_data, 
            subject= "STCH Environmental Inspections Fire Pumps"
            )

        # print("✅ Excel created and email sent")

        # ✅ Navigate to success page
        return redirect(url_for("success"))
    

    return render_with_no_cache("forms/fire_pumps.html")


@app.route("/api/engines")
def get_engines():
    # Read the portable engine inventory once and return it sorted for the dropdown.
    data = load_engine_inventory()
    
    data = sorted(
        data,
        key=lambda x: (
            (x.get("equipment") or "").lower(),
            (x.get("manufacturer") or "").lower(),
            (x.get("model_number") or "").lower()
        )
    )
    
    return jsonify(data)

@app.route("/api/fireEngines")
def get_fireEngines():
    # Read the portable engine inventory once and return it sorted for the dropdown.
    data = load_fire_engine_inventory()
    
    data = sorted(
        data,
        key=lambda x: (
            (x.get("equipment") or "").lower(),
            (x.get("manufacturer") or "").lower(),
            (x.get("model_number") or "").lower()
        )
    )
    
    return jsonify(data)

@app.route("/api/fireEquipment")
def get_FireEquipment():
    # Build a unique list of equipment names for the form dropdown.
    data = load_fire_engine_inventory()

    # ✅ Extract unique equipment values
    equipment_set = {e.get("equipment") for e in data if e.get("equipment")}

    equipment_list = sorted(equipment_set, key=str.lower)

    return jsonify(equipment_list)



@app.route("/api/equipment")
def get_equipment():
    # Build a unique list of equipment names for the form dropdown.
    data = load_engine_inventory()

    # ✅ Extract unique equipment values
    equipment_set = {e.get("equipment") for e in data if e.get("equipment")}

    equipment_list = sorted(equipment_set, key=str.lower)

    return jsonify(equipment_list)


@app.route("/api/operators")
def get_operators():
    # Build a unique list of operator names for the form dropdown.
    data = load_operator_options()

    # ✅ Extract unique operator values
    operators = {e.get("operator") for e in data if e.get("operator")}

    operators_list = sorted(operators, key=str.lower)
    print("✅ Operators list:", operators_list)

    return jsonify(operators_list)


# ---------------------------------------------------------------------------
# NEW CENTRAL OPERATOR API
# ---------------------------------------------------------------------------
# This API supports multiple forms.

#
@app.route("/api/operators/<form_name>")
def get_operators_by_form(form_name):
    """
    Return the operator list for the requested form.

    Example:
        /api/operators/portable_engine
    """

    try:
        # Load the operator options from the JSON file
        # assigned to the requested form.
        data = load_form_operator_options(form_name)

        # Extract valid operator names.
        #
        # A set removes duplicate values automatically.
        # Empty operator values are ignored.
        operators = {
            entry.get("operator").strip()
            for entry in data
            if entry.get("operator")
            and entry.get("operator").strip()
        }

        # Convert the set to a list and sort it alphabetically.
        # str.lower makes the sorting case-insensitive.
        operators_list = sorted(
            operators,
            key=str.lower
        )

        print(
            f"✅ Operators for {form_name}:",
            operators_list
        )

        # Return the operator list to JavaScript.
        return jsonify(operators_list)

    except Exception as error:
        # Print the full error in the Flask console.
        print(
            f"❌ Error loading operators for {form_name}:",
            error
        )

        # Return an error response to JavaScript.
        return jsonify({
            "error": str(error)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
