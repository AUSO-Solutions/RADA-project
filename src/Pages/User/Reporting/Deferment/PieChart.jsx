import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Text from "Components/Text";

const RadaPieChart = ({ data = [], title, colors, title_empty }) => {
  colors = colors || data?.colors;
  return (
    <div className="w-full pr-4">
      <div className="h-full p-4 w-full bg-[#fafafa]">
        {colors?.length === 0 ? (
          <div className=" w-full h-[400px] flex justify-center items-center">
            <Text Text size={"28px"} weight={600} height={"100%"}>
              {title_empty}
            </Text>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center items-center">
              <Text Text size={"18px"} weight={"600"}>
                {title}
              </Text>
            </div>
            <div className="w-full flex items-center justify-center">
              <ResponsiveContainer width={"100%"} height={420}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    // innerRadius={60}
                    outerRadius={180}
                    fill="#8884d8"
                    // paddingAngle={2}
                    label={({ name, value, percent }) =>
                      `${name}: ${value.toFixed(2)} (${(percent * 100).toFixed(
                        1
                      )}%)`
                    }
                  >
                    {data?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RadaPieChart;
