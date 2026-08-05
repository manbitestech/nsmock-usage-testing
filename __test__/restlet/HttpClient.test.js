const httpClient = require('SuiteScripts/modules/HttpClient');
const https = require('N/https');

describe('HttpClient with nsmock N/https stub', () => {
    beforeEach(() => {
        https._clearResponses();
    });

    test('should fetch a customer from the external API', () => {
        https._setResponse('GET', 'https://api.example.com/customers/123', {
            code: 200,
            body: JSON.stringify({ id: 123, name: 'Acme Inc' }),
            headers: { 'content-type': 'application/json' }
        });

        const customer = httpClient.fetchCustomer(123);

        expect(customer).toEqual({ id: 123, name: 'Acme Inc' });
        expect(https.get).toHaveBeenCalledWith({
            url: 'https://api.example.com/customers/123',
            headers: { 'Content-Type': 'application/json' }
        });
    });

    test('should create an order via POST', () => {
        https._setResponse('POST', 'https://api.example.com/orders', {
            code: 201,
            body: JSON.stringify({ orderId: 5000 }),
            headers: { 'content-type': 'application/json' }
        });

        const order = httpClient.createOrder({ customerId: 123, total: 99.5 });

        expect(order).toEqual({ orderId: 5000 });
        expect(https.post).toHaveBeenCalledWith({
            url: 'https://api.example.com/orders',
            body: JSON.stringify({ customerId: 123, total: 99.5 }),
            headers: { 'Content-Type': 'application/json' }
        });
    });

    test('should throw when the API returns a non-200 code', () => {
        https._setResponse('GET', 'https://api.example.com/customers/999', {
            code: 404,
            body: 'Not Found',
            headers: {}
        });

        expect(() => httpClient.fetchCustomer(999)).toThrow('Customer fetch failed with code 404');
    });
});
