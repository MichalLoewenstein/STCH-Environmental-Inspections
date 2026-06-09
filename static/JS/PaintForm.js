// =====================================================
// ✅ INITIAL PAGE SETUP (runs when page is loaded)
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ PaintForm.js loaded");

    // ✅ Auto-fill today's date
    let today = new Date().toISOString().split('T')[0];
    let dateInput = document.getElementById("date");

    if (dateInput) {
        dateInput.value = today;
    }

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

    // ✅ SAFELY attach event listeners
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
    } else {
        input.style.display = "none";
        input.required = false;
        input.value = "";
    }
}