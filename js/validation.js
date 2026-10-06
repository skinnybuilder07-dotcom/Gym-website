/**
 * Sai Fitness Gym - Form Validation Utilities
 */

const Validation = {
    isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase().trim());
    },

    isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone).trim());
    },

    isValidPassword(password) {
        return password && password.length >= 6;
    },

    showError(inputElement, message) {
        if (!inputElement) return;
        this.clearError(inputElement);
        inputElement.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        const parent = inputElement.parentElement;
        if (parent) {
            parent.appendChild(errorDiv);
        }
    },

    clearError(inputElement) {
        if (!inputElement) return;
        inputElement.classList.remove('is-invalid');
        const parent = inputElement.parentElement;
        if (parent) {
            const existingError = parent.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }
        }
    },

    clearAllErrors(formElement) {
        if (!formElement) return;
        const invalidInputs = formElement.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));
        const errors = formElement.querySelectorAll('.form-error');
        errors.forEach(err => err.remove());
    }
};
