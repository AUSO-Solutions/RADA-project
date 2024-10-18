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
import RadioSelect from './RadioSelect';
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
import { bsw } from 'utils';

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

  const tableData = useMemo(() => {
    return res?.data?.length ? JSON.parse(res?.data) : {}
  }, [res])
  // console.log(tableData)
  const assets = useAssetByName(setupData?.asset)
  const { assetNames } = useAssetNames()
  const [showChart, setShowChart] = useState(false);
  const switches = ['Oil/Condensate', 'Gas'];

  const data = {
    labels: ["Produced Gas", "Export Gas", "Flared Gas"],
    datasets: [
      {
        label: "Gas Distribution",
        data: [800, 390, 510],
        backgroundColor: [
          "#29A2CC",
          "#D31E1E",
          "#FFDE2E"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

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
        }
      },
    },

  };



  useEffect(() => {
    // console.log(searchParams)
    const asset = searchParams.get('asset')
    const flowstation = searchParams.get('flowstation')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    // console.log({ asset, flowstation, startDate, endDate })
    dispatch(setSetupData({ name: 'asset', value: asset }))
    dispatch(setSetupData({ name: 'flowstation', value: flowstation }))
    dispatch(setSetupData({ name: 'startDate', value: startDate }))
    dispatch(setSetupData({ name: 'endDate', value: endDate }))
  }, [searchParams, dispatch])

  return (
    <div className='relative' >
      <div className='w-full flex flex-row justify-between px-10 mt-3' >
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
              defaultValue={{ value: setupData?.asset, label: setupData?.asset }}
            />
          </div>
          <div style={{ width: '150px' }}>
            <Input isClearable key={setupData?.asset} placeholder={'Flow Stations'} required
              type='select' options={assets.flowStations?.map(createOpt)}
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
            <input type="date" name="" className='border p-2  rounded-[12px]' id="" onChange={e => {
              console.log(e.target.value)
              setSearchParams(prev => {
                prev.set('startDate', dayjs(e.target.value).format('MM/DD/YYYY'))
                prev.set('endDate', dayjs(e.target.value).format('MM/DD/YYYY'))
                return prev
              })
            }} />
          
          </div>
          <Button onClick={(file) => dispatch(openModal({
            title: '',
            component: <BroadCast
              link={pathname + search}
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
            Broadcast
          </Button>
        </div>
      </div>


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

          data={[
            { name: "Gross Liquid (bbls/day)", target: parseFloat(tableData.grossTarget || 0).toFixed(3), actual: parseFloat(tableData.grossProduction || 0).toFixed(3) },
            { name: "BS&W (%)", target: bsw({ gross: tableData.grossTarget, oil: tableData.oilTarget }), actual: bsw({ gross: tableData.grossProduction, oil: tableData.oilProduced }) },
            { name: "Net Oil (bbls/day)", target: parseFloat(tableData.oilTarget || 0).toFixed(3), actual: parseFloat(tableData.oilProduced || 0).toFixed(3) },
            { name: "Produced Gas (mmscf)", target: parseFloat(tableData.gasProducedTarget || 0).toFixed(3), actual: parseFloat(tableData.gasProduced || 0).toFixed(3) },
            { name: "Export Gas (mmscf)", target: parseFloat(tableData.exportGasTarget || 0).toFixed(3), actual: parseFloat(tableData.gasExported || 0).toFixed(3) },
            { name: "Fuel Gas Consumed (mmscf)", target: parseFloat(tableData.gasUtilizedTarget || 0).toFixed(3), actual: parseFloat(tableData.gasUtilized || 0).toFixed(3) },
            { name: "Flare Gas (mmscf)", target: parseFloat(tableData.gasFlaredTarget || 0).toFixed(3), actual: parseFloat(tableData.gasFlared || 0).toFixed(3) },
            // { name: "Condensate Produced (bbls)" },
            // { name: "Barged Crude (bbls)" },
            // { name: "Export Gas (BOE)" },
            // { name: "Total bopd + BOE" },
            // { name: "Condensate Shipped (bbls)" },
            // { name: "Cumulative Offtake (bbls)" },

          ]} />


      </div>


      {showChart && (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', position: 'absolute', top: 0, right: 10, width: '45%', height: '90%', borderRadius: 5, boxShadow: '2px 1px 5px  #242424' }}>
          <div style={{ marginTop: 30, paddingRight: 20, paddingLeft: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text weight={700} size={'16px'} >Chart</Text>
            <Close style={{ cursor: 'pointer' }} onClick={() => setShowChart(false)} />
          </div>

          <div className=' ml-5 mt-5 '>
            <RadioSelect list={switches}
            // defaultValue={tables.find(table => searchParams.get('table') === table.replaceAll(' ', '-').toLowerCase()) || tables[0]} 
            // onChange={(value) => setSearchParams(prev => {
            //     prev.set('table', value.replaceAll(' ', '-').toLowerCase())
            //     return prev
            // })} 
            />
          </div>

          <div style={{ height: '100%', width: '100%', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
            <Bar data={data} options={options} />
          </div>

        </div>
      )}


    </div>
  )
}

export default Summary