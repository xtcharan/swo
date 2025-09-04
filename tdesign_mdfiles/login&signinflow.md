Of course. Here is the complete collection of all the Markdown blueprint cards for the entire user authentication and onboarding flow, from the very first screen to the in-app nudges.

---

### **Phase 1: The Initial Login & Sign-Up Flow**

These are the first two screens every user will interact with.

#### **Screen 1: The Unified Login Screen**
*   **Purpose:** The single entry point for all users: new, returning, students, guests, and admins.

```markdown
+-------------------------------------------+
|                                           |
|          [DBC SWO App Logo]               |
|                                           |
|          Welcome Back!                    |
|                                           |
|   /-----------------------------------\   |
|   | 📧 Email or Register Number       |   |
|   \-----------------------------------/   |
|                                           |
|   /-----------------------------------\   |
|   | 🔒 Password                       |   |
|   \-----------------------------------/   |
|                                           |
|          +-------------------+          |
|          |      LOG IN       |          |
|          +-------------------+          |
|                                           |
|              Forgot Password?             |
|                                           |
|   -------------------------------------   |
|                                           |
|   Don't have an account?      **Sign Up**   |
|                                           |
|                                           |
|   _Are you an Admin? Login here_          |
|                                           |
+-------------------------------------------+
```

---

#### **Screen 2: The "Sign Up" Choice Screen**
*   **Purpose:** To correctly route new users into either the "DBC Student" or "Guest" onboarding journey.

```markdown
+-------------------------------------------+
|                                           |
|   < Back                                  |
|                                           |
|          Join the Community               |
|                                           |
|     How would you like to sign up?        |
|                                           |
|   +-----------------------------------+   |
|   |                                   |   |
|   |       I am a DBC Student          |   |
|   |  _Activate your account using     |   |
|   |   your official Register Number_  |   |
|   |                                   |   |
|   +-----------------------------------+   |
|                                           |
|   +-----------------------------------+   |
|   |                                   |   |
|   |          I am a Guest             |   |
|   |  _Sign up for public events with  |   |
|   |         your email_             |   |
|   |                                   |   |
|   +-----------------------------------+   |
|                                           |
+-------------------------------------------+
```

---
### **Phase 2: Mandatory Onboarding Journeys**

These are the core data collection forms for new users.

#### **Screen A.1: DBC Student - Account Activation**
*   **Purpose:** The initial security gate for pre-provisioned DBC students.

```markdown
+-------------------------------------------+
|   < Back                                  |
|          Activate Your Account            |
|                                           |
|   /-----------------------------------\   |
|   | 🧑‍🎓 Enter Your Register Number    |   |
|   \-----------------------------------/   |
|                                           |
|   /-----------------------------------\   |
|   | 🔑 Enter Your Temporary Password  |   |
|   |   (This is also your Reg. No.)    |   |
|   \-----------------------------------/   |
|                                           |
|          +-------------------+          |
|          |      PROCEED      |          |
|          +-------------------+          |
+-------------------------------------------+
```
---

#### **Screen A.2: DBC Student - Complete & Secure Account**
*   **Purpose:** The all-in-one form for a DBC student to provide their details and set up their permanent login credentials.

```markdown
+-------------------------------------------+
|   < Back                                  |
|                                           |
|       Welcome! Let's get you set up.      |
|                                           |
|   Register Number: [ u19pd23s007 (Read-Only) ] |
|                                           |
|   --- Your Details ---                    |
|   First Name: [                     ]     |
|   Last Name:  [                     ]     |
|   Department: [ Select Department ▼ ]     |
|   Year:       [ Select Year ▼       ]     |
|   Phone No:   [                     ]     |
|                                           |
|   --- Your Login Info ---                 |
|   Personal Email: [ john.doe@gmail.com]   |
|   New Password:   [ •••••••••••         ] |
|   Confirm Pass:   [ •••••••••••         ] |
|                                           |
|      +--------------------------+       |
|      |  FINISH & VERIFY EMAIL   |       |
|      +--------------------------+       |
+-------------------------------------------+
```
---

#### **Screen B.1: Guest - Sign Up Form**
*   **Purpose:** The single, comprehensive sign-up form for any non-DBC user.

```markdown
+-------------------------------------------+
|   < Back                                  |
|          Create a Guest Account           |
|                                           |
|   --- Your Details ---                    |
|   First Name: [                     ]     |
|   Last Name:  [                     ]     |
|   College Name: [                     ]     |
|   Phone No:   [                     ]     |
|                                           |
|   --- Your Login Info ---                 |
|   Email:      [                     ]     |
|   Password:   [ •••••••••••         ]     |
|   Confirm Pass: [ •••••••••••         ]     |
|                                           |
|   [ ] I agree to the Terms of Service     |
|                                           |
|      +--------------------------+       |
|      |  CREATE & VERIFY EMAIL   |       |
|      +--------------------------+       |
+-------------------------------------------+
```
---

### **Phase 3: OTP Verification**

This screen is shown after a user submits form A.2 or B.1.

#### **Screen X.1: OTP Verification**
*   **Purpose:** A standard screen for users to enter the code sent to their email to prove ownership.

```markdown
+-------------------------------------------+
|   < Back                                  |
|                                           |
|          Verify Your Email                |
|                                           |
|   We've sent a 6-digit code to            |
|   **john.doe@gmail.com**.                 |
|   Please enter it below.                  |
|                                           |
|      [ _ ]-[ _ ]-[ _ ]-[ _ ]-[ _ ]-[ _ ]   |
|                                           |
|                                           |
|          +-------------------+          |
|          |      VERIFY       |          |
|          +-------------------+          |
|                                           |
|           _Didn't get a code? Resend_     |
|                                           |
+-------------------------------------------+
```
---

### **Phase 4: Optional Profile Personalization**

This is the final, optional screen shown to every new user after successful email verification.

#### **Screen 3: Polish Your Profile**
*   **Purpose:** To encourage users to add personalization details (avatar, username, interests) in a frictionless, skippable way.

```markdown
+-------------------------------------------+
|                                           |
|            You're in! 🎉                  |
|       Let's personalize your profile.     |
|                                           |
|           +-----------------+           |
|           |                 |           |
|           |      [ ➕ ]      |           |
|           |  Upload Avatar  |           |
|           |                 |           |
|           +-----------------+           |
|                                           |
|   Username:                               |
|   /-----------------------------------\   |
|   | @ (e.g., JohnDoe25)               |   |
|   \-----------------------------------/   |
|                                           |
|   --- What are you interested in? ---     |
|   [ Sports ] [ Tech ] [ Music ] [ Arts ]  |
|   [ Dance ] [ Debating ] [ Gaming ]       |
|                                           |
|          +-------------------+          |
|          |    SAVE & ENTER   |          |
|          +-------------------+          |
|                                           |
|                 _Skip for now_              |
|                                           |
+-------------------------------------------+```