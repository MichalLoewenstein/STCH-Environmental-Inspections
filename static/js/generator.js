document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ generator.js loaded");

    // ✅ Attach date validation listeners
    if (typeof attachDateValidationListeners === "function") {
        attachDateValidationListeners(["date"]);
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

    // Clear the custom error as soon as the user types
    if (commentField) {
        commentField.addEventListener("input", function () {
            commentField.setCustomValidity("");
        });
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
    // ✅ RUN REASON → Emergency type
    // =====================================================
    const runReason = document.getElementById("run_reason");
    const emergencyTypeContainer = document.getElementById("emergencyTypeContainer");
    const emergencyTypeSelect = document.querySelector('select[name="emergency_type"]');

    function toggleEmergencyType() {
        if (!runReason || !emergencyTypeContainer || !emergencyTypeSelect) return;

        if (runReason.value === "Emergency") {
            emergencyTypeContainer.style.display = "grid";
            emergencyTypeSelect.required = true;
        } else {
            emergencyTypeContainer.style.display = "none";
            emergencyTypeSelect.required = false;
            emergencyTypeSelect.value = "";
        }
    }

    if (runReason) {
        runReason.addEventListener("change", toggleEmergencyType);
        toggleEmergencyType();
    }

    // =====================================================
    // ✅ RUN DURATION
    // =====================================================
    function calculateTotalTime() {
        const startEl = document.getElementById("start_time");
        const stopEl = document.getElementById("stop_time");
        const runDurationEl = document.getElementById("run_duration");

        if (!startEl || !stopEl || !runDurationEl) return;
        if (!startEl.value || !stopEl.value) return;

        const [sh, sm] = startEl.value.split(":").map(Number);
        const [eh, em] = stopEl.value.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        let stopMinutes = eh * 60 + em;

        if (stopMinutes < startMinutes) stopMinutes += 1440;

        const total = stopMinutes - startMinutes;
        const hours = Math.floor(total / 60);
        const minutes = total % 60;

        runDurationEl.value = `${hours}:${String(minutes).padStart(2, "0")}`;
        updateClockRunHours();
    }

    document.getElementById("start_time")?.addEventListener("change", calculateTotalTime);
    document.getElementById("stop_time")?.addEventListener("change", calculateTotalTime);

    // =====================================================
    // ✅ GENERATOR → STARTING HOURS
    // =====================================================
    const generatorSelect = document.getElementById("generator");
    const startingHours = document.getElementById("starting_hours");

    const generatorValues = {
        N: "364.1",
        SU: "85.33",
        SO: "9.1",
        M: "424.6",
        C: "153.33",
        R: "426.3",
        CA: "171.39",
        BD: "158.45",
        MS: "245.33"
    };

    if (generatorSelect) {
        generatorSelect.addEventListener("change", function () {
            if (startingHours) {
                const selected = (this.value || "").toUpperCase();
                startingHours.value = generatorValues[selected] || "--";
            }
            updateClockRunHours();
        });

        generatorSelect.dispatchEvent(new Event("change"));
    }

    // ✅ Starting hours + run duration → clock run hours
    function updateClockRunHours() {
        const clockRunHoursEl = document.getElementById("clock_run_hours");
        const runDurationEl = document.getElementById("run_duration");

        // Fields are commented out in the HTML, so skip safely
        if (!startingHours || !clockRunHoursEl || !runDurationEl) return;

        const start = parseFloat(startingHours.value) || 0;
        let duration = 0;

        if (runDurationEl.value.includes(":")) {
            const [h, m] = runDurationEl.value.split(":").map(Number);
            duration = h + m / 60;
        }

        const total = start + duration;
        clockRunHoursEl.value = total ? total.toFixed(2) : "";
    }

    // =====================================================
    // ✅ FORM SUBMIT VALIDATION
    // =====================================================
    const form = document.getElementById("form");

    if (form) {
        form.addEventListener("submit", function (event) {

            // Dates
            if (typeof validateAndFillDates === "function") {
                const isDateValid = validateAndFillDates(["date"]);
                if (!isDateValid) {
                    event.preventDefault();
                    return false;
                }
            }
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
