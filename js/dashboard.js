/**
 * Sai Fitness Gym - Member Dashboard Module
 * Handles single-page section switching, data rendering, class booking, and stats.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure user is logged in for demo
    let currentUser = StorageManager.get(StorageKeys.USER);
    if (!currentUser) {
        // Fallback default user if accessed directly
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

    // 1. Sidebar Section Switcher
    const navItems = document.querySelectorAll('.dash-nav-item');
    const sections = document.querySelectorAll('.dash-section');

    function switchSection(targetSectionId) {
        if (!targetSectionId) return;

        navItems.forEach(item => {
            if (item.getAttribute('data-section') === targetSectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        sections.forEach(section => {
            if (section.id === `section-${targetSectionId}`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Trigger section specific render
        renderSectionData(targetSectionId);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            if (sectionId === 'logout') {
                handleLogout();
                return;
            }
            switchSection(sectionId);
        });
    });

    // Handle hash links or default overview
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`section-${initialHash}`)) {
        switchSection(initialHash);
    } else {
        switchSection('overview');
    }

    // Render Data Switcher
    function renderSectionData(sectionId) {
        const user = StorageManager.get(StorageKeys.USER);
        if (!user) return;

        switch (sectionId) {
            case 'overview':
                renderOverview(user);
                break;
            case 'profile':
                renderProfileSection(user);
                break;
            case 'membership':
                renderMembershipSection(user);
                break;
            case 'attendance':
                renderAttendanceSection();
                break;
            case 'workout':
                renderWorkoutSection();
                break;
            case 'diet':
                renderDietSection();
                break;
            case 'classes':
                renderClassesSection();
                break;
            case 'payments':
                renderPaymentsSection();
                break;
            case 'notifications':
                renderNotificationsSection();
                break;
            case 'settings':
                renderSettingsSection(user);
                break;
        }
    }

    // Initial render
    renderOverview(currentUser);

    // --- OVERVIEW SECTION ---
    function renderOverview(user) {
        const userNameElem = document.getElementById('dash-user-name');
        const userPlanElem = document.getElementById('dash-overview-plan');
        const daysRemainingElem = document.getElementById('dash-days-remaining');
        const attendanceRateElem = document.getElementById('dash-attendance-rate');

        if (userNameElem) userNameElem.textContent = user.fullName;
        if (userPlanElem) userPlanElem.textContent = user.membershipPlan + ' Member';

        // Calculate remaining days
        if (daysRemainingElem && user.expiryDate) {
            const expiry = new Date(user.expiryDate);
            const today = new Date();
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            daysRemainingElem.textContent = diffDays > 0 ? `${diffDays} Days` : 'Expired';
        }

        // Attendance rate
        const attendanceList = StorageManager.get(StorageKeys.ATTENDANCE) || [];
        if (attendanceRateElem) {
            const currentMonthCount = attendanceList.length;
            const targetDays = 20;
            const rate = Math.min(100, Math.round((currentMonthCount / targetDays) * 100));
            attendanceRateElem.textContent = `${rate}% (${currentMonthCount} Sessions)`;
        }

        // Next class card
        const classes = StorageManager.get(StorageKeys.CLASSES) || [];
        const bookings = StorageManager.get(StorageKeys.BOOKINGS) || [];
        const nextClassElem = document.getElementById('dash-next-class-card');
        if (nextClassElem) {
            const bookedClass = classes.find(c => bookings.includes(c.id));
            if (bookedClass) {
                nextClassElem.innerHTML = `
                    <div class="dash-class-box">
                        <div class="badge badge-gold">${bookedClass.day}</div>
                        <h4 class="mt-2 font-serif">${bookedClass.name}</h4>
                        <p class="text-muted small mb-1">Trainer: ${bookedClass.trainer}</p>
                        <p class="text-gold small"><strong>${bookedClass.time}</strong> (${bookedClass.duration})</p>
                    </div>
                `;
            } else {
                nextClassElem.innerHTML = `<p class="text-muted">No upcoming classes booked. Explore the Classes section to reserve a spot.</p>`;
            }
        }
    }

    // --- PROFILE IN DASHBOARD ---
    function renderProfileSection(user) {
        const pName = document.getElementById('dash-prof-name');
        const pEmail = document.getElementById('dash-prof-email');
        const pPhone = document.getElementById('dash-prof-phone');
        const pId = document.getElementById('dash-prof-id');
        const pPlan = document.getElementById('dash-prof-plan');
        const pHeight = document.getElementById('dash-prof-height');
        const pWeight = document.getElementById('dash-prof-weight');
        const pGoal = document.getElementById('dash-prof-goal');

        if (pName) pName.textContent = user.fullName;
        if (pEmail) pEmail.textContent = user.email;
        if (pPhone) pPhone.textContent = user.phone;
        if (pId) pId.textContent = user.id;
        if (pPlan) pPlan.textContent = user.membershipPlan;
        if (pHeight) pHeight.textContent = user.height || '180 cm';
        if (pWeight) pWeight.textContent = user.weight || '75 kg';
        if (pGoal) pGoal.textContent = user.fitnessGoal || 'Strength & Conditioning';
    }

    // --- MEMBERSHIP SECTION ---
    function renderMembershipSection(user) {
        const planName = document.getElementById('m-plan-name');
        const planStart = document.getElementById('m-plan-start');
        const planExpiry = document.getElementById('m-plan-expiry');
        const planStatus = document.getElementById('m-plan-status');

        if (planName) planName.textContent = user.membershipPlan + ' Membership';
        if (planStart) planStart.textContent = user.startDate || '2026-01-01';
        if (planExpiry) planExpiry.textContent = user.expiryDate || '2026-12-31';
        if (planStatus) planStatus.innerHTML = `<span class="badge badge-success">${user.status || 'Active'}</span>`;

        // Bind renew/upgrade buttons
        const renewBtn = document.getElementById('btn-renew-plan');
        const upgradeBtn = document.getElementById('btn-upgrade-plan');

        if (renewBtn) {
            renewBtn.onclick = () => {
                Toast.show('Renewal request submitted to concierge. Standard invoice generated.', 'success');
            };
        }
        if (upgradeBtn) {
            upgradeBtn.onclick = () => {
                Toast.show('Membership upgraded to Elite tier demo status!', 'success');
                user.membershipPlan = 'Elite';
                StorageManager.set(StorageKeys.USER, user);
                renderMembershipSection(user);
            };
        }
    }

    // --- ATTENDANCE SECTION ---
    function renderAttendanceSection() {
        const tableBody = document.getElementById('attendance-table-body');
        if (!tableBody) return;

        const attendanceList = StorageManager.get(StorageKeys.ATTENDANCE) || [];
        tableBody.innerHTML = attendanceList.map(item => `
            <tr>
                <td>${item.date}</td>
                <td><span class="text-gold">${item.checkIn}</span></td>
                <td>${item.checkOut}</td>
                <td><span class="badge badge-success">${item.status}</span></td>
            </tr>
        `).join('');
    }

    // --- WORKOUT SECTION ---
    function renderWorkoutSection() {
        const workouts = StorageManager.get(StorageKeys.WORKOUTS) || {};
        const splitTabs = document.querySelectorAll('.workout-tab-btn');
        const workoutTableBody = document.getElementById('workout-table-body');

        function loadSplit(splitName) {
            splitTabs.forEach(btn => {
                if (btn.getAttribute('data-split') === splitName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            const exercises = workouts[splitName] || [];
            if (workoutTableBody) {
                if (exercises.length === 0) {
                    workoutTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Rest Day / Active Recovery</td></tr>`;
                    return;
                }
                workoutTableBody.innerHTML = exercises.map(ex => `
                    <tr>
                        <td><strong>${ex.exercise}</strong></td>
                        <td>${ex.sets}</td>
                        <td>${ex.reps}</td>
                        <td><span class="badge badge-gold">${ex.weight}</span></td>
                        <td>${ex.rest}</td>
                    </tr>
                `).join('');
            }
        }

        splitTabs.forEach(tab => {
            tab.onclick = () => {
                const split = tab.getAttribute('data-split');
                loadSplit(split);
            };
        });

        // Load default Chest
        loadSplit('Chest');
    }

    // --- DIET SECTION ---
    function renderDietSection() {
        const diet = StorageManager.get(StorageKeys.DIET) || {};
        
        const b = document.getElementById('diet-bf');
        const l = document.getElementById('diet-ln');
        const pre = document.getElementById('diet-pre');
        const post = document.getElementById('diet-post');
        const d = document.getElementById('diet-dn');

        if (b && diet.breakfast) b.innerHTML = `${diet.breakfast.food} <br><small class="text-gold">${diet.breakfast.calories} kcal | ${diet.breakfast.protein} protein</small>`;
        if (l && diet.lunch) l.innerHTML = `${diet.lunch.food} <br><small class="text-gold">${diet.lunch.calories} kcal | ${diet.lunch.protein} protein</small>`;
        if (pre && diet.preWorkout) pre.innerHTML = `${diet.preWorkout.food} <br><small class="text-gold">${diet.preWorkout.calories} kcal | ${diet.preWorkout.protein} protein</small>`;
        if (post && diet.postWorkout) post.innerHTML = `${diet.postWorkout.food} <br><small class="text-gold">${diet.postWorkout.calories} kcal | ${diet.postWorkout.protein} protein</small>`;
        if (d && diet.dinner) d.innerHTML = `${diet.dinner.food} <br><small class="text-gold">${diet.dinner.calories} kcal | ${diet.dinner.protein} protein</small>`;

        // Water tracker
        const waterVal = document.getElementById('water-current-val');
        const waterProgress = document.getElementById('water-progress-bar');
        const addWaterBtn = document.getElementById('btn-add-water');

        function updateWater() {
            if (waterVal) waterVal.textContent = `${diet.waterCurrent || 0} / ${diet.waterTarget || 3500} ml`;
            if (waterProgress) {
                const pct = Math.min(100, Math.round(((diet.waterCurrent || 0) / (diet.waterTarget || 3500)) * 100));
                waterProgress.style.width = `${pct}%`;
            }
        }

        if (addWaterBtn) {
            addWaterBtn.onclick = () => {
                diet.waterCurrent = (diet.waterCurrent || 0) + 250;
                StorageManager.set(StorageKeys.DIET, diet);
                updateWater();
                Toast.show('+250 ml Hydro intake recorded.', 'info');
            };
        }

        updateWater();
    }

    // --- CLASSES SECTION ---
    function renderClassesSection() {
        const classesList = StorageManager.get(StorageKeys.CLASSES) || [];
        let bookings = StorageManager.get(StorageKeys.BOOKINGS) || [];
        const container = document.getElementById('dashboard-classes-list');

        if (!container) return;

        container.innerHTML = classesList.map(cls => {
            const isBooked = bookings.includes(cls.id);
            return `
                <div class="dash-class-card ${isBooked ? 'booked' : ''}">
                    <div class="dash-class-info">
                        <div class="badge badge-burgundy mb-2">${cls.day} &bull; ${cls.time}</div>
                        <h4 class="font-serif mb-1">${cls.name}</h4>
                        <p class="text-muted small mb-0">Trainer: <strong>${cls.trainer}</strong> | Category: <strong>${cls.category}</strong></p>
                    </div>
                    <div class="dash-class-action">
                        ${isBooked ? 
                            `<button class="btn btn-outline btn-sm btn-cancel-class" data-id="${cls.id}">Cancel Booking</button>` :
                            `<button class="btn btn-gold btn-sm btn-book-class" data-id="${cls.id}">Book Class</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');

        // Bind booking events
        const bookBtns = container.querySelectorAll('.btn-book-class');
        bookBtns.forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                if (!bookings.includes(id)) {
                    bookings.push(id);
                    StorageManager.set(StorageKeys.BOOKINGS, bookings);
                    Toast.show('Class successfully booked!', 'success');
                    renderClassesSection();
                    renderOverview(StorageManager.get(StorageKeys.USER));
                }
            };
        });

        const cancelBtns = container.querySelectorAll('.btn-cancel-class');
        cancelBtns.forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                bookings = bookings.filter(bId => bId !== id);
                StorageManager.set(StorageKeys.BOOKINGS, bookings);
                Toast.show('Booking cancelled.', 'info');
                renderClassesSection();
                renderOverview(StorageManager.get(StorageKeys.USER));
            };
        });
    }

    // --- PAYMENTS SECTION ---
    function renderPaymentsSection() {
        const tableBody = document.getElementById('payments-table-body');
        if (!tableBody) return;

        const payments = StorageManager.get(StorageKeys.PAYMENTS) || [];
        tableBody.innerHTML = payments.map(p => `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.date}</td>
                <td>${p.plan}</td>
                <td><strong class="text-gold">${p.amount}</strong></td>
                <td><span class="badge badge-success">${p.status}</span></td>
            </tr>
        `).join('');
    }

    // --- NOTIFICATIONS SECTION ---
    function renderNotificationsSection() {
        const listContainer = document.getElementById('notifications-list-container');
        if (!listContainer) return;

        let notifications = StorageManager.get(StorageKeys.NOTIFICATIONS) || [];
        if (notifications.length === 0) {
            listContainer.innerHTML = `<p class="text-muted">No active notifications.</p>`;
            return;
        }

        listContainer.innerHTML = notifications.map(nt => `
            <div class="notification-item ${nt.read ? 'read' : 'unread'}">
                <div class="notification-header">
                    <strong>${nt.title}</strong>
                    <small class="text-muted">${nt.date}</small>
                </div>
                <p class="notification-body mb-2">${nt.message}</p>
                ${!nt.read ? `<button class="btn btn-link p-0 small text-gold btn-mark-read" data-id="${nt.id}">Mark as Read</button>` : ''}
            </div>
        `).join('');

        const markBtns = listContainer.querySelectorAll('.btn-mark-read');
        markBtns.forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
                StorageManager.set(StorageKeys.NOTIFICATIONS, notifications);
                renderNotificationsSection();
            };
        });
    }

    // --- SETTINGS SECTION ---
    function renderSettingsSection(user) {
        const emailCheck = document.getElementById('setting-email');
        const smsCheck = document.getElementById('setting-sms');
        const saveSettingsBtn = document.getElementById('btn-save-settings');

        if (saveSettingsBtn) {
            saveSettingsBtn.onclick = () => {
                Toast.show('Preferences updated successfully.', 'success');
            };
        }
    }
});
