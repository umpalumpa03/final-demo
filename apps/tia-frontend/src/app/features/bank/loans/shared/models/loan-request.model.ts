export interface ILoanRequest {
  loanAmount: number;
  amountToReceiveAccountId: string;
  months: number;
  purpose: string;
  firstPaymentDate: string;
  contact: {
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
    };
    contactPerson: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
  };
}

export interface IDropdownOption {
  label: string;
  value: string | number;
}

export interface LoanPurpose {
  value: string;
  displayText: string;
}
