# Running Tests

This project uses:

- **Jest** for unit and integration testing
- **Supertest** for testing API endpoints
- **MongoDB** as the test data source

The tests verify:

- API response status codes
- Request validation
- Performance comparison calculations
- History data retrieval
- Error handling for invalid inputs

## Prerequisites

Before running tests:

1. Ensure MongoDB is running.
2. Ensure the database contains NAV and Benchmark data.
3. Install project dependencies.

If the database is empty, run:

```bash
node src/scripts/importNav.js
node src/scripts/importBenchmark.js
```

## Run All Tests

```bash
npm test
```

Example output:

```text
PASS tests/performance.test.js
PASS tests/history.test.js

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

## What Happens During Testing

When `npm test` is executed:

1. Jest starts the test runner.
2. A MongoDB connection is established automatically.
3. API endpoints are tested using Supertest.
4. Test assertions validate the responses.
5. The MongoDB connection is closed after all tests complete.

## Test Files

```text
tests/
├── performance.test.js
└── history.test.js
```

- `performance.test.js` tests the performance comparison API.
- `history.test.js` tests the historical NAV and benchmark data API.