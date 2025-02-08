import React, { useMemo, useState } from 'react'
import Overview from './Overview'
import BusinessIntelligence from './BusinessIntelligence'
import Tab from 'Components/tab'
import Header from 'Components/header'
import dayjs from 'dayjs'
// import { LuListFilter } from "react-icons/lu";
// import { IoIosArrowDown } from "react-icons/io";
import { Input } from 'Components'
import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { useAssetByName } from 'hooks/useAssetByName'
import { setSetupData } from 'Store/slices/setupSlice'
import DateRangePicker from 'Components/DatePicker'
import ProductionSurveilance from './ProductionSurveilance'


const Dashboard = () => {

  const dispatch = useDispatch();
  const createOpt = item => ({ label: item, value: item })
  const [tab, setTab] = useState(0)
  const setupData = useSelector(state => state.setup)
  const assets = useAssetByName(setupData?.asset)
  const { assetNames } = useAssetNames()

  const productionStrings = useMemo(() => {
    const strings = (assets.assetData.filter(data => data.flowStation === setupData?.flowstation)?.map(data => data?.productionString)).map(createOpt)
    return strings
  }, [assets, setupData?.flowstation])

  const assetOptions = useMemo(() => {
    const originalList = assetNames?.map(assetName => ({ value: assetName, label: assetName }))
    if (assetNames.length === 3) return [{ label: 'All', value: '' }].concat(originalList)
    return originalList
  }, [assetNames])


  const tabs = useMemo(() => [
    {
      title: 'Business Intelligence',
      Component: <BusinessIntelligence assetOptions={assetOptions} />
    },
    {
      title: 'Production Surveillance',
      Component: <ProductionSurveilance assetOptions={assetOptions} />
    },
    {
      title: 'Overview',
      Component: <Overview />
    }
  ], [assetOptions])

  return (
    <div className='h-full'>
      <Header name={'Dashboard'} />
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 40, }} >
          < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
            {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setTab(i)} />)}
          </ tabs>
          <div key={tab} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            {
              <>
                {(tabs[tab]?.title === 'Production Surveillance' || tabs[tab]?.title === 'Business Intelligence' || tabs[tab]?.title === 'Overview') &&
                  <>
                    <div style={{ width: '120px' }} >
                      <Input placeholder={'Assets'} required key={assetOptions.length}
                        type='select' options={assetOptions}
                        onChange={(e) => {
                          dispatch(setSetupData({ name: 'asset', value: e?.value }))
                          dispatch(setSetupData({ name: 'flowstation', value: '' }))
                          dispatch(setSetupData({ name: 'productionString', value: '' }))
                        }}
                        defaultValue={assetOptions[0]}
                      />
                    </div>
                    <div style={{ width: '150px' }}>
                      <Input key={setupData?.asset} placeholder={'Flow Stations'} required
                        defaultValue={{ label: 'All', value: '' }}
                        type='select' options={[{ label: 'All', value: '' }].concat(assets.flowStations?.map(createOpt))}
                        onChange={(e) => dispatch(setSetupData({ name: 'flowstation', value: e?.value }))}
                      />
                    </div>
                  </>

                }
                {tabs[tab]?.title === 'Production Surveillance' && <div style={{ width: '150px' }}>
                  <Input key={setupData?.asset} placeholder={'Prod Strings'} required defaultValue={{ label: 'All', value: '' }}
                    type='select' options={[{ label: 'All', value: '' }].concat(productionStrings)}
                    onChange={(e) => dispatch(setSetupData({ name: 'productionString', value: e?.value }))}
                  />
                </div>}
                {tabs[tab]?.title === 'Business Intelligence' && <div  >
                  <DateRangePicker
                    startDate={setupData?.startDate}
                    endDate={setupData?.endDate}
                    onChange={e => {
                      dispatch(setSetupData({ name: 'startDate', value: dayjs(e?.startDate).format('YYYY-MM-DD') }))
                      dispatch(setSetupData({ name: 'endDate', value: dayjs(e?.endDate).format('YYYY-MM-DD') }))
                    }} />
                </div>}
                {tabs[tab]?.title === 'Overview' && <div>
                  <Input placeholder={'Date'} required defaultValue={dayjs().subtract(1, 'day').format('YYYY-MM-DD')}
                    type='date' onChange={(e) => dispatch(setSetupData({ name: 'date', value: e?.target?.value }))}
                  />
                </div>}
              </>
            }
          </div>
        </div>
        {
          tabs[tab].Component
        }


      </div>


    </div>
  )
}

export default Dashboard

