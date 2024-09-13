import Header from 'Components/header'
import React, { useState } from 'react'
import Tab from 'Components/tab'
import Schedule from './Schedule/Schedule'
// import IPSC from './IPSC'
import WellTestResults from './WellTest/WellTestResults'
import CreateIPSC from './IPSC/CreateIPSC'


const tabs = [
  {
    title: 'Schedules',
    Component: <Schedule />
  },
  {
    title: 'Well Test Result',
    Component: <WellTestResults />
  },
  {
    title: 'IPSC',
    Component: <CreateIPSC />
  },
]
const WellTest = () => {
  const [tab, setTab] = useState(0)
  return (
    <div className='h-[100%] '>
      <Header
        name={'Well Test Data'}
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

export default WellTest