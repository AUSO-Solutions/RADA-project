import React, { useEffect, useMemo, useState } from 'react'
import Overview from './Overview'
import Insights from './BusinessIntelligence'
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

const tabs = [
  {
    title: 'Business Intelligence',
    Component: <Insights />
  },
  {
    title: 'Production Surveillance',
    Component: <ProductionSurveilance />
  },
  {
    title: 'Overview',
    Component: <Overview />
  }
]

const Dashboard = () => {
  const dispatch = useDispatch();
  const createOpt = item => ({ label: item, value: item })
  const [tab, setTab] = useState(0)
  const setupData = useSelector(state => state.setup)
  const assets = useAssetByName(setupData?.asset)
  const { assetNames } = useAssetNames()
  useEffect(() => {
    dispatch(setSetupData({ name: 'asset', value: setupData?.asset || assetNames?.[0] }))
    dispatch(setSetupData({ name: 'startDate', value: (dayjs().startOf('month').format('YYYY-MM-DD')) }))
    dispatch(setSetupData({ name: 'endDate', value: (dayjs().subtract(1, "day").format('YYYY-MM-DD')) }))
  }, [assetNames, dispatch, setupData?.asset])
  const productionStrings = useMemo(() => {
    // console.log(assets.assetData, setupData?.flowstation)
    const strings = (assets.assetData.filter(data => data.flowStation === setupData?.flowstation)?.map(data => data?.productionString)).map(createOpt)
    // console.log(strings)
    return strings
  }, [assets, setupData?.flowstation])
  return (
    <div className='h-full'>
      <Header
        name={'Dashboard'}
      />

      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 40, }} >
          < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
            {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setTab(i)} />)}
          </ tabs>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            {(tabs[tab]?.title === 'Business Intelligence' || tabs[tab].title === 'Production Surveillance') &&
              <>
                <div style={{ width: '120px' }} >
                  <Input placeholder={'Assets'} required
                    type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                    onChange={(e) => {
                      dispatch(setSetupData({ name: 'asset', value: e?.value }))
                      dispatch(setSetupData({ name: 'flowstation', value: '' }))
                    }}
                    defaultValue={{ value: setupData?.asset, label: setupData?.asset }}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <Input key={setupData?.asset} placeholder={'Flow Stations'} required defaultValue={{ label: 'All', value: '' }}
                    type='select' options={[{ label: 'All', value: '' }].concat(assets.flowStations?.map(createOpt))}
                    onChange={(e) => dispatch(setSetupData({ name: 'flowstation', value: e?.value }))}
                  />
                </div>
                {tabs[tab]?.title === 'Production Surveillance' && <div style={{ width: '150px' }}>
                  <Input key={setupData?.asset} placeholder={'Prod Strings'} required defaultValue={{ label: 'All', value: '' }}
                    type='select' options={[{ label: 'All', value: '' }].concat(productionStrings)}
                    onChange={(e) => dispatch(setSetupData({ name: 'productionString', value: e?.value }))}
                  />
                </div>}
                {tabs[tab]?.title === 'Business Intelligence' && <div  >
                  {/* {setupData?.startDate} -- {setupData?.endDate} */}
                  <DateRangePicker
                    startDate={setupData?.startDate}
                    endDate={setupData?.endDate}
                    onChange={e => {
                      dispatch(setSetupData({ name: 'startDate', value: dayjs(e?.startDate).format('YYYY-MM-DD') }))
                      dispatch(setSetupData({ name: 'endDate', value: dayjs(e?.endDate).format('YYYY-MM-DD') }))
                    }} />
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

