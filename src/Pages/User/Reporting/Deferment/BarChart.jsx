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
  ReferenceLine,
} from "recharts";
import Text from "Components/Text";

const BarChart = ({ chartData, fluidType, title }) => {
  const fluidKey =
    fluidType === "Net Oil/Condensate" ? "Total Oil" : "Total Gas";
  const maxValue = Math.max(...chartData.map((item) => item[fluidKey])) * 1.01;

  return (
    <div className="h-full w-full bg-[#fafafa]">
      <div className="w-full flex justify-center items-center">
        <Text size={"18px"} weight={"600"}>
          {title}
        </Text>
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
          <YAxis yAxisId={"left"} orientation="left" domain={[0, "auto"]} />
          {chartData.length === 1 ? (
            <YAxis yAxisId={"right"} orientation="right" domain={[0, "auto"]} />
          ) : (
            <YAxis
              yAxisId={"right"}
              orientation="right"
              domain={[0, maxValue]}
              ticks={createEquallySpacedArray(0, maxValue, 4)}
            />
          )}

          <Tooltip />
          <Legend verticalAlign="bottom" align="center" height={36} />

          <Bar
            dataKey="Scheduled Deferment"
            stackId="a"
            fill="#9A031E"
            yAxisId={"left"}
          />
          <Bar
            dataKey="Unscheduled Deferment"
            stackId="a"
            fill="#03045E"
            yAxisId={"left"}
          />
          <Bar
            dataKey="Third-Party Deferment"
            stackId="a"
            fill="#344E41"
            yAxisId={"left"}
          />
          <Line
            type="monotone"
            dataKey={fluidKey}
            stroke="#003049"
            strokeWidth={2}
            yAxisId={"right"}
          />
          {chartData.length === 1 && (
            <ReferenceLine
              alwaysShow
              y={chartData[0][fluidKey]}
              stroke="#003049"
              strokeDasharray="4 4"
              strokeWidth={3}
              yAxisId={"left"}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;

const createEquallySpacedArray = (start, end, numOfElements) => {
  const step = (end - start) / numOfElements;

  const ticks = [];
  for (let i = 0; i <= numOfElements; i++) {
    ticks.push((0 + i * step).toFixed(2));
  }

  return ticks;
};
