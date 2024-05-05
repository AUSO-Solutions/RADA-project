export const forms = {

    "Production Volume": {
        name: "Production Volume",
        url: "/fields/create-production-volume-field",
        fields: [
            { type: "text", name: "wellIdentity", label: "Well ID" },
            { type: "text", name: "basicSedimentAndWater", label: "Basic Sediment and Water" },
            { type: "text", name: "netOil", label: "Net Oil" },
            { type: "text", name: "producedGas", label: "Produced Gas" },
            { type: "text", name: "exportGas", label: "Export Gas" },
            { type: "text", name: "fuelGas", label: "Fuel Gas" },
            { type: "text", name: "flareGas", label: "Flare Gas" },
            { type: "text", name: "condensateProduced", label: "Condensate Produced" },
            { type: "text", name: "loss", label: "Loss" },
            { type: "text", name: "waterGasRate", label: "Water Gas Rate" },
        ]
    },
    "Cumulative Production": {
        name: "Cumulative Production",
        url: "",
        fields: [
            { type: "text", name: "wellIdentity", label: "Well ID" },
            { type: "text", name: "productionDaysUptime", label: "Production Days Uptime" },
            { type: "text", name: "chokeSize", label: "Choke Size" },
            { type: "text", name: "oilRate", label: "Oil Rate" },
            { type: "text", name: "gasRate", label: "Gas Rate" },
            { type: "text", name: "waterRate", label: "Water Rate" },
            { type: "text", name: "basicSedimentAndWater", label: "Basic Sediment and Water" },
            { type: "text", name: "grossOil", label: "Gross Oil" },
            { type: "text", name: "netOil", label: "Net Oil" },
            { type: "text", name: "cumulativeOil", label: "Cumulative Oil" },
            { type: "text", name: "cumulativeGas", label: "Cumulative Gas" },
            { type: "text", name: "cumulativeWater", label: "Cumulative Water" },
            { type: "text", name: "averageNetOil", label: "Average Net Oil" },
            { type: "text", name: "averageGrossOil", label: "Average Gross Oil" },
        ]
    },
    "Well Flow": {
        name: "Well Flow",
        url: "",
        fields: [

            { type: "text", name: "wellIdentity", label: "Well ID" },
            { type: "text", name: "flowingTurbingHeadPressureTHB", label: "Flowing Turbing Head Pressure THB" },
            { type: "text", name: "flowLinePressure", label: "Flow Line Pressure" },
            { type: "text", name: "chokeSize", label: "Choke Size" },
            { type: "text", name: "casingHeadPressure", label: "Casing Head Pressure" },
            { type: "text", name: "manifoldHeadPressure", label: "Short In Tubing Head Pressure" },
            { type: "text", name: "shortInTubingHeadPressure", label: "Choke Size" },

        ]
    }
}