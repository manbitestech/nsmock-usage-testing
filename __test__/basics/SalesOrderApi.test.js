
// __test__/basics/SalesOrderApi.test.js

const mockRecord = {};
import salesOrderApi from '../../src/FileCabinet/SuiteScripts/Restlet/SalesOrderApi.js';
import record from 'N/record';
import { Record } from 'N/record/instance';

beforeAll(() => {
    // Simulate NetSuite define wrapper
    const define = (deps, factory) => factory(mockRecord);
    // Re-require the module using the simulated define
    jest.isolateModules(() => {
        if (salesOrderApi && salesOrderApi.default) {
            salesOrderApi = salesOrderApi.default;
        }
    });
});

describe('SalesOrderApi REST interface', () => {
    const newOrder = new Record({
        objData: {
            header: {
                id: 99898,
                type: record.Type.SALES_ORDER
            }
        }
    })
    record._precreate([newOrder]);
    const postInput = {
        fields: {
            memo: 'Test Memo',
            entity: 12345
        },
        sublists: {
            item: [
               {sku: "SP909A", quantity: 1, rate: 100},
               {sku: "SP909B", quantity: 2, rate: 50} 
            ]
        }
    };
  
    test('should handle POST requests', () => {
        const result = salesOrderApi.post(postInput);
        expect(result).toEqual({ message: 'POST request received. SalesOrderId = 99898' });
        expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'memo', value: 'Test Memo' });
        expect(newOrder.setValue).toHaveBeenCalledWith({ fieldId: 'entity', value: 12345 });
        expect(newOrder.insertLine).toHaveBeenCalledTimes(2);
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'item', line: 0, value: 'SP909A' });
        expect(newOrder.setSublistValue).toHaveBeenCalledWith({ sublistId: 'item', fieldId: 'quantity', line: 0, value: 1 });
    });
})