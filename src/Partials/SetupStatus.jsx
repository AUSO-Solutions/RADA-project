import React from 'react'
import { BsX, BsCheck } from "react-icons/bs"

const SetupStatus = ({setup}) => {
    return (

        <>
            {setup?.status === 'approved' && <BsCheck color="green" size={18} fontWeight={700} />}
            {setup?.status === 'queried' && <BsX color="red" size={18} fontWeight={700} />}
        </>

    )
}

export default SetupStatus