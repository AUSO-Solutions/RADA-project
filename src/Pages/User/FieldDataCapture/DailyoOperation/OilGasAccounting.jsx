import React, { useMemo } from 'react'
import Setup from './setup'
import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'Components'
import { setSetupData } from 'Store/slices/setupSlice'
import CheckInput from 'Components/Input/CheckInput'
import { useAssetByName } from 'hooks/useAssetByName'
import Text from 'Components/Text'
import { FaCheck } from 'react-icons/fa'
import OilGasAccountingTable from './OilGasAccountingTable'
 



const SelectAsset = () => {
  const { assetNames } = useAssetNames()
  const setupData = useSelector(state => state.setup)
  const dispatch = useDispatch()
  return <>
    <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
      label={'Assets'} type='select'
      options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
      onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
  </>
}


const DefineReport = ({ asset, }) => {
  const dispatch = useDispatch()
  const setupData = useSelector(state => state.setup)
  const timeFrames = ["Daily", "Weekly", "Monthly"]
  const reportTypes = useMemo(() => {
    return [
      { value: 'Pressures', label: 'Pressures' },
      { value: 'Separator Static', label: 'Separator Static' },
      { value: 'Choke', label: 'Choke' },
      { value: 'Closed-In Tubing Head Pressure', label: 'Closed-In Tubing Head Pressure' },
    ]
  }, [setupData?.reportTypes])
  const handleCheck = (name, event) => {
    const checked = event.target.checked
    let selectedReportTypes = setupData?.reportTypes || []
    if (checked) {
      selectedReportTypes = Array.from(new Set([...selectedReportTypes, name]))
    } else {
      selectedReportTypes = selectedReportTypes.filter(reportType => reportType !== name)
    }
    dispatch(setSetupData({ name: 'reportTypes', value: selectedReportTypes }))
  }

  const checkAll = (e) => {
    const checked = e.target.checked
    dispatch(setSetupData({ name: 'reportTypes', value: [] }))
    if (checked) dispatch(setSetupData({ name: 'reportTypes', value: reportTypes.filter(reportType => reportType.value !== 'All').map(reportType => reportType.value) }))
  }
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} defaultValue={asset} disabled />
      {/* <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
        defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
        onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
        options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} /> */}
    </div>

    <div key={setupData?.reportTypes?.length} className='flex flex-col mt-[24px] rounded-[8px] gap-[24px] border'>
      <div className='flex border-b px-3'>
        <CheckInput defaultChecked={setupData?.reportTypes?.length === reportTypes.length} onChange={(e) => checkAll(e)} label={'Well Test Parameters'} />

      </div>
      {
        reportTypes.map(repoortType => <div className='flex border-b px-3'>
          <CheckInput defaultChecked={setupData?.reportTypes?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
        </div>)
      }
    </div>

  </>
}
const Preview = () => {
  const setupData = useSelector(state => state.setup)
  // const { flowStations } = useAssetByName(setupData?.asset)
  const reportTypes = useMemo(() => {
    return [
      { value: 'Pressures', label: 'Pressures' },
      { value: 'Separator Static', label: 'Separator Static' },
      { value: 'Choke', label: 'Choke' },
      { value: 'Closed-In Tubing Head Pressure', label: 'Closed-In Tubing Head Pressure' },
    ]
  }, [setupData?.reportTypes])
  return <>
    <div className='border flex gap-4 flex-col mt-3 !rounded-[8px]'>
      <div className='flex gap-3 border-b p-3'>
        {/* <FaCheck color='rgba(0, 163, 255, 1)' className='opacity-0' /> */}
        <Text weight={600} size={"16px"} className={'pl-[30px] '}>Well Test Data</Text>
        {/* <Text weight={600} size={"16px"}>Number of Meters</Text> */}
      </div>
      {
        reportTypes.map((reportType, i) => {
          return (
            <div className={`flex items-center ${reportTypes.length === i + 1 ? "" : "border-b"} gap-4 p-3`}>
              <FaCheck color='rgba(0, 163, 255, 1)' />
              <Text>{reportType.label}</Text>
            </div>
          )
        })
      }
    </div>
  </>
}

const OilGasAccounting = () => {

  const [setupDone, setSetupDone] = useState(false)
  const dispatch = useDispatch()

  const save = async () => {
    const setupData = store.getState().setup
    console.log(setupData)
    dispatch(closeModal())
    setSetupDone(true)

    // await firebaseFunctions("")
  }

  const handleChange = () => {

  }
  return (
    <>
    {
    setupDone ?
    <OilGasAccountingTable />
    :
      <Setup
        title={'Setup Oil & Gas Accounting Parameters'}
        steps={["Select Well Test Data", "Define Report", "Preview"]}

        stepComponents={[
          <SelectAsset getAsset={(asset) => handleChange('asset', asset)} />,
          <DefineReport />,<Preview  />
        ]} 
        
        onSave={save}
        />
      }
    </>
  )
}

export default OilGasAccounting