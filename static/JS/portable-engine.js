



let engines = [];




document.addEventListener("DOMContentLoaded", function () {

    
loadEngines();
loadEquipment();


    function calculateTotal() {


            // Time Calculation //
        const initial = parseFloat(document.getElementById("initialMeterRead").value) || 0;
        const final = parseFloat(document.getElementById("finalMeterRead").value) || 0;

        if (final >= initial) {
            const total = final - initial;
            document.getElementById("total_time").value = total.toFixed(2);
        } else {
            document.getElementById("total_time").value = "Invalid";
        }
    }
    // Trigger calculation when values change
    document.getElementById("initialMeterRead").addEventListener("input", calculateTotal);
    document.getElementById("finalMeterRead").addEventListener("input", calculateTotal);

    // On-Site Status //
    const departureDate = document.getElementById("departureDate");
    const onsiteStatus = document.getElementById("onsiteStatus");

    function updateStatus() {

        if (departureDate.value) {
            // If there is a date → Off-Site
            onsiteStatus.value = "Off-Site";
        } else {
            // If empty → On-Site
            onsiteStatus.value = "On-Site";
        }
    }

    // Run on page load
    updateStatus();

    // Run whenever the date changes
    departureDate.addEventListener("change", updateStatus);




function validateMeters() {
    const initial = parseFloat(initialInput.value);
    const final = parseFloat(finalInput.value);

    if (!isNaN(initial) && !isNaN(final) && final > initial) {
        finalInput.setCustomValidity("Final meter read cannot be greater than initial meter read.");
    } else {
        finalInput.setCustomValidity("");
    }

    finalInput.reportValidity();
}






    

})





// Load JSON from Flask
function loadEngines() {
    fetch("/api/engines")
        .then(res => res.json())
        .then(data => {
            engines = data;

            console.log("Engines loaded");
            console.log(engines);

            // ✅ Now safe to use data
            setupEventListeners();
        })
        .catch(err => console.error("Fetch error:", err));
}




function setupEventListeners() {
    document.getElementById("equipment").addEventListener("change", filterModels);
    document.getElementById("modelNumber").addEventListener("change", autoFillFromEquipment);
}


// ✅ Filter models by equipment

function filterModels() {
    const selectedEquipment = document.getElementById("equipment").value;
    const modelDropdown = document.getElementById("modelNumber");
    const modelInput = document.getElementById("modelNumberInput");

    // ✅ If OTHER → switch to input mode
    if (selectedEquipment === "Other") {
        modelDropdown.style.display = "none";
        modelInput.style.display = "block";

        modelInput.value = "";

        clearFormFields();
        toggleManualMode(true);

        return;
    }

    // ✅ Normal mode
    modelDropdown.style.display = "block";
    modelInput.style.display = "none";

    modelDropdown.innerHTML = '<option disabled selected hidden>Select Model</option>';

    const filtered = engines.filter(e => e.equipment === selectedEquipment);

    filtered.forEach((engine, index) => {
        const option = document.createElement("option");

        option.value = index; // index inside filtered list
        option.textContent = `${engine.manufacturer} ${engine.model_number}`;

        // ✅ Store full engine object reference
        option.dataset.engineIndex = engines.indexOf(engine);

        modelDropdown.appendChild(option);
    });

    toggleManualMode(false);
}

// ✅ Autofill form

function autoFillFromEquipment() {
    const modelDropdown = document.getElementById("modelNumber");

    // ✅ Do nothing if hidden
    if (modelDropdown.style.display === "none") return;

    const selectedOption = modelDropdown.selectedOptions[0];

    if (!selectedOption) return;

    const index = Number(selectedOption.dataset.engineIndex);
    const engine = engines[index];

    console.log("Selected engine:", engine);

    if (!engine) return;

    // ✅ Fill inputs
    document.getElementById("manufacturerInput").value = engine.manufacturer || "";
    document.getElementById("modelNumberInput").value = engine.model_number || "";
    document.querySelector("[name='serialNumber']").value = engine.serial_number || "";
    document.getElementById("manufactureDate").value = engine.manufacture_date || "";
    document.getElementById("TierInput").value = engine.tier || "";
    document.getElementById("fuelInput").value = engine.fuel || "";

    document.getElementById("horsepowerInput").value =
        Array.isArray(engine.horsepower)
            ? engine.horsepower[0]
            : (engine.horsepower || "");

    toggleManualMode(false);
}


function toggleManualMode(enable) {

    const fields = [
        "manufacturerInput",
        "modelNumberInput",
        "TierInput",
        "fuelInput",
        "horsepowerInput"
    ];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.readOnly = !enable;  // ✅ input fields use readOnly
        }
    });

    document.querySelector("[name='serialNumber']").readOnly = !enable;
    document.getElementById("manufactureDate").readOnly = !enable;
}


function clearFormFields() {
    document.getElementById("manufacturerInput").value = "";
    document.getElementById("modelNumberInput").value = "";
    document.querySelector("[name='serialNumber']").value = "";
    document.getElementById("manufactureDate").value = "";
    document.getElementById("TierInput").value = "";
    document.getElementById("fuelInput").value = "";
    document.getElementById("horsepowerInput").value = "";
}




function loadEquipment() {
    fetch("/api/equipment")
        .then(res => res.json())
        .then(data => {
            const dropdown = document.getElementById("equipment");

            dropdown.innerHTML = '<option disabled selected>Select Equipment</option>';

            data.forEach(eq => {
                const option = document.createElement("option");
                option.value = eq;
                option.textContent = eq;
                dropdown.appendChild(option);
            });

            // ✅ Add "Other" option at the end
            const other = document.createElement("option");
            other.value = "Other";
            other.textContent = "Other";
            dropdown.appendChild(other);
        });
}
