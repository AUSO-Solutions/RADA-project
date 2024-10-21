import React  from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);


function LineChart({ data, labels, datasets }) {

  return (
    <div className="chart-container">
      {/* <h2 style={{ textAlign: "center" }}>
        Line Chart
      </h2> */}
      <Line
        data={{
          labels,
          datasets
        }}
        options={{
          plugins: {
            title: {
              display: false,
              text: ""
            },
            legend: {
              display: true,
              position: 'top',
              align: 'start',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle', boxHeight: 3,
                pointStyleWidth: 3
              }
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: datasets?.map(set => set?.axisname || set?.label)?.join(' | ')
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
          }
        }}
      />
    </div>
  );
}
export default LineChart;
