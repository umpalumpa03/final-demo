export interface ILoanRequest {
  amount: string;
  account: string;
  term: string | number;
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

export interface IDropdownOption {
  label: string;
  value: string | number;
}
