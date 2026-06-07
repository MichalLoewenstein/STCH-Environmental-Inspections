const toggles = document.querySelectorAll('input[type="checkbox"]');

toggles.forEach(toggle => {
  toggle.addEventListener("change", () => {
    console.log(toggle.name + ": " + (toggle.checked ? "ON" : "OFF"));
  });
});


  const radios = document.querySelectorAll('input[name="time"]');
  const message = document.getElementById("autoSelectMsg");

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let closestRadio = null;
  let smallestDiff = Infinity;

  radios.forEach(radio => {
    const [hour, minute] = radio.value.split(":").map(Number);
    const optionMinutes = hour * 60 + minute;

    let diff = Math.abs(currentMinutes - optionMinutes);
    diff = Math.min(diff, 1440 - diff);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestRadio = radio;
    }
  });

  if (closestRadio) {
    closestRadio.checked = true;
    if (message) {
      message.textContent = "Time auto-selected based on your device time.";
    }
  }

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (message) message.textContent = "";
    });
  });
