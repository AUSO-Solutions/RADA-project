import { Box } from '@mui/material'
import { images } from 'Assets'
import Text from 'Components/Text'
import React, { useState } from 'react'

const Files = ({
    files = [
        { title: 'Title' }
    ],
    actions = [
        { name: 'action', to: () => '', onClick: () => null }
    ],
    name = () => null
}) => {

    const [menuViewed, setMenuViewed] = useState(null)
    const viewMenu = (i) => {
        setMenuViewed(prev => {
            if (prev === i) return null
            return i
        })
    }
    return (
        // <div className=" flex flex-wrap gap-4 m-5 ">
        files?.map((file, i) => <div onClick={() => viewMenu(i)} className="w-[250px] relative border !shadow rounded-[8px] px-3 flex items-center cursor-pointer gap-3">
            <img src={images.file} alt="file" height={83} width={83} />   <Text size={14}>{name(file) || file?.title}</Text>
            {
                menuViewed === i && <div className="absolute w-fit  shadow !z-[100] flex flex-col gap-2 right-[-50px] border rounded shadow bottom-[-70px] bg-[white]">
                    {actions.map((action, actionIndex) => <Box component={action.to ? 'a' : 'div'} className='font-bold py-1 px-3 flex items-center' borderBottom={actions.length !== actionIndex + 1 ? '1px grey solid' : ''} href={action.to(file)} onClick={() => action.onClick(file)} >{action.name} </Box>)
                    }
                </div>
            }
        </div>)
        // </div>
    )


}

export default Files