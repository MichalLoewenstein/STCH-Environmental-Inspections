document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".has-other").forEach(select => {
    const syncOtherInput = () => {
      const container = select.closest(".input-row");
      const otherInput = container?.querySelector(".other-input");

      if (!otherInput) return;

      const isOther = select.value === "Other";
      otherInput.style.display = isOther ? "block" : "none";

      if (isOther) {
        otherInput.setAttribute("required", "required");
      } else {
        otherInput.removeAttribute("required");
        otherInput.value = "";
      }
    };

    select.addEventListener("change", syncOtherInput);
    syncOtherInput();
  });

});