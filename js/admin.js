/**
 * Sai Fitness Gym - Admin Dashboard Module
 * Implements complete single-page Admin interface, CRUD simulations, search/filter, and CSV export.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Section Switching
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');

    function switchAdminSection(targetId) {
        if (!targetId) return;

        navItems.forEach(item => {
            if (item.getAttribute('data-section') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        sections.forEach(section => {
            if (section.id === `admin-section-${targetId}`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        renderAdminSectionData(targetId);
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const secId = item.getAttribute('data-section');
            if (secId === 'logout') {
                handleLogout();
                return;
            }
            switchAdminSection(secId);
        });
    });

    // Handle Hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`admin-section-${initialHash}`)) {
        switchAdminSection(initialHash);
    } else {
        switchAdminSection('overview');
    }

    function renderAdminSectionData(secId) {
        switch (secId) {
            case 'overview':
                renderAdminOverview();
                break;
            case 'members':
                renderMembersTable();
                break;
            case 'trainers':
                renderTrainersTable();
                break;
            case 'memberships':
                renderMembershipsTable();
                break;
            case 'attendance':
                renderAdminAttendanceTable();
                break;
            case 'payments':
                renderAdminPaymentsTable();
                break;
            case 'classes':
                renderAdminClassesTable();
                break;
            case 'enquiries':
                renderAdminEnquiriesTable();
                break;
            case 'reports':
                renderAdminReports();
                break;
            case 'notifications':
                renderAdminNotifications();
                break;
            case 'settings':
                renderAdminSettings();
                break;
        }
    }

    // --- OVERVIEW ---
    function renderAdminOverview() {
        const users = StorageManager.get(StorageKeys.USERS) || [];
        const attendance = StorageManager.get(StorageKeys.ATTENDANCE) || [];

        const totalMembers = users.length;
        const activeMembers = users.filter(u => u.status === 'Active').length;
        const newMembers = users.filter(u => new Date(u.joinDate) >= new Date('2026-01-01')).length;
        const expiring = users.filter(u => u.status === 'Expiring Soon').length;

        const kpiTotal = document.getElementById('kpi-total-members');
        const kpiActive = document.getElementById('kpi-active-members');
        const kpiNew = document.getElementById('kpi-new-members');
        const kpiExpiring = document.getElementById('kpi-expiring');
        const kpiAttendance = document.getElementById('kpi-today-attendance');
        const kpiRevenue = document.getElementById('kpi-monthly-revenue');

        if (kpiTotal) kpiTotal.textContent = totalMembers;
        if (kpiActive) kpiActive.textContent = activeMembers;
        if (kpiNew) kpiNew.textContent = newMembers;
        if (kpiExpiring) kpiExpiring.textContent = expiring;
        if (kpiAttendance) kpiAttendance.textContent = attendance.length + ' Checked In';
        if (kpiRevenue) kpiRevenue.textContent = '$' + (activeMembers * 220).toLocaleString();
    }

    // --- MEMBERS CRUD ---
    function renderMembersTable() {
        const tableBody = document.getElementById('admin-members-tbody');
        const searchInput = document.getElementById('admin-member-search');
        const statusFilter = document.getElementById('admin-member-filter-status');

        if (!tableBody) return;

        let users = StorageManager.get(StorageKeys.USERS) || [];

        function filterAndRender() {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const statusVal = statusFilter ? statusFilter.value : 'all';

            const filtered = users.filter(user => {
                const matchesSearch = user.fullName.toLowerCase().includes(query) ||
                                      user.email.toLowerCase().includes(query) ||
                                      user.id.toLowerCase().includes(query);
                const matchesStatus = statusVal === 'all' || user.status === statusVal;
                return matchesSearch && matchesStatus;
            });

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No members found matching criteria.</td></tr>`;
                return;
            }

            tableBody.innerHTML = filtered.map(u => `
                <tr>
                    <td><strong>${u.id}</strong></td>
                    <td>${u.fullName}</td>
                    <td>${u.phone}</td>
                    <td><span class="badge badge-gold">${u.membershipPlan}</span></td>
                    <td><span class="badge ${u.status === 'Active' ? 'badge-yellow' : u.status === 'Expiring Soon' ? 'bg-warning-subtle text-warning-emphasis border' : 'bg-secondary-subtle text-secondary border'}">${u.status}</span></td>
                    <td>${u.joinDate}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm btn-edit-member" data-id="${u.id}">Edit</button>
                        <button class="btn btn-dark btn-sm btn-deactivate-member" data-id="${u.id}">${u.status === 'Deactivated' ? 'Activate' : 'Deactivate'}</button>
                    </td>
                </tr>
            `).join('');

            // Bind Actions
            tableBody.querySelectorAll('.btn-deactivate-member').forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute('data-id');
                    users = users.map(u => {
                        if (u.id === id) {
                            return { ...u, status: u.status === 'Deactivated' ? 'Active' : 'Deactivated' };
                        }
                        return u;
                    });
                    StorageManager.set(StorageKeys.USERS, users);
                    Toast.show('Member status updated.', 'info');
                    filterAndRender();
                };
            });

            tableBody.querySelectorAll('.btn-edit-member').forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute('data-id');
                    const targetUser = users.find(u => u.id === id);
                    if (targetUser) {
                        openEditMemberModal(targetUser);
                    }
                };
            });
        }

        if (searchInput) searchInput.oninput = filterAndRender;
        if (statusFilter) statusFilter.onchange = filterAndRender;

        filterAndRender();
    }

    // Add / Edit Member Modal Handlers
    const addMemberForm = document.getElementById('admin-add-member-form');
    if (addMemberForm) {
        addMemberForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('add-mem-name').value;
            const email = document.getElementById('add-mem-email').value;
            const phone = document.getElementById('add-mem-phone').value;
            const plan = document.getElementById('add-mem-plan').value;

            const users = StorageManager.get(StorageKeys.USERS) || [];
            const newMem = {
                id: 'MEM-' + Math.floor(1000 + Math.random() * 9000),
                fullName: name,
                email: email,
                phone: phone,
                membershipPlan: plan,
                joinDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
                status: 'Active'
            };
            users.push(newMem);
            StorageManager.set(StorageKeys.USERS, users);

            Toast.show('New member registered successfully!', 'success');
            
            const modalElem = document.getElementById('modalAddMember');
            if (modalElem && window.bootstrap) {
                const bsModal = bootstrap.Modal.getInstance(modalElem) || new bootstrap.Modal(modalElem);
                bsModal.hide();
            }
            addMemberForm.reset();
            renderMembersTable();
        };
    }

    function openEditMemberModal(user) {
        document.getElementById('edit-mem-id').value = user.id;
        document.getElementById('edit-mem-name').value = user.fullName;
        document.getElementById('edit-mem-email').value = user.email;
        document.getElementById('edit-mem-phone').value = user.phone;
        document.getElementById('edit-mem-plan').value = user.membershipPlan;
        document.getElementById('edit-mem-status').value = user.status;

        const modalElem = document.getElementById('modalEditMember');
        if (modalElem && window.bootstrap) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(modalElem);
            bsModal.show();
        }
    }

    const editMemberForm = document.getElementById('admin-edit-member-form');
    if (editMemberForm) {
        editMemberForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-mem-id').value;
            let users = StorageManager.get(StorageKeys.USERS) || [];
            users = users.map(u => {
                if (u.id === id) {
                    return {
                        ...u,
                        fullName: document.getElementById('edit-mem-name').value,
                        email: document.getElementById('edit-mem-email').value,
                        phone: document.getElementById('edit-mem-phone').value,
                        membershipPlan: document.getElementById('edit-mem-plan').value,
                        status: document.getElementById('edit-mem-status').value
                    };
                }
                return u;
            });
            StorageManager.set(StorageKeys.USERS, users);
            Toast.show('Member updated successfully.', 'success');
            
            const modalElem = document.getElementById('modalEditMember');
            if (modalElem && window.bootstrap) {
                const bsModal = bootstrap.Modal.getInstance(modalElem);
                if (bsModal) bsModal.hide();
            }
            renderMembersTable();
        };
    }

    // --- TRAINERS CRUD ---
    function renderTrainersTable() {
        const tableBody = document.getElementById('admin-trainers-tbody');
        if (!tableBody) return;

        let trainers = StorageManager.get(StorageKeys.TRAINERS) || [];
        tableBody.innerHTML = trainers.map(t => `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td>${t.specialization}</td>
                <td>${t.experience}</td>
                <td><small>${t.certification}</small></td>
                <td>${t.phone}</td>
                <td>
                    <button class="btn btn-dark btn-sm btn-delete-trainer" data-id="${t.id}">Deactivate</button>
                </td>
            </tr>
        `).join('');

        tableBody.querySelectorAll('.btn-delete-trainer').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                trainers = trainers.filter(t => t.id !== id);
                StorageManager.set(StorageKeys.TRAINERS, trainers);
                Toast.show('Trainer status set to inactive.', 'info');
                renderTrainersTable();
            };
        });
    }

    const addTrainerForm = document.getElementById('admin-add-trainer-form');
    if (addTrainerForm) {
        addTrainerForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('tr-name').value;
            const spec = document.getElementById('tr-spec').value;
            const exp = document.getElementById('tr-exp').value;
            const cert = document.getElementById('tr-cert').value;
            const phone = document.getElementById('tr-phone').value;

            const trainers = StorageManager.get(StorageKeys.TRAINERS) || [];
            trainers.push({
                id: 'TRN-' + Math.floor(100 + Math.random() * 900),
                name, specialization: spec, experience: exp, certification: cert, phone,
                email: name.toLowerCase().replace(' ', '') + '@saifitness.com',
                photo: 'assets/images/trainer1.jpg',
                bio: 'Dedicated trainer committed to excellence.'
            });
            StorageManager.set(StorageKeys.TRAINERS, trainers);
            Toast.show('Trainer added successfully.', 'success');
            
            const modalElem = document.getElementById('modalAddTrainer');
            if (modalElem && window.bootstrap) {
                const bsModal = bootstrap.Modal.getInstance(modalElem);
                if (bsModal) bsModal.hide();
            }
            addTrainerForm.reset();
            renderTrainersTable();
        };
    }

    // --- MEMBERSHIPS CRUD ---
    function renderMembershipsTable() {
        const container = document.getElementById('admin-memberships-container');
        if (!container) return;

        const plans = StorageManager.get(StorageKeys.MEMBERSHIPS) || [];
        container.innerHTML = plans.map(p => `
            <div class="card card-luxury p-4 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="font-heading m-0">${p.name} Tier</h3>
                    <span class="text-gold-dark fs-3 font-heading">${p.price} <small class="text-muted fs-6">${p.period}</small></span>
                </div>
                <p class="text-muted small">${p.duration}</p>
                <ul class="bullet-list-luxury mb-3">
                    ${p.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // --- ATTENDANCE ---
    function renderAdminAttendanceTable() {
        const tbody = document.getElementById('admin-attendance-tbody');
        if (!tbody) return;
        const attendance = StorageManager.get(StorageKeys.ATTENDANCE) || [];

        tbody.innerHTML = attendance.map((att, idx) => `
            <tr>
                <td>MEM-882${(idx % 4) + 1}</td>
                <td>${att.date}</td>
                <td><span class="text-gold-dark fw-bold">${att.checkIn}</span></td>
                <td>${att.checkOut}</td>
                <td><span class="badge bg-success-subtle text-success border border-success-subtle">${att.status}</span></td>
            </tr>
        `).join('');
    }

    // --- PAYMENTS ---
    function renderAdminPaymentsTable() {
        const tbody = document.getElementById('admin-payments-tbody');
        if (!tbody) return;

        const payments = StorageManager.get(StorageKeys.PAYMENTS) || [];
        tbody.innerHTML = payments.map(p => `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>Alexander Wright</td>
                <td>${p.plan}</td>
                <td><strong class="text-gold-dark">${p.amount}</strong></td>
                <td>${p.date}</td>
                <td><span class="badge bg-success-subtle text-success border border-success-subtle">${p.status}</span></td>
            </tr>
        `).join('');
    }

    // --- CLASSES CRUD ---
    function renderAdminClassesTable() {
        const tbody = document.getElementById('admin-classes-tbody');
        if (!tbody) return;

        let classesList = StorageManager.get(StorageKeys.CLASSES) || [];
        tbody.innerHTML = classesList.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.trainer}</td>
                <td>${c.day}</td>
                <td><span class="text-gold-dark fw-bold">${c.time}</span></td>
                <td>${c.duration}</td>
                <td>${c.spotsLeft} Spots</td>
                <td>
                    <button class="btn btn-dark btn-sm btn-del-class" data-id="${c.id}">Remove</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-del-class').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                classesList = classesList.filter(c => c.id !== id);
                StorageManager.set(StorageKeys.CLASSES, classesList);
                Toast.show('Class session removed.', 'info');
                renderAdminClassesTable();
            };
        });
    }

    const addClassForm = document.getElementById('admin-add-class-form');
    if (addClassForm) {
        addClassForm.onsubmit = (e) => {
            e.preventDefault();
            const classesList = StorageManager.get(StorageKeys.CLASSES) || [];
            classesList.push({
                id: 'CLS-' + Math.floor(10 + Math.random() * 90),
                name: document.getElementById('cls-name').value,
                trainer: document.getElementById('cls-trainer').value,
                day: document.getElementById('cls-day').value,
                time: document.getElementById('cls-time').value,
                duration: document.getElementById('cls-dur').value,
                category: document.getElementById('cls-cat').value,
                spotsLeft: 8,
                booked: false
            });
            StorageManager.set(StorageKeys.CLASSES, classesList);
            Toast.show('Class added to schedule.', 'success');
            
            const modalElem = document.getElementById('modalAddClass');
            if (modalElem && window.bootstrap) {
                const bsModal = bootstrap.Modal.getInstance(modalElem);
                if (bsModal) bsModal.hide();
            }
            addClassForm.reset();
            renderAdminClassesTable();
        };
    }

    // --- ENQUIRIES MANAGEMENT ---
    function renderAdminEnquiriesTable() {
        const tbody = document.getElementById('admin-enquiries-tbody');
        if (!tbody) return;

        let enquiries = StorageManager.get(StorageKeys.ENQUIRIES) || [];
        if (enquiries.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No contact enquiries received yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = enquiries.map(eq => `
            <tr>
                <td><strong>${eq.id}</strong></td>
                <td>${eq.name}</td>
                <td>${eq.email}<br><small class="text-muted">${eq.phone}</small></td>
                <td><strong>${eq.subject}</strong><br><small>${eq.message}</small></td>
                <td>${eq.date}</td>
                <td>
                    <select class="form-select form-select-sm enq-status-select" data-id="${eq.id}">
                        <option value="New" ${eq.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Contacted" ${eq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Resolved" ${eq.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.enq-status-select').forEach(sel => {
            sel.onchange = () => {
                const id = sel.getAttribute('data-id');
                const val = sel.value;
                enquiries = enquiries.map(e => e.id === id ? { ...e, status: val } : e);
                StorageManager.set(StorageKeys.ENQUIRIES, enquiries);
                Toast.show(`Enquiry ${id} status set to ${val}.`, 'success');
            };
        });
    }

    // --- REPORTS & CSV EXPORT ---
    function renderAdminReports() {
        const exportBtn = document.getElementById('btn-export-csv');
        if (exportBtn) {
            exportBtn.onclick = () => {
                const users = StorageManager.get(StorageKeys.USERS) || [];
                let csvContent = "data:text/csv;charset=utf-8,ID,Full Name,Email,Phone,Plan,Status,Join Date\n";

                users.forEach(u => {
                    csvContent += `"${u.id}","${u.fullName}","${u.email}","${u.phone}","${u.membershipPlan}","${u.status}","${u.joinDate}"\n`;
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `Sai_Fitness_Members_Report_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                Toast.show('CSV Report generated and downloaded.', 'success');
            };
        }
    }

    // --- NOTIFICATIONS ---
    function renderAdminNotifications() {
        const container = document.getElementById('admin-notifications-container');
        if (!container) return;
        const ntf = StorageManager.get(StorageKeys.NOTIFICATIONS) || [];

        container.innerHTML = ntf.map(n => `
            <div class="card card-luxury p-3 mb-2">
                <div class="d-flex justify-content-between">
                    <strong>${n.title}</strong>
                    <small class="text-muted">${n.date}</small>
                </div>
                <p class="m-0 text-muted small">${n.message}</p>
            </div>
        `).join('');
    }

    // --- SETTINGS ---
    function renderAdminSettings() {
        const settings = StorageManager.get(StorageKeys.SETTINGS) || {};
        const gName = document.getElementById('admin-gym-name');
        const gPhone = document.getElementById('admin-gym-phone');
        const gEmail = document.getElementById('admin-gym-email');
        const gAddr = document.getElementById('admin-gym-addr');
        const gHours = document.getElementById('admin-gym-hours');
        const form = document.getElementById('admin-settings-form');

        if (gName) gName.value = settings.gymName || '';
        if (gPhone) gPhone.value = settings.phone || '';
        if (gEmail) gEmail.value = settings.email || '';
        if (gAddr) gAddr.value = settings.address || '';
        if (gHours) gHours.value = settings.openingHours || '';

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                settings.gymName = gName.value;
                settings.phone = gPhone.value;
                settings.email = gEmail.value;
                settings.address = gAddr.value;
                settings.openingHours = gHours.value;
                StorageManager.set(StorageKeys.SETTINGS, settings);
                Toast.show('Gym configuration saved.', 'success');
            };
        }
    }
});
