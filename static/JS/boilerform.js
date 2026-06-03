
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", () => {
  console.log(toggle.checked ? "ON" : "OFF");
});
