import React, { useEffect, useMemo } from "react";
import DashboardCard from "Components/dashboardCard";
import assets from 'Assets/images/assets.svg'
import gasexported from 'Assets/images/gasexported.svg'
import gasflared from 'Assets/images/gasflared.svg'
import grossprodgas from 'Assets/images/grossprodgas.svg'
import gasutilized from 'Assets/images/gasutilized.svg'
import InsightsGraphCard from "Components/insightsGraphCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, } from 'recharts';
import OilProductionVariantChart from "./OilProductionVariantChart";
import { useFetch } from "hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import GasProductionVariantChart from "./GasProductionVariantChart";
import { sum } from "utils";
import { setSetupData } from "Store/slices/setupSlice";
import dayjs from "dayjs";
// import { useAssetNames } from "hooks/useAssetNames";
// import { useAssetByName } from "hooks/useAssetByName";


const Insights = () => {
    const dispatch = useDispatch()
    const querys = useSelector(state => state?.setup)
    console.log(querys)
    const res = useFetch({
        firebaseFunction: 'getInsights', payload: {
            asset: querys?.asset,
            flowstation: querys?.flowstation,
            startDate: querys?.startDate,
            endDate: querys?.endDate
        }, refetch: querys
    });

    const data = useMemo(() => {
        if (res?.data.length) return (JSON.parse(res?.data))
        return {}
    }, [res?.data])
    // console.log(data)
    const OilProdData = useMemo(() => Object.values(data.assetOilProduction || {}), [data]);
    const GasProdData = useMemo(() => Object.values(data.assetGasProduction || {}), [data]);
    const colors = useMemo(() => ({
        'Ekulama 1 Flowstation': 'green',
        'Ekulama 2 Flowstation': 'blue',
        'Awoba Flowstation': 'red',
        'EFE Flowstation': 'purple',
        "OML 147 Flowstation": 'orange'
    }), [])
    const targetForthisMonth = useMemo(() => {
        // const allTargets =  
        const selectedFlowstationTarget = (data?.ipscTarget?.flatMap(target => Object.values(target?.flowstationsTargets || {} )))
        // console.log()
        const oil = sum(selectedFlowstationTarget?.map(target => target?.oilRate));
        const gas = sum(selectedFlowstationTarget?.map(target => target?.gasRate));
        return { oil, gas }
    }, [data])
    useEffect(() => {
        dispatch(setSetupData({ name: "asset", value: '' }))
        dispatch(setSetupData({ name: 'startDate', value: dayjs().startOf('month').format('YYYY-MM-DD') }))
        dispatch(setSetupData({ name: 'endDate', value: dayjs().endOf('month').format('YYYY-MM-DD') }))
    }, [dispatch])
    const OilProductionChart = () => {
        return (
            <ResponsiveContainer width="100%" height={350}>
                <BarChart width={'100%'} height={'100%'} data={OilProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis
                    // domain={[0, parseInt(targetForthisMonth.oil)]}
                    />
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" height={36} />
                    {
                        data.flowstations?.sort((a, b) => a?.localeCompare(b))?.map(flowstation => <Bar dataKey={flowstation} stackId="a" fill={colors[flowstation]} />)
                    }
                    <ReferenceLine alwaysShow y={parseInt(targetForthisMonth.oil)}
                        //  label={`IPSC (${parseInt(targetForthisMonth.oil)})`}
                        label={{ value: `IPSC (${parseInt(targetForthisMonth.oil)})`, fill: 'black', fontWeight: 600 }}
                        stroke="grey" strokeDasharray="4 4" strokeWidth={3} />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const GasProductionChart = () => {

        return (
            // <div style={{ width: '100%', height: '350px !important', margin: '10px auto' }}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart width={'100%'} height={'100%'} data={GasProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis
                    // domain={[0, data?.gasProducedTarget]} 
                    />
                    <Tooltip />

                    <Legend verticalAlign="bottom" align="center" height={36} />
                    <Bar dataKey="Fuel Gas" stackId="a" fill="#14A459" name="Utilized Gas" />
                    <Bar dataKey="Export Gas" stackId="a" fill="#A8D18D" name="Export Gas" />
                    <Bar dataKey="Flared Gas" stackId="a" fill="#F4B184" name="Flared Gas" />
                    <ReferenceLine alwaysShow y={targetForthisMonth?.gas}
                        // label={`IPSC (${parseInt(targetForthisMonth?.gas)})`}

                        label={{ value: `IPSC (${parseInt(targetForthisMonth.gas)})`, fill: 'black', fontWeight: 600 }}
                        stroke="grey" strokeDasharray="4 4" strokeWidth={2} />
                </BarChart>
            </ResponsiveContainer>
            // </div>
        );
    };
    const getStatus = (target, actual, reverse = false) => {
        const percent = ((Math.abs(parseFloat(target) - parseFloat(actual)) / parseFloat(target)) * 100).toFixed(1)
        const check = reverse ? parseFloat(target) < parseFloat(actual) : parseFloat(target) > parseFloat(actual)
        if (check) {
            return {
                color: 'red',
                status: 'negative',
                percent
            }
        } else {
            return {
                color: 'green',
                status: 'positive',
                percent
            }
        }
    }


    return (
        <div className="bg-[#FAFAFA]" >
            <div className="mx-5 pt-3 flex flex-row  gap-5 " >
                <DashboardCard variance={getStatus(data?.oilTarget / 1000, data?.oilProduced / 1000)} targetVal={`Target: ${parseFloat(data?.oilTarget / 1000 || 0)?.toFixed(1)} kbbls`} img={assets} title={"Oil Produced"} num={`${parseFloat(data?.oilProduced / 1000 || 0)?.toFixed(1)} Kbbls`} />
                <DashboardCard variance={getStatus(data?.gasProducedTarget, data?.gasProduced)} targetVal={`Target: ${parseFloat(data?.gasProducedTarget || 0)?.toFixed(3)} MMscf`} img={grossprodgas} title={"Gas Produced"} num={`${parseFloat(data?.gasProduced || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.exportGasTarget, data?.gasExported)} targetVal={`Target: ${parseFloat(data?.exportGasTarget || 0)?.toFixed(3)} MMscf`} img={gasexported} title={"Gas Exported"} num={`${parseFloat(data?.gasExported || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.gasFlaredTarget, data?.gasFlared, true)} targetVal={`Target: ${parseFloat(data?.gasFlaredTarget || 0)?.toFixed(3)} MMscf`} img={gasflared} title={"Gas Flared"} num={`${parseFloat(data?.gasFlared || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.gasUtilizedTarget, data?.gasUtilized)} targetVal={`Target: ${parseFloat(data?.gasUtilizedTarget || 0)?.toFixed(3)} MMscf`} img={gasutilized} title={"Gas Utilized"} num={`${parseFloat(data?.gasUtilized || 0)?.toFixed(3)} MMscf`} />
            </div>

            <div className="pt-5 flex flex-row flex-wrap justify-evenly shadow rounded" style={{ rowGap: "12px" }}>
                <InsightsGraphCard title={`${querys?.asset || "All assets"} Oil Production (bopd)`}>{<OilProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset || "All assets"} Oil Production Variance Analysis`}>{<OilProductionVariantChart data={data} />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset || "All assets"} Gas Production (MMscf/d)`}>{<GasProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset || "All assets"} Gas Production Variance Analysis `}>{<GasProductionVariantChart data={data} />}
                </InsightsGraphCard>
                {/* <InsightsGraphCard /> */}
            </div>
        </div>
    )

}

export default Insights