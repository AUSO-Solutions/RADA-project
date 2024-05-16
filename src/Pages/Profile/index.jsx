
import Layout from 'Components/layout'
import Tab from 'Components/tab'
import ChangePassword from 'Pages/User/Auth/ChangePassword'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const Profile = () => {
    const state = useSelector(state => state.auth.user)
    // console.log(state)
    const [tab, setTab] = useState(0)
    const tabs = [
        'Details',
        'Change password',
    ]
    const dataContainer = 'flex  gap-[32px] w-[fit-content]'
    const nameClass = ' w-[200px] text-2xl'
    const dataClass = ' text-2xl'
    return (
        <Layout name={state.data.name}>
            < div style={{ display: 'flex', gap: '20px' }} >
                {tabs.map((x, i) => <Tab key={i} text={x} active={i === tab} onClick={() => setTab(i)} />)}
            </ div>
            {
                tab === 0 && <div className=' flex flex-col gap-5 py-5'>

                    <div className={dataContainer}>
                        <div className={nameClass}>
                            Name
                        </div>
                        <div className={dataClass}>
                            {state.data.name}
                        </div>
                    </div>
                    <div className={dataContainer}>
                        <div className={nameClass}>
                            Email
                        </div>
                        <div className={dataClass}>
                            {state.data.email}
                        </div>
                    </div>
                    <div className={dataContainer}>
                        <div className={nameClass}>
                            Role
                        </div>
                        <div className={dataClass}>
                            {state.data.roles[0]?.replaceAll('_', ' ')}
                        </div>
                    </div>

                  {state.data.assetType  &&  <div className={dataContainer}>
                        <div className={nameClass}>
                            Asset type
                        </div>
                        <div className={dataClass}>
                            {state.data.assetType}
                        </div>
                    </div>}

                </div>
            }
            {
                tab === 1 && <ChangePassword />
            }
        </Layout>
    )
}

export default Profile