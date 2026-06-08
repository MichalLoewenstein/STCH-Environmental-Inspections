function checkOther(selectElement) {
    const container = selectElement.closest(".input-row");
    const input = container.querySelector(".other-input");

    const isOther = selectElement.value === "Other";

    input.style.display = isOther ? "inline-block" : "none";
    input.required = isOther;

    if (!isOther) input.value = "";
}

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ generator.js loaded");

    // ✅ Auto-fill date
    const dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // ✅ Run duration calculation
    function calculateTotalTime() {
        const startEl = document.getElementById("start_time");
        const stopEl = document.getElementById("stop_time");
        const runDurationEl = document.getElementById("run_duration");

        if (!startEl || !stopEl || !runDurationEl) return;

        let start = startEl.value;
        let stop = stopEl.value;

        if (!start || !stop) return;

        let [sh, sm] = start.split(":");
        let [eh, em] = stop.split(":");

        let startMinutes = (+sh * 60) + (+sm);
        let stopMinutes = (+eh * 60) + (+em);

        if (stopMinutes < startMinutes) {
            stopMinutes += 1440;
        }

        let total = stopMinutes - startMinutes;

        let hours = Math.floor(total / 60);
        let minutes = total % 60;

        runDurationEl.value = `${hours}:${String(minutes).padStart(2, "0")}`;
    }

    document.getElementById("start_time")?.addEventListener("change", calculateTotalTime);
    document.getElementById("stop_time")?.addEventListener("change", calculateTotalTime);

    // ✅ Generator → Starting Hours mapping
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
            const selected = this.value.toUpperCase();
            startingHours.textContent = generatorValues[selected] || "--";
        });
    }

});
let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;