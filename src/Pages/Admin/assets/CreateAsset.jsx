import React from 'react'
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';



const CreateAsset = ({ updateUserId = null, defaultValues }) => {

    // console.log(defaultValues)
    const schema = Yup.object().shape({
        // email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    const dispatch = useDispatch()
    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Submit'}
            btnClass={'w-[100%] flex justify-center'}
            url={defaultValues ? 'updateAssetById' : "createAsset"} method={'post'}
            onSuccess={() => {
                toast.success('Successfully')
                dispatch(closeModal())
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
            <Stack direction={'row'} spacing={1}>
                <Input label={'OML'} name='name' defaultValue={defaultValues?.name} />
                <Input label={'Field'} name='field' defaultValue={defaultValues?.field} />
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Input label={'Well'} name='well' defaultValue={defaultValues?.well} />
                <Input label={'Production string'} name='productionString' defaultValue={defaultValues?.productionString} />
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Input label={'Reservoir'} name='reservoir' defaultValue={defaultValues?.reservoir} />
                <Input label={'Flowstation'} name='flowStation' defaultValue={defaultValues?.flowStation} />
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Input label={'Surface X Coordinates'} name='surfaceXcoordinate' defaultValue={defaultValues?.surfaceXcoordinate} />
                <Input label={'Surface Y Coordinates'} name='surfaceYcoordinate' defaultValue={defaultValues?.surfaceYcoordinate} />

            </Stack>



            {defaultValues?.id && <Input hidden label={''} name='assetId' value={defaultValues?.id} />}

        </RadaForm>
    )
}

export default CreateAsset