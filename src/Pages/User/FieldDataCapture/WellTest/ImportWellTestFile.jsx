import { useDispatch, useSelector } from "react-redux"
import { setSetupData } from "Store/slices/setupSlice"
import { Button } from "Components"
import { useState } from "react"
import Text from "Components/Text"
import { toast } from "react-toastify"
import { useAssetByName } from "hooks/useAssetByName"
import dayjs from "dayjs"
import ExcelToCsv from "Partials/ExcelToCSV"
import { AttachFile } from "@mui/icons-material"


export const ImportWellTestSchedule = ({ type = 'wellTestSchedule', btnText, onComplete = () => null }) => {
    const [scheduleJson, setScheduleJson] = useState()
    const [file, setFile] = useState()
    const setupData = useSelector(state => state.setup)
    const asset = useAssetByName(setupData?.asset)
    // const { assetNames } = useAssetNames()
    const dispatch = useDispatch()
    const onClick = () => {

        const tests = scheduleJson.map(json => {
            const testResultsFields = type === 'wellTestResult' ? {
                gross: json['CURRENT GROSS PROD (BPD)'],
                oilRate: json['Oil Rate (bopd)'],
                waterRate: json['Water (bpd)'],
                gasRate: json['GAS PRODUCED (MMscf)'],
                bsw: json['BS&W'],
                gor: json['GOR'],
                fthp: json['FTHP (PSI)'],
                flp: json['FLP (PSI)'],
                chp: json['CHP (PSI)'] || null,
                staticPressure: json['STATIC Pressure (psi)'],
                orificePlateSize: json['Orifice plate size'],
                sand: 0,
                remark: json['REMARKS']
            } : {}
            return {
                productionString: json['Producing Strings'],
                reservoir: json['Reservoir'],
                flowstation: json['FACILITY'],
                field: json['Field'],
                noOfChokes: 1,
                chokeSize: json['BEAN SIZE'],
                stabilizatonDuration: 1,
                duration: json['Duration'],
                startDate: dayjs(json['DATE']).format("YYYY-MM-DDTHH:mm"),
                endDate: dayjs(json['DATE']).add(json['Duration'], 'hours').format("YYYY-MM-DDTHH:mm"),
                ...testResultsFields,

            }
        })
        const flowstationExist = tests?.every(test => asset?.flowStations?.includes(test?.flowstation))
        const stringExist = tests?.every(test => {
            // console.log(test?.productionString, asset?.productionStrings?.includes(test?.productionString), asset?.productionStrings.find(str => str === test?.productionStrings))
            return asset?.productionStrings?.includes(test?.productionString)
        })
        const reservoirExist = tests?.every(test => asset?.reservoirs?.includes(test?.reservoir))
        const fieldExist = tests?.every(test => {
            return asset?.fields.includes(test?.field)
            // return false
        })

        if (!flowstationExist) { toast.error('Some flowstations do not match MasterXY'); return }
        if (!stringExist) { toast.error('Some production strings do not match MasterXY'); return }
        if (!reservoirExist) { toast.error('Some reservoirs do not match MasterXY'); return }
        if (!fieldExist) { toast.error('Some fields do not match MasterXY'); return }
        const flowstations = Array.from(new Set(tests?.map(test => test?.flowstation)))
        const productionStrings = Array.from(new Set(tests?.map(test => test?.productionString)))
        dispatch(setSetupData({ name: 'flowstations', value: flowstations }))
        dispatch(setSetupData({ name: 'productionStrings', value: (setupData?.productionStrings || [])?.concat(productionStrings) }))
        const toNum = (num) => parseFloat(num?.replaceAll(',', '') || 0)
        const results = asset.assetData.map(({ productionString, flowstation, reservoir, field }) => {
            const thisData = tests.find(test => test.productionString === productionString)
            const testResultsFields = type === 'wellTestResult' ? {
                gross: toNum(thisData?.gross),
                oilRate: toNum(thisData?.oilRate),
                waterRate: toNum(thisData?.waterRate),
                gasRate: toNum(thisData?.gasRate),
                bsw: toNum(thisData?.bsw),
                gor: toNum(thisData?.gor),
                fthp: toNum(thisData?.fthp),
                flp: toNum(thisData?.flp),
                chp: toNum(thisData?.chp),
                staticPressure: toNum(thisData?.staticPressure),
                orificePlateSize: thisData?.orificePlateSize,
                sand: 0,
                remark: thisData?.remark,
            } : {}
            return [
                productionString, {
                    productionString: productionString,
                    reservoir: reservoir,
                    flowstation: flowstation,
                    field: field,
                    noOfChokes: thisData ? 1 : null,
                    chokeSize: thisData?.chokeSize || null,
                    stabilizatonDuration: thisData?.chokeSize ? 1 : null,
                    duration: thisData?.duration || 0,
                    startDate: thisData?.startDate || null,
                    endDate: thisData?.endDate || null,
                    isSelected: thisData ? true : false,
                    fluidType: thisData ? 'Oil' : null,
                    ...testResultsFields,

                }
            ]
        })
        dispatch(setSetupData({ name: 'wellsData', value: Object.fromEntries(results) }))
        onComplete()
        toast.success('File added to setup successfully!')
    }
    return (
        <div className="flex flex-col gap-2 w-[100%] p-2">
            <div className="flex gap-3 items-center">
                <ExcelToCsv className={'border p-3 rounded flex items-center border-dashed justify-between'} onComplete={setScheduleJson} onSelectFile={setFile}>

                    {file?.name || <> <Text> Import Well Test Scedule</Text> <AttachFile /></>}
                </ExcelToCsv>
                <Button className={'px-3'} onClick={onClick} disabled={!file}>{btnText || 'Confirm file'}</Button>
                <Button width={150} >
                    <a href={'/DownloadTemplates/OML24August2024WellTest.xlsx'} download>Download Template</a>
                </Button>

            </div>
        </div>
    )
}