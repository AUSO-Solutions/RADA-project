import React from 'react'
import Table from 'Components/table'
import TableAction from 'Components/tableaction'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'

const UserData = ({ url, header, fn = () => null, actions}) => {
  const columns = forms[header].fields.map(field => ({ name: field.label, key: field.name }))


  const { data } = useQuery(url)
  // const updatedColumns = 
  return (
    <div style={{ padding: '10px 0px 70px 0px' }}>
      <RadaTable columns={columns} data={data} fn={fn}  actions={actions}/>
    </div >
  )
}

export default UserData