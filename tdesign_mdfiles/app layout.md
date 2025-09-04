
### **Visual Blueprint for the DBC SWO App**

### **I. Core Navigation**

#### **A. The Bottom Tab Bar**
*This is always visible at the bottom of the main screens.*```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  🏠     │   🎪    │   🎟️   │   🏆    │   👤    │
│  Home   │ Events  │ My Reg  │ Groups  │Profile  │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

#### **B. The Hamburger Menu / Side Drawer**
*Accessed by tapping `☰` on the Home screen header. Slides in from the left.*
```
┌───────────────────────────┐
│ (Avatar) Rahul Sharma     │
│ ───────────────────────── │
│ 🏠 Home                   │
│ 🔍 Discover Groups        │
│ ⚙️ App Settings            │
│ ❓ Help & Support         │
│ 📝 Submit Feedback        │
│ ───────────────────────── │
│ →🚪 Log Out               │
└───────────────────────────┘```

---

### **II. The Main Screens**

#### **A. 🏠 Home Screen**
*The dynamic, personalized landing page.*
```
┌─────────────────────────────────────┐
│ ☰  Good morning, Rahul! 👋          │
├─────────────────────────────────────┤
│ 🏆 SPORTS DAY IS LIVE!              │
│      GO 🔴 RED WARRIORS!            │
│      [Follow Live →]                │
├─────────────────────────────────────┤
│ 📅 UPCOMING EVENTS                  │
│  • Workshop: AI/ML • Tomorrow       │
│  • Music Club Auditions • Fri       │
│  • Tech Fest • Dec 15               │
├─────────────────────────────────────┤
│ 👥 MY GROUPS SNAPSHOT   [View All →] │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ 🔴 Red  │ │ 💻 BCA  │ │ 🎸...│ │
│  │Warriors │ │ Assoc.  │ │        │ │
│  │Rank #2  │ │New Post │ │        │ │
│  └─────────┘ └─────────┘ └────────┘ │
└─────────────────────────────────────┘
```

#### **B. 🎪 Events Screen**
*The discovery engine for all college events.*
```
┌─────────────────────────────────────┐
│ [🔍 Search events...]  [🎯 Filter]   │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🎭 TECH FEST 2024              │ │
│ │ Dec 15-17 • Main Auditorium     │ │
│ │ 🔥 Trending  👥 1.2K registered  │ │
│ │ [View Details]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏀 BASKETBALL AUDITIONS         │ │
│ │ Dec 20 • Sports Complex         │ │
│ │ College Only ⚠️ 15 spots left │ │
│ │ [View Details]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### **C. 🎟️ My Registrations Screen**
*The user's personal event planner.*
```
┌─────────────────────────────────────┐
│ MY REGISTRATIONS                    │
├─────────────────────────────────────┤
│ [Active] [Past] [Cancelled]         │
├─────────────────────────────────────┤
│                                     │
│ ✅ Confirmed                        │
│    Tech Fest 2024                   │
│    Tomorrow, 9:00 AM                │
│    [View Ticket] [Add to Calendar]  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ⏳ Waitlisted (#12)                 │
│    Workshop: Advanced Python        │
│    Dec 18, 2:00 PM                  │
│    [View Status] [Cancel]           │
│                                     │
└─────────────────────────────────────┘
```

#### **D. 🏆 Groups Screen**
*The central hub for all of the user's communities.*
```
┌─────────────────────────────────────┐
│ MY GROUPS                           │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔴 RED WARRIORS                 │ │
│ │ Sports House • Rank #2            │ │
│ │ ⚡ LIVE: Football Match vs Blue  │ │
│ │ [View Sports Hub →]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💻 BCA ASSOCIATION              │ │
│ │ Academic Group • 125 Members    │ │
│ │ 📢 New: Workshop on AI/ML       │ │
│ │ [View Group Feed →]             │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### **E. 👤 Profile Screen**
*The user's identity, stats, and settings hub.*
```
┌─────────────────────────────────────┐
│ PROFILE                             │
├─────────────────────────────────────┤
│                                     │
│            (  Rahul's  )            │
│            ( Avatar   )             │
│            (__________)             │
│                                     │
│           RAHUL SHARMA              │
│      ID: CS101 • 3rd Year CSE       │
│                                     │
│  [ 🎟️  View My Digital ID Pass ]    │
│                                     │
├─────────────────────────────────────┤
│ 📊 ACTIVITY STATS                   │
│  ┌───────────┬───────────┬──────────┐ │
│  │    12     │     3     │    85    │ │
│  │  Events   │   Events  │   Pts    │ │
│  │ Attended  │    Won    │ Contrib. │ │
│  └───────────┴───────────┴──────────┘ │
├─────────────────────────────────────┤
│ 🏆 MY ACHIEVEMENTS                  │
│  🥇 Football Champions - 2024      │
│  🏆 Player of the Tournament       │
│  [ View All Achievements → ]        │
├─────────────────────────────────────┤
│  ⚙️  App Settings                   [ > ] │
│  ❓ Help & Support                  [ > ] │
│  →🚪 Log Out                        │
└─────────────────────────────────────┘
```

---

### **III. Secondary & Detail Screens**

#### **A. The Digital ID Pass Screen**
*Accessed from the Profile. Designed for quick scanning.*
```
┌─────────────────────────────────────┐
│ ╔═════════════════════════════════╗ │
│ ║    DON BOSCO COLLEGE - BENGALURU  ║ │
│ ╠═════════════════════════════════╣ │
│ ║ ( Avatar )  RAHUL SHARMA          ║ │
│ ║ (        )  ID: CS101             ║ │
│ ║ (________)  B.Tech - CSE          ║ │
│ ║             3rd Year              ║ │
│ ║                                   ║ │
│ ║     House: 🔴 Red Warriors        ║ │
│ ╚═════════════════════════════════╝ │
│                                     │
│       ┌───────────────────┐         │
│       │ ▄▀▀▄ ▄▀▄ █▄▀ █▀▀  │         │
│       │ ▀▄▄▀ █▀█ █ █ █▀▀  │         │
│       │ ▄▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀  │         │
│       │ ▄▀▀▄▀▄▀▄ ▄▀▀ █▀▄  │         │
│       │ █ ▀▄ █ █ ▀▄▄ █▀▄  │         │
│       └───────────────────┘         │
│  Show this QR code at event check-in  │
└─────────────────────────────────────┘
```

#### **B. The Group Detail Screen (for non-sports groups)**
*Accessed from the Groups tab. Shows a community feed.*
```
┌─────────────────────────────────────┐
│ [← Back] 💻 BCA ASSOCIATION         │
│ Academic Group • You are a member     │
├─────────────────────────────────────┤
│ [Feed] [Events] [Members]           │
├─────────────────────────────────────┤
│ FEED:                               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Dr. Anitha Sharma • 2h ago        │ │
│ │                                   │ │
│ │ Announcing a guest lecture on     │ │
│ │ "The Future of Quantum Computing".│ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### **C. The Sports Hub Screen (for sports houses)**
*Accessed from the Groups tab. Shows the competition dashboard.*
```
┌─────────────────────────────────────┐
│ [← Back] 🔴 RED WARRIORS            │
│ Sports House • Rank #2              │
├─────────────────────────────────────┤
│ 🏆 LIVE LEADERBOARD                │
│ 1. 🟢 Titans   [//////////] 425   │
│ 2. 🔴 Warriors [///////// ] 340   │
│ 3. 🔵 Dragons  [////////  ] 315   │
│ 4. 🟡 Hawks    [///////   ] 290   │
├─────────────────────────────────────┤
│ 📅 UPCOMING MATCHES                 │
│ • Cricket Final vs Green Titans    │
│   Today @ 4:00 PM                  │
│   [Set Reminder] [View Details]    │
└─────────────────────────────────────┘
```