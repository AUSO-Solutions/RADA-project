import { useFetch } from "hooks/useFetch";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { sum } from "utils";

export const OilProductionChart = ({ asset, query, chartData }) => {
  const res = useFetch({
    firebaseFunction: "getInsights",
    payload: {
      asset: query?.asset,
      flowstation: query?.flowstation,
      startDate: query?.startDate,
      endDate: query?.endDate,
    },
    refetch: query,
  });

  const fetchedData = useMemo(() => {
    if (res?.data) {
      try {
        return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      } catch (error) {
        console.error("Error parsing fetched data:", error);
        return {};
      }
    }
    return {};
  }, [res?.data]);

  const OilProdData = useMemo(() => {
    if (chartData?.length) return chartData; 
    return Object.values(fetchedData.assetOilProduction || {}); 
  }, [chartData, fetchedData]);

  const targetForthisMonth = useMemo(() => {
    const selectedFlowstationTarget = fetchedData?.ipscTarget?.flatMap((target) =>
      Object.values(target?.flowstationsTargets || {})
    );
    const oil = sum(selectedFlowstationTarget?.map((target) => target?.oilRate));
    const gas = sum(selectedFlowstationTarget?.map((target) => target?.gasRate));
    return { oil, gas };
  }, [fetchedData]);

  const colors = useMemo(
    () => ({
      "Ekulama 1 Flowstation": "green",
      "Ekulama 2 Flowstation": "blue",
      "Awoba Flowstation": "red",
      "EFE Flowstation": "purple",
      "OML 147 Flowstation": "orange",
    }),
    []
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        width={"100%"}
        height={"100%"}
        data={OilProdData}
        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" height={36} />
        {fetchedData.flowstations
          ?.sort((a, b) => a?.localeCompare(b))
          ?.map((flowstation) => (
            <Bar
              key={flowstation}
              dataKey={flowstation}
              stackId="a"
              fill={colors[flowstation]}
            />
          ))}
        <ReferenceLine
          alwaysShow
          y={parseInt(targetForthisMonth.oil)}
          label={{
            value: `IPSC (${parseInt(targetForthisMonth.oil)})`,
            fill: "black",
            fontWeight: 600,
          }}
          stroke="grey"
          strokeDasharray="4 4"
          strokeWidth={3}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
