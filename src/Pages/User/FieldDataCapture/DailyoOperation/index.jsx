import Header from 'Components/header'
import React, { useState } from 'react'
import Tab from 'Components/tab'
import Summary from './Summary'
import VolumeMeasurement from './VolumeMeasurement'
import OilGasAccounting from './OilGasAccounting'
import ShippingRecords from './ShippingRecords'


const tabs = [
  {
    title: 'Summary',
    Component: <Summary />
  },
  {
    title: 'Volume Measurement',
    Component: <VolumeMeasurement />
  },
  {
    title: 'Oil & Gas Accounting',
    Component: <OilGasAccounting />
  },
  {
    title: 'Shipping Records',
    Component: <ShippingRecords />
  }
]
const FDC = () => {
  const [tab, setTab] = useState(0)
  return (
    <div className='h-[100%] '>
      <Header
        name={'Daily Production/Operation Report'}
      />

      < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
        {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setTab(i)} />)}
      </ tabs>
      {
        tabs[tab].Component
      }
      {/* <Tabs */}
      {/* <Setup /> */}
    </div>
  )
}

export default FDC