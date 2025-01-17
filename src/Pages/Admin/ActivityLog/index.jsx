
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

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
                columns={[
                    { name: 'Date' },
                    { name: 'Time' },
                    { name: 'Email' },
                    { name: 'Audit note' },
                    { name: 'Log Type' }
                ]} />
        </div>
    )
}

export default ActivityLog