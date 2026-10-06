import json
import os


# Folder containing the operator JSON files.
DATA_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data"
)


# Connect each form name to its own operator JSON file.
OPERATOR_FILES = {
    "portable_engine": "operator_portable.json",
    "boiler": "operator_boiler.json",
    "ceb_flare": "operator_ceb_flare.json"

    # Add the other forms later:
    # "fire_pump": "operator_fire_pump.json",
    # 
    # "emergency_generator": "operator_emergency_generator.json",
}


def get_form_operator_file(form_name):
    """
    Return the complete JSON file path for the requested form.
    """

    filename = OPERATOR_FILES.get(form_name)

    if not filename:
        raise ValueError(
            f"Unknown operator form name: {form_name}"
        )

    return os.path.join(DATA_FOLDER, filename)


def load_form_operator_options(form_name):
    """
    Load the operator options for the requested form.
    """

    data_file = get_form_operator_file(form_name)

    # Temporary debugging information.
    # This confirms which file Python is trying to read.
    print("Operator JSON path:", os.path.abspath(data_file))
    print("Operator JSON exists:", os.path.exists(data_file))

    # If the JSON file does not exist, return an empty list.
    # This allows the dropdown to still show the "Other" option.
    if not os.path.exists(data_file):
        print("Operator JSON file was not found:", data_file)
        return []

    with open(data_file, "r", encoding="utf-8") as file:
        return json.load(file)


def save_new_form_operator(form_name, form_data):
    """
    Save a new operator in the JSON file assigned to the form.
    """

    operator_options = load_form_operator_options(form_name)

    # Use other_operator first because this function normally runs
    # when the user selects "Other".
    operator_value = (
        form_data.get("other_operator")
        or form_data.get("operator")
        or ""
    ).strip()

    if not operator_value:
        raise ValueError("Operator name cannot be empty")

    # Prevent duplicates, including differences in capitalization.
    operator_exists = any(
        entry.get("operator", "").strip().lower()
        == operator_value.lower()
        for entry in operator_options
    )

    if operator_exists:
        print("Operator already exists:", operator_value)

        return {
            "operator": operator_value
        }

    new_entry = {
        "operator": operator_value
    }

    print("Saving new operator:", new_entry)

    operator_options.append(new_entry)

    data_file = get_form_operator_file(form_name)

    with open(data_file, "w", encoding="utf-8") as file:
        json.dump(
            operator_options,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("Operator saved to:", data_file)

    return new_entry