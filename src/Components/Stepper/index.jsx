import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { colors } from 'Assets';
import { FaCheckCircle, FaRegCircle, FaRegDotCircle } from "react-icons/fa";


const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: colors.rada_blue,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: colors.rada_blue,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? colors.rada_blue : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: colors.rada_blue,
    }),
    '& .QontoStepIcon-completedIcon': {
        color: colors.rada_blue,
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed && (
                <FaCheckCircle size={24} className="QontoStepIcon-completedIcon" />
            )}
            {active && (
                <FaRegDotCircle size={24} />
            )}
            {(!active && !completed) && (
                <FaRegCircle size={24} />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad', 'Create an ad'];

export default function RadaStepper({ activeStep = 0, steps = ['Step 1', 'Step 2', 'Step 3'] }) {
    return (
        <Stack sx={{ width: '100%' }}  justifyContent={'space-between'}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                {/* <QontoConnector sx={{width:'50px'}} /> */}
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
                {/* <QontoConnector /> */}
            </Stepper>
        </Stack>
    );
}
