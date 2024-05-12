import { RadaForm } from 'Components'
import React from 'react'


const Action = ({ url, method, component }) => {
    return (
        <RadaForm url={url} method={method}  btnText={'Proceed'}>
            {component}
        </RadaForm>
    )
}

export default Action