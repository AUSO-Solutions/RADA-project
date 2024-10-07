import React, { useMemo, useState } from 'react'
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
  const optList = arr => arr?.length ? arr?.map(createOpt) : []
  const genList = (assets) => {
    return {
      fields: optList((assets?.fields)),
      productionStrings: optList((assets?.productionStrings)),
      wells: optList((assets?.wells)),
      reservoirs: optList((assets?.reservoirs)),
      flowstations: optList((assets?.flowStations)),
    }
  }

  const [tab, setTab] = useState(0)

  const setupData = useSelector(state => state.setup)

  const assets = useAssetByName(setupData?.asset)
  console.log(assets)

  const assetData = useMemo(() => {
    const optList = arr => arr?.length ? arr?.map(createOpt) : []
    return {
      fields: optList((assets?.fields)),
      productionStrings: optList((assets?.productionStrings)),
      wells: optList((assets?.wells)),
      reservoirs: optList((assets?.reservoirs)),
    }
    // }
    // return genList(assets)
  },
    [assets])
  const { assetNames } = useAssetNames()
  console.log(assetData)

  //   const handleFluidTypeChange = (e) => {
  //     storeWellChanges(productionString.value, 'fluidType', e.value, i)
  // }

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
                  <Input placeholder={'Assets'} required defaultValue={'Filter by'}
                    type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                    onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e?.value }))}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <Input key={setupData?.asset} placeholder={'Flow Stations'} required defaultValue={'Filter by'}
                    type='select' options={assetData.flowstations}
                    onChange={(e) => dispatch(setSetupData({ name: 'flowstations', value: e?.value }))}
                  />
                </div>
                <div style={{ width: '120px' }} >
                  <Input placeholder={'Frequency'} required defaultValue={'Filter by'}
                    type='select' options={[{ label: 'Daily', value: 'Daily' }, { label: 'Monthly', value: 'Monthly' }]}
                    onChange={() => {}}
                  />
                </div>
              </>
            }
            <div style={{ border: '1px solid #9DA0A7', padding: '5px 20px', borderRadius: 5 }}>{dayjs().format('DD/MM/YY')}</div>
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

