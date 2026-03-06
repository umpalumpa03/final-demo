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
  return of(
    new HttpResponse<T>({
      status,
      body,
    }),
  );
}

export const mockBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const { url, method, body } = req;

  if (!environment.useMockBackend || !url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const path = url.replace(environment.apiUrl, '');

  // --- AUTH ---
  if (path === '/auth/login' && method === 'POST') {
    const credentials = body as { username?: string; password?: string };

    // Demo consumer user
    if (credentials?.username === 'demo' && credentials?.password === 'demo') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tia-demo-role', 'CONSUMER');
      }
      return ok({
        status: 'mfa_required',
        challengeId: 'mock-challenge-consumer',
      } as any);
    }

    // Demo support user
    if (
      credentials?.username === 'support' &&
      credentials?.password === 'support'
    ) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tia-demo-role', 'SUPPORT');
      }
      return ok({
        status: 'mfa_required',
        challengeId: 'mock-challenge-support',
      } as any);
    }

    // Any other credentials: keep same UX as "invalid credentials"
    return of(
      new HttpResponse({
        status: 401,
        body: { message: 'Invalid credentials (mock)' },
      }),
    );
  }

  if (path === '/auth/mfa/verify' && method === 'POST') {
    // Accept any code in demo mode, return tokens
    return ok({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    } as any);
  }

  // Accounts
  if (path.startsWith('/accounts') && method === 'GET') {
    const demoAccounts = [
      {
        id: 'acc-1',
        userId: 'user-1',
        permission: 255,
        friendlyName: 'Main GEL account',
        type: 'current',
        currency: 'GEL',
        iban: 'GE00TB00000000000001',
        name: 'Everyday Account',
        status: 'active',
        balance: 5230.75,
        createdAt: new Date().toISOString(),
        openedAt: new Date().toISOString(),
        closedAt: '',
        isFavorite: true,
        isHidden: false,
      },
      {
        id: 'acc-2',
        userId: 'user-1',
        permission: 255,
        friendlyName: 'Savings USD',
        type: 'saving',
        currency: 'USD',
        iban: 'GE00TB00000000000002',
        name: 'Savings Account',
        status: 'active',
        balance: 1240.5,
        createdAt: new Date().toISOString(),
        openedAt: new Date().toISOString(),
        closedAt: '',
        isFavorite: false,
        isHidden: false,
      },
      {
        id: 'acc-3',
        userId: 'user-1',
        permission: 255,
        friendlyName: 'Visa Card',
        type: 'card',
        currency: 'GEL',
        iban: 'GE00TB00000000000003',
        name: 'Visa Classic',
        status: 'active',
        balance: 320.1,
        createdAt: new Date().toISOString(),
        openedAt: new Date().toISOString(),
        closedAt: '',
        isFavorite: true,
        isHidden: false,
      },
    ];

    if (path === '/accounts') {
      return ok(demoAccounts);
    }

    if (path === '/accounts/active') {
      return ok(demoAccounts.filter((a) => a.status === 'active' && !a.isHidden));
    }
  }

  // Transactions
  if (path.startsWith('/transactions') && method === 'GET') {
    if (path === '/transactions') {
      return ok({
        items: [
          {
            id: 'tx-1',
            createdAt: new Date().toISOString(),
            description: 'Grocery Store',
            amount: -120.3,
            currency: 'GEL',
            iban: 'GE00TB00000000000001',
            debitAccountNumber: 'GE00TB00000000000001',
            creditAccountNumber: null,
            categoryId: 'cat-1',
            category: { id: 'cat-1', categoryName: 'Groceries' },
          },
          {
            id: 'tx-2',
            createdAt: new Date().toISOString(),
            description: 'Salary',
            amount: 2500,
            currency: 'GEL',
            iban: 'GE00TB00000000000001',
            debitAccountNumber: null,
            creditAccountNumber: 'GE00TB00000000000001',
            categoryId: 'cat-2',
            category: { id: 'cat-2', categoryName: 'Income' },
          },
        ],
        pageInfo: {
          nextCursor: null,
        },
      });
    }

    if (path === '/transactions/total') {
      return ok(2);
    }

    if (path === '/transactions/categories') {
      return ok([
        { id: 'cat-1', categoryName: 'Groceries' },
        { id: 'cat-2', categoryName: 'Income' },
        { id: 'cat-3', categoryName: 'Utilities' },
      ] as any);
    }
  }

  // Messaging (simplified)
  if (path.startsWith('/mails') && method === 'GET') {
    if (path === '/mails') {
      return ok({
        items: [
          {
            id: 1,
            subject: 'Welcome to TIA Bank',
            sender: 'noreply@tia.bank',
            preview: 'Thanks for trying out the demo...',
            createdAt: new Date().toISOString(),
            isRead: false,
            isFavorite: true,
            type: 'inbox',
          },
        ],
        cursor: null,
      });
    }

    if (path.endsWith('/total')) {
      return ok({ count: 1 });
    }
  }

  // Settings: appearance & language
  if (path === '/settings/get-available-themes' && method === 'GET') {
    return ok([
      { value: 'light', displayName: 'Light' },
      { value: 'dark', displayName: 'Dark' },
    ] as any);
  }

  if (path === '/settings/update-user-theme' && method === 'PUT') {
    return ok({ success: true });
  }

  if (path === '/settings/get-available-languages' && method === 'GET') {
    return ok([
      { value: 'english', displayName: 'English' },
      { value: 'georgian', displayName: 'Georgian' },
    ] as any);
  }

  if (path === '/settings/update-user-language' && method === 'PUT') {
    return ok({ success: true });
  }

  // Personal info
  if (path.startsWith('/settings/personal-info')) {
    if (method === 'GET') {
      return ok({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@tia.bank',
        phone: '+995 555 12 34 56',
      });
    }

    if (method === 'PUT') {
      return ok({ message: 'Personal info updated (mock)' });
    }
  }

  // --- USER INFO / DASHBOARD WIDGETS ---
  if (path === '/users/current-user' && method === 'GET') {
    // For now, choose role based on a simple local flag stored in localStorage via auth flow
    const isSupport =
      typeof window !== 'undefined' &&
      window.localStorage.getItem('tia-demo-role') === 'SUPPORT';

    if (isSupport) {
      return ok({
        fullName: 'Support Operator',
        email: 'support@tia.bank',
        theme: 'light',
        language: 'english',
        hasCompletedOnboarding: true,
        avatar: null,
        role: 'SUPPORT',
      } as any);
    }

    return ok({
      fullName: 'Demo User',
      email: 'demo@tia.bank',
      theme: 'light',
      language: 'english',
      hasCompletedOnboarding: true,
      avatar: null,
      role: 'CONSUMER',
    } as any);
  }

  if (path === '/users/onboarding-status' && method === 'PUT') {
    return ok({ success: true });
  }

  if (path === '/widgets' && method === 'GET') {
    return ok([
      {
        id: 'w1',
        dbId: 'w1',
        title: 'Accounts overview',
        type: 'accounts',
        order: 1,
        isHidden: false,
        isActive: true,
      },
      {
        id: 'w2',
        dbId: 'w2',
        title: 'Spending chart',
        type: 'chart',
        order: 2,
        isHidden: false,
        isActive: true,
      },
    ] as any);
  }

  // --- ACCOUNTS CURRENCIES ---
  if (path === '/accounts/catalogs/currencies' && method === 'GET') {
    return ok([
      { value: 'GEL', label: 'Georgian Lari' },
      { value: 'USD', label: 'US Dollar' },
      { value: 'EUR', label: 'Euro' },
    ] as any);
  }

  // --- LOANS ---
  if (path.startsWith('/loans') && method === 'GET') {
    // keep a simple persistent demo list in localStorage
    let demoLoans: any[] = [
      {
        id: 'loan-1',
        loanAmount: 15000,
        accountId: 'acc-1',
        months: 48,
        purpose: 'Car purchase',
        status: 2,
        statusName: 'Approved',
        monthlyPayment: 380,
        nextPaymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        friendlyName: 'Car Loan',
      },
      {
        id: 'loan-2',
        loanAmount: 8000,
        accountId: 'acc-2',
        months: 72,
        purpose: 'Education',
        status: 1,
        statusName: 'Pending',
        monthlyPayment: 220,
        nextPaymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        friendlyName: 'Student Loan',
      },
    ];

    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('tia-mock-loans');
      if (stored) {
        try {
          demoLoans = JSON.parse(stored);
        } catch {
          // ignore parse errors and fall back to defaults
        }
      }
    }

    if (path === '/loans') {
      return ok(demoLoans as any);
    }

    if (path === '/loans/loan-months') {
      return ok([6, 12, 24, 36, 48] as any);
    }

    if (path === '/loans/catalog/purposes') {
      return ok([
        { value: 'car', displayText: 'Car purchase' },
        { value: 'education', displayText: 'Education' },
        { value: 'home', displayText: 'Home improvement' },
      ] as any);
    }

    if (path === '/loans/loan-prepayment-options') {
      return ok([
        {
          prepaymentDisplayName: 'Reduce term',
          prepaymentValue: 'reduce_term',
          isActive: true,
        },
        {
          prepaymentDisplayName: 'Reduce installment',
          prepaymentValue: 'reduce_installment',
          isActive: true,
        },
      ] as any);
    }

    // Loan details by id
    const loanDetailsMatch = path.match(/^\/loans\/([^/]+)$/);
    if (loanDetailsMatch) {
      const loanId = loanDetailsMatch[1];
      const baseLoan =
        demoLoans.find((l) => l.id === loanId) ??
        demoLoans[0];

      return ok({
        id: loanId,
        userId: 'user-1',
        loanAmount: baseLoan.loanAmount,
        accountId: baseLoan.accountId,
        accountName:
          baseLoan.accountId === 'acc-2' ? 'Savings USD' : 'Main GEL account',
        months: baseLoan.months,
        purpose: baseLoan.purpose,
        status: baseLoan.status,
        statusName: baseLoan.statusName,
        currency: baseLoan.accountId === 'acc-2' ? 'USD' : 'GEL',
        address: {
          street: 'Demo Street 1',
          city: 'Tbilisi',
          region: 'Tbilisi',
          postalCode: '0100',
        },
        contactPerson: {
          name: 'Emergency Contact',
          relationship: 'Friend',
          phone: '+995 555 12 34 56',
          email: 'contact@tia.bank',
        },
        interestRate: 8.5,
        totalInterest: 3200,
        totalAmountToPay: baseLoan.loanAmount + 3200,
        monthlyPayment: baseLoan.monthlyPayment,
        remainingPayments: 44,
        remainingBalance: baseLoan.loanAmount * 0.55,
        firstPaymentDate: '2024-02-01',
        nextPaymentDate: new Date().toISOString(),
        lastPaymentDate: '2028-01-01',
        approvedAt: '2024-01-15',
        createdAt: baseLoan.createdAt,
        friendlyName: baseLoan.friendlyName,
      } as any);
    }
  }

  // Loans prepayment flows
  if (path === '/loans/calculate-partial-prepayment' && method === 'GET') {
    return ok({
      displayedInfo: [
        { text: 'Prepayment amount', amount: 500 },
        { text: 'Interest saved', amount: 150 },
      ],
      monthlyPayment: 360,
      totalInterestSaved: 150,
      newEndDate: '2027-06-01',
      prepaymentAmount: 500,
    } as any);
  }

  if (path.startsWith('/loans/calculate-full-prepayment') && method === 'GET') {
    return ok({
      items: [
        { text: 'Amount to close loan', amount: 8200 },
        { text: 'Interest saved', amount: 400 },
      ],
    } as any);
  }

  if (path === '/loans/loan-prepayment' && method === 'POST') {
    return ok({
      success: true,
      message: 'Prepayment initiated',
      verify: {
        challengeId: 'loan-prepayment-challenge',
        method: 'sms',
      },
    } as any);
  }

  if (path === '/loans/verify-prepayment' && method === 'POST') {
    return ok({
      success: true,
      message: 'Prepayment completed',
    } as any);
  }

  // Create loan – persist in localStorage so it appears after reloads
  if (path === '/loans/request' && method === 'POST') {
    const payload = body as any;

    let loans: any[] = [];
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('tia-mock-loans');
      if (stored) {
        try {
          loans = JSON.parse(stored);
        } catch {
          loans = [];
        }
      }
    }

    const newLoan = {
      id: `loan-${Date.now()}`,
      loanAmount: payload?.loanAmount ?? 5000,
      accountId: payload?.accountId ?? 'acc-1',
      months: payload?.months ?? 24,
      purpose: payload?.purpose ?? 'Custom purpose',
      status: 1,
      statusName: 'Pending',
      monthlyPayment: Math.round(((payload?.loanAmount ?? 5000) / (payload?.months ?? 24)) * 100) / 100,
      nextPaymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      friendlyName: payload?.friendlyName ?? 'New Loan',
    };

    loans.push(newLoan);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tia-mock-loans', JSON.stringify(loans));
    }

    return ok(newLoan as any, 201);
  }

  // OTP settings + resend
  if (path === '/settings/config' && method === 'GET') {
    return ok({
      otp: {
        expirationMinutes: 5,
        maxResendAttempts: 3,
        maxVerifyAttempts: 5,
        resendTimeoutMs: 30000,
        enabledOtpResends: ['sign-in', 'sign-up', 'loan-prepayment'],
      },
    } as any);
  }

  if (path === '/auth/mfa/otp-resend' && method === 'POST') {
    return ok({
      message: 'OTP resent',
    } as any);
  }

  // --- FINANCES DASHBOARD ---
  if (path === '/finances/summary' && method === 'GET') {
    return ok({
      totalBalance: 6795.35,
      monthlyIncome: 2500,
      monthlyExpenses: 1450,
      savingsRate: 42,
      totalIncome: 2500,
      totalExpenses: 1450,
      incomeChange: 5,
      expensesChange: -3,
      savingsChange: 2,
    } as any);
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
    return ok(
      Array.from({ length: 10 }).map((_, idx) => ({
        day: idx + 1,
        amount: 20 + Math.round(Math.random() * 80),
      })) as any,
    );
  }

  if (path === '/finances/income-vs-expenses' && method === 'GET') {
    return ok([
      { month: 'Jan', income: 2200, expenses: 1300 },
      { month: 'Feb', income: 2400, expenses: 1400 },
      { month: 'Mar', income: 2500, expenses: 1450 },
    ] as any);
  }

  if (path === '/finances/savings-trend' && method === 'GET') {
    return ok([
      { month: 'Jan', savings: 900 },
      { month: 'Feb', savings: 1000 },
      { month: 'Mar', savings: 1050 },
    ] as any);
  }

  if (path === '/finances/recent-transactions' && method === 'GET') {
    return ok([
      {
        id: 'fin-tx-1',
        date: new Date().toISOString(),
        description: 'Coffee Shop',
        amount: -8.5,
        type: 'expense',
        category: 'Entertainment',
        icon: '',
      },
      {
        id: 'fin-tx-2',
        date: new Date().toISOString(),
        description: 'Salary',
        amount: 2500,
        type: 'income',
        category: 'Income',
        icon: '',
      },
    ] as any);
  }

  // --- CARDS MOCKS (for products/cards) ---
  if (path === '/cards/accounts' && method === 'GET') {
    return ok([
      {
        id: 'acc-1',
        cardIds: ['card-1', 'card-2'],
      },
      {
        id: 'acc-2',
        cardIds: ['card-3'],
      },
    ] as any);
  }

  if (path === '/cards' && method === 'GET') {
    return ok([
      {
        id: 'card-1',
        accountId: 'acc-1',
        cardNumber: '4111111111111111',
        cardHolderName: 'DEMO USER',
        expiryDate: '12/26',
        cvv: '123',
        cardType: 'visa',
        status: 'active',
        balance: 5230.75,
        currency: 'GEL',
        isVirtual: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'card-2',
        accountId: 'acc-1',
        cardNumber: '5500000000000004',
        cardHolderName: 'DEMO USER',
        expiryDate: '06/27',
        cvv: '456',
        cardType: 'mastercard',
        status: 'active',
        balance: 5230.75,
        currency: 'GEL',
        isVirtual: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'card-3',
        accountId: 'acc-2',
        cardNumber: '378282246310005',
        cardHolderName: 'DEMO USER',
        expiryDate: '09/28',
        cvv: '789',
        cardType: 'amex',
        status: 'active',
        balance: 1240.5,
        currency: 'USD',
        isVirtual: false,
        createdAt: new Date().toISOString(),
      },
    ] as any);
  }

  if (path.startsWith('/cards/') && path.endsWith('/image') && method === 'GET') {
    const cardId = path.split('/')[2];
    return ok({
      cardId,
      imageBase64: '',
    } as any);
  }

  if (path.startsWith('/cards/') && path.endsWith('/transactions') && method === 'GET') {
    return ok({
      items: [
        {
          id: 'card-tx-1',
          createdAt: new Date().toISOString(),
          description: 'Online Purchase',
          amount: -45.99,
          currency: 'GEL',
          merchant: 'Amazon',
        },
        {
          id: 'card-tx-2',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          description: 'Restaurant',
          amount: -32.50,
          currency: 'GEL',
          merchant: 'Local Cafe',
        },
      ],
      pageInfo: { nextCursor: null },
    } as any);
  }

  if (path === '/cards/create' && method === 'POST') {
    return ok({
      success: true,
      cardId: `card-${Date.now()}`,
      message: 'Card created successfully',
    } as any);
  }

  if (path === '/cards/designs' && method === 'GET') {
    return ok([
      { id: 'design-1', name: 'Classic Blue', imageUrl: '' },
      { id: 'design-2', name: 'Modern Black', imageUrl: '' },
      { id: 'design-3', name: 'Premium Gold', imageUrl: '' },
    ] as any);
  }

  // --- TRANSFERS ---
  if (path.startsWith('/transfers')) {
    if (path === '/transfers/internal' && method === 'POST') {
      return ok({
        success: true,
        transactionId: `tx-${Date.now()}`,
        message: 'Transfer initiated',
        verify: {
          challengeId: 'transfer-challenge',
          method: 'sms',
        },
      } as any);
    }

    if (path === '/transfers/external' && method === 'POST') {
      return ok({
        success: true,
        transactionId: `tx-${Date.now()}`,
        message: 'External transfer initiated',
        verify: {
          challengeId: 'external-transfer-challenge',
          method: 'sms',
        },
      } as any);
    }

    if (path === '/transfers/verify' && method === 'POST') {
      return ok({
        success: true,
        message: 'Transfer completed',
      } as any);
    }

    if (path === '/transfers/validate-recipient' && method === 'POST') {
      return ok({
        valid: true,
        recipientName: 'John Doe',
        bankName: 'Demo Bank',
      } as any);
    }
  }

  // --- PAYBILL ---
  if (path.startsWith('/paybill')) {
    if (path === '/paybill/categories' && method === 'GET') {
      return ok([
        { id: 'utilities', name: 'Utilities', icon: 'utility' },
        { id: 'mobile', name: 'Mobile', icon: 'phone' },
        { id: 'internet', name: 'Internet', icon: 'wifi' },
        { id: 'tv', name: 'TV & Streaming', icon: 'tv' },
      ] as any);
    }

    if (path.match(/\/paybill\/(utilities|mobile|internet|tv)$/) && method === 'GET') {
      const category = path.split('/').pop();
      return ok([
        {
          id: `${category}-provider-1`,
          name: `${category?.charAt(0).toUpperCase()}${category?.slice(1)} Provider 1`,
          category,
          logo: '',
        },
        {
          id: `${category}-provider-2`,
          name: `${category?.charAt(0).toUpperCase()}${category?.slice(1)} Provider 2`,
          category,
          logo: '',
        },
      ] as any);
    }

    if (path === '/paybill/check-bill' && method === 'POST') {
      return ok({
        billAmount: 125.50,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        accountNumber: '123456789',
        providerName: 'Demo Provider',
      } as any);
    }

    if (path === '/paybill/pay' && method === 'POST') {
      return ok({
        success: true,
        challengeId: 'paybill-challenge',
        message: 'Payment initiated',
      } as any);
    }

    if (path === '/paybill/verify' && method === 'POST') {
      return ok({
        success: true,
        message: 'Payment completed',
        receiptId: `receipt-${Date.now()}`,
      } as any);
    }

    if (path === '/paybill/resend-otp' && method === 'POST') {
      return ok({ success: true } as any);
    }

    if (path.startsWith('/paybill/payment-details/') && method === 'GET') {
      return ok({
        serviceId: 'service-1',
        serviceName: 'Demo Service',
        fields: [
          { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
          { name: 'amount', label: 'Amount', type: 'number', required: true },
        ],
      } as any);
    }

    if (path === '/paybill/templates' && method === 'GET') {
      return ok([
        {
          id: 'template-1',
          nickname: 'Home Electricity',
          serviceId: 'utilities-provider-1',
          identification: '123456789',
          groupId: 'group-1',
        },
      ] as any);
    }

    if (path === '/paybill/templates' && method === 'POST') {
      return ok({
        id: `template-${Date.now()}`,
        success: true,
      } as any);
    }

    if (path.match(/\/paybill\/templates\/[^/]+$/) && method === 'DELETE') {
      return ok({ message: 'Template deleted' } as any);
    }

    if (path === '/paybill/template-groups' && method === 'GET') {
      return ok([
        {
          id: 'group-1',
          name: 'Home Bills',
          templateIds: ['template-1'],
        },
      ] as any);
    }

    if (path === '/paybill/template-groups' && method === 'POST') {
      return ok({
        id: `group-${Date.now()}`,
        success: true,
      } as any);
    }

    if (path.match(/\/paybill\/template-groups\/[^/]+$/) && method === 'DELETE') {
      return ok({ message: 'Group deleted' } as any);
    }

    if (path === '/paybill/pay-many' && method === 'POST') {
      return ok({
        success: true,
        challengeId: 'batch-payment-challenge',
      } as any);
    }
  }

  // --- EXCHANGE RATES ---
  if (path.startsWith('/exchange-rates') && method === 'GET') {
    const baseCurrency = req.params.get('base') || 'USD';
    return ok({
      base: baseCurrency,
      rates: [
        { currency: 'GEL', rate: 2.65, change: 0.02 },
        { currency: 'EUR', rate: 0.92, change: -0.01 },
        { currency: 'GBP', rate: 0.79, change: 0.00 },
        { currency: 'USD', rate: 1.00, change: 0.00 },
      ],
      lastUpdated: new Date().toISOString(),
    } as any);
  }

  // --- NOTIFICATIONS ---
  if (path.startsWith('/notifications')) {
    if (path === '/notifications/has-unread' && method === 'GET') {
      return ok({ hasUnread: true } as any);
    }

    if (path === '/notifications' && method === 'GET') {
      return ok({
        items: [
          {
            id: 'notif-1',
            title: 'New transaction',
            message: 'You received $500',
            type: 'transaction',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif-2',
            title: 'Security alert',
            message: 'New login detected',
            type: 'security',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        pageInfo: { nextCursor: null },
      } as any);
    }

    if (path.match(/\/notifications\/[^/]+$/) && method === 'DELETE') {
      return ok({} as any);
    }

    if (path === '/notifications/read-all' && method === 'PATCH') {
      return ok({ success: true } as any);
    }

    if (path.match(/\/notifications\/[^/]+\/read$/) && method === 'PATCH') {
      return ok({ success: true } as any);
    }
  }

  // --- MESSAGING ---
  if (path.startsWith('/mails')) {
    if (path === '/mails/unread/count' && method === 'GET') {
      return ok({ count: 3 } as any);
    }

    if (path === '/mails' && method === 'GET') {
      const type = req.params.get('type') || 'inbox';
      return ok({
        items: [
          {
            id: 1,
            subject: 'Welcome to TIA Bank',
            sender: 'noreply@tia.bank',
            preview: 'Thanks for trying out the demo...',
            body: 'Full email body here...',
            createdAt: new Date().toISOString(),
            isRead: false,
            isFavorite: true,
            type,
            replies: [],
          },
          {
            id: 2,
            subject: 'Your monthly statement',
            sender: 'statements@tia.bank',
            preview: 'Your statement for this month is ready',
            body: 'View your statement details...',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
            isFavorite: false,
            type,
            replies: [],
          },
        ],
        cursor: null,
      } as any);
    }

    if (path.match(/\/mails\/\d+$/) && method === 'GET') {
      const mailId = path.split('/').pop();
      return ok({
        id: mailId,
        subject: 'Email Subject',
        sender: 'sender@tia.bank',
        body: 'Full email body content here...',
        createdAt: new Date().toISOString(),
        isRead: true,
        isFavorite: false,
        type: 'inbox',
        replies: [
          {
            id: 'reply-1',
            body: 'This is a reply',
            sender: 'you@tia.bank',
            createdAt: new Date().toISOString(),
          },
        ],
      } as any);
    }

    if (path === '/mails' && method === 'POST') {
      return ok({
        id: Date.now(),
        success: true,
        message: 'Email sent',
      } as any);
    }

    if (path.match(/\/mails\/\d+\/reply$/) && method === 'POST') {
      return ok({
        success: true,
        replyId: `reply-${Date.now()}`,
      } as any);
    }

    if (path.endsWith('/total') && method === 'GET') {
      return ok({ count: 2 } as any);
    }
  }

  // --- SECURITY SETTINGS ---
  if (path.startsWith('/settings')) {
    if (path === '/settings/change-password' && method === 'POST') {
      return ok({ success: true, message: 'Password changed' } as any);
    }

    if (path === '/settings/2fa/enable' && method === 'POST') {
      return ok({
        success: true,
        qrCode: 'data:image/png;base64,mock-qr-code',
        secret: 'MOCK2FASECRET',
      } as any);
    }

    if (path === '/settings/2fa/verify' && method === 'POST') {
      return ok({ success: true } as any);
    }

    if (path === '/settings/2fa/disable' && method === 'POST') {
      return ok({ success: true } as any);
    }

    if (path === '/settings/profile-photo' && method === 'POST') {
      return ok({
        success: true,
        photoUrl: 'mock-photo-url',
      } as any);
    }

    if (path === '/settings/default-avatars' && method === 'GET') {
      return ok([
        { id: 'avatar-1', url: '', name: 'Avatar 1' },
        { id: 'avatar-2', url: '', name: 'Avatar 2' },
        { id: 'avatar-3', url: '', name: 'Avatar 3' },
      ] as any);
    }

    if (path === '/settings/accounts' && method === 'GET') {
      return ok([
        {
          id: 'acc-1',
          friendlyName: 'Main GEL account',
          iban: 'GE00TB00000000000001',
          currency: 'GEL',
          balance: 5230.75,
          status: 'active',
        },
        {
          id: 'acc-2',
          friendlyName: 'Savings USD',
          iban: 'GE00TB00000000000002',
          currency: 'USD',
          balance: 1240.5,
          status: 'active',
        },
      ] as any);
    }
  }

  // --- ADMIN: USER MANAGEMENT ---
  if (path.startsWith('/users') && path !== '/users/current-user') {
    if (path === '/users' && method === 'GET') {
      return ok([
        {
          id: 'user-1',
          fullName: 'Demo User',
          email: 'demo@tia.bank',
          role: 'CONSUMER',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-2',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'CONSUMER',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ] as any);
    }

    if (path === '/users' && method === 'POST') {
      return ok({
        id: `user-${Date.now()}`,
        success: true,
      } as any);
    }

    if (path.match(/\/users\/[^/]+$/) && method === 'PUT') {
      return ok({ success: true } as any);
    }

    if (path.match(/\/users\/[^/]+$/) && method === 'DELETE') {
      return ok({ success: true } as any);
    }

    if (path === '/users/search-by-email' && method === 'GET') {
      return ok({
        exists: true,
        userId: 'user-123',
        fullName: 'Found User',
      } as any);
    }
  }

  // --- ADMIN: LOAN MANAGEMENT ---
  if (path.startsWith('/loans/pending') && method === 'GET') {
    return ok([
      {
        id: 'loan-pending-1',
        userId: 'user-2',
        userName: 'John Doe',
        loanAmount: 10000,
        months: 36,
        purpose: 'Home renovation',
        status: 1,
        statusName: 'Pending',
        createdAt: new Date().toISOString(),
        riskScore: 75,
      },
    ] as any);
  }

  if (path.match(/\/loans\/[^/]+\/approve$/) && method === 'POST') {
    return ok({ success: true, message: 'Loan approved' } as any);
  }

  if (path.match(/\/loans\/[^/]+\/decline$/) && method === 'POST') {
    return ok({ success: true, message: 'Loan declined' } as any);
  }

  // --- ADMIN: CARD APPROVAL ---
  if (path === '/cards/pending' && method === 'GET') {
    return ok([
      {
        id: 'card-pending-1',
        userId: 'user-2',
        userName: 'John Doe',
        cardType: 'visa',
        accountId: 'acc-1',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ] as any);
  }

  if (path.match(/\/cards\/[^/]+\/approve$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path.match(/\/cards\/[^/]+\/decline$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  // --- ADMIN: ACCOUNT APPROVAL ---
  if (path === '/accounts/pending' && method === 'GET') {
    return ok([
      {
        id: 'acc-pending-1',
        userId: 'user-2',
        userName: 'John Doe',
        accountType: 'saving',
        currency: 'USD',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ] as any);
  }

  if (path.match(/\/accounts\/[^/]+\/approve$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path.match(/\/accounts\/[^/]+\/decline$/) && method === 'POST') {
    return ok({ success: true } as any);
  }

  if (path === '/accounts/permissions' && method === 'GET') {
    return ok([
      { id: 1, name: 'View Balance', value: 1 },
      { id: 2, name: 'Make Transfers', value: 2 },
      { id: 4, name: 'View Transactions', value: 4 },
    ] as any);
  }

  // --- DASHBOARD WIDGETS ---
  if (path === '/dashboard-widgets' && method === 'GET') {
    return ok([
      {
        id: 'w1',
        dbId: 'w1',
        title: 'Accounts Overview',
        type: 'accounts',
        order: 1,
        isHidden: false,
        isActive: true,
      },
      {
        id: 'w2',
        dbId: 'w2',
        title: 'Recent Transactions',
        type: 'transactions',
        order: 2,
        isHidden: false,
        isActive: true,
      },
      {
        id: 'w3',
        dbId: 'w3',
        title: 'Exchange Rates',
        type: 'exchange',
        order: 3,
        isHidden: false,
        isActive: true,
      },
    ] as any);
  }

  if (path === '/dashboard-widgets' && method === 'PUT') {
    return ok({ success: true } as any);
  }

  // --- BIRTHDAY ---
  if (path.startsWith('/birthday')) {
    if (path === '/birthday/check' && method === 'GET') {
      return ok({
        isBirthday: false,
        dismissed: false,
      } as any);
    }

    if (path === '/birthday/dismiss' && method === 'POST') {
      return ok({ success: true } as any);
    }
  }

  // --- GENERIC FALLBACK FOR ANY OTHER API IN MOCK MODE ---
  // This ensures nothing ever hits the real backend while useMockBackend is true.
  if (method === 'GET') {
    // Return an empty object/array – most UIs handle "no data" gracefully.
    return ok<any>({} as any);
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    // Pretend writes succeed by default. Specific POST handlers above can override.
    return ok<any>({ success: true } as any);
  }

  if (method === 'DELETE') {
    return ok<any>({} as any);
  }

  // Fallback: let request hit real backend (will likely fail if offline)
  return next(req);
};

