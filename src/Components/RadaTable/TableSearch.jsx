import { RadaForm } from 'Components'
import React from 'react'
import { BsSearch } from 'react-icons/bs'

const TableSearch = ({ onSubmit = () => null, onChange = () => null }) => {
    return (
        <RadaForm onSubmit={onSubmit}>
            <div className='border  items-center flex w-[500px] !bg-[#F6F5F2] outline-none rounded my-2 py-1 px-2' ƒ>
                <input
                    type="text"
                    name="search"
                    onChange={onChange}
                    placeholder='Search...'
                    className=' w-[100%] !bg-[#F6F5F2] outline-none py-1 rounded'

                />
                <BsSearch fontWeight={600} />
            </div>
        </RadaForm>
    )
}

export default TableSearch