import { Box } from '@mui/material'
import { images } from 'Assets'
import Text from 'Components/Text'
import React, { useState } from 'react'

const Files = ({
    files = [
        { title: 'Title' }
    ],
    actions = [
        { name: 'action', to: () => '', onClick: () => null, hidden: () => true,  }
    ],
    name = () => null,
    bottomRight = () => null
}) => {
// console.log(files)
    const [menuViewed, setMenuViewed] = useState(null)
    const viewMenu = (i) => {
        setMenuViewed(prev => {
            if (prev === i) return null
            return i
        })
    }
    return (
        // <div className=" flex flex-wrap gap-4 m-5 ">
        files?.map((file, i) => <div key={i}  onClick={() => viewMenu(i)} className="w-[250px] relative border !shadow rounded-[8px] px-3 flex items-center cursor-pointer gap-3">
            <img src={images.file} alt="file" height={83} width={83} />   <Text className={''} size={12}>{name(file) || file?.title}</Text>
            {
                menuViewed === i && <div className="absolute w-fit shadow !z-[100] flex flex-col gap-2 right-[-50px] text-[white] rounded shadow top-[50px] py-1 !w-[100px] bg-[grey]">
                    {actions.filter(action => action?.hidden ?  action?.hidden(file) : true ).map((action, actionIndex) => <Box component={action.to ? 'a' : 'div'} className='px-3 flex items-center' href={action.to(file)} onClick={() => {
                        if(action?.onClick) action?.onClick(file)
                    }} >{action.name} </Box>)
                    }
                </div>
            }

            <div className='!absolute !bottom-0 right-0 pr-2 pb-1 '>{bottomRight(file)}</div>
        </div>)
        // </div>
    )


}

export default Files