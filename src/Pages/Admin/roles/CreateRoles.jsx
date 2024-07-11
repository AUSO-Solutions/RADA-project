import React, { useState } from 'react'
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';
import CheckInput from 'Components/Input/CheckInput';
import { permissions } from 'Assets';



const CreateRoles = ({ updateUserId = null, defaultValues }) => {

    const schema = Yup.object().shape({
        roleName: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    const [selectedPermissions, setSelectedPermissions] = useState(defaultValues?.permissions || [])
    const handleCheck = (e, permission) => {
        const checked = e.target.checked
        setSelectedPermissions(prev => {
            if (checked) return [...prev, permission]
            if (!checked) return prev.filter(x =>  x !== permission)
        })

    }
    const dispatch = useDispatch()
    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Submit'}
            btnClass={'w-[100%] flex justify-center'}
            url={defaultValues ? 'updateRole' : "createRole"} 
            method={'post'}
            onSubmit={console.log}
            extraFields={{permissions:selectedPermissions

            }}

            onSuccess={() => {
                // toast.success('Successfully')
                dispatch(closeModal())
            }}
            className={'!w-[400px]'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px !importantx', gap: '20px' }} >

            <Input label={'Role name'} name='roleName' defaultValue={defaultValues?.roleName} />
            <br />

            Select perrmissions
            <div className='flex flex-col'>
                {
                    permissions.map((permission, i) => <CheckInput label={permission} type='checkbox' defaultChecked={defaultValues?.permissions.includes(permission)} onChange={(e) => handleCheck(e, permission)} />)
                }

            </div>
            {/* <Input label={'Roles'} name='roles' /> */}
            {/* {!defaultValues?.email && <Input label={'Password'} name='password' value={generatePass()} />} */}
            {defaultValues?.id && <Input hidden label={''} name='roleId' value={defaultValues?.id} />}

        </RadaForm>
    )
}

export default CreateRoles