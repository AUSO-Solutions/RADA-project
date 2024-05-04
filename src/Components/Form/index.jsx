import { Button } from 'Components'
import { firebaseFunctions } from 'Services'

import React, { useState } from 'react'
import { toast } from 'react-toastify';

const RadaForm = ({
    btnText,
    btnClass,
    className, children, url, method,
    extraFields = {}, successMessage,
    validationSchema, noToken,
    inputsContainer,
    onSuccess = () => null,
    onSubmit = () => null,
    onError = () => null,
    modifyPayload = () => null,

}) => {

    const [loading, setLoading] = useState(false)
    const callApi = async (payload) => {
        let params = {}
        if (method === 'get' && payload) params = { ...payload }
        setLoading(true)
        try {
            let final_payload = modifyPayload(payload) || payload
            const res = await firebaseFunctions(url, final_payload)
            // const res = await apiRequest({ method, url, payload: final_payload, params, noToken })
            console.log(res,'ddd')
            // if (successMessage) { toast.success(successMessage) } else { toast.success(res?.message || 'Successful') }
            onSuccess(res, payload)
        }
        catch (error) {
            onError(error)
            // throw error
        } finally {
            setLoading(false)
        }
    }
    const submit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        let formValues = {}
        for (let [key, value] of formData.entries()) {
            formValues[key] = value
            console.log(value)
            if(String(value).includes('select-array-list')){
                formValues[key] = value?.replace('select-array-list').split("-sal-,-sal-")
            }

            console.log(formValues[key] )

        }
        formValues = { ...formValues, ...extraFields }
        console.log(formValues)
        onSubmit(formValues)
        if (validationSchema) {
            try {
                await validationSchema.validate(formValues, { abortEarly: false })
                callApi(formValues)
            } catch (error) {
                const errs = (error.errors)
                errs.forEach(err => {
                    toast.error(err)
                });
            }
        } else {
            callApi(formValues)
        }
    }

    return (
        <form onSubmit={submit} className={className}>
            <div className={`${inputsContainer}`}>
                {children}
            </div>
            {btnText
                ? <Button className={`${btnClass} font-bold p-3 mt-8`} type='submit' loading={loading}>{btnText}</Button>

                : <button hidden type='submit'></button>
            }
        </form>
    )
}

export { RadaForm }