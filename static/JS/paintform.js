// =====================================================
// ✅ INITIAL PAGE SETUP (runs when page is loaded)
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ PaintForm.js loaded");

    // ✅ Auto-fill today's date (UTC local browser date)
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;

    
    // =====================================================
    // ✅ TIME CALCULATION LOGIC
    // - Calculates total work duration
    // - Handles overnight shifts
    // =====================================================
    function calculateTotalTime() {

        let start = document.getElementById("start_time").value;
        let end = document.getElementById("end_time").value;
        let breakTime = document.getElementById("break").value || 0;

        if (!start || !end) return;

        // Convert HH:MM → total minutes
        let startParts = start.split(":");
        let endParts = end.split(":");

        let startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        let endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        // ✅ Handle overnight shift (end time is next day)
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }

        // ✅ Subtract break time
        let totalMinutes = endMinutes - startMinutes - parseInt(breakTime);

        // Convert back to hours + minutes
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        document.getElementById("total_time").value =
            `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    // ✅ Trigger calculation when inputs change
    document.getElementById("start_time").addEventListener("change", calculateTotalTime);
    document.getElementById("end_time").addEventListener("change", calculateTotalTime);
    document.getElementById("break").addEventListener("input", calculateTotalTime);

});


// =====================================================
// ✅ MATERIALS SECTION CONFIG
// =====================================================

// ✅ Maximum rows allowed
let maxRows = 5;


// =====================================================
// ✅ ADD MATERIAL ROW
// - Clones first row
// - Resets values
// - Ensures UI consistency
// =====================================================
function addMaterial() {

    let container = document.getElementById("materials-container");
    let rows = container.getElementsByClassName("material-row");

    // ✅ Enforce max rows
    if (rows.length >= maxRows) {
        alert("Maximum 5 materials allowed");
        return;
    }

    // ✅ Clone first row as template
    let newRow = rows[0].cloneNode(true);

    // ✅ Clear all input values
    newRow.querySelectorAll("input").forEach(input => input.value = "");
    newRow.querySelectorAll("select").forEach(select => select.selectedIndex = 0);

    // ✅ Reset "Other" input state
    let otherInput = newRow.querySelector(".other-input");
    if (otherInput) {
        otherInput.style.display = "none";
        otherInput.required = false;
    }

    // ✅ Append new row to container
    container.appendChild(newRow);

    // ✅ Update + button visibility
    updateAddButtons();
}


// =====================================================
// ✅ CONTROL "+" BUTTON VISIBILITY
// - Only show + button on LAST row
// =====================================================
function updateAddButtons() {

    let rows = document.querySelectorAll(".material-row");

    rows.forEach((row, index) => {
        let buttonDiv = row.querySelector(".add-btn");

        if (index === rows.length - 1) {
            buttonDiv.style.display = "block";  // ✅ show only last row
        } else {
            buttonDiv.style.display = "none";   // ✅ hide others
        }
    });
}


// =====================================================
// ✅ DELETE MATERIAL ROW
// - Prevent removing last remaining row
// =====================================================
function deleteMaterial(button) {

    let rows = document.querySelectorAll(".material-row");

    // ✅ Prevent deleting all rows
    if (rows.length <= 1) {
        alert("At least one material is required");
        return;
    }

    // ✅ Remove selected row
    button.closest(".material-row").remove();

    // ✅ Fix + button after deletion
    updateAddButtons();
}


// =====================================================
// ✅ HANDLE "OTHER" MATERIAL INPUT
// - Show input when "Other" is selected
// - Hide otherwise
// =====================================================
function checkOther(selectElement) {

    let container = selectElement.closest(".field");
    let input = container.querySelector(".other-input");

    if (selectElement.value === "Other") {
        input.style.display = "block";   // ✅ show input
        input.required = true;
    } else {
        input.style.display = "none";    // ✅ hide input
        input.required = false;
        input.value = "";                // ✅ clear value
    }
}