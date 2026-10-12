document.addEventListener("DOMContentLoaded", () => {

  // Attach date validation listeners
  attachDateValidationListeners(["date"]);

  setupOperator("ceb_flare");

  // -----------------------------
  // Maintenance Comments Required
  // -----------------------------
  const maintainComplete = document.getElementById("maintaincomplete");
  const comments = document.getElementById("comments");

  function updateCommentsRequired() {
    if (maintainComplete.value === "No") {
      comments.required = true;
      comments.placeholder = "Comments required when maintenance is not complete";
    } else {
      comments.required = false;
      comments.placeholder = "Comments";
    }
  }

  maintainComplete.addEventListener("change", updateCommentsRequired);

  // Run once when page loads
  updateCommentsRequired();


  // -----------------------------
  // Form Submit Validation
  // -----------------------------
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function(event) {

      const dateFields = ["date"];
      const isDateValid = validateAndFillDates(dateFields);

      if (!isDateValid) {
        event.preventDefault();
        return false;
      }
    });
  }
});

