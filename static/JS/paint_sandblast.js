// =====================================================
// ✅ INITIAL PAGE SETUP (runs when page is loaded)
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ PaintForm.js loaded");


    // =====================================================
    // ✅ TIME CALCULATION LOGIC
    // =====================================================
    function calculateTotalTime() {

        let start = document.getElementById("start_time")?.value;
        let end = document.getElementById("end_time")?.value;
        let breakTime = document.getElementById("break")?.value || 0;

        if (!start || !end) return;

        // Convert HH:MM → total minutes
        let [sh, sm] = start.split(":").map(Number);
        let [eh, em] = end.split(":").map(Number);

        let startMinutes = sh * 60 + sm;
        let endMinutes = eh * 60 + em;

        // ✅ Handle overnight shift
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }

        let totalMinutes = endMinutes - startMinutes - parseInt(breakTime);

        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        let totalField = document.getElementById("total_time");

        if (totalField) {
            totalField.value = `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
    }

    // ✅ calculate total time
    let startInput = document.getElementById("start_time");
    let endInput = document.getElementById("end_time");
    let breakInput = document.getElementById("break");

    if (startInput) {
        startInput.addEventListener("change", calculateTotalTime);
    }

    if (endInput) {
        endInput.addEventListener("change", calculateTotalTime);
    }

    if (breakInput) {
        breakInput.addEventListener("input", calculateTotalTime);
    }
});


// =====================================================
// ✅ MATERIALS SECTION CONFIG
// =====================================================
let maxRows = 5;


// =====================================================
// ✅ ADD MATERIAL ROW
// =====================================================
function addMaterial() {

    let container = document.getElementById("materials-container");
    let rows = container.getElementsByClassName("material-row");

    if (rows.length >= maxRows) {
        alert("Maximum 5 materials allowed");
        return;
    }

    let newRow = rows[0].cloneNode(true);

    newRow.querySelectorAll("input").forEach(input => input.value = "");
    newRow.querySelectorAll("select").forEach(select => select.selectedIndex = 0);

    let otherInput = newRow.querySelector(".other-input");
    if (otherInput) {
        otherInput.style.display = "none";
        otherInput.required = false;
        // Reset validation flag for cloned element
        otherInput._validationListenerAdded = false;
        otherInput._hasError = false;
        removeValidationError(otherInput);
    }

    // Re-attach checkOther listener to the cloned select
    let selectElement = newRow.querySelector("select[name='material[]']");
    if (selectElement) {
        selectElement.onchange = function() { checkOther(this); };
    }

    container.appendChild(newRow);
    updateAddButtons();
}


// =====================================================
// ✅ CONTROL "+" BUTTON VISIBILITY
// =====================================================
function updateAddButtons() {
    let rows = document.querySelectorAll(".material-row");

    rows.forEach((row, index) => {
        let button = row.querySelector(".add-btn");

        if (button) {
            button.style.display = (index === rows.length - 1) ? "block" : "none";
        }
    });
}


// =====================================================
// ✅ DELETE MATERIAL ROW
// =====================================================
function deleteMaterial(button) {

    let rows = document.querySelectorAll(".material-row");

    if (rows.length <= 1) {
        alert("At least one material is required");
        return;
    }

    button.closest(".material-row").remove();
    updateAddButtons();
}


// =====================================================
// ✅ HANDLE "OTHER" MATERIAL INPUT
// =====================================================
function checkOther(selectElement) {

    let container = selectElement.closest(".field");
    let input = container.querySelector(".other-input");

    if (selectElement.value === "Other") {
        input.style.display = "block";
        input.required = true;
        // Add validation listener when "Other" is selected
        addMaterialValidation(selectElement, input);
    } else {
        input.style.display = "none";
        input.required = false;
        input.value = "";
        // Remove error message if exists
        removeValidationError(input);
    }
}

// =====================================================
// ✅ VALIDATE CUSTOM MATERIAL AGAINST DROPDOWN
// =====================================================
function addMaterialValidation(selectElement, inputElement) {
    // Remove existing listener if any
    if (inputElement._validationListenerAdded) return;
    
    // Get all available materials from the dropdown (excluding "Other")
    const availableMaterials = Array.from(selectElement.options)
        .map(option => option.value.toLowerCase().trim())
        .filter(value => value && value !== "other");
    
    // Listen for input changes
    inputElement.addEventListener("blur", function() {
        validateMaterialInput(this, availableMaterials);
    });
    
    inputElement._validationListenerAdded = true;
}

function validateMaterialInput(inputElement, availableMaterials) {
    const enteredValue = inputElement.value.toLowerCase().trim();
    
    // Remove previous error if any
    removeValidationError(inputElement);
    
    // Only validate if input is not empty
    if (!enteredValue) return;
    
    // Check if material exists in dropdown
    if (availableMaterials.includes(enteredValue)) {
        showValidationError(inputElement, "This material already exists in the dropdown. Please select it or enter a different name.");
    }
}

function showValidationError(inputElement, message) {
    inputElement.style.borderColor = "#d9534f";
    inputElement.style.backgroundColor = "#fff5f5";
    
    // Create error message element
    let errorMsg = document.createElement("div");
    errorMsg.className = "material-error";
    errorMsg.textContent = message;
    errorMsg.style.cssText = `
        color: #d9534f;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    `;
    
    // Insert error message after input
    inputElement.parentNode.insertBefore(errorMsg, inputElement.nextSibling);
    inputElement._hasError = true;
}

function removeValidationError(inputElement) {
    inputElement.style.borderColor = "";
    inputElement.style.backgroundColor = "";
    
    // Remove error message if it exists
    let errorMsg = inputElement.parentNode.querySelector(".material-error");
    if (errorMsg) {
        errorMsg.remove();
    }
    
    inputElement._hasError = false;
}




document.getElementById("form").addEventListener("submit", function(event) {
    // Check if any material has validation errors
    const errorInputs = document.querySelectorAll('input[name="other_material[]"][style*="border-color"]');
    if (errorInputs.length > 0) {
        event.preventDefault();
        alert("Please fix the material validation errors before submitting.");
        return false;
    }
    
    document.querySelectorAll('input[name="quantity[]"]').forEach(function(input) {
        if (input.value === "" || input.value === null) {
            input.value = 0;
        }
    });
});
