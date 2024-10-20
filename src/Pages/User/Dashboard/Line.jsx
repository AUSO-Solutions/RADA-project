import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);


function LineChart({ data, labels, datasets }) {

  const [chartData] = useState({
    labels,
    datasets
  });

  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>
        Line Chart
      </h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: ""
            },
            legend: {
              display: true
            }
          }
        }}
      />
    </div>
  );
}
export default LineChart;
