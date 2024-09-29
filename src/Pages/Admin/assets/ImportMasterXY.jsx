import { FileUpload } from '@mui/icons-material'
import { Button } from 'Components'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { firebaseFunctions } from 'Services'
import handleError from 'Services/handleError'
import { closeModal } from 'Store/slices/modalSlice'
import cvsToJson from 'utils/cvsToJson'


const ImportMasterXY = () => {
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(false)

    const firstCharToLowerCase = (str) => {
        const [firstChar, ...rest] = str
        return firstChar.toLowerCase() + rest.join('')
    }
    const dispatch = useDispatch()

    const saveImport = () => {
        if (!file) {
            toast.info('Please select a file')
            return
        }
        if (file.type !== 'text/csv') {
            toast.info('File selected must be CSV')
            return
        }

        cvsToJson(file, async (jsonData) => {
            const formatted = jsonData.map(datum => {
                const res = Object.entries(datum)?.map(entry => ([firstCharToLowerCase(entry[0]), entry[1]]))

                return Object.fromEntries(res)
            })
            const data = formatted?.map(item => ({

                name: item?.asset,
                field: item?.field,
                well: item.wellId,
                flowStation: item?.flowstation,
                ...item

            }))
            setLoading(true)
            try {
                await firebaseFunctions('importMasterXY', { dataList: data })
                dispatch(closeModal())
            } catch (error) {
                handleError(error)

            }finally{
                setLoading(false)
            }


        })
    }
    
    return (
        <div className='w-[400px]'>
            <label htmlFor="fileInput" className='flex flex-col items-center font-bold justify-center border h-[100px] w-full rounded p-3'>
                Please select a file <FileUpload />
                <div>      {file?.name}</div>
            </label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className='hidden' id='fileInput' />
            <Button loading={loading} onClick={saveImport} className={'mt-5'}>
                Proceed
            </Button>
        </div>
    )
}

export default ImportMasterXY