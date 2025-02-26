import { createTestAccount, generateValidAccountData, createTestAccountWithInvalidKey } from '../helpers/testHelpers';
import { config } from '../config/config';

if (!config.apiKey) {
  throw new Error('API_KEY environment variable is required');
}

interface CreateAccountRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  initial_deposit: number;
}

interface AccountResponse {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  initial_deposit: number;
  full_name: string,
  iban_issuance_status: string,
  iban?: string;
  created_at: string,
  updated_at: string
}

// Test suite for validating account creation functionality and input validation
describe('Account Creation Tests', () => {
  // Verifies successful account creation with valid input data
  it('should successfully create an account with valid data', async () => {
    const accountData = generateValidAccountData();
    const response = await createTestAccount(accountData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      first_name: accountData.first_name,
      last_name: accountData.last_name,
      full_name: accountData.first_name + ' ' + accountData.last_name,
      date_of_birth: accountData.date_of_birth,
      initial_deposit: accountData.initial_deposit
    });
  });

  // Tests account creation with zero initial deposit
  it('should successfully create an account with no initial deposit', async () => {
    const accountData = generateValidAccountData();
    const response = await createTestAccount(accountData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      first_name: accountData.first_name,
      last_name: accountData.last_name,
      full_name: accountData.first_name + ' ' + accountData.last_name,
      date_of_birth: accountData.date_of_birth,
      initial_deposit: 0
    });
  });

  // Validates age restriction for account creation
  it('should reject account creation for underage person', async () => {
    const underage = {
      ...generateValidAccountData(),
      date_of_birth: new Date().toISOString().split('T')[0]
    };
    const response = await createTestAccount(underage);
    expect(response.status).toBe(400);
  });

  // Ensures rejection of future dates for date of birth
  it('should reject account creation with future date of birth', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 365);
    
    const accountWithFutureDate = {
      ...generateValidAccountData(),
      date_of_birth: futureDate.toISOString().split('T')[0]
    };
    
    const response = await createTestAccount(accountWithFutureDate);
    expect(response.status).toBe(400);
  });

  // Tests validation of name length restrictions
  it('should reject account creation with invalid name length', async () => {
    const longName = {
      ...generateValidAccountData(),
      first_name: 'A'.repeat(51)
    };
    const response = await createTestAccount(longName);
    expect(response.status).toBe(400);
    
  });

  // Validates first name format restrictions
  it('should reject account creation with invalid first name', async () => {
    const invalidFirstName = {
      ...generateValidAccountData(),
      first_name: '1234567890%!@#$%^&*()'
    };
    const response = await createTestAccount(invalidFirstName);
    expect(response.status).toBe(400);
  });

  // Validates last name format restrictions
  it('should reject account creation with invalid last name', async () => {
    const invalidLastName = {
      ...generateValidAccountData(),
      last_name: '1234567890%!@#$%^&*()'
    };
    const response = await createTestAccount(invalidLastName);
    expect(response.status).toBe(400);
  });

  // Ensures first name is required
  it('should reject account creation with empty first name', async () => {
    const emptyFirstName = {
      ...generateValidAccountData(),
      first_name: ''
    };
    const response = await createTestAccount(emptyFirstName);
    expect(response.status).toBe(400);
  });

  // Ensures last name is required
  it('should reject account creation with empty last name', async () => {
    const emptyLastName = {
      ...generateValidAccountData(),
      last_name: ''
    };
    const response = await createTestAccount(emptyLastName);
    expect(response.status).toBe(400);
  });

  // Validates initial deposit must be non-negative
  it('should reject negative initial deposit', async () => {
    const negativeDeposit = {
      ...generateValidAccountData(),
      initial_deposit: -100
    };
    const response = await createTestAccount(negativeDeposit);
    expect(response.status).toBe(400);
  });

  // Tests authentication validation with invalid API key
  it('should reject account creation with invalid API key', async () => {
    const accountData = generateValidAccountData();
    const response = await createTestAccountWithInvalidKey(accountData);
    expect(response.status).toBe(403);
  });

  // Tests protection against SQL injection attempts in account creation
  it('should reject account creation with SQL injection attempt', async () => {
    const sqlInjectionPayload = {
      ...generateValidAccountData(),
      first_name: "Robert'; DROP TABLE accounts; --",
      last_name: "'); DELETE FROM accounts WHERE ('1'='1"
    };
    const response = await createTestAccount(sqlInjectionPayload);
    expect(response.status).toBe(400);
  });

});
