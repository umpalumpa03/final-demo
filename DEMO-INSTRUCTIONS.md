# TIA Banking Platform — Demo Guide

## Quick Start

```bash
npm install
npx nx serve tia-frontend
# → http://localhost:4200
```

---

## Login Credentials

| Role | Username | Password | OTP |
|------|----------|----------|-----|
| Consumer | `demo` | `demo` | any 6 digits |
| Admin (Support) | `support` | `support` | any 6 digits |

---

## Features I Built

### 1. First-Login Showcase (Onboarding)

Login as `demo / demo` and you'll see a **6-step onboarding modal** automatically.

What it does:
- Walks the user through the app on every fresh login
- Highlights sidebar navigation, messaging, notifications, widget customization
- Uses Angular Signals + NgRx Store to track completion state
- Dismissing it dispatches `updateOnboardingStatus` and persists the flag — re-login resets it so you can demo it again

---

### 2. Loans Feature (Consumer)

Login as `demo / demo` → navigate to **Loans** in the sidebar.

Everything is pre-seeded to show all states at once:

| Loan | Status | What to demo |
|------|--------|--------------|
| Car Loan | Approved ✅ | Click → view details, payment schedule, trigger prepayment flow |
| Student Loan | Approved ✅ | Click → prepayment with OTP verification (any 6 digits) |
| Home Renovation | Pending ⏳ | Shows pending tab, no prepayment available |
| (no name) | Declined ❌ | Shows declined tab |

**Full flow to walk through:**
1. **All tab** — see all 4 loans, search by name/purpose/amount
2. **Approved tab** — filter to approved only
3. **Pending / Declined tabs** — status filtering
4. **Rename** — click the edit icon on any loan card, type a new name, press Enter → persists
5. **Loan details** — click any approved loan → drawer opens with full details (address, contact, payment schedule, interest rate)
6. **Prepayment** — inside details, click "Prepayment" → choose full or partial → review calculation → enter any 6-digit OTP → success
7. **Request new loan** — click "Request Loan" button → fill form (amount, months, purpose, account) → submit → appears in Pending tab
8. **Account filter** — navigate from Accounts page to see loans filtered by account

---

### 3. User Management (Admin / Support)

Login as `support / support` → go to **Settings** → **User Management**.

What to demo:
- **User list** with search and pagination
- **View details** — click Details on any user → modal with full profile
- **Edit user** — click Edit → change name, role, block status → save → list updates live
- **Block / Unblock** — toggle button on each card → instant optimistic update
- **Delete user** — click Delete → confirm modal → user removed from list

Also in Settings (support only):
- **Loan Management** — approve or reject pending loan requests with risk assessment drawer
- **Approve Cards** — review and approve/decline pending card requests
- **Approve Accounts** — review pending account requests, set permissions

---

## Theme

The app defaults to **Deep Blue** (dark). If you see light theme after login:

```js
// Run in browser console, then refresh
localStorage.setItem('theme', 'deepBlue')
```
