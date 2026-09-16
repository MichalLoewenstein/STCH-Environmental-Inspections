let engines = []; // Store the engine records loaded from the server.

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ✅ DATE VALIDATION
    // =====================================================
    if (typeof attachDateValidationListeners === "function") {
        attachDateValidationListeners(
            ["arrivalDate", "date", "departureDate", "manufactureDate"],
            ["arrivalDate", "date", "departureDate", "manufactureDate"]
        );
    }

    // =====================================================
    // ✅ CONTRACTOR → required, "Other" name required
    // =====================================================
    const vendorSelect = document.getElementById("vendor");
    const otherVendorInput = document.getElementById("other_vendor");

    function toggleOtherVendor() {
        if (!vendorSelect || !otherVendorInput) return;

        if (vendorSelect.value === "Other") {
            otherVendorInput.style.display = "";
            otherVendorInput.required = true;
        } else {
            otherVendorInput.style.display = "none";
            otherVendorInput.required = false;
            otherVendorInput.value = "";
            otherVendorInput.setCustomValidity("");
        }
    }

    if (vendorSelect) {
        vendorSelect.required = true;
        vendorSelect.addEventListener("change", toggleOtherVendor);
        toggleOtherVendor();
    }

    if (otherVendorInput) {
        otherVendorInput.addEventListener("input", function () {
            otherVendorInput.setCustomValidity("");
        });
    }

    // =====================================================
    // ✅ VISIBLE EMISSIONS → required comment when "Yes"
    // =====================================================
    const emissionsSelect = document.getElementById("emissions");
    const commentRow = document.getElementById("Comments_Visible_Emissions");
    const commentField = document.getElementById("visibleEmissionComment");

    function toggleEmissionComment() {
        if (!emissionsSelect || !commentRow || !commentField) return;

        if (emissionsSelect.value === "Yes") {
            commentRow.style.display = "";
            commentField.required = true;
        } else {
            commentRow.style.display = "none";
            commentField.required = false;
            commentField.value = "";
            commentField.setCustomValidity("");
        }
    }

    if (emissionsSelect) {
        emissionsSelect.required = true;
        emissionsSelect.addEventListener("change", toggleEmissionComment);
        toggleEmissionComment();
    }

    if (commentField) {
        commentField.addEventListener("input", function () {
            commentField.setCustomValidity("");
        });
    }

    // =====================================================
    // ✅ METER READS → required, total hours, range check
    // =====================================================
    const initialInput = document.getElementById("initialMeterRead");
    const finalInput = document.getElementById("finalMeterRead");
    const totalHoursEl = document.getElementById("total_hours");

    if (initialInput) initialInput.required = true;
    if (finalInput) finalInput.required = true;

    function calculateTotal() {
        if (!initialInput || !finalInput || !totalHoursEl) return;

        const initial = parseFloat(initialInput.value);
        const final = parseFloat(finalInput.value);

        if (Number.isNaN(initial) || Number.isNaN(final) || final < initial) {
            totalHoursEl.value = "";
            return;
        }

        totalHoursEl.value = (final - initial).toFixed(2);
    }

    function validateMeterRange() {
        if (!initialInput || !finalInput) return true;

        initialInput.setCustomValidity("");
        finalInput.setCustomValidity("");

        const initial = parseFloat(initialInput.value);
        const final = parseFloat(finalInput.value);

        if (Number.isNaN(initial) || Number.isNaN(final)) return true;

        if (initial > final) {
            initialInput.setCustomValidity("Initial meter read cannot be greater than final meter read.");
            finalInput.setCustomValidity("Final meter read must be greater than or equal to initial meter read.");
            return false;
        }

        return true;
    }

    [initialInput, finalInput].forEach(function (input) {
        input?.addEventListener("input", function () {
            calculateTotal();
            validateMeterRange();
        });
    });

    // =====================================================
    // ✅ RUN DURATION (HH:MM)
    // =====================================================
    document.getElementById("start_time")?.addEventListener("input", calculateTotalTime);
    document.getElementById("stop_time")?.addEventListener("input", calculateTotalTime);
    calculateTotalTime();

    // =====================================================
    // ✅ DATE AUTO-FILL
    // =====================================================
    function fillMissingDates() {
        const arrivalDate = document.getElementById("arrivalDate");
        if (!arrivalDate) return;

        if (!arrivalDate.value) {
            arrivalDate.value = new Date().toISOString().split("T")[0];
        }
        // Do NOT auto-fill departureDate
    }

    // =====================================================
    // ✅ FORM SUBMIT VALIDATION
    // =====================================================
    const form = document.getElementById("form");

    if (form) {
        form.addEventListener("submit", function (event) {

            const fuelInput = document.getElementById("fuelInput");
            if (fuelInput) fuelInput.disabled = false;

            // Dates
            if (typeof validateAndFillDates === "function") {
                const dateFields = ["arrivalDate", "date", "manufactureDate"];
                const excludeFields = ["manufactureDate"];

                if (!validateAndFillDates(dateFields, excludeFields)) {
                    event.preventDefault();
                    return false;
                }
            }

            fillMissingDates();

            // Contractor "Other": block empty or spaces-only
            if (vendorSelect && otherVendorInput && vendorSelect.value === "Other") {
                if (otherVendorInput.value.trim() === "") {
                    event.preventDefault();
                    otherVendorInput.value = "";
                    otherVendorInput.setCustomValidity("Please enter the contractor name.");
                    otherVendorInput.reportValidity();
                    return false;
                }
            }

            // Meter reads: must be filled in and in the correct order
            if (initialInput && initialInput.value.trim() === "") {
                event.preventDefault();
                initialInput.reportValidity();
                return false;
            }

            if (finalInput && finalInput.value.trim() === "") {
                event.preventDefault();
                finalInput.reportValidity();
                return false;
            }

            if (!validateMeterRange()) {
                event.preventDefault();
                finalInput.reportValidity();
                return false;
            }

            // Visible emission comment: block empty or spaces-only when "Yes"
            if (emissionsSelect && commentField && emissionsSelect.value === "Yes") {
                if (commentField.value.trim() === "") {
                    event.preventDefault();
                    commentField.value = "";
                    commentField.setCustomValidity("Please describe the visible emission and provide a reason.");
                    commentField.reportValidity();
                    return false;
                }
            }
        });
    }
});

// Fetch the engine inventory from the Flask API.
function loadEngines() {
    return fetch("/api/fireEngines")
        .then(res => res.json())
        .then(data => {
            engines = data;
            console.log("Engines loaded - Total count:", engines.length);
        })
        .catch(err => console.error("Fetch error:", err));
}

// ================================
// Run Duration Calculation (HH:MM)
// ================================
function calculateTotalTime() {
    const startEl = document.getElementById("start_time");
    const stopEl = document.getElementById("stop_time");
    const runDurationEl = document.getElementById("run_duration");

    if (!startEl || !stopEl || !runDurationEl) return;

    if (!startEl.value || !stopEl.value) {
        runDurationEl.value = "";
        return;
    }

    const [startHour, startMinute] = startEl.value.split(":").map(Number);
    const [stopHour, stopMinute] = stopEl.value.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    let stopTotal = stopHour * 60 + stopMinute;

    if (stopTotal < startTotal) stopTotal += 24 * 60; // crosses midnight

    const diff = stopTotal - startTotal;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    runDurationEl.value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
