import json
import os


DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "portable_location.json")


def load_location_options():
    """Read the location options from disk."""
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_new_location(form_data):
    """Append a new location entry when the user selects 'Other'."""
    location_options = load_location_options()

    location_value = form_data.get("other_location") or form_data.get("location")

    new_entry = {
        "Location": location_value
    }

    print("✅ Saving new Location:", new_entry)

    location_options.append(new_entry)

    with open(DATA_FILE, "w") as f:
        json.dump(location_options, f, indent=4)

    print("✅ Location saved to:", DATA_FILE)
    return new_entry

