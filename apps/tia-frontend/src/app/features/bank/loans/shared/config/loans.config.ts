import { ILoan } from '../models/loan.model';

export const LOANS_DEMO: ILoan[] = [
  {
    id: 'bd38d6b0-5f81-407a-ad60-821bd8e2b084',
    loanAmount: 50000,
    accountId: 'a1000001-0001-4000-8000-000000000001',
    months: 36,
    purpose: 'business',
    status: 1,
    statusName: 'Pending',
    monthlyPayment: 1612.85,
    nextPaymentDate: null,
    createdAt: '2026-01-16T09:49:52.430Z',
    friendlyName: null,
  },
  {
    id: 'db12466e-4e7f-4028-bba3-04f06ba46420',
    loanAmount: 15000,
    accountId: 'a1000001-0001-4000-8000-000000000001',
    months: 24,
    purpose: 'personal',
    status: 2,
    statusName: 'Approved',
    monthlyPayment: 703.13,
    nextPaymentDate: '2026-02-01T00:00:00.000Z',
    createdAt: '2025-07-18T09:49:52.430Z',
    friendlyName: '__NEW__NAME__',
  },
];
