document.addEventListener("DOMContentLoaded", function () {   
   
   // ✅ Auto-fill today's date
    let today = new Date().toISOString().split('T')[0];
    let dateInput = document.getElementById("date");

    if (dateInput) {
        dateInput.value = today;
    }
})

