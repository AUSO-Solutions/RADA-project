import { Button } from 'Components'
import { apiRequest } from 'Services'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
// import yup from 'yup';



const RadaForm = ({
    btnText, onSubmit = () => null,
    btnClass,
    className, children, url, method,
    extraFields = {}, successMessage,
    onSuccess = () => null, validationSchema , noToken}) => {

    const [loading, setLoading] = useState(false)


    const callApi = async (payload) => {
        let params = {}
        if (method === 'get' && payload) params = { ...payload }
        setLoading(true)
        try {
            const res = await apiRequest({ method, url, payload, params, noToken })
            if (successMessage) { toast.success(successMessage) } else { toast.success(res.data.message) }
            console.log({ res, payload })
            onSuccess(res, payload)
        }
        catch (error) {
            console.log({ payload })
            onSuccess(error, payload)
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
            <div>
                {children}
            </div>
            <Button className={`${btnClass} p-3 mt-4`} type='submit' loading={loading}>{btnText}</Button>
        </form>
    )
}


const RadaFormInput = ({ Component }) => (props) => {
    // const {} = useFormContext()
    return <Component {...props} />
}
export { RadaForm, RadaFormInput }