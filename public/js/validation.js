// Get references to the form and input elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Get references to error message elements
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

/**
 * Validates a single input field for being required.
 * Applies Tailwind CSS classes and shows/hides error message.
 * @param {HTMLElement} inputElement - The input field DOM element.
 * @param {HTMLElement} errorElement - The paragraph element for the error message.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateRequiredField(inputElement, errorElement) {
    const value = inputElement.value.trim(); // Get value and remove leading/trailing spaces

    // Reset styles first
    inputElement.classList.remove('input-error', 'input-success');
    errorElement.classList.add('hidden'); // Hide error message

    if (value === '') {
        // If empty, show error styles and message
        inputElement.classList.add('input-error');
        errorElement.classList.remove('hidden');
        return false; // Not valid
    } else {
        // If not empty, show success style
        inputElement.classList.add('input-success');
        return true; // Valid
    }
}

// --- Event Listeners ---

// Validate email field on user input and when they leave the field
emailInput.addEventListener('input', () => validateRequiredField(emailInput, emailError));
emailInput.addEventListener('blur', () => validateRequiredField(emailInput, emailError));

// Validate password field on user input and when they leave the field
passwordInput.addEventListener('input', () => validateRequiredField(passwordInput, passwordError));
passwordInput.addEventListener('blur', () => validateRequiredField(passwordInput, passwordError));


// Handle form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the browser from submitting the form normally

    // Run validation for each field and store the result
    const isEmailValid = validateRequiredField(emailInput, emailError);
    const isPasswordValid = validateRequiredField(passwordInput, passwordError);

    // Check if ALL fields are valid
    if (isEmailValid && isPasswordValid) {
        alert('Form submitted successfully! (You would send data to a server here)');
        loginForm.reset(); // Clear the form after successful submission
        // Optional: Reset styles after successful submission
        emailInput.classList.remove('input-success');
        passwordInput.classList.remove('input-success');
    } else {
        // If validation fails, focus on the first invalid field for better UX
        if (!isEmailValid) {
            emailInput.focus();
        } else if (!isPasswordValid) {
            passwordInput.focus();
        }
    }
});