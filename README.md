# nsmock-usage-testing

This project is a companion to the [nsmock](https://github.com/manbitestech/nsmock) unit testing framework. Its purpose is to provide a practical example of how to use `nsmock` to test NetSuite SuiteScripts in a local, offline environment.

## Purpose

- **Demonstrate `nsmock` features:** This project contains a variety of tests that exercise the different mocking capabilities of `nsmock`.
- **Provide a usage guide:** By examining the tests and the Jest configuration in this project, you can learn how to set up your own projects to use `nsmock`.
- **Test `nsmock` itself:** This project serves as a testing ground for new features and bug fixes in `nsmock`.

## Setup

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/manbitestech/nsmock-usage-testing.git
cd nsmock-usage-testing
npm install
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

This will execute the Jest tests located in the `__test__` directory, which use `nsmock` to mock the NetSuite environment.

## `nsmock` Repository

For more information about the `nsmock` framework itself, please visit the main repository: [https://github.com/manbitestech/nsmock](https://github.com/manbitestech/nsmock)
