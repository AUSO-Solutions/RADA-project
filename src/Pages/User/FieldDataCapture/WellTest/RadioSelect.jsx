import React, { useState } from 'react'
import { FaRegCircle, FaRegDotCircle } from 'react-icons/fa'

const RadioSelect = ({ list = [], onChange = () => null, }) => {
    const [selected, setSelected] = useState(null)
    return (
        <div className='rounded flex border my-3 justify-evenly !w-[fit-content]'>
            {list?.map((item, i) => {
                // const isEven = i % 2 === 0
                return (
                    <div
                        style={{ backgroundColor: 'rgba(250, 250, 250, 1)', height: '40px' }}
                        className='text-center py-1 flex items-center justify-center gap-2 cursor-pointer  px-3'
                        onClick={
                            () => {
                                setSelected(item)
                                onChange(item)
                            }
                        }
                    >
                        {selected === item ? <FaRegDotCircle size={20} color='rgba(0, 163, 255, 1)' /> : <FaRegCircle color='grey' size={20} />
                        } <div className=' !break-keep'>{item}</div>
                    </div>)
            })}
        </div>
    )
}

export default RadioSelect