document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll('input[type="checkbox"]');

  toggles.forEach(toggle => {
    // מוצא את ה-hidden לפי שם ה-checkbox בלי _cb
    const baseName = toggle.name.replace("_cb", "");
    const hidden = document.querySelector(`input[name="${baseName}"]`);

    if (hidden) {
      hidden.value = "OFF"; // ברירת מחדל

      toggle.addEventListener("change", function () {
        hidden.value = toggle.checked ? "ON" : "OFF";
        console.log(toggle.name,"->",hidden.value)
      });
    }
  });
});

document.querySelector("form").addEventListener("submit", function () {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  toggles.forEach(toggle => {
    const baseName = toggle.name.replace("_cb", "");
    const hidden = document.querySelector(`input[name="${baseName}"]`);
    if (hidden) {
      hidden.value = toggle.checked ? "ON" : "OFF";
    }
  });
});
