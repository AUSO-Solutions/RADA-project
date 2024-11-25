import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

function getData() {
    return [
        {
            year: "1990",
            population: 57410719,
        },
        {
            year: "2000",
            population: 59139969,
        },
        {
            year: "2010",
            population: 62502490,
        },
        {
            year: "2020",
            population: 67022855,
        },
        {
            year: "2030",
            population: 70088809,
        },
        {
            year: "2040",
            population: 72423278,
        },
        {
            year: "2050",
            population: 74268354,
        },
        {
            year: "2060",
            population: 75593335,
        },
        {
            year: "2070",
            population: 76712671,
        },
        {
            year: "2080",
            population: 77615354,
        },
        {
            year: "2090",
            population: 78092721,
        },
        {
            year: "2100",
            population: 78421884,
        },
    ];
}

const ChartExample = () => {
    const [options, setOptions] = useState({
        data: getData(),
        title: {
            text: `United Kingdom Population`,
        },
        series: [
            {
                yKey: "population",
                xKey: "year",
                stroke: "#6769EB",
                marker: {
                    fill: "#6769EB",
                    stroke: "#6769EB",
                },
            },
        ],
        axes: [
            {
                type: "number",
                position: "left",
                label: {
                    formatter: ({ value }) => {
                        return `${Number(value).toLocaleString("en-GB", {
                            notation: "compact",
                            maximumFractionDigits: 1,
                        })}`;
                    },
                },
                crosshair: {
                    snap: false,
                },
            },
            {
                type: "category",
                position: "bottom",
                title: {
                    text: "Year",
                },
                crosshair: {
                    snap: false,
                },
            },
        ],
        tooltip: {
            enabled: false,
        },
    });

    return <AgCharts options={options} />;
};
export { ChartExample }
// const root = createRoot(document.getElementById("root"));
// root.render(<ChartExample />);