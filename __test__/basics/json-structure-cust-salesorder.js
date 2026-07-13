const customerWithSubrecords = {
    "id": 123456,
    "type": record.Type.CUSTOMER,
    "fields": {},
    "sublists": {
        "addressbook": [
            {
                "addressid": {value: 1111},
                "addressbookaddress": {
                    "value": 77778,
                    "subrecord": {
                        "fields": {
                            "addr1": {"value": "4521 Maple Ridge Ave"},
                            "addr2": {"value": "Suite 100"},
                            "addr3": {"value": ""},
                            "city": {"value": "Denver"},
                            "state": {"value": "CO"},
                            "zip": {"value": "80203"},
                        }
                    }
                },
            },
            {
                "addressid": {value: 1112},
                "addressbookaddress": {
                    "value": 77779,
                    "subrecord": {
                        "fields": {
                            "addr1": {"value": "8890 Oceanview Blvd"},
                            "addr2": {"value": "Unit 4B"},
                            "addr3": {"value": ""},
                            "city": {"value": "San Diego"},
                            "state": {"value": "CA"},
                            "zip": {"value": "92101-4522"},
                        }
                    }
                },
            },
            {
                "addressid": {value: 1113},
                "addressbookaddress": {
                    "value": 77780,
                    "subrecord": {
                        "fields": {
                            "addr1": {"value": "2205 Pinecrest Lane"},
                            "addr2": {"value": ""},
                            "addr3": {"value": ""},
                            "city": {"value": "Charlotte"},
                            "state": {"value": "NC"},
                            "zip": {"value": "28205"},
                        }
                    }
                },
            },
            {
                "addressid": {value: 1114},
                "addressbookaddress": {
                    "value": 77781,
                    "subrecord": {
                        "fields": {
                            "addr1": {"value": "11700 Industrial Pkwy"},
                            "addr2": {"value": "Building C"},
                            "addr3": {"value": ""},
                            "city": {"value": "Phoenix"},
                            "state": {"value": "AZ"},
                            "zip": {"value": "85001"},
                        }
                    }
                },
            },
        ],
    },
}

const salesOrderProperties = {
    id: 88888,
    type: record.Type.SALES_ORDER,
    "fields": {
        "entity": {value: 123456}
    },
    "subrecords":{
        "billingaddress": {
            "fields": {
                "custrecord_ppl_addr_validation_exempt": {value: false},
                "addressee": {value: "Marcus Thorne"},
                "addr1": {value: "5500 Corporate Dr"},
                "addr2": {value: "Floor 3"},
                "addr3": {value: ""},
                "city": {value: "Atlanta"},
                "state": {value: "GA"},
                "country": {value: "USA"},
                "zip": {value: "30303"}
            }
        },
        "shippingaddress": {
            "fields": {
                "custrecord_ppl_addr_validation_exempt": {value: false},
                "addressee": {value: "Elena Rostova"},
                "addr1": {value: "900 Harbor View Rd"},
                "addr2": {value: "Dock 12"},
                "addr3": {value: ""},
                "city": {value: "Seattle"},
                "state": {value: "WA"},
                "country": {value: "USA"},
                "zip": {value: "98101"}
            }
        }
    }
}

module.exports = {
    customerWithSubrecords,
    salesOrderProperties
}