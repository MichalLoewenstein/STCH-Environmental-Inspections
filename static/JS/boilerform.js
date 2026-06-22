document.querySelector("form").addEventListener("submit", function () {
  const toggles = document.querySelectorAll('input[type="checkbox"]');

  toggles.forEach(toggle => {
    const hidden = document.querySelector(
      `input[name="${toggle.name}_hidden"]`
    );

    if (hidden) {
      hidden.value = toggle.checked ? "ON" : "OFF";
    }
  });
});