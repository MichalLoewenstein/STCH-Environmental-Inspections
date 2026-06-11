// =====================================================
// ✅ INITIAL PAGE SETUP (runs when page is loaded)
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ PaintForm.js loaded");

})


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