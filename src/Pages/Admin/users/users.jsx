
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { openModal } from 'Store/slices/modalSlice'

import React from 'react'
import { useDispatch } from 'react-redux'
import CreateUser from './createuser'

const Users = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <Header
        name={'User management'}
        btns={[
          { text: 'Create user', onClick: () => dispatch(openModal({ title: 'Create User', component: <CreateUser /> })) },
          { text: 'Import users', onClick: () => null },
          { text: 'Download template', onClick: () => null },
        ]}
      />
      <RadaTable
        firebaseApi='getUsers'
        columns={[
          { name: 'First name', key: 'firstName' },
          { name: 'Last name', key: 'lastName' },
          { name: 'Email', key: 'email' },
          { name: 'Status', key:'status' },
          // { name: 'Action' }
        ]} />
    </div>
  )
}

export default Users