// Registration Handler for CAITED 2026 Conference
class RegistrationHandler {
    constructor() {
        this.apiBaseUrl = '/api/registration';
        this.form = document.getElementById('registrationForm');
        this.submitButton = null;
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Update submit button reference
        this.submitButton = this.form.querySelector('button[type="submit"]');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous messages
        this.clearMessages();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Disable submit button
        this.setSubmitButtonState(true, 'Inscription en cours...');

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Submit registration
            const response = await this.submitRegistration(formData);
            
            if (response.success) {
                this.showSuccessMessage(response.message);
                this.form.reset();
                // Optionally scroll to top or redirect
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                this.showErrorMessage(response.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showErrorMessage('Erreur de connexion. Veuillez réessayer.');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            institution: formData.get('institution'),
            category: formData.get('category'),
            days: [],
            comments: formData.get('comments')
        };

        // Collect selected days
        const dayChecks = this.form.querySelectorAll('input[name="days"]:checked');
        dayChecks.forEach(check => {
            data.days.push(check.value);
        });

        return data;
    }

    async submitRegistration(data) {
        const response = await fetch(`${this.apiBaseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

    validateForm() {
        let isValid = true;
        
        // Clear previous errors
        this.clearAllErrors();

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'institution', 'category'];
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field.value.trim()) {
                this.showFieldError(field, 'Ce champ est requis');
                isValid = false;
            }
        });

        // Validate email format
        const emailField = this.form.querySelector('[name="email"]');
        if (emailField.value.trim() && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Format d\'email invalide');
            isValid = false;
        }

        // Validate at least one day selected
        const dayChecks = this.form.querySelectorAll('input[name="days"]:checked');
        if (dayChecks.length === 0) {
            this.showErrorMessage('Veuillez sélectionner au moins un jour de participation');
            isValid = false;
        }

        // Validate terms acceptance
        const termsCheckbox = this.form.querySelector('#terms');
        if (!termsCheckbox.checked) {
            this.showErrorMessage('Vous devez accepter les conditions générales');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        // Clear previous error for this field
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Ce champ est requis');
            return false;
        }

        // Email validation
        if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Format d\'email invalide');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    clearAllErrors() {
        const errorFields = this.form.querySelectorAll('.is-invalid');
        errorFields.forEach(field => this.clearFieldError(field));
    }

    clearMessages() {
        const alerts = this.form.parentNode.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }

    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at the top of the form
        this.form.parentNode.insertBefore(alertDiv, this.form);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 10000);
    }

    showErrorMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at the top of the form
        this.form.parentNode.insertBefore(alertDiv, this.form);
    }

    setSubmitButtonState(loading, loadingText = 'Chargement...') {
        if (this.submitButton) {
            if (loading) {
                this.submitButton.disabled = true;
                this.submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    ${loadingText}
                `;
            } else {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = 'S\'inscrire Maintenant';
            }
        }
    }
}

// Initialize registration handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationHandler();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationHandler;
}