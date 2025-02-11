import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RadioSelect from "Pages/User/FieldDataCapture/DailyoOperation/RadioSelect";
import { roundUp } from "utils";
import dayjs from "dayjs";
import RadaPieChart from "./PieChart";
import BarChart from "./BarChart";

const DefermentChart = ({
  chartType,
  dailyAggregate,

  frequency,
  gasScheduledDeferment,
  gasThirdPartyDeferment,
  gasUnscheduledDeferment,
  monthlyAggregate,

  oilScheduledDeferment,
  oilThirdPartyDeferment,
  oilUnscheduledDeferment,
  yearlyAggregate,
}) => {
  const query = useSelector((state) => state?.setup);
  const [fluidType, setFluidType] = useState("Net Oil/Condensate");
  const [dateFormat, setDateFormat] = useState();
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState({});
  useEffect(() => {
    if (frequency === "Day") {
      setDateFormat("DD-MM-YYYY");
    } else if (frequency === "Month") {
      setDateFormat("MMM YYYY");
    } else {
      setDateFormat("YYYY");
    }
  }, [frequency]);

  useEffect(() => {
    if (chartType === "Production Deferment Profile") {
      if (frequency === "Month") {
        if (fluidType === "Net Oil/Condensate") {
          const data = monthlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = monthlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalGasScheduled),
            "Unscheduled Deferment": roundUp(item.totalGasUnscheduled),
            "Third-Party Deferment": roundUp(item.totalGasThirdParty),
            "Total Gas": roundUp(item.totalGas),
          }));
          setChartData(data);
        }
      } else if (frequency === "Year") {
        if (fluidType === "Net Oil/Condensate") {
          const data = yearlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = yearlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalGasScheduled),
            "Unscheduled Deferment": roundUp(item.totalGasUnscheduled),
            "Third-Party Deferment": roundUp(item.totalGasThirdParty),
            "Total Gas": roundUp(item.totalGas),
          }));
          setChartData(data);
        }
      } else {
        if (fluidType === "Net Oil/Condensate") {
          const data = dailyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = dailyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalGasScheduled),
            "Unscheduled Deferment": roundUp(item.totalGasUnscheduled),
            "Third-Party Deferment": roundUp(item.totalGasThirdParty),
            "Total Gas": roundUp(item.totalGas),
          }));
          setChartData(data);
        }
      }
    } else if (chartType === "Scheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(oilScheduledDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(oilScheduledDeferment?.subs).map(() =>
          getRandomColor()
        );

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(gasScheduledDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(gasScheduledDeferment?.subs).map(() =>
          getRandomColor()
        );

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    } else if (chartType === "Unscheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(oilUnscheduledDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(oilUnscheduledDeferment?.subs).map(() =>
          getRandomColor()
        );

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(gasUnscheduledDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(gasUnscheduledDeferment?.subs).map(() =>
          getRandomColor()
        );
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    } else {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(oilThirdPartyDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(oilThirdPartyDeferment?.subs).map(() =>
          getRandomColor()
        );
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(gasThirdPartyDeferment?.subs).map(
          ([key, value]) => ({
            name: key,
            value: Number(roundUp(value)),
          })
        );
        const colors = Object.keys(gasThirdPartyDeferment?.subs).map(() =>
          getRandomColor()
        );
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    }
  }, [
    chartType,
    dailyAggregate,
    dateFormat,
    fluidType,
    frequency,
    gasScheduledDeferment?.subs,
    gasThirdPartyDeferment?.subs,
    gasUnscheduledDeferment?.subs,
    monthlyAggregate,
    oilScheduledDeferment?.subs,
    oilThirdPartyDeferment?.subs,
    oilUnscheduledDeferment?.subs,
    yearlyAggregate,
  ]);

  return (
    <div className="relative">
      <div className="flex justify-start gap-4 pt-4">
        <div className="w-auto min-w-[280px] pl-5 mt-[-12px]">
          <RadioSelect
            onChange={(e) => setFluidType(e)}
            defaultValue={fluidType}
            list={["Net Oil/Condensate", "Gas"]}
          />
        </div>

        {chartType === "Production Deferment Profile" ? (
          <div className="w-full pr-4">
            <div className="h-full w-full bg-[#fafafa]">
              <BarChart
                chartData={chartData}
                fluidType={fluidType}
                title={`${query?.asset} ${
                  query.flowstation && query.flowstation !== "All"
                    ? `- ${query.flowstation}`
                    : ""
                } ${fluidType} ${chartType} (${
                  fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"
                })`}
              />
            </div>
          </div>
        ) : (
          <RadaPieChart
            data={pieData.data}
            colors={pieData.colors}
            title={`${query?.asset} ${
              query.flowstation && query.flowstation !== "All"
                ? `- ${query.flowstation}`
                : ""
            } ${fluidType} ${chartType} (${
              fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"
            })`}
            title_empty={`No Data for ${query?.asset} ${
              query.flowstation && query.flowstation !== "All"
                ? `- ${query.flowstation}`
                : ""
            } ${fluidType} ${chartType}`}
          />
        )}
      </div>
    </div>
  );
};

export default DefermentChart;

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export { getRandomColor };
