import React, { useState } from 'react'
import Overview from './Overview'
import Insights from './Insights'
import Tab from 'Components/tab'
import Header from 'Components/header'

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

  const [tab, setTab] = useState(0)

  return (
    <div className='h-full'>
      <Header
        name={'Dashboard'}
      />

      <div >
        < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
          {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setTab(i)} />)}
        </ tabs>
        {
          tabs[tab].Component
          
        }
      </div>


    </div>
  )
}

export default Dashboard

