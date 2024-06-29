
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'

const Users = () => {
  return (
    <div>
      <Header
        name={'User management'}
        btns={[
          { text: 'Create user', onClick: () => null },
          { text: 'Import users', onClick: () => null },
          { text: 'Import template', onClick: () => null },
        ]}
      />
      <RadaTable

        columns={[
          { name: 'First name' },
          { name: 'Last name' },
          { name: 'Email' },
          { name: 'Status' },
          // { name: 'Action' }
        ]} />
    </div>
  )
}

export default Users