
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import dayjs from 'dayjs'

import React from 'react'

const ActivityLog = () => {
    return (
        <div>
            <Header
                name={'Activity Log'}
                btns={[
                    //   { text: 'Create ', onClick: () => null },
                    // { text: 'Import users', onClick: () => null },
                    // { text: 'Import template', onClick: () => null },
                ]}
            />
            <RadaTable
noaction
firebaseApi='getLogs'
                columns={[
                    { name: 'Date' , key:'logTime', render:data=>dayjs(data?.logTime).format("MMM DD, YYYY.")},
                    { name: 'Time' ,render:data=>dayjs(data?.logTime).format("hh:mmA")},
                    { name: 'User', key:'user' },
                    { name: 'Audit note', key:'message' },
                    // { name: 'Log Type' }
                ]} />
        </div>
    )
}

export default ActivityLog