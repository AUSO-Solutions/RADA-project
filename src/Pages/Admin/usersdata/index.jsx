import React, { useEffect, useMemo } from 'react'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
// import TableFilter from './TableFilter'
// import dayjs from 'dayjs'


const UserData = ({url, header, fn =()=> null}) => {
  const columns = forms[header].fields.map(field => ({ name: field.label, key: field.name }))

// const pd_columns = [
//   {name:'',key:''},
//   {name:'',key:''},
//   {name:'',key:''},
//   {name:'',key:''},
//   {name:'',key:''},
//   {name:'',key:''}, q
// ]

  const { data } = useQuery(url)
  // const updatedColumns = 
  return (
    <div style={{ padding: '10px 0px 70px 0px' }} className='w-[100%]'>
      {/* <TableFilter /> */}
      <RadaTable columns={columns} data={data} fn={fn} actions={actions} idKey={idKey} {...props} />
    </div >
  )
}

export default UserData