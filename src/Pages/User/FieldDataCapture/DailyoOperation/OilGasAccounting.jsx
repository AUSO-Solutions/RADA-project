import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'Components'
import { clearSetup, setSetupData, setWholeSetup } from 'Store/slices/setupSlice'
import CheckInput from 'Components/Input/CheckInput'
import Text from 'Components/Text'
import { FaCheck } from 'react-icons/fa'

import { store } from 'Store'
import { closeModal } from 'Store/slices/modalSlice'
import Setup from 'Partials/setup'
import { useAssetByName } from 'hooks/useAssetByName'
import { Chip } from '@mui/material'
import { firebaseFunctions } from 'Services'
import Files from 'Partials/Files'
import { useFetch } from 'hooks/useFetch'
import dayjs from 'dayjs'


// const SelectAsset = () => {
//   const { assetNames } = useAssetNames()
//   const setupData = useSelector(state => state.setup)
//   const dispatch = useDispatch()
//   return <>
//     <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
//       label={'Assets'} type='select'
//       options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
//       onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
//   </>
// }
const createOpt = item => ({ label: item, value: item })
const optList = arr => arr?.length ? arr?.map(createOpt) : []
const genList = (assets) => {
  return {
    fields: optList((assets?.fields)),
    productionStrings: optList((assets?.productionStrings)),
    wells: optList((assets?.wells)),
    reservoirs: optList((assets?.reservoirs)),
  }
}
const SelectAsset = () => {

  const setupData = useSelector(state => state.setup)

  const assets = useAssetByName(setupData?.asset)

  const assetData = useMemo(() => genList(assets), [assets])
  const { assetNames } = useAssetNames()
  const dispatch = useDispatch()

  const onSelectAsset = useCallback((e) => {

    dispatch(setSetupData({ name: 'asset', value: e.value }))
    // dispatch(setSetupData({ name: 'field', value: '' }))
    dispatch(setSetupData({ name: 'productionStrings', value: null }))
    // dispatch(setSetupData({ name: 'wellsData', value: {} }))
  }, [dispatch])
  const [searchProdString, setSearchProdString] = useState('')

  const selectProdString = (productionString) => {
    const prevProductionstring = setupData?.productionStrings || []
    let newlist = []
    if (prevProductionstring.includes(productionString)) { newlist = prevProductionstring.filter(selected => selected !== productionString) }
    else { newlist = [...prevProductionstring, productionString] }
    dispatch(setSetupData({ name: 'productionStrings', value: newlist }))

  }

  return <>
    <Input required defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
      label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
      onChange={onSelectAsset}
    />
    {/* <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.field, value: setupData?.field }}
          label={'Field'} type='select' options={assetData.fields}
          onChange={(e) => dispatch(setSetupData({ name: 'field', value: e?.value }))}
      /> */}

    <div className="mt-3 p-1 border rounded">
      <Text>Production Strings</Text><br />
      <input type="search" placeholder="Search for production string" className="w-1/2 border py-1 mt-3 px-2 rounded" onChange={(e) => setSearchProdString(e.target.value)} />
      <div className="flex gap-1 mt-3 flex-wrap p-1  rounded">
        {
          assetData.productionStrings?.filter(({ label }) => {
            if (!searchProdString) return label
            return label?.toLowerCase()?.includes(searchProdString?.toLowerCase())
          })?.map(productionString => <Chip onClick={() => selectProdString(productionString?.value)} color="primary" variant={setupData?.productionStrings?.includes(productionString.value) ? "filled" : "outlined"} className="cursor-pointer" label={productionString?.label} />)
        }
      </div>
    </div>
  </>
}


const DefineReport = ({ asset, }) => {
  const dispatch = useDispatch()
  const setupData = useSelector(state => state.setup)
  const paramters = useMemo(() => {
    return [
      { value: 'Pressures', label: 'Pressures' },
      { value: 'Separator Static', label: 'Separator Static' },
      { value: 'Choke', label: 'Choke' },
      { value: 'Closed-In Tubing Head Pressure', label: 'Closed-In Tubing Head Pressure' },
    ]
  }, [])
  const handleCheck = (name, event) => {
    const checked = event.target.checked
    let selectedParameters = setupData?.paramters || []
    if (checked) {
      selectedParameters = Array.from(new Set([...selectedParameters, name]))
    } else {
      selectedParameters = selectedParameters.filter(paramter => paramter !== name)
    }
    dispatch(setSetupData({ name: 'paramters', value: selectedParameters }))
  }

  const checkAll = (e) => {
    const checked = e.target.checked
    dispatch(setSetupData({ name: 'paramters', value: [] }))
    if (checked) dispatch(setSetupData({ name: 'paramters', value: paramters.filter(paramter => paramter.value !== 'All').map(paramter => paramter.value) }))
  }
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} defaultValue={asset} disabled />
    </div>

    <div key={setupData?.paramters?.length} className='flex flex-col mt-[24px] rounded-[8px] gap-[24px] border'>
      <div className='flex border-b px-3'>
        <CheckInput defaultChecked={setupData?.paramters?.length === paramters.length} onChange={(e) => checkAll(e)} label={'Select all'} />
      </div>
      {
        paramters.map(repoortType => <div className='flex border-b px-3'>
          <CheckInput defaultChecked={setupData?.paramters?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
        </div>)
      }
    </div>

  </>
}
const Preview = () => {
  const paramters = useMemo(() => {
    return [
      { value: 'Pressures', label: 'Pressures' },
      { value: 'Separator Static', label: 'Separator Static' },
      { value: 'Choke', label: 'Choke' },
      { value: 'Closed-In Tubing Head Pressure', label: 'Closed-In Tubing Head Pressure' },
    ]
  }, [])
  return <>
    <div className='border flex gap-4 flex-col mt-3 !rounded-[8px]'>
      <div className='flex gap-3 border-b p-3'>
        <Text weight={600} size={"16px"} className={'pl-[30px] '}>Well Test Data</Text>
      </div>
      {
        paramters.map((paramter, i) => {
          return (
            <div className={`flex items-center ${paramters.length === i + 1 ? "" : "border-b"} gap-4 p-3`}>
              <FaCheck color='rgba(0, 163, 255, 1)' />
              <Text>{paramter.label}</Text>
            </div>
          )
        })
      }
    </div>
  </>
}

const Existing = ({ onSelect = () => null }) => {
  const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "oilAndGasAccounting" } })

  return (
    <div className=" flex flex-wrap gap-4 m-5 ">
      <Files files={data} actions={[
        { name: 'View', to: (file) => `/users/fdc/daily/${file?.reportTypes?.[0] === 'Gas' ? 'gas-table' : 'volume-measurement-table'}?id=${file?.id}` },
        { name: 'Delete', to: (file) => `` },
      ]} name={(file) => `${file.title || "No title"}/${file?.asset}/${dayjs(file.created).format('MMM-YYYY')}`} />
    </div>
  )
}

const OilGasAccounting = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearSetup({}))
  }, [dispatch])

  const save = async () => {
    const setupData = store.getState().setup
    console.log(setupData)
    try {
      const setupData = store.getState().setup

      const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'oilAndGasAccounting' })
      console.log({ data }, '----')

      dispatch(setWholeSetup(data))

      dispatch(closeModal())
    } catch (error) {

    }

  }


  return (
    <>

      <Setup
        title={'Setup Oil & Gas Accounting Parameters'}
        steps={["Select Well Test Data", "Define Report", "Preview"]}
        existing={<Existing />}
        stepComponents={[
          <SelectAsset />,
          <DefineReport />, <Preview />
        ]}

        onSave={save}
      />

    </>
  )
}

export default OilGasAccounting