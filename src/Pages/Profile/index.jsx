
import Layout from 'Components/layout'
import React from 'react'
import { useSelector } from 'react-redux'


const Profile = () => {
    const state = useSelector(state => state.auth.user)
    console.log(state)
    const dataContainer =  'flex  gap-[32px] w-[fit-content]'
    const nameClass =  ' w-[200px] text-2xl'
    const dataClass =  ' text-2xl'
    return (
        <Layout name={state.data.name}>
            <div className=' flex flex-col gap-5 py-5'>

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

                <div className={dataContainer}>
                    <div className={nameClass}>
                        Asset type
                    </div>
                    <div className={dataClass}>
                        {state.data.assetType}
                    </div>
                </div>


            </div>
        </Layout>
    )
}

export default Profile