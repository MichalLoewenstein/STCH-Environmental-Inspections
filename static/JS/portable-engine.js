document.addEventListener("DOMContentLoaded", function () {

    function calculateTotal() {


            // Time Calculation //
        const initial = parseFloat(document.getElementById("initialMeterRead").value) || 0;
        const final = parseFloat(document.getElementById("finalMeterRead").value) || 0;

        if (final >= initial) {
            const total = final - initial;
            document.getElementById("total_time").value = total.toFixed(2);
        } else {
            document.getElementById("total_time").value = "Invalid";
        }
    }
    // Trigger calculation when values change
    document.getElementById("initialMeterRead").addEventListener("input", calculateTotal);
    document.getElementById("finalMeterRead").addEventListener("input", calculateTotal);

    // On-Site Status //
    const departureDate = document.getElementById("departureDate");
    const onsiteStatus = document.getElementById("onsiteStatus");

    function updateStatus() {

        if (departureDate.value) {
            // If there is a date → Off-Site
            onsiteStatus.value = "Off-Site";
        } else {
            // If empty → On-Site
            onsiteStatus.value = "On-Site";
        }
    }

    // Run on page load
    updateStatus();

    // Run whenever the date changes
    departureDate.addEventListener("change", updateStatus);

})