/**
 * Sai Fitness Gym - Storage Module
 * Manages LocalStorage initial state and CRUD operations for frontend demo.
 */

const StorageKeys = {
    USER: 'sai_current_user',
    ADMIN: 'sai_admin_user',
    USERS: 'sai_users_list',
    TRAINERS: 'sai_trainers_list',
    MEMBERSHIPS: 'sai_memberships_list',
    ATTENDANCE: 'sai_attendance_list',
    WORKOUTS: 'sai_workouts_data',
    DIET: 'sai_diet_data',
    CLASSES: 'sai_classes_list',
    BOOKINGS: 'sai_bookings_list',
    PAYMENTS: 'sai_payments_list',
    NOTIFICATIONS: 'sai_notifications_list',
    ENQUIRIES: 'sai_enquiries_list',
    SETTINGS: 'sai_gym_settings'
};

const DefaultData = {
    // Default logged in user profile (Demo)
    user: {
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
    },

    // All registered members in system
    users: [
        {
            id: 'MEM-8821',
            fullName: 'Alexander Wright',
            email: 'alexander.wright@example.com',
            phone: '+1 (555) 234-5678',
            membershipPlan: 'Performance',
            joinDate: '2026-01-01',
            expiryDate: '2026-12-31',
            status: 'Active'
        },
        {
            id: 'MEM-8822',
            fullName: 'Elena Rostova',
            email: 'elena.rostova@example.com',
            phone: '+1 (555) 345-6789',
            membershipPlan: 'Elite',
            joinDate: '2025-11-15',
            expiryDate: '2026-11-15',
            status: 'Active'
        },
        {
            id: 'MEM-8823',
            fullName: 'Marcus Vance',
            email: 'marcus.vance@example.com',
            phone: '+1 (555) 456-7890',
            membershipPlan: 'Essential',
            joinDate: '2026-02-10',
            expiryDate: '2026-08-10',
            status: 'Active'
        },
        {
            id: 'MEM-8824',
            fullName: 'Sophia Laurent',
            email: 'sophia.laurent@example.com',
            phone: '+1 (555) 567-8901',
            membershipPlan: 'Elite',
            joinDate: '2025-06-01',
            expiryDate: '2026-06-01',
            status: 'Expiring Soon'
        },
        {
            id: 'MEM-8825',
            fullName: 'Julian Hayes',
            email: 'julian.hayes@example.com',
            phone: '+1 (555) 678-9012',
            membershipPlan: 'Essential',
            joinDate: '2025-01-10',
            expiryDate: '2026-01-10',
            status: 'Deactivated'
        }
    ],

    // Trainers
    trainers: [
        {
            id: 'TRN-101',
            name: 'Marcus Vance',
            specialization: 'Head of Strength & Conditioning',
            experience: '12 Years',
            certification: 'CSCS, NSCA-CPT',
            phone: '+1 (555) 111-2233',
            email: 'marcus@saifitness.com',
            photo: 'assets/images/trainer1.jpg',
            bio: 'Former collegiate athlete specializing in biomechanics, progressive strength development, and high-performance athletic longevity.'
        },
        {
            id: 'TRN-102',
            name: 'Elena Rostova',
            specialization: 'Pilates, Mobility & Recovery',
            experience: '9 Years',
            certification: 'PMA-CPT, Functional Movement Systems',
            phone: '+1 (555) 222-3344',
            email: 'elena@saifitness.com',
            photo: 'assets/images/trainer2.jpg',
            bio: 'Dedicated to structural alignment, joint health, dynamic flexibility, and mindfulness-integrated mobility work.'
        },
        {
            id: 'TRN-103',
            name: 'David Chen',
            specialization: 'Functional Training & Athletic Endurance',
            experience: '8 Years',
            certification: 'EXOS Performance Specialist',
            phone: '+1 (555) 333-4455',
            email: 'david@saifitness.com',
            photo: 'assets/images/trainer1.jpg',
            bio: 'Focuses on multi-planar body conditioning, metabolic efficiency, and bespoke athletic programming.'
        },
        {
            id: 'TRN-104',
            name: 'Sophia Laurent',
            specialization: 'Holistic Wellness & Body Transformation',
            experience: '10 Years',
            certification: 'NASM-CPT, Precision Nutrition Master',
            phone: '+1 (555) 444-5566',
            email: 'sophia@saifitness.com',
            photo: 'assets/images/trainer2.jpg',
            bio: 'Expert in body composition, tailored nutritional strategy, and sustainable lifestyle optimization.'
        }
    ],

    // Memberships
    memberships: [
        {
            id: 'PLN-01',
            name: 'Essential',
            price: '$120',
            period: 'Per Month',
            duration: 'Monthly / Annual Options',
            features: [
                'Full access to Strength & Cardio areas',
                'Complimentary initial fitness consultation',
                'Luxury locker & changing room amenities',
                'Digital workout tracking app access',
                'Standard club opening hours access'
            ],
            status: 'Active'
        },
        {
            id: 'PLN-02',
            name: 'Performance',
            price: '$220',
            period: 'Per Month',
            duration: 'Monthly / Annual Options',
            badge: 'Most Popular',
            features: [
                'All Essential Plan benefits included',
                'Unlimited group classes & functional sessions',
                'Monthly 1-on-1 personal training check-in',
                'Priority wellness & recovery zone access',
                'Unlimited guest privileges (2 per month)'
            ],
            status: 'Active'
        },
        {
            id: 'PLN-03',
            name: 'Elite',
            price: '$380',
            period: 'Per Month',
            duration: 'Annual Tier',
            features: [
                'All Performance Plan benefits included',
                'Dedicated Senior Personal Trainer assigned',
                'Personalized quarterly metabolic & body assessment',
                'Private locker reservation & towel valet',
                '24/7 VIP Club Concierge & priority booking'
            ],
            status: 'Active'
        }
    ],

    // Attendance history
    attendance: [
        { id: 'ATT-901', date: '2026-10-05', checkIn: '07:15 AM', checkOut: '08:45 AM', status: 'Completed' },
        { id: 'ATT-902', date: '2026-10-03', checkIn: '06:45 AM', checkOut: '08:15 AM', status: 'Completed' },
        { id: 'ATT-903', date: '2026-10-01', checkIn: '05:30 PM', checkOut: '07:00 PM', status: 'Completed' },
        { id: 'ATT-904', date: '2026-09-29', checkIn: '07:00 AM', checkOut: '08:30 AM', status: 'Completed' },
        { id: 'ATT-905', date: '2026-09-27', checkIn: '06:15 AM', checkOut: '07:45 AM', status: 'Completed' },
        { id: 'ATT-906', date: '2026-09-25', checkIn: '05:45 PM', checkOut: '07:15 PM', status: 'Completed' }
    ],

    // Workouts
    workouts: {
        Chest: [
            { exercise: 'Incline Barbell Bench Press', sets: 4, reps: '8 - 10', weight: '85 kg', rest: '90 sec' },
            { exercise: 'Flat Dumbbell Press', sets: 3, reps: '10 - 12', weight: '36 kg', rest: '75 sec' },
            { exercise: 'Low-to-High Cable Flyes', sets: 3, reps: '12 - 15', weight: '18 kg', rest: '60 sec' },
            { exercise: 'Weighted Dips', sets: 3, reps: '8 - 10', weight: '+15 kg', rest: '90 sec' }
        ],
        Back: [
            { exercise: 'Conventional Deadlift', sets: 4, reps: '5', weight: '140 kg', rest: '120 sec' },
            { exercise: 'Neutral Grip Pull-ups', sets: 4, reps: '10', weight: 'Bodyweight', rest: '90 sec' },
            { exercise: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 - 12', weight: '40 kg', rest: '75 sec' },
            { exercise: 'Seated Cable Row (Wide Handle)', sets: 3, reps: '12', weight: '70 kg', rest: '60 sec' }
        ],
        Shoulders: [
            { exercise: 'Seated Overhead Dumbbell Press', sets: 4, reps: '8 - 10', weight: '30 kg', rest: '90 sec' },
            { exercise: 'Standing Dumbbell Lateral Raise', sets: 4, reps: '15', weight: '14 kg', rest: '45 sec' },
            { exercise: 'Face Pulls with Rope Cable', sets: 4, reps: '15 - 20', weight: '25 kg', rest: '45 sec' }
        ],
        Arms: [
            { exercise: 'EZ-Bar Bicep Curl', sets: 3, reps: '10 - 12', weight: '35 kg', rest: '60 sec' },
            { exercise: 'Tricep Rope Cable Pushdowns', sets: 3, reps: '12 - 15', weight: '30 kg', rest: '60 sec' },
            { exercise: 'Incline Dumbbell Curl', sets: 3, reps: '10', weight: '16 kg', rest: '60 sec' },
            { exercise: 'Skullcrushers (EZ-Bar)', sets: 3, reps: '10 - 12', weight: '30 kg', rest: '60 sec' }
        ],
        Legs: [
            { exercise: 'Barbell Back Squat', sets: 4, reps: '6 - 8', weight: '120 kg', rest: '120 sec' },
            { exercise: 'Romanian Deadlift', sets: 3, reps: '10', weight: '100 kg', rest: '90 sec' },
            { exercise: 'Leg Press (45 Degree)', sets: 3, reps: '12', weight: '220 kg', rest: '75 sec' },
            { exercise: 'Seated Hamstring Curls', sets: 3, reps: '15', weight: '55 kg', rest: '60 sec' }
        ],
        Core: [
            { exercise: 'Hanging Leg Raises', sets: 3, reps: '15', weight: 'Bodyweight', rest: '45 sec' },
            { exercise: 'Cable Woodchoppers', sets: 3, reps: '12 per side', weight: '20 kg', rest: '45 sec' },
            { exercise: 'Weighted Abdominal Crunch', sets: 3, reps: '15', weight: '25 kg', rest: '45 sec' }
        ],
        Cardio: [
            { exercise: 'Zone 2 Steady State Incline Walk', sets: 1, reps: '45 mins', weight: 'Incline 8%', rest: 'N/A' },
            { exercise: 'HIIT Rower Sprints', sets: 8, reps: '30s sprint / 30s rest', weight: 'Damper 7', rest: '30 sec' }
        ]
    },

    // Diet plan demo
    diet: {
        breakfast: { food: 'Organic Steel Cut Oats with Almond Butter & Wild Berries', calories: 520, protein: '24g' },
        lunch: { food: 'Grilled Wild Salmon, Quinoa & Steamed Asparagus', calories: 680, protein: '48g' },
        preWorkout: { food: 'Greek Yogurt with Honey & Sliced Banana', calories: 280, protein: '18g' },
        postWorkout: { food: 'Whey Protein Isolate Shake & Rice Cakes', calories: 310, protein: '35g' },
        dinner: { food: 'Grass-Fed Ribeye Steak with Roasted Sweet Potatoes', calories: 740, protein: '52g' },
        waterTarget: 3500, // ml
        waterCurrent: 2250 // ml
    },

    // Classes schedule
    classes: [
        { id: 'CLS-01', day: 'Monday', time: '07:00 AM', name: 'Sunrise Strength & Conditioning', trainer: 'Marcus Vance', duration: '60 min', category: 'Strength', spotsLeft: 4, booked: false },
        { id: 'CLS-02', day: 'Monday', time: '06:00 PM', name: 'High-Performance Functional HIIT', trainer: 'David Chen', duration: '50 min', category: 'HIIT', spotsLeft: 2, booked: true },
        { id: 'CLS-03', day: 'Tuesday', time: '06:30 AM', name: 'Athletic Mobility & Structural Pilates', trainer: 'Elena Rostova', duration: '55 min', category: 'Mobility', spotsLeft: 6, booked: false },
        { id: 'CLS-04', day: 'Tuesday', time: '06:00 PM', name: 'Barbell Hypertrophy Workshop', trainer: 'Marcus Vance', duration: '60 min', category: 'Strength', spotsLeft: 3, booked: false },
        { id: 'CLS-05', day: 'Wednesday', time: '07:00 AM', name: 'Metabolic Cardio & Zone 2 Endurance', trainer: 'David Chen', duration: '45 min', category: 'Cardio', spotsLeft: 5, booked: false },
        { id: 'CLS-06', day: 'Wednesday', time: '05:30 PM', name: 'Vinyasa Flow & Deep Recovery Yoga', trainer: 'Sophia Laurent', duration: '60 min', category: 'Yoga', spotsLeft: 8, booked: false },
        { id: 'CLS-07', day: 'Thursday', time: '07:00 AM', name: 'Functional Core & Kinetic Chain', trainer: 'David Chen', duration: '50 min', category: 'Functional', spotsLeft: 4, booked: false },
        { id: 'CLS-08', day: 'Friday', time: '06:00 PM', name: 'End-of-Week Full Body Sculpt', trainer: 'Sophia Laurent', duration: '60 min', category: 'Strength', spotsLeft: 3, booked: false },
        { id: 'CLS-09', day: 'Saturday', time: '09:00 AM', name: 'Weekend Masterclass Strength Lab', trainer: 'Marcus Vance', duration: '75 min', category: 'Strength', spotsLeft: 1, booked: false }
    ],

    // Booked classes for member
    bookings: ['CLS-02'],

    // Payment transactions demo
    payments: [
        { id: 'INV-2026-009', date: '2026-10-01', plan: 'Performance Membership (Monthly)', amount: '$220.00', status: 'Paid' },
        { id: 'INV-2026-008', date: '2026-09-01', plan: 'Performance Membership (Monthly)', amount: '$220.00', status: 'Paid' },
        { id: 'INV-2026-007', date: '2026-08-01', plan: 'Performance Membership (Monthly)', amount: '$220.00', status: 'Paid' },
        { id: 'INV-2026-006', date: '2026-07-01', plan: 'Performance Membership (Monthly)', amount: '$220.00', status: 'Paid' }
    ],

    // Notifications demo
    notifications: [
        { id: 'NTF-1', title: 'Membership Status', message: 'Your Performance Membership renewed successfully for October.', date: 'Oct 01, 2026', read: false },
        { id: 'NTF-2', title: 'Class Reminder', message: 'High-Performance Functional HIIT is scheduled for Monday at 06:00 PM.', date: 'Oct 04, 2026', read: false },
        { id: 'NTF-3', title: 'Club Announcement', message: 'New custom brass dumbbell sets are now available in the Strength Lounge.', date: 'Sep 28, 2026', read: true }
    ],

    // Enquiries received (for Admin demo)
    enquiries: [
        { id: 'ENQ-401', name: 'Charlotte Dubois', email: 'charlotte@example.com', phone: '+1 (555) 789-0123', subject: 'Private Personal Training Enquiries', message: 'I would like to inquire about private 1-on-1 coaching sessions with Marcus Vance.', date: '2026-10-04', status: 'New' },
        { id: 'ENQ-402', name: 'Michael Sterling', email: 'm.sterling@example.com', phone: '+1 (555) 890-1234', subject: 'Corporate Club Access', message: 'Interested in annual executive memberships for our senior team of 15 employees.', date: '2026-10-02', status: 'Contacted' },
        { id: 'ENQ-403', name: 'Hannah Abbott', email: 'hannah.a@example.com', phone: '+1 (555) 901-2345', subject: 'Guest Pass Inquiry', message: 'Would love to schedule a tour of the wellness and recovery spa.', date: '2026-09-28', status: 'Resolved' }
    ],

    // Gym settings
    settings: {
        gymName: 'Sai Fitness Gym',
        phone: '+1 (800) 555-7890',
        email: 'concierge@saifitnessgym.com',
        address: '740 Luxury Avenue, Grand Boulevard, Financial District',
        openingHours: 'Mon - Fri: 05:30 AM - 10:00 PM | Sat - Sun: 07:00 AM - 08:00 PM',
        theme: 'light',
        emailNotifications: true,
        smsAlerts: false
    }
};

const StorageManager = {
    init() {
        if (!localStorage.getItem(StorageKeys.USERS)) {
            localStorage.setItem(StorageKeys.USERS, JSON.stringify(DefaultData.users));
        }
        if (!localStorage.getItem(StorageKeys.USER)) {
            localStorage.setItem(StorageKeys.USER, JSON.stringify(DefaultData.user));
        }
        if (!localStorage.getItem(StorageKeys.TRAINERS)) {
            localStorage.setItem(StorageKeys.TRAINERS, JSON.stringify(DefaultData.trainers));
        }
        if (!localStorage.getItem(StorageKeys.MEMBERSHIPS)) {
            localStorage.setItem(StorageKeys.MEMBERSHIPS, JSON.stringify(DefaultData.memberships));
        }
        if (!localStorage.getItem(StorageKeys.ATTENDANCE)) {
            localStorage.setItem(StorageKeys.ATTENDANCE, JSON.stringify(DefaultData.attendance));
        }
        if (!localStorage.getItem(StorageKeys.WORKOUTS)) {
            localStorage.setItem(StorageKeys.WORKOUTS, JSON.stringify(DefaultData.workouts));
        }
        if (!localStorage.getItem(StorageKeys.DIET)) {
            localStorage.setItem(StorageKeys.DIET, JSON.stringify(DefaultData.diet));
        }
        if (!localStorage.getItem(StorageKeys.CLASSES)) {
            localStorage.setItem(StorageKeys.CLASSES, JSON.stringify(DefaultData.classes));
        }
        if (!localStorage.getItem(StorageKeys.BOOKINGS)) {
            localStorage.setItem(StorageKeys.BOOKINGS, JSON.stringify(DefaultData.bookings));
        }
        if (!localStorage.getItem(StorageKeys.PAYMENTS)) {
            localStorage.setItem(StorageKeys.PAYMENTS, JSON.stringify(DefaultData.payments));
        }
        if (!localStorage.getItem(StorageKeys.NOTIFICATIONS)) {
            localStorage.setItem(StorageKeys.NOTIFICATIONS, JSON.stringify(DefaultData.notifications));
        }
        if (!localStorage.getItem(StorageKeys.ENQUIRIES)) {
            localStorage.setItem(StorageKeys.ENQUIRIES, JSON.stringify(DefaultData.enquiries));
        }
        if (!localStorage.getItem(StorageKeys.SETTINGS)) {
            localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(DefaultData.settings));
        }
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error for key:', key, e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error for key:', key, e);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

// Initialize default storage immediately
StorageManager.init();
