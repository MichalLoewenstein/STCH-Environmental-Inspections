let engines = [];

document.addEventListener("DOMContentLoaded", function () {

    console.log("Portable Engine JS loaded");

    // Date validation
    attachDateValidationListeners(
        [
            "arrivalDate",
            "date",
            "departureDate",
            "manufactureDate"
        ],
        [
            "arrivalDate",
            "date",
            "departureDate",
            "manufactureDate"
        ]
    );

    // Set up sections
    setupMeterSection();
    setupFormValidation();
    setupOnsiteStatus();

    // Load dropdown/API data
    Promise.all([
        loadEngines(),
        loadEquipment(),
        loadLocations(),
        setupOperator("portable_engine")
    ]).then(() => {

        setupEquipmentListeners();
        setupLocationListeners();

    }).catch(error => {
        console.error(
            "Portable Engine startup error:",
            error
        );
    });

});