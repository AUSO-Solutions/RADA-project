import { Box } from '@mui/material'
import { colors, images } from 'Assets'
import { Button } from 'Components'
import RadaStepper from 'Components/Stepper'
import Text from 'Components/Text'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { firebaseFunctions } from 'Services'
import { openModal } from 'Store/slices/modalSlice'
import { setWholeSetup } from 'Store/slices/setupSlice'


const Setup = ({ title, steps = [], onBack, onNext, stepComponents = [], onSave = () => null, type , rightLoading, onSetWholeSetup}) => {
    const   SetupModal = ({ }) => {
        const [activeStep, setActiveStep] = useState(0)


        const back = () => {
            setActiveStep(prev => {
                if (prev !== 0) return prev - 1
                return 0
            })
        }
        const next = () => {
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
            <Box component={'div'} width={'700px'} height={'700px'} borderRadius={8} bgcolor={'white'}>
                <Text weight={500} size={"24px"}>{title}</Text>
                <br /> <br />
                <RadaStepper steps={steps} activeStep={activeStep} />
                <Box component={'div'} my={3} width={'100%'} minHeight={'50% !important'} >
                    {stepComponents && stepComponents[activeStep]}
                </Box>

                <Box component={'div'} display={'flex'} justifyContent={'space-between'} width={'100%'}>
                    <Button bgcolor={'white'} onClick={back} color={colors.rada_blue} style={{ border: `1px solid ${colors.rada_blue} ` }} width={'177px'} height={'55px'}>
                        Back
                    </Button>
                    <Button loading={rightLoading} width={'177px'} height={'55px'} onClick={next} >
                        {activeStep === steps.length - 1 ? "Save" : "Next"}
                    </Button>
                </Box>



            </Box>)

    }
    const dispatch = useDispatch()
    const [setups, setSetups] = useState([])
    useEffect(() => {
        const getSetup = async () => {
            const data = await firebaseFunctions('getSetups', { setupType: type })
            console.log(data)
            if (data?.data?.length) setSetups(data?.data)
        }
        getSetup()
    }, [type])
    return (<>
        {
            setups?.length ?
                <div className='p-3'>
                    <Text size={24}> Volume measurement setups </Text> <br />

                    <div className='my-3'>
                        {
                            setups?.map(setup =>
                            (
                                <div className='border my-1 rounded w-[200px] p-2 cursor-pointer' onClick={()=> {
                                    dispatch(setWholeSetup(setup))
                                    onSetWholeSetup()
                                    
                                }}>
                                    {setup?.asset} {setup?.id}
                                </div> 
                            )
                            )
                        }
                    </div>

                    <Button onClick={() => dispatch(openModal({
                            title: '',
                            component: <SetupModal/>
                        }))}>
                        Create new setup
                    </Button>
                </div>
                :
                <div className='w-[100%] !h-[100%] flex items-center justify-center'>




                    <div className='flex flex-col gap-3 items-center text-center justify-center'>
                        <img src={images.setupIcon} width={158} alt="setup icon" />
                        <Text className={'text-center'}>
                            Setup Parameters for Report using the button below
                        </Text>
                        <Button onClick={() => dispatch(openModal({
                            title: '',
                            component: <SetupModal/>
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