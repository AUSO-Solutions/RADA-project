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


const GasProductionVariantChart = ({ data: data_ }) => {
    console.log({ data_ })
    const chartData = useMemo(() => {
        return {
            gasProducedTarget: data_?.gasProducedTarget,
            totalOilDeferment :data_?.totalOilDeferment,
            totalGasDeferment:data_?.totalGasDeferment,
            gasUtilized: data_?.gasUtilized,
            gasFlared: data_?.gasFlared,
            gasExported: data_?.gasExported,
            gasActual: data_?.gasProduced
        }
    }, [data_])

    const data = useMemo(() => {
        return {
            labels: ['Target','Oil Deferment Impact' , 'Unitlized Gas', 'Flared Gas', 'Export', 'Actual'],
            datasets: [
                {
                    label: 'Gas Production Variance (MMscf)',
                    data: [chartData.gasProducedTarget, chartData.totalGasDeferment, chartData.gasUtilized, chartData.gasFlared, chartData.gasExported, chartData.gasActual], // Six values for each column
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)', // Increase
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(255, 99, 132, 0.6)', // Decrease
                        'rgba(75, 192, 192, 0.6)', // Increase
                        'rgba(75, 192, 192, 0.6)', // Actual
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)', // Target border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(255, 99, 132, 1)', // Decrease border
                        'rgba(75, 192, 192, 1)', // Increase border
                        'rgba(75, 192, 192, 1)', // Actual border
                    ],
                    borderWidth: 1,
                    borderDash: [0, [5, 5], [5, 5], [5, 5], 0], // Make bars dashed where appropriate
                },
                {
                    label: '',
                    data: [chartData.gasProducedTarget, chartData.totalGasDeferment, chartData.gasUtilized, chartData.gasFlared, chartData.gasExported, chartData.gasActual], // Six values for each column
                    backgroundColor: [
                        'white', // Increase
                        'white', // Decrease
                        'white', // Decrease
                        'white', // Decrease
                        'white', // Increase
                        'white', // Actual
                    ],
                    borderColor: [
                        'white', // Target border
                        'white', // Decrease border
                        'white', // Decrease border
                        'white', // Decrease border
                        'white', // Increase border
                        'white', // Actual border
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
                stacked:true,
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)', // Light gridlines
                },
                ticks: {
                    // stepSize: 200000, // Adjust the y-axis step size
                    callback: function (value) {
                        return value.toLocaleString(); // Format y-axis numbers with commas
                    },
                },stacked:true,
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

export default GasProductionVariantChart;
