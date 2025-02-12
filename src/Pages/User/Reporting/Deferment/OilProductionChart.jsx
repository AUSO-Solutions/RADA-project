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

export const OilAndGasDownloadReportChart = ({ asset, flowstation, startDate, endDate, chartType }) => {
  console.log({ asset, flowstation, startDate, endDate })
  const res = useFetch({
    firebaseFunction: "getInsights",
    payload: {
      asset: asset,
      flowstation: flowstation,
      startDate: startDate,
      endDate: endDate,
    },
    refetch: JSON.stringify({ asset, flowstation, startDate, endDate }),
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
  const oilProdData = useMemo(() => {
    // if (oilProdData?.length) return oilProdData;
      return Object.values(fetchedData.assetOilProduction || {});

  }, [fetchedData]);
  const GasProdData = useMemo(
    () => Object.values(fetchedData.assetGasProduction || {}),
    [fetchedData]
  );
  console.log(fetchedData, oilProdData)

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

  return (<>
   { chartType === "Oil" &&
    <ResponsiveContainer width="100%" height={350} key={asset + flowstation + startDate + endDate}>
      <BarChart
        width={"100%"}
        height={"100%"}
        data={oilProdData}
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
    </ResponsiveContainer>}


{chartType === "Gas" &&
  <ResponsiveContainer width="100%" height={350}>
<BarChart
  width={"100%"}
  height={"100%"}
  data={GasProdData}
  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="x" />
  <YAxis
  // domain={[0, data?.gasProducedTarget]}
  />
  <Tooltip />

  <Legend verticalAlign="bottom" align="center" height={36} />
  <Bar
    dataKey="Fuel Gas"
    stackId="a"
    fill="#14A459"
    name="Utilized Gas"
  />
  <Bar
    dataKey="Export Gas"
    stackId="a"
    fill="#A8D18D"
    name="Export Gas"
  />
  <Bar
    dataKey="Flared Gas"
    stackId="a"
    fill="#F4B184"
    name="Flared Gas"
  />
  <ReferenceLine
    alwaysShow
    y={targetForthisMonth?.gas}
    // label={`IPSC (${parseInt(targetForthisMonth?.gas)})`}

    label={{
      value: `IPSC (${parseInt(targetForthisMonth.gas)})`,
      fill: "black",
      fontWeight: 600,
    }}
    stroke="grey"
    strokeDasharray="4 4"
    strokeWidth={2}
  />
</BarChart>
</ResponsiveContainer>}
</>
  );
};

// export const 
