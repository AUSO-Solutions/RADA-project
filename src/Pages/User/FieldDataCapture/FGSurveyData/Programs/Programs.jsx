
import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { clearSetup, setSetupData, setWholeSetup } from "Store/slices/setupSlice"
import { Input } from "Components"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from '../surveydata.module.scss'
// import { useFetch } from "hooks/useFetch" 
import Text from "Components/Text"
import { closeModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
import { useAssetByName } from "hooks/useAssetByName"
import { Chip } from "@mui/material"

import Files from "Partials/Files"
import { createWellTitle } from "utils"
import { useGetSetups } from "hooks/useSetups"



const createOpt = item => ({ label: item, value: item })
const optList = arr => arr?.length ? arr?.map(createOpt) : []
const genList = (assets) => {
    // console.log({assets})
    // let filtered = assets?.filter(asset => asset?.assetName === name)
    return {
        fields: optList((assets?.fields)),
        productionStrings: optList((assets?.productionStrings)),
        wells: optList((assets?.wells)),
        reservoirs: optList((assets?.reservoirs)),
    }
}

const SelectAsset = () => {

    const setupData = useSelector(state => state.setup)

    // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })

    const assets = useAssetByName(setupData?.asset)

    const assetData = useMemo(() => genList(assets), [assets])
    const { assetNames } = useAssetNames()
    const dispatch = useDispatch()

    const onSelectAsset = useCallback((e) => {

        dispatch(setSetupData({ name: 'asset', value: e.value }))
        dispatch(setSetupData({ name: 'field', value: '' }))
        dispatch(setSetupData({ name: 'productionStrings', value: null }))
        // setSelectedProductionStrings([])
        dispatch(setSetupData({ name: 'wellsData', value: {} }))
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
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.field, value: setupData?.field }}
            label={'Field'} type='select' options={assetData.fields}
            onChange={(e) => dispatch(setSetupData({ name: 'field', value: e?.value }))}
        />
        {/* <Input key={setupData?.asset + "prodString"} required defaultValue={setupData?.productionStrings?.map(createOpt)}
            label={'Production String'} type='select' options={assetData.productionStrings} isMulti
            onChange={(e) => dispatch(setSetupData({ name: 'productionStrings', value: e }))}
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

const DefineProgram = () => {
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)

    // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })

    const assets = useAssetByName(setupData?.asset)
    // console.log({ assets })
    // const assetData = useMemo(() => genList(assets), [assets])

    const getReservoirByProdString = (productionString) => {
        return assets.assetData?.find(asset => asset?.wellId === productionString)?.reservoir
    }


    // const storeWellChanges = (productionString, name, value, i) => {
    //     let updates = { ...setupData?.wellsData } || []
    //     const prev = updates[productionString]
    //     let duration = 0
    //     updates[productionString] = {
    //         ...prev,
    //         [name]: value
    //     }
    //     // console.log(prev)
    //     if (prev?.startDate && prev?.endDate) {
    //         duration = dayjs(prev?.endDate).diff(prev?.startDate, 'hours')
    //         console.log(duration)
    //     }
    //     dispatch(setSetupData({ name: 'wellsData', value: updates }))
    // }

    useEffect(() => {
        let updates = { ...setupData?.wellsData }
        assets?.productionStrings?.forEach(productionString => {
            updates[productionString] = {
                ...updates[productionString],
                productionString,
                reservoir: getReservoirByProdString(productionString),
                isSelected: setupData?.productionStrings?.includes(productionString)
            }
        })
        dispatch(setSetupData({ name: 'wellsData', value: updates }))
        // eslint-disable-next-line 
    }, [assets?.productionStrings, setupData?.productionStrings])

    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
            <Input type='month' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
                defaultValue={setupData?.month} required
                onChange={(e) => dispatch(setSetupData({ name: 'month', value: e.target.value }))} />
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={`${styles.table}`}>
                <thead className=" mt-5 ">
                    <tr className="pt-4 w-full justify-between text-left" >
                        <th className="pl-3 text-left !min-w-[200px]">Properties</th>
                        <th >Define Properties</th>
                        {/* <th>Fluid Type</th>
                        <th>No of Chokes</th>
                        <th> Chokes Size(/64")</th>
                        <th className="min-w-[230px] block "> Start Date</th>
                        <th className="min-w-[230px] block "> End Date</th>
                        <th> Duration (Hrs)</th>
                        <th> Stabilization Duration (Hrs)</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        // assetData.productionStrings.map((productionString, i) => {

                            // const handleWellChanges = (e) => {
                            //     const isCheckBox = (e.target.type === 'checkbox')
                            //     const name = (e.target.name)
                            //     const value = isCheckBox ? e.target.checked : e.target.value
                            //     storeWellChanges(productionString.value, name, value, i)
                            //     // storeWellChanges(productionString.value, 'productionString', productionString.value, i)
                            //     // storeWellChanges(productionString.value, 'reservior', assetData.reserviors[i].label, i)
                            // }
                            // const handleFluidTypeChange = (e) => {
                            //     storeWellChanges(productionString.value, 'fluidType', e.value, i)
                            // }
                            // const col = setupData?.wellsData[productionString.value]

                            // return (
                                <>
                                <tr className="border-b justify-between "  >
                                    <td className="!min-w-[200px]  text-left block pl-2 " >
                                        {/* <CheckInput key={(col?.isSelected ? 1 : 0) + col?.productionString} name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={productionString.label} /> */}
                                        <Text>Survey Type</Text>
                                        {/* <Text>Number of Stops</Text>
                                        <Text>Specify gauge type</Text> */}
                                    </td>
                                    <td>
                                        {/* {getReservoirByProdString(productionString?.value)} */}
                                        <Input  type='select' value={"24"} name="" 
                                        options={[{ label: 'Static Gradient', value: 'Static Gradient' }, { label: 'Flowing Gradient', value: 'Flowing Gradient' }, {label: 'Static/Flowing Gradient', value: 'Static/Flowing Gradient'}]} />
                                     
                                    </td>
                                </tr>
                                <tr className="border-b justify-between "  >
                                    <td className="!min-w-[200px] text-left block pl-2 " >
                                        {/* <CheckInput key={(col?.isSelected ? 1 : 0) + col?.productionString} name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={productionString.label} /> */}
                                        {/* <Text>Survey Type</Text> */}
                                        <Text>Number of Stops</Text>
                                        {/* <Text>Specify gauge type</Text> */}
                                    </td>
                                    <td>
                                        {/* {getReservoirByProdString(productionString?.value)} */}
                                        <input className={styles.inputBox}  type='number' value={"24"} name="" />
                                    </td>
                                </tr>
                                <tr className="border-b justify-between "  >
                                    <td className="!min-w-[200px] text-left block pl-2 " >
                                        {/* <CheckInput key={(col?.isSelected ? 1 : 0) + col?.productionString} name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={productionString.label} /> */}
                                        {/* <Text>Survey Type</Text> */}
                                        {/* <Text>Number of Stops</Text> */}
                                        <Text>Specify gauge type</Text>
                                    </td>
                                    <td>
                                        {/* {getReservoirByProdString(productionString?.value)} */}
                                        <Input  type='select' value={"24"} name="" 
                                        options={[{ label: 'Lower Gauge', value: 'Lower Gauge' }, { label: 'Upper Gauge', value: 'Upper Gauge' }, {label: 'Lower/Upper Gauge', value: 'Lower/Upper Gauge'}]} />
                                    </td>
                                </tr>
                                </>
                            // )
                        // }
                        // )
                    }


                </tbody>
            </table>

        </div>

    </>
}
const StaticParameters = () => {
    const setupData = useSelector(state => state.setup)
    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
            
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={styles.table}>
                <thead className=" mt-5">
                    <tr className="pt-4 w-full justify-between text-left" >
                        <th className="pl-3">Static Parameters</th>
                        <th >Define Value</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.values(setupData?.wellsData || {}).map((wellData, i) => {
                            return (
                                <tr className="border-b justify-between " >
                                    <td className="w-full" >

                                        {'Initial GOR RSI (SCF/STB)'}
                                    </td>
                                    <td>
                                        <input type="number" className={styles.inputBox} defaultValue={'286'} disabled />
                                    </td>
                                </tr>
                            )
                        }
                        )
                    }


                </tbody>
            </table>

        </div>

    </>
}


const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()
    return (
        <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save Schedule as</Text>
            <Input label={''} defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
        </div>
    )
}
const Exists = () => {

    const { setups: data } = useGetSetups("wellTestSchedule")
    return (
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files name={(file) => `${createWellTitle(file, 'MER Data Schedule')}`} files={data} actions={[
                { name: 'Remark', to: (file) => `/users/fdc/mer-data/schedule-table?id=${file?.id}` },
                { name: 'MER DATA Result', to: (file) => `/users/fdc/mer-data/mer-data-result-table?id=${file?.id}` },
            ]} />

        </div>
    )
}

const Programs = () => {
    // const setupData = useSelector(state => state.setup)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearSetup())
    }, [dispatch])
    const save = async () => {
        try {
            setLoading(true)
            const setupData = store.getState().setup

            const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'wellTestSchedule' })
            console.log({ data }, '----')

            dispatch(setWholeSetup(data))
            dispatch(closeModal())
            // setSetupTable(true)
        } catch (error) {
            toast.error(error?.message)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            {
                <Setup
                    title={'Setup Survey Data Program'}
                    steps={["Select Asset", "Define Program", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    stepComponents={[
                        <SelectAsset />,
                        <DefineProgram />,
                        <StaticParameters />,
                        <SaveAs />
                    ]}
                />
            }
        </>
    )


}

export default Programs
