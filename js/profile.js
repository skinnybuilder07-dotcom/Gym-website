/**
 * Sai Fitness Gym - Profile Page Module
 * Manages profile display, edit, image change, and persistence in LocalStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = StorageManager.get(StorageKeys.USER);
    if (!currentUser) {
        // Fallback default
        currentUser = {
            id: 'MEM-8821',
            fullName: 'Alexander Wright',
            email: 'alexander.wright@example.com',
            phone: '+1 (555) 234-5678',
            dob: '1990-05-15',
            gender: 'Male',
            membershipPlan: 'Performance',
            startDate: '2026-01-01',
            expiryDate: '2026-12-31',
            status: 'Active',
            height: '182 cm',
            weight: '78 kg',
            fitnessGoal: 'Hypertrophy & Athletic Endurance',
            experience: 'Intermediate',
            emergencyName: 'Victoria Wright',
            emergencyPhone: '+1 (555) 987-6543',
            photo: 'assets/images/trainer1.jpg'
        };
        StorageManager.set(StorageKeys.USER, currentUser);
    }

    const nameDisplay = document.getElementById('prof-display-name');
    const planDisplay = document.getElementById('prof-display-plan');
    const idDisplay = document.getElementById('prof-display-id');
    const avatarImg = document.getElementById('prof-avatar-img');

    const inputName = document.getElementById('edit-fullname');
    const inputEmail = document.getElementById('edit-email');
    const inputPhone = document.getElementById('edit-phone');
    const inputDob = document.getElementById('edit-dob');
    const inputGender = document.getElementById('edit-gender');
    const inputHeight = document.getElementById('edit-height');
    const inputWeight = document.getElementById('edit-weight');
    const inputGoal = document.getElementById('edit-goal');
    const inputExp = document.getElementById('edit-exp');
    const inputEmergName = document.getElementById('edit-emerg-name');
    const inputEmergPhone = document.getElementById('edit-emerg-phone');

    const profileForm = document.getElementById('profile-edit-form');
    const changePhotoBtn = document.getElementById('btn-change-photo');
    const filePhotoInput = document.getElementById('input-photo-file');

    function populateForm() {
        if (nameDisplay) nameDisplay.textContent = currentUser.fullName;
        if (planDisplay) planDisplay.textContent = currentUser.membershipPlan + ' Member';
        if (idDisplay) idDisplay.textContent = 'ID: ' + currentUser.id;
        if (avatarImg && currentUser.photo) avatarImg.src = currentUser.photo;

        if (inputName) inputName.value = currentUser.fullName || '';
        if (inputEmail) inputEmail.value = currentUser.email || '';
        if (inputPhone) inputPhone.value = currentUser.phone || '';
        if (inputDob) inputDob.value = currentUser.dob || '';
        if (inputGender) inputGender.value = currentUser.gender || 'Male';
        if (inputHeight) inputHeight.value = currentUser.height || '';
        if (inputWeight) inputWeight.value = currentUser.weight || '';
        if (inputGoal) inputGoal.value = currentUser.fitnessGoal || '';
        if (inputExp) inputExp.value = currentUser.experience || 'Intermediate';
        if (inputEmergName) inputEmergName.value = currentUser.emergencyName || '';
        if (inputEmergPhone) inputEmergPhone.value = currentUser.emergencyPhone || '';
    }

    populateForm();

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Validation.clearAllErrors(profileForm);

            let isValid = true;
            if (!inputName || !inputName.value.trim()) {
                Validation.showError(inputName, 'Full Name is required');
                isValid = false;
            }
            if (!inputEmail || !Validation.isValidEmail(inputEmail.value)) {
                Validation.showError(inputEmail, 'Valid Email is required');
                isValid = false;
            }

            if (!isValid) return;

            // Update user object
            currentUser.fullName = inputName.value.trim();
            currentUser.email = inputEmail.value.trim();
            currentUser.phone = inputPhone ? inputPhone.value.trim() : '';
            currentUser.dob = inputDob ? inputDob.value : '';
            currentUser.gender = inputGender ? inputGender.value : 'Male';
            currentUser.height = inputHeight ? inputHeight.value.trim() : '';
            currentUser.weight = inputWeight ? inputWeight.value.trim() : '';
            currentUser.fitnessGoal = inputGoal ? inputGoal.value.trim() : '';
            currentUser.experience = inputExp ? inputExp.value : 'Intermediate';
            currentUser.emergencyName = inputEmergName ? inputEmergName.value.trim() : '';
            currentUser.emergencyPhone = inputEmergPhone ? inputEmergPhone.value.trim() : '';

            // Save to LocalStorage
            StorageManager.set(StorageKeys.USER, currentUser);

            // Also update in users list array
            const usersList = StorageManager.get(StorageKeys.USERS) || [];
            const updatedUsers = usersList.map(u => u.id === currentUser.id ? { ...u, fullName: currentUser.fullName, email: currentUser.email, phone: currentUser.phone } : u);
            StorageManager.set(StorageKeys.USERS, updatedUsers);

            populateForm();

            if (window.Toast) {
                Toast.show('Profile updated successfully!', 'success');
            }
        });
    }

    if (changePhotoBtn && filePhotoInput) {
        changePhotoBtn.addEventListener('click', () => {
            filePhotoInput.click();
        });

        filePhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentUser.photo = event.target.result;
                    StorageManager.set(StorageKeys.USER, currentUser);
                    if (avatarImg) avatarImg.src = currentUser.photo;
                    Toast.show('Profile photo updated.', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
