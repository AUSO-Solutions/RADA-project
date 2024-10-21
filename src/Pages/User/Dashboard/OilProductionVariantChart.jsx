import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const OilProductionVariantChart = ({ data: data_ }) => {
    // console.log({ data_ })
    const chartData = useMemo(() => {
        return {
            oilTarget: data_?.oilTarget,
            oilScheduledDeferment: data_?.oilScheduledDeferment?.total,
            oilUnscheduledDeferment: data_?.oilUnscheduledDeferment?.total,
            oilThirdPartyDeferment: data_?.oilThirdPartyDeferment?.total,
            oilActual: data_?.oilProduced
        }
    }, [data_])

    const data = useMemo(() => {
        return {
            labels: ['Target', 'Scheduled Deferment', 'Unscheduled Deferment', 'Third-Party Deferment', 'Actual'],
            datasets: [
                {
                    label: 'Oil Production Variance (bbls)',
                    data: [chartData.oilTarget, chartData.oilScheduledDeferment, chartData.oilUnscheduledDeferment, chartData.oilThirdPartyDeferment, chartData.oilActual], // Six values for each column
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Increase
                        // 'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(75, 192, 192, 0.6)', // Actual
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)', // Target border
                        // 'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(75, 192, 192, 1)', // Actual border
                    ],
                    borderWidth: 1,
                    borderDash: [0, [5, 5], [5, 5], [5, 5], 0], // Make bars dashed where appropriate
                },
            ],
        }
    }, [chartData]);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: true, // Ensure gridlines on x-axis are displayed
                    color: 'rgba(200, 200, 200, 0.3)', // Light gray gridlines for x-axis
                    drawBorder: true, // Draw the border between sections
                    drawOnChartArea: true, // Ensure the gridline spans the entire chart area
                    borderDash: [5, 5], // Make gridlines dashed if needed
                    tickLength: 10, // Ensure tick marks are visible
                },
                ticks: {
                    callback: function (value, index, ticks) {
                        // This will split the label text into multiple lines by inserting a line break.
                        const label = data.labels[index];
                        const words = label.split(' ');
                        const newLabel = words.join('\n'); // Break each word to a new line
                        return newLabel;
                    },
                    maxRotation: 0, // Horizontal labels
                    minRotation: 0,
                    autoSkip: false, // Ensure no labels are skipped
                    maxTicksLimit: 6, // Display exactly 6 labels
                    font: {
                        size: 8, // Adjust font size for better fit
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)', // Light gridlines
                },
                ticks: {
                    stepSize: 200000, // Adjust the y-axis step size
                    callback: function (value) {
                        return value.toLocaleString(); // Format y-axis numbers with commas
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true, // Hide the legend
            },
            tooltip: {
                enabled: true, // Enable tooltips
            },
        },
    };
    return (
        <div style={{ width: '100%', height: '300px', margin: '10px auto' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default OilProductionVariantChart;
