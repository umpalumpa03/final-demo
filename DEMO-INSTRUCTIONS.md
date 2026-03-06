# TIA Banking Platform - Demo Instructions

## 🎯 Quick Start

This is a **fully functional demo** of the TIA Internet Banking Platform running with **mock data** (no backend required).

### Running the Demo

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npx nx serve tia-frontend

# Open browser to: http://localhost:4200
```

### Demo Credentials

#### Consumer User (Regular Banking)
- **Username:** `demo`
- **Password:** `demo`
- **OTP Code:** Any 6-digit code (e.g., `123456`)

#### Support User (Admin Panel)
- **Username:** `support`
- **Password:** `support`
- **OTP Code:** Any 6-digit code (e.g., `123456`)

---

## 🌟 Features to Showcase

### For Consumer User (`demo/demo`):

1. **Dashboard**
   - Customizable widget layout
   - Account overview with balances
   - Exchange rates widget
   - Recent transactions

2. **Accounts & Cards**
   - View all bank accounts (GEL, USD)
   - Multiple cards (Visa, Mastercard, Amex)
   - Card details with CVV reveal
   - Create new cards with design preview

3. **Transactions**
   - Full transaction history
   - Advanced filters (date, category, amount)
   - Export to Excel
   - Custom categories

4. **Transfers**
   - Internal transfers (between own accounts)
   - External transfers (to other banks)
   - Multi-step wizard with validation
   - OTP verification

5. **Loans**
   - Active and completed loans
   - Loan details with payment schedule
   - Prepayment calculator
   - Request new loans

6. **Financial Analytics**
   - Income vs Expenses charts
   - Category breakdown (pie chart)
   - Daily spending trends
   - Savings analysis

7. **Bill Payments**
   - Multiple provider categories
   - Payment templates
   - Template groups
   - Batch payments

8. **Messaging**
   - Internal inbox
   - Compose messages
   - Reply to threads
   - Unread count

9. **Settings**
   - Theme switching (Light/Dark)
   - Language preferences
   - Password change
   - Two-factor authentication
   - Profile photo upload

### For Support User (`support/support`):

All consumer features PLUS:

10. **User Management**
    - View all users
    - Create/Edit/Delete users
    - Role management

11. **Loan Management**
    - Approve/Decline loan requests
    - Risk assessment
    - Loan details review

12. **Account Management**
    - Manage user accounts
    - Account permissions
    - Account approval workflow

13. **Card Approval**
    - Review pending card requests
    - Approve/Decline cards

---

## 📱 Responsive Design

The application is fully responsive:
- **Desktop:** Full feature set
- **Tablet (1024px):** Optimized layout
- **Mobile (768px and below):** Mobile-first design

Test by resizing your browser or using Chrome DevTools device emulation.

---

## 🎨 Visual Highlights

### Design System
- 50+ reusable UI components
- Consistent color palette
- Smooth animations and transitions
- Accessible design patterns

### Charts & Visualizations
- Chart.js powered analytics
- Interactive financial dashboards
- Real-time data updates

### User Experience
- Multi-step wizards for complex flows
- Inline validation
- Loading states and skeletons
- Error handling with user-friendly messages
- Confetti celebrations on special events

---

## 🔧 Technical Stack

- **Framework:** Angular 21 (Standalone Components)
- **State Management:** NgRx Store + NgRx Signal Store
- **Monorepo:** Nx 22
- **Styling:** SCSS (component-scoped)
- **Charts:** Chart.js + ng2-charts
- **Build:** Vite 7
- **Testing:** Vitest + Playwright

---

## 💡 Demo Tips

1. **Try both user types** to see consumer vs admin features
2. **Create new items** (cards, loans, transfers) - they persist in localStorage
3. **Test responsive design** by resizing the browser
4. **Explore all sections** - each has unique features
5. **Check the theme switcher** in Settings → Appearance
6. **View the component showcase** at `/storybook` route (if available)

---

## 📊 Mock Data Details

All data is generated in-memory and persists in localStorage:
- **Accounts:** 3 demo accounts (GEL, USD)
- **Cards:** 3 cards across different accounts
- **Transactions:** Sample transaction history
- **Loans:** 2 demo loans (approved and pending)
- **Messages:** Welcome emails
- **Notifications:** Sample alerts

New items you create (loans, cards, templates) are saved to localStorage and persist across page reloads.

---

## 🚀 Production Build

To create a production build:

```bash
npx nx build tia-frontend --configuration=production
```

Output will be in: `dist/apps/tia-frontend/`

You can serve it with any static file server:

```bash
npx serve dist/apps/tia-frontend
```

---

## 🎯 What This Demonstrates

### Frontend Skills:
- ✅ Complex state management (NgRx)
- ✅ Reactive programming (RxJS)
- ✅ Component architecture
- ✅ Responsive design
- ✅ Form validation
- ✅ API integration patterns
- ✅ Authentication flows
- ✅ Route guards and lazy loading
- ✅ Internationalization (i18n)
- ✅ Testing (unit + integration)
- ✅ Performance optimization
- ✅ Accessibility considerations

### Business Features:
- ✅ Banking operations
- ✅ Financial analytics
- ✅ User management
- ✅ Approval workflows
- ✅ Messaging system
- ✅ Payment processing
- ✅ Multi-step wizards
- ✅ Data export (Excel)

---

## 📞 Questions?

This is a demonstration project showcasing modern Angular development practices and enterprise-level UI/UX design.

**Note:** All data is mock data. No real banking operations are performed.
