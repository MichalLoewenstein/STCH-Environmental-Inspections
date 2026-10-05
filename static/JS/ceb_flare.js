
document.addEventListener("DOMContentLoaded", () => {

  // ✅ Attach date validation listeners
  attachDateValidationListeners(["date"]);
  // -----------------------------
  // Form Submit Validation
  // -----------------------------
  const form = document.querySelector("form");

  if (form) {

    form.addEventListener("submit", function(event) {
      const dateFields = ["date"];
      const isDateValid =
        validateAndFillDates(dateFields);
      if (!isDateValid) {
        event.preventDefault();
        return false;
      }
    });
  }
  // -----------------------------
  // Responsive Table
  // -----------------------------
  if (window.innerWidth <= 600) {
    const table =
      document.querySelector(".responsive-table");
    // Only continue if table exists
    if (table) {
      const headers =
        table.querySelectorAll("thead th");
      const values =
        table.querySelectorAll("tbody td");
      let newHTML = "";
      for (let i = 1; i < headers.length; i++) {
        newHTML += `
          <div style="
            border:1px solid #ccc;
            padding:10px;
            margin-bottom:10px;
            border-radius:6px;
          ">
            <div style="font-weight:600;">
              ${headers[0].innerText}:
            </div>
            <div>
              ${headers[i].innerText} SCFM
            </div>
            <div style="
              margin-top:8px;
              font-weight:600;
            ">
              ${values[0].innerText}:
            </div>
            <div>
              ${values[i].innerText}
            </div>
          </div>
        `;
      }
      table.outerHTML = newHTML;
    }
  }
  // -----------------------------
  // Operator
  // -----------------------------
  const operatorSelect =
    document.getElementById("operator");

  const otherOperator =
    document.getElementById("other_operator");


  if (operatorSelect && otherOperator) {

    // Load operators from JSON
    loadOperators();


    // Handle Operator change
    operatorSelect.addEventListener(
      "change",
      function () {

        console.log(
          "Operator selected:",
          this.value
        );


        // User selected Other
        if (this.value === "Other") {

          otherOperator.style.display = "block";

          otherOperator.required = true;

          otherOperator.focus();

        }

        // User selected existing operator
        else {

          otherOperator.style.display = "none";

          otherOperator.required = false;

          otherOperator.value = "";
        }

      }
    );
  }

});


// =====================================================
// Operator Auto-Fill Logic
// =====================================================

let operators = [];


function loadOperators() {

  fetch("/api/operators")

    .then(res => {

      if (!res.ok) {

        throw new Error(
          `HTTP error: ${res.status}`
        );

      }

      return res.json();

    })


    .then(data => {

      operators = data;

      console.log(
        "Operators loaded:",
        operators
      );

      console.log(
        "Operators loaded - Total count:",
        operators.length
      );


      const operatorSelect =
        document.getElementById("operator");


      if (!operatorSelect) {

        console.error(
          "Operator dropdown not found."
        );

        return;
      }


      // -----------------------------
      // Clear existing options
      // -----------------------------
      operatorSelect.innerHTML = "";


      // -----------------------------
      // Default option
      // -----------------------------
      const defaultOption =
        document.createElement("option");

      defaultOption.value = "";

      defaultOption.textContent =
        "Select Operator";

      defaultOption.disabled = true;

      defaultOption.selected = true;

      operatorSelect.appendChild(
        defaultOption
      );


      // -----------------------------
      // Operators from JSON
      // -----------------------------
      operators.forEach(operator => {

        const option =
          document.createElement("option");

        option.value = operator;

        option.textContent = operator;

        operatorSelect.appendChild(
          option
        );

      });


      // -----------------------------
      // Other option
      // -----------------------------
      const otherOption =
        document.createElement("option");

      otherOption.value = "Other";

      otherOption.textContent = "Other";

      operatorSelect.appendChild(
        otherOption
      );

    })


    .catch(err => {

      console.error(
        "Error loading operators:",
        err
      );

    });

}