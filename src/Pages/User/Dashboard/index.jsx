import React, { useMemo, useState } from 'react'
import Overview from './Overview'
import Insights from './Insights'
import Tab from 'Components/tab'
import Header from 'Components/header'
import dayjs from 'dayjs'
import { LuListFilter } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { Input } from 'Components'
import { useAssetNames } from 'hooks/useAssetNames'
import { useSelector } from 'react-redux'
import { useAssetByName } from 'hooks/useAssetByName'

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

  const createOpt = item => ({ label: item, value: item })
  const optList = arr => arr?.length ? arr?.map(createOpt) : []
  const genList = (assets) => {
    return {
      fields: optList((assets?.fields)),
      productionStrings: optList((assets?.productionStrings)),
      wells: optList((assets?.wells)),
      reservoirs: optList((assets?.reservoirs)),
    }
  }

  const [tab, setTab] = useState(0)

  const setupData = useSelector(state => state.setup)

  // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })

  const assets = useAssetByName(setupData?.asset)

  const assetData = useMemo(() => genList(assets), [assets])
  const { assetNames } = useAssetNames()

  // const OMLOptions = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]

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
                {/* <div style={{ border: '1px solid #9DA0A7', padding: '5px 10px', borderRadius: 5, display:'flex', alignItems:'center', gap:10 }}><LuListFilter />{'Filter by'}</div>  */}
                <div style={{ width: '120px' }} >
                  <Input placeholder={'Filter by'} required defaultValue={'Filter by'}
                    type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                  // onChange={onSelectAsset}
                  />
                </div>
                <div style={{ width: '120px' }}>
                  <Input placeholder={'Select'} required defaultValue={'Filter by'}
                    type='select' options={assetData.fields}
                  // onChange={onSelectAsset}
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

