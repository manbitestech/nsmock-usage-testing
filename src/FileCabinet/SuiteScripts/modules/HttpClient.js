/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 */
define(['N/https'], function (https) {
    const API_BASE = 'https://api.example.com';

    function fetchCustomer(customerId) {
        const response = https.get({
            url: `${API_BASE}/customers/${customerId}`,
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.code !== 200) {
            throw new Error(`Customer fetch failed with code ${response.code}`);
        }
        return JSON.parse(response.body);
    }

    function createOrder(payload) {
        const response = https.post({
            url: `${API_BASE}/orders`,
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.code !== 201) {
            throw new Error(`Order creation failed with code ${response.code}`);
        }
        return JSON.parse(response.body);
    }

    return {
        fetchCustomer: fetchCustomer,
        createOrder: createOrder
    };
});
