
import { Record } from "N/record/instance"
import record from "N/record"

const orderParams = {
    header: {
        id: 11211,
        type: record.Type.SALES_ORDER
    },
    fields: {
        memo: {
            value: "Hello Furman"
        },
        entity: {
            value: 999321,
            text: "The Furman Bureau"
        }
    },
    sublists: {
        item: [
            {item:{value: 2343212, text: "SP909A"}}
        ]
    }
}
const salesOrder = new Record({objData:orderParams})
record._preload([salesOrder])

describe("simple getValue test", () => {
    it("gets the value of 'memo' field correctly", () => {
        const order = record.load({id: 11211, type: record.Type.SALES_ORDER})
        const memo = order.getValue({fieldId:'memo'})
        const custId = order.getValue({fieldId: 'entity'})
        const custName = order.getText({fieldId: 'entity'})
        expect(memo).toBe("Hello Furman")
        expect(order.type).toBe(record.Type.SALES_ORDER)
        expect(order.id).toBe(11211)
        expect(custId).toBe(999321)
        expect(custName).toBe("The Furman Bureau")

        const skuId = order.getSublistValue({sublistId: 'item', fieldId: 'item', line: 0})
        expect(skuId).toBe(2343212)
        order.setValue({fieldId: 'memo', value: 'New Memo'})
        expect(order.getValue({fieldId: 'memo'})).toBe('New Memo')
        order.setValue({fieldId: 'location', value: 11})
        expect(order.getValue({fieldId: 'location'})).toBe(11)
        const outputId = order.save()
        expect(outputId).toBe(11211)
    })
})


