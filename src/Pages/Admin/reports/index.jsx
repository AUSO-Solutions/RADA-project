import React, { useCallback, useState } from 'react'
import Layout from 'Components/layout'
import Tab from 'Components/tab'
import UserData from '../usersdata'
import TableAction from 'Components/RadaTable/TableAction'
import { useDispatch } from 'react-redux'
import { closeModal, openModal } from 'Store/slices/modalSlice'
import Action from './Action'
import { Input, RadaForm } from 'Components'
import { forms } from 'Pages/User/dataform/formFields'


const Modify = ({ form, data, url , onSuccess=()=>null}) => {
  const convertDataToPatchPayload = useCallback((payload) => {
    return (Object.entries(payload || {}).map(entry => ({ "op": "replace", "path": `/${entry[0]}`, "value": entry[1] })))
  }, [])

  // const disptach = useDispatch()
  const getDefaultValue = (data, field) => {
    return data[field?.defaultValue] || data[field.name]
  }


  return (
    <RadaForm btnText={'Modify'} method={'patch'} url={url} modifyPayload={(payload) => convertDataToPatchPayload(payload)} onSuccess={onSuccess} >
      <div className='flex  flex-wrap'>
        {forms[form]
          ?.fields
          .filter(field => field?.in?.includes('input') || !field?.in?.length)
          .map(field => <Input
            {...field} name={field?.defaultValue || field?.name}
            className={'w-[45%]'}
            defaultValue={getDefaultValue(data, field)}
          />)}
      </div>
    </RadaForm>
  )
}

const Reports = () => {


  const [tab, setTab] = useState(0)

  const tabs = [

    'Production Volume',
    'Cumulative Production',
    'Well Flow',


  ]

  const update_column = (columns = []) => {
    return columns.map(column => {
      if (column.key === 'wellIdentity') return ({ ...column, key: 'wellID' })
      return column
    })
  }

  return (
    <Layout name={"FIELD REPORTS"}>
      <div style={{ padding: '20px', width: '100%' }}>
        < tabs style={{ display: 'flex', gap: '20px' }} >
          {tabs.map((x, i) => <Tab key={i} text={x} active={i === tab} onClick={() => setTab(i)} />)}
        </ tabs>


        {(tab === 0) && <UserData url={'/fields/get-all-production-volume'} header={'Production Volume'} fn={(data) => update_column(data)} actions={(data) => <TableAction
          actions={[
            { component: 'Accept', onClick: (data) => console.log(data) },
            { component: 'Modify' },
            { component: 'Roll back' },
          ]}
        />
        } />}
        {(tab === 1) && <UserData url={'fields/get-all-cumulative-production'} header={'Cumulative Production'} fn={(data) => update_column(data)} />}
        {(tab === 2) && <UserData url={'fields/get-all-well-flow'} header={'Well Flow'} fn={(data) => update_column(data)} />}

      </div>
    </Layout>
  )
}

export default Reports