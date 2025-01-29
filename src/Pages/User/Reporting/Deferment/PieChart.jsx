import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, Label } from "recharts";
import Text from "Components/Text";

const RadaPieChart = ({ data, title, colors, title_empty }) => {
  return (
    <div className="w-full pr-4">
      <div className="h-full p-4 w-full bg-[#fafafa]">
        {colors.length === 0 ? (
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
              <PieChart width={500} height={500}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                  // paddingAngle={1}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                  {/* {data.map((entry, index) => (
                    <Label
                      value={(entry) =>
                        `${entry.value} (${((entry.value / 1200) * 100).toFixed(
                          2
                        )}%)`
                      }
                      position="center"
                      fill="#fff"
                      key={`${entry.name}`}
                    />
                  ))} */}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RadaPieChart;
