document.addEventListener("DOMContentLoaded", function () {
function calculateTotal() {
    const initial = parseFloat(document.getElementById("initialMeterRead").value) || 0;
    const final = parseFloat(document.getElementById("finalMeterRead").value) || 0;

    if (final >= initial) {
        const total = final - initial;
        document.getElementById("total_time").value = total.toFixed(1);
    } else {
        document.getElementById("total_time").value = "Invalid";
    }
}

// Trigger calculation when values change
document.getElementById("initialMeterRead").addEventListener("input", calculateTotal);
document.getElementById("finalMeterRead").addEventListener("input", calculateTotal);
})