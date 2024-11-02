import React, { useEffect, useMemo } from 'react'
import { useFetch } from 'hooks/useFetch'
import { useDispatch, useSelector } from 'react-redux'
import LineChart from './Line'
import { clearSetup } from 'Store/slices/setupSlice'
import { sum } from 'utils'
// import { Line2 } from './Line2'

const ProductionSurveilance = () => {
  const setupData = useSelector(state => state?.setup)
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(clearSetup())
    }
  }, [dispatch])
  const { data } = useFetch({ firebaseFunction: 'getSurveillanceData', payload: { asset: setupData?.asset, flowstation: setupData?.flowstation }, refetch: setupData })
  const result = useMemo(() => {
    // console.log(setupData)
    const x = data.length ? JSON.parse(data) : []
    console.log(x)
    let y = []
    if (setupData?.productionString && setupData?.flowstation) {
      y = (x?.productionStrings?.[setupData?.productionString])
    } else {
      // const 
      const dates = Array.from(new Set(x?.flowStationData?.map(item => item?.date)))
      const compiledFlowstations = (dates?.map(date => {
        const collation = x?.flowStationData?.filter(item => item?.date === date)
        return {
          gas: sum(collation?.map(item => item?.gas)),
          gross: sum(collation?.map(item => item?.gross)),
          water: sum(collation?.map(item => item?.water)),
          oil: sum(collation?.map(item => item?.oil)),
          waterCut: sum(collation?.map(item => item?.waterCut)),
          date,
          gor: sum(collation?.map(item => item?.date)),
        }

      }))
      y = (compiledFlowstations)
    }
    return y
  }, [data, setupData])
  console.log(result)
  // const createDataset = (set) => {
  //   return set?.map(item => ({
  //     label: item?.label,
  //     data: item?.data,
  //     backgroundColor: [
  //       "rgba(75,192,192,1)",
  //       "&quot;#ecf0f1",
  //       "#50AF95",
  //       "#f3ba2f",
  //       "#2a71d0"
  //     ],
  //     borderColor: "black",
  //     borderWidth: 2
  //   }))
  // }
  const graphs = useMemo(() => {
    const data = result
    const labels = data?.map((item, i) => item?.date)

    const liquidOilData = data?.map((item, i) => ({ liquid: item?.gross, oil: item?.oil }))
    const liquidOilDataset = [
    
      {
        label: "Oil Produced (bopd)",
        axisname: 'Oil Produced',
        data: liquidOilData?.map((datum) => datum?.oil),
        borderColor: "#e85912",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y', 
        fill: {
          target: "origin", 
          above: "#e8591270"
        }
      },
      {
        label: "Liquid Produced (blpd)",
        axisname: 'Liquid Produced',
        data: liquidOilData?.map((datum) => datum?.liquid),
        borderColor: "#280eb4",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y', 
        fill: {
          target: "origin", 
          above: "#280eb470"
        }
      },
      {
        label: "Daily Gas (MMscf)",
        data: data?.map((item, i) => item?.gas),
        borderColor: "#319112",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y1', 
        fill: {
          target: "origin", 
          above: "#31911270"
        }
      }
    ]
    const liquidOil = {
      dataset: liquidOilDataset,
      labels
    }
    const waterProducedDataset = [
      {
        label: "Water Produced (bwpd)",
        data: data?.map((item, i) => item?.water),
        borderColor: "#558ce6",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y',
      }
    ]
    const waterProduced = {
      dataset: waterProducedDataset,
      labels
    }
    const dailyGasDataset = [
      {
        label: "Daily Gas (MMscf)",
        data: data?.map((item, i) => item?.gas),
        borderColor: "#319112",
        borderWidth: 3, pointRadius: .5,
        yAxisID: 'y'
      }
    ]
    const dailyGas = {
      dataset: dailyGasDataset,
      labels
    }

    // const gorWatercutData = data?.map((item, i) => ({ gor: item?.gross, oil: item?.oil }))
    const gorWatercutDataset = [
      {
        label: "GOR (scf/std)",
        yAxisID: 'y',
        data: data?.map((item, i) => item?.gor),
        borderColor: "#91ff69",
        borderWidth: 3, pointRadius: .5
      },
      {
        label: "Water Cut (%)",
        yAxisID: 'y1',
        data: data?.map((item, i) => item?.waterCut),
        borderColor: "#280eb4",
        borderWidth: 3, pointRadius: .5
      },
    ]
    const gorWatercut = {
      dataset: gorWatercutDataset,
      labels
    }
    return {
      liquidOil, waterProduced, dailyGas, gorWatercut
    }
  }, [result])
  // console.log(graphs)
  return (
    <div className='p-3 flex flex-wrap gap-3 w-full '>
      {/* <Line2 labels={graphs.liquidOil.labels} datasets={graphs?.liquidOil?.dataset}  /> */}
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart labels={graphs.liquidOil.labels} datasets={graphs?.liquidOil?.dataset} />}
      </div>
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart labels={graphs.waterProduced.labels} datasets={graphs?.waterProduced?.dataset} />}
      </div>
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart labels={graphs.dailyGas.labels} datasets={graphs?.dailyGas?.dataset} />}
      </div>
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart stacked={false} labels={graphs.gorWatercut.labels} datasets={graphs?.gorWatercut?.dataset} />}
      </div>
    </div>
  )
}

export default ProductionSurveilance