import { Download } from '@mui/icons-material'
import { colors } from 'Assets'
import { Button } from 'Components'
import ExcelToCsv from 'Partials/ExcelToCSV'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { closeModal, openModal } from 'Store/slices/modalSlice'

const UploadTAR = ({ merResult, onProceed }) => {

    const dispatch = useDispatch()
 
    const Comp = () => {
        const [file, setFile] = useState({})
        const [uploadedData, setUploadedData] = useState([])
        const proceed = async () => {
            try {
                // console.log(title,file)
                const merResultData = (merResult?.merResultData || {})
                const Assets = uploadedData?.map(item => item?.Asset)
                const ProductionStringsInTAR = uploadedData?.map(item => item?.['Production String'])
                const allAssetsAreSame = Assets?.every(item => Assets[0] === item)
                // const allProdStringsAreAvailable = ProductionStringsInTAR?.every(productionString => productionString in merResultData)
                const stop = message => {
                    toast.error(message)
                    // console.log('----')
                    return;
                }
                // if (!title) return stop("Please provide a title")
                if (!file) return stop("Please provide a file")
                if (!allAssetsAreSame) return stop("All assets must be the same")
                // console.log(Assets, merResult)
                if (Assets[0] !== merResult?.asset) return stop("TAR Asset and MER Result don't match")
                // if (!allProdStringsAreAvailable) return stop("Some production strings in TAR file don't match the MER Production strings")
    
                const tarResultData = {}
                ProductionStringsInTAR.forEach((prodString) => {
                    const thisTarUploadedData = uploadedData?.find(item => item['Production String'] === prodString)
                    const fromMERData = merResultData?.[prodString]
                    tarResultData[prodString] = {
                        reservoir: thisTarUploadedData['Reservoir'],
                        productionString: prodString,
                        fluidType: thisTarUploadedData['Fluid Type'],
                        approvedTar: thisTarUploadedData['Approved TAR (bopd)'],
                        field: thisTarUploadedData['Field'],
                        startDate: thisTarUploadedData['Start Date'],
                        endDate: thisTarUploadedData['End Date'],
                        TAR_MER: thisTarUploadedData['MER (bopd)'],
                        RADA_MER: fromMERData?.mer,
                    }
                })
    
                dispatch(closeModal())
                toast.success("Successful")
                onProceed(tarResultData)
                console.log(tarResultData)
    
            } catch (error) {
                console.log(error)
            }
    
        }
        return (
            <div className='w-[400px] p-2 flex flex-col gap-2'>
                Upload Technical Allowable Rate (TAR) file for <span className='font-bold inline'>{merResult?.title}</span>

                {/* <Input name='title' placeholder="TAR Data title" onChange={(e) => setTitle(e.target.value)} /> */}
                <ExcelToCsv onComplete={setUploadedData} onSelectFile={setFile}
                    className='rounded-[12px] border-2 border-[lightgray] border-dashed py-2 px-1 cursor-pointer'>
                    {file?.name || " Import Technical Allowable Rate (TAR)  Excel file"}
                </ExcelToCsv>
                <div>
                    <a href="https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/MER%20TAR%20OML%20147.xlsx?alt=media&token=76470c61-4dbf-4ccd-be57-411d23b192e8" download>
                        <Button bgcolor={'white'} color={colors.rada_blue} style={{ border: `.1px solid ${colors.rada_blue}` }} className={'mt-3 w-[100px] float-left'}>
                            Template <Download />
                        </Button>
                    </a>
                    <Button disabled={!file} className={'mt-3 w-[100px] float-right'} onClick={proceed}>
                        Proceed
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <Button onClick={() => dispatch(openModal({ component: <Comp />, title: 'Import TAR' }))}>Import TAR </Button>
    )
}

export default UploadTAR