import { createTestAccount, getAccount, waitForIban, generateValidAccountData, getAccountWithInvalidKey } from '../helpers/testHelpers';
import { config } from '../config/config';

if (!config.apiKey) {
  throw new Error('API_KEY environment variable is required');
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

// Test suite for verifying account retrieval functionality and error handling
describe('Account Retrieval Tests', () => {
  // Verifies that an account can be retrieved and contains a valid IBAN
  it('should retrieve account details with IBAN', async () => {
    const testData = generateValidAccountData();
    const createResponse = await createTestAccount(testData);
    const accountId = createResponse.body.id;
    const iban = await waitForIban(accountId);
    
    const retrieveResponse = await getAccount(accountId);
    const account: AccountResponse = retrieveResponse.body;

    expect(retrieveResponse.status).toBe(200);
    expect(account).toMatchObject({
      id: accountId,
      first_name: testData.first_name,
      last_name: testData.last_name,
      date_of_birth: testData.date_of_birth,
      initial_deposit: testData.initial_deposit,
      full_name: testData.first_name + ' ' + testData.last_name,
      iban_issuance_status: 'SUCCESSFUL',
      iban: iban
    });
    expect(new Date(account.created_at)).toBeInstanceOf(Date);
    expect(new Date(account.updated_at)).toBeInstanceOf(Date);
    expect(account.iban).toMatch(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/);
  });

  // Ensures proper error handling when attempting to retrieve a non-existent account
  it('should handle non-existent account retrieval', async () => {
    const response = await getAccount('non-existent-id');
    expect(response.status).toBe(400);
  });

  // Validates rejection of account retrieval with blank ID
  it('should reject account retrieval with blank ID', async () => {
    const response = await getAccount('');
    expect(response.status).toBe(400);
  });

  // Validates that account retrieval is rejected when using an invalid API key
  it('should reject account retrieval with invalid API key', async () => {
    const createResponse = await createTestAccount(generateValidAccountData());
    const accountId = createResponse.body.id;
    const response = await getAccountWithInvalidKey(accountId);
    expect(response.status).toBe(403);
  });

  // Tests protection against SQL injection attempts in account retrieval
  it('should reject account retrieval with SQL injection attempt', async () => {
    const response = await getAccount("' OR '1'='1");
    expect(response.status).toBe(400);
  });

});
