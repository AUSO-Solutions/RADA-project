import { RadaForm } from 'Components'
import React from 'react'


const Action = ({ url, method, component, onSuccess  =()=>null}) => {
    return (
        <RadaForm url={url} method={method}  btnText={'Proceed'} onSuccess={onSuccess}>
            {component}
        </RadaForm>
    )
}

export default Action