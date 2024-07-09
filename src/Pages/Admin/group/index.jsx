
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'
import CreateGroup from './creategroup'
import { useDispatch } from 'react-redux'
import { closeModal, openModal } from 'Store/slices/modalSlice'
import TableAction from 'Components/RadaTable/TableAction'
import AddMemberstoGroup from './AddMemberstoGroup'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import deleteGroup from './deleteGroup'
// import { useFetch } from 'hooks/useFetch'

const Group = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <Header
        name={'Group'}
        btns={[
          { text: 'Create group', onClick: () => dispatch(openModal({ title: 'Create group', component: <CreateGroup /> })) },
        ]}
      />
      <RadaTable
        firebaseApi='getGroups'
        columns={[
          { name: 'Group Name', key: 'groupName' },
          { name: 'Date created', key: 'dateCreated' },
          { name: 'Members', render: (data) => data?.members?.length },
          // { name: 'Status' },
          // { name: 'Action' }
        ]}
        actions={(data, i) => <TableAction
          actions={[
            // { component: 'View members ', onClick: () => dispatch(openModal({ title: 'Group members', component: <AddMemberstoGroup group={data} /> })) },
            { component: 'Update group ', onClick: () => dispatch(openModal({ title: 'Update group', component: <AddMemberstoGroup group={data} /> })) },
            { component: 'Delete group', onClick: () => dispatch(openModal({ title: 'Delete Group', component: <ConfirmModal color='red' onProceed={() => deleteGroup(data?.id, () => dispatch(closeModal()))} /> })) },
          ]}
        />} />
    </div>
  )
}

export default Group