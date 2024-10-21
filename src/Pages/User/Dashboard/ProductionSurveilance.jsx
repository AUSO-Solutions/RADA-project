import React, { useMemo } from 'react'
import { useFetch } from 'hooks/useFetch'
import { useSelector } from 'react-redux'
import LineChart from './Line'

const ProductionSurveilance = () => {
  const setupData = useSelector(state => state?.setup)
  const { data } = useFetch({ firebaseFunction: 'getSurveillanceData', payload: { asset: setupData?.asset, flowstation: setupData?.flowstation }, refetch: setupData })
  const result = useMemo(() => {
    const x = data.length ? JSON.parse(data) : []
    let y = []
    if (setupData?.productionString) {
      y = (x?.productionStrings?.[setupData?.productionString])
    } else {
      y = (x?.flowStationData)
    }
    return y
  }, [data, setupData?.productionString])
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
        label: "Liquid Produced (blpd)",
        axisname: 'Liquid Produced',
        data: liquidOilData?.map((datum) => datum?.liquid),
        borderColor: "#280eb4",
        borderWidth: 3, pointRadius: .5
      },
      {
        label: "Oil Produced (bopd)",
        axisname: 'Oil Produced',
        data: liquidOilData?.map((datum) => datum?.oil),
        borderColor: "#e85912",
        borderWidth: 3, pointRadius: .5
      },
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
        borderWidth: 3, pointRadius: .5
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
        borderWidth: 3, pointRadius: .5
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
        data: data?.map((item, i) => item?.gor),
        borderColor: "#91ff69",
        borderWidth: 3, pointRadius: .5
      },
      {
        label: "Water (%)",
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

  return (
    <div className='p-3 flex flex-wrap gap-3 w-full '>
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
        {<LineChart labels={graphs.gorWatercut.labels} datasets={graphs?.gorWatercut?.dataset} />}
      </div>
    </div>
  )
}

export default ProductionSurveilance