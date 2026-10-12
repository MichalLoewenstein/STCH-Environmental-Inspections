// =====================================================
// FORM VALIDATION
// =====================================================


function setupFormValidation() {

    const form = document.getElementById("form");

    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            // -------------------------------------
            // Fuel
            // -------------------------------------

            const fuelInput = document.getElementById( "fuelInput");

            if (fuelInput) {
                fuelInput.disabled = false;
            }


            // -------------------------------------
            // Dates
            // -------------------------------------

            const dateFields = [
                "arrivalDate",
                "date",
                "departureDate",
                "manufactureDate"
            ];


            const excludeFields = [
                "departureDate",
                "manufactureDate"
            ];

            const isDateValid =
                validateAndFillDates(
                    dateFields,
                    excludeFields
                );

            if (!isDateValid) {

                event.preventDefault();

                return false;
            }


            fillMissingDates();


            // -------------------------------------
            // Location
            // -------------------------------------

            const location = document.getElementById( "location");
            const otherLocation = document.getElementById( "other_location");

            if (
                location?.value === "Other" &&
                !otherLocation?.value.trim()
            ) {

                event.preventDefault();

                otherLocation.setCustomValidity( "Please enter the new location." );
                otherLocation.reportValidity();
                otherLocation.focus();

                return false;
            }


            // -------------------------------------
            // Meter
            // -------------------------------------

            if (
                window.validatePortableMeterRange &&
                !window.validatePortableMeterRange()
            ) {

                event.preventDefault();
                document.getElementById("initialMeterRead")?.reportValidity();

                return false;
            }

        }
    );
}


// Fill Arrival Date if empty
function fillMissingDates() {

    const arrivalDate = document.getElementById( "arrivalDate");

    if (!arrivalDate) return;

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (!arrivalDate.value) {
        arrivalDate.value = today;
    }
}


// =====================================================
// ON-SITE / OFF-SITE STATUS
// =====================================================

function setupOnsiteStatus() {

    const departureDate =
        document.getElementById(
            "departureDate"
        );

    const onsiteStatus =
        document.getElementById(
            "onsiteStatus"
        );

    if (!departureDate || !onsiteStatus) {
        return;
    }


    function updateStatus() {
        onsiteStatus.value =
            departureDate.value
                ? "Off-Site"
                : "On-Site";
    }

    departureDate.addEventListener(
        "change",
        updateStatus
    );

    updateStatus();
}