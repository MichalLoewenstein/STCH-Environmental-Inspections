import json
import os


DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "portable_engine_inventory.json")


def load_engine_inventory():
    """Read the portable engine inventory from disk."""
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_new_engine(form_data):
    """Append a new engine entry when the user selects 'Other'."""
    inventory = load_engine_inventory()

    new_entry = {
        "equipment": form_data.get("equipment"),
        "manufacturer": form_data.get("manufacturerInput"),
        "model_number": form_data.get("modelNumber"),
        "serial_number": form_data.get("serialNumber"),
        "manufacture_date": form_data.get("manufactureDate"),
        "tier": form_data.get("TierInput"),
        "fuel": form_data.get("fuelInput"),
        "horsepower": form_data.get("horsepowerInput"),
    }

    inventory.append(new_entry)

    with open(DATA_FILE, "w") as f:
        json.dump(inventory, f, indent=4)

    return new_entry
