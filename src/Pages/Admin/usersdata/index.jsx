import React, { useEffect, useMemo } from 'react'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
// import TableFilter from './TableFilter'
// import dayjs from 'dayjs'


const UserData = ({ url, header, fn = () => null, actions, idKey, refresh, ...props }) => {

  const renders = (data, field) => {
    if (field?.tableRender) {
      return field?.tableRender(data)
    }
    return ''
  }
  const columns = forms[header]
    .fields
    .filter(field => field?.in?.includes('table') || !field?.in?.length)
    .map(field => ({
      name: field.label,
      key: field.name,
      render: (data) => renders(data, field)
    }))

  const state = useSelector(state => state?.auth?.user)

  const addAssetType = useMemo(() => {
    const assetType = state?.data?.assetType

    return assetType ? `-by-asset-type?asset_type=${assetType}` : ''
  }, [state?.data?.assetType])


  const { data, refetch } = useQuery(url + addAssetType)

  useEffect(() => {
    refetch()
  
  }, [refresh])
  // const updatedColumns = 
  return (
    <div style={{ padding: '10px 0px 70px 0px' }} className='w-[100%]'>
      {/* <TableFilter /> */}
      <RadaTable columns={columns} data={data} fn={fn} actions={actions} idKey={idKey} {...props} />
    </div >
  )
}

export default UserData