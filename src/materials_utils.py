import json
import os


DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "paint_materials.json")


def load_materials():
    with open(DATA_FILE, "r") as f:
        materials = json.load(f)

    return sorted(materials, key=lambda x: (x.lower() == "other", x.lower()))


def add_material(material_name, materials):
    existing_materials = [item.lower() for item in materials]

    if material_name.lower() not in existing_materials:
        materials.append(material_name)
        materials.sort(key=lambda x: (x.lower() == "other", x.lower()))
        with open(DATA_FILE, "w") as f:
            json.dump(materials, f, indent=4)

    return materials
