/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

define([
    'N/record',
    'SuiteScripts/modules/nsVar',
    'SuiteScripts/modules/lookupFunctions'
], (record, nsVar, lookup) => {

    const post = (context) => {
        // Look up the customer ID by email
        const customerId = lookup.getCustomerInternalIdByEmail(context.fields.customer_email);
        if (!customerId) {
            return { error: 'NOT_FOUND', message: `Customer not found for email: ${context.fields.customer_email}` };
        }

        const so = record.create({
            type: record.Type.SALES_ORDER,
            isDynamic: true
        });

        // Map the store from the input to a subsidiary
        const subsidiaryId = nsVar.ecom_store_to_subsidiary[context.store_url];
        so.setValue({ fieldId: 'subsidiary', value: subsidiaryId });
        so.setValue({ fieldId: 'entity', value: customerId }); // Use looked-up customer ID
        so.setValue({ fieldId: 'memo', value: context.fields.memo });

        // Process each item in the sublist
        for (const [line, item] of context.sublists.item.entries()) {
            // Look up the item ID by SKU
            const itemId = lookup.getItemInternalIdBySku(item.sku);
            if (!itemId) {
                return { error: 'NOT_FOUND', message: `Item not found for SKU: ${item.sku}` };
            }

            so.insertLine({
                sublistId: 'item',
                line: line
            });
            so.setSublistValue({ sublistId: 'item', fieldId: 'item', line: line, value: itemId }); // Use looked-up item ID
            so.setSublistValue({ sublistId: 'item', fieldId: 'quantity', line: line, value: item.quantity });
            so.setSublistValue({ sublistId: 'item', fieldId: 'rate', line: line, value: item.rate });
        }
        
        const salesOrderId = so.save();
        return { message: 'POST request received. SalesOrderId = ' + salesOrderId };
    };

    return {
        post,
    };
});
