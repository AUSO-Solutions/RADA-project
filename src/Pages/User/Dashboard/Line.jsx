import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import crosshairPlugin from 'chartjs-plugin-crosshair';
// import { CategoryScale } from "chart.js";
import {
  // Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  crosshairPlugin
);


function LineChart({
  data, labels, datasets,
  useCrosshair,
  xStepsize,
  xScaleType,
  range = {
    y: { max: null, min: null, },
    y1: { max: null, min: null, }
  },
  onHover = () => null,
  onClick = () => null,
}) {

  const crosshair = useCrosshair ? {
    line: {
      color: 'red',  // crosshair line color
      width: .5        // crosshair line width
    },
    sync: {
      enabled: true,            // enable trace line syncing with other charts
      group: 1,                 // chart group
      suppressTooltips: true   // suppress tooltips when showing a synced tracer
    },
  } : {}


  const getPointsOnMouseEvent = (event) => {
    var yTop = event.chart.chartArea.top;
    var yBottom = event.chart.chartArea.bottom;

    var yMin = event.chart.scales['y'].min;
    var yMax = event.chart.scales['y'].max;

    var y1Min = event.chart.scales['y1'].min;
    var y1Max = event.chart.scales['y1'].max;
    var newY = 0, newY1 = 0;

    if (event.native.offsetY <= yBottom && event.native.offsetY >= yTop) {
      newY = Math.abs((event.native.offsetY - yTop) / (yBottom - yTop));
      newY = (newY - 1) * -1;
      newY = newY * (Math.abs(yMax - yMin)) + yMin;

      newY1 = Math.abs((event.native.offsetY - yTop) / (yBottom - yTop));
      newY1 = (newY1 - 1) * -1;
      newY1 = newY1 * (Math.abs(y1Max - y1Min)) + y1Min
    };

    var xTop = event.chart.chartArea.left;
    var xBottom = event.chart.chartArea.right;
    var xMin = event.chart.scales['x'].min;
    var xMax = event.chart.scales['x'].max;
    var newX = 0;

    if (event.native.offsetX <= xBottom && event.native.offsetX >= xTop) {
      newX = Math.abs((event.native.offsetX - xTop) / (xBottom - xTop));
      newX = newX * (Math.abs(xMax - xMin)) + xMin;
    };
    return ({ newX, newY, newY1 })
  }

  return (
    <div className="chart-container">

      <Line
        data={{
          labels,
          datasets
        }}
        options={{
          hover: {
            intersect: false
          },
          onHover: function (event) {
            const points = getPointsOnMouseEvent(event)
            onHover(points.newX, points.newY, points.newY1)
          },
          onClick: function (event) {
            const points = getPointsOnMouseEvent(event)
            onClick(points.newX, points.newY, points.newY1)
          },

          interaction: {
            mode: 'point',
            intersect: true,
          },
          plugins: {
            title: {
              display: false,
            },
            crosshair,

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
            x: {
              type: xScaleType || 'category',
              ticks: {
                stepSize: xStepsize
              }
            },
            y: {
              // type: 'linear',
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
              // type: 'linear',
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
