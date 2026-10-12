// =====================================================
// METER / SERVICE TIME
// =====================================================

function setupMeterSection() {

    const meterSelect = document.getElementById("meter");
    const initialInput = document.getElementById("initialMeterRead");
    const finalInput = document.getElementById("finalMeterRead");
    const startTimeInput = document.getElementById("start_time");
    const endTimeInput = document.getElementById("end_time");
    const breakInput = document.getElementById("break");
    const totalTimeInput = document.getElementById("total_time");

    // Make sure all required elements exist
    if (
        !meterSelect ||
        !initialInput ||
        !finalInput ||
        !startTimeInput ||
        !endTimeInput ||
        !breakInput ||
        !totalTimeInput
    ) {
        console.error("Meter section: one or more fields could not be found.");
        return;
    }


    // =====================================================
    // GET ROWS
    // =====================================================

    const initialMeterRow = initialInput.closest(".input-row");
    const finalMeterRow = finalInput.closest(".input-row");
    const startTimeRow = startTimeInput.closest(".input-row");
    const endTimeRow = endTimeInput.closest(".input-row");
    const breakRow = breakInput.closest(".input-row");


    // =====================================================
    // SHOW / HIDE CORRECT FIELDS
    // =====================================================

    function updateMeterFields() {

        const value = meterSelect.value;


        // Clear any old validation messages
        initialInput.setCustomValidity("");
        finalInput.setCustomValidity("");
        startTimeInput.setCustomValidity("");
        endTimeInput.setCustomValidity("");


        // =================================================
        // METER = YES
        // Require Initial Meter + Final Meter
        // =================================================

        if (value === "Yes") {

            // Show meter fields
            initialMeterRow.style.display = "";
            finalMeterRow.style.display = "";

            // Hide time fields
            startTimeRow.style.display = "none";
            endTimeRow.style.display = "none";
            breakRow.style.display = "none";


            // Meter fields ARE required
            initialInput.required = true;
            finalInput.required = true;


            // Time fields are NOT required
            startTimeInput.required = false;
            endTimeInput.required = false;


            // Clear hidden time fields
            startTimeInput.value = "";
            endTimeInput.value = "";
            breakInput.value = "0";


            // Clear total first
            totalTimeInput.value = "";


            // Calculate meter total if values exist
            calculateMeterTotal();
        }


        // =================================================
        // METER = NO
        // Require Start Time + End Time
        // =================================================

        else if (value === "No") {

            // Hide meter fields
            initialMeterRow.style.display = "none";
            finalMeterRow.style.display = "none";


            // Show time fields
            startTimeRow.style.display = "";
            endTimeRow.style.display = "";
            breakRow.style.display = "";


            // Meter fields are NOT required
            initialInput.required = false;
            finalInput.required = false;


            // Time fields ARE required
            startTimeInput.required = true;
            endTimeInput.required = true;


            // Clear any meter validation
            initialInput.setCustomValidity("");
            finalInput.setCustomValidity("");


            // Clear hidden meter values
            initialInput.value = "";
            finalInput.value = "";


            // Clear total first
            totalTimeInput.value = "";


            // Calculate from start/end time if available
            calculateTotalFromTime();
        }


        // =================================================
        // NO METER OPTION SELECTED
        // =================================================

        else {

            // Hide all conditional fields
            initialMeterRow.style.display = "none";
            finalMeterRow.style.display = "none";

            startTimeRow.style.display = "none";
            endTimeRow.style.display = "none";
            breakRow.style.display = "none";


            // Nothing is required yet
            initialInput.required = false;
            finalInput.required = false;

            startTimeInput.required = false;
            endTimeInput.required = false;


            // Clear validation
            initialInput.setCustomValidity("");
            finalInput.setCustomValidity("");
            startTimeInput.setCustomValidity("");
            endTimeInput.setCustomValidity("");


            // Clear total
            totalTimeInput.value = "";
        }
    }


    // =====================================================
    // CALCULATE TOTAL USING METER READINGS
    // =====================================================

    function calculateMeterTotal() {

        // Do not calculate using meter readings
        // unless Meter = Yes
        if (meterSelect.value !== "Yes") {
            return;
        }


        const initial = parseFloat(initialInput.value);
        const final = parseFloat(finalInput.value);


        // Wait until both values are entered
        if (
            Number.isNaN(initial) ||
            Number.isNaN(final)
        ) {

            totalTimeInput.value = "";
            return;
        }


        // Valid meter range
        if (final >= initial) {

            totalTimeInput.value =
                (final - initial).toFixed(2);

        } else {

            // Do NOT put "Invalid" in a number input
            totalTimeInput.value = "";
        }
    }


    // =====================================================
    // CALCULATE TOTAL USING START / END TIME
    // =====================================================

    function calculateTotalFromTime() {

        // Do not calculate using time
        // unless Meter = No
        if (meterSelect.value !== "No") {
            return;
        }


        // Both Start Time and End Time must exist
        if (
            !startTimeInput.value ||
            !endTimeInput.value
        ) {

            totalTimeInput.value = "";
            return;
        }


        const [startHour, startMinute] =
            startTimeInput.value
                .split(":")
                .map(Number);


        const [endHour, endMinute] =
            endTimeInput.value
                .split(":")
                .map(Number);


        const startMinutes =
            (startHour * 60) + startMinute;


        let endMinutes =
            (endHour * 60) + endMinute;


        // -------------------------------------
        // Handle crossing midnight
        // Example:
        // Start = 23:00
        // End   = 01:00
        // -------------------------------------

        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }


        // Get break minutes
        const breakMinutes =
            parseFloat(breakInput.value) || 0;


        // Work time after removing breaks
        const workedMinutes =
            endMinutes -
            startMinutes -
            breakMinutes;


        // Do not allow negative total hours
        if (workedMinutes < 0) {

            totalTimeInput.value = "0.00";
            return;
        }


        // Convert minutes to hours
        totalTimeInput.value =
            (workedMinutes / 60).toFixed(2);
    }


    // =====================================================
    // VALIDATE METER RANGE
    // =====================================================

    function validateMeterRange() {

        // Meter validation only applies
        // when Meter = Yes
        if (meterSelect.value !== "Yes") {

            initialInput.setCustomValidity("");
            finalInput.setCustomValidity("");

            return true;
        }


        const initial =
            parseFloat(initialInput.value);


        const final =
            parseFloat(finalInput.value);


        // If one field is blank, let HTML "required"
        // validation handle it
        if (
            Number.isNaN(initial) ||
            Number.isNaN(final)
        ) {

            initialInput.setCustomValidity("");
            finalInput.setCustomValidity("");

            return true;
        }


        // Initial cannot be greater than Final
        if (initial > final) {

            initialInput.setCustomValidity(
                "Initial meter read cannot be greater than final meter read."
            );

            finalInput.setCustomValidity(
                "Final meter read must be greater than or equal to initial meter read."
            );

            return false;
        }


        // Valid
        initialInput.setCustomValidity("");
        finalInput.setCustomValidity("");

        return true;
    }


    // =====================================================
    // MAKE METER VALIDATION AVAILABLE TO form.js
    // =====================================================

    window.validatePortableMeterRange =
        validateMeterRange;


    // =====================================================
    // EVENT LISTENERS
    // =====================================================


    // User changes Yes / No
    meterSelect.addEventListener(
        "change",
        updateMeterFields
    );


    // Start Time changes
    startTimeInput.addEventListener(
        "input",
        calculateTotalFromTime
    );


    // End Time changes
    endTimeInput.addEventListener(
        "input",
        calculateTotalFromTime
    );


    // Break changes
    breakInput.addEventListener(
        "input",
        calculateTotalFromTime
    );


    // Initial meter changes
    initialInput.addEventListener(
        "input",
        function () {

            calculateMeterTotal();
            validateMeterRange();
        }
    );


    // Final meter changes
    finalInput.addEventListener(
        "input",
        function () {

            calculateMeterTotal();
            validateMeterRange();
        }
    );


    // =====================================================
    // INITIALIZE SECTION WHEN PAGE LOADS
    // =====================================================

    updateMeterFields();
}