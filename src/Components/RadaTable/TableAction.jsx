import React from 'react'

const TableAction = ({ actions = [], data, i }) => {
    return (

        actions.map(
            ({ text, component, onClick = () => null }) => <div className='px-2 py-2 border-b cursor-pointer ' onClick={() => onClick(data[i])}>{component} </div>
        )

    )
}

export default TableAction