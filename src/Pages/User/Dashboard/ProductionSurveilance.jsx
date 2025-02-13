import React, { useEffect, useMemo } from 'react'
import { useFetch } from 'hooks/useFetch'
import { useDispatch, useSelector } from 'react-redux'
import LineChart from './Line'
import { setSetupData } from 'Store/slices/setupSlice'
import { sum } from 'utils'
// import { Line2 } from './Line2'

const ProductionSurveilance = ({ assetOptions }) => {
  const setupData = useSelector(state => state?.setup)
  const dispatch = useDispatch()
  useEffect(() => {

    dispatch(setSetupData({ name: "asset", value: assetOptions[0]?.value }))
    // return () => {
    //   dispatch(clearSetup())
    // }
  }, [dispatch, assetOptions])
  const { data } = useFetch({ firebaseFunction: 'getSurveillanceData', payload: { asset: setupData?.asset, flowstation: setupData?.flowstation }, refetch: setupData })
  const result = useMemo(() => {
    const x = data?.length ? JSON.parse(data) : []
    console.log({ x })
    let y = []
    if (setupData?.productionString && setupData?.flowstation) {
      y = (x?.productionStrings?.[setupData?.productionString])
    } else {
      // only on asset level
      const dates = Array.from(new Set(x?.flowStationData?.map(item => item?.date)))
      const compiledFlowstations = (dates?.map(date => {
        const collation = x?.flowStationData?.filter(item => item?.date === date)
        return {
          gas: sum(collation?.map(item => item?.gas)),
          gross: sum(collation?.map(item => item?.gross)),
          water: sum(collation?.map(item => item?.water)),
          oil: sum(collation?.map(item => item?.oil)),
          // waterCut: sum(collation?.map(item => item?.waterCut)), 
          waterCut: (sum(collation?.map(item => item?.water)) / sum(collation?.map(item => item?.gross))) * 100, // because its in percentage
          date,
          gor: (sum(collation?.map(item => item?.gas)) * 10000000) / sum(collation?.map(item => item?.oil)),
        }

      }))
      y = (compiledFlowstations)
    }

    return y
  }, [data, setupData])
  const graphs = useMemo(() => {
    const data = result

    const labels = data?.map((item, i) => item?.date)
    // console.log({result})
    const liquidOilData = data?.map((item, i) => ({ liquid: item?.gross, oil: item?.oil }))
    const oilDataset = {
      label: "Oil Produced (bopd)",
      axisname: 'Oil Produced',
      data: liquidOilData?.map((datum) => datum?.oil),
      borderColor: "#e85912",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y',
      // fill: {
      //   target: "origin",
      //   above: "#e8591270"
      // }
    }
    const liquidDataset = {
      label: "Liquid Produced (blpd)",
      axisname: 'Liquid Produced',
      data: liquidOilData?.map((datum) => datum?.liquid),
      borderColor: "#280eb4",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y',
      // fill: {
      //   target: "origin",
      //   above: "#280eb470"
      // }
    }
    const dailyGasDataset = {
      label: "Gas Produced (MMscf)",
      data: data?.map((item, i) => item?.gas),
      borderColor: "#319112",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y'
    }
    const gorDataset = {
      label: "GOR (scf/std)",
      yAxisID: 'y',
      data: data?.map((item, i) => item?.gor),
      borderColor: "#91ff69",
      borderWidth: 3, pointRadius: .5
    }
    const waterCutDataset = {
      label: "Water Cut (%)",
      yAxisID: 'y',
      data: data?.map((item, i) => (item?.waterCut)),
      borderColor: "#280eb4",
      borderWidth: 3, pointRadius: .5,
    }
    const waterProducedDataset = {
      label: "Water Produced (bwpd)",
      data: data?.map((item, i) => item?.water),
      borderColor: "#558ce6",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y1',
    }
    const fthpDataset = {
      label: "FTHP (psia)",
      data: data?.map((item, i) => item?.fthp),
      borderColor: "black",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y',
    }
    const chokeSizeDataset = {
      label: "Chok Size (/64)",
      data: data?.map((item, i) => item?.chokeSize),
      borderColor: "purple",
      borderWidth: 3, pointRadius: .5,
      yAxisID: 'y1',
    }
    if (setupData?.productionString) dailyGasDataset.yAxisID = 'y1'
    if (!setupData?.productionString) dailyGasDataset.yAxisID = 'y'
    const liquidOilDatasets = setupData?.productionString ? [oilDataset, liquidDataset, dailyGasDataset] : [oilDataset, liquidDataset]
    const liquidOil = {
      dataset: liquidOilDatasets,
      labels
    }
    const dailyGas = {
      dataset: [dailyGasDataset],
      labels
    }
    const gor = {
      dataset: [gorDataset],
      labels
    }
    const waterDataset = [waterCutDataset, waterProducedDataset]
    const water = {
      dataset: waterDataset,
      labels
    }

    const fthpChoke = {
      dataset: [fthpDataset, chokeSizeDataset],
      labels
    }

    return {
      liquidOil, dailyGas, gor, water, fthpChoke
    }
  }, [result, setupData?.productionString])
  // console.log(graphs)
  // console.log(graphs.dailyGas)
  return (
    <div className='p-3 flex flex-wrap gap-3 w-full '>
      {/* <Line2 labels={graphs.liquidOil.labels} datasets={graphs?.liquidOil?.dataset}  /> */}
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart useCrosshair={false} labels={graphs.liquidOil.labels} datasets={graphs?.liquidOil?.dataset} />}
      </div>
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart useCrosshair={false} labels={graphs.water.labels} datasets={graphs?.water?.dataset} range={{ y: { max: 100, min: 0, } }} />}
      </div>
      {!setupData?.productionString && <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart useCrosshair={false} labels={graphs.dailyGas.labels} datasets={graphs?.dailyGas?.dataset} />}
      </div>}
      {setupData?.productionString && <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart useCrosshair={false} labels={graphs.fthpChoke.labels} datasets={graphs?.fthpChoke?.dataset} range={{ y1: { max: 64, min: 0, } }} />}
      </div>}
      <div className='w-[48%] h-[auto] border rounded p-3 '>
        {<LineChart useCrosshair={false} stacked={false} labels={graphs.gor.labels} datasets={graphs?.gor?.dataset} />}
      </div>
    </div>
  )
}

export default ProductionSurveilance