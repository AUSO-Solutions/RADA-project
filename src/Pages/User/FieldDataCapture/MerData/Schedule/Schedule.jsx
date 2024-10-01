
import { useDispatch, useSelector } from "react-redux"
// import { useAssetNames } from "hooks/useAssetNames"
import { clearSetup, setSetupData } from "Store/slices/setupSlice"
// import CheckInput from "Components/Input/CheckInput"
import { Button, Input } from "Components"
import { useEffect, useState } from "react"
// import styles from '../merdata.module.scss'
import { useFetch } from "hooks/useFetch"
import Text from "Components/Text"
import { closeModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
// import { useAssetByName } from "hooks/useAssetByName"
// import { Chip } from "@mui/material"
// import dayjs from "dayjs"
import Files from "Partials/Files"
import { createWellTitle } from "utils"
import { BsPlus } from "react-icons/bs"
import dayjs from "dayjs"
import ExcelToCsv from "Partials/ExcelToCSV"


// const createOpt = item => ({ label: item, value: item })
// const optList = arr => arr?.length ? arr?.map(createOpt) : []
// const genList = (assets) => {
//     // console.log({assets})
//     // let filtered = assets?.filter(asset => asset?.assetName === name)
//     return {
//         fields: optList((assets?.fields)),
//         productionStrings: optList((assets?.productionStrings)),
//         wells: optList((assets?.wells)),
//         reservoirs: optList((assets?.reservoirs)),
//     }
// }

// const SelectAsset = () => {

//     const setupData = useSelector(state => state.setup)

//     // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })

//     const assets = useAssetByName(setupData?.asset)

//     const assetData = useMemo(() => genList(assets), [assets])
//     const { assetNames } = useAssetNames()
//     const dispatch = useDispatch()

//     const onSelectAsset = useCallback((e) => {

//         dispatch(setSetupData({ name: 'asset', value: e.value }))
//         dispatch(setSetupData({ name: 'field', value: '' }))
//         dispatch(setSetupData({ name: 'productionStrings', value: null }))
//         // setSelectedProductionStrings([])
//         dispatch(setSetupData({ name: 'wellsData', value: {} }))
//     }, [dispatch])
//     const [searchProdString, setSearchProdString] = useState('')

//     const selectProdString = (productionString) => {
//         const prevProductionstring = setupData?.productionStrings || []
//         let newlist = []
//         if (prevProductionstring.includes(productionString)) { newlist = prevProductionstring.filter(selected => selected !== productionString) }
//         else { newlist = [...prevProductionstring, productionString] }
//         dispatch(setSetupData({ name: 'productionStrings', value: newlist }))

//     }





//     return <>
//         <Input required defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
//             label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
//             onChange={onSelectAsset}
//         />
//         <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.field, value: setupData?.field }}
//             label={'Field'} type='select' options={assetData.fields}
//             onChange={(e) => dispatch(setSetupData({ name: 'field', value: e?.value }))}
//         />
//         {/* <Input key={setupData?.asset + "prodString"} required defaultValue={setupData?.productionStrings?.map(createOpt)}
//             label={'Production String'} type='select' options={assetData.productionStrings} isMulti
//             onChange={(e) => dispatch(setSetupData({ name: 'productionStrings', value: e }))}
//         /> */}
//         <div className="mt-3 p-1 border rounded">
//             <Text>Production Strings</Text><br />
//             <input type="search" placeholder="Search for production string" className="w-1/2 border py-1 mt-3 px-2 rounded" onChange={(e) => setSearchProdString(e.target.value)} />
//             <div className="flex gap-1 mt-3 flex-wrap p-1  rounded">
//                 {
//                     assetData.productionStrings?.filter(({ label }) => {
//                         if (!searchProdString) return label
//                         return label?.toLowerCase()?.includes(searchProdString?.toLowerCase())
//                     })?.map(productionString => <Chip onClick={() => selectProdString(productionString?.value)} color="primary" variant={setupData?.productionStrings?.includes(productionString.value) ? "filled" : "outlined"} className="cursor-pointer" label={productionString?.label} />)
//                 }
//             </div>
//         </div>
//     </>
// }

// const DefineSchedule = () => {
//     const dispatch = useDispatch()
//     const setupData = useSelector(state => state.setup)

//     // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })

//     const assets = useAssetByName(setupData?.asset)
//     // console.log({ assets })
//     const assetData = useMemo(() => genList(assets), [assets])

//     const getReservoirByProdString = (productionString) => {
//         return assets.assetData?.find(asset => asset?.wellId === productionString)?.reservoir
//     }


//     const storeWellChanges = (productionString, name, value, i) => {
//         let updates = { ...setupData?.wellsData } || []
//         const prev = updates[productionString]
//         let duration = 0
//         updates[productionString] = {
//             ...prev,
//             [name]: value
//         }
//         // console.log(prev)
//         if (prev?.startDate && prev?.endDate) {
//             duration = dayjs(prev?.endDate).diff(prev?.startDate, 'hours')
//             console.log(duration)
//         }
//         dispatch(setSetupData({ name: 'wellsData', value: updates }))
//     }

//     useEffect(() => {
//         let updates = { ...setupData?.wellsData }
//         assets?.productionStrings?.forEach(productionString => {
//             updates[productionString] = {
//                 ...updates[productionString],
//                 productionString,
//                 reservoir: getReservoirByProdString(productionString),
//                 isSelected: setupData?.productionStrings?.includes(productionString)
//             }
//         })
//         dispatch(setSetupData({ name: 'wellsData', value: updates }))
//         // eslint-disable-next-line 
//     }, [assets?.productionStrings, setupData?.productionStrings])

//     return <>
//         <div className='flex justify-between !w-[100%]'>
//             <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
//             <Input type='month' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
//                 defaultValue={setupData?.month} required
//                 onChange={(e) => dispatch(setSetupData({ name: 'month', value: e.target.value }))} />
//         </div>

//         <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

//             <table className={styles.table}>
//                 <thead className=" mt-5">
//                     <tr className="pt-4 w-full text-left" >
//                         <th className="pl-3 text-left !min-w-[200px]">Production String</th>
//                         <th >Reservoir</th>
//                         <th>Fluid Type</th>
//                         <th>No of Chokes</th>
//                         <th> Chokes Size(/64")</th>
//                         <th className="min-w-[230px] block "> Start Date</th>
//                         <th className="min-w-[230px] block "> End Date</th>
//                         <th> Duration (Hrs)</th>
//                         <th> Stabilization Duration (Hrs)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         assetData.productionStrings.map((productionString, i) => {

//                             const handleWellChanges = (e) => {
//                                 const isCheckBox = (e.target.type === 'checkbox')
//                                 const name = (e.target.name)
//                                 const value = isCheckBox ? e.target.checked : e.target.value
//                                 storeWellChanges(productionString.value, name, value, i)
//                                 // storeWellChanges(productionString.value, 'productionString', productionString.value, i)
//                                 // storeWellChanges(productionString.value, 'reservior', assetData.reserviors[i].label, i)
//                             }
//                             const handleFluidTypeChange = (e) => {
//                                 storeWellChanges(productionString.value, 'fluidType', e.value, i)
//                             }
//                             const col = setupData?.wellsData[productionString.value]

//                             return (
//                                 <tr className="border-b " key={col?.productionString} >
//                                     <td className="!min-w-[200px] text-left block pl-2 " >
//                                         <CheckInput key={(col?.isSelected ? 1 : 0) + col?.productionString} name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={productionString.label} />
//                                     </td>
//                                     <td>
//                                         {getReservoirByProdString(productionString?.value)}
//                                     </td>
//                                     <td>
//                                         <Input type='select' placeholder={"Select"} required={col?.isSelected} disabled={!col?.isSelected}
//                                             name="fluidType" onChange={handleFluidTypeChange} defaultValue={{ label: col?.fluidType, value: col?.fluidType }}
//                                             options={[{ label: 'Oil', value: 'Oil' }, { label: 'Gas', value: 'Gas' }]} />
//                                     </td>
//                                     <td>
//                                         <input required={col?.isSelected} disabled={!col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.noOfChokes} name="noOfChokes" onChange={handleWellChanges} />
//                                     </td>
//                                     <td >
//                                         <input required={col?.isSelected} disabled={!col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.chokeSize} name="chokeSize" onChange={handleWellChanges} />
//                                     </td>
//                                     <td className="min-w-[230px]">
//                                         <input required={col?.isSelected} disabled={!col?.isSelected} min={dayjs().format("YYYY-MM-DDTHH:mm")} type="datetime-local" className={styles.inputBox} defaultValue={col?.startDate} name="startDate" onChange={handleWellChanges} />
//                                     </td>
//                                     <td className="min-w-[230px]">
//                                         <input required={col?.isSelected} disabled={!col?.isSelected} key={col?.startDate} min={dayjs(col?.startDate).format("YYYY-MM-DDTHH:mm")} type="datetime-local" className={styles.inputBox} defaultValue={col?.endDate} name="endDate" onChange={handleWellChanges} />
//                                     </td>
//                                     <td>
//                                         <input className={styles.inputBox} required={col?.isSelected} disabled={!col?.isSelected} type='number' value={dayjs(col?.endDate).diff(col?.startDate, 'hours')} name="duration" />
//                                     </td>
//                                     <td>
//                                         <input className={styles.inputBox} required={col?.isSelected} disabled={!col?.isSelected} type='number' defaultValue={col?.stabilizatonDuration} name="stabilizatonDuration" onChange={handleWellChanges} />
//                                     </td>
//                                 </tr>
//                             )
//                         }
//                         )
//                     }


//                 </tbody>
//             </table>

//         </div>

//     </>
// }
// const StaticParameters = () => {

//     const setupData = useSelector(state => state.setup)



//     return <>
//         <div className='flex justify-between !w-[100%]'>
//             <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
//             {/* <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
//                 defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
//                 onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
//                 options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} /> */}
//         </div>

//         <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

//             <table className={styles.table}>
//                 <thead className=" mt-5">
//                     <tr className="pt-4 w-full justify-between text-left" >
//                         <th className="pl-3">Static Parameters</th>
//                         <th >Define Value</th>
//                         {/* <th>Fluid Type</th>
//                         <th>No of Chokes</th>
//                         <th> Chokes Size(/64")</th>
//                         <th> Start Date</th>
//                         <th> End Date</th>
//                         <th> Duration (Hrs)</th>
//                         <th> Stabilization Duration (Hrs)</th> */}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         Object.values(setupData?.wellsData || {}).map((wellData, i) => {
//                             // const col = wellData
//                             // if (!col?.isSelected) return null
//                             return (
//                                 <tr className="border-b justify-between " >
//                                     <td className="w-full" >
//                                         {/* <CheckInput name={'isSelected'} defaultChecked={col?.isSelected} disabled label={well.label} /> */}
//                                         {'Initial GOR RSI (SCF/STB)'}
//                                     </td>
//                                     <td>
//                                         <input type="number" className={styles.inputBox} defaultValue={'286'} disabled />
//                                     </td>
//                                     {/* <td>
//                                         <input type="text" className={styles.inputBox} defaultValue={col?.fluidType} disabled />
//                                     </td>
//                                     <td>
//                                         <input type="number" className={styles.inputBox} defaultValue={col?.noOfChokes} disabled />
//                                     </td>
//                                     <td  >

//                                         <input type="number" className={styles.inputBox} defaultValue={col?.chokeSize} disabled />

//                                     </td>
//                                     <td>
//                                         <input type="datetime-local" className={styles.inputBox} defaultValue={col?.startDate} disabled />
//                                     </td>
//                                     <td>
//                                         <input type="datetime-local" className={styles.inputBox} defaultValue={col?.endDate} disabled />
//                                     </td>
//                                     <td>
//                                         <input className={styles.inputBox} type='number' value={dayjs(col?.endDate).diff(col?.startDate, 'hours')} disabled />
//                                     </td>
//                                     <td>
//                                         <input className={styles.inputBox} type='number' defaultValue={col?.stabilizatonDuration} disabled />
//                                     </td> */}
//                                 </tr>
//                             )
//                         }
//                         )
//                     }


//                 </tbody>
//             </table>

//         </div>

//     </>
// }

const ImporFiles = () => {
    const dispatch = useDispatch()
    const handleFiles = async (name, jsonData) => {

        try {
            console.log({ name, jsonData })
            dispatch(setSetupData({ name, value: jsonData }))
        } catch (error) {
            console.log(error)
        }
    }
    const setupData = useSelector(state => state.setup)

    return (
        <div className="w-full  flex ">
            <ExcelToCsv className="block  border w-[50%] rounded m-3 p-3" onComplete={jsonData => handleFiles('chokeSizes', jsonData)}>

                <BsPlus size={50} className="mx-auto" />
                {setupData?.chokeSizes?.name || " Import file for production strings chokes"}

            </ExcelToCsv>
            {/* <input name="chokeSizes" type="file" hidden onChange={handleFiles} id="chokeSizes" /> */}


            {/* <input t name="staticParameters" type="file" hidden onChange={handleFiles} id="reserviorParaemters" /> */}
            <ExcelToCsv className="block border w-[50%] rounded m-3 p-3" onComplete={jsonData => handleFiles('staticParameters', jsonData)}>

                <BsPlus size={50} className="mx-auto" />
                {setupData?.staticParameters?.name || "Import file for Reservoir Parameters"}

            </ExcelToCsv>
        </div>
    )
}

const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()
    return (
        <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save Schedule as</Text>
            <Input label={''} required defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
        </div>
    )
}
const Exists = () => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "merSchedule" } })

    return (<>
       <div className="pl-5 mt-5 ">
       <Button>
            <a href={'https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/MER%20DATA%20Import%20(1).xlsx?alt=media&token=aa2321b6-4f81-447f-b8a2-14140f98389d'} download>Download Template</a>
        </Button>
       </div>
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files name={(file) => `${createWellTitle(file, 'MER Data Schedule')}`} files={data} actions={[
                { name: 'Remark', to: (file) => `/users/fdc/mer-data/schedule-table?id=${file?.id}` },
                { name: 'MER DATA Result', to: (file) => `/users/fdc/mer-data/mer-data-result-table?scheduleId=${file?.id}` },
            ]} />

        </div></>
    )
}

const Schedule = () => {
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
            const chokeSizes = setupData?.chokeSizes
            const staticParameters = setupData?.staticParameters
            // const chokeSizesFileName = await firebaseFileUpload(chokeSizes, Math.random() + chokeSizes?.name)
            // const reservoirStaticParametersFileName = await firebaseFileUpload(staticParameters, Math.random() + staticParameters?.name)

            const payload = {
                title: setupData?.title, chokeSizes, staticParameters, date: dayjs().format("DD/MM/YYYY")
            }
            await firebaseFunctions('createMerSchedule', payload)
            // console.log({ data }, '----')

            // dispatch(setWholeSetup(data))
            dispatch(closeModal())

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
                    title={'Setup MER Data Schedule'}
                    steps={["Import files", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    stepComponents={[
                        // <SelectAsset />,
                        // <DefineSchedule />,
                        // <StaticParameters />,
                        <ImporFiles />,
                        <SaveAs />
                    ]}
                />
            }
        </>
    )


}

export default Schedule
