
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { closeModal, openModal } from 'Store/slices/modalSlice'

import React from 'react'
import { useDispatch } from 'react-redux'
import CreateUser from './createuser'
import TableAction from 'Components/RadaTable/TableAction'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { deleteUser } from './deleteUser'
import ImportUsers from './importUsers'
import { downloadTemplate, user } from './downloadTemplate'
import CsvDownloadButton from "react-json-to-csv"
// import { CSVDownload } from 'react-csv';
// import { toast } from 'react-toastify'


const Users = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <Header
        name={'User management'}
        btns={[
          { text: 'Create user', onClick: () => dispatch(openModal({ title: 'Create User', component: <CreateUser /> })) },
          { text: 'Import users', onClick: () => dispatch(openModal({ title: 'Import Users', component: <ImportUsers /> })) },
          {
            text: <>  <CsvDownloadButton data={user} >Download template  </CsvDownloadButton>  </>, onClick: () => null
          },
        ]}
      />
      <RadaTable
        firebaseApi='getUsers'
        columns={[
          { name: 'First name', key: 'firstName' },
          { name: 'Last name', key: 'lastName' },
          { name: 'Email', key: 'email' },
          { name: 'Status', key: 'status' },
          // { name: 'Action' }
        ]}
        actions={(data, i) => <TableAction
          actions={[
            { component: 'Update user', onClick: () => dispatch(openModal({ title: 'Update User', component: <CreateUser defaultValues={data} /> })) },
            { component: 'Delete user', onClick: () => dispatch(openModal({ title: 'Delete User', component: <ConfirmModal color='red' onProceed={() => deleteUser(data?.uid, () => dispatch(closeModal()))} /> })) },
          ]}
        />}
      />
    </div>
  )
}

export default Users