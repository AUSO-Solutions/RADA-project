import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RadioSelect from "Pages/User/FieldDataCapture/DailyoOperation/RadioSelect";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { roundUp } from "utils";
import Text from "Components/Text";
import dayjs from "dayjs";
import RadaPieChart from "./PieChart";

const DefermentChart = () => {
  const query = useSelector((state) => state?.setup);
  const defermentData = useSelector((state) => state?.deferments);
  const [fluidType, setFluidType] = useState("Net Oil/Condensate");

  const initialBarState = () => {
    if (defermentData.chartType === "Production Deferment Profile") {
      if (defermentData.frequency === "Month") {
        return defermentData.monthlyData || [];
      } else if (defermentData.frequency === "Year") {
        return defermentData.yearlyData || [];
      } else {
        return defermentData.dailyData || [];
      }
    }
  };

  const initialPieState = () => {
    if (defermentData.chartType === "Scheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilScheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilScheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      } else {
        const result = Object.entries(
          defermentData.gasScheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasScheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      }
    } else if (defermentData.chartType === "Unscheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilUnscheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilUnscheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      } else {
        const result = Object.entries(
          defermentData.gasUnscheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasUnscheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      }
    } else {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilThirdPartyDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilThirdPartyDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      } else {
        const result = Object.entries(
          defermentData.gasThirdPartyDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasThirdPartyDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        return data;
      }
    }
  };

  const initialDateFormat = () => {
    if (defermentData.frequency === "Day") {
      return "DD-MM-YYYY";
    } else if (defermentData.frequency === "Month") {
      return "MMM YYYY";
    } else {
      return "YYYY";
    }
  };
  const [dateFormat, setDateFormat] = useState(initialDateFormat);
  const [chartData, setChartData] = useState(initialBarState);
  const [pieData, setPieData] = useState(initialPieState);
  useEffect(() => {
    if (defermentData.frequency === "Day") {
      setDateFormat("DD-MM-YYYY");
    } else if (defermentData.frequency === "Month") {
      setDateFormat("MMM YYYY");
    } else {
      setDateFormat("YYYY");
    }
  }, [defermentData.frequency]);

  useEffect(() => {
    if (defermentData.chartType === "Production Deferment Profile") {
      if (defermentData.frequency === "Month") {
        if (fluidType === "Net Oil/Condensate") {
          const data = defermentData.monthlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = defermentData.monthlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalGasScheduled),
            "Unscheduled Deferment": roundUp(item.totalGasUnscheduled),
            "Third-Party Deferment": roundUp(item.totalGasThirdParty),
            "Total Gas": roundUp(item.totalGas),
          }));
          setChartData(data);
        }
      } else if (defermentData?.frequency === "Year") {
        if (fluidType === "Net Oil/Condensate") {
          const data = defermentData.yearlyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = defermentData.yearlyAggregate.map((item) => ({
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
          const data = defermentData.dailyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalOilScheduled),
            "Unscheduled Deferment": roundUp(item.totalOilUnscheduled),
            "Third-Party Deferment": roundUp(item.totalOilThirdParty),
            "Total Oil": roundUp(item.totalOil),
          }));
          setChartData(data);
        } else {
          const data = defermentData.dailyAggregate.map((item) => ({
            x: dayjs(item.date).format(dateFormat),
            "Scheduled Deferment": roundUp(item.totalGasScheduled),
            "Unscheduled Deferment": roundUp(item.totalGasUnscheduled),
            "Third-Party Deferment": roundUp(item.totalGasThirdParty),
            "Total Gas": roundUp(item.totalGas),
          }));
          setChartData(data);
        }
      }
    } else if (defermentData.chartType === "Scheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilScheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilScheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(
          defermentData.oilScheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasScheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    } else if (defermentData.chartType === "Unscheduled Deferment") {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilUnscheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilUnscheduledDeferment?.subs
        ).map(() => getRandomColor());

        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(
          defermentData.gasUnscheduledDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasUnscheduledDeferment?.subs
        ).map(() => getRandomColor());
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    } else {
      if (fluidType === "Net Oil/Condensate") {
        const result = Object.entries(
          defermentData.oilThirdPartyDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.oilThirdPartyDeferment?.subs
        ).map(() => getRandomColor());
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      } else {
        const result = Object.entries(
          defermentData.gasThirdPartyDeferment?.subs
        ).map(([key, value]) => ({
          name: key,
          value: Number(roundUp(value)),
        }));
        const colors = Object.keys(
          defermentData.gasThirdPartyDeferment?.subs
        ).map(() => getRandomColor());
        const data = {
          data: result,
          colors,
        };
        setPieData(data);
      }
    }
  }, [dateFormat, defermentData, fluidType]);

  console.log(chartData);

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

        {defermentData.chartType === "Production Deferment Profile" ? (
          <div className="w-full pr-4">
            <div className="h-full w-full bg-[#fafafa]">
              <div className="w-full flex justify-center items-center">
                <Text size={"18px"} weight={"600"}>{`${fluidType} ${
                  defermentData.chartType
                } for ${query?.asset || "OML 24"} (${
                  fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"
                })`}</Text>
              </div>

              <ResponsiveContainer width="100%" height={450}>
                <ComposedChart
                  data={chartData}
                  width={"100%"}
                  height={"100%"}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray={"3 3"} />
                  <XAxis dataKey={"x"} />
                  <YAxis />
                  <YAxis
                    yAxisId={"right"}
                    orientation="right"
                    // domain={["dataMin", "dataMax"]}
                  />
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" height={36} />

                  <Bar
                    dataKey="Scheduled Deferment"
                    stackId="a"
                    fill="purple"
                  />
                  <Bar dataKey="Unscheduled Deferment" stackId="a" fill="red" />
                  <Bar
                    dataKey="Third-Party Deferment"
                    stackId="a"
                    fill="blue"
                  />
                  <Line
                    type="monotone"
                    dataKey={
                      fluidType === "Net Oil/Condensate"
                        ? "Total Oil"
                        : "Total Gas"
                    }
                    stroke="#FF8042"
                    strokeWidth={2}
                    yAxisId={"right"}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  width={"100%"}
                  height={"100%"}
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray={"3 3"} />
                  <XAxis dataKey={"x"} />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" height={36} />
                  <Bar
                    dataKey="Scheduled Deferment"
                    stackId="a"
                    fill="purple"
                  />
                  <Bar dataKey="Unscheduled Deferment" stackId="a" fill="red" />
                  <Bar
                    dataKey="Third-Party Deferment"
                    stackId="a"
                    fill="blue"
                  />
                  <Line
                    type="monotone"
                    dataKey={
                      fluidType === "Net Oil/Condensate"
                        ? "Total Oil"
                        : "Total Gas"
                    }
                    stroke="#FF8042"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer> */}
            </div>
          </div>
        ) : (
          <RadaPieChart
            data={pieData.data}
            colors={pieData.colors}
            title={`${fluidType} ${defermentData.chartType} for ${
              query?.asset || "OML 24"
            } (${fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"})`}
            title_empty={`No ${fluidType} ${
              defermentData.chartType
            } Data for in ${query?.asset || "OML 24"}`}
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
