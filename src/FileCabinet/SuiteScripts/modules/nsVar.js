/**
 * @NApiVersion 2.1
 * @NScriptType Module
 */
define([], () => {
    // Variables are now singular
    const subsidiary = {
        texasgold: 1,
        coincollectors: 2
    };

    const ecom_store_to_subsidiary = {
        'www.texasgold.com': subsidiary.texasgold,
        'www.thecoincollector.com': subsidiary.coincollectors
    };

    const location = {
        tx_austin: 1,
        il_chicago: 2,
    };

    const warehouse_to_location = {
        'warehouse_a': location.tx_austin,
        'warehouse_b': location.il_chicago
    };

    return {
        location,
        subsidiary,
        ecom_store_to_subsidiary,
        warehouse_to_location
    };
});