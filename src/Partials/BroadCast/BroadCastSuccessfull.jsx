import { CheckOutlined } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import Text from 'Components/Text'
import React from 'react'

const BroadCastSuccessfull = () => {
  return (
    <div className=' h-[200px] border gap-2 flex flex-col items-center justify-center p-2 rounded bg-[#F9FAFA]'>

      <Avatar sx={{ bgcolor: '#00A3FF0D' }}>
        <CheckOutlined sx={{ color: '#00A3FF' }} />
      </Avatar>
      <Text size={24}>
      Broadcast Successful
      </Text>
      <Text align={'center'} className={'block w-[85%] text-center'}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024 query has been sent successfully to the Field Engineers Group.</Text>
    </div>
  )
}

export default BroadCastSuccessfull