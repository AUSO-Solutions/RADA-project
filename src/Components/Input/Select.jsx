import React, { useEffect, useState } from 'react'
import Select from 'react-select'


const RadaSelect = ({ name, onChange, options }) => {


    const [value, setValue] = useState('')
    useEffect(() => {

        onChange(value)
    }, [value, onChange])
    return (

        <>
            <input type="hidden" name={name} value={value.value} />
            <Select options={options}  onChange={setValue} />
        </>
    )
}
export default RadaSelect