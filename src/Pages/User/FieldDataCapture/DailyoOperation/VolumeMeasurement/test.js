const test = {
    "date": "10/09/2024",
    "asset": "OML 155",
    "fluidType": "Net Oil/ Condensate",
    "flowStations": [
        {
            "name": "XANA Flowstation 1",
            "reportType": "Net Oil/ Condensate",
            "measurementType": "metering",
            "subtotal": { "gross": 10.204081632653061, "bsw": 2, "netProduction": 10, "netTarget": 12 },
            "meters": [
                { "serialNumber": "SN-123", "initialReading": "2", "finalReading": 4, "netProduction": 4 },
                { "serialNumber": "SN-234", "initialReading": "2", "finalReading": 4, "netProduction": 6 }
            ]
        },
        {
            "name": "XANA Flowstation 2",
            "reportType": "Net Oil/ Condensate",
            "measurementType": "tankDipping",
            "subtotal": { "gross": 3.0303030303030303, "bsw": 1, "netProduction": 3, "netTarget": 321 },
            "meters": [
                { "serialNumber": "SN-345", "initialReading": "1", "finalReading": 3, "netProduction": 2 }
            ],
            "deductions": {
                "initialReading": 4, "finalReading": 4, "meterFactor": 1, "netProduction": 1
            }
        },
        {
            "name": "XANA Flowstation 5",
            "reportType": "Net Oil/ Condensate",
            "measurementType": "tankDipping",
            "subtotal": { "gross": 112.5, "bsw": 12, "netProduction": 99, "netTarget": 31 },
            "meters": [
                { "serialNumber": "SN-456", "initialReading": "3", "finalReading": 1, "netProduction": 2 }
            ],
            "deductions": {
                "initialReading": 3, "finalReading": 3, "meterFactor": 1, "netProduction": 97
            }
        }]
}