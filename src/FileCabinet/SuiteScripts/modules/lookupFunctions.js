/**
 * @NApiVersion 2.1
 */
define(['N/search'], (search) => {
    /**
     * Returns the internal ID of an item record given its SKU.
     * @param {string} sku - The SKU value to search for.
     * @returns {number|null} The internal ID of the item, or null if not found.
     */
    const getItemInternalIdBySku = (sku) => {
        if (!sku) return null;

        const itemSearch = search.create({
            type: search.Type.ITEM,
            filters: [
                ['itemid', 'is', sku]
            ],
            columns: ['internalid']
        });

        let internalId = null;
        itemSearch.run().each(result => {
            internalId = parseInt(result.getValue({ name: 'internalid' }), 10);
            return false; // Stop after first match
        });

        return internalId;
    };

    return { getItemInternalIdBySku };
});