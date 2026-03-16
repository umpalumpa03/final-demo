import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

function ok<T>(body: T, status = 200): Observable<HttpEvent<T>> {
  return of(new HttpResponse<T>({ status, body }));
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function load<T>(key: string, defaults: T): T {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaults;
  } catch {
    return defaults;
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

// ─── Default seed data ───────────────────────────────────────────────────────

const SEED_ACCOUNTS = [
  {
    id: 'acc-1', userId: 'user-1', permission: 255,
    friendlyName: 'Main GEL Account', type: 'current', currency: 'GEL',
    iban: 'GE00TB00000000000001', name: 'Everyday Account', status: 'active',
    balance: 5230.75, createdAt: '2024-01-01T00:00:00.000Z',
    openedAt: '2024-01-01T00:00:00.000Z', closedAt: '', isFavorite: true, isHidden: false,
  },
  {
    id: 'acc-2', userId: 'user-1', permission: 255,
    friendlyName: 'Savings USD', type: 'saving', currency: 'USD',
    iban: 'GE00TB00000000000002', name: 'Savings Account', status: 'active',
    balance: 1240.50, createdAt: '2024-01-01T00:00:00.000Z',
    openedAt: '2024-01-01T00:00:00.000Z', closedAt: '', isFavorite: false, isHidden: false,
  },
];

const SEED_CARDS = [
  {
    id: 'card-1', accountId: 'acc-1', cardNumber: '4111111111111111',
    cardHolderName: 'DEMO USER', expiryDate: '12/26', cvv: '123',
    cardType: 'visa', status: 'active', balance: 5230.75, currency: 'GEL',
    isVirtual: false, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'card-2', accountId: 'acc-1', cardNumber: '5500000000000004',
    cardHolderName: 'DEMO USER', expiryDate: '06/27', cvv: '456',
    cardType: 'mastercard', status: 'active', balance: 5230.75, currency: 'GEL',
    isVirtual: true, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'card-3', accountId: 'acc-2', cardNumber: '378282246310005',
    cardHolderName: 'DEMO USER', expiryDate: '09/28', cvv: '789',
    cardType: 'amex', status: 'active', balance: 1240.50, currency: 'USD',
    isVirtual: false, createdAt: '2024-01-01T00:00:00.000Z',
  },
];

const SEED_TRANSACTIONS = [
  {
    id: 'tx-1', createdAt: '2024-03-15T10:00:00.000Z', description: 'Grocery Store',
    amount: -120.30, currency: 'GEL', iban: 'GE00TB00000000000001',
    debitAccountNumber: 'GE00TB00000000000001', creditAccountNumber: null,
    categoryId: 'cat-1', category: { id: 'cat-1', categoryName: 'Groceries' },
  },
  {
    id: 'tx-2', createdAt: '2024-03-14T09:00:00.000Z', description: 'Salary',
    amount: 2500.00, currency: 'GEL', iban: 'GE00TB00000000000001',
    debitAccountNumber: null, creditAccountNumber: 'GE00TB00000000000001',
    categoryId: 'cat-2', category: { id: 'cat-2', categoryName: 'Income' },
  },
  {
    id: 'tx-3', createdAt: '2024-03-13T14:30:00.000Z', description: 'Coffee Shop',
    amount: -8.50, currency: 'GEL', iban: 'GE00TB00000000000001',
    debitAccountNumber: 'GE00TB00000000000001', creditAccountNumber: null,
    categoryId: 'cat-3', category: { id: 'cat-3', categoryName: 'Entertainment' },
  },
  {
    id: 'tx-4', createdAt: '2024-03-12T11:00:00.000Z', description: 'Electricity Bill',
    amount: -85.00, currency: 'GEL', iban: 'GE00TB00000000000001',
    debitAccountNumber: 'GE00TB00000000000001', creditAccountNumber: null,
    categoryId: 'cat-4', category: { id: 'cat-4', categoryName: 'Utilities' },
  },
];

const SEED_CATEGORIES = [
  { id: 'cat-1', categoryName: 'Groceries' },
  { id: 'cat-2', categoryName: 'Income' },
  { id: 'cat-3', categoryName: 'Entertainment' },
  { id: 'cat-4', categoryName: 'Utilities' },
  { id: 'cat-5', categoryName: 'Transport' },
];

const SEED_LOANS = [
  {
    id: 'loan-1', loanAmount: 15000, accountId: 'acc-1', months: 48,
    purpose: 'Car purchase', status: 2, statusName: 'Approved',
    monthlyPayment: 380, nextPaymentDate: '2024-04-01T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z', friendlyName: 'Car Loan',
  },
  {
    id: 'loan-2', loanAmount: 8000, accountId: 'acc-2', months: 36,
    purpose: 'Education', status: 2, statusName: 'Approved',
    monthlyPayment: 245, nextPaymentDate: '2024-04-01T00:00:00.000Z',
    createdAt: '2024-02-01T00:00:00.000Z', friendlyName: 'Student Loan',
  },
  {
    id: 'loan-3', loanAmount: 5000, accountId: 'acc-1', months: 24,
    purpose: 'Home improvement', status: 1, statusName: 'Pending',
    monthlyPayment: 225, nextPaymentDate: null,
    createdAt: '2024-03-10T00:00:00.000Z', friendlyName: 'Home Renovation',
  },
  {
    id: 'loan-4', loanAmount: 3000, accountId: 'acc-1', months: 12,
    purpose: 'Business', status: 3, statusName: 'Declined',
    monthlyPayment: 260, nextPaymentDate: null,
    createdAt: '2024-02-20T00:00:00.000Z', friendlyName: null,
  },
];

const SEED_PERSONAL_INFO = {
  firstName: 'Demo', lastName: 'User',
  email: 'demo@tia.bank', phone: '+995 555 12 34 56',
};

const SEED_WIDGETS = [
  { id: 'w1', dbId: 'w1', title: 'Accounts Overview', type: 'accounts', order: 1, isHidden: false, isActive: true },
  { id: 'w2', dbId: 'w2', title: 'Recent Transactions', type: 'transactions', order: 2, isHidden: false, isActive: true },
  { id: 'w3', dbId: 'w3', title: 'Exchange Rates', type: 'exchange', order: 3, isHidden: false, isActive: true },
];

const SEED_PAYBILL_TEMPLATES = [
  { id: 'template-1', nickname: 'Home Electricity', serviceId: 'utilities-provider-1', identification: '123456789', groupId: 'group-1' },
];

const SEED_TEMPLATE_GROUPS = [
  { id: 'group-1', name: 'Home Bills', templateIds: ['template-1'] },
];

const SEED_MAILS = [
  {
    id: 1, subject: 'Welcome to TIA Bank', sender: 'noreply@tia.bank',
    preview: 'Thanks for trying out the demo...', body: 'Welcome to TIA Bank! This is a demo environment. Feel free to explore all features.',
    createdAt: '2024-03-15T10:00:00.000Z', isRead: false, isFavorite: true, type: 'inbox', replies: [],
  },
  {
    id: 2, subject: 'Your monthly statement', sender: 'statements@tia.bank',
    preview: 'Your statement for this month is ready', body: 'Your March 2024 statement is now available. Total transactions: 4.',
    createdAt: '2024-03-14T09:00:00.000Z', isRead: true, isFavorite: false, type: 'inbox', replies: [],
  },
];

const SEED_NOTIFICATIONS = [
  { id: 'notif-1', title: 'New transaction', message: 'You received 2500 GEL salary', type: 'transaction', isRead: false, createdAt: '2024-03-15T10:00:00.000Z' },
  { id: 'notif-2', title: 'Security alert', message: 'New login detected from Tbilisi', type: 'security', isRead: false, createdAt: '2024-03-14T09:00:00.000Z' },
];

// ─── Storage keys ────────────────────────────────────────────────────────────
const K = {
  ACCOUNTS: 'tia-mock-accounts',
  CARDS: 'tia-mock-cards',
  TRANSACTIONS: 'tia-mock-transactions',
  CATEGORIES: 'tia-mock-categories',
  LOANS: 'tia-mock-loans',
  PERSONAL_INFO: 'tia-mock-personal-info',
  WIDGETS: 'tia-mock-widgets',
  PAYBILL_TEMPLATES: 'tia-mock-paybill-templates',
  TEMPLATE_GROUPS: 'tia-mock-template-groups',
  MAILS: 'tia-mock-mails',
  NOTIFICATIONS: 'tia-mock-notifications',
  USER_THEME: 'tia-mock-user-theme',
  USER_LANGUAGE: 'tia-mock-user-language',
  ROLE: 'tia-demo-role',
};

// ─── Interceptor ─────────────────────────────────────────────────────────────

export const mockBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const { url, method, body } = req;

  if (!environment.useMockBackend || !url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const path = url.replace(environment.apiUrl, '');

  // ── AUTH ──────────────────────────────────────────────────────────────────

  if (path === '/auth/login' && method === 'POST') {
    const creds = body as { username?: string; password?: string };
    if (creds?.username === 'demo' && creds?.password === 'demo') {
      save(K.ROLE, 'CONSUMER');
      // Reset onboarding so the showcase fires on every fresh login
      save('tia-mock-onboarding-done', false);
      // Reset loans so seed data (with correct statuses) is always used
      if (typeof window !== 'undefined') window.localStorage.removeItem(K.LOANS);
      return ok({ status: 'mfa_required', challengeId: 'mock-challenge-consumer' } as any);
    }
    if (creds?.username === 'support' && creds?.password === 'support') {
      save(K.ROLE, 'SUPPORT');
      return ok({ status: 'mfa_required', challengeId: 'mock-challenge-support' } as any);
    }
    return of(new HttpResponse({ status: 401, body: { message: 'Invalid credentials. Use demo/demo or support/support.' } }));
  }

  if (path === '/auth/mfa/verify' && method === 'POST') {
    return ok({ access_token: 'mock-access-token', refresh_token: 'mock-refresh-token' } as any);
  }

  if (path === '/auth/refresh' && method === 'POST') {
    return ok({ access_token: 'mock-access-token', refresh_token: 'mock-refresh-token' } as any);
  }

  if (path === '/auth/logout' && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path === '/auth/mfa/otp-resend' && method === 'POST') {
    return ok({ message: 'OTP resent' } as any);
  }

  // ── ACCOUNTS ─────────────────────────────────────────────────────────────

  if (path === '/accounts/catalogs/currencies' && method === 'GET') {
    return ok([
      { value: 'GEL', label: 'Georgian Lari' },
      { value: 'USD', label: 'US Dollar' },
      { value: 'EUR', label: 'Euro' },
    ] as any);
  }

  if (path === '/accounts/permissions' && method === 'GET') {
    return ok([
      { id: 1, name: 'View Balance', value: 1 },
      { id: 2, name: 'Make Transfers', value: 2 },
      { id: 4, name: 'View Transactions', value: 4 },
    ] as any);
  }

  // IAccountsPermissions[] — value + label
  if (path === '/accounts/account-permissions' && method === 'GET') {
    return ok([
      { value: 1, label: 'View Balance' },
      { value: 2, label: 'Make Transfers' },
      { value: 4, label: 'View Transactions' },
      { value: 8, label: 'Request Cards' },
    ] as any);
  }

  if (path === '/accounts/change-account-status' && method === 'PUT') {
    return ok({ success: true } as any);
  }

  if (path === '/accounts/modify-account-permission' && method === 'PUT') {
    return ok({ success: true } as any);
  }

  // BankAccount[] — must include user: { id, email, username, firstName, lastName }
  if (path === '/accounts/pending' && method === 'GET') {
    return ok([
      {
        id: 'acc-pending-1', iban: 'GE00TB99999999999901', type: 'savings',
        currency: 'USD', name: 'Savings Account', status: 'PENDING',
        balance: '0.00', createdAt: new Date().toISOString(),
        user: { id: 'user-2', email: 'john@example.com', username: 'johndoe', firstName: 'John', lastName: 'Doe' },
      },
      {
        id: 'acc-pending-2', iban: 'GE00TB99999999999902', type: 'card',
        currency: 'GEL', name: 'Card Account', status: 'PENDING',
        balance: '0.00', createdAt: new Date().toISOString(),
        user: { id: 'user-3', email: 'jane@example.com', username: 'janedoe', firstName: 'Jane', lastName: 'Doe' },
      },
    ] as any);
  }

  if (path.match(/\/accounts\/[^/]+\/approve$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path.match(/\/accounts\/[^/]+\/decline$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path.startsWith('/accounts') && method === 'GET') {
    const accounts = load(K.ACCOUNTS, SEED_ACCOUNTS);

    if (path === '/accounts') {
      const ignoreHiddens = req.params.get('ignoreHiddens') === 'true';
      return ok((ignoreHiddens ? accounts.filter((a: any) => !a.isHidden) : accounts) as any);
    }
    if (path === '/accounts/active') {
      return ok(accounts.filter((a: any) => a.status === 'active' && !a.isHidden) as any);
    }

    const byIdMatch = path.match(/^\/accounts\/([^/]+)$/);
    if (byIdMatch) {
      const acc = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS).find((a: any) => a.id === byIdMatch[1]);
      return ok((acc ?? load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS)[0]) as any);
    }
  }

  if (path === '/accounts/create-account-request' && method === 'POST') {
    const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
    const payload = body as any;
    const newAcc = {
      id: `acc-${Date.now()}`, userId: 'user-1', permission: 255,
      friendlyName: payload?.friendlyName ?? 'New Account',
      type: payload?.type ?? 'current', currency: payload?.currency ?? 'GEL',
      iban: `GE00TB${Date.now()}`, name: payload?.name ?? 'New Account',
      status: 'active', balance: 0,
      createdAt: new Date().toISOString(), openedAt: new Date().toISOString(),
      closedAt: '', isFavorite: false, isHidden: false,
    };
    accounts.push(newAcc);
    save(K.ACCOUNTS, accounts);
    return ok(newAcc as any, 201);
  }

  if (path.match(/\/accounts\/update-friendly-name\/[^/]+$/) && method === 'PUT') {
    const accountId = path.split('/').pop();
    const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
    const idx = accounts.findIndex((a: any) => a.id === accountId);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], friendlyName: (body as any)?.friendlyName ?? accounts[idx].friendlyName };
      save(K.ACCOUNTS, accounts);
      return ok(accounts[idx] as any);
    }
    return ok({ success: true } as any);
  }

  // ── SETTINGS ACCOUNTS (admin view) ───────────────────────────────────────

  if (path === '/settings/accounts' && method === 'GET') {
    const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
    return ok(accounts.map((a: any) => ({
      id: a.id, friendlyName: a.friendlyName, iban: a.iban,
      currency: a.currency, balance: a.balance, status: a.status,
    })) as any);
  }

  // ── CARDS ─────────────────────────────────────────────────────────────────

  if (path === '/cards/designs' && method === 'GET') {
    return ok([
      { id: 'design-1', name: 'Classic Blue', imageUrl: '' },
      { id: 'design-2', name: 'Modern Black', imageUrl: '' },
      { id: 'design-3', name: 'Premium Gold', imageUrl: '' },
    ] as any);
  }

  // CardCatalogItemResponse[] — value (CardPermission) + displayName
  if (path === '/cards/catalog/permissions' && method === 'GET') {
    return ok([
      { value: 'allowAtm', displayName: 'ATM Withdrawals' },
      { value: 'allowInternational', displayName: 'International Payments' },
      { value: 'allowOnlinePayments', displayName: 'Online Payments' },
    ] as any);
  }

  if (path === '/cards/change-card-status' && method === 'PUT') {
    return ok({ success: true } as any);
  }

  // PendingCard[] — must include user: { id, email, username, firstName, lastName }
  if (path === '/cards/pending' && method === 'GET') {
    return ok([
      {
        id: 'card-pending-1', cardNumber: '4111111111111111',
        cardholderName: 'JOHN DOE', design: 'design-1',
        type: 'DEBIT', network: 'VISA', status: 'PENDING',
        nickname: 'My Visa Card', createdAt: new Date().toISOString(),
        user: { id: 'user-2', email: 'john@example.com', username: 'johndoe', firstName: 'John', lastName: 'Doe' },
        account: { id: 'acc-1', iban: 'GE00TB00000000000001', type: 'current' },
      },
      {
        id: 'card-pending-2', cardNumber: '5500000000000004',
        cardholderName: 'JANE DOE', design: 'design-2',
        type: 'DEBIT', network: 'MASTERCARD', status: 'PENDING',
        nickname: 'Travel Card', createdAt: new Date().toISOString(),
        user: { id: 'user-3', email: 'jane@example.com', username: 'janedoe', firstName: 'Jane', lastName: 'Doe' },
        account: { id: 'acc-2', iban: 'GE00TB00000000000002', type: 'saving' },
      },
    ] as any);
  }

  if (path.match(/\/cards\/[^/]+\/approve$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path.match(/\/cards\/[^/]+\/decline$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path === '/cards/accounts' && method === 'GET') {
    const cards = load<any[]>(K.CARDS, SEED_CARDS);
    const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
    return ok(accounts.map((a: any) => ({
      id: a.id,
      cardIds: cards.filter((c: any) => c.accountId === a.id).map((c: any) => c.id),
    })) as any);
  }

  if (path === '/cards' && method === 'GET') {
    return ok(load(K.CARDS, SEED_CARDS) as any);
  }

  if (path === '/cards/create' && method === 'POST') {
    const cards = load<any[]>(K.CARDS, SEED_CARDS);
    const payload = body as any;
    const newCard = {
      id: `card-${Date.now()}`, accountId: payload?.accountId ?? 'acc-1',
      cardNumber: `4${Math.random().toString().slice(2, 17)}`,
      cardHolderName: 'DEMO USER', expiryDate: '12/29', cvv: '000',
      cardType: payload?.cardType ?? 'visa', status: 'active',
      balance: 0, currency: payload?.currency ?? 'GEL',
      isVirtual: payload?.isVirtual ?? false, createdAt: new Date().toISOString(),
    };
    cards.push(newCard);
    save(K.CARDS, cards);
    return ok({ success: true, cardId: newCard.id, message: 'Card created successfully' } as any, 201);
  }

  if (path.startsWith('/cards/') && path.endsWith('/image') && method === 'GET') {
    return ok({ cardId: path.split('/')[2], imageBase64: '' } as any);
  }

  if (path.startsWith('/cards/') && path.endsWith('/transactions') && method === 'GET') {
    const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
    return ok({ items: txs.slice(0, 3), pageInfo: { nextCursor: null } } as any);
  }

  // ── TRANSACTIONS ──────────────────────────────────────────────────────────

  if (path.startsWith('/transactions') && method === 'GET') {
    if (path === '/transactions/categories') {
      return ok(load(K.CATEGORIES, SEED_CATEGORIES) as any);
    }
    if (path === '/transactions/total') {
      return ok(load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS).length as any);
    }
    if (path === '/transactions') {
      const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
      return ok({ items: txs, pageInfo: { nextCursor: null } } as any);
    }
  }

  if (path === '/transactions/categories' && method === 'POST') {
    const cats = load<any[]>(K.CATEGORIES, SEED_CATEGORIES);
    const payload = body as any;
    const newCat = { id: `cat-${Date.now()}`, categoryName: payload?.categoryName ?? 'New Category' };
    cats.push(newCat);
    save(K.CATEGORIES, cats);
    return ok(newCat as any, 201);
  }

  if (path.match(/\/transactions\/categories\/[^/]+$/) && method === 'DELETE') {
    const catId = path.split('/').pop();
    const cats = load<any[]>(K.CATEGORIES, SEED_CATEGORIES).filter((c: any) => c.id !== catId);
    save(K.CATEGORIES, cats);
    return ok({ success: true } as any);
  }

  if (path.match(/\/transactions\/[^/]+\/categorize$/) && method === 'PUT') {
    const txId = path.split('/')[2];
    const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
    const cats = load<any[]>(K.CATEGORIES, SEED_CATEGORIES);
    const payload = body as any;
    const idx = txs.findIndex((t: any) => t.id === txId);
    if (idx !== -1) {
      const cat = cats.find((c: any) => c.id === payload?.categoryId);
      txs[idx] = { ...txs[idx], categoryId: payload?.categoryId, category: cat ?? txs[idx].category };
      save(K.TRANSACTIONS, txs);
    }
    return ok({ success: true } as any);
  }

  // ── LOANS ─────────────────────────────────────────────────────────────────

  // Loan rename — returns updated ILoan
  if (path.match(/^\/loans\/update-friendly-name\/([^/]+)$/) && method === 'PUT') {
    const loanId = path.split('/').pop()!;
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    const idx = loans.findIndex((l: any) => l.id === loanId);
    if (idx !== -1) {
      loans[idx] = { ...loans[idx], friendlyName: (body as any)?.friendlyName ?? loans[idx].friendlyName };
      save(K.LOANS, loans);
      return ok(loans[idx] as any);
    }
    return ok({ success: true } as any);
  }

  if (path === '/loans/loan-months' && method === 'GET') {
    return ok([6, 12, 24, 36, 48] as any);
  }

  if (path === '/loans/catalog/purposes' && method === 'GET') {
    return ok([
      { value: 'car', displayText: 'Car purchase' },
      { value: 'education', displayText: 'Education' },
      { value: 'home', displayText: 'Home improvement' },
      { value: 'business', displayText: 'Business' },
    ] as any);
  }

  if (path === '/loans/loan-prepayment-options' && method === 'GET') {
    return ok([
      { prepaymentDisplayName: 'Reduce term', prepaymentValue: 'reduce_term', isActive: true },
      { prepaymentDisplayName: 'Reduce installment', prepaymentValue: 'reduce_installment', isActive: true },
    ] as any);
  }

  if (path === '/loans/calculate-partial-prepayment' && method === 'GET') {
    return ok({
      displayedInfo: [{ text: 'Prepayment amount', amount: 500 }, { text: 'Interest saved', amount: 150 }],
      monthlyPayment: 360, totalInterestSaved: 150, newEndDate: '2027-06-01', prepaymentAmount: 500,
    } as any);
  }

  if (path.startsWith('/loans/calculate-full-prepayment') && method === 'GET') {
    return ok({ items: [{ text: 'Amount to close loan', amount: 8200 }, { text: 'Interest saved', amount: 400 }] } as any);
  }

  if (path === '/loans/loan-prepayment' && method === 'POST') {
    return ok({ success: true, message: 'Prepayment initiated', verify: { challengeId: 'loan-prepayment-challenge', method: 'sms' } } as any);
  }

  if (path === '/loans/verify-prepayment' && method === 'POST') {
    return ok({ success: true, message: 'Prepayment completed' } as any);
  }

  if (path === '/loans/pending' && method === 'GET') {
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    return ok(loans.filter((l: any) => l.status === 1).map((l: any) => ({
      ...l, userId: 'user-2', userName: 'John Doe', riskScore: 75,
    })) as any);
  }

  // LoanManagementApiService calls /loans/pending-approvals (PendingApproval[])
  if (path === '/loans/pending-approvals' && method === 'GET') {
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    return ok(loans.filter((l: any) => l.status === 1).map((l: any) => ({
      id: l.id, userId: 'user-2', userFullName: 'John Doe',
      loanAmount: l.loanAmount, accountId: l.accountId,
      months: l.months, purpose: l.purpose,
      status: l.status, statusName: l.statusName,
      address: { street: 'Demo Street 1', city: 'Tbilisi', region: 'Tbilisi', postalCode: '0100' },
      contactPerson: { name: 'Emergency Contact', relationship: 'Friend', phone: '+995 555 12 34 56', email: 'contact@tia.bank' },
      createdAt: l.createdAt,
    })) as any);
  }

  // LoanDetailsResponse for a specific pending loan
  if (path.match(/^\/loans\/pending-approvals\/([^/]+)$/) && method === 'GET') {
    const loanId = path.split('/').pop()!;
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    const loan = loans.find((l: any) => l.id === loanId) ?? loans[0];
    return ok({
      loanDetails: {
        loanAmount: loan.loanAmount, loanPurpose: loan.purpose,
        loanTermMonths: loan.months, interestRate: 8.5,
        monthlyPayment: loan.monthlyPayment, requestDate: loan.createdAt,
      },
      riskAssessment: {
        debtToIncomeRatio: 0.32, loanToIncomeRatio: 0.45,
        totalInterest: Math.round(loan.loanAmount * 0.085 * (loan.months / 12)),
      },
    } as any);
  }

  // UserInfo for loan management
  if (path.match(/^\/loans\/user-info\/([^/]+)$/) && method === 'GET') {
    return ok({
      fullName: 'John Doe', email: 'john@example.com',
      phoneNumber: '+995 555 99 88 77', employmentStatus: 'Employed',
      address: 'Tbilisi, Georgia', annualIncome: 36000,
      creditScore: 720, creditScoreBadge: 'Good',
    } as any);
  }

  // Approve/reject loan (LoanManagementApiService posts to /loans/approve)
  if (path === '/loans/approve' && method === 'POST') {
    const payload = body as any;
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    const idx = loans.findIndex((l: any) => l.id === payload?.loanId);
    if (idx !== -1) {
      loans[idx] = { ...loans[idx], status: payload.status, statusName: payload.status === 2 ? 'Approved' : 'Rejected' };
      save(K.LOANS, loans);
    }
    return ok({ id: payload?.loanId, status: payload?.status, statusName: payload?.status === 2 ? 'Approved' : 'Rejected' } as any);
  }

  if (path === '/loans/request' && method === 'POST') {
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    const payload = body as any;
    const newLoan = {
      id: `loan-${Date.now()}`, loanAmount: payload?.loanAmount ?? 5000,
      accountId: payload?.accountId ?? 'acc-1', months: payload?.months ?? 24,
      purpose: payload?.purpose ?? 'Custom purpose', status: 1, statusName: 'Pending',
      monthlyPayment: Math.round(((payload?.loanAmount ?? 5000) / (payload?.months ?? 24)) * 100) / 100,
      nextPaymentDate: new Date().toISOString(), createdAt: new Date().toISOString(),
      friendlyName: payload?.friendlyName ?? 'New Loan',
    };
    loans.push(newLoan);
    save(K.LOANS, loans);
    return ok(newLoan as any, 201);
  }

  if (path.startsWith('/loans') && method === 'GET') {
    const loans = load<any[]>(K.LOANS, SEED_LOANS);
    if (path === '/loans') return ok(loans as any);

    const loanDetailsMatch = path.match(/^\/loans\/([^/]+)$/);
    if (loanDetailsMatch) {
      const loanId = loanDetailsMatch[1];
      const baseLoan = loans.find((l: any) => l.id === loanId) ?? loans[0];
      const isUsd = baseLoan.accountId === 'acc-2';
      return ok({
        ...baseLoan,
        userId: 'user-1',
        accountName: isUsd ? 'Savings USD' : 'Main GEL Account',
        currency: isUsd ? 'USD' : 'GEL',
        address: { street: 'Demo Street 1', city: 'Tbilisi', region: 'Tbilisi', postalCode: '0100' },
        contactPerson: { name: 'Emergency Contact', relationship: 'Friend', phone: '+995 555 12 34 56', email: 'contact@tia.bank' },
        interestRate: 8.5,
        totalInterest: Math.round(baseLoan.loanAmount * 0.085 * (baseLoan.months / 12)),
        totalAmountToPay: Math.round(baseLoan.loanAmount * 1.085),
        remainingPayments: Math.max(1, baseLoan.months - 3),
        remainingBalance: Math.round(baseLoan.loanAmount * 0.85),
        firstPaymentDate: '2024-02-01', lastPaymentDate: '2028-01-01', approvedAt: '2024-01-15',
      } as any);
    }
  }

  // ── TRANSFERS ─────────────────────────────────────────────────────────────

  if (path.startsWith('/transfers')) {
    if (path === '/transfers/internal' && method === 'POST') {
      const payload = body as any;
      const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
      const fromIdx = accounts.findIndex((a: any) => a.id === payload?.fromAccountId);
      const toIdx = accounts.findIndex((a: any) => a.id === payload?.toAccountId);
      const amount = payload?.amount ?? 0;
      if (fromIdx !== -1 && toIdx !== -1 && accounts[fromIdx].balance >= amount) {
        accounts[fromIdx] = { ...accounts[fromIdx], balance: Math.round((accounts[fromIdx].balance - amount) * 100) / 100 };
        accounts[toIdx] = { ...accounts[toIdx], balance: Math.round((accounts[toIdx].balance + amount) * 100) / 100 };
        save(K.ACCOUNTS, accounts);
        const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
        txs.unshift({
          id: `tx-${Date.now()}`, createdAt: new Date().toISOString(),
          description: payload?.description ?? 'Internal Transfer',
          amount: -amount, currency: accounts[fromIdx].currency,
          iban: accounts[fromIdx].iban, debitAccountNumber: accounts[fromIdx].iban,
          creditAccountNumber: accounts[toIdx].iban, categoryId: null, category: null,
        });
        save(K.TRANSACTIONS, txs);
      }
      return ok({ success: true, transactionId: `tx-${Date.now()}`, message: 'Transfer initiated', verify: { challengeId: 'transfer-challenge', method: 'sms' } } as any);
    }

    if (path === '/transfers/external' && method === 'POST') {
      const payload = body as any;
      const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
      const fromIdx = accounts.findIndex((a: any) => a.id === payload?.fromAccountId);
      const amount = payload?.amount ?? 0;
      if (fromIdx !== -1 && accounts[fromIdx].balance >= amount) {
        accounts[fromIdx] = { ...accounts[fromIdx], balance: Math.round((accounts[fromIdx].balance - amount) * 100) / 100 };
        save(K.ACCOUNTS, accounts);
        const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
        txs.unshift({
          id: `tx-${Date.now()}`, createdAt: new Date().toISOString(),
          description: payload?.description ?? 'External Transfer',
          amount: -amount, currency: accounts[fromIdx].currency,
          iban: accounts[fromIdx].iban, debitAccountNumber: accounts[fromIdx].iban,
          creditAccountNumber: payload?.recipientIban ?? 'EXTERNAL', categoryId: null, category: null,
        });
        save(K.TRANSACTIONS, txs);
      }
      return ok({ success: true, transactionId: `tx-${Date.now()}`, message: 'External transfer initiated', verify: { challengeId: 'external-transfer-challenge', method: 'sms' } } as any);
    }

    if (path === '/transfers/verify' && method === 'POST') {
      return ok({ success: true, message: 'Transfer completed' } as any);
    }

    if (path === '/transfers/validate-recipient' && method === 'POST') {
      return ok({ valid: true, recipientName: 'John Doe', bankName: 'Demo Bank' } as any);
    }
  }

  // ── PAYBILL ───────────────────────────────────────────────────────────────

  if (path.startsWith('/paybill')) {
    if (path === '/paybill/categories' && method === 'GET') {
      return ok([
        { id: 'utilities', name: 'Utilities', icon: 'utilities', description: 'Pay your electricity, water, and gas bills', servicesQuantity: 15, iconBgColor: '#F0B100', iconBgPath: '/images/svg/paybill/utilities.svg' },
        { id: 'phone', name: 'Mobile', icon: 'phone', description: 'Top up your mobile phone balance', servicesQuantity: 8, iconBgColor: '#00C950', iconBgPath: '/images/svg/paybill/phone.svg' },
        { id: 'internet', name: 'Internet', icon: 'internet', description: 'Pay for internet and broadband services', servicesQuantity: 12, iconBgColor: '#2B7FFF', iconBgPath: '/images/svg/paybill/internet.svg' },
        { id: 'insurance', name: 'Insurance', icon: 'insurance', description: 'Pay insurance premiums and policies', servicesQuantity: 6, iconBgColor: '#FB2C36', iconBgPath: '/images/svg/paybill/insurance.svg' },
        { id: 'rent', name: 'Rent', icon: 'rent', description: 'Pay your monthly rent', servicesQuantity: 4, iconBgColor: '#615FFF', iconBgPath: '/images/svg/paybill/rent.svg' },
      ] as any);
    }

    if (path.match(/\/paybill\/(utilities|phone|internet|insurance|rent)$/) && method === 'GET') {
      const category = path.split('/').pop() ?? 'utilities';
      const n = category.charAt(0).toUpperCase() + category.slice(1);
      return ok([
        { id: `${category}-provider-1`, serviceName: `${n} Provider 1`, categoryId: category, name: `${n} Provider 1`, isFinal: true },
        { id: `${category}-provider-2`, serviceName: `${n} Provider 2`, categoryId: category, name: `${n} Provider 2`, isFinal: true },
        { id: `${category}-provider-3`, serviceName: `${n} Provider 3`, categoryId: category, name: `${n} Provider 3`, isFinal: true },
      ] as any);
    }

    if (path.startsWith('/paybill/payment-details/') && method === 'GET') {
      return ok({ serviceId: 'service-1', serviceName: 'Demo Service', fields: [{ name: 'accountNumber', label: 'Account Number', type: 'text', required: true }, { name: 'amount', label: 'Amount', type: 'number', required: true }] } as any);
    }

    if (path === '/paybill/check-bill' && method === 'POST') {
      return ok({ billAmount: 125.50, dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), accountNumber: '123456789', providerName: 'Demo Provider' } as any);
    }

    if (path === '/paybill/pay' && method === 'POST') {
      const payload = body as any;
      const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
      const fromIdx = accounts.findIndex((a: any) => a.id === payload?.accountId);
      const amount = payload?.amount ?? 0;
      if (fromIdx !== -1 && accounts[fromIdx].balance >= amount) {
        accounts[fromIdx] = { ...accounts[fromIdx], balance: Math.round((accounts[fromIdx].balance - amount) * 100) / 100 };
        save(K.ACCOUNTS, accounts);
        const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
        txs.unshift({ id: `tx-${Date.now()}`, createdAt: new Date().toISOString(), description: `Bill Payment - ${payload?.providerName ?? 'Provider'}`, amount: -amount, currency: accounts[fromIdx].currency, iban: accounts[fromIdx].iban, debitAccountNumber: accounts[fromIdx].iban, creditAccountNumber: null, categoryId: 'cat-4', category: { id: 'cat-4', categoryName: 'Utilities' } });
        save(K.TRANSACTIONS, txs);
      }
      return ok({ success: true, challengeId: 'paybill-challenge', message: 'Payment initiated' } as any);
    }

    if (path === '/paybill/verify' && method === 'POST') {
      return ok({ success: true, message: 'Payment completed', receiptId: `receipt-${Date.now()}` } as any);
    }

    if (path === '/paybill/resend-otp' && method === 'POST') {
      return ok({ success: true } as any);
    }

    if (path === '/paybill/templates' && method === 'GET') {
      return ok(load(K.PAYBILL_TEMPLATES, SEED_PAYBILL_TEMPLATES) as any);
    }

    if (path === '/paybill/templates' && method === 'POST') {
      const templates = load<any[]>(K.PAYBILL_TEMPLATES, SEED_PAYBILL_TEMPLATES);
      const payload = body as any;
      const newTemplate = { id: `template-${Date.now()}`, ...payload };
      templates.push(newTemplate);
      save(K.PAYBILL_TEMPLATES, templates);
      return ok({ id: newTemplate.id, success: true } as any);
    }

    if (path.match(/\/paybill\/templates\/[^/]+$/) && method === 'PUT') {
      const templateId = path.split('/').pop();
      const templates = load<any[]>(K.PAYBILL_TEMPLATES, SEED_PAYBILL_TEMPLATES);
      const idx = templates.findIndex((t: any) => t.id === templateId);
      if (idx !== -1) { templates[idx] = { ...templates[idx], ...(body as any) }; save(K.PAYBILL_TEMPLATES, templates); }
      return ok({ success: true } as any);
    }

    if (path.match(/\/paybill\/templates\/[^/]+$/) && method === 'DELETE') {
      const templateId = path.split('/').pop();
      save(K.PAYBILL_TEMPLATES, load<any[]>(K.PAYBILL_TEMPLATES, SEED_PAYBILL_TEMPLATES).filter((t: any) => t.id !== templateId));
      return ok({ message: 'Template deleted' } as any);
    }

    if (path === '/paybill/template-groups' && method === 'GET') {
      return ok(load(K.TEMPLATE_GROUPS, SEED_TEMPLATE_GROUPS) as any);
    }

    if (path === '/paybill/template-groups' && method === 'POST') {
      const groups = load<any[]>(K.TEMPLATE_GROUPS, SEED_TEMPLATE_GROUPS);
      const payload = body as any;
      const newGroup = { id: `group-${Date.now()}`, ...payload };
      groups.push(newGroup);
      save(K.TEMPLATE_GROUPS, groups);
      return ok({ id: newGroup.id, success: true } as any);
    }

    if (path.match(/\/paybill\/template-groups\/[^/]+$/) && method === 'DELETE') {
      const groupId = path.split('/').pop();
      save(K.TEMPLATE_GROUPS, load<any[]>(K.TEMPLATE_GROUPS, SEED_TEMPLATE_GROUPS).filter((g: any) => g.id !== groupId));
      return ok({ message: 'Group deleted' } as any);
    }

    if (path === '/paybill/pay-many' && method === 'POST') {
      return ok({ success: true, challengeId: 'batch-payment-challenge' } as any);
    }
  }

  // ── FINANCES ──────────────────────────────────────────────────────────────

  if (path === '/finances/summary' && method === 'GET') {
    const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
    const income = txs.filter((t: any) => t.amount > 0).reduce((s: number, t: any) => s + t.amount, 0);
    const expenses = Math.abs(txs.filter((t: any) => t.amount < 0).reduce((s: number, t: any) => s + t.amount, 0));
    const accounts = load<any[]>(K.ACCOUNTS, SEED_ACCOUNTS);
    const totalBalance = accounts.reduce((s: number, a: any) => s + a.balance, 0);
    return ok({ totalBalance: Math.round(totalBalance * 100) / 100, monthlyIncome: Math.round(income * 100) / 100, monthlyExpenses: Math.round(expenses * 100) / 100, savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0, totalIncome: Math.round(income * 100) / 100, totalExpenses: Math.round(expenses * 100) / 100, incomeChange: 5, expensesChange: -3, savingsChange: 2 } as any);
  }

  if (path === '/finances/category-breakdown' && method === 'GET') {
    return ok([
      { category: 'Groceries', amount: 320, percentage: 22, color: '#F97316' },
      { category: 'Rent', amount: 700, percentage: 48, color: '#3B82F6' },
      { category: 'Entertainment', amount: 180, percentage: 12, color: '#EC4899' },
      { category: 'Transport', amount: 120, percentage: 8, color: '#22C55E' },
    ] as any);
  }

  if (path === '/finances/daily-spending' && method === 'GET') {
    return ok(Array.from({ length: 10 }).map((_, i) => ({ day: i + 1, amount: 20 + (i * 7) % 80 })) as any);
  }

  if (path === '/finances/income-vs-expenses' && method === 'GET') {
    return ok([
      { month: 'Jan', income: 2200, expenses: 1300 },
      { month: 'Feb', income: 2400, expenses: 1400 },
      { month: 'Mar', income: 2500, expenses: 1450 },
    ] as any);
  }

  if (path === '/finances/savings-trend' && method === 'GET') {
    return ok([{ month: 'Jan', savings: 900 }, { month: 'Feb', savings: 1000 }, { month: 'Mar', savings: 1050 }] as any);
  }

  if (path === '/finances/recent-transactions' && method === 'GET') {
    const txs = load<any[]>(K.TRANSACTIONS, SEED_TRANSACTIONS);
    return ok(txs.slice(0, 5).map((t: any) => ({ id: t.id, date: t.createdAt, description: t.description, amount: t.amount, type: t.amount > 0 ? 'income' : 'expense', category: t.category?.categoryName ?? 'Other', icon: '' })) as any);
  }

  // ── EXCHANGE RATES ────────────────────────────────────────────────────────

  if (path.startsWith('/exchange-rates') && method === 'GET') {
    return ok({ base: req.params.get('base') || 'USD', rates: [{ currency: 'GEL', rate: 2.65, change: 0.02 }, { currency: 'EUR', rate: 0.92, change: -0.01 }, { currency: 'GBP', rate: 0.79, change: 0.00 }, { currency: 'USD', rate: 1.00, change: 0.00 }], lastUpdated: new Date().toISOString() } as any);
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────

  if (path.startsWith('/notifications')) {
    if (path === '/notifications/has-unread' && method === 'GET') {
      const notifs = load<any[]>(K.NOTIFICATIONS, SEED_NOTIFICATIONS);
      return ok({ hasUnread: notifs.some((n: any) => !n.isRead) } as any);
    }
    if (path === '/notifications' && method === 'GET') {
      return ok({ items: load(K.NOTIFICATIONS, SEED_NOTIFICATIONS), pageInfo: { nextCursor: null } } as any);
    }
    if (path === '/notifications/read-all' && method === 'PATCH') {
      const notifs = load<any[]>(K.NOTIFICATIONS, SEED_NOTIFICATIONS).map((n: any) => ({ ...n, isRead: true }));
      save(K.NOTIFICATIONS, notifs);
      return ok({ success: true } as any);
    }
    if (path.match(/\/notifications\/[^/]+\/read$/) && method === 'PATCH') {
      const notifId = path.split('/')[2];
      const notifs = load<any[]>(K.NOTIFICATIONS, SEED_NOTIFICATIONS).map((n: any) => n.id === notifId ? { ...n, isRead: true } : n);
      save(K.NOTIFICATIONS, notifs);
      return ok({ success: true } as any);
    }
    if (path.match(/\/notifications\/[^/]+$/) && method === 'DELETE') {
      const notifId = path.split('/').pop();
      save(K.NOTIFICATIONS, load<any[]>(K.NOTIFICATIONS, SEED_NOTIFICATIONS).filter((n: any) => n.id !== notifId));
      return ok({} as any);
    }
  }

  // ── MESSAGING ─────────────────────────────────────────────────────────────

  if (path.startsWith('/mails')) {
    if (path === '/mails/unread/count' && method === 'GET') {
      const mails = load<any[]>(K.MAILS, SEED_MAILS);
      return ok({ count: mails.filter((m: any) => !m.isRead).length } as any);
    }

    if (path === '/mails' && method === 'GET') {
      const type = req.params.get('type') || 'inbox';
      const mails = load<any[]>(K.MAILS, SEED_MAILS).filter((m: any) => m.type === type || type === 'inbox');
      return ok({ items: mails, cursor: null } as any);
    }

    if (path.match(/\/mails\/\d+$/) && method === 'GET') {
      const mailId = parseInt(path.split('/').pop() ?? '0', 10);
      const mails = load<any[]>(K.MAILS, SEED_MAILS);
      const idx = mails.findIndex((m: any) => m.id === mailId);
      if (idx !== -1) { mails[idx] = { ...mails[idx], isRead: true }; save(K.MAILS, mails); return ok(mails[idx] as any); }
      return ok(mails[0] as any);
    }

    if (path === '/mails' && method === 'POST') {
      const mails = load<any[]>(K.MAILS, SEED_MAILS);
      const payload = body as any;
      const newMail = { id: Date.now(), subject: payload?.subject ?? 'New Message', sender: 'you@tia.bank', preview: (payload?.body ?? '').slice(0, 60), body: payload?.body ?? '', createdAt: new Date().toISOString(), isRead: true, isFavorite: false, type: 'sent', replies: [] };
      mails.unshift(newMail);
      save(K.MAILS, mails);
      return ok({ id: newMail.id, success: true, message: 'Email sent' } as any);
    }

    if (path.match(/\/mails\/\d+\/reply$/) && method === 'POST') {
      const mailId = parseInt(path.split('/')[2], 10);
      const mails = load<any[]>(K.MAILS, SEED_MAILS);
      const idx = mails.findIndex((m: any) => m.id === mailId);
      const replyId = `reply-${Date.now()}`;
      if (idx !== -1) {
        const reply = { id: replyId, body: (body as any)?.body ?? '', sender: 'you@tia.bank', createdAt: new Date().toISOString() };
        mails[idx] = { ...mails[idx], replies: [...(mails[idx].replies ?? []), reply] };
        save(K.MAILS, mails);
      }
      return ok({ success: true, replyId } as any);
    }

    if (path.endsWith('/total') && method === 'GET') {
      return ok({ count: load<any[]>(K.MAILS, SEED_MAILS).length } as any);
    }
  }

  // ── SETTINGS ──────────────────────────────────────────────────────────────

  if (path === '/settings/get-available-themes' && method === 'GET') {
    return ok([{ value: 'oceanBlue', displayName: 'Ocean Blue' }, { value: 'royalBlue', displayName: 'Royal Blue' }, { value: 'deepBlue', displayName: 'Deep Blue' }] as any);
  }

  if (path === '/settings/update-user-theme' && method === 'PUT') {
    save(K.USER_THEME, (body as any)?.theme ?? 'deepBlue');
    return ok({ success: true } as any);
  }

  if (path === '/settings/get-available-languages' && method === 'GET') {
    return ok([{ value: 'english', displayName: 'English' }, { value: 'georgian', displayName: 'Georgian' }] as any);
  }

  if (path === '/settings/update-user-language' && method === 'PUT') {
    save(K.USER_LANGUAGE, (body as any)?.language ?? 'english');
    return ok({ success: true } as any);
  }

  if (path.startsWith('/settings/personal-info')) {
    if (method === 'GET') return ok(load(K.PERSONAL_INFO, SEED_PERSONAL_INFO) as any);
    if (method === 'PUT') {
      save(K.PERSONAL_INFO, { ...load(K.PERSONAL_INFO, SEED_PERSONAL_INFO), ...(body as any) });
      return ok({ message: 'Personal info updated' } as any);
    }
  }

  if (path === '/settings/config' && method === 'GET') {
    return ok({ otp: { expirationMinutes: 5, maxResendAttempts: 3, maxVerifyAttempts: 5, resendTimeoutMs: 30000, enabledOtpResends: ['sign-in', 'sign-up', 'loan-prepayment'] } } as any);
  }

  if (path === '/settings/change-password' && method === 'POST') {
    return ok({ success: true, message: 'Password changed' } as any);
  }

  if (path === '/settings/2fa/enable' && method === 'POST') {
    return ok({ success: true, qrCode: 'data:image/png;base64,mock-qr-code', secret: 'MOCK2FASECRET' } as any);
  }

  if (path === '/settings/2fa/verify' && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path === '/settings/2fa/disable' && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path === '/settings/profile-photo' && method === 'POST') {
    return ok({ success: true, photoUrl: 'mock-photo-url' } as any);
  }

  if (path === '/settings/default-avatars' && method === 'GET') {
    return ok([{ id: 'avatar-1', url: '', name: 'Avatar 1' }, { id: 'avatar-2', url: '', name: 'Avatar 2' }, { id: 'avatar-3', url: '', name: 'Avatar 3' }] as any);
  }

  // ── USER INFO & WIDGETS ───────────────────────────────────────────────────

  if (path === '/users/current-user' && method === 'GET') {
    const isSupport = load<string>(K.ROLE, '') === 'SUPPORT';
    const personalInfo = load(K.PERSONAL_INFO, SEED_PERSONAL_INFO) as any;
    const theme = load<string>(K.USER_THEME, 'deepBlue');
    const language = load<string>(K.USER_LANGUAGE, 'english');
    // Onboarding fires until the user explicitly dismisses it (PUT /users/onboarding-status)
    const hasCompletedOnboarding = load<boolean>('tia-mock-onboarding-done', false);
    if (isSupport) {
      return ok({ fullName: 'Support Operator', email: 'support@tia.bank', theme, language, hasCompletedOnboarding: true, avatar: null, role: 'SUPPORT' } as any);
    }
    return ok({ fullName: `${personalInfo.firstName} ${personalInfo.lastName}`, email: personalInfo.email, theme, language, hasCompletedOnboarding, avatar: null, role: 'CONSUMER' } as any);
  }

  if (path === '/users/onboarding-status' && method === 'PUT') {
    save('tia-mock-onboarding-done', true);
    return ok({ success: true } as any);
  }

  if (path === '/widgets' && method === 'GET') {
    return ok(load(K.WIDGETS, SEED_WIDGETS) as any);
  }

  if (path === '/widgets' && method === 'PUT') {
    save(K.WIDGETS, body);
    return ok({ success: true } as any);
  }

  if (path === '/dashboard-widgets' && method === 'GET') {
    return ok(load(K.WIDGETS, SEED_WIDGETS) as any);
  }

  if (path === '/dashboard-widgets' && method === 'PUT') {
    save(K.WIDGETS, body);
    return ok({ success: true } as any);
  }

  // ── ADMIN: USER MANAGEMENT ────────────────────────────────────────────────
  // UserManagementService uses /users/management

  const SEED_USERS_MGMT = [
    { id: 'user-1', email: 'demo@tia.bank', username: 'demo', firstName: 'Demo', lastName: 'User', role: 'CONSUMER', isBlocked: false, createdAt: '2024-01-01T00:00:00.000Z', pId: 'ID001', phone: '+995 555 12 34 56', phoneVerifiedAt: '2024-01-01T00:00:00.000Z', avatar: null, avatarUrl: null },
    { id: 'user-2', email: 'john@example.com', username: 'johndoe', firstName: 'John', lastName: 'Doe', role: 'CONSUMER', isBlocked: false, createdAt: '2024-01-15T00:00:00.000Z', pId: 'ID002', phone: '+995 555 99 88 77', phoneVerifiedAt: '2024-01-15T00:00:00.000Z', avatar: null, avatarUrl: null },
    { id: 'user-3', email: 'jane@example.com', username: 'janedoe', firstName: 'Jane', lastName: 'Doe', role: 'CONSUMER', isBlocked: false, createdAt: '2024-02-01T00:00:00.000Z', pId: 'ID003', phone: '+995 555 11 22 33', phoneVerifiedAt: '2024-02-01T00:00:00.000Z', avatar: null, avatarUrl: null },
  ];

  if (path.startsWith('/users/management')) {
    const users = load('tia-mock-users-mgmt', SEED_USERS_MGMT) as any[];

    if (path === '/users/management' && method === 'GET') {
      return ok(users as any);
    }

    const userIdMatch = path.match(/^\/users\/management\/([^/]+)$/);

    if (userIdMatch && method === 'GET') {
      const u = users.find((u: any) => u.id === userIdMatch[1]) ?? users[0];
      return ok(u as any);
    }

    if (userIdMatch && method === 'PATCH') {
      const userId = userIdMatch[1];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...(body as any) };
        save('tia-mock-users-mgmt', users);
        return ok(users[idx] as any);
      }
      return ok({ success: true } as any);
    }

    if (userIdMatch && method === 'DELETE') {
      const userId = userIdMatch[1];
      save('tia-mock-users-mgmt', users.filter((u: any) => u.id !== userId));
      return ok({ success: true, message: 'User deleted' } as any);
    }

    if (path.match(/^\/users\/management\/[^/]+\/block$/) && method === 'POST') {
      const userId = path.split('/')[3];
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx !== -1) {
        users[idx] = { ...users[idx], isBlocked: (body as any)?.isBlocked ?? !users[idx].isBlocked };
        save('tia-mock-users-mgmt', users);
        return ok(users[idx] as any);
      }
      return ok({ success: true } as any);
    }
  }

  // Legacy /users routes (current-user handled above, search-by-email etc.)
  if (path.startsWith('/users') && path !== '/users/current-user') {
    if (path === '/users' && method === 'GET') {
      return ok(load('tia-mock-users-mgmt', SEED_USERS_MGMT) as any);
    }
    if (path === '/users' && method === 'POST') return ok({ id: `user-${Date.now()}`, success: true } as any);
    if (path.match(/\/users\/[^/]+$/) && method === 'PUT') return ok({ success: true } as any);
    if (path.match(/\/users\/[^/]+$/) && method === 'DELETE') return ok({ success: true } as any);
    if (path === '/users/search-by-email' && method === 'GET') return ok({ exists: true, userId: 'user-123', fullName: 'Found User' } as any);
  }

  // ── BIRTHDAY ──────────────────────────────────────────────────────────────

  if (path === '/birthday/check' && method === 'GET') {
    return ok({ isBirthday: false, dismissed: false } as any);
  }

  if (path === '/birthday/dismiss' && method === 'POST') {
    return ok({ success: true } as any);
  }

  // ── GENERIC FALLBACK ──────────────────────────────────────────────────────

  if (method === 'GET') return ok<any>({} as any);
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') return ok<any>({ success: true } as any);
  if (method === 'DELETE') return ok<any>({} as any);

  return next(req);
};
