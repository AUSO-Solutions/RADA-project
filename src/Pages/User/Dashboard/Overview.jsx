import DashboardCard from "Components/dashboardCard";
import React, { useMemo } from "react";
import assets from 'Assets/images/assets.svg'
import activewells from 'Assets/images/activewells.svg'
import grossprodoil from 'Assets/images/grossprodoil.svg'
import grossprodgas from 'Assets/images/grossprodgas.svg'
import noofreports from 'Assets/images/noofreports.svg'
import Text from "Components/Text";
import RadaTable from "Components/RadaTable";

import { useFetch } from "hooks/useFetch";
import { useSelector } from "react-redux";


const Overview = () => {

    // const [overviewData, setOverviewData] = useState({})
    const filter = useSelector(state => state?.setup)
    const { data: overviewData } = useFetch({ firebaseFunction: 'getOverviewData', payload: { date: filter?.date }, refetch: filter })
    // console.log( filter)

    const result = useMemo(() => {
        if (typeof overviewData === 'string') {
            return JSON.parse(overviewData)
        }
        return {}
    }, [overviewData])



    return (
        <div className="bg-[#FAFAFA]" >

            <div className="pt-3  flex flex-row justify-evenly" >
                <DashboardCard img={assets} title={"Assets"} num={result?.assets} />
                <DashboardCard img={activewells} title={"Flowstations"} num={result?.flowstations} />
                <DashboardCard img={grossprodoil} title={"Producing Reservoirs"} num={result?.producingReservoir} />
                <DashboardCard img={grossprodgas} title={"Producing Wells"} num={result?.producingWells} />
                <DashboardCard img={noofreports} title={"Shutin Wells"} num={result?.shutinWells} />
            </div>

            <div className="w-full flex flex-row mt-10 gap-3 ">
                <div className="w-[100%] bg-[#FFFFFF] mx-5 pt-5 rounded-lg" >
                    <Text size={'22px'} weight={'500'} className='pl-5' >Activities</Text>
                    <div className="ml-5 bg-[#FAFAFA]  h-[62px] flex flex-row gap-5 border-4 border-[#FAFAFA] rounded-full w-[300px] mt-5 items-center justify-around" >
                        <div className='text-[#595959] hover:bg-[#00A3FF] hover:text-[white] h-[50px] w-[120px] flex items-center justify-center hover:rounded-3xl cursor-pointer ' >
                            <Text size={'16px'} weight={'600'} >Groups</Text>
                        </div>
                        <div className=' text-[#595959] hover:bg-[#00A3FF] hover:text-[white] h-[50px] w-[120px] flex items-center justify-center hover:rounded-3xl cursor-pointer' >
                            <Text size={'16px'} weight={'600'} >Queries</Text>
                        </div>

                    </div>
                    <div className="mt-3" >
                        <RadaTable noaction noNumbers noSearch
                            firebaseApi='getGroups'
                            columns={[
                                { name: 'Group Name', key: "groupName" },
                                {
                                    name: 'Members', render: (data) => {
                                        const memberslist = data?.members?.map(member => member.name).slice(0, 2).join(', ') + "..."
                                        if (data?.members?.length) return memberslist
                                        return 'No member present'
                                    }
                                },
                                {
                                    name: 'Assets', render: (data) => {
                                        if (data?.assets?.length) return data?.assets?.join(', ')
                                        return 'No asset present'
                                    }
                                },
                            ]} />
                    </div>

                </div>
                {/* <div className="w-[30%] bg-[#FFFFFF] mx-5 p-5 rounded-lg" >
                    <Text size={'22px'} weight={'500'} >Pending Broadcast</Text>
                    <hr className="mt-3" />
                    <div className="flex flex-col gap-5 pt-5 overflow-y-scroll" >
                        <BroadcastCard />
                        <BroadcastCard />
                        <BroadcastCard />
                        <BroadcastCard />
                        <BroadcastCard />
                        <BroadcastCard />
                    </div>

                </div> */}
            </div>
        </div>
    )
}

export default Overview