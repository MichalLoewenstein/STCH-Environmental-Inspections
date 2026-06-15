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

    const emissionsSelect = document.getElementById("emissions");
    const commentRow = document.getElementById("visibleEmissionCommentRow");

    function toggleEmissionComment() {
        

        if (emissionsSelect.value === "Yes") {
            commentRow.style.display = "";
        } else {
            commentRow.style.display = "none";
        }
    }

    emissionsSelect.addEventListener("change", toggleEmissionComment);



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
        updateClockRunHours();
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

            updateClockRunHours();
        });

    generatorSelect.dispatchEvent(new Event("change"))

    }

    // ✅ Add run duration + starting hours → clock run hours
    function updateClockRunHours() {
    const start = parseFloat(startingHours.textContent) || 0;
    const runDuration = document.getElementById("run_duration").value;

    let duration = 0;

    if (runDuration && runDuration.includes(":")) {
        const [hours, minutes] = runDuration.split(":").map(Number);
        duration = hours + (minutes / 60);
    }

    const total = start + duration;

    document.getElementById("clock_run_hours").value =
        total ? total.toFixed(2) : "";
}
});










    /// Display comment field only if visible emissions selected to Yes///
/*
    
function checkEmissions(selectElement) {
    const container = selectElement.closest(".input-row").parentElement;
    const commentRow = container.querySelector("visibleEmissionComment");

    const isYes = selectElement.value === "Yes";

    commentRow.style.display = isYes ? "block" : "none";

    const input = commentRow.querySelector("input");
    input.required = isYes;

    if (!isYes) input.value = "";
}


const emissionsSelect = document.getElementById("emissions");

emissionsSelect.addEventListener("change", function () {
    checkEmissions(this);
});

*/


  