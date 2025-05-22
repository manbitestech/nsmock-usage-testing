
import { Record } from "N/record/instance"
import record from "N/record"

const orderParams = {
    header: {
        id: 11211,
        type: record.Type.SALES_ORDER
    },
    fields: {
        memo: {
            value: "Furman wrote this memo"
        }
    }
}

describe("simple getValue test", () => {
    it("gets the value of 'memo' field correctly", () => {
        const order = new Record({objData: orderParams})
        const memo = order.getValue({fieldId:'memo'})
        expect(memo).toBe("Furman wrote this memo")
        expect(order.type).toBe(record.Type.SALES_ORDER)
        expect(order.id).toBe(11211)
    })
})


