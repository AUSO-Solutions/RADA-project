
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'
import CreateGroup from './creategroup'
import { useDispatch } from 'react-redux'
import { openModal } from 'Store/slices/modalSlice'

const Group = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <Header
        name={'Group'}
        btns={[
          { text: 'Create group', onClick: () => dispatch(openModal({ title: 'Create group', component: <CreateGroup /> })) },
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