const salesOrderApi = require('SuiteScripts/Restlet/SalesOrderApi3');
const record = require('N/record');
const search = require('N/search');
const nsVar = require('SuiteScripts/modules/nsVar');
const { Record } = require('nsmock/customStubs/record/RecordInstance');
const {
    postInputV3WithNewCustomer,
    postInputV3WithExistingCustomer,
    postInputV3WithMultipleItems,
    SKU_A,
    SKU_B
} = require('./SalesOrderApi.inputs');

describe('SalesOrderApi3 REST interface with customer auto-creation', () => {
    let newOrder;
    let newCustomer;
    const MOCK_CUSTOMER_ID = 12345;
    const MOCK_NEW_CUSTOMER_ID = 55555;
    const MOCK_CUSTOMER_EMAIL = 'joe@customer.com';
    const MOCK_ITEM_ID_A = 9090;
    const MOCK_SKU_A = SKU_A;
    const MOCK_ITEM_ID_B = 9191;
    const MOCK_SKU_B = SKU_B;

    beforeEach(() => {
        // Initialize fresh state for each test
        record._init();
        search._clearResults();

        // Create mock records - using new object format for _precreate
        newCustomer = new Record({objData:{
            _id: MOCK_NEW_CUSTOMER_ID,
            type: record.Type.CUSTOMER,
            fields: {},
            sublists: {
                addressbook: []
            }
        }});

        newOrder = new Record({objData:{
            _id: 99898,
            type: record.Type.SALES_ORDER
        }});

        // New format: each type has its own array using record.Type enums
        record._precreate({
            [record.Type.CUSTOMER]: [newCustomer],
            [record.Type.SALES_ORDER]: [newOrder]
        });

        // Set up search results for items
        search._setResults('item', [
            { id: MOCK_ITEM_ID_A, values: { internalid: MOCK_ITEM_ID_A, itemid: MOCK_SKU_A } },
            { id: MOCK_ITEM_ID_B, values: { internalid: MOCK_ITEM_ID_B, itemid: MOCK_SKU_B } }
        ]);
    });

    test('should use existing customer when email is found', () => {
        // Set up existing customer search result
        search._setResults('customer', [{
            id: MOCK_CUSTOMER_ID,
            values: { internalid: MOCK_CUSTOMER_ID, email: MOCK_CUSTOMER_EMAIL }
        }]);

        const input = postInputV3WithExistingCustomer(MOCK_CUSTOMER_EMAIL);
        const result = salesOrderApi.post(input);

        expect(result.isNewCustomer).toBe(false);
        expect(result.customerId).toBe(MOCK_CUSTOMER_ID);
        expect(result.message).toContain('99898');
        expect(record.create).toHaveBeenCalledWith({
            type: record.Type.SALES_ORDER,
            isDynamic: true,
            defaultValues: {
                entity: MOCK_CUSTOMER_ID,
                subsidiary: nsVar.ecom_store_to_subsidiary[input.store_url]
            }
        });
    });

    test('should create new customer when email is not found', () => {
        // No customer search results - new customer will be created
        search._setResults('customer', []);

        const result = salesOrderApi.post(postInputV3WithNewCustomer());

        expect(result.isNewCustomer).toBe(true);
        expect(result.customerId).toBe(MOCK_NEW_CUSTOMER_ID);
        expect(result.message).toContain('99898');

        // Verify customer was created
        expect(record.create).toHaveBeenCalledWith({
            type: record.Type.CUSTOMER,
            isDynamic: true
        });

        // Verify customer fields were set
        expect(newCustomer.setValue).toHaveBeenCalledWith({ fieldId: 'firstname', value: 'Jane' });
        expect(newCustomer.setValue).toHaveBeenCalledWith({ fieldId: 'lastname', value: 'Smith' });
        expect(newCustomer.setValue).toHaveBeenCalledWith({ fieldId: 'email', value: 'new@customer.com' });
    });

    test('should return error if customer email is missing', () => {
        const baseInput = postInputV3WithExistingCustomer(MOCK_CUSTOMER_EMAIL);
        const badInput = {
            ...baseInput,
            customer: { firstName: 'John', lastName: 'Doe' } // No email
        };

        const result = salesOrderApi.post(badInput);

        expect(result).toEqual({
            error: 'VALIDATION_ERROR',
            message: 'Customer email is required'
        });
    });

    test('should return error if new customer is missing firstName or lastName', () => {
        search._setResults('customer', []); // No existing customer

        const baseInput = postInputV3WithNewCustomer();
        const badInput = {
            ...baseInput,
            customer: { email: 'new@customer.com' } // No firstName or lastName - firstName/lastName removed
        };

        const result = salesOrderApi.post(badInput);

        expect(result).toEqual({
            error: 'VALIDATION_ERROR',
            message: 'First name and last name are required for new customers'
        });
    });

    test('should return error if new customer is missing addresses', () => {
        search._setResults('customer', []); // No existing customer

        const baseInput = postInputV3WithNewCustomer();
        const badInput = {
            ...baseInput,
            billingAddress: null,
            shippingAddress: null
        };

        const result = salesOrderApi.post(badInput);

        expect(result).toEqual({
            error: 'VALIDATION_ERROR',
            message: 'Billing and shipping addresses are required for new customers'
        });
    });

    test('should return error if an item search returns no results', () => {
        search._setResults('customer', [{
            id: MOCK_CUSTOMER_ID,
            values: { internalid: MOCK_CUSTOMER_ID, email: MOCK_CUSTOMER_EMAIL }
        }]);

        const baseInput = postInputV3WithExistingCustomer(MOCK_CUSTOMER_EMAIL);
        const badInput = {
            ...baseInput,
            items: [{ sku: 'NOT-A-SKU', quantity: 1, rate: 1 }]
        };

        const result = salesOrderApi.post(badInput);

        expect(result).toEqual({
            error: 'NOT_FOUND',
            message: 'Item not found for SKU: NOT-A-SKU'
        });
    });

    test('should create sales order with correct line items', () => {
        search._setResults('customer', [{
            id: MOCK_CUSTOMER_ID,
            values: { internalid: MOCK_CUSTOMER_ID, email: MOCK_CUSTOMER_EMAIL }
        }]);

        const input = postInputV3WithMultipleItems(MOCK_CUSTOMER_EMAIL);

        const result = salesOrderApi.post(input);

        expect(newOrder.setSublistValue).toHaveBeenCalledWith({
            sublistId: 'item',
            fieldId: 'item',
            line: 0,
            value: MOCK_ITEM_ID_A
        });
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({
            sublistId: 'item',
            fieldId: 'item',
            line: 1,
            value: MOCK_ITEM_ID_B
        });
    });
});
