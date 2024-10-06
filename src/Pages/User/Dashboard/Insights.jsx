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
import { useAssetNames } from "hooks/useAssetNames";
import { useAssetByName } from "hooks/useAssetByName";


const Insights = () => {


    // const { assetNames } = useAssetByName()
    // console.log(assetNames)


    const { data } = useFetch({
        firebaseFunction: 'getInsight', payload: {
            asset: 'OML 152', date: '06/10/2024', frequency: 'daily',
            flowstation: 'EFE Flowstation',
            month: 'July', year: '2024'
        }
    });


    const flows = useMemo(() => {

        let _jjjj = []
        if (data?.length) {
            _jjjj = data
        } else {
            _jjjj = [data]
        }
        const flows = (Object.fromEntries(_jjjj.map(item => ([item?.flowstation, item?.netOil]))))
        return flows
    }, [data])
    console.log({ flows })
    const OilProdData = useMemo(() => {
        return [
            {
                date: data?.date,
                ...flows
            }
        ]
    }, [data, flows]);

    const OilProductionChart = () => {

        return (
            <ResponsiveContainer width="100%" height={'100%'}>
                <BarChart data={OilProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, data?.targetOil]} />
                    <Tooltip />

                    <Legend verticalAlign="bottom" align="center" height={36} />
                    <ReferenceLine y={data?.targetOil} label="NCEP Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />
                    {
                        Object.entries(flows || {}).map(item => <Bar key={item[0]} dataKey={item[0]} stackId="a" fill="#22B2A2" name={item[0]} />)
                    }

                </BarChart>
            </ResponsiveContainer>
        );
    };


    const gas = useMemo(() => {
        if (!data) return [];
    
        const gasData = Array?.isArray(data) ? data : [data];
    
        return gasData?.map(item => ({
            date: item?.date,
            fuelGas: item?.fuelGas || 0,
            flaredGas: item?.flaredGas || 0,
            exportGas: item?.exportGas || 0
        }));
    }, [data]);

    console.log({ gas })

    const GasProdData = useMemo(() => {
        return gas?.length ? gas : [];  
    }, [gas]);


    const GasProductionChart = () => {

        return (
            <ResponsiveContainer width="100%" height={'100%'}>
                <BarChart data={GasProdData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />
                    <YAxis domain={[0, data?.targetTotalGas]} />
                    <Tooltip />

                    <Legend verticalAlign="bottom" align="center" height={36} />
                    <ReferenceLine y={data?.targetTotalGas} label="Prod. Gas Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />
                    {/* <Bar dataKey="flow1" stackId="a" fill="#14A459" name="Utilized Gas" /> */}
                    {/* {
                        Object.entries(gas || {}).map(item => <>
                            <Bar key={item[0]} dataKey={item[0]} stackId="a" fill="#14A459" name={item[0]} />
                        </>
                        )
                    } */}

                    <Bar dataKey="fuelGas" stackId="a" fill="#14A459" name="Utilized Gas" />
                    <Bar dataKey="exportGas" stackId="a" fill="#A8D18D" name="Export Gas" />
                    <Bar dataKey="flaredGas" stackId="a" fill="#F4B184" name="Flared Gas" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="bg-[#FAFAFA]" >
            <div className="mx-5 pt-3 flex flex-row  gap-5 " >
                <DashboardCard targetVal={'Target: 984kbbls'} img={assets} title={"Oil Produced"} num={'949 Kbbls'} />
                <DashboardCard targetVal={'Target: 834 MMscf'} img={grossprodgas} title={"Gas Produced"} num={'834 MMscf'} />
                <DashboardCard targetVal={'Target: 480 MMscf'} img={gasexported} title={"Gas Exported"} num={'480 MMscf'} />
                <DashboardCard targetVal={'341 MMscf'} img={gasflared} title={"Gas Flared"} num={'341 MMscf'} />
                <DashboardCard targetVal={'13 MMscf'} img={gasutilized} title={"Gas Utilized"} num={'13 MMscf'} />
            </div>

            <div className="pt-5 flex flex-row flex-wrap justify-evenly shadow rounded" style={{ rowGap: "12px" }}>
                <InsightsGraphCard>{<OilProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard >{<OilProductionVariantChart />}</InsightsGraphCard>
                <InsightsGraphCard>{<GasProductionChart />}</InsightsGraphCard>
                <InsightsGraphCard />
            </div>
        </div>
    )

}

export default Insights