import { Box } from '@mui/material'
import { colors } from 'Assets'
import { Button } from 'Components'
import RadaStepper from 'Components/Stepper'
import Text from 'Components/Text'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { firebaseFunctions } from 'Services'
import { clearFormdata } from 'Store/slices/formdataSlice'
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice'
import { firebaseFileUpload, firebaseGetUploadedFile } from 'utils'

const BroadCast = ({ setup = {}, title = "", steps = [], stepsComponents = [], onBroadcast = () => null, link, subject, type, date, broadcastType='wellTestandMer' }) => {
    const [activeStep, setActiveStep] = useState(0)

    // const typesAllowed = ['wellTestandMer', 'dailyProduction', '']
    const dispatch = useDispatch()
    const formdata = useSelector(state => state?.formdata)
    useEffect(() => {
        return () => {
            dispatch(clearFormdata())
        }
    }, [dispatch])
    const back = () => {
        setActiveStep(prev => {
            if (prev !== 0) return prev - 1
            return 0
        })
    }
    const next = async (e) => {
        e.preventDefault()

        if (activeStep === steps.length - 2) {

            dispatch(setLoadingScreen({ open: true }))
            try {
                console.log('first', link, formdata)

                const filepath = await firebaseFileUpload(formdata?.file, formdata?.file?.name)
                const file_url = await firebaseGetUploadedFile(filepath)
                await firebaseFunctions('broadcast', { groups: formdata?.selectedGroups, asset: setup?.asset, users: formdata?.selectedUsers, attachment: file_url, pagelink: link, subject, type, date, broadcastType })
                onBroadcast()
                setActiveStep(prev => {
                    if (prev !== steps?.length - 1) return prev + 1
                    return steps.length - 1
                })
            } catch (error) {
                console.log(error)
            } finally {
                dispatch(setLoadingScreen({ open: false }))
            }
        } else {
            setActiveStep(prev => {
                if (prev !== steps?.length - 1) return prev + 1
                return steps.length - 1
            })
        }
    }
    return (
        <form className='w-[600px] flex flex-col ' onSubmit={next}>

            <Text size={20} weight={600}>{title}</Text>
            <br />
            <RadaStepper steps={steps} activeStep={activeStep} />


            <div className='my-[50px]'>
                {stepsComponents[activeStep]}
            </div>

            {activeStep !== steps.length - 1 && <Box component={'div'} display={'flex'} justifyContent={'space-between'} width={'100%'} mb={4}>
                <Button bgcolor={'white'} onClick={back} color={colors.rada_blue} style={{ border: `1px solid ${colors.rada_blue} ` }} width={'177px'} height={'55px'}>
                    Back
                </Button>
                <Button width={'177px'} height={'55px'} type='submit'  >
                    {activeStep === steps.length - 2 ? "Broadcast" : "Next"}
                </Button>
            </Box>}


        </form>
    )
}

export default BroadCast