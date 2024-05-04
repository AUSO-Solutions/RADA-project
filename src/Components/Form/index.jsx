import { Button } from 'Components'
import { apiRequest } from 'Services'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
// import yup from 'yup';



const RadaForm = ({
    btnText, onSubmit = () => null,
    className, children, url, method,
    extraFields = {}, successMessage,
    onSuccess = () => null, validationSchema }) => {

    const [loading, setLoading] = useState(false)


    const callApi = async (payload) => {
        let params = {}
        if (method === 'get' && payload) params = { ...payload }
        setLoading(true)
        try {
            const res = await apiRequest({ method, url, payload, params })
            if (successMessage) { toast.success(successMessage) } else { toast.success(res.data.message) }
            onSuccess(res)
        }
        catch (error) {
            onSuccess()
        } finally {
            setLoading(false)

        }
    }
    const submit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        let formValues = {}
        // console.log(formData.entries())
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
            {children}
            <Button className={'p-3'} type='submit' loading={loading}>{btnText}</Button>
        </form>
    )
}


const RadaFormInput = ({ Component }) => (props) => {
    // const {} = useFormContext()
    return <Component {...props} />
}
export { RadaForm, RadaFormInput }