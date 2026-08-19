// =====================================================
// ✅ DATE VALIDATION UTILITY
// =====================================================

/**
 * Validates and fills date fields on form submission
 * @param {Array} dateFields - Array of date input IDs to validate
 * @param {Array} excludeFields - Array of date input IDs to exclude from auto-fill (optional)
 */
function validateAndFillDates(dateFields, excludeFields = []) {
    const today = new Date().toISOString().split("T")[0];
    let hasErrors = false;

    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        if (!field) return; // Skip if field doesn't exist

        const value = field.value.trim();

        // ✅ If empty and not excluded, fill with today's date
        if (!value && !excludeFields.includes(fieldId)) {
            field.value = today;
            console.log(`✅ Auto-filled ${fieldId} with today's date: ${today}`);
            return;
        }

        // ✅ If not empty, validate format (YYYY-MM-DD)
        if (value) {
            if (!isValidDateFormat(value)) {
                field.setCustomValidity(`Invalid date format. Please use YYYY-MM-DD format.`);
                field.reportValidity();
                hasErrors = true;
            } else if (!isValidDate(value)) {
                field.setCustomValidity(`Invalid date. Please enter a valid date.`);
                field.reportValidity();
                hasErrors = true;
            } else {
                field.setCustomValidity(""); // Clear any previous error
            }
        }
    });

    return !hasErrors;
}

/**
 * Validates a single date field on change/blur
 * @param {HTMLElement} field - The date input element
 * @param {Boolean} allowEmpty - Whether to allow empty values (default: false)
 */
function validateDateField(field, allowEmpty = false) {
    const value = field.value.trim();

    // ✅ If empty and allowed, clear validation
    if (!value && allowEmpty) {
        field.setCustomValidity("");
        field.style.borderColor = "";
        return true;
    }

    // ✅ If empty and not allowed, show error
    if (!value && !allowEmpty) {
        field.setCustomValidity("Date is required");
        field.style.borderColor = "#d9534f";
        return false;
    }

    // ✅ If not empty, validate format and validity
    if (value) {
        if (!isValidDateFormat(value)) {
            field.setCustomValidity("Invalid date format. Use YYYY-MM-DD");
            field.style.borderColor = "#d9534f";
            return false;
        } else if (!isValidDate(value)) {
            field.setCustomValidity("Invalid date. Please enter a valid date.");
            field.style.borderColor = "#d9534f";
            return false;
        } else {
            field.setCustomValidity("");
            field.style.borderColor = "";
            return true;
        }
    }

    return true;
}

/**
 * Attaches validation listeners to date fields on change/blur
 * @param {Array} dateFields - Array of date input IDs
 * @param {Array} allowEmptyFields - Date input IDs that can be left empty
 */
function attachDateValidationListeners(dateFields, allowEmptyFields = []) {
    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        if (!field) return;

        const allowEmpty = allowEmptyFields.includes(fieldId);

        // Validate on blur
        field.addEventListener("blur", function() {
            validateDateField(this, allowEmpty);
        });

        // Clear error styling on focus
        field.addEventListener("focus", function() {
            this.style.borderColor = "";
        });
    });
}

/**
 * Checks if date string follows YYYY-MM-DD format
 */
function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

/**
 * Checks if date is a valid calendar date
 */
function isValidDate(dateString) {
    const date = new Date(dateString + "T00:00:00Z");
    return date instanceof Date && !isNaN(date);
}
