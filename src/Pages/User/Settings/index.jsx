import Header from 'Components/header'
import React, { useState } from 'react'
import Tab from 'Components/tab'
import UserDetails from './UserDetails'
// import GlobalSettings from './GlobalSettings'
import ChangePassword from './ChangePassword'



const tabs = [
    {
        title: 'User Details',
        Component: <UserDetails />
    },
    {
        title: 'Change password',
        Component: <ChangePassword />
    },
    // {
    //     title: 'Global Settings',
    //     Component: <GlobalSettings />
    // },
]


const Settings = () => {
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