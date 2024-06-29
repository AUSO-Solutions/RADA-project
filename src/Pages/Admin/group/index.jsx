
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'

const Group = () => {
  return (
    <div>
      <Header
        name={'Group'}
        btns={[
          { text: 'Create group', onClick: () => null },
          // { text: 'Import users', onClick: () => null },
          // { text: 'Import template', onClick: () => null },
        ]}
      />
      <RadaTable

        columns={[
          { name: 'Group Name' },
          { name: 'Date created' },
          { name: 'Member' },
          // { name: 'Status' },
          // { name: 'Action' }
        ]} />
    </div>
  )
}

export default Group