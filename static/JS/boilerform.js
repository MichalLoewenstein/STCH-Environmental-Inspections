const toggles = document.querySelectorAll('input[type="checkbox"]');

toggles.forEach(toggle => {
  toggle.addEventListener("change", () => {
    console.log(toggle.name + ": " + (toggle.checked ? "ON" : "OFF"));
  });
});
