import React from "react";
import DashboardCard from "Components/dashboardCard";
import assets from 'Assets/images/assets.svg'
import gasexported from 'Assets/images/gasexported.svg'
import gasflared from 'Assets/images/gasflared.svg'
import grossprodgas from 'Assets/images/grossprodgas.svg'
import gasutilized from 'Assets/images/gasutilized.svg'
import InsightsGraphCard from "Components/insightsGraphCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, } from 'recharts';
import OilProductionVariantChart from "./OilProductionVariantChart";



const Oildata = [
    { date: '1-Jul', flow1: 5, flow2: 13, flow3: 4, target: 40 },
    { date: '2-Jul', flow1: 6, flow2: 5, flow3: 12, target: 40 },
    { date: '3-Jul', flow1: 10, flow2: 9, flow3: 14, target: 40 },
    { date: '4-Jul', flow1: 10, flow2: 8, flow3: 4, target: 40 },
    { date: '5-Jul', flow1: 10, flow2: 5, flow3: 4, target: 40 },
    { date: '6-Jul', flow1: 10, flow2: 7, flow3: 4, target: 40 },
    { date: '7-Jul', flow1: 10, flow2: 11, flow3: 4, target: 40 },
    { date: '8-Jul', flow1: 11, flow2: 14, flow3: 7, target: 40 },
    { date: '9-Jul', flow1: 10, flow2: 9, flow3: 4, target: 40 },
    { date: '11-Jul', flow1: 10, flow2: 8, flow3: 14, target: 40 },
    { date: '12-Jul', flow1: 10, flow2: 5, flow3: 4, target: 40 },
    { date: '13-Jul', flow1: 10, flow2: 19, flow3: 4, target: 40 },
    { date: '14-Jul', flow1: 8, flow2: 5, flow3: 13, target: 40 },
    { date: '15-Jul', flow1: 12, flow2: 5, flow3: 4, target: 40 },
    { date: '16-Jul', flow1: 11, flow2: 15, flow3: 8, target: 40 },
];
const Oiltarget = 40

const OilProductionChart = () => {

    return (
        <ResponsiveContainer width="100%" height={'100%'}>
            <BarChart data={Oildata} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                {/* Adding Cartesian Grid for background lines */}
                <CartesianGrid strokeDasharray="3 3" />

                {/* Defining the X and Y axes */}
                <XAxis dataKey="date" />
                <YAxis domain={[0, 50]} />
                <Tooltip />

                <Legend verticalAlign="bottom" align="center" height={36} />
                <ReferenceLine y={Oiltarget} label="NCEP Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />
                <Bar dataKey="flow1" stackId="a" fill="#22B2A2" name="Flow station1" />
                <Bar dataKey="flow2" stackId="a" fill="#BCD7EF" name="Flow station2" />
                <Bar dataKey="flow3" stackId="a" fill="#A5A5A5" name="Flow station3" />
            </BarChart>
        </ResponsiveContainer>
    );
};


const Gasdata = [
    { date: '1-Jul', flow1: 5, flow2: 13, flow3: 14, target: 40 },
    { date: '2-Jul', flow1: 5, flow2: 5, flow3: 20, target: 40 },
    { date: '3-Jul', flow1: 5, flow2: 9, flow3: 18, target: 40 },
    { date: '4-Jul', flow1: 5, flow2: 8, flow3: 21, target: 40 },
    { date: '5-Jul', flow1: 5, flow2: 5, flow3: 19, target: 40 },
    { date: '6-Jul', flow1: 5, flow2: 7, flow3: 20, target: 40 },
    { date: '7-Jul', flow1: 5, flow2: 11, flow3: 16, target: 40 },
    { date: '8-Jul', flow1: 5, flow2: 14, flow3: 15, target: 40 },
    { date: '9-Jul', flow1: 5, flow2: 9, flow3: 20, target: 40 },
    { date: '11-Jul', flow1: 5, flow2: 8, flow3: 18, target: 40 },
    { date: '12-Jul', flow1: 5, flow2: 5, flow3: 21, target: 40 },
    { date: '13-Jul', flow1: 5, flow2: 19, flow3: 12, target: 40 },
    { date: '14-Jul', flow1: 5, flow2: 5, flow3: 17, target: 40 },
    { date: '15-Jul', flow1: 5, flow2: 5, flow3: 22, target: 40 },
    { date: '16-Jul', flow1: 5, flow2: 15, flow3: 11, target: 40 },
];

const Gastarget = 40

const GasProductionChart = () => {

    return (
        <ResponsiveContainer width="100%" height={'100%'}>
            <BarChart data={Gasdata} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                {/* Adding Cartesian Grid for background lines */}
                <CartesianGrid strokeDasharray="3 3" />

                {/* Defining the X and Y axes */}
                <XAxis dataKey="date" />
                <YAxis domain={[0, 50]} />
                <Tooltip />

                <Legend verticalAlign="bottom" align="center" height={36} />
                <ReferenceLine y={Gastarget} label="Prod. Gas Target" stroke="#A5A5A5" strokeDasharray="4 4" strokeWidth={2} />
                <Bar dataKey="flow1" stackId="a" fill="#14A459" name="Utilized Gas" />
                <Bar dataKey="flow2" stackId="a" fill="#A7D18D" name="Exported Gas" />
                <Bar dataKey="flow3" stackId="a" fill="#F4B184" name="Flared Gas" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const Insights = () => {

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
                <InsightsGraphCard >{<OilProductionVariantChart/>}</InsightsGraphCard>
                <InsightsGraphCard>{<GasProductionChart/>}</InsightsGraphCard>
                <InsightsGraphCard />
            </div>
        </div>
    )

}

export default Insights