export interface ILoanRequest {
  amount: string;
  account: string;
  term: string;
  purpose: string;
  firstPaymentDate: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  contact: {
    fullName: string;
    relationship: string;
    phone: string;
    email: string;
  };
}
