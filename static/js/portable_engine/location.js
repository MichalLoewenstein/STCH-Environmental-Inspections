// =====================================================
// LOCATIONS
// =====================================================


// Load locations from JSON API
function loadLocations() {

    return fetch("/api/location")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    `Unable to load locations: ${response.status}`
                );
            }
            return response.json();
        })

        .then(locations => {
            const dropdown = document.getElementById( "location" );

            if (!dropdown) return;

            dropdown.innerHTML = `
                <option value="" disabled selected>
                    Select Location
                </option>
            `;


            locations.forEach(location => {
                const option = document.createElement( "option");
                option.value = location;
                option.textContent = location;
                dropdown.appendChild(option);
            });


            // Add Other
            const otherOption =document.createElement("option");
            otherOption.value = "Other";
            otherOption.textContent = "Other";
            dropdown.appendChild(
                otherOption
            );
        })

        .catch(error => {
            console.error(
                "Location fetch error:",
                error
            );
        });
}


// Attach location listener
function setupLocationListeners() {
    document.getElementById("location") ?.addEventListener("change", handleOtherLocation);
    document.getElementById("other_location") ?.addEventListener( "input",
            function () {
                this.setCustomValidity("");
            }
        );
}


// Show/hide Other Location
function handleOtherLocation() {
    const dropdown = document.getElementById("location");
    const otherInput =document.getElementById("other_location");

    if (!dropdown || !otherInput) {
        return;
    }

    if (dropdown.value === "Other") {

        otherInput.style.display = "block";
        otherInput.required = true;
        otherInput.focus();

    } else {

        otherInput.style.display = "none";
        otherInput.required = false;
        otherInput.value = "";
        otherInput.setCustomValidity("");
    }
}