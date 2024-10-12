import Header from 'Components/header'
import React, { useMemo, useState } from 'react'
import Tab from 'Components/tab'
import { useLocation, useNavigate } from 'react-router-dom'
import UserDetails from './UserDetails'
import GlobalSettings from './GlobalSettings'


const tabs = [
    {
        title: 'User Details',
        Component: <UserDetails />
    },
    {
        title: 'Global Settings',
        Component: <GlobalSettings />
    },
]


const Settings = () => {
    const navigate = useNavigate()
    const [tab, setTab] = useState(0)


    return (
        <div className='h-[100%]'>
            <Header
                name={'Settings'}
            />
            < tabs style={{ display: 'flex', gap: '40px', paddingLeft: 40, borderBottom: "1px solid rgba(230, 230, 230, 1)" }} >
                {tabs.map((x, i) => <Tab key={i} text={x.title} active={i === tab} onClick={() => setTab(i)} />)}
            </ tabs>
            {
                tabs[tab].Component
            }
        </div>
    )
}

export default Settings