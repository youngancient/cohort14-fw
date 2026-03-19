# ExcelSchool — Frontend Task Split

React app. 5 members. No wallet integration yet — just UI with mock data and forms.

---

## Pages & Who Owns What

### Member 1 — Shared Components
> Used by everyone. Build these first so the rest of the team can work.

Components to build:

- `Navbar` — logo + nav links (Home, Dashboard, Students, Staff, Claim)
- `Sidebar` — left nav for inner pages
- `Button` — primary, danger, ghost variants
- `Input` / `FormField` — label + input + error message
- `Modal` — reusable dialog wrapper
- `Table` — reusable table with columns + rows props
- `Badge` — status pill: paid, unpaid, suspended, active
- `PageLayout` — wraps Sidebar + page content area

---

### Member 2 — Dashboard Page (`/dashboard`)

Contract reads it covers:
- `getContractBalance()` → show treasury balance
- `getAllStudentDetails()` → total student count
- `getAllStaffDetails()` → total staff count

UI to build:
- 3 stat cards: Total Students, Total Staff, Contract Balance
- A recent activity list (mock data, static)
- Quick links to Students and Staff pages

---

### Member 3 — Students Page (`/students`)

Contract functions it covers:
- `getAllStudentDetails()` → list all students in a table
- `addStudent(name, level, age)` → form in a modal
- `removeStudent(studentId)` → button per row with confirmation

UI to build:
- Table of all students (ID, Name, Level, Age, Payment Status, Wallet)
- "+ Add Student" button → opens modal with form (Name, Level dropdown, Age)
- "Remove" button on each row → confirmation modal before action

---

### Member 4 — Staff Page (`/staff`)

Contract functions it covers:
- `getAllStaffDetails()` → list all staff in a table
- `addStaff(name, salary)` → form in a modal
- `payStaff(wallet)` → button per row
- `suspendStaff(staffId)` → button per row
- `unSuspendStaff(staffId)` → toggle based on current status

UI to build:
- Table of all staff (ID, Name, Wallet, Salary, Status, Last Paid)
- "+ Add Staff" button → opens modal with form (Name, Salary)
- "Pay" button per row (disabled if suspended)
- "Suspend / Unsuspend" toggle button per row

---

### Member 5 — Claim Portal (`/claim`)

Contract functions it covers:
- `claimFaucet(address)` → get tokens
- `approveStudent(amount)` → approve spend before claiming ID
- `claimStudentId(id)` → student claims their slot
- `claimStaffId(id)` → staff claims their slot

UI to build:
- Step 1: "Claim Faucet Tokens" card + Claim button (shows success state if already claimed)
- Step 2: Choose role — two cards: "I'm a Student" / "I'm Staff"
- Step 3: Enter ID number + Claim button
  - If student: show fee amount + Approve button first, then Claim button
  - If staff: just Claim button, no fee

---

## Folder Structure

```
src/
├── components/
│   └── shared/          ← Member 1 owns this
│       ├── Sidebar.jsx
│       ├── PageLayout.jsx
│       ├── Button.jsx
│       ├── FormField.jsx
│       ├── Modal.jsx
│       ├── Table.jsx
│       └── Badge.jsx
│
├── pages/
│   ├── Dashboard.jsx    ← Member 2
│   ├── Students.jsx     ← Member 3
│   ├── Staff.jsx        ← Member 4
│   └── ClaimPortal.jsx  ← Member 5
│
└── data/
    └── mockData.js      ← Everyone imports from here, nobody hardcodes their own
```

---

## Mock Data (everyone uses this)

```js
// src/data/mockData.js

export const mockStudents = [
  { id: 0, name: "Nnadi Betel", level: 200, age: 21, paymentStatus: "paid", wallet: "0xAbCd...1234" },
  { id: 1, name: "Owase Samuel", level: 100, age: 19, paymentStatus: "unpaid", wallet: "0x0000...0000" },
];

export const mockStaff = [
  { id: 0, name: "Miss Shuiab Ganiyat", salary: 500, status: "active", wallet: "0xDeAd...bEeF", lastPaid: "2025-02-28" },
  { id: 1, name: "Miss Egbela Joy", salary: 300, status: "suspended", wallet: "0x1111...2222", lastPaid: null },
];

export const mockContractBalance = 985000;
```

---

## Rules

1. Build shared components (Member 1) before page work starts
2. Import from `mockData.js` — don't hardcode data inside your page
3. Use `PageLayout` as your wrapper — don't rebuild the sidebar in your page
4. Branch naming: `page/students`, `page/staff`, `page/claim`, `page/dashboard`, `feat/shared`