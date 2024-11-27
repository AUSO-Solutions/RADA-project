import React, { useMemo, useState } from 'react';
// import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import { Input } from 'Components'
import Text from 'Components/Text';
import { getIntersectionBetweenTwoLines } from 'utils';
import LineChart from 'Pages/User/Dashboard/Line';
// import { getChokeFthpPoints } from './getChokeFthpPoints'
import { findLineByLeastSquares } from 'utils/findLineByLeastSquares';
// import { ChartExample } from 'Pages/User/Dashboard/Line3';

const MerChart = ({ onClickOut = () => null, merResult }) => {
    // console.log(merResult?.merResultData)
    const [current, setCurrent] = useState('')
    const graphData = useMemo(() => {
        const results = Object.values(merResult?.merResultData || {}).filter(result => result?.productionString === current)
        return results?.flatMap(result => result?.chokes?.map(choke => ({ ...choke, fthp: choke?.fthp, reservoir: result?.reservoir, productionString: result?.productionString })))
    }, [current, merResult?.merResultData])

    const points = useMemo(() => {
        const fthpPoints = graphData.map(item => ({ x: parseFloat(item?.oilRate), y: parseFloat(item?.fthp) }))
        const chokePoints = graphData.map(item => ({ x: parseFloat(item?.oilRate), y: parseFloat(item?.chokeSize) }))
        const chokeSizesLineOfbestFit = findLineByLeastSquares(chokePoints?.map(line => line?.x), chokePoints?.map(line => line?.y))
        const fthpLineOfbestFit = findLineByLeastSquares(fthpPoints?.map(line => line?.x), fthpPoints?.map(line => line?.y))
        // console.log(
        //     { fthpPoints, fthpLineOfbestFit }
        // )
        const bestFit = ({
            chokeSizesLineOfbestFit: chokeSizesLineOfbestFit[0].map((x, i) => ({ x, y: chokeSizesLineOfbestFit[1][i] })),
            fthpLineOfbestFit: fthpLineOfbestFit[0].map((x, i) => ({ x, y: fthpLineOfbestFit[1][i] }))
        })
        const intersection = getIntersectionBetweenTwoLines(fthpPoints, chokePoints)
        return { fthpPoints, chokePoints, intersection, bestFit }
    }, [graphData])

    const fthpDataset = {
        label: "FTHP (psia)",
        // data: graphData.map(item => item?.fthp),
        data: points.bestFit.fthpLineOfbestFit.map(point => point.y),
        borderColor: "black",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y',
    }
    const chokeSizeDataset = {
        label: "Chok Size (/64)",
        // data: graphData.map(item => item?.chokeSize), 
        data: points.bestFit.chokeSizesLineOfbestFit.map(point => point.y),
        borderColor: "purple",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y1',
    }

    return (
        <>
            <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
            <div className='fixed bottom-10 z-[1000] right-8 w-[650px] drop-shadow shadow p-2 rounded-[12px] bg-white p'>

                <div className='my-3 flex py-3 justify-between items-center'>
                    <Text weight={600}>
                        MER Chart
                    </Text>
                    <Input containerClass='!w-[150px]' type='select' onChange={(e) => setCurrent(e.value)} options={Object.values(merResult?.merResultData || {}).map(result => ({ label: result?.productionString, value: result?.productionString }))} />
                </div>
                <div>
                    MER:
                    {points.intersection.x}
                </div>
                <LineChart
                    // xStepsize={10}
                    useCrosshair={true}
                    // xScaleType={'linear'}
                    datasets={[fthpDataset, chokeSizeDataset]}
                    labels={graphData.map(item => parseFloat(item?.oilRate))}
                />

            </div>
        </>
    )
}

export default MerChart










