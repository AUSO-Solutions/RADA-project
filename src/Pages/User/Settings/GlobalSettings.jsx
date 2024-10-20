
import Text from 'Components/Text'
import React, { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs';

const GlobalSettings = () => {

    const [scheduledItems,
        // setScheduledItems
    ] = useState([
        { id: 1, name: 'Well Test', },
        { id: 2, name: 'Wellhead Maintenance', },
        { id: 3, name: 'Flowline Maintenance', },
        { id: 4, name: 'Bean Change/Check', },
        { id: 5, name: 'Well Services', },
        { id: 6, name: 'Data Acquisition', },
        { id: 7, name: 'Facility Shutdown', },
    ]);

    const [unscheduledItems,
        // setUnscheduledItems
    ] = useState([
        { id: 1, name: 'Engine Failure', },
        { id: 2, name: 'Pump Failure', },
        { id: 3, name: 'Well No-Flow', },
        { id: 4, name: 'Mismatch', },
    ]);

    const [thirdPartyItems, /*setThirdPartyItems*/] = useState([
        { id: 1, name: 'TFP Outage', },
        { id: 2, name: 'Export Line Issues', },
        { id: 3, name: 'Flowline Issue', },
        { id: 4, name: 'Ovade GP', },
        { id: 4, name: 'Community Interruption', },
    ]);

    const [isScheduledOpen, setIsScheduledOpen] = useState(false);
    const [isUnscheduledOpen, setIsUnscheduledOpen] = useState(false);
    const [isThirdPartyOpen, setIsThirdPartyOpen] = useState(false);


    // const handleInputChange = (id, newName) => {
    //     setScheduledItems(
    //         scheduledItems.map((item) =>
    //             item.id === id ? { ...item, name: newName } : item
    //         )
    //     );
    // };

    return (
        <div className='m-5'>

            <Text weight={700} size={'20px'} >Deferment Category</Text>

            <div className='flex flex-row w-[50%] justify-between mt-5'>

                <div>
                    <div onClick={() => setIsScheduledOpen(!isScheduledOpen)}
                        style={{ cursor: 'pointer', border: '1px solid rgba(230, 230, 230, 1)', padding: '2px 10px', width: '120px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isScheduledOpen ? 'rgba(0, 163, 255, 1)' : 'rgba(230, 230, 230, 1)', gap: 10 }} >
                        <Text color={isScheduledOpen ? "white" : "#24242480"} weight={500} size={'16px'} >
                            Scheduled
                        </Text>
                        <BsChevronDown
                            color={isScheduledOpen ? "white" : "#24242480"}
                            style={{ transform: isScheduledOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                        />
                    </div>
                    {isScheduledOpen && (
                        <div className='mt-5' >
                            <ul>
                                {scheduledItems.map((item) => (
                                    <li key={item.id}>
                                        <Text>{item.name}</Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <div onClick={() => setIsUnscheduledOpen(!isUnscheduledOpen)}
                        style={{ cursor: 'pointer', border: '1px solid rgba(230, 230, 230, 1)', padding: '2px 10px', width: '150px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isUnscheduledOpen ? 'rgba(0, 163, 255, 1)' : 'rgba(230, 230, 230, 1)', gap: 10 }} >
                        <Text color={isUnscheduledOpen ? "white" : "#24242480"} weight={500} size={'16px'} >
                            Unscheduled
                        </Text>
                        <BsChevronDown
                            color={isUnscheduledOpen ? "white" : "#24242480"}
                            style={{ transform: isUnscheduledOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                        />
                    </div>
                    {isUnscheduledOpen && (
                        <div className='mt-5' >
                            <ul>
                                {unscheduledItems.map((item) => (
                                    <li key={item.id}>
                                        <Text>{item.name}</Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <div onClick={() => setIsThirdPartyOpen(!isThirdPartyOpen)}
                        style={{ cursor: 'pointer', border: '1px solid rgba(230, 230, 230, 1)', padding: '2px 10px', width: '150px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isThirdPartyOpen ? 'rgba(0, 163, 255, 1)' : 'rgba(230, 230, 230, 1)', gap: 10 }} >
                        <Text color={isThirdPartyOpen ? "white" : "#24242480"} weight={500} size={'16px'} >
                            Third Party
                        </Text>
                        <BsChevronDown
                            color={isThirdPartyOpen ? "white" : "#24242480"}
                            style={{ transform: isThirdPartyOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                        />
                    </div>
                    {isThirdPartyOpen && (
                        <div className='mt-5' >
                            <ul>
                                {thirdPartyItems.map((item) => (
                                    <li key={item.id}>
                                        <Text>{item.name}</Text>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* <div className='mt-5 flex justify-end' >
                    <Button>Save</Button>
                </div> */}
            </div>
        </div>
    )
}

export default GlobalSettings