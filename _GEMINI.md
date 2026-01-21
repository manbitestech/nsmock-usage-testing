# Gemini Context: nsmock-usage-testing

This document provides context for the Gemini AI assistant to understand the purpose and structure of the `nsmock-usage-testing` project.

## Project Purpose

This project is **not a standard deployable NetSuite SuiteCloud Development Framework (SDF) project**. Its primary purpose is to serve as a companion and testing ground for the [`nsmock`](https://github.com/manbitestech/nsmock) unit testing framework.

Key objectives:
- Demonstrate the features and usage of `nsmock`.
- Provide a practical example of how to write unit tests for NetSuite SuiteScripts.
- Serve as an integration-testing environment for `nsmock` itself.

Because this is a testing project, it **intentionally lacks an SDF `manifest.xml` file**. The primary focus is on local, offline testing, not deployment.

## Key Technologies

- **`nsmock`**: The core library used to mock the NetSuite environment for offline testing.
- **`Jest`**: The JavaScript testing framework used to write and run the tests. Configuration is in `jest.config.js`.

## Folder Structure

- `src/FileCabinet/SuiteScripts/`: This directory contains the SuiteScript files that are the subject of the tests. Its structure mimics a standard NetSuite File Cabinet layout for realism.
- `__test__/`: This directory contains all the Jest test files (`.test.js`). These files import scripts from `src/` and use `nsmock` to test their logic.

## Common Tasks

When working in this repository, the most common tasks will involve:
1.  **Writing or modifying tests** in the `__test__/` directory using Jest and `nsmock`.
2.  **Modifying the SuiteScript source files** in `src/` to add or change functionality being tested.
3.  **Running tests** to validate changes.

## How to Run Tests

The primary command for this project is for running the Jest test suite:

```bash
npm test
```
