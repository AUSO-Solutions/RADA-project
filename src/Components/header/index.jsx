import { Stack } from '@mui/material'
import { Button } from 'Components'
import Text from 'Components/Text'
import React from 'react'

const Header = ({ name, btns = [], right }) => {
  return (
    <div className='w-[100%] items-center justify-between px-[25px]  border-b flex h-[70px]'>
      <Text size={"32px"} weight={500}>
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
  {right &&  <div>   {right}</div>}
    </div>
  )
}

export default Header