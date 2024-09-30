import React, { useState } from 'react'
import Select from 'react-select'


const RadaSelect = ({ name, placeholder, onChange, options, isMulti, ...rest }) => {
    // console.log(options)

    const [value, setValue] = useState(isMulti ? [] : rest?.defaultValue)

    // useEffect(() => {
    //     if (isMulti) {
    //         const _c = value?.map(x => x?.value)
    //         onChange(_c)
    //     }
    //     else {
    //         onChange(value)
    //     }
    //     // eslint-disable-next-line
    // }, [value, options])

    //value, onChange

    return (
        <>
            <input required={rest?.required} key={rest?.key}  type='text' hidden name={name} value={isMulti ? value?.map(x => x?.value).join('-sal-,-sal-') + "select-array-list" : value ? value?.value : ""} />
            <Select placeholder={placeholder} options={options} isMulti={isMulti} onChange={(e) => {
                setValue(e)
                if (isMulti) {
                    const _c = e?.map(x => x?.value)
                    console.log(_c)
                    onChange(_c)
                }
                else {
                    onChange(e)
                }
            }} isDisabled={rest.disabled} {...rest}
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