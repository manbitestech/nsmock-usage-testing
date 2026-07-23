const salesOrderApi = require('SuiteScripts/Restlet/SalesOrderApi2');
const record = require('N/record');
const search = require('N/search');
const nsVar = require('SuiteScripts/modules/nsVar');
const { Record } = require('nsmock/customStubs/record/RecordInstance');
const { postInputV2, SKU_A, SKU_B } = require('./SalesOrderApi.inputs');

describe('SalesOrderApi2 REST interface with nsmock stubs', () => {
    let newOrder;
    const MOCK_CUSTOMER_ID = 12345;
    const MOCK_CUSTOMER_EMAIL = 'joe@customer.com';
    const MOCK_ITEM_ID_A = 9090;
    const MOCK_SKU_A = SKU_A;
    const MOCK_ITEM_ID_B = 9191;
    const MOCK_SKU_B = SKU_B;

    beforeEach(() => {
        // Initialize fresh state for each test
        record._init();
        search._clearResults();

        newOrder = new Record({objData:{
            _id: 99898,
            type: record.Type.SALES_ORDER
            }
        });

        record._precreate({
            [record.Type.SALES_ORDER]: [newOrder]
        });

        search._setResults('customer', [{
            id: MOCK_CUSTOMER_ID,
            values: { internalid: MOCK_CUSTOMER_ID, email: MOCK_CUSTOMER_EMAIL }
        }]);
        search._setResults('item', [
            { id: MOCK_ITEM_ID_A, values: { internalid: MOCK_ITEM_ID_A, itemid: MOCK_SKU_A } },
            { id: MOCK_ITEM_ID_B, values: { internalid: MOCK_ITEM_ID_B, itemid: MOCK_SKU_B } }
        ]);
    });

    test('should lookup customer and items and create sales order', () => {
        const input = postInputV2(MOCK_CUSTOMER_EMAIL);
        const result = salesOrderApi.post(input);
        const expectedSubsidiary = nsVar.ecom_store_to_subsidiary[input.store_url];

        expect(result).toEqual({ message: 'POST request received. SalesOrderId = 99898' });
        expect(record.create).toHaveBeenCalledWith({
            type: record.Type.SALES_ORDER,
            isDynamic: true,
            defaultValues: { entity: MOCK_CUSTOMER_ID, subsidiary: expectedSubsidiary }
        });
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 0, value: MOCK_ITEM_ID_A });
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 1, value: MOCK_ITEM_ID_B });
    });

    test('should return error if customer search returns no results', () => {
        const input = postInputV2('notfound@email.com');
        const result = salesOrderApi.post(input);
        expect(result).toEqual({ error: 'NOT_FOUND', message: 'Customer not found for email: notfound@email.com' });
    });

    test('should return error if an item search returns no results', () => {
        const baseInput = postInputV2(MOCK_CUSTOMER_EMAIL);
        const badInput = { ...baseInput, items: [{ sku: "NOT-A-SKU", quantity: 1, rate: 1 }]};
        const result = salesOrderApi.post(badInput);
        expect(result).toEqual({ error: 'NOT_FOUND', message: 'Item not found for SKU: NOT-A-SKU' });
    });
});
