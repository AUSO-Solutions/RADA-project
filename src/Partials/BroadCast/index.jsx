import { Box } from '@mui/material'
import { colors } from 'Assets'
import { Button } from 'Components'
import RadaStepper from 'Components/Stepper'
import Text from 'Components/Text'
import React, { useState } from 'react'



const BroadCast = ({ title = "", steps = [], stepsComponents = [] , onBroadcast=()=>null}) => {
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
        if (activeStep === steps.length - 2) {
            console.log('first')
            onBroadcast()
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