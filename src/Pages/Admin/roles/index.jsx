
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'

const Roles = () => {
  return (
    <div>
      <Header
        name={'Roles and permissions'}
        btns={[
          { text: 'Create Role', onClick: () => null },
        //   { text: 'Import Roles', onClick: () => null },
        //   { text: 'Import template', onClick: () => null },
        ]}
      />
      <RadaTable

        columns={[
          { name: 'Name' },
          { name: 'Permissions' },
        //   { name: 'Email' },
        //   { name: 'Status' },
          // { name: 'Action' }
        ]} />
    </div>
  )
}

export default Roles