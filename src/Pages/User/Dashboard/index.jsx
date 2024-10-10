import React, { useState } from 'react'
import Overview from './Overview'
import Insights from './Insights'
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

const tabs = [
  {
    title: 'Overview',
    Component: <Overview />
  },
  {
    title: 'Insights',
    Component: <Insights />
  },
]

const Dashboard = () => {

  const dispatch = useDispatch();
  const createOpt = item => ({ label: item, value: item })
  const [tab, setTab] = useState(0)
  const setupData = useSelector(state => state.setup)
  const assets = useAssetByName(setupData?.asset)
  const { assetNames } = useAssetNames()
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
            {tabs[tab]?.title === 'Insights' &&
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
                  <Input isClearable key={setupData?.asset} placeholder={'Flow Stations'} required
                    type='select' options={assets.flowStations?.map(createOpt)}
                    onChange={(e) => dispatch(setSetupData({ name: 'flowstation', value: e?.value }))}
                  />
                </div>
                <div  >
                  <DateRangePicker onChange={e => {
                    dispatch(setSetupData({ name: 'startDate', value: dayjs(e?.startDate).format('MM/DD/YYYY') }))
                    dispatch(setSetupData({ name: 'endDate', value: dayjs(e?.endDate).format('MM/DD/YYYY') }))
                  }} />
                </div>
              </>
            }
            {/* <div style={{ border: '1px solid #9DA0A7', padding: '5px 20px', borderRadius: 5 }}>{dayjs().format('DD/MM/YY')}</div> */}
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

