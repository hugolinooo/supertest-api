export interface CreateAccountRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  initial_deposit: number;
}

export interface AccountResponse {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  balance: number;
  iban?: string;
}

export interface ErrorResponse {
  error: string;
}
