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
    ]
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
            <img src={images.file} alt="file" height={83} width={83} />   <Text size={18}>{file?.title}</Text>
            {
                menuViewed === i && <div className="absolute w-[100px] shadow !z-[100] flex flex-col gap-2 px-2 right-[-50px] border rounded shadow bottom-[-30px] bg-[white]">
                    {   actions.map(action => <Box component={action.to ? 'a' : 'div'} href={action.to(file)} onClick={() => action.onClick(file)} >{action.name} </Box>)
                    }
                </div>
            }
        </div>)
        // </div>
    )


}

export default Files