import Text from 'Components/Text'
import React from 'react'
import LineChart from './Line'

const ProductionSurveilance = () => {
  return (
    <div className='p-3 flex flex-wrap gap-3 w-full '>
      <div className='w-[48%] h-[500px] border rounded p-3 '>
        <Text size={20} >Chart</Text>
        <hr />
        <LineChart/>
      </div>
      <div className='w-[48%] h-[500px] border rounded p-3 '>
        <Text size={20} >Chart</Text>
        <hr />
      </div>
      <div className='w-[48%] h-[500px] border rounded p-3 '>
        <Text size={20} >Chart</Text>
        <hr />
      </div>
      <div className='w-[48%] h-[500px] border rounded p-3 '>
        <Text size={20} >Chart</Text>
        <hr />
      </div>
    </div>
  )
}

export default ProductionSurveilance