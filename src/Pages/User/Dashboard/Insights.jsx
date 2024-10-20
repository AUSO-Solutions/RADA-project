import React, { useMemo } from "react";
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
import { useSelector } from "react-redux";
import GasProductionVariantChart from "./GasProductionVariantChart";
// import { useAssetNames } from "hooks/useAssetNames";
// import { useAssetByName } from "hooks/useAssetByName";


const Insights = () => {
    const querys = useSelector(state => state?.setup)
    // console.log(querys)
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
    const colors = {
        'Ekulama 1 Flowstation': 'green',
        'Ekulama 2 Flowstation': 'blue',
        'Awoba Flowstation': 'red',
        'EFE Flowstation':'pink',
        "OML 147 Flowstation":'yellow'
    }
    const OilProductionChart = () => {
        return (
            // <div style={{ width: '100%', height: '300px !important', margin: '10px auto' }}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart width={'100%'} height={'100%'} data={OilProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis domain={[0, data?.oilTarget]} />
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" height={36} />
                    {
                        data.flowstations?.map(flowstation => <Bar dataKey={flowstation} stackId="a" fill={colors[flowstation]}/>)
                    }

                    <ReferenceLine y={data?.oilTarget} label="Prod Oil Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />


                </BarChart>
            </ResponsiveContainer>
            // </div>
        );
    };

    const GasProductionChart = () => {

        return (
            // <div style={{ width: '100%', height: '350px !important', margin: '10px auto' }}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart width={'100%'} height={'100%'} data={GasProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis domain={[0, data?.gasProducedTarget]} />
                    <Tooltip />

                    <Legend verticalAlign="bottom" align="center" height={36} />
                    <Bar dataKey="Fuel Gas" stackId="a" fill="#14A459" name="Utilized Gas" />
                    <Bar dataKey="Export Gas" stackId="a" fill="#A8D18D" name="Export Gas" />
                    <Bar dataKey="Flared Gas" stackId="a" fill="#F4B184" name="Flared Gas" />
                    <ReferenceLine y={data?.gasProducedTarget} label="Prod. Gas Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />
                </BarChart>
            </ResponsiveContainer>
            // </div>
        );
    };
    const getStatus = (target, actual) => {
        const percent = ((Math.abs(parseFloat(target) - parseFloat(actual)) / parseFloat(actual)) * 100).toFixed(1)
        if (parseFloat(target) > parseFloat(actual)) {
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
                <DashboardCard variance={getStatus(data?.oilTarget / 1000, data?.oilProduced / 1000)} targetVal={`Target: ${parseFloat(data?.oilTarget || 0)?.toFixed(3) / 1000}kbbls`} img={assets} title={"Oil Produced"} num={`${parseFloat(data?.oilProduced || 0)?.toFixed(3) / 1000} Kbbls`} />
                <DashboardCard variance={getStatus(data?.gasProducedTarget, data?.gasProduced)} targetVal={`Target: ${parseFloat(data?.gasProducedTarget || 0)?.toFixed(3)} MMscf`} img={grossprodgas} title={"Gas Produced"} num={`${parseFloat(data?.gasProduced || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.exportGasTarget, data?.gasExported)} targetVal={`Target: ${parseFloat(data?.exportGasTarget || 0)?.toFixed(3)} MMscf`} img={gasexported} title={"Gas Exported"} num={`${parseFloat(data?.gasExported || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.gasFlaredTarget, data?.gasFlared)} targetVal={`${parseFloat(data?.gasFlaredTarget || 0)?.toFixed(3)} MMscf`} img={gasflared} title={"Gas Flared"} num={`${parseFloat(data?.gasFlared || 0)?.toFixed(3)} MMscf`} />
                <DashboardCard variance={getStatus(data?.gasUtilizedTarget, data?.gasUtilized)} targetVal={`${parseFloat(data?.gasUtilizedTarget || 0)?.toFixed(3)} MMscf`} img={gasutilized} title={"Gas Utilized"} num={`${parseFloat(data?.gasUtilized || 0)?.toFixed(3)} MMscf`} />
            </div>

            <div className="pt-5 flex flex-row flex-wrap justify-evenly shadow rounded" style={{ rowGap: "12px" }}>
                <InsightsGraphCard title={`${querys?.asset} Oil Production (bopd)`}>{<OilProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset} Oil Production Variance Analysis`}>{<OilProductionVariantChart data={data} />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset} Gas Production (MMscf/d)`}>{<GasProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard title={`${querys?.asset} Gas Production Variance Analysis `}>{<GasProductionVariantChart data={data} />}</InsightsGraphCard>
                <InsightsGraphCard />
            </div>
        </div>
    )

}

export default Insights