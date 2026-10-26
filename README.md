# 🏥 We Care Hospital

A modern hospital website where patients can explore departments, meet the doctors and **book appointments online**. It includes patient accounts, a "My Consultations" page and an admin portal for managing all bookings.

---

## ✨ Features

### For patients
- **Home, About and Departments pages** with services and statistics for each specialty.
- **6 departments:** Cardiology, Pediatrics, Orthopedics, Neurology, Oncology and Dermatology.
- **Doctor directory** – detailed profiles with specialty, education, experience, ratings, availability and time slots.
- **4-step appointment booking:**
  1. Choose a department
  2. Choose a specialist doctor
  3. Pick a date and time slot
  4. Enter patient details and confirm
- **Digital clinic pass** shown after a successful booking.
- **My Consultations** – view your appointments and cancel them in real time.
- **Authentication** – sign in with Google, email and password, or try a demo account.

### For administrators
- **Admin portal** with live appointment updates.
- Filter bookings by status (confirmed, completed, cancelled) and see summary counts.
- Update an appointment's status, or create a booking manually.

### Security
- Cloud Firestore **security rules** validate every booking field, restrict patients to their own records and give admins full access.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Lucide React
- **Backend / Database:** Firebase Authentication and Cloud Firestore
- **Language:** TypeScript

---

## 📁 Project Structure

```
├── index.html
├── firestore.rules             # Firestore security rules
├── firebase-blueprint.json
├── src/
│   ├── App.tsx                 # Tab navigation and app state
│   ├── data.ts                 # Departments, doctors, testimonials
│   ├── types.ts
│   ├── firebase.ts             # Firebase setup + error handling
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication logic
│   └── components/
│       ├── HomeView.tsx
│       ├── AboutView.tsx
│       ├── DepartmentsView.tsx
│       ├── DoctorsView.tsx
│       ├── DoctorProfileModal.tsx
│       ├── AppointmentBookingView.tsx
│       ├── MyBookingsView.tsx
│       ├── AdminPortalView.tsx
│       ├── SignInSection.tsx
│       ├── Header.tsx
│       └── Footer.tsx
└── .env.example
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and a [Firebase](https://console.firebase.google.com) project.

```bash
# 1. Clone the repository
git clone https://github.com/GayatriN-16/We-Care-Hospital.git
cd We-Care-Hospital

# 2. Install dependencies
npm install

# 3. Set up Firebase
#    - Enable Authentication (Google, Email/Password, Anonymous)
#    - Create a Cloud Firestore database
#    - Publish the rules from firestore.rules
#    - Put your project's web config in firebase-applet-config.json

# 4. Start the app
npm run dev
```

Open **http://localhost:3000**.

> **Tip:** Google sign-in popups are blocked inside embedded previews. Open the app in its own browser tab to use Google login, or use email sign-in or the demo account.

### Production build

```bash
npm run build
npm run preview
```

---

## 🔐 Firebase Configuration

The app reads its Firebase settings (API key, auth domain, project ID, storage bucket, messaging sender ID and app ID) from `firebase-applet-config.json`. Replace the values with your own Firebase project's web config. Admin access is controlled by the admin email list in `firestore.rules` and `src/context/AuthContext.tsx`, so update both to your own email.

---

## 🗺️ Roadmap

- Email / SMS appointment reminders
- Online payment for consultations
- Patient medical records and prescriptions
- Multi-language support

---

> The doctors, departments and testimonials in this project are **sample data** created for demonstration.

## 👩‍💻 Author

**Gayatri Nikam** – Final-year B.E. Computer Engineering student, aspiring Data Scientist
GitHub: [@GayatriN-16](https://github.com/GayatriN-16)
