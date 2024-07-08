
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { closeModal, openModal } from 'Store/slices/modalSlice'

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import CreateUser from './createuser'
import TableAction from 'Components/RadaTable/TableAction'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { deleteUser } from './deleteUser'
import ImportUsers from './importUsers'
import { downloadTemplate } from './downloadTemplate'

import { firebaseFunctions } from 'Services'
import { Button } from 'Components'
// import { CSVDownload } from 'react-csv';
// import { toast } from 'react-toastify'


const Users = () => {
  const dispatch = useDispatch()
  const [downloadLoading, setDownloading] = useState(false)
  const [usersToDownloading] = useState([])

  const downloadUser = async () => {
    setDownloading(true)
    if (downloadLoading) return;
    try {
      const users = await firebaseFunctions("getUsers")
      let list = users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName, email: user?.email, })) || []
      list.unshift({ "firstName": "firstName", "lastName": "lastName", "email": "email" })
      // setUsertoDownload(users?.data?.map(user => ({ firstName: user?.firstName, lastName: user?.lastName,  email: user?.email, })))
      downloadTemplate(list)
    } catch (error) {

    } finally {
      setDownloading(false)
    }
  }



  return (
    <div>
      <Header
        name={'User management'}
        btns={[
          { text: 'Create user', onClick: () => dispatch(openModal({ title: 'Create User', component: <CreateUser /> })) },
          { text: 'Import users', onClick: () => dispatch(openModal({ title: 'Import Users', component: <ImportUsers /> })) },
          {
            text: <>  <Button data={usersToDownloading} loading={downloadLoading} >{downloadLoading ? 'Loading...' : 'Download template '} </Button>  </>, onClick: () => downloadUser()
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