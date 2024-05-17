import React, { useEffect, useMemo } from 'react'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { apiRequest } from 'Services'

const UserData = ({ url, header, fn = () => null, actions, idKey, ...props }) => {
  const columns = forms[header].fields.map(field => ({ name: field.label, key: field.name }))

  const state = useSelector(state => state?.auth?.user)
  const addAssetType = useMemo(() => {
    const assetType = state?.data?.assetType

    return assetType ? `-by-asset-type?asset_type=${assetType}` : ''
  }, [])


  const { data } = useQuery(url + addAssetType )
  // const updatedColumns = 
  return (
    <div style={{ padding: '10px 0px 70px 0px' }}>
      {addAssetType}
      <RadaTable columns={columns} data={data} fn={fn} actions={actions} idKey={idKey} {...props} />
    </div >
  )
}

export default UserData