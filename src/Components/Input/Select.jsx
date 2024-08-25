import React, { useEffect, useState } from 'react'
import Select from 'react-select'


const RadaSelect = ({ name, onChange, options, isMulti ,...rest }) => {


    const [value, setValue] = useState(isMulti ? [] : rest?.defaultValue )

    useEffect(() => {
        // console.log({value}) 
        if (isMulti) {
            const _c = value?.map(x => x?.value)
            console.log(_c)
            onChange(_c)
        }
        else {
            console.log(value)
            onChange(value)
        }
        // eslint-disable-next-line
    }, [value])

    //value, onChange

    return (
        <>
            <input required={rest?.required} type='text' hidden name={name} value={isMulti ? value?.map(x => x?.value).join('-sal-,-sal-') + "select-array-list" : value ? value?.value : ""} />
            <Select options={options} isMulti={isMulti} onChange={setValue} isDisabled={rest.disabled} {...rest} required
                styles={{
                    control: (baseStyles) => ({ ...baseStyles, borderRadius: '12px' }),
                    // container: (baseStyles) => ({ ...baseStyles, height: 'auto', padding: 0, }),
                    valueContainer: (baseStyles) => ({ ...baseStyles, height: '40px', padding: 0, paddingLeft: 10 }),
                    indicatorSeparator: (baseStyles) => ({ display: 'none' }),
                    input: (baseStyles) => ({ ...baseStyles, padding: 0, })
                }} />
        </>
    )
}
export default RadaSelect