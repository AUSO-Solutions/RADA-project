import Header from 'Components/header'
import React, { useMemo } from 'react'
import Tab from 'Components/tab'
import Summary from './Summary'
import VolumeMeasurement from './VolumeMeasurement/VolumeMeasurement'
import OilGasAccounting from './OilAndGasAccount/OilGasAccounting'
import ShippingRecords from './ShippingRecords'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'Components'
import SelectGroup from 'Partials/BroadCast/SelectGroup'
import BroadCast from 'Partials/BroadCast'
import Attachment from 'Partials/BroadCast/Attachment'
import BroadCastSuccessfull from 'Partials/BroadCast/BroadCastSuccessfull'
import dayjs from 'dayjs'
import { openModal } from 'Store/slices/modalSlice'
import { useDispatch } from 'react-redux'


const tabs = [
  {
    title: 'Summary',
    Component: <Summary />,
    path: 'summary'
  },
  {
    title: 'Volume Measurement',
    Component: <VolumeMeasurement />,
    path: 'volume-measurement'
  },
  {
    title: 'Oil & Gas Accounting',
    Component: <OilGasAccounting />,
    path: 'oil-and-gas-accounting'
  },
  {
    title: 'Shipping Records',
    Component: <ShippingRecords />,
    path: 'shipping-record'
  }
]
const FDC = () => {
  // const toPage = str => str.replaceAll(' ', '-').toLowerCase()
  const [searchParams, setSearchParaams] = useSearchParams()
  const tab = useMemo(() => {
    const index = tabs.findIndex(tab => searchParams.get('tab') === (tab.path))
    return index > -1 ? index : 0
  }, [searchParams])
  const dispatch =  useDispatch()
  return (
    <div className='h-[100%] '>
      <Header
        name={'Daily Production/Operation Report'}
        right={<Button onClick={(file) => dispatch(openModal({
          title: '',
          component: <BroadCast
            onBroadcast={console.log}
            title='Broadcast Volume measurement'
            steps={['Select Group', 'Attachment', 'Broadcast']}
            stepsComponents={[
              <SelectGroup />,
              <Attachment details={`${file?.asset} Daily Production (${file?.fluidType}) ${dayjs(file?.date).format('DD/MMM/YYYY')}`} />,
              <BroadCastSuccessfull details={`${file?.asset} Daily Production (${file?.fluidType}) ${dayjs(file?.date).format('DD/MMM/YYYY')}`} />]} />
        }))}>
Broadcast
        </Button>}
      />

      < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
        {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setSearchParaams(prev => {
          prev.set("tab", (x.path))
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