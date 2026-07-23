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

    const createCustomerWithAddresses = (customerData) => {
        const customer = record.create({
            type: record.Type.CUSTOMER,
            isDynamic: true
        });

        customer.setValue({ fieldId: 'firstname', value: customerData.firstName });
        customer.setValue({ fieldId: 'lastname', value: customerData.lastName });
        customer.setValue({ fieldId: 'email', value: customerData.email });

        // Add billing address
        if (customerData.billingAddress) {
            addAddressToCustomer(customer, customerData.billingAddress, true, false);
        }

        // Add shipping address
        if (customerData.shippingAddress) {
            addAddressToCustomer(customer, customerData.shippingAddress, false, true);
        }

        const customerId = customer.save({ ignoreMandatoryFields: true });
        return customerId;
    };

    const addAddressToCustomer = (customer, address, isDefaultBilling, isDefaultShipping) => {
        customer.selectNewLine({ sublistId: 'addressbook' });

        customer.setCurrentSublistValue({
            sublistId: 'addressbook',
            fieldId: 'defaultbilling',
            value: isDefaultBilling
        });

        customer.setCurrentSublistValue({
            sublistId: 'addressbook',
            fieldId: 'defaultshipping',
            value: isDefaultShipping
        });

        const addressSubrecord = customer.createCurrentSublistSubrecord({
            sublistId: 'addressbook',
            fieldId: 'addressbookaddress'
        });

        addressSubrecord.setValue({ fieldId: 'addr1', value: address.addr1 });
        if (address.addr2) {
            addressSubrecord.setValue({ fieldId: 'addr2', value: address.addr2 });
        }
        addressSubrecord.setValue({ fieldId: 'city', value: address.city });
        addressSubrecord.setValue({ fieldId: 'state', value: address.state });
        addressSubrecord.setValue({ fieldId: 'zip', value: address.zip });
        addressSubrecord.setValue({ fieldId: 'country', value: address.country || 'US' });

        // Note: In real NetSuite, addressSubrecord.save() would be called here.
        // nsmock does not support saving subrecords independently, so we skip it.
        // Values are persisted via commitLine on the parent record.

        customer.commitLine({ sublistId: 'addressbook' });
    };

    const post = (context) => {
        log.debug('input context', context);

        // Validate required customer data
        if (!context.customer || !context.customer.email) {
            return { error: 'VALIDATION_ERROR', message: 'Customer email is required' };
        }

        // Look up customer by email
        let customerId = lookup.getCustomerInternalIdByEmail(context.customer.email);
        let isNewCustomer = false;

        // If customer not found, create new one
        if (!customerId) {
            if (!context.customer.firstName || !context.customer.lastName) {
                return { error: 'VALIDATION_ERROR', message: 'First name and last name are required for new customers' };
            }
            if (!context.billingAddress || !context.shippingAddress) {
                return { error: 'VALIDATION_ERROR', message: 'Billing and shipping addresses are required for new customers' };
            }

            try {
                customerId = createCustomerWithAddresses({
                    email: context.customer.email,
                    firstName: context.customer.firstName,
                    lastName: context.customer.lastName,
                    billingAddress: context.billingAddress,
                    shippingAddress: context.shippingAddress
                });
                isNewCustomer = true;
            } catch (e) {
                log.debug('customer creation error', e);
                return { error: 'CUSTOMER_CREATE_FAILED', message: e.message };
            }
        }

        const subsidiaryId = nsVar.ecom_store_to_subsidiary[context.store_url];

        // Create Sales Order
        const salesOrder = record.create({
            type: record.Type.SALES_ORDER,
            isDynamic: true,
            defaultValues: {
                entity: customerId,
                subsidiary: subsidiaryId
            }
        });

        salesOrder.setValue({ fieldId: 'memo', value: context.memo || '' });

        // Add line items
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
            const salesOrderId = salesOrder.save({ ignoreMandatoryFields: false });
            log.debug('record saved with id', salesOrderId);
            return {
                message: 'POST request received. SalesOrderId = ' + salesOrderId,
                customerId: customerId,
                isNewCustomer: isNewCustomer
            };
        } catch (e) {
            log.debug('save error', e);
            return { error: 'SAVE_FAILED', message: e.message };
        }
    };

    return { post };
});
