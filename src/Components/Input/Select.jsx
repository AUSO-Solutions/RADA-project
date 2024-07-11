import React, { useEffect, useState } from 'react'
import Select from 'react-select'


const RadaSelect = ({ name, onChange, options, isMulti , ...rest}) => {


    const [value, setValue] = useState(isMulti ? [] : '')

    useEffect(() => {
        if (isMulti) { 
            const _c = value?.map(x => x?.value)
            console.log(_c)
            onChange(_c)
         }
        else { onChange(value) }
    }, [value, onChange])

    //

    return (
        <>
            <input type="hidden" name={name}  value={isMulti ? value?.map(x => x?.value).join('-sal-,-sal-') + "select-array-list" : value.value} />
            <Select options={options} isMulti={isMulti} onChange={setValue} {...rest} />
        </>
    )
}
export default RadaSelect