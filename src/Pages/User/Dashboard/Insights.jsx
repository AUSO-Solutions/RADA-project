import React from "react";
import DashboardCard from "Components/dashboardCard";
import assets from 'Assets/images/assets.svg'
import gasexported from 'Assets/images/gasexported.svg'
import gasflared from 'Assets/images/gasflared.svg'
import grossprodgas from 'Assets/images/grossprodgas.svg'
import gasutilized from 'Assets/images/gasutilized.svg'
import InsightsGraphCard from "Components/insightsGraphCard";



const Insights = () => {

    return(
        <div className="bg-[#FAFAFA]" >
            <div className="mx-5 pt-3 flex flex-row  gap-5 " >
                <DashboardCard targetVal={'Target: 984kbbls'} img={assets} title={"Oil Produced"} num={'949 Kbbls'} />
                <DashboardCard targetVal={'Target: 834 MMscf'} img={grossprodgas} title={"Gas Produced"} num={'834 MMscf'} />
                <DashboardCard targetVal={'Target: 480 MMscf'} img={gasexported} title={"Gas Exported"} num={'480 MMscf'} />
                <DashboardCard targetVal={'341 MMscf'} img={gasflared} title={"Gas Flared"} num={'341 MMscf'} />
                <DashboardCard targetVal={'13 MMscf'} img={gasutilized} title={"Gas Utilized"} num={'13 MMscf'} />
            </div>

            <div className="pt-5 flex flex-row flex-wrap justify-evenly shadow rounded" style={{rowGap:"12px"}}>
                <InsightsGraphCard/>
                <InsightsGraphCard/>
                <InsightsGraphCard/>
                <InsightsGraphCard/>
            </div>
        </div>
    )

}

export default Insights