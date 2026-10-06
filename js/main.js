/**
 * Sai Fitness Gym - Main UI & Global Utilities (Bootstrap 5 Integrated)
 */

window.Toast = {
    container: null,
    
    init() {
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    },

    show(message, type = 'info', duration = 3500) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;

        const iconMap = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };

        toast.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <span class="toast-icon me-2 fw-bold">${iconMap[type] || 'ℹ'}</span>
                <div class="toast-content flex-grow-1">${message}</div>
                <button class="btn-close btn-close-white ms-2 toast-close" aria-label="Close Toast"></button>
            </div>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Toast.init();

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Validation.clearAllErrors(contactForm);

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            if (!nameInput || !nameInput.value.trim()) {
                Validation.showError(nameInput, 'Full Name is required');
                isValid = false;
            }

            if (!emailInput || !Validation.isValidEmail(emailInput.value)) {
                Validation.showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (!subjectInput || !subjectInput.value.trim()) {
                Validation.showError(subjectInput, 'Subject is required');
                isValid = false;
            }

            if (!messageInput || !messageInput.value.trim()) {
                Validation.showError(messageInput, 'Message cannot be empty');
                isValid = false;
            }

            if (!isValid) return;

            // Store enquiry in LocalStorage
            const enquiries = StorageManager.get(StorageKeys.ENQUIRIES) || [];
            const newEnquiry = {
                id: 'ENQ-' + Math.floor(100 + Math.random() * 900),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : 'N/A',
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim(),
                date: new Date().toISOString().split('T')[0],
                status: 'New'
            };
            enquiries.unshift(newEnquiry);
            StorageManager.set(StorageKeys.ENQUIRIES, enquiries);

            contactForm.reset();

            // Trigger Bootstrap Modal if present
            const modalElem = document.getElementById('thankYouModal');
            if (modalElem && window.bootstrap) {
                const bsModal = bootstrap.Modal.getOrCreateInstance(modalElem);
                bsModal.show();
            } else {
                Toast.show('Thank you. Your enquiry has been received.', 'success', 5000);
            }
        });
    }

    // Timetable Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const classRows = document.querySelectorAll('.timetable-row');
    if (filterButtons.length > 0 && classRows.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                classRows.forEach(row => {
                    const rowCategory = row.getAttribute('data-category');
                    const rowDay = row.getAttribute('data-day');

                    if (filterValue === 'all' || rowCategory === filterValue || rowDay === filterValue) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
});
