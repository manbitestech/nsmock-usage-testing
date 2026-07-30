const error = require('N/error');

describe('throwing N/error in SuiteScript', () => {
    test('should throw a SuiteScriptError with name and message', () => {
        expect(() => {
            throw error.create({
                name: 'CUSTOMER_NOT_FOUND',
                message: 'Customer not found for email: nobody@test.com'
            });
        }).toThrow();

        try {
            throw error.create({
                name: 'CUSTOMER_NOT_FOUND',
                message: 'Customer not found for email: nobody@test.com'
            });
        } catch (e) {
            expect(e.name).toBe('CUSTOMER_NOT_FOUND');
            expect(e.message).toBe('Customer not found for email: nobody@test.com');
            expect(e.type).toBe('error.SuiteScriptError');
            expect(e.notifyOff).toBe(false);
        }
    });

    test('should throw with notifyOff suppressing email', () => {
        try {
            throw error.create({
                name: 'SILENT_FAILURE',
                message: 'This should not email anyone',
                notifyOff: true
            });
        } catch (e) {
            expect(e.name).toBe('SILENT_FAILURE');
            expect(e.notifyOff).toBe(true);
        }
    });
});
