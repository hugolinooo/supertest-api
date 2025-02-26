import supertest from 'supertest';
import { config } from '../config/config';
import { CreateAccountRequest } from '../interfaces/account.interfaces';

const request = supertest(config.baseUrl);
const apiKey = config.apiKey || 'default-api-key';

// Creates a new test account
export const createTestAccount = async (accountData: CreateAccountRequest) => {
  return request
    .post('/api/accounts')
    .set('X-API-KEY', apiKey)
    .send(accountData);
};

// Gets account info by ID
export const getAccount = async (accountId: string) => {
  return request
    .get(`/api/accounts/${accountId}`)
    .set('X-API-KEY', apiKey);
};

// Search the account until IBAN is assigned
export const waitForIban = async (accountId: string, maxAttempts = 10): Promise<string | null> => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await getAccount(accountId);
    if (response.body?.iban) {
      return response.body.iban;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return null;
};

// Generates random name with string of letters
const generateRandomName = (length: number = 6): string => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array(length)
    .fill(null)
    .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
    .join('');
};

// Returns random number between min and max
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generates test data for new account creation
export const generateValidAccountData = (): CreateAccountRequest => {
  const pastDate = new Date();
  const randomAge = getRandomNumber(20, 80);
  pastDate.setFullYear(pastDate.getFullYear() - randomAge);

  return {
    first_name: generateRandomName(),
    last_name: generateRandomName(),
    date_of_birth: pastDate.toISOString().split('T')[0],
    initial_deposit: getRandomNumber(1, 1000)
  };
};

// Tests account creation with invalid API key
export const createTestAccountWithInvalidKey = async (accountData: CreateAccountRequest) => {
  return request
    .post('/api/accounts')
    .set('X-API-KEY', 'invalid-api-key')
    .send(accountData);
};

// Tests account retrieval with invalid API key
export const getAccountWithInvalidKey = async (accountId: string) => {
  return request
    .get(`/api/accounts/${accountId}`)
    .set('X-API-KEY', 'invalid-api-key');
};
