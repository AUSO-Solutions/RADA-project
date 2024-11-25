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
  }
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
    zoom: {
      enabled: true,                                      // enable zooming
      zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
      zoomboxBorderColor: '#48F',                         // border color of zoom box
      zoomButtonText: 'Reset Zoom',                       // reset zoom button text
      zoomButtonClass: 'reset-zoom',                      // reset zoom button class
    },
    // callbacks: {
    //   beforeZoom: () => function (start, end) {                  // called before zoom, return false to prevent zoom
    //     return true;
    //   },
    //   afterZoom: () => function (start, end) {                   // called after zoom
    //   }
    // }
  } : {}

  return (
    <div className="chart-container">

      <Line
        data={{
          labels,
          datasets
        }}
        options={{
          onClick: function (evt, item) {
            console.log(item)
            if (item.length) {
              console.log("onHover", item, evt.type);
              // console.log(item[0].element.$context.raw)
              // console.log(item[1].element.$context.raw)
              console.log(">data", item[0]._index, datasets[0].data[item[0]._index]);
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
