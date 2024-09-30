import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// import { Box } from '@mui/material'
// import Text from 'Components/Text'
// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'Components'
import Text from 'Components/Text';
// import { firebaseFunctions } from 'Services'
// // import { store } from 'Store'
// import { Close } from '@mui/icons-material'
// import { setWholeSetup } from 'Store/slices/setupSlice'
// import { toast } from 'react-toastify'



const MerChart = ({ onClickOut = () => null, merResult }) => {
    // console.log(merResult?.merResultData)
    const [current, setCurrent] = useState('')
    const graphData = useMemo(() => {
        const results = Object.values(merResult?.merResultData || {}).filter(result => result?.productionString === current)
        return results?.flatMap(result => result?.chokes?.map(choke => ({ ...choke, fthp: choke?.fthp, reservoir: result?.reservoir, productionString: result?.productionString })))
    }, [current, merResult?.merResultData])
    // console.log(graphData)
    return (
        <>
            <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
            <div className='fixed bottom-2 right-8 w-[600px] drop-shadow border p-2 rounded bg-white p'>

                <div className='my-3'>
                    <Text>
                        MER Chart
                    </Text>
                    <Input containerClass='!w-[150px]' type='select' onChange={(e) => setCurrent(e.value)} options={Object.values(merResult?.merResultData || {}).map(result => ({ label: result?.productionString, value: result?.productionString }))} />
                </div>
                {/* <ResponsiveContainer width="100%" height="100%"> */}
                <div className='p-2 bg-[#F3F4F6] mx-auto'>
                    <LineChart
                        width={550}
                        height={400}
                        data={graphData}
                        style={{ backgroundColor: 'white', margin: 'auto' }}
                    // margin={{
                    //     // top: 5,
                    //     // right: 30,
                    //     // left: 20,
                    //     // bottom: 5,
                    // }}
                    >
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="oilRate" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="chokeSize" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="fthp" stroke="#82ca9d" />
                    </LineChart>
                </div>
                {/* </ResponsiveContainer> */}

                {/* <Button className={'w-[200px] mx-auto mt-5 '} onClick={save} loading={loading}>
                    Save
                </Button> */}
            </div>
        </>
    )
}

export default MerChart










