import React, { useMemo } from 'react'
import RadaTable from 'Components/RadaTable'
import { forms } from 'Pages/User/dataform/formFields'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'


const UserData = ({ url, header, fn = () => null, actions, idKey, ...props }) => {
  const columns = forms[header].fields.filter(field => field?.in?.includes('table') || !field?.in?.length).map(field => ({ name: field.label, key: field.name }))

  const state = useSelector(state => state?.auth?.user)
  const addAssetType = useMemo(() => {
    const assetType = state?.data?.assetType

    return assetType ? `-by-asset-type?asset_type=${assetType}` : ''
  }, [state?.data?.assetType])


  const { data } = useQuery(url + addAssetType )
  // const updatedColumns = 
  return (
    <div style={{ padding: '10px 0px 70px 0px' }}>
      <RadaTable columns={columns} data={data} fn={fn} actions={actions} idKey={idKey} {...props} />
    </div >
  )
}

export default UserData