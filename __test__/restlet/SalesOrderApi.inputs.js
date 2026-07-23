/**
 * Input payloads for SalesOrder RESTlet tests (Api, Api2, Api3)
 * All exports are factory functions that return fresh deep copies
 */
const { Record } = require('nsmock/customStubs/record/RecordInstance');

// Common constants
const STANDARD_ADDRESS = () => ({
    addr1: '123 Main St',
    addr2: 'Suite 100',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'US'
});

const SKU_A = 'SKU-A';
const SKU_B = 'SKU-B';

// ============================================
// SalesOrderApi (v1) - uses sublists.item
// ============================================

const postInputV1 = (email) => Record._cleanJson({
    store_url: 'www.texasgold.com',
    fields: {
        memo: 'Test Memo with Lookups',
        customer_email: email
    },
    sublists: {
        item: [
            {sku: SKU_A, quantity: 1, rate: 100},
            {sku: SKU_B, quantity: 2, rate: 50}
        ]
    }
});

// ============================================
// SalesOrderApi2 (v2) - uses top-level items
// ============================================

const postInputV2 = (email) => Record._cleanJson({
    store_url: 'www.texasgold.com',
    fields: {
        memo: 'Test Memo with Lookups',
        customer_email: email
    },
    items: [
        {sku: SKU_A, quantity: 1, rate: 100},
        {sku: SKU_B, quantity: 2, rate: 50}
    ]
});

// ============================================
// SalesOrderApi3 (v3) - with customer auto-creation
// ============================================

const postInputV3WithNewCustomer = () => Record._cleanJson({
    store_url: 'www.texasgold.com',
    customer: {
        email: 'new@customer.com',
        firstName: 'Jane',
        lastName: 'Smith'
    },
    billingAddress: STANDARD_ADDRESS(),
    shippingAddress: STANDARD_ADDRESS(),
    items: [
        {sku: SKU_A, quantity: 1, rate: 100}
    ]
});

const postInputV3WithExistingCustomer = (email) => Record._cleanJson({
    store_url: 'www.texasgold.com',
    customer: {
        email: email,
        firstName: 'John',
        lastName: 'Doe'
    },
    billingAddress: STANDARD_ADDRESS(),
    shippingAddress: STANDARD_ADDRESS(),
    items: [
        {sku: SKU_A, quantity: 1, rate: 100}
    ]
});

const postInputV3WithMultipleItems = (email) => Record._cleanJson({
    store_url: 'www.texasgold.com',
    customer: {
        email: email,
        firstName: 'John',
        lastName: 'Doe'
    },
    billingAddress: STANDARD_ADDRESS(),
    shippingAddress: STANDARD_ADDRESS(),
    items: [
        {sku: SKU_A, quantity: 1, rate: 100},
        {sku: SKU_B, quantity: 2, rate: 50}
    ]
});

module.exports = {
    SKU_A,
    SKU_B,
    postInputV1,
    postInputV2,
    postInputV3WithNewCustomer,
    postInputV3WithExistingCustomer,
    postInputV3WithMultipleItems
};
