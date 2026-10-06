/**
 * Sai Fitness Gym - Authentication Module
 * Pure frontend demo simulation using LocalStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Member Login Form Handler
    const memberLoginForm = document.getElementById('member-login-form');
    if (memberLoginForm) {
        memberLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Validation.clearAllErrors(memberLoginForm);

            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const rememberCheck = document.getElementById('login-remember');

            let isValid = true;

            if (!emailInput || !Validation.isValidEmail(emailInput.value)) {
                Validation.showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (!passwordInput || !Validation.isValidPassword(passwordInput.value)) {
                Validation.showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            // Frontend simulation login check
            const users = StorageManager.get(StorageKeys.USERS) || [];
            let foundUser = users.find(u => u.email.toLowerCase() === emailInput.value.toLowerCase().trim());

            if (!foundUser) {
                // If demo user doesn't exist, create a demo session user object
                foundUser = {
                    id: 'MEM-' + Math.floor(1000 + Math.random() * 9000),
                    fullName: emailInput.value.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    email: emailInput.value.trim(),
                    phone: '+1 (555) 019-2831',
                    membershipPlan: 'Performance',
                    startDate: '2026-01-01',
                    expiryDate: '2026-12-31',
                    status: 'Active',
                    height: '178 cm',
                    weight: '74 kg',
                    fitnessGoal: 'General Athletic Fitness',
                    experience: 'Intermediate',
                    emergencyName: 'Contact Person',
                    emergencyPhone: '+1 (555) 999-0000',
                    photo: 'assets/images/trainer1.jpg'
                };
            }

            // Store active member session in LocalStorage (never store passwords)
            StorageManager.set(StorageKeys.USER, foundUser);

            if (window.Toast) {
                Toast.show('Welcome back! Login successful.', 'success');
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    // 2. Member Register Form Handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Validation.clearAllErrors(registerForm);

            const fullNameInput = document.getElementById('reg-fullname');
            const emailInput = document.getElementById('reg-email');
            const phoneInput = document.getElementById('reg-phone');
            const passwordInput = document.getElementById('reg-password');
            const confirmInput = document.getElementById('reg-confirm');
            const dobInput = document.getElementById('reg-dob');
            const genderInput = document.getElementById('reg-gender');
            const planInput = document.getElementById('reg-plan');

            let isValid = true;

            if (!fullNameInput || !fullNameInput.value.trim()) {
                Validation.showError(fullNameInput, 'Full Name is required');
                isValid = false;
            }

            if (!emailInput || !Validation.isValidEmail(emailInput.value)) {
                Validation.showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (!phoneInput || !Validation.isValidPhone(phoneInput.value)) {
                Validation.showError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            }

            if (!passwordInput || !Validation.isValidPassword(passwordInput.value)) {
                Validation.showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!confirmInput || confirmInput.value !== passwordInput.value) {
                Validation.showError(confirmInput, 'Passwords do not match');
                isValid = false;
            }

            if (!isValid) return;

            // Create new member demo record
            const newMember = {
                id: 'MEM-' + Math.floor(1000 + Math.random() * 9000),
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput ? dobInput.value : '',
                gender: genderInput ? genderInput.value : 'Not specified',
                membershipPlan: planInput ? planInput.value : 'Essential',
                startDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
                status: 'Active',
                height: '175 cm',
                weight: '70 kg',
                fitnessGoal: 'Overall Strength & Wellness',
                experience: 'Beginner',
                emergencyName: 'Emergency Contact',
                emergencyPhone: phoneInput.value.trim(),
                photo: 'assets/images/trainer1.jpg'
            };

            // Store in Users list & Current session
            const users = StorageManager.get(StorageKeys.USERS) || [];
            users.push(newMember);
            StorageManager.set(StorageKeys.USERS, users);
            StorageManager.set(StorageKeys.USER, newMember);

            if (window.Toast) {
                Toast.show('Registration complete! Welcome to Sai Fitness Gym.', 'success');
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    // 3. Admin Login Form Handler
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Validation.clearAllErrors(adminLoginForm);

            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');

            let isValid = true;

            if (!emailInput || !Validation.isValidEmail(emailInput.value)) {
                Validation.showError(emailInput, 'Please enter admin email');
                isValid = false;
            }

            if (!passwordInput || passwordInput.value.length < 4) {
                Validation.showError(passwordInput, 'Enter admin password');
                isValid = false;
            }

            if (!isValid) return;

            // Demo Admin Login Session
            const adminSession = {
                name: 'Administrator',
                email: emailInput.value.trim(),
                role: 'Head Administrator',
                loginTime: new Date().toLocaleTimeString()
            };

            StorageManager.set(StorageKeys.ADMIN, adminSession);

            if (window.Toast) {
                Toast.show('Admin Authentication Granted.', 'success');
            }

            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 800);
        });
    }
});

// Logout Helper Function
function handleLogout() {
    StorageManager.remove(StorageKeys.USER);
    StorageManager.remove(StorageKeys.ADMIN);
    if (window.Toast) {
        Toast.show('Logged out successfully.', 'info');
    }
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
}
