<p align="center">
  <img src="https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif" alt="Angular" width="80" />
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" alt="Nx" width="70" />
  <img src="https://ngrx.io/assets/images/badge.svg" alt="NgRx" width="70" />
</p>

<h1 align="center">TIA — Internet Banking Platform</h1>

<p align="center">
  A full-featured internet banking single-page application built with <strong>Angular 21</strong>, <strong>NgRx</strong>, <strong>NgRx Signals</strong>, and <strong>Nx</strong> monorepo architecture. Fully responsive across desktop, tablet, and mobile viewports.
</p>

<p align="center">
  <a href="https://tia-frontend.netlify.app/"><strong>Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21.1.0-DD0031?logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/Nx-22.3.3-143055?logo=nx&logoColor=white" alt="Nx" />
  <img src="https://img.shields.io/badge/NgRx-21.0.1-BA2BD2?logo=ngrx&logoColor=white" alt="NgRx" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-4.0-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/SCSS-Modules-CC6699?logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white" alt="Netlify" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Architecture](#architecture)
  - [State Management — Hybrid NgRx Strategy](#state-management--hybrid-ngrx-strategy)
  - [Caching Mechanisms](#caching-mechanisms)
  - [Authentication Flow](#authentication-flow)
  - [Routing and Lazy Loading](#routing-and-lazy-loading)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Responsive Design](#responsive-design)
- [Feature Modules](#feature-modules)
- [Shared UI Component Library](#shared-ui-component-library)
- [Testing Strategy](#testing-strategy)
- [Icons](#icons)
- [Environment Configuration](#environment-configuration)
- [Code Quality](#code-quality)
- [Deployment](#deployment)

---

## Overview

**TIA** is a production-grade internet banking platform designed for managing bank accounts, cards, money transfers, bill payments, loans, financial analytics, and internal messaging. It features a comprehensive admin panel for user management, loan approvals, and account administration.

The application is built as an **Nx monorepo**, feature-based architecture. It uses a **hybrid state management** approach combining classic **NgRx Store** for global application state with **NgRx Signal Stores** for feature-scoped reactive state. Every feature module is **lazy-loaded** with route-level state provisioning, ensuring minimal initial bundle size and fast load times.

The app is **fully responsive** and adapts to desktop, tablet (1024px), and mobile (768px and below) viewports through a signal-based `BreakpointService` and extensive SCSS media queries across 130+ component stylesheets.

**Key highlights:**

- Standalone component architecture (no NgModules)
- Hybrid NgRx Store + NgRx Signal Store state management
- Multi-layer caching (service-level Map cache, NgRx selector memoization, translation module tracking)
- Token-based authentication with silent refresh and inactivity monitoring
- Route-level lazy loading with per-feature translation resolution
- 50+ reusable shared UI components with a built-in component showcase (Storybook-like)
- Unit and integration test files covering guards, stores, effects, services, and components
- Chart.js-powered financial analytics dashboard
- Excel export for transactions and loan data
- Confetti celebrations on key user milestones (birthday)
- Multi-step wizards for transfers, bill payments, and card creation

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Angular 21.1.0 (Standalone Components) |
| **Monorepo** | Nx 22.3.3 |
| **Language** | TypeScript 5.9.2 |
| **Global State** | NgRx Store 21 + Effects |
| **Feature State** | NgRx Signal Store 21 (`signalStore`, `withState`, `withMethods`, `withComputed`) |
| **Reactive Layer** | RxJS 7.8 |
| **Routing** | Angular Router (lazy-loaded feature modules) |
| **Forms** | Angular Reactive Forms |
| **Styling** | SCSS (component-scoped) |
| **Responsive** | Custom signal-based `BreakpointService` + Angular CDK + CSS media queries |
| **Charts** | Chart.js 4.5 + ng2-charts 8.0 |
| **Internationalization** | @ngx-translate/core 17 with lazy module loading |
| **Excel Export** | xlsx (SheetJS) 0.18 |
| **HTTP** | Angular HttpClient with functional interceptors |
| **Build** | Vite 7.0 (@angular/build) |
| **Unit Testing** | Vitest 4.0 + @analogjs/vitest-angular |
| **Linting** | ESLint 9 + angular-eslint + Nx module boundary rules |
| **Formatting** | Prettier 3.6 |
| **Deployment** | Netlify (frontend), Railway (API) |
| **Node** | >= 22.13.0 |

---

## Project Structure

```
tia-frontend/
├── apps/
│   └── tia-frontend/                    # Main Angular application
│       ├── public/
│       │   ├── i18n/en/                 # Translation JSON files (lazy-loaded per feature)
│       │   │   ├── common.json
│       │   │   ├── auth.json
│       │   │   ├── dashboard.json
│       │   │   ├── my-products.json
│       │   │   ├── transactions.json
│       │   │   ├── loans.json
│       │   │   ├── my-finances.json
│       │   │   ├── paybill.json
│       │   │   ├── messaging.json
│       │   │   └── settings.json
│       │   └── images/svg/              # SVG icon sets organized by feature
│       │       ├── auth/
│       │       ├── sidebar-nav/
│       │       ├── dashboard/
│       │       ├── cards/
│       │       ├── transfers/
│       │       ├── finances/
│       │       ├── messaging/
│       │       ├── settings/
│       │       └── ...
│       └── src/
│           ├── environments/
│           │   ├── environment.ts        # Development config
│           │   └── environment.prod.ts   # Production config
│           └── app/
│               ├── app.routes.ts         # Root routing configuration
│               ├── app.config.ts         # Application providers (NgRx, Translate, Interceptors)
│               ├── core/                 # Singleton services and infrastructure
│               │   ├── auth/
│               │   │   ├── components/   # Sign-in, Sign-up, Forgot Password
│               │   │   ├── guards/       # AuthGuard, GuestGuard, PhoneGuard, ResetPasswordGuard
│               │   │   ├── interceptors/ # Functional HTTP interceptor (token attach + 401 refresh)
│               │   │   ├── services/     # AuthService, TokenService, CredentialsService, InactivityMonitor
│               │   │   └── models/       # Token, AuthRequest, AuthResponse types
│               │   ├── guards/           # SupportRoleGuard (role-based access)
│               │   ├── i18n/             # TranslationLoaderService, LazyTranslateLoader
│               │   ├── otp-verification/ # Shared OTP verification flow
│               │   └── services/
│               │       ├── breakpoints/  # Signal-based BreakpointService
│               │       └── navigation/   # NavigationService
│               ├── store/                # Global NgRx state (actions, reducers, effects, selectors)
│               │   ├── theme/            # Theme switching (dark/light/system)
│               │   ├── products/
│               │   │   ├── accounts/     # Bank accounts global state
│               │   │   └── cards/        # Cards global state
│               │   ├── transactions/     # Transactions with cursor pagination + caching
│               │   ├── user-info/        # Current user profile
│               │   ├── personal-info/    # Personal details
│               │   └── exchange-rates/   # Currency exchange rates
│               ├── layout/               # Application shell
│               │   ├── bank.routes.ts    # Protected bank feature routes
│               │   └── ui/
│               │       ├── bank-header/  # Top navigation bar + notifications
│               │       └── sidebar/      # Sidebar navigation
│               ├── features/
│               │   ├── bank/
│               │   │   ├── dashboard/    # Main dashboard (widgets, onboarding, carousel)
│               │   │   ├── products/     # Accounts + Cards management
│               │   │   ├── transactions/ # Transaction history (filters, categories, export)
│               │   │   ├── transfers/    # Internal + External money transfers
│               │   │   ├── loans/        # Loan management + prepayment
│               │   │   ├── finances/     # Financial analytics (Chart.js dashboards)
│               │   │   ├── paybill/      # Bill payment (providers, templates, OTP)
│               │   │   ├── messaging/    # Internal messaging system (inbox, compose, replies)
│               │   │   └── settings/     # User settings hub
│               │   │       ├── appearance/       # Theme management (Signal Store)
│               │   │       ├── security/         # Password + 2FA (NgRx)
│               │   │       ├── profile-photo/    # Avatar upload (NgRx)
│               │   │       ├── language/         # Language preferences (Signal Store)
│               │   │       ├── user-management/  # Admin: user CRUD (Signal Store)
│               │   │       ├── loan-management/  # Admin: loan approval workflow (Signal Store)
│               │   │       ├── accounts/         # Admin: account management (Signal Store)
│               │   │       ├── approve-cards/    # Admin: card approval (Signal Store)
│               │   │       └── approve-accounts/ # Admin: account approval (Signal Store)
│               │   ├── storybook/        # Built-in component showcase
│               │   │   ├── alerts/
│               │   │   ├── badges/
│               │   │   ├── button/
│               │   │   ├── cards/
│               │   │   ├── colorpalettes/
│               │   │   ├── data-display/
│               │   │   ├── drag-and-drop/
│               │   │   ├── feedback/
│               │   │   ├── forms/
│               │   │   ├── input/
│               │   │   ├── layout/
│               │   │   ├── navigation/
│               │   │   ├── overlay/
│               │   │   └── tables/
│               │   ├── birthday/         # Birthday celebration (confetti)
│               │   └── wild-card/        # 404 page
│               └── shared/
│                   ├── lib/              # Reusable UI component library
│                   │   ├── primitives/   # Button, ButtonGroup
│                   │   ├── forms/        # Input, Checkbox, Dropdown, Radio, Slider, Switch, OTP
│                   │   ├── cards/        # BasicCard, CategoryCard, StatisticCard
│                   │   ├── alerts/       # Basic, Dismissible, WithActions, Simple
│                   │   ├── navigation/   # Navbar, Pagination, Pills, Tabs, Breadcrumbs
│                   │   ├── layout/       # Accordion, Collapsible, Flex, Grid, Resizable, Scroll, Separator
│                   │   ├── data-display/ # Avatar, HoverCard, KeyValue, List, Timeline, Tooltip, AspectRatio
│                   │   ├── overlay/      # CommandPalette, ContextMenu, Drawer, Sheet, Modal
│                   │   ├── feedback/     # ErrorStates, RouteLoader, Skeleton, Spinner
│                   │   ├── tables/       # Table with CRUD configuration
│                   │   ├── drag-n-drop/  # DragBase, DragCard, DragContainer, KanbanBoard
│                   │   ├── color-switching-buttons/
│                   │   ├── categories/
│                   │   └── palettes/
│                   ├── pipes/            # firstUpper, currency symbols, etc.
│                   ├── utils/            # camelCase, date helpers
│                   └── ui/               # HeaderBanner and other shared UI
├── nx.json                               # Nx workspace configuration
├── tsconfig.base.json                    # Path aliases (@tia/core/*, @tia/shared/*)
├── eslint.config.mjs                     # ESLint with Nx module boundary rules
├── vite.config.ts                        # Vite build configuration
└── package.json                          # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | >= 22.13.0, < 23 |
| **npm** | >= 10.0.0, < 11 |

### Installation

```bash
# Clone the repository
git clone <https://gitlab.com/new-group2660403/tia-frontend.git>
cd tia-frontend

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server
npx nx serve tia-frontend

# The app will be available at http://localhost:4200
```

### Building for Production

```bash
# Production build
npx nx build tia-frontend

# Build output will be in dist/apps/tia-frontend/
```

---

## Available Commands

```bash
# Development
npx nx serve tia-frontend                  # Start dev server (http://localhost:4200)

# Build
npx nx build tia-frontend                  # Production build
npx nx run-many -t build                   # Build all projects

# Testing
npx nx test tia-frontend                   # Run unit tests (Vitest)
npx nx test tia-frontend --coverage        # Run tests with coverage
npm run test:integration                   # Run integration tests
npm run test:pipeline                      # CI pipeline tests (affected + coverage check)

# Code Quality
npx nx lint tia-frontend                   # Lint with ESLint
npx nx run-many -t lint                    # Lint all projects
npx nx run-many -t lint test --parallel=3  # Run lint + test in parallel

# Workspace
npx nx graph                               # Visualize project dependency graph
npx nx show project tia-frontend --web     # View project details
npx nx list                                # List installed Nx plugins
npx nx affected -t test                    # Test only affected projects
npx nx affected -t lint                    # Lint only affected projects
```

---

## Architecture

### State Management — Hybrid NgRx Strategy

The application uses a **dual state management** approach, choosing the right tool for each level of state:

#### NgRx Store (Global State)

Classic NgRx with `createAction`, `createReducer`, `createEffect`, and `createSelector` for cross-feature, application-wide state:

| Store | Purpose |
|---|---|
| `theme` | Active theme (dark/light), synced to localStorage and DOM |
| `products/accounts` | Bank accounts across all features |
| `products/cards` | User card data across all features |
| `transactions` | Transaction list with cursor-based pagination and in-store caching |
| `user-info` | Authenticated user profile |
| `personal-info` | User personal details |
| `exchange-rates` | Currency exchange rates |
| `paybill` | Bill payment flow state |
| `security` | Security settings (password, 2FA) |
| `profile-photo` | Profile avatar management |

**Pattern:**
```
store/
├── theme/
│   ├── theme.actions.ts       # createActionGroup
│   ├── theme.reducer.ts       # createFeature + createReducer
│   ├── theme.effects.ts       # createEffect (functional)
│   └── theme.selectors.ts     # createSelector / createFeatureSelector
```

All effects use the **functional** `createEffect` pattern with `{ functional: true }`.

#### NgRx Signal Store (Feature State)

`@ngrx/signals` with `signalStore`, `withState`, `withMethods`, `withComputed`, and `rxMethod` for self-contained feature-level state:

| Signal Store | Feature |
|---|---|
| `FinancesStore` | Financial analytics dashboard (summary, charts, categories) |
| `MessagingStore` | Inbox, email detail, compose, replies |
| `TransfersStore` | Internal and external transfer flow |
| `LoansStore` | Loan listings and prepayment |
| `NotificationsStore` | Header notification bell |
| `AppearanceStore` | Theme list and theme switching |
| `LanguagesStore` | Language preferences |
| `UserManagementStore` | Admin user CRUD |
| `LoanManagementStore` | Admin loan approval workflow |
| `AccountsStore` | Admin account management |
| `ApproveCardsStore` | Admin card approval |
| `ApproveAccountsStore` | Admin account approval |

---

### Authentication Flow

```
                      ┌─────────────────┐
                      │   Sign In Page   │
                      │  (email + pass)  │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  OTP Verification│
                      └────────┬────────┘
                               │
                 ┌─────────────▼─────────────┐
                 │  TokenService stores       │
                 │  accessToken + refreshToken │
                 └─────────────┬─────────────┘
                               │
              ┌────────────────▼────────────────┐
              │  authInterceptor (functional)    │
              │  Attaches Bearer token to all    │
              │  non-public requests             │
              └────────────────┬────────────────┘
                               │
                  ┌────────────▼────────────┐
                  │  On 401 → silent token   │
                  │  refresh via refreshToken │
                  │  Queues concurrent reqs   │
                  └────────────┬────────────┘
                               │
               ┌───────────────▼───────────────┐
               │  InactivityMonitorService      │
               │  Auto-logout after idle period │
               └───────────────────────────────┘
```

**Guards:**

| Guard | Purpose |
|---|---|
| `AuthGuard` | Protects `/bank/**` — validates tokens and loads user info |
| `GuestGuard` | Redirects authenticated users away from `/auth/**` |
| `PhoneGuard` | Ensures phone verification before proceeding in sign-up |
| `ResetPasswordGuard` | Gate for password reset flow |
| `SupportRoleGuard` | Role-based access for admin features |
| Feature guards | `FromAccountSelectedGuard`, `AccountsSelectedGuard`, `RecipientVerifiedGuard` for transfer wizard steps |
| `UnsavedChangesGuard` | Warns before leaving appearance settings with unsaved changes |

---

### Routing and Lazy Loading

All feature modules are lazy-loaded with `loadChildren` or `loadComponent`. Each route provides its own NgRx state slice and translation modules via resolvers:

```
/                           → Redirect to /auth
/auth/sign-in               → Login (GuestGuard)
/auth/sign-up               → Registration + phone verification
/auth/forgot-password       → Password reset flow

/bank                       → Protected shell (AuthGuard + canActivateChild)
  /bank/dashboard           → Dashboard (widgets, onboarding, exchange rates)
  /bank/products            → Accounts + Cards management
  /bank/transactions        → Transaction history + filters + export
  /bank/transfers           → Internal + External money transfers
  /bank/loans               → Loan overview + prepayment calculator
  /bank/finances            → Financial analytics (Chart.js)
  /bank/paybill             → Bill payment (providers, categories, templates)
  /bank/messaging           → Internal messaging (inbox, compose, threads)
  /bank/settings            → Settings hub (9 sub-features)

/**                         → 404 wildcard page
```

---

### Internationalization (i18n)

Translations are handled by `@ngx-translate` with a custom **lazy loading** strategy:

- **Core translations** (`common`, `auth`, `sidebar`, `header-notifications`) are loaded at app bootstrap
- **Feature translations** are loaded per-route via `translationResolver()`, which calls `TranslationLoaderService.loadTranslations()`
- The `TranslationLoaderService` tracks loaded modules in a `Set` and skips already-loaded files
- Translation files are stored as flat JSON under `public/i18n/en/`

| Translation File | Loaded On |
|---|---|
| `common.json` | App bootstrap |
| `auth.json` | App bootstrap |
| `sidebar.json` | App bootstrap |
| `dashboard.json` | `/bank/dashboard` route |
| `my-products.json` | `/bank/products` route |
| `transactions.json` | `/bank/transactions` route |
| `loans.json` | `/bank/loans` route |
| `my-finances.json` | `/bank/finances` route |
| `paybill.json` | `/bank/paybill` route |
| `messaging.json` | `/bank/messaging` route |
| `settings.json` | `/bank/settings` route |

---

### Responsive Design

The application fully supports **desktop**, **tablet**, and **mobile** viewports:

**Signal-Based `BreakpointService`:**

Components inject `BreakpointService` and reactively adapt their layout, visibility, and behavior based on current viewport signals. This is complemented by **493 `@media` query rules** across 130 SCSS files for fine-grained visual adjustments at every breakpoint.

---

## Feature Modules

### Dashboard
- Customizable widget grid (accounts, exchange rates, recent transactions)
- Banner carousel
- First-time user onboarding wizard with navigation hub
- Customizable widget configuration

### Products (Accounts + Cards)
- Account list with balances and currency display
- Create new bank accounts
- Card gallery with grouped display by account
- Card details (number, expiry, CVV reveal)
- Create new cards with design selector and live card preview
- Card transaction history

### Transactions
- Filterable transaction list with search, date range, category, and amount filters
- Cursor-based pagination with infinite scroll (load more)
- Transaction categorization (create custom categories, assign to transactions)
- **Excel export** via SheetJS (`xlsx`) for data download
- Debounced filter updates (400ms) to reduce API calls

### Transfers
- **Internal transfers** — multi-step wizard: select from-account, select to-account, enter amount, review, success
- **External transfers** — multi-step wizard: select account, verify recipient, enter amount, review, OTP verification, success
- Step-level route guards (`FromAccountSelectedGuard`, `AccountsSelectedGuard`, `RecipientVerifiedGuard`)
- Transfer summary review before confirmation

### Loans
- Active and completed loan listings
- Loan details with payment schedule
- Prepayment calculator with options step, review, and confirmation
- Loan request flow

### Finances (My Finances)
- **Financial summary cards** (total income, expenses, savings, balance)
- **Chart.js visualizations:**
  - Category breakdown (doughnut/pie chart)
  - Daily spending trends (line chart)
  - Income vs. Expenses comparison (bar chart, 12 months)
  - Savings trend (line chart, 12 months)
- Date range filters with custom validator
- Service-level Map caching for fast re-navigation

### Bill Payment (PayBill)
- Provider category grid
- Provider list with search
- Payment form with dynamic fields per provider
- Payment confirmation with summary
- OTP verification step
- Payment success with receipt
- Saved payment templates (create, edit, delete)
- Template-based quick payments with payment distribution

### Messaging
- Inbox with mail card list
- Email detail view with thread history
- Compose new message
- Reply to messages within threads
- Responsive layout (sidebar list + detail panel on desktop, stacked on mobile)

### Settings
- **Appearance** — Theme management with unsaved changes guard
- **Security** — Password change and two-factor authentication
- **Profile Info** — Avatar upload and management
- **Language** — Language preference selection
- **User Management** (Admin) — User CRUD with modal forms
- **Loan Management** (Admin) — Loan approval workflow with drawer detail view, risk assessment, and decline form
- **Account Management** (Admin) — Account administration
- **Card Approval** (Admin) — Pending card request review
- **Account Approval** (Admin) — Pending account request review

### Component Showcase (Storybook)
A built-in route (`/storybook`) that demonstrates all shared UI components in isolation:
- Alerts, Badges, Buttons, Cards, Color Palettes
- Data Display (avatars, hover cards, timelines, tooltips)
- Drag and Drop (kanban boards, sortable lists)
- Feedback (skeletons, spinners, error states)
- Forms (registration, settings, multi-step, contact, inline, layout, validation)
- Layout (accordion, grid, flex, resizable panels)
- Navigation (tabs, pills, pagination, breadcrumbs)
- Overlays (modals, drawers, sheets, command palette, context menu)
- Tables (CRUD operations)
- Input components

### Birthday Celebration
Confetti animation via `canvas-confetti` triggered on the user's birthday.

---

## Shared UI Component Library

Located at `shared/lib/`, this is a comprehensive design system:

| Category | Components |
|---|---|
| **Primitives** | Button, ButtonGroup |
| **Forms** | TextInput, Checkbox, Dropdown, RadioButton, Slider, Switch, Textarea, OTP Input |
| **Cards** | BasicCard, CategoryCard, StatisticCard |
| **Alerts** | Basic, Dismissible, WithActions, Simple, TypesWithIcons |
| **Navigation** | Navbar, Pagination, Pills, Tabs, Breadcrumbs |
| **Layout** | Accordion, Collapsible, FlexLayout, GridLayout, ResizablePanels, ScrollArea, Separator |
| **Data Display** | Avatar, AvatarGroup, AspectRatio, HoverCard, KeyValueDisplay, ListDisplay, TimelineDisplay, Tooltip |
| **Overlay** | CommandPalette, ContextMenu, Drawer, SheetModal, Modal |
| **Feedback** | ErrorStates, RouteLoader, Skeleton, Spinner |
| **Tables** | Table with CRUD configuration |
| **Drag & Drop** | DragBase, DragCard, DragContainer, KanbanBoard, DragItemDirective |
| **Color** | ColorSwitch |
| **Categories** | Dynamic category components |

---

## Testing Strategy

The project has two distinct testing levels:

### Unit Tests (Vitest)
- Individual component, service, pipe, guard, and utility tests
- NgRx selector tests with mocked state
- NgRx effect tests with marble-style testing
- Signal store tests with injected mock services
- Run with: `npx nx test tia-frontend`

### Integration Tests
- Full feature integration tests that test component + store + service interaction
- Render actual component trees with `TestBed`
- Test user flows end-to-end within a feature boundary
- Run with: `npm run test:integration`

### E2E Tests (Playwright)
- Browser-based end-to-end tests
- Run with: `npx nx e2e tia-frontend-e2e`

### Coverage
- Coverage reports via `@vitest/coverage-v8`
- CI pipeline includes `scripts/check-coverage.js` for threshold enforcement
- Run with: `npx nx test tia-frontend --coverage`

---

## Icons

The application uses **custom SVG icons** organized by feature area under `public/images/svg/`. Each feature has its own icon directory:

```
public/images/svg/
├── auth/                # download, email, lock, etc.
├── sidebar-nav/         # Navigation menu icons
├── dashboard/           # Dashboard widget icons
├── cards/               # Card type and action icons
├── transfers/           # Transfer flow icons
├── finances/            # Financial category icons
├── messaging/           # Mail and compose icons
├── settings/            # Settings section icons
├── header-notifications/# Bell and notification icons
├── button-icons/        # General action icons
├── badges/              # Status badge icons
├── transactions/        # Transaction type icons
├── feature-loans/       # Loan feature icons
├── paybill/             # Bill payment icons
├── onboarding/          # Onboarding wizard icons
├── feedback/            # Feedback state icons
├── no-connection/       # Offline state icons
├── drag-and-drop/       # DnD interaction icons
├── crud/                # CRUD action icons
├── data-display/        # Data display icons
├── collapsible/         # Expand/collapse icons
├── overlay/             # Modal and drawer icons
├── context/             # Context menu icons
├── command-palette/     # Command palette icons
├── birthday/            # Celebration icons
└── notification-icons/  # Notification type icons
```

Icons are referenced directly via `<img>` tags or as background images in SCSS, using relative paths from the `public/` directory.

---

## Code Quality

- **ESLint 9** with `angular-eslint` and `@nx/eslint-plugin` for module boundary enforcement
- **Prettier 3.6** for consistent code formatting
- **Nx Module Boundaries** — enforces architectural constraints via project tags (`scope:*`, `type:*`)
- **Strict TypeScript** — TypeScript 5.9 with strict compiler options
- **Path Aliases** — `@tia/core/*` and `@tia/shared/*` for clean imports
- **Nx Caching** — build, lint, and test targets are cached for faster local and CI execution
- **Affected Commands** — `nx affected -t test` runs only tests impacted by recent changes

---

## Deployment

| Target | Platform | URL |
|---|---|---|
| **Frontend** | Netlify | [https://tia-frontend.netlify.app/](https://tia-frontend.netlify.app/) |

The frontend is automatically deployed to **Netlify** on push. The Angular application is built with Vite and served as a static SPA.

---

<p align="center">
  Built with Angular 21 + Nx + NgRx
</p>
