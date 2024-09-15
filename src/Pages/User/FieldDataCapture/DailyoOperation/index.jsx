import Header from 'Components/header'
import React, { useMemo } from 'react'
import Tab from 'Components/tab'
import Summary from './Summary'
import VolumeMeasurement from './VolumeMeasurement/VolumeMeasurement'
import OilGasAccounting from './OilGasAccounting'
import ShippingRecords from './ShippingRecords'
import { useSearchParams } from 'react-router-dom'


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
  const toPage = str => str.replaceAll(' ', '-').toLowerCase()
  const [searchParams, setSearchParaams] = useSearchParams()
  const tab = useMemo(() => {
    const index = tabs.findIndex(tab => searchParams.get('tab') === toPage(tab.title))
    return index > -1 ? index : 0
  }, [searchParams])
  return (
    <div className='h-[100%] '>
      <Header
        name={'Daily Production/Operation Report'}
      />

      < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
        {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setSearchParaams(prev => {
          prev.set("tab", toPage(x.title))
          return prev
        })} />)}
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