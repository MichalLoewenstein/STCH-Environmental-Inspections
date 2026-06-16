document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".has-other").forEach(select => {
    select.addEventListener("change", function () {

      const container = this.closest(".input-row");
      const otherInput = container.querySelector(".other-input");

      if (!otherInput) return;

      if (this.value === "Other") {
        otherInput.style.display = "block";
      } else {
        otherInput.style.display = "none";
        otherInput.value = "";
      }

    });
  });

});