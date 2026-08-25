import json
import os


DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "portable_engine_inventory.json")


def load_engine_inventory():
    """Read the portable engine inventory from disk."""
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_new_engine(form_data):
    """Append a new engine entry when the user selects 'Other'."""
    inventory = load_engine_inventory()

    equipment_value = form_data.get("other_equipment") or form_data.get("equipment")

    new_entry = {
        "equipment": equipment_value,
        "manufacturer": form_data.get("manufacturer"),
        "model_number": form_data.get("modelNumber"),
        "serial_number": form_data.get("serialNumber"),
        "manufacture_date": form_data.get("manufactureDate"),
        "tier": form_data.get("tier"),
        "fuel": form_data.get("fuel"),
        "horsepower": form_data.get("horsepower")
    }

    print("✅ Saving new engine:", new_entry)

    inventory.append(new_entry)

    with open(DATA_FILE, "w") as f:
        json.dump(inventory, f, indent=4)

    print("✅ Engine saved to:", DATA_FILE)
    return new_entry

