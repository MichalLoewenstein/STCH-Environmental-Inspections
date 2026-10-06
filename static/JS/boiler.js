
///////////new -----------------------------------------
document.addEventListener("DOMContentLoaded", function () {

    // ✅ Attach date validation listeners
    attachDateValidationListeners(["date"]);

    setupOperator("boiler");

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

// function toggleBoilerStatus(enable) {

//     const section = document.getElementById("inspectionSections");

//     if (section) {
//         section.style.display = enable ? "" : "none";
//     }

//     // Reset fields when Out of Service
//     if (!enable) {

//         // Reset all checkboxes
//         document.querySelectorAll("input[type='checkbox']")
//             .forEach(cb => {

//                 cb.checked = false;

//                 const hidden = document.querySelector(
//                     `input[name="${cb.name.replace("cb", "")}"]`
//                 );

//                 if (hidden) {
//                     hidden.value = "";
//                 }
//             });

//         // Reset emissions
//         const emissions = document.querySelector("[name='emissions']");
//         if (emissions) {
//             emissions.selectedIndex = 0;
//         }

//         // Clear smoke times
//         const timeSmoke = document.getElementById("time_smoke");
//         const timeSmokeCleared = document.getElementById("time_smoke_cleared");

//         if (timeSmoke) {
//             timeSmoke.value = "";
//         }

//         if (timeSmokeCleared) {
//             timeSmokeCleared.value = "";
//         }
//     }


//     updateCommentsRequirement();
// } 

function toggleBoilerStatus(enable) {

    const section = document.getElementById("inspectionSections");
    const emissions = document.querySelector("[name='emissions']");
    const timeSmoke = document.getElementById("time_smoke");
    const timeSmokeCleared = document.getElementById("time_smoke_cleared");

    // Show inspection section when Boiler is In Service.
    // Hide inspection section when Boiler is Out of Service.
    if (section) {
        section.style.display = enable ? "" : "none";
    }


    // -----------------------------------------
    // BOILER IN SERVICE
    // -----------------------------------------

    if (enable) {

        // Visible Emissions is required when the Boiler is in service.
        if (emissions) {
            emissions.required = true;
        }

    }


    // -----------------------------------------
    // BOILER OUT OF SERVICE
    // -----------------------------------------

    else {

        // Visible Emissions is NOT required when the Boiler
        // is Out of Service.
        if (emissions) {
            emissions.required = false;

            // Clear the previous selection.
            emissions.selectedIndex = 0;
        }


        // Reset all inspection checkboxes.
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


        // Clear smoke times.
        if (timeSmoke) {
            timeSmoke.value = "";
            timeSmoke.required = false;
        }

        if (timeSmokeCleared) {
            timeSmokeCleared.value = "";
            timeSmokeCleared.required = false;
        }
    }


    // Recalculate whether comments and smoke times
    // should be required.
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

