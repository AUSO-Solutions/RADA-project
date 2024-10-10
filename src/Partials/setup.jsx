import { Box } from '@mui/material'
import { colors, images } from 'Assets'
import { Button } from 'Components'
import RadaStepper from 'Components/Stepper'
import Text from 'Components/Text'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
// import { firebaseFunctions } from 'Services'
import { openModal } from 'Store/slices/modalSlice'


const Setup = ({ title, steps = [], onBack, onNext, stepComponents = [], onSave = () => null, type, rightLoading, onSetWholeSetup, existing }) => {
    const SetupModal = () => {
        const [activeStep, setActiveStep] = useState(0)
        const back = () => {
            setActiveStep(prev => {
                if (prev !== 0) return prev - 1
                return 0
            })
        }
        const next = (e) => {
            e.preventDefault()
            setActiveStep(prev => {
                if (prev !== steps?.length - 1) return prev + 1
                return steps.length - 1
            })
            if (activeStep === steps.length - 1) {
                console.log('first')
                onSave()
            }
        }

        return (
            <Box component={'form'} width={'700px'} height={'700px'} borderRadius={8} bgcolor={'white'} onSubmit={next}>
                <Text weight={500} size={"24px"}>{title}</Text>
                <br /> <br />
                <RadaStepper steps={steps} activeStep={activeStep} />
                <Box component={'div'} my={3} width={'100%'} minHeight={'50% !important'} >
                    {stepComponents && stepComponents[activeStep]}
                </Box>

                <Box component={'div'} display={'flex'} justifyContent={'space-between'} width={'100%'} mb={4}>
                    <Button bgcolor={'white'} onClick={back} color={colors.rada_blue} style={{ border: `1px solid ${colors.rada_blue} ` }} width={'177px'} height={'55px'}>
                        Back
                    </Button>
                    <Button loading={rightLoading} width={'177px'} height={'55px'} type='submit'  >
                        {activeStep === steps.length - 1 ? "Save" : "Next"}
                    </Button>
                </Box>
            </Box>)

    }
    const dispatch = useDispatch()
    const { search } = useLocation()
    useEffect(() => {
        //automatically open the modal
        const autoOpenSetupModal = new URLSearchParams(search).get('autoOpenSetupModal')
        if (autoOpenSetupModal) {
            dispatch(openModal({
                title: '',
                component: <SetupModal />
            }))
        }
    }, [search, dispatch])

    return (<>
        {
            existing ?
                <>
                    {existing}
                    <Button className={'ml-5'} onClick={() => dispatch(openModal({
                        title: '',
                        component: <SetupModal />
                    }))}>
                        Create new setup
                    </Button>
                </>
                :
                <div className='w-[100%] !h-[100%] flex items-center justify-center'>
                    <div className='flex flex-col gap-3 items-center text-center justify-center'>
                        <img src={images.setupIcon} width={158} alt="setup icon" />
                        <Text className={'text-center'}>
                            Setup Parameters for Report using the button below
                        </Text>
                        <Button onClick={() => dispatch(openModal({
                            title: '',
                            component: <SetupModal />
                        }))}>
                            Setup Parameters
                        </Button>
                    </div>

                </div>
        }
    </>
    )
}

export default Setup