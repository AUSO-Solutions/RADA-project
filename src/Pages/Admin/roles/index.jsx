
import React, { useState } from 'react'
import CreateRoles from './CreateRoles'

import RadaTable from 'Components/RadaTable'
import Header from 'Components/header'
import { closeModal, openModal } from 'Store/slices/modalSlice'


import { useDispatch } from 'react-redux'

import TableAction from 'Components/RadaTable/TableAction'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { firebaseFunctions } from 'Services'



const Roles = () => {

  const dispatch = useDispatch()
  const [delLoad,setDelLoad] = useState(false)
  const deleteRole =async(roleId)=>{
    setDelLoad(true)
    try {
      await firebaseFunctions('deleteRole',{roleId})
      dispatch(closeModal())
    } catch (error) {
      
    }finally{
      setDelLoad(false)
    }

  }

  return (
    <div>
      <Header
        name={'Roles and permissions'}
        btns={[
          { text: 'Create role', onClick: () => dispatch(openModal({ title: 'Create role', component: <CreateRoles /> })) },
          // { text: 'Import users', onClick: () => dispatch(openModal({ title: 'Import Users', component: <ImportUsers /> })) },

        ]}
      />
      <RadaTable
        firebaseApi='getRoles'
        columns={[
          { name: 'Name', key:"roleName" },
          { name: 'Permissions', render:(data)=>data.permissions?.join(', ') },
          //   { name: 'Email' },
          //   { name: 'Status' },
          // { name: 'Action' }
        ]} 
        
        actions={(data, i) => <TableAction
          actions={[
            { component: 'Update role', onClick: () => dispatch(openModal({ title: 'Update role', component: <CreateRoles defaultValues={data} /> })) },
            { component: 'Delete role', onClick: () => dispatch(openModal({ title: 'Delete role', component: <ConfirmModal  color='red' loading={delLoad} onProceed={() => deleteRole(data?.id, () => dispatch(closeModal()))} /> })) },
          ]}
        />}/>
    </div>
  )
}

export default Roles