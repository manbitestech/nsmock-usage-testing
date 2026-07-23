/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([
    'N/record',
    'N/log',
    'SuiteScripts/modules/nsVar',
    'SuiteScripts/modules/lookupFunctions'
], (record, log, nsVar, lookup) => {

    const post = (context) => {
        log.debug('input context', context);

        const customerId = lookup.getCustomerInternalIdByEmail(context.fields.customer_email);
        if (!customerId) {
            return { error: 'NOT_FOUND', message: `Customer not found for email: ${context.fields.customer_email}` };
        }

        const subsidiaryId = nsVar.ecom_store_to_subsidiary[context.store_url];

        const salesOrder = record.create({
            type: record.Type.SALES_ORDER,
            isDynamic: true,
            defaultValues: {
                entity: customerId,
                subsidiary: subsidiaryId
            }
        });

        salesOrder.setValue({ fieldId: 'memo', value: context.fields.memo });

        for (const [line, item] of context.items.entries()) {
            const itemId = lookup.getItemInternalIdBySku(item.sku);
            if (!itemId) {
                return { error: 'NOT_FOUND', message: `Item not found for SKU: ${item.sku}` };
            }

            salesOrder.insertLine({ sublistId: 'item', line: line });
            salesOrder.setSublistValue({ sublistId: 'item', fieldId: 'item', line: line, value: itemId });
            salesOrder.setSublistValue({ sublistId: 'item', fieldId: 'quantity', line: line, value: item.quantity });
            salesOrder.setSublistValue({ sublistId: 'item', fieldId: 'rate', line: line, value: item.rate });
        }

        try {
            const id = salesOrder.save({ ignoreMandatoryFields: false });
            log.debug('record saved with id', id);
            return { message: 'POST request received. SalesOrderId = ' + id };
        } catch (e) {
            log.debug('save error', e);
            return { error: 'SAVE_FAILED', message: e.message };
        }
    };

    return { post };
});
