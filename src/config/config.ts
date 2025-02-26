import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.API_BASE_URL,
  apiKey: process.env.API_KEY,
  timeout: 30000
};
