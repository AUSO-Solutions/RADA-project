import React, { useState } from 'react'
import Layout from 'Components/layout'
import Tab from 'Components/tab'
import UserData from '../usersdata'

const Reports = () => {


    const [tab, setTab] = useState(0)

    const tabs = [

        'Production Volume',
        'Cumulative Production',
        'Well Flow',
        // 'OFM Sys Configuration',
        // 'OFM Sys Date Range',
        // 'OFM Sys Field Production',
        // 'OFM Sys Multipliers',
        // 'OFM Sys Parser',
        // 'OFM Sys Table Info',
        // 'OFM Sys Table Map',
        // 'OFM Sys Units',
        // 'Buttom Head Pressure',
        // 'Deviation Data',
        // 'OFM Data DCA Ratio',
        // 'OFM Data DCA RadioForecast',
       
    ]

  return (
    <Layout name={"FIELD REPORTS"}>
      <div style={{ padding: '20px', width: '100%' }}>
                < tabs style={{ display: 'flex', gap: '20px' }} >
                    {tabs.map((x, i) => <Tab key={i} text={x} active={i === tab} onClick={() => setTab(i)} />)}
                </ tabs>

                {(tab === 0) && <UserData />}
                {(tab === 1) && <UserData />}
                {(tab === 2) && <UserData />}
                {/* {(tab === 4) && <UserData />}
                {(tab === 5) && <UserData />}
                {(tab === 6) && <UserData />}
                {(tab === 7) && <UserData />}
                {(tab === 8) && <UserData />}
                {(tab === 9) && <UserData />}
                {(tab === 10) && <UserData />}
                {(tab === 11) && <UserData />}
                {(tab === 12) && <UserData />}
                {(tab === 13) && <UserData />}
                {(tab === 14) && <UserData />}
                {(tab === 15) && <UserData />} */}
            </div>
    </Layout>
  )
}

export default Reports