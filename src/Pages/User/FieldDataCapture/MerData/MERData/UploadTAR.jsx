import { Download } from '@mui/icons-material'
import { colors } from 'Assets'
import { Button } from 'Components'
import ExcelToCsv from 'Partials/ExcelToCSV'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { closeModal } from 'Store/slices/modalSlice'

const UploadTAR = ({ merResult }) => {
    const [file, setFile] = useState({})
    const [uploadedData,setUploadedData] = useState([])
    const navigate = useNavigate()
    const dispatch =  useDispatch()
    // const [canProceed,setCanProceed] = useState(false)
    const proceed = () => {
        const merResultData = Object.values(merResult?.merResultData || {})
        const Assets = uploadedData?.map(item => item?.Asset)
        const ProductionStringsInTAR = uploadedData?.map(item => item?.['Production String'])
        const allAssetsAreSame = Assets?.every(item => {
            return Assets[0] === item
        })
        if (!allAssetsAreSame) toast.error("All assets must be the same")
        if (Assets[0] !== merResult?.asset) {
            toast.error("TAR Asset and MER Result don't match")
            return
        }
        const ProductionStringsInMER = merResultData?.map(resultData => resultData?.productionString)
        const allProdStringsAreAvailable = ProductionStringsInTAR?.every(productionString => ProductionStringsInMER.includes(productionString))
        console.log(allProdStringsAreAvailable, ProductionStringsInMER, ProductionStringsInTAR)
        // console.log(Assets, ProductionStrings, allAssetsAreSame)
        // console.log(tar, merResultData)
        // setCanProceed(true)
        toast.success("Successful")
        dispatch(closeModal())
        navigate('/users/fdc/mer-data/tar-table')
    }


    return (
        <div className='w-[400px] p-2'>
            Upload Technical Allowable Rate (TAR) file for <b>{merResult?.title}</b> <br />

            <ExcelToCsv onComplete={setUploadedData} onSelectFile={setFile}
                className='rounded border border-dashed py-5 px-1 cursor-pointer'>
                {file?.name || " Import Technical Allowable Rate (TAR)  Excel file"}
            </ExcelToCsv>
            <a href="https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/MER%20TAR%20OML%20147.xlsx?alt=media&token=76470c61-4dbf-4ccd-be57-411d23b192e8" download>
                <Button bgcolor={'white'} color={colors.rada_blue} style={{ border: `.1px solid ${colors.rada_blue}` }} className={'mt-3 w-[100px] float-left'}>
                    Template <Download />
                </Button>
            </a>
            <Button disabled={!file} className={'mt-3 w-[100px] float-right'} onClick={proceed}>
                Proceed
            </Button>
        </div>
    )
}

export default UploadTAR