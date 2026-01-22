define([
    'SuiteScripts/Restlet/SalesOrderApi',
    'N/record',
    'N/search',
    'SuiteScripts/modules/nsVar',
    'nsmock/customStubs/record/RecordInstance'
], (salesOrderApi, record, search, nsVar, Record) => {

    describe('SalesOrderApi REST interface with nsmock stubs', () => {
        let newOrder;
        const MOCK_CUSTOMER_ID = 12345;
        const MOCK_CUSTOMER_EMAIL = 'joe@customer.com';
        const MOCK_ITEM_ID_A = 9090;
        const MOCK_SKU_A = 'SKU-A';
        const MOCK_ITEM_ID_B = 9191;
        const MOCK_SKU_B = 'SKU-B';

        beforeEach(() => {
            jest.clearAllMocks();
            // The 'search' parameter is the module export. No '.default' is needed.
            search._clearResults();

            newOrder = new Record({ objData: { id: 99898, type: record.Type.SALES_ORDER } });
            record.create.mockReturnValue(newOrder);

            // Call controller functions directly on the search module object
            search._setResults('customer', [{
                id: MOCK_CUSTOMER_ID,
                values: { internalid: MOCK_CUSTOMER_ID, email: MOCK_CUSTOMER_EMAIL }
            }]);
            search._setResults('item', [
                { id: MOCK_ITEM_ID_A, values: { internalid: MOCK_ITEM_ID_A, itemid: MOCK_SKU_A } },
                { id: MOCK_ITEM_ID_B, values: { internalid: MOCK_ITEM_ID_B, itemid: MOCK_SKU_B } }
            ]);
        });

        const postInput = {
            store_url: 'www.texasgold.com',
            fields: {
                memo: 'Test Memo with Lookups',
                customer_email: MOCK_CUSTOMER_EMAIL
            },
            sublists: {
                item: [
                   {sku: MOCK_SKU_A, quantity: 1, rate: 100},
                   {sku: MOCK_SKU_B, quantity: 2, rate: 50} 
                ]
            }
        };
      
        test('should lookup customer and items and create sales order', () => {
            const result = salesOrderApi.post(postInput);
            const expectedSubsidiary = nsVar.ecom_store_to_subsidiary[postInput.store_url];

            expect(result).toEqual({ message: 'POST request received. SalesOrderId = 99898' });
            expect(record.create).toHaveBeenCalled();
            expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'subsidiary', value: expectedSubsidiary });
            expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'entity', value: MOCK_CUSTOMER_ID });
            expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 0, value: MOCK_ITEM_ID_A });
            expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 1, value: MOCK_ITEM_ID_B });
        });

        test('should return error if customer search returns no results', () => {
            const badInput = { ...postInput, fields: { ...postInput.fields, customer_email: 'notfound@email.com' }};
            const result = salesOrderApi.post(badInput);
            expect(result).toEqual({ error: 'NOT_FOUND', message: 'Customer not found for email: notfound@email.com' });
        });

        test('should return error if an item search returns no results', () => {
            const badInput = { ...postInput, sublists: { item: [{ sku: "NOT-A-SKU", quantity: 1, rate: 1 }]}};
            const result = salesOrderApi.post(badInput);
            expect(result).toEqual({ error: 'NOT_FOUND', message: 'Item not found for SKU: NOT-A-SKU' });
        });
    });
});
