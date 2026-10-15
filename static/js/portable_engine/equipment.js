
// Fetch engine inventory
function loadEngines() {

    return fetch("/api/engines")
        .then(res => res.json())
        .then(data => {

            engines = data;

            console.log(
                "Engines loaded - Total count:",
                engines.length
            );
        })
        .catch(error => {
            console.error(
                "Engine fetch error:",
                error
            );
        });
}


// Load equipment dropdown
function loadEquipment() {

    return fetch("/api/equipment")
        .then(res => res.json())
        .then(data => {

            const dropdown =
                document.getElementById("equipment");

            if (!dropdown) return;

            dropdown.innerHTML = `
                <option value="" disabled selected>
                    Select Equipment
                </option>
            `;

            data.forEach(eq => {

                const option =
                    document.createElement("option");

                option.value = eq;
                option.textContent = eq;

                dropdown.appendChild(option);
            });


            // Add Other
            const other =
                document.createElement("option");

            other.value = "Other";
            other.textContent = "Other";

            dropdown.appendChild(other);
        });
}


// Attach equipment listeners
function setupEquipmentListeners() {

    document.getElementById("equipment")
        ?.addEventListener(
            "change",
            filterModels
        );

    document.getElementById("modelNumber")
        ?.addEventListener(
            "change",
            autoFillFromEquipment
        );
}


// =====================================================
// FILTER MODELS BASED ON EQUIPMENT
// =====================================================

function filterModels() {

    const selectedEquipment =
        document.getElementById("equipment").value;

    const modelDropdown =
        document.getElementById("modelNumber");

    const modelInput =
        document.getElementById("modelNumberInput");

    const selectedModelNumber =
        document.getElementById("selectedModelNumber");


    if (!modelDropdown || !modelInput) return;


    // Clear previous engine information
    clearFormFields();


    // Clear submitted model number
    if (selectedModelNumber) {
        selectedModelNumber.value = "";
    }


    // =================================================
    // OTHER / NEW EQUIPMENT
    // =================================================

    if (
        selectedEquipment &&
        selectedEquipment.toLowerCase() === "other"
    ) {

        // Hide model dropdown
        modelDropdown.style.display = "none";
        modelDropdown.required = false;
        modelDropdown.value = "";


        // Show manual model input
        modelInput.style.display = "block";
        modelInput.required = true;
        modelInput.readOnly = false;
        modelInput.value = "";


        // Allow manual entry in other engine fields
        toggleManualMode(true);

        modelInput.focus();

        return;
    }


    // =================================================
    // EXISTING EQUIPMENT
    // =================================================

    modelDropdown.style.display = "block";
    modelDropdown.required = true;

    modelInput.style.display = "none";
    modelInput.required = false;
    modelInput.value = "";


    // Reset dropdown
    modelDropdown.innerHTML = `
        <option value="" disabled selected hidden>
            Select Model
        </option>
    `;


    // Find engines matching selected equipment
    const filtered = engines.filter(
        engine =>
            engine.equipment === selectedEquipment
    );


    // No engines found
    if (filtered.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";
        option.textContent =
            "No models available";

        option.disabled = true;

        modelDropdown.appendChild(option);

        toggleManualMode(false);

        return;
    }


    // =================================================
    // ADD ENGINE MODELS
    // =================================================

    filtered.forEach(engine => {

        const option =
            document.createElement("option");


        // Display "(No Model)" if model_number is null
        const modelText =
            engine.model_number || "(No Model)";


        // Engine index identifies exact JSON record
        const engineIndex =
            engines.indexOf(engine);


        option.value =
            String(engineIndex);


        // What user sees
        // Example:
        // Vermeer BC1000XL
        // Morbark, LLC (No Model)
        option.textContent =
            `${engine.manufacturer || ""} ${modelText}`.trim();


        // Keep JSON record index
        option.dataset.engineIndex =
            engineIndex;


        modelDropdown.appendChild(option);
    });


    // =================================================
    // ADD OTHER MODEL OPTION
    // =================================================

    const otherOption =
        document.createElement("option");

    otherOption.value = "OTHER";
    otherOption.textContent = "Other";

    modelDropdown.appendChild(otherOption);


    // Existing engine fields should not be manually edited
    toggleManualMode(false);
}


// =====================================================
// AUTOFILL SELECTED ENGINE
// =====================================================


function autoFillFromEquipment() {

    const modelDropdown =
        document.getElementById("modelNumber");

    const modelInput =
        document.getElementById("modelNumberInput");

    const selectedModelNumber =
        document.getElementById("selectedModelNumber");

    if (!modelDropdown || !modelInput) return;


    // -------------------------------------
    // Other model
    // -------------------------------------

    if (modelDropdown.value === "OTHER") {

        clearFormFields();

        if (selectedModelNumber) {
            selectedModelNumber.value = "";
        }

        modelInput.style.display = "block";
        modelInput.required = true;
        modelInput.readOnly = false;
        modelInput.value = "";

        toggleManualMode(true);

        modelInput.focus();

        return;
    }


    // -------------------------------------
    // Existing engine
    // -------------------------------------

    modelInput.style.display = "none";
    modelInput.required = false;

    const selectedOption =
        modelDropdown.selectedOptions[0];

    if (!selectedOption) return;


    const engineIndex =
        selectedOption.dataset.engineIndex;

    console.log("Selected engine index:", engineIndex);


    const engine =
        engines[Number(engineIndex)];

    if (!engine) {
        console.error("Engine not found");
        return;
    }


    console.log("Selected engine:", engine);
    console.log("Model from JSON:", engine.model_number);
    console.log("Manufacturer from JSON:", engine.manufacturer);


    // =====================================
    // MODEL NUMBER
    // =====================================

    if (selectedModelNumber) {

        selectedModelNumber.value =
            engine.model_number ?? "";

        console.log(
            "Hidden model number:",
            selectedModelNumber.value
        );

    } else {

        console.error(
            "selectedModelNumber hidden input NOT FOUND"
        );
    }


    // =====================================
    // MANUFACTURER
    // =====================================

    const manufacturerInput =
        document.getElementById("manufacturerInput");

    if (manufacturerInput) {

        manufacturerInput.value =
            engine.manufacturer ?? "";
    }


    // =====================================
    // SERIAL NUMBER
    // =====================================

    const serialInput =
        document.querySelector(
            "[name='serialNumber']"
        );

    if (serialInput) {

        serialInput.value =
            engine.serial_number ?? "";
    }


    // =====================================
    // MANUFACTURE DATE
    // =====================================

    const manufactureDate =
        document.getElementById("manufactureDate");

    if (manufactureDate) {

        manufactureDate.value =
            engine.manufacture_date ?? "";
    }


    // =====================================
    // TIER
    // =====================================

    const tierInput =
        document.getElementById("TierInput");

    if (tierInput) {

        tierInput.value =
            engine.tier ?? "";
    }


    // =====================================
    // FUEL
    // =====================================

    const fuelInput =
        document.getElementById("fuelInput");

    if (fuelInput) {

        fuelInput.value =
            engine.fuel ?? "";
    }


    // =====================================
    // HORSEPOWER
    // =====================================

    const horsepowerInput =
        document.getElementById("horsepowerInput");

    if (horsepowerInput) {

        horsepowerInput.value =
            Array.isArray(engine.horsepower)
                ? engine.horsepower[0]
                : (engine.horsepower ?? "");
    }


    toggleManualMode(false);
}
// =====================================================
// ENABLE / DISABLE MANUAL EDITING
// =====================================================

function toggleManualMode(enable) {

    const fields = [
        "manufacturerInput",
        "TierInput",
        "fuelInput",
        "horsepowerInput"
    ];


    fields.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;


        if (element.tagName === "SELECT") {

            element.disabled = !enable;

        } else {

            element.readOnly = !enable;
        }
    });


    // Serial Number
    const serial =
        document.querySelector(
            "[name='serialNumber']"
        );

    if (serial) {
        serial.readOnly = !enable;
    }


    // Manufacture Date
    const manufactureDate =
        document.getElementById(
            "manufactureDate"
        );

    if (manufactureDate) {
        manufactureDate.readOnly = !enable;
    }
}


// =====================================================
// CLEAR ENGINE FIELDS
// =====================================================

function clearFormFields() {

    const fields = [
        "manufacturerInput",
        "modelNumberInput",
        "manufactureDate",
        "TierInput",
        "fuelInput",
        "horsepowerInput"
    ];


    fields.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });


    // Clear serial number
    const serial =
        document.querySelector(
            "[name='serialNumber']"
        );

    if (serial) {
        serial.value = "";
    }


    // Clear hidden model number
    const selectedModelNumber =
        document.getElementById(
            "selectedModelNumber"
        );

    if (selectedModelNumber) {
        selectedModelNumber.value = "";
    }
}