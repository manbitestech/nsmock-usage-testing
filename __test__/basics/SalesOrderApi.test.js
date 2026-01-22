// __test__/basics/SalesOrderApi.test.js

import salesOrderApi from '../../src/FileCabinet/SuiteScripts/Restlet/SalesOrderApi.js';
import record from 'N/record';
import nsVar from '../../src/FileCabinet/SuiteScripts/modules/nsVar';
import lookup from '../../src/FileCabinet/SuiteScripts/modules/lookupFunctions';
import { Record } from 'N/record/instance';

// Mock the modules that have side-effects or that we need to control
jest.mock('N/record');
jest.mock('../../src/FileCabinet/SuiteScripts/modules/lookupFunctions');

describe('SalesOrderApi REST interface with Lookups', () => {
    let newOrder;
    const MOCK_CUSTOMER_ID = 12345;
    const MOCK_ITEM_ID_A = 9090;
    const MOCK_ITEM_ID_B = 9191;

    beforeEach(() => {
        // Reset mocks before each test to ensure test isolation
        jest.clearAllMocks();

        // Setup a mock record instance for the test to use
        newOrder = new Record({ objData: { id: 99898, type: record.Type.SALES_ORDER } });
        record.create.mockReturnValue(newOrder);

        // Mock the lookup functions to simulate successful finds
        lookup.getCustomerInternalIdByEmail.mockImplementation(email => {
            if (email === 'joe@customer.com') return MOCK_CUSTOMER_ID;
            return null;
        });
        
        lookup.getItemInternalIdBySku.mockImplementation(sku => {
            if (sku === 'SKU-A') return MOCK_ITEM_ID_A;
            if (sku === 'SKU-B') return MOCK_ITEM_ID_B;
            return null;
        });
    });

    const postInput = {
        store_url: 'www.texasgold.com',
        fields: {
            memo: 'Test Memo with Lookups',
            customer_email: 'joe@customer.com'
        },
        sublists: {
            item: [
               {sku: "SKU-A", quantity: 1, rate: 100},
               {sku: "SKU-B", quantity: 2, rate: 50} 
            ]
        }
    };
  
    test('should lookup customer and items and create sales order', () => {
        // Call the 'post' method on the imported API object
        const result = salesOrderApi.post(postInput);
        
        const expectedSubsidiary = nsVar.ecom_store_to_subsidiary[postInput.store_url];

        // Verify lookups were called correctly
        expect(lookup.getCustomerInternalIdByEmail).toHaveBeenCalledWith('joe@customer.com');
        expect(lookup.getItemInternalIdBySku).toHaveBeenCalledWith('SKU-A');
        expect(lookup.getItemInternalIdBySku).toHaveBeenCalledWith('SKU-B');

        // Verify the final success message
        expect(result).toEqual({ message: 'POST request received. SalesOrderId = 99898' });

        // Verify header fields are set with looked-up values
        expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'subsidiary', value: expectedSubsidiary });
        expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'entity', value: MOCK_CUSTOMER_ID });
        expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'memo', value: 'Test Memo with Lookups' });

        // Verify line items are set with looked-up values
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 0, value: MOCK_ITEM_ID_A });
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 1, value: MOCK_ITEM_ID_B });
    });

    test('should return error if customer not found', () => {
        const badInput = { ...postInput, fields: { ...postInput.fields, customer_email: 'notfound@email.com' }};
        const result = salesOrderApi.post(badInput);
        expect(result).toEqual({ error: 'NOT_FOUND', message: 'Customer not found for email: notfound@email.com' });
    });

    test('should return error if item not found', () => {
        const badInput = { ...postInput, sublists: { item: [{ sku: "NOT-A-SKU", quantity: 1, rate: 1 }]}};
        const result = salesOrderApi.post(badInput);
        expect(result).toEqual({ error: 'NOT_FOUND', message: 'Item not found for SKU: NOT-A-SKU' });
    });
});