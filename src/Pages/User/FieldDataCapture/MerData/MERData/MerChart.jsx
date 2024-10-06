import React, { useMemo, useState } from 'react';
import {  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import { Input } from 'Components'
import Text from 'Components/Text';
import { getIntersectionBetweenTwoLines } from 'utils';
// import { getChokeFthpPoints } from './getChokeFthpPoints'
// import { findLineByLeastSquares } from 'utils/findLineByLeastSquares';

const MerChart = ({ onClickOut = () => null, merResult }) => {
    // console.log(merResult?.merResultData)
    const [current, setCurrent] = useState('')
    const graphData = useMemo(() => {
        const results = Object.values(merResult?.merResultData || {}).filter(result => result?.productionString === current)
        return results?.flatMap(result => result?.chokes?.map(choke => ({ ...choke, fthp: choke?.fthp, reservoir: result?.reservoir, productionString: result?.productionString })))
    }, [current, merResult?.merResultData])

    const points = useMemo(() => {

        const fthpPoints = graphData.map(item => ({ x: item?.oilRate, y: item?.fthp }))
        const chokePoints = graphData.map(item => ({ x: item?.oilRate, y: item?.chokeSize }))
        // const { fthpPoints, chokePoints } = getChokeFthpPoints(graphData)
        console.log({ chokePoints })
        // const chokeSizesLineOfbestFit = findLineByLeastSquares(chokePoints?.map(line => line?.x), chokePoints?.map(line => line?.y))
        // const fthpLineOfbestFit = findLineByLeastSquares(fthpPoints?.map(line => line?.x), fthpPoints?.map(line => line?.y))
        // console.log({ chokeSizesLineOfbestFit: chokeSizesLineOfbestFit[0].map((x, i) => ({ x, y: chokeSizesLineOfbestFit[1][i] })), fthpLineOfbestFit: fthpLineOfbestFit[0].map((x, i) => ({ x, y: fthpLineOfbestFit[1][i] })) })
        const intersection = getIntersectionBetweenTwoLines(fthpPoints, chokePoints)
        return { fthpPoints, chokePoints, intersection }
    }, [graphData])



    return (
        <>
            <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
            <div className='fixed bottom-10 right-8 w-[650px] drop-shadow shadow p-2 rounded-[12px] bg-white p'>

                <div className='my-3 flex py-3 justify-between items-center'>
                    <Text weight={600}>
                        MER Chart
                    </Text>
                    <Input containerClass='!w-[150px]' type='select' onChange={(e) => setCurrent(e.value)} options={Object.values(merResult?.merResultData || {}).map(result => ({ label: result?.productionString, value: result?.productionString }))} />
                </div>
                <div>
                    MER: {points.intersection.x}
                </div>
                {/* <ResponsiveContainer width="100%" height="100%"> */}
                <div className=' mx-auto'>
                    <ComposedChart
                        width={600}
                        height={500}
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
                        <XAxis dataKey="oilRate" label={{ value: 'Oil Rate', angle: 0, position: 'insideLeft' }} />
                        <YAxis yAxisId="left" label={{ value: 'Choke sizes', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'FTHP', angle: -90, position: 'insideRight', }} />
                        <Tooltip />
                        <Legend />


                        {/* <Scatter yAxisId="left" type="monotone" dataKey="chokeSize" stroke="#8884d8" activeDot={{ r: 8 }} fill="red" />
                        <Scatter yAxisId="right" type="monotone" dataKey="fthp" stroke="#82ca9d" fill="blue" /> */}
                        <Line yAxisId="left" type="monotone" dataKey="chokeSize" stroke="#8884d8" dot={false} tension={0} strokeLinejoin='miter'
                            a />
                        <Line yAxisId="right" type="monotone" dataKey="fthp" stroke="#82ca9d" dot={false} tension={0} strokeLinejoin='miter'
                        />
                    </ComposedChart>
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










