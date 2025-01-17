
import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'

import React from 'react'
import CreateGroup from './creategroup'
import { useDispatch } from 'react-redux'
import { closeModal, openModal } from 'Store/slices/modalSlice'
import TableAction from 'Components/RadaTable/TableAction'

import ConfirmModal from 'Components/Modal/ConfirmModal'
import deleteGroup from './deleteGroup'
import { useNavigate } from 'react-router-dom'
// import { useFetch } from 'hooks/useFetch'

const Groups = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
          { name: 'Date created', key: 'dateCreated', render:(data)=>data?.created?.pretty || data?.dateCreated},
          {
            name: 'Members', render: (data) => {
              const memberslist = data?.members?.map(member => member.name).slice(0, 2).join(', ') + "..."
              if (data?.members?.length) return memberslist
              return 'No member present'
            }
          },
          {
            name: 'Assets', render: (data) => {
              // const memberslist = data?.assets?.map(asset => `${asset.name} ${asset.well}`).slice(0, 2).join(', ') + "..."
              if (data?.assets?.length) return data?.assets?.join(', ')
              return 'No asset present'
            }
          },
          // { name: 'Status' },
          // { name: 'Action' }
        ]}
        actions={(data, i) => <TableAction
          actions={[
            // { component: 'View members ', onClick: () => dispatch(openModal({ title: 'Group members', component: <AddMemberstoGroup group={data} /> })) },
            // { component: 'Update group ', onClick: () => dispatch(openModal({ title: 'Update group', component: <AddMemberstoGroup group={data} /> })) },
            { component: 'Update group ', onClick: () => navigate(`/admin/groups/${data?.id}`) },
            { component: 'Delete group', onClick: () => dispatch(openModal({ title: 'Delete Group', component: <ConfirmModal color='red' onProceed={() => deleteGroup(data?.id, () => dispatch(closeModal()))} /> })) },
          ]}
        />} />
    </div>
  )
}

export default Groups