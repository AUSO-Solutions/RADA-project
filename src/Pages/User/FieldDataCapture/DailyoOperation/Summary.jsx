import RadaTable from 'Components/RadaTable'
import React, { useMemo, useState, useEffect } from 'react'
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Text from 'Components/Text';
import { Close } from '@mui/icons-material';
import { useFetch } from 'hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { setSetupData } from 'Store/slices/setupSlice';
import { Button, Input } from 'Components';
import dayjs from 'dayjs';
import { useAssetByName } from 'hooks/useAssetByName';
import { useAssetNames } from 'hooks/useAssetNames';
import BroadCast from 'Partials/BroadCast';
import Attachment from 'Partials/BroadCast/Attachment';
import SelectGroup from 'Partials/BroadCast/SelectGroup';
import BroadCastSuccessfull from 'Partials/BroadCast/BroadCastSuccessfull';
import { openModal } from 'Store/slices/modalSlice';
import { useLocation, useSearchParams } from 'react-router-dom';
import { bsw, roundUp, sum } from 'utils';
import { firebaseFunctions } from 'Services';
import { useMe } from 'hooks/useMe';
import RadioSelect from './RadioSelect';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";
import DateRangePicker from 'Components/DatePicker';

ChartJS.register(ArcElement, Tooltip, Legend);

const createOpt = item => ({ label: item, value: item })
const Summary = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname, search } = useLocation()
  const setupData = useSelector(state => state?.setup)
  const res = useFetch({
    firebaseFunction: 'getInsights', payload: {
      asset: setupData?.asset,
      flowstation: setupData?.flowstation,
      startDate: setupData?.startDate,
      endDate: setupData?.endDate
    },
    refetch: setupData
  });
  const dispatch = useDispatch()
  const { user } = useMe()
  const tableData = useMemo(() => {
    return res?.data?.length ? JSON.parse(res?.data) : {}
  }, [res])
  // console.log("data for chart", tableData)
  const assets = useAssetByName(setupData?.asset)
  const { assetNames } = useAssetNames()
  const [showChart, setShowChart] = useState(false);
  // const switches = ['Oil/Condensate', 'Gas'];
  const [curr, setCurr] = useState({})
  const [chCurr, setChCurr] = useState({})

  const [notes, setNotes] = useState({
    liquid: [], gas: []
  })
  // console.log(curr)
  const [chartWidth, setChartWidth] = useState(400);
  const [chartHeight, setChartHeight] = useState(350);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const { data: liquidData } = await firebaseFunctions('getOilOrCondensateVolumeByDateAndAsset', { asset: setupData?.asset, date: setupData?.startDate }, false, { loadingScreen: false })
        const { data: gasData } = await firebaseFunctions('getGasVolumeByDateAndAsset', { asset: setupData?.asset, date: setupData?.startDate }, false, { loadingScreen: false })
        // console.log("chartData",liquidData, gasData)
        const liquid = liquidData.flowstations.map(flowstation => (
          { flowstation: flowstation?.name, highlight: flowstation.highlight }
        ))
        const gas = gasData.flowstations.map(flowstation => ({
          flowstation: flowstation?.name, highlight: flowstation.highlight
        }))
        console.log({ gas, liquid })
        setNotes({ gas, liquid })

      } catch (error) {
        setNotes({ gas: [], liquid: [] })
      }
    }
    if (setupData?.asset && setupData?.startDate) getNotes()

  }, [setupData?.asset, setupData?.startDate])
  const values = useMemo(() => {
    return [
      { name: "Gross Liquid (bbls/day)", target: roundUp(parseFloat(tableData.grossTarget || 0)), actual: roundUp(parseFloat(tableData.grossProduction || 0)) },
      { name: "BS&W (%)", target: bsw({ gross: tableData.grossTarget, oil: tableData.oilTarget }), actual: bsw({ gross: tableData.grossProduction, oil: tableData.oilProduced }) },
      { name: "Net Oil (bbls/day)", target: roundUp(parseFloat(tableData.oilTarget || 0)), actual: roundUp(parseFloat(tableData.oilProduced || 0)) },
      { name: "Produced Gas (mmscf)", target: roundUp(parseFloat(tableData.gasProducedTarget || 0)), actual: roundUp(parseFloat(tableData.gasProduced || 0)) },
      { name: "Export Gas (mmscf)", target: roundUp(parseFloat(tableData.exportGasTarget || 0)), actual: roundUp(parseFloat(tableData.gasExported || 0)) },
      { name: "Fuel Gas Consumed (mmscf)", target: roundUp(parseFloat(tableData.gasUtilizedTarget || 0)), actual: roundUp(parseFloat(tableData.gasUtilized || 0)) },
      { name: "Flare Gas (mmscf)", target: roundUp(parseFloat(tableData.gasFlaredTarget || 0)), actual: roundUp(parseFloat(tableData.gasFlared || 0)) },
      // { name: "Condensate Produced (bbls)" },
      // { name: "Barged Crude (bbls)" },
      // { name: "Export Gas (BOE)" },
      // { name: "Total bopd + BOE" },
      // { name: "Condensate Shipped (bbls)" },
      // { name: "Cumulative Offtake (bbls)" },

    ]
  }, [tableData])

  const dailyChartData = useMemo(() => {
    let day = dayjs(setupData?.startDate).subtract(1, 'day')
    // console.log(tableData?.assetOilProduction)
    const chartData = []
    while (day != dayjs(setupData?.endDate).format('YYYY-MM-DD')) {
      const formattedDay = dayjs(day).add(1, 'day').format('DD/MM/YYYY')
      const oilRes = tableData?.assetOilProduction?.[formattedDay]
      const gasRes = tableData?.assetGasProduction?.[formattedDay]
      const gasProduced = sum([
        parseFloat(gasRes?.["Export Gas"] || 0),
        parseFloat(gasRes?.["Fuel Gas"] || 0),
        parseFloat(gasRes?.["Flared Gas"] || 0)
      ])
      chartData.push({
        ...oilRes, ...gasRes, gasProduced
      })
      day = dayjs(day).add(1, 'day').format('YYYY-MM-DD')
    }
    // console.log(chartData)
    return chartData

  }, [tableData]);

  const chartValues = useMemo(() => {
    const ipscTarget = (tableData?.ipscTarget)
    // console.log(ipscTarget)
    const getTarget = (date, targetKey) => {
      const target__ = ipscTarget?.find(ipscTarget_ => ipscTarget_?.month === `${date?.split("/")[2]}-${date?.split("/")[1]}`)
      // console.log(target__, `${date?.split("/")[2]}-${date?.split("/")[0]}`) 
      return sum(Object.values(target__?.flowstationsTargets || {})?.map(flowstationsTarget => flowstationsTarget?.[targetKey]))
    }

    return [
      {
        name: "Gross Liquid (bbls/day)",
        // target: roundUp(parseFloat(tableData.grossTarget || 0)), actual: roundUp(parseFloat(dailyChartData.gross || 0)),
        chartData: dailyChartData?.map(chartData => ({ actual: chartData?.gross, x: chartData?.x, target: getTarget(chartData?.x, 'gross') }))
      },
      {
        name: "BS&W (%)",
        // target: roundUp(parseFloat(dailyChartData.bsw || 0)), actual: roundUp(parseFloat(dailyChartData.bsw || 0)),
        chartData: dailyChartData?.map(chartData => ({
          actual: chartData?.bsw, x: chartData?.x, target: bsw({
            oil: getTarget(chartData?.x, 'oilRate'),
            gross: getTarget(chartData?.x, 'gross')
          })
        }))
      },

      {
        name: "Net Oil (bbls/day)",
        // target: roundUp(parseFloat(tableData.oilTarget || 0)), actual: roundUp(parseFloat(dailyChartData.oil || 0)),
        chartData: dailyChartData?.map(chartData => ({ actual: chartData?.oil, x: chartData?.x, target: getTarget(chartData?.x, 'oilRate') }))
      },
      {
        name: "Produced Gas (mmscf)",
        // target: roundUp(parseFloat(tableData.gasProducedTarget || 0)), actual: roundUp(parseFloat(dailyChartData.gasProduced || 0)),
        chartData: dailyChartData?.map(chartData => ({
          actual: chartData?.gasProduced, x: chartData?.x,
          target: sum([getTarget(chartData?.x, 'exportGas'), getTarget(chartData?.x, 'fuelGas'), getTarget(chartData?.x, 'gasFlaredUSM')])
        }))
      },
      {
        name: "Export Gas (mmscf)",
        // target: roundUp(parseFloat(tableData.exportGasTarget || 0)), actual: roundUp(parseFloat(tableData['Export Gas'] || 0)),
        chartData: dailyChartData?.map(chartData => ({ actual: chartData?.["Export Gas"], x: chartData?.x, target: getTarget(chartData?.x, 'exportGas') }))
      },
      {
        name: "Fuel Gas Consumed (mmscf)",
        // target: roundUp(parseFloat(tableData.gasUtilizedTarget || 0)), actual: roundUp(parseFloat(tableData['Fuel Gas'] || 0)),
        chartData: dailyChartData?.map(chartData => ({ actual: chartData?.["Fuel Gas"], x: chartData?.x, target: getTarget(chartData?.x, 'fuelGas') }))
      },
      {
        name: "Flare Gas (mmscf)",
        // target: roundUp(parseFloat(tableData.gasFlaredTarget || 0)), actual: roundUp(parseFloat(tableData['Flared Gas'] || 0)),
        chartData: dailyChartData?.map(chartData => ({ actual: chartData?.["Flared Gas"], x: chartData?.x, target: getTarget(chartData?.x, 'gasFlaredUSM') }))
      },
    ]
    // return []
  }, [tableData, dailyChartData])

  // console.log(chartValues)
  const data = useMemo(() => {
    const selectedChartData = chartValues?.find(({ name }) => name === chCurr?.name)
    console.log(selectedChartData)
    // let datasets = selectedChartData?.chartData?.map(dayData => dayData.actual)
    // console.log(datasets)
    return {
      labels: selectedChartData?.chartData?.map(data => data.x),
      datasets: [
       
        {
          label: `Actual: ${chCurr?.name}`,
          data: selectedChartData?.chartData?.map(dayData => dayData.actual || 0),
          backgroundColor: [
            "#D31E1E",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,

          stack: 'actual'
        },
        {
          label: `Target: ${chCurr?.name}`,
          data: selectedChartData?.chartData?.map(dayData => dayData.target || 0),
          backgroundColor: [
            "#29A2CC",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
          stack: 'Target'
        },
      ]
    }
  }, [chCurr, chartValues]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        padding: 50,
        labels: {
          font: {
            size: 12,
            family: "'Arial', sans-serif",
            weight: "normal",
          },
          color: "#333",
          boxWidth: 12,
          padding: 20,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
    },

  };

  const highlightTypes = ['Production', 'Maintenance', 'Operation']

  useEffect(() => {
    // console.log(searchParams)
    const asset = searchParams.get('asset') || assetNames?.[0]
    const flowstation = searchParams.get('flowstation') || ""
    const startDate = searchParams.get('startDate') || dayjs().subtract(1, "day").format('YYYY-MM-DD')
    const endDate = searchParams.get('endDate') || dayjs().subtract(1, "day").format('YYYY-MM-DD')
    // console.log({ asset, flowstation, startDate, endDate })
    dispatch(setSetupData({ name: 'asset', value: asset }))
    dispatch(setSetupData({ name: 'flowstation', value: flowstation }))
    dispatch(setSetupData({ name: 'startDate', value: startDate }))
    dispatch(setSetupData({ name: 'endDate', value: endDate }))
  }, [searchParams, dispatch, assetNames])



  // console.log("ooopppp",dailyChartData)

  const [currentHighlight, setCurrentHighlight] = useState({
    volumeType: "Gas",
    flowstation: "",
    highlightType: ""
  })
  const currentNote = useMemo(() => {
    const result = notes?.[currentHighlight.volumeType.toLowerCase()]?.find(note => note?.flowstation === currentHighlight.flowstation)?.highlight?.[currentHighlight.highlightType?.toLowerCase()]
    if (!result) return "No highlight!"
    return result

  }, [currentHighlight.flowstation, currentHighlight.highlightType, currentHighlight.volumeType, notes])
  return (
    <div className='relative !z-[1000] ' >
      <div className='w-full flex flex-row justify-between p-4' >
        <div onClick={() => setShowChart(!showChart)} className='w-[100px] h-[40px] bg-[#FAFAFA] cursor-pointer rounded-2xl border-2 flex items-center gap-2 justify-center' >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19 19H5V5H19V19.1M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#4E4E4E" />
          </svg>

          Chart
        </div>
        {/* <div className='border-2 border-[#FAFAFA] flex items-center justify-center px-3 rounded-lg' >27-June-2024</div> */}
        <div className='flex items-center gap-2'>

          <div style={{ width: '120px' }} >
            <Input placeholder={'Assets'} required
              // defaultValue={{}}
              type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
              onChange={(e) => {
                // dispatch(setSetupData({ name: 'asset', value: e?.value }))
                // dispatch(setSetupData({ name: 'flowstation', value: '' }))
                setSearchParams(prev => {
                  prev.set('asset', e?.value)
                  prev.delete('flowstation')
                  return prev
                })
              }}
              value={{ value: setupData?.asset, label: setupData?.asset }}
            />
          </div>
          <div style={{ width: '150px' }}>
            <Input key={setupData?.asset} placeholder={'Flow Stations'} required
              type='select' options={[{ label: 'All', value: '' }].concat(assets.flowStations?.map(createOpt))}
              onChange={(e) => {
                // dispatch(setSetupData({ name: 'flowstation', value: e?.value }))
                setSearchParams(prev => {
                  prev.set('flowstation', e?.value)
                  // if (e?.value) prev.delete('flowstation')
                  return prev
                })
              }}
            />
          </div>
          <div  >
            {/* <input type="date" name="" className='border p-2  rounded-[12px]' id="" value={setupData?.startDate} onChange={e => {
              setSearchParams(prev => {
                prev.set('startDate', dayjs(e.target.value).format('YYYY-MM-DD'))
                prev.set('endDate', dayjs(e.target.value).format('YYYY-MM-DD'))
                return prev
              })
            }} /> */}
            <DateRangePicker
              startDate={setupData?.startDate}
              endDate={setupData?.endDate}
              // value={setupData?.startDate}
              onChange={e =>
              // {
              // dispatch(setSetupData({ name: 'startDate', value: dayjs(e?.startDate).format('YYYY-MM-DD') }))
              // dispatch(setSetupData({ name: 'endDate', value: dayjs(e?.endDate).format('YYYY-MM-DD') }))
              {
                setSearchParams(prev => {
                  prev.set('startDate', dayjs(e.startDate).format('YYYY-MM-DD'))
                  prev.set('endDate', dayjs(e.endDate).format('YYYY-MM-DD'))
                  return prev
                })
              }} />
          </div>
          {
            (user.permitted.broadcastData || user.permitted.shareData) &&
            <Button onClick={(file) => dispatch(openModal({
              title: '',
              component: <BroadCast
                setup={setupData}
                link={pathname + search}
                broadcastType={'dailyProduction'}
                type={'Daily Production/Operation Report '}
                date={dayjs(setupData?.startDate).format('DD/MMM/YYYY')}
                title='Broadcast Volume measurement'
                subject={`${setupData?.asset} Daily Production/Operation Report ${dayjs(setupData?.startDate).format('DD/MMM/YYYY')}`}
                steps={['Select Group', 'Attachment', 'Broadcast']}
                stepsComponents={[
                  <SelectGroup />,
                  <Attachment details={`${setupData?.asset} Daily Production/Operation Report ${dayjs(setupData?.startDate).format('DD/MMM/YYYY')}`} />,
                  <BroadCastSuccessfull details={`${setupData?.asset} Daily Production/Operation Report ${dayjs(setupData?.startDate).format('DD/MMM/YYYY')}`} />]} />
            }))}>
              {user.permitted.broadcastData ? 'Broadcast' : "Share"}
            </Button>


          }
        </div>
      </div>
      {showChart && (
        <Draggable
          cancel=".react-resizable-handle"
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
            style={{ position: 'fixed', bottom: 100, right: 10, zIndex: 1000 }}
          >
            <div className='p-3' style={{ display: 'flex', cursor: 'move', flexDirection: 'column', backgroundColor: '#fff', width: '100%', height: 'auto', borderRadius: 5, boxShadow: '2px 1px 5px  #242424' }}>
              <div style={{ margin: "10 0", paddingRight: 20, paddingLeft: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text weight={700} size={'16px'} > <Input type='select' onChange={(e) => setChCurr(chartValues.find(value => value.name === e.value))} containerClass={'!w-[200px]'} options={chartValues.map(value => ({ label: value.name, value: value.name }))} /></Text>
                <Close style={{ cursor: 'pointer' }} onClick={() => setShowChart(false)} />
              </div>

              {/* <div className=' ml-5 mt-5 '> */}
              {/* <RadioSelect list={switches}

/> */}
              {/* <Input type='select' containerClass={'!w-[200px]'} options={values.map(value=>({label:value.name,value:value.name}))}/> */}
              {/* </div> */}

              {/* <div style={{ height: '100%', width: '100%', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', }} > */}
              {chCurr?.name && <Bar
                key={`${chartWidth}-${chartHeight}`}
                data={data} options={options}
                width={chartWidth} height={chartHeight}
              />}
              {/* </div> */}

            </div>
          </ResizableBox>
        </Draggable>


      )}


      <div className='mt-5' >
        <RadaTable noaction noNumbers noSearch headBgColor='#FAFAFA'
          // firebaseApi='getGroups'
          columns={[
            { name: 'Item', key: "name" },
            {
              name: 'Target', key: 'target'
            },
            {
              name: 'Actual', key: 'actual'
            },
            {
              name: 'Remarks', key: 'remarks'
            },
          ]}
          data={values} />



      </div>

      <div className=' border flex rounded m-2 !min-h-[300px]'>
        <div className='w-[20%] border-r p-2'>
          <Text weight={600} size={16}> Highlights   </Text>
          <RadioSelect list={['Gas', 'Liquid']} defaultValue={currentHighlight.volumeType} onChange={(e) => setCurrentHighlight(prev => ({ ...prev, volumeType: e }))} />
          <Input type='select' placeholder='Select flowstation' options={notes.gas.map(note => ({ label: note.flowstation, value: note?.flowstation }))} containerClass={'w-[100px]'} onChange={(e) => setCurrentHighlight(prev => ({ ...prev, flowstation: e.value }))} />
          <Input type='select' placeholder='Select highlight type' options={highlightTypes.map(highlightType => ({ label: highlightType, value: highlightType }))} containerClass={'w-[100px] mt-4'} onChange={(e) => setCurrentHighlight(prev => ({ ...prev, highlightType: e.value }))} />
        </div>
        <div className='w-[80%] p-2'>
          <Text weight={600} size={16}> {currentHighlight.highlightType} highlight for {currentHighlight.flowstation}({currentHighlight.volumeType}) :</Text> <br />
          {<div dangerouslySetInnerHTML={{ __html: currentNote }} />}
          {/* {currentHighlight.volumeType === 'Gas' && <div>
            {notes?.gas?.map(note => (
              <div>
                <Text weight={600} > {note.flowstation}  </Text>
                <div> <Text weight={500}> Production Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.production || "N/A" }} />}</div>
                <div> <Text weight={500}>Operation Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.operation || "N/A" }} />}</div>
                <div> <Text weight={500}> Maintenance Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.maintenance }} /> || "N/A"}</div>
              </div>
            ))}
          </div>}
          {currentHighlight.volumeType === 'Liquid' && <div>
            {notes?.liquid?.map(note => (
              <div>
                <Text weight={600} > {note.flowstation}  </Text>
                <div> <Text weight={500}> Production Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.production || "N/A" }} />}</div>
                <div> <Text weight={500}>Operation Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.operation || "N/A" }} />}</div>
                <div> <Text weight={500}> Maintenance Highlight</Text> : {<div dangerouslySetInnerHTML={{ __html: note?.highlight?.maintenance }} /> || "N/A"}</div>
              </div>
            ))}
          </div>} */}
        </div>


      </div>
      {/* <img src='https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/radaNewLogoo.svg?alt=media&token=e3249009-d0c3-497f-8b2a-873988ad9355' alt='?media&token=475ebfb1-9f96-4b2d-b7f0-12390171a51' /> */}
      {/* https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/radaNewLogoo.svg?alt=media&token=e3249009-d0c3-497f-8b2a-873988ad9355 */}





    </div>
  )
}

export default Summary