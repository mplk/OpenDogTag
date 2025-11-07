import $ from 'jquery';

function validateEmail(email) {
    if (!email) return true; // Allow empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    if (!phone) return true; // Allow empty values
    // Allow digits, spaces, +, -, (, )
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    // Must have at least 3 digits
    const digitCount = (phone.match(/\d/g) || []).length;
    return phoneRegex.test(phone) && digitCount >= 3;
}

// Removed unused validateNumber function

export function validateInput(input) {
    const $input = $(input);
    const id = $input.attr('id');
    const value = $input.val();
    let isValid = true;

    // For number inputs, check HTML5 validity
    if (id === 'height-input' || id === 'weight-input') {
        // Check if the browser considers it valid (handles text input automatically)
        if (input.validity && !input.validity.valid) {
            isValid = false;
        } else {
            // Empty is valid (optional field)
            $input.removeClass('is-invalid is-valid');
            return true;
        }
    } else {
        // Skip validation for empty optional fields
        if (!value || value === '') {
            $input.removeClass('is-invalid is-valid');
            return true;
        }

        // Validate based on input type
        if (id.includes('Email')) {
            isValid = validateEmail(value);
        } else if (id.includes('Phone')) {
            isValid = validatePhone(value);
        }
    }

    // Update visual feedback
    if (isValid) {
        $input.removeClass('is-invalid').addClass('is-valid');
    } else {
        $input.removeClass('is-valid').addClass('is-invalid');
    }

    return isValid;
}