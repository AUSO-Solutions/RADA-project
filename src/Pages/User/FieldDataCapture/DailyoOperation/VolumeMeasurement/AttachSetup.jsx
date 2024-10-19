import { Attachment } from '@mui/icons-material'
import { Button, Input } from 'Components'
import { useGetSetups } from 'hooks/useSetups'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { firebaseFunctions } from 'Services'
import { closeModal, openModal } from 'Store/slices/modalSlice'

const AttachSetup = ({ setup }) => {
    const Attach = () => {
        
        const { setups: data } = useGetSetups("volumeMeasurement")
        
        const [loading, setLoading] = useState(false)

        // console.log(data)
        const [selectedSetupId, setSelectedSetupId] = useState()
        const save = async () => {
            try {
                if (!selectedSetupId) { toast.error('Select setup'); return; }

                setLoading(true)
                await firebaseFunctions('updateSetup', { id: setup?.id, setupType: 'volumeMeasurement', attachmentId: selectedSetupId })
                await firebaseFunctions('updateSetup', { id: selectedSetupId, setupType: 'volumeMeasurement', attachmentId: setup?.id })

                toast.success("Setup attached")
                dispatch(closeModal())
            } catch (error) {

            } finally {
                setLoading(false)
            }

        }
        return (
            <div className='w-[300px] h-[100px]'>
                Add a Net Oil or Gross setup

                <Input type='select' onChange={(e) => setSelectedSetupId(e.value)} options={data
                    ?.filter(datum => datum?.fluidType !== setup?.fluidType && datum?.asset === setup?.asset).map(datum => ({ label: datum?.title, value: datum?.id }))} />

                <Button loading={loading} onClick={save} className={'my-2 w-[100px]'}>Add</Button>
            </div>
        )
    }

    const dispatch = useDispatch()
    return (
        <>
            {!setup?.attachmentId ? 
            <Button onClick={() => dispatch(openModal({ component: <Attach />, title: 'Attach Setup' }))} ><Attachment /> Attach Setup</Button> : null}





        </>
    )
}

export default AttachSetup