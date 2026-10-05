
///////////new -----------------------------------------
document.addEventListener("DOMContentLoaded", function () {

    // ✅ Attach date validation listeners
    attachDateValidationListeners(["date"]);

    // -----------------------------
    // Checkbox handling
    // -----------------------------
    const toggles = document.querySelectorAll('input[type="checkbox"]');

    toggles.forEach(toggle => {

        const baseName = toggle.name.replace("cb", "");
        const hidden = document.querySelector(`input[name="${baseName}"]`);

        if (hidden) {

            hidden.value = "Not Checked";

            toggle.addEventListener("change", function () {

                hidden.value = toggle.checked
                    ? "Checked"
                    : "Not Checked";

                updateCommentsRequirement();
            });
        }
    });

    // -----------------------------
    // Boiler Status Event
    // -----------------------------
    const boilerStatus = document.querySelector("[name='boilerStatus']");

    if (boilerStatus) {

        // Initial state
        toggleBoilerStatus(
            boilerStatus.value !== "Out of Service"
        );

        boilerStatus.addEventListener("change", function () {

            toggleBoilerStatus(
                this.value !== "Out of Service"
            );

            updateCommentsRequirement();
        });
    }

    // -----------------------------
    // Emissions Event
    // -----------------------------
    const emissions = document.querySelector("[name='emissions']");

    if (emissions) {
        emissions.addEventListener(
            "change",
            updateCommentsRequirement
        );
    }
    // -----------------------------
    // Operator
    // -----------------------------
    const operatorSelect = document.getElementById("operator");
    const otherOperator = document.getElementById("other_operator");

    if (operatorSelect && otherOperator) {
    // Load operators from JSON

    loadOperators();

    operatorSelect.addEventListener("change", function () {

    console.log("Operator selected:", this.value);

    if (this.value === "Other") {
        otherOperator.style.display = "block";
        otherOperator.required = true;
        otherOperator.focus();
    } 
    else {
        otherOperator.style.display = "none";
        otherOperator.required = false;
        otherOperator.value = "";
    }
    });

}

    // Initial validation state
    updateCommentsRequirement();
});


// -----------------------------
// Form Submit
// -----------------------------
document.querySelector("form").addEventListener("submit", function (event) {

    const dateFields = ["date"];

    const isDateValid =
        validateAndFillDates(dateFields);

    if (!isDateValid) {
        event.preventDefault();
        return false;
    }

    document.querySelectorAll('input[type="checkbox"]')
    .forEach(toggle => {

        const baseName =
            toggle.name.replace("cb", "");

        const hidden =
            document.querySelector(
                `input[name="${baseName}"]`
            );

        if (!hidden) return;

        const boilerStatus =
            document.querySelector("[name='boilerStatus']");

        if (boilerStatus?.value === "Out of Service") {
            hidden.value = "";
        } else {
            hidden.value = toggle.checked
                ? "Checked"
                : "Not Checked";
        }
    });
    
});

function toggleBoilerStatus(enable) {

    const section = document.getElementById("inspectionSections");

    if (section) {
        section.style.display = enable ? "" : "none";
    }

    // Reset fields when Out of Service
    if (!enable) {

        // Reset all checkboxes
        document.querySelectorAll("input[type='checkbox']")
            .forEach(cb => {

                cb.checked = false;

                const hidden = document.querySelector(
                    `input[name="${cb.name.replace("cb", "")}"]`
                );

                if (hidden) {
                    hidden.value = "";
                }
            });

        // Reset emissions
        const emissions = document.querySelector("[name='emissions']");
        if (emissions) {
            emissions.selectedIndex = 0;
        }

        // Clear smoke times
        const timeSmoke = document.getElementById("time_smoke");
        const timeSmokeCleared = document.getElementById("time_smoke_cleared");

        if (timeSmoke) {
            timeSmoke.value = "";
        }

        if (timeSmokeCleared) {
            timeSmokeCleared.value = "";
        }
    }


    updateCommentsRequirement();
} 


// -----------------------------
// Comments Requirement Logic
// -----------------------------
function updateCommentsRequirement() {

    const comments =
        document.querySelector("[name='comments']");

    const emissions =
        document.querySelector("[name='emissions']");

    const boilerStatus =
        document.querySelector("[name='boilerStatus']");

    const timeSmoke =
        document.getElementById("time_smoke");

    const timeSmokeCleared =
        document.getElementById("time_smoke_cleared");

    // Boiler Out of Service
    if (boilerStatus?.value === "Out of Service") {

        comments.required = false;
        timeSmoke.required = false;
        timeSmokeCleared.required = false;

        return;
    }

    // Visible emissions
    const emissionsYes =
        emissions?.value === "Yes";

    // Any unchecked inspection item
    const anyUnchecked =
        [...document.querySelectorAll("input[type='checkbox']")]
            .some(cb => !cb.checked && !cb.disabled);

    // Comments required
    comments.required =
        emissionsYes || anyUnchecked;

    // Times required if emissions=yes
    timeSmoke.required = emissionsYes;
    timeSmokeCleared.required = emissionsYes;
}

// -----------------------------
// Operator Auto-Fill Logic
// -----------------------------
let operators = [];

function loadOperators() {

    fetch("/api/operators")
        .then(res => {

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            return res.json();
        })

        .then(data => {

            operators = data;

            console.log("Operators loaded:", operators);
            console.log(
                "Operators loaded - Total count:",
                operators.length
            );

            const operatorSelect =
                document.getElementById("operator");

            if (!operatorSelect) {
                console.error("Operator dropdown not found.");
                return;
            }

            // Clear existing options
            operatorSelect.innerHTML = "";

            // Add default option
            const defaultOption =
                document.createElement("option");

            defaultOption.value = "";
            defaultOption.textContent = "Select Operator";
            defaultOption.disabled = true;
            defaultOption.selected = true;

            operatorSelect.appendChild(defaultOption);


            // Add operators from JSON
            operators.forEach(operator => {

                const option =
                    document.createElement("option");

                option.value = operator;
                option.textContent = operator;

                operatorSelect.appendChild(option);
            });


            // Add Other as the last option
            const otherOption =
                document.createElement("option");

            otherOption.value = "Other";
            otherOption.textContent = "Other";

            operatorSelect.appendChild(otherOption);
        })

        .catch(err => {

            console.error(
                "Error loading operators:",
                err
            );

        });
}