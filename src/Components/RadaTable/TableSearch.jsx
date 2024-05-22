import { RadaForm } from 'Components'
import React from 'react'

const TableSearch = ({ onSubmit = () => null, onChange = () => null }) => {
    return (
        <RadaForm onSubmit={onSubmit}>
            <input
                type="search"
                name="search"
                onChange={onChange}
                placeholder='search...'
                className='border outline-none rounded my-2 py-1 px-2'
            />
        </RadaForm>
    )
}

export default TableSearch