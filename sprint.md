
### **The Complete Agile Development Plan: DBC SWO App**

**Methodology:** Agile (Sprints)
**Sprint Duration:** 2 Weeks
**Total Sprints:** 7
**Estimated Timeline:** 14 Weeks

---

### **Sprint 0: Project Setup & Core Schema (1 Week - Pre-Development)**
**Goal:** Prepare the entire development environment and foundational database tables. This is the "sharpen the axe" phase.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-0.1** | **Setup** | Initialize the Turborepo monorepo with Next.js (Web) and Expo (Mobile) workspaces. |
| **T-0.2** | **Setup** | Create the Supabase project. Link it to the monorepo environment. |
| **T-0.3** | **Database** | **Create Initial Schema:** Write and execute the SQL to create `profiles`, `admin_whitelist`, `houses`, `groups`, `group_members`, `events`, and `registrations` tables. |
| **T-0.4** | **Design** | **Create Low-Fidelity Figma Wireframes:** Establish the core Design System: colors, typography, and reusable components (Event Card, Group Card, Buttons). |
| **T-0.5** | **Deployment**| Deploy the simple Privacy Policy & Terms of Service pages on Vercel. |
| **T-0.6** | **Backend** | Set up the Google Cloud Project and acquire the Client ID/Secret for later use. |

---

### **Sprint 1: The Authentication Foundation (2 Weeks)**
**Goal:** A user can securely create an account, log in, and provide their essential information. The system can distinguish between Admins and Students.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-1.1** | **Backend** | Configure Supabase Auth for Email (OTP) and integrate the custom SMTP provider. |
| **T-1.2** | **Backend** | Implement and test the `handle_new_user_and_set_role` database trigger to assign roles on signup. |
| **T-1.3** | **Mobile App**| **Build the Login Screen:** Implement the UI for a user to enter their email and receive an OTP. |
| **T-1.4** | **Mobile App**| **Build the Onboarding Flow:** Create the mandatory "Complete Your Profile" form to collect `college_id`, branch, and year. |
| **T-1.5** | **Mobile App**| Implement the "Onboarding Guard" logic that redirects new users to the form and existing users to the app. |
| **T-1.6** | **Web Admin** | **Build the Admin Login Page:** Implement the separate OTP login for the web application. |
| **T-1.7** | **Database** | **Implement Core RLS Policies:** Write and apply the initial Row Level Security policies for the `profiles` and `admin_whitelist` tables. |

---

### **Sprint 2: The Core Event Loop (2 Weeks)**
**Goal:** An Admin can create an event, and a Student can discover and register for it. This creates the first end-to-end user journey.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-2.1** | **Web Admin** | **Build the "Create Event" page:** Implement the form for creating a new event, linking the admin's ID as `created_by`. |
| **T-2.2** | **Web Admin** | **Build the Admin Dashboard:** Create the main page for admins to view a list/grid of all events they have created. |
| **T-2.3** | **Mobile App**| **Build the `Events` Tab:** Fetch and display all 'published' events using the reusable Event Card component from Figma. |
| **T-2.4** | **Mobile App**| **Build the `Event Detail` Screen:** Show full details for a selected event. |
| **T-2.5** | **Mobile App**| **Implement Registration Logic:** Add the "Register" button and the backend logic to create a new entry in the `registrations` table. |
| **T-2.6** | **Mobile App**| **Build the `My Registrations` Tab:** Create the UI to show the logged-in user their active and past registrations. |

---

### **Sprint 3: House & Group Identity (2 Weeks)**
**Goal:** Assign every student to their communities (House and Academic Group) and reflect this identity within the app.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-3.1** | **Web Admin** | **Build the "House Management" Page:** Create the UI for the Super Admin to view house stats. |
| **T-3.2** | **Web Admin** | **Build the Bulk CSV Upload Tool:** Implement the frontend for uploading the student-to-house assignment file. |
| **T-3.3** | **Backend** | **Write the Bulk Assign Logic:** Create the Supabase Edge Function to process the CSV and update user profiles. |
| **T-3.4** | **Web Admin** | **Build the "Group Management" Page:** Allow the Super Admin to create new academic/club groups. |
| **T-3.5** | **Backend** | Implement the trigger to automatically add students to academic groups based on their branch. |
| **T-3.6** | **Mobile App**| **Build the `Groups` Tab:** Implement the main screen showing the personalized list of "My Groups". |
| **T-3.7** | **Mobile App**| **Update the `Profile` Screen:** Display the user's assigned House and other key information. |

---

### **Sprint 4: Sports Registration & Event Manager Setup (2 Weeks)**
**Goal:** Build the engine for Sports Day registration and implement the simplified two-role admin system.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-4.1** | **Web Admin** | **Implement "Assign Manager" Feature:** On the "Create/Edit Event" page, allow the Super Admin to assign an Event Manager. |
| **T-4.2** | **Web Admin** | **Implement "Manage Sports" Feature:** For "Sports Day" events, allow an admin to add specific sports (e.g., Football). |
| **T-4.3** | **Mobile App**| **Build the "Sports Hub" Screen:** When viewing a Sports Day event, show the list of available sports for registration. |
| **T-4.4** | **Mobile App**| **Build the Sports Registration Form:** Create the UI for students to select position/experience and join the "player pool". |
| **T-4.5** | **Web Admin**| **Build the Event Manager Dashboard (View Only):** Create the simplified, filtered dashboard that only shows assigned events to the Event Manager. |
| **T-4.6** | **Mobile App**| **Build the Group Detail Screens:** Implement the conditional UI (Feed for clubs, Sports Hub for houses). |

---

### **Sprint 5: Team Shortlisting & Game Day Live (2 Weeks)**
**Goal:** Empower the Event Manager to manage their event, enter scores, and bring the app to life with real-time updates.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-5.1** | **Web Admin** | **Build the "Shortlist Names" UI:** On the Event Manager Dashboard, create the interface to view the player pool and select the final team. |
| **T-5.2** | **Web Admin** | **Build the "Live Score Entry" UI:** Create the simple form for the Event Manager to input match results and declare a winner. |
| **T-5.3** | **Backend** | **Implement Real-time Logic:** Write the function to automatically update House points when a score is submitted. |
| **T-5.4** | **Mobile App**| **Enable Real-time Updates:** Connect the Sports Hub Leaderboard to Supabase Realtime so scores and ranks update instantly. |
| **T-5.5** | **Mobile App**| **Build the `Profile` Screen:** Implement the full profile UI with Activity Stats and the Achievements section. |
| **T-5.6** | **Mobile App**| **Build the "Digital ID Pass" screen** with the QR code for event check-ins. |

---

### **Sprint 6: Polish, Notifications & Launch Prep (2 Weeks)**
**Goal:** Finalize the user experience with high-impact features, conduct thorough testing, and prepare for deployment.

| Task ID | Component | Task Description |
| :--- | :--- | :--- |
| **T-6.1** | **Backend** | **Set up Push Notifications:** Integrate a service like Expo Push Notifications for key alerts (e.g., registration confirmed, match starting). |
| **T-6.2** | **Mobile App**| **Implement the Hamburger Menu** and all its secondary navigation links (Help, Feedback, etc.). |
| **T-6.3** | **Mobile App**| **Implement Optional Google Auth:** Add the "Sign in with Google" button as a secondary, faster login method for existing users. |
| **T-6.4** | **All** | **Comprehensive Testing & Bug Fixing:** Perform end-to-end testing of all user flows on both iOS and Android devices. |
| **T-6.5** | **All** | **Performance & UI Polish:** Optimize image loading, refine animations, and ensure a smooth user experience. |
| **T-6.6** | **Deployment**| **Prepare for Store Submission:** Generate app icons, splash screens, and prepare the listings for the Apple App Store and Google Play Store. |