import React, { useMemo, useState } from 'react';
// import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import { Input } from 'Components'
import Text from 'Components/Text';
// import { getIntersectionBetweenTwoLines } from 'utils';
import LineChart from 'Pages/User/Dashboard/Line';

import Chart from "chart.js/auto";
import crosshairPlugin from 'chartjs-plugin-crosshair';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";
// import { getChokeFthpPoints } from './getChokeFthpPoints'
// import { findLineByLeastSquares } from 'utils/findLineByLeastSquares';
// import { ChartExample } from 'Pages/User/Dashboard/Line3';

Chart.register(
    // CategoryScale,
    // LinearScale,
    // PointElement,
    // LineElement,
    // Title,
    // Tooltip,
    // Legend,
    crosshairPlugin
);
const MerChart = ({ onClickOut = () => null, merResult, onPointClick = () => null }) => {

    const [chartWidth, setChartWidth] = useState(650);
    const [chartHeight, setChartHeight] = useState(450);

    // console.log(merResult?.merResultData)
    const [currentPoints, setCurrentPoints] = useState({ x: 0, y: 0, y1: 0 })
    const [selectedCurrentPoint, setSelectedCurrentPoint] = useState({ x: 0, y: 0, y1: 0 })
    const [current, setCurrent] = useState('')
    const graphData = useMemo(() => {
        const results = Object.values(merResult?.merResultData || {}).filter(result => result?.productionString === current)
        return results?.flatMap(result => result?.chokes?.map(choke => ({ ...choke, fthp: choke?.fthp, reservoir: result?.reservoir, productionString: result?.productionString })))
    }, [current, merResult?.merResultData])

    // const points = useMemo(() => {
    //     const fthpPoints = graphData.map(item => ({ x: parseFloat(item?.oilRate), y: parseFloat(item?.fthp) }))
    //     const chokePoints = graphData.map(item => ({ x: parseFloat(item?.oilRate), y: parseFloat(item?.chokeSize) }))
    //     const chokeSizesLineOfbestFit = findLineByLeastSquares(chokePoints?.map(line => line?.x), chokePoints?.map(line => line?.y))
    //     const fthpLineOfbestFit = findLineByLeastSquares(fthpPoints?.map(line => line?.x), fthpPoints?.map(line => line?.y))
    //     // console.log(
    //     //     { fthpPoints, fthpLineOfbestFit }
    //     // )
    //     const bestFit = ({
    //         chokeSizesLineOfbestFit: chokeSizesLineOfbestFit[0].map((x, i) => ({ x, y: chokeSizesLineOfbestFit[1][i] })),
    //         fthpLineOfbestFit: fthpLineOfbestFit[0].map((x, i) => ({ x, y: fthpLineOfbestFit[1][i] }))
    //     })
    //     const intersection = getIntersectionBetweenTwoLines(fthpPoints, chokePoints)
    //     return { fthpPoints, chokePoints, intersection, bestFit }
    // }, [graphData])

    const fthpDataset = {
        label: "FTHP (psia)",
        data: graphData.map(item => item?.fthp),
        // data: points.bestFit.fthpLineOfbestFit.map(point => point.y),
        borderColor: "black",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y',
    }
    const chokeSizeDataset = {
        label: "Chok Size (/64)",
        data: graphData.map(item => item?.chokeSize),
        // data: points.bestFit.chokeSizesLineOfbestFit.map(point => point.y),
        borderColor: "purple",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y1',
    }

    const getHoveredPoints = (x, y, y1) => {
        // console.log({ x, y, y1 })
        setCurrentPoints({ x, y, y1 })

    }

    return (
        <>
            <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
            <Draggable
                // bounds="parent"
                cancel=".react-resizable-handle"
            // position={null}
            >
                <ResizableBox
                    width={chartWidth}
                    height={chartHeight}
                    minConstraints={[400, 450]}
                    maxConstraints={[1000, 800]}
                    resizeHandles={['se']}
                    onResizeStop={(e, data) => {
                        setChartWidth(data.size.width);
                        setChartHeight(data.size.height);
                    }}
                    style={{ position: 'fixed', bottom: 10, right: 8, zIndex: 1000 }}
                >
                    <div className=' cursor-move drop-shadow shadow p-2 rounded-[12px] bg-white p'
                        style={{ overflow: 'scroll', width: '100%', height: '100%', }} >
                        <div className='my-3 flex py-3 justify-between items-center'>
                            <Text weight={600}>
                                MER Chart ({current})
                            </Text>
                            <Input containerClass='!w-[150px]' type='select' onChange={(e) => {
                                setSelectedCurrentPoint({ x: 0, y: 0, y1: 0 })
                                setCurrent(e.value)
                            }} options={Object.values(merResult?.merResultData || {}).map(result => ({ label: result?.productionString, value: result?.productionString }))} />
                        </div>
                        <div className='pl-3 flex gap-3'>
                            {/* {selectedCurrentPoint.x.toFixed(2)} - {currentPoints.x.toFixed(2)} */}
                            <Text size={12} weight={600} >MER: {selectedCurrentPoint.x ? selectedCurrentPoint.x.toFixed(2) : currentPoints.x.toFixed(2)} </Text>
                            <Text size={12} weight={600} >FTHP: {selectedCurrentPoint.y ? selectedCurrentPoint.y.toFixed(2) : currentPoints.y.toFixed(2)} </Text>
                            <Text size={12} weight={600} >Choke size: {selectedCurrentPoint.y1 ? selectedCurrentPoint.y1.toFixed(2) : currentPoints.y1.toFixed(2)}</Text>
                        </div>
                        <div style={{ width: '100%', height: '100%', flex: 1 }}>
                            <LineChart
                                key={`${chartWidth}-${chartHeight}`}
                                xStepsize={10}
                                useCrosshair={true}
                                xScaleType={'linear'}
                                onHover={getHoveredPoints}
                                onClick={(x, y, y1) => {
                                    setSelectedCurrentPoint({ x, y, y1 })
                                    onPointClick(x, y, y1, current)
                                }}
                                datasets={[fthpDataset, chokeSizeDataset]}
                                labels={graphData.map(item => parseFloat(item?.oilRate))}
                                width={chartWidth}
                                height={chartHeight}

                            />
                        </div>

                    </div>
                </ResizableBox>
            </Draggable>
        </>
    )
}

export default MerChart










