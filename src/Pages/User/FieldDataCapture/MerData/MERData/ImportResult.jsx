import { AttachFile } from '@mui/icons-material'
import { Button } from 'Components'
import dayjs from 'dayjs'
import ExcelToCsv from 'Partials/ExcelToCSV'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { openModal } from 'Store/slices/modalSlice'

const Import = ({ onProceed = () => null }) => {
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])

    const importFile = () => {
        const result = data.map(datum => {
            const productionString = datum?.['Production String']
            const reservoir = datum?.['Reservoir']
            const field = datum?.['Field']
            const chokeSize = datum?.['Choke (/64")']
            const gross = datum?.['Gross (blpd)']
            const oilRate = datum?.['Oil Rate (bopd)']
            const waterRate = datum?.['Water Rate (bwpd)']
            const gasRate = datum?.['Gas Rate (MMscf/day)']
            const gor = datum?.['GOR (scf/stb)']
            const sand = datum?.['Sand (pptb)']
            const fthp = datum?.['FTHP (psi)']
            const flp = datum?.['FLP (psi)']
            const chp = datum?.['CHP (psia)']
            const staticPressure = datum?.['Static Pressure (psi)']
            const orificePlateSize = datum?.['Orifice Plate Size (inches)']
            const remark = datum?.['Remark']

            return {
                productionString,
                // reservoir,
                // field,
                chokeSize,
                gross,
                oilRate,
                waterRate,
                gasRate,
                gor,
                sand,
                fthp,
                flp,
                chp,
                staticPressure,
                orificePlateSize,
                remark
            }

        })
        onProceed(result)

    }
    return (
        <div className='w-[300px]'>
            <ExcelToCsv className={'border rounded p-3 '} onSelectFile={setFile} onComplete={setData}>
                {file?.name || ' Import Mer test result'} <AttachFile />
            </ExcelToCsv> <br />
            <Button onClick={importFile} disabled={!file} className={'px-[50px]'}>Proceed</Button>
        </div>
    )

}
const ImprortResult = ({ onProceed = () => null }) => {

    const dispatch = useDispatch()
    return <Button onClick={() => dispatch(openModal({ component: <Import onProceed={onProceed} />, title: 'Import MER Data Result' }))}>Import Result</Button>
}

export default ImprortResult