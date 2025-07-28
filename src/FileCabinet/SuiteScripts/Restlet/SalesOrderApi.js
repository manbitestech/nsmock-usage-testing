/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

define(['N/record'], (record) => {

    const post = (context) => {
        // Implement POST logic here
        const so = record.create({
            type: record.Type.SALES_ORDER,
            isDynamic: true
        });
        so.setValue({fieldId: 'memo', value: context.fields.memo});
        so.setValue({fieldId: 'entity', value: context.fields.entity});
        let line = 0;
        context.sublists.item.forEach((item) => {
            so.insertLine({
                sublistId: 'item',
                line: line
            });
            so.setSublistValue({ sublistId: 'item', fieldId: 'item', line: line, value: item.sku });
            so.setSublistValue({ sublistId: 'item', fieldId: 'quantity', line: line, value: item.quantity });
            so.setSublistValue({ sublistId: 'item', fieldId: 'rate', line: line, value: item.rate });
            line++
        });
        const salesOrderId = so.save();
        return { message: 'POST request received. SalesOrderId = ' + salesOrderId };
    };

   
    return {
        post,
    };

});