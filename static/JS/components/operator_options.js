// // Operator dropdown component.
// // This component is shared by forms that use the Operator field.
// //
// // It:
// // 1. Loads operators from the correct JSON file through the Flask API.
// // 2. Adds the operators to the dropdown.
// // 3. Adds "Other" to the dropdown.
// // 4. Shows the other_operator input when "Other" is selected.
// //
// // Saving a new operator is handled by the Flask POST route.


// function setupOperator(formName) {

//   // Get the Operator dropdown.
//   const operatorDropdown = document.getElementById("operator");

//   // Get the input used when the user selects "Other".
//   const otherOperatorInput = document.getElementById("other_operator");


//   // Stop if the Operator fields do not exist on this page.
//   if (!operatorDropdown || !otherOperatorInput) {
//     console.warn("Operator fields were not found on this page.");
//     return Promise.resolve();
//   }


//   // Show or hide the Other Operator input.
//   function updateOtherOperatorVisibility() {

//     const isOther = operatorDropdown.value === "Other";

//     if (isOther) {

//       // Show the manual Operator input.
//       otherOperatorInput.style.display = "";

//       // Make the field required.
//       otherOperatorInput.required = true;

//       // Move the cursor into the field.
//       otherOperatorInput.focus();

//     } else {

//       // Hide the manual Operator input.
//       otherOperatorInput.style.display = "none";

//       // The field does not need to be required.
//       otherOperatorInput.required = false;

//       // Clear any previous value.
//       otherOperatorInput.value = "";
//     }
//   }
  


//   // Run the show/hide logic whenever the Operator dropdown changes.
//   //
//   // This must be BEFORE "return fetch()" so the code is reachable.
//   operatorDropdown.addEventListener(
//     "change",
//     updateOtherOperatorVisibility
//   );


//   // Set the correct visibility when the page first loads.
//   updateOtherOperatorVisibility();

//   return fetch(`/api/operators/${formName}`)

//     .then(response => {

//       // Stop if Flask returned an error.
//       if (!response.ok) {
//         throw new Error(
//           `Unable to load operators for ${formName}.`
//         );
//       }

//       return response.json();
//     })

//     .then(operators => {

//       console.log(
//         `Operators loaded for ${formName}:`,
//         operators
//       );


//       // Clear the dropdown and add the default option.
//       operatorDropdown.innerHTML =
//         '<option value="" disabled selected>Select Operator</option>';


//       // Add each operator returned by Flask.
//       operators.forEach(operator => {

//         const option = document.createElement("option");

//         option.value = operator;
//         option.textContent = operator;

//         operatorDropdown.appendChild(option);
//       });


//       // Add "Other" at the bottom of the dropdown.
//       const otherOption = document.createElement("option");

//       otherOption.value = "Other";
//       otherOption.textContent = "Other";

//       operatorDropdown.appendChild(otherOption);


//       // Make sure the Other input has the correct visibility
//       // after the dropdown finishes loading.
//       updateOtherOperatorVisibility();
//     })

//     .catch(error => {

//       console.error(
//         `Error loading operators for ${formName}:`,
//         error
//       );

//     });
// }


function setupOperator(formName) {

  const operatorDropdown = document.getElementById("operator");
  const otherOperatorInput = document.getElementById("other_operator");

  // Store operators loaded from the JSON file.
  let operators = [];


  if (!operatorDropdown || !otherOperatorInput) {
    console.warn("Operator fields were not found on this page.");
    return Promise.resolve();
  }


  function updateOtherOperatorVisibility() {

    const isOther = operatorDropdown.value === "Other";

    if (isOther) {

      otherOperatorInput.style.display = "";
      otherOperatorInput.required = true;
      otherOperatorInput.focus();

    } else {

      otherOperatorInput.style.display = "none";
      otherOperatorInput.required = false;
      otherOperatorInput.value = "";

      // Remove any previous duplicate warning.
      otherOperatorInput.setCustomValidity("");
    }
  }


  // Check if the operator entered under "Other"
  // already exists in the operator list.
  function validateNewOperator() {

    const enteredOperator = otherOperatorInput.value
      .trim()
      .toLowerCase();

    // Do not show a duplicate warning while the field is empty.
    if (!enteredOperator) {
      otherOperatorInput.setCustomValidity("");
      return;
    }


    // Compare the entered value with all existing operators.
    // Comparison is case-insensitive and ignores spaces
    // before and after the name.
    const operatorExists = operators.some(operator =>
      operator.trim().toLowerCase() === enteredOperator
    );


    if (operatorExists) {

      // Prevent the form from submitting.
      otherOperatorInput.setCustomValidity(
        "This operator already exists. Please select it from the Operator list."
      );

    } else {

      // Operator does not exist, so the value is valid.
      otherOperatorInput.setCustomValidity("");
    }
  }


  // Show/hide the Other Operator field.
  operatorDropdown.addEventListener(
    "change",
    updateOtherOperatorVisibility
  );


  // Check for duplicates while the user types.
  otherOperatorInput.addEventListener(
    "input",
    validateNewOperator
  );


  updateOtherOperatorVisibility();


  // Load operators from the Flask API.
  return fetch(`/api/operators/${formName}`)

    .then(response => {

      if (!response.ok) {
        throw new Error(
          `Unable to load operators for ${formName}.`
        );
      }

      return response.json();
    })

    .then(data => {

      // Save the list so we can use it for duplicate validation.
      operators = data;

      console.log(
        `Operators loaded for ${formName}:`,
        operators
      );


      // Clear the dropdown and add the placeholder.
    //   operatorDropdown.innerHTML =
    //     '<option value="" disabled selected>Select Operator</option>';
    const placeholderText =
    formName === "generator"? "Select Inspector":
     formName === "paint"? "Select Name":
      "Select Operator";

    operatorDropdown.innerHTML =
    `<option value="" disabled selected>${placeholderText}</option>`;

      // Add existing operators.
      operators.forEach(operator => {

        const option = document.createElement("option");

        option.value = operator;
        option.textContent = operator;

        operatorDropdown.appendChild(option);
      });


      // Add Other at the bottom.
      const otherOption = document.createElement("option");

      otherOption.value = "Other";
      otherOption.textContent = "Other";

      operatorDropdown.appendChild(otherOption);


      updateOtherOperatorVisibility();
    })

    .catch(error => {

      console.error(
        `Error loading operators for ${formName}:`,
        error
      );

    });
}