export interface SecurityState {
    loading: boolean;
    error: string | null;
    success: boolean;
  }
  
  export const initialSecurityState: SecurityState = {
    loading: false,
    error: null,
    success: false,
  };