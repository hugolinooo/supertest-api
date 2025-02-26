# Supertest API Challenge

## Overview

This repository contains an automated test suite for a Banking Account Creation API service. The test suite validates the following key functionalities:

### API Endpoints Tested
- Account Creation (POST /api/accounts)
- Account IBAN Retrieval (GET /api/accounts/:id)

### Test Coverage
- Account name validation (first name + last name, max 50 characters)
- Age verification (minimum 18 years old)
- Initial deposit handling
- IBAN generation verification
- Error scenarios and edge cases
- API security validation

### Technical Implementation
- Built with TypeScript and Jest
- Environment-configurable (supports multiple environments)
- Comprehensive HTML test reports generation
- API key and base URL configuration through environment variables
- Automated test execution workflow

## Prerequisites

Before starting, ensure you have Node.js installed on your system. You can download it from:
https://nodejs.org/

## Environment Setup

1. Get the code:
   - Option A - Clone the repository:
   ```bash
   git clone https://github.com/sumup-challenges/hugopetelin.git
   cd hugopetelin
   ```
   - Option B - If you received a ZIP file:
   Extract the contents and navigate to the extracted directory.

2. Install dependencies:
```
npm install
```

3. Configure Environment Variables:
   Create a `.env` file in the root directory with the following variables:
```bash
API_BASE_URL=<your-api-base-url>  # Example: https://api.example.com
API_KEY=<your-api-key>            # Your API authentication key
```
Note: Contact the project administrator to get the correct values for your environment.

## Running Tests

To run the tests, use the following command:

```bash
# Run all tests once
npm test
```

## Project Structure

```
src/
  ├── tests/
  │   └── *.test.ts
  ├── helpers/
  │   └── *.ts
  ├── interfaces/
  │   └── *.ts
  └── config/
      └── *.ts
```

## Test Reports

After running the tests, the following reports will be generated in the `reports` directory:

```
reports/
  └── test-report-[date+time].html         # Open this file to view detailed coverage
```

The report provides detailed information including:
- Suite results and execution times
- Individual test results with pass/fail status
- Detailed error messages for failed tests
- Execution time for each test
- Stack traces showing exactly where tests failed
- Expected vs actual results for failed assertions

To view the HTML report:
1. Navigate to the `/report` directory
2. Open `test-report-[date+time].html` in your web browser

## Bugs Found

### Critical
1. Missing validation for special characters in names
2. Accounts are consistently created with 0.01 less than the specified initial deposit amount
3. Accounts created with 0 initial deposit show random deposit values instead
4. Account retrieval with invalid API key returns 200 instead of 403 (security issue)

### High
1. Accounts can be created with negative initial deposit values despite being illogical
2. Invalid name length validation returns HTTP 411 status code instead of documented 400
3. SQL injection attempt returns HTTP 411 status code instead of documented 400
4. Blank account ID retrieval returns HTTP 404 instead of documented 400

## Suggested Improvements

### API Improvements
1. Implement proper input sanitization for names
2. Standardize status codes and error messages
3. Return HTTP 201 instead of 200 for successful account creation (REST best practices)

### Documentation Improvements
1. Document all error codes and messages
2. Add request/response examples
3. Clarify validation rules
4. Add rate limiting information
5. Document expected IBAN generation time
6. Add request/response times expected

## TODOs for Test Automation

### High Priority
1. Implement retry mechanism for flaky tests
2. Add API contract testing

### Medium Priority
3. Implement visual test reports with charts
4. Add more security testing scenarios
5. Add integration with CI/CD pipelines

### Nice to Have
6. Implement test categorization (smoke, regression)
7. Add performance and load testing scenarios