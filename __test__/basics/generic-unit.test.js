const { addNumbers } = require('../../src/FileCabinet/SuiteScripts/modules/genericFunctions'); // adjust the path as needed

// Assuming addNumbers is imported from the module you want to test

describe('addNumbers', () => {
    test('adds two positive numbers', () => {
        expect(addNumbers(2, 3)).toBe(5);
    });

    test('adds two negative numbers', () => {
        expect(addNumbers(-2, -3)).toBe(-5);
    })

    test('adds a positive and a negative number', () => {
        expect(addNumbers(5, -3)).toBe(2);
    });

    test('adds zero and a number', () => {
        expect(addNumbers(0, 7)).toBe(7);
        expect(addNumbers(7, 0)).toBe(7);
    });

    test('adds two zeros', () => {
        expect(addNumbers(0, 0)).toBe(0);
    });

    test('adds floating point numbers', () => {
        expect(addNumbers(1.5, 2.3)).toBeCloseTo(3.8);
    });
});