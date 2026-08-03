const { Record } = require('nsmock/customStubs/record/RecordInstance');
const record = require("N/record");

describe("record.transform integration", () => {
    beforeEach(() => {
        record._clearDb();
        const estimate = new Record({
            objData: {
                id: 200,
                type: record.Type.ESTIMATE,
                fields: {
                    entity: { value: 999321, text: "The Furman Bureau" },
                    memo: { value: "Estimate to convert" }
                },
                sublists: {
                    item: [
                        { item: { value: 2343212, text: "SP909A" }, quantity: { value: 3 } }
                    ]
                }
            }
        });
        record._preload([estimate]);
    });

    it("converts an estimate into a sales order", () => {
        const salesOrder = record.transform({
            fromType: record.Type.ESTIMATE,
            fromId: 200,
            toType: record.Type.SALES_ORDER
        });

        expect(salesOrder.type).toBe(record.Type.SALES_ORDER);
        expect(salesOrder.getValue({ fieldId: 'entity' })).toBe(999321);
        expect(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'item', line: 0 })).toBe(2343212);
        expect(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: 0 })).toBe(3);

        salesOrder.setValue({ fieldId: 'memo', value: 'Converted to sales order' });
        const newId = salesOrder.save();
        expect(newId).toBeDefined();
        expect(newId).not.toBe(200);
    });

    it("reverses a sales order into an RMA with negative quantities and amounts", () => {
        const salesOrder = new Record({
            objData: {
                id: 201,
                type: record.Type.SALES_ORDER,
                fields: { entity: { value: 999321, text: "The Furman Bureau" } },
                sublists: {
                    item: [
                        { item: { value: 2343212, text: "SP909A" }, quantity: { value: 3 }, rate: { value: 25 }, amount: { value: 75 } }
                    ]
                }
            }
        });
        record._preload([salesOrder]);

        const rma = record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: 201,
            toType: record.Type.RETURN_AUTHORIZATION
        });

        expect(rma.type).toBe(record.Type.RETURN_AUTHORIZATION);
        expect(rma.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: 0 })).toBe(-3);
        expect(rma.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: 0 })).toBe(-75);
        expect(rma.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: 0 })).toBe(25);
    });
});
