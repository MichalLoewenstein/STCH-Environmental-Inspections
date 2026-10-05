# import json
# import os


# DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "operator_options.json")


# def load_operator_options():
#     """Read the operator options from disk."""
#     with open(DATA_FILE, "r") as f:
#         return json.load(f)


# def save_new_operator(form_data):
#     """Append a new operator entry when the user selects 'Other'."""
#     operator_options = load_operator_options()

#     operator_value = form_data.get("other_operator") or form_data.get("operator")

#     new_entry = {
#         "operator": operator_value
#     }

#     print("✅ Saving new operator:", new_entry)

#     operator_options.append(new_entry)

#     with open(DATA_FILE, "w") as f:
#         json.dump(operator_options, f, indent=4)

#     print("✅ Operator saved to:", DATA_FILE)
#     return new_entry