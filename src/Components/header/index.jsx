import { Stack } from '@mui/material'
import { Button } from 'Components'
import Text from 'Components/Text'
import React from 'react'

const Header = ({ name, btns = [] }) => {
  return (
    <div className='w-[100%] items-center justify-between px-[25px]  border-b flex h-[70px]'>
      <Text weight={600}>
        {name}
      </Text>
      <Stack direction={'row'} spacing={2}>
        {
          btns.map(btn => (<Button onClick={btn?.onClick} >
            {btn?.text}
          </Button>
          ))
        }
      </Stack>
    </div>
  )
}

export default Header