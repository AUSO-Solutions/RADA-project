import { Button } from 'Components'
import { apiRequest } from 'Services'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
const RadaForm = ({
    btnText,
    btnClass,
    className, children, url, method,
    extraFields = {}, successMessage,
    validationSchema, noToken,
    onSuccess = () => null,
    onSubmit = () => null,
    modifyPayload = () => null
}) => {

    const [loading, setLoading] = useState(false)
    const callApi = async (payload) => {
        let params = {}
        if (method === 'get' && payload) params = { ...payload }
        setLoading(true)
        try {
            let final_payload = modifyPayload(payload) || payload
            const res = await apiRequest({ method, url, payload: final_payload, params, noToken })
            if (successMessage) { toast.success(successMessage) } else { toast.success('Successful') }
            onSuccess(res, payload)
        }
        catch (error) {
            throw error
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
        }
        formValues = { ...formValues, ...extraFields }
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
            <div>
                {children}
            </div>
            <Button className={`${btnClass} p-3 mt-8`} type='submit' loading={loading}>{btnText}</Button>
        </form>
    )
}

export { RadaForm }