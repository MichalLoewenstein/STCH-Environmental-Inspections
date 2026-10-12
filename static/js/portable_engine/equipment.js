// =====================================================
// ENGINE / EQUIPMENT
// =====================================================


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

                const option =document.createElement("option");
                option.value = eq;
                option.textContent = eq;

                dropdown.appendChild(option);
            });

            // Add Other
            const other =document.createElement("option");
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


// Filter models by selected equipment
// function filterModels() {
//     const selectedEquipment = document.getElementById("equipment").value;
//     const modelDropdown = document.getElementById("modelNumber");
//     const modelInput =document.getElementById("modelNumberInput");

//     clearFormFields();


//     // -------------------------------------
//     // New equipment
//     // -------------------------------------

//     if (
//         selectedEquipment &&
//         selectedEquipment.toLowerCase() === "other"
//     ) {

//         modelDropdown.style.display = "none";
//         modelInput.style.display = "block";
//         modelInput.required = true;
//         modelInput.value = "";

//         toggleManualMode(true);

//         return;
//     }


//     // -------------------------------------
//     // Existing equipment
//     // -------------------------------------

//     modelDropdown.style.display = "block";

//     modelInput.style.display = "none";
//     modelInput.required = false;

//     modelDropdown.innerHTML = `
//         <option value="" disabled selected hidden>
//             Select Model
//         </option>
//     `;


//     const filtered = engines.filter(
//         engine =>
//             engine.equipment === selectedEquipment
//     );


//     if (filtered.length === 0) {
//         const option = document.createElement("option");
//         option.textContent = "No models available";
//         option.disabled = true;
//         modelDropdown.appendChild(option);
//         toggleManualMode(false);
//         return;
//     }


//     filtered.forEach(engine => {

//         const option = document.createElement("option");
//         const modelText = engine.model_number || "(No Model)";
//         option.textContent =`${engine.manufacturer} ${modelText}`;
//         option.dataset.engineIndex = engines.indexOf(engine);

//         modelDropdown.appendChild(option);
//     });


//     // Add Other model
//     const otherOption = document.createElement("option");
//     otherOption.value = "OTHER";
//     otherOption.textContent = "Other";

//     modelDropdown.appendChild(otherOption);

//     toggleManualMode(false);
// }
function filterModels() {
    const selectedEquipment =
        document.getElementById("equipment").value;

    const modelDropdown =
        document.getElementById("modelNumber");

    const modelInput =
        document.getElementById("modelNumberInput");

    if (!modelDropdown || !modelInput) return;

    clearFormFields();

    // -------------------------------------
    // New equipment
    // -------------------------------------
    if (
        selectedEquipment &&
        selectedEquipment.toLowerCase() === "other"
    ) {
        // Hide and disable validation on the dropdown
        modelDropdown.style.display = "none";
        modelDropdown.required = false;
        modelDropdown.value = "";

        // Show and require the manual model input
        modelInput.style.display = "block";
        modelInput.required = true;
        modelInput.readOnly = false;
        modelInput.value = "";

        toggleManualMode(true);

        modelInput.focus();
        return;
    }

    // -------------------------------------
    // Existing equipment
    // -------------------------------------
    modelDropdown.style.display = "block";
    modelDropdown.required = true;

    modelInput.style.display = "none";
    modelInput.required = false;
    modelInput.value = "";

    modelDropdown.innerHTML = `
        <option value="" disabled selected hidden>
            Select Model
        </option>
    `;

    const filtered = engines.filter(
        engine => engine.equipment === selectedEquipment
    );

    if (filtered.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No models available";
        option.disabled = true;

        modelDropdown.appendChild(option);

        toggleManualMode(false);
        return;
    }

    filtered.forEach(engine => {
        const option = document.createElement("option");
        const modelText =
            engine.model_number || "(No Model)";

        option.value = String(engines.indexOf(engine));
        option.textContent =
            `${engine.manufacturer || ""} ${modelText}`.trim();

        option.dataset.engineIndex =
            engines.indexOf(engine);

        modelDropdown.appendChild(option);
    });

    // Add Other model
    const otherOption =
        document.createElement("option");

    otherOption.value = "OTHER";
    otherOption.textContent = "Other";

    modelDropdown.appendChild(otherOption);

    toggleManualMode(false);
}


// Fill engine information
function autoFillFromEquipment() {

    const modelDropdown =document.getElementById("modelNumber");
    const modelInput = document.getElementById("modelNumberInput");
    if (modelDropdown.style.display === "none") {
        return;
    }

    // -------------------------------------
    // New Model
    // -------------------------------------

    if (modelDropdown.value === "OTHER") {

        clearFormFields();

        modelInput.style.display = "block";
        modelInput.required = true;
        modelInput.value = "";

        toggleManualMode(true);

        modelInput.focus();

        return;
    }

    modelInput.style.display = "none";
    modelInput.required = false;

    const selectedOption =modelDropdown.selectedOptions[0];

    if (!selectedOption) return;


    const engine =
        engines[
            Number(
                selectedOption.dataset.engineIndex
            )
        ];

    if (!engine) return;

    document.getElementById( "manufacturerInput").value = engine.manufacturer || "";
    document.getElementById("modelNumberInput").value = engine.model_number || "";
    document.querySelector("[name='serialNumber']").value = engine.serial_number || "";
    document.getElementById("manufactureDate").value = engine.manufacture_date || "";
    document.getElementById("TierInput").value = engine.tier || "";
    document.getElementById("fuelInput").value = engine.fuel || "";
    
    document.getElementById("horsepowerInput").value =
        Array.isArray(engine.horsepower) ? engine.horsepower[0]:(engine.horsepower || "");
    toggleManualMode(false);
}


// Enable / disable manual editing
function toggleManualMode(enable) {

    const fields = [
        "manufacturerInput",
        "modelNumberInput",
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

    const serial = document.querySelector( "[name='serialNumber']");

    if (serial) {
        serial.readOnly = !enable;
    }

    const manufactureDate =document.getElementById( "manufactureDate" );
    if (manufactureDate) {
        manufactureDate.readOnly = !enable;
    }
}


// Clear engine fields
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
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });


    const serial =
        document.querySelector(
            "[name='serialNumber']"
        );
    if (serial) {
        serial.value = "";
    }
}
``