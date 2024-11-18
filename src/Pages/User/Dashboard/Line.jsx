import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
// import { CategoryScale } from "chart.js";
import {
  // Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend);


function LineChart({ data, labels, datasets, range = { y: { max: null, min: null, }, y1: { max: null, min: null, } } }) {
  // console.log(datasets?.every(set => set?.yAxisID === datasets[0]?.yAxisID),datasets)
  return (
    <div className="chart-container">

      <Line

        data={{
          labels,
          datasets
        }}
        options={{
          onHover: function (evt, item) {
            // console.log(item)
            if (item.length) {
              // console.log("onHover", item, evt.type);
              // console.log(item[0].element.$context.raw)
              // console.log(item[1].element.$context.raw)
              // console.log(">data", item[0]._index, datasets[0].data[item[0]._index]);
            }
          },
        
          interaction: {
            mode: 'point',
            intersect: true,
          },
          plugins: {
            title: {
              display: false,
              
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
          // stacked: false,
          scales: {
            x:{
              ticks:{
                stepSize:10
              }
            },
            y: {
              type: 'linear',
              position: 'left',
              id: "y",
              max: range?.y?.max ?? null,
              min: range?.y?.min ?? null,
              title: {
                display: true,
                text: datasets?.filter(set => set?.yAxisID === 'y')?.map(set => set?.axisname || set?.label)?.join(' | ')
              }
            },
            y1: {
              type: 'linear',
              display: !datasets?.every(set => set?.yAxisID === datasets[0]?.yAxisID),
              position: 'right',
              id: 'y1',
              max: range?.y1?.max ?? null,
              min: range?.y1?.min ?? null,
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: datasets?.filter(set => set?.yAxisID === 'y1')?.map(set => set?.axisname || set?.label)?.join(' | ')
              },
            },
          },

        }}
      />
    </div>
  );
}
export default LineChart;
