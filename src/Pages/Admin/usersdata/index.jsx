import React from 'react'
import Table from 'Components/table'
import TableAction from 'Components/tableaction'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'

const UserData = () => {
  const columns = forms['Production Volume'].fields.map(field => ({ name: field.label, key: field.name }))
  const { data } = useQuery('/fields/get-all-production-volume')
  return (
    <div style={{ padding: '10px 0px 70px 0px' }}>
      <RadaTable columns={columns} data={data} />
    </div >
  )
}

export default UserData