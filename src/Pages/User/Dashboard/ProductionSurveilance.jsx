import Text from 'Components/Text'
import { useFetch } from 'hooks/useFetch'
import React, { useMemo } from 'react'
// import LineChart from './Line'

const ProductionSurveilance = () => {
  const { data } = useFetch({ firebaseFunction: 'getSurveillanceData', payload: { asset: 'OML 24', flowstation: 'Awoba Flowstation', } })
  const result = useMemo(() => data.length ? JSON.parse(data) : [], [data])
  const liquidOil = useMemo(() => {
    const data = result
    console.log(data)
    return {
      data
    }
  }, [result])
  console.log(liquidOil)
  // const liquidOil = {
  //   data: [
  //     {
  //       id: 1,
  //       year: 2016,
  //       userGain: 80000,
  //       userLost: 823
  //     },
  //     {
  //       id: 2,
  //       year: 2017,
  //       userGain: 45677,
  //       userLost: 345
  //     },
  //     {
  //       id: 3,
  //       year: 2018,
  //       userGain: 78888,
  //       userLost: 555
  //     },
  //     {
  //       id: 4,
  //       year: 2019,
  //       userGain: 90000,
  //       userLost: 4555
  //     },
  //     {
  //       id: 5,
  //       year: 2020,
  //       userGain: 4300,
  //       userLost: 234
  //     }
  //   ],
  //   datasets: [
  //     {
  //       label: "Users Gained ",
  //       data: data.map((datum) => datum.userGain),
  //       backgroundColor: [
  //         "rgba(75,192,192,1)",
  //         "&quot;#ecf0f1",
  //         "#50AF95",
  //         "#f3ba2f",
  //         "#2a71d0"
  //       ],
  //       borderColor: "black",
  //       borderWidth: 2
  //     },
  //     {
  //       label: "Users Lost ",
  //       data: data.map((data) => data.userLost),
  //       backgroundColor: [
  //         "rgba(75,192,192,1)",
  //         "&quot;#ecf0f1",
  //         "#50AF95",
  //         "#f3ba2f",
  //         "#2a71d0"
  //       ],
  //       borderColor: "black",
  //       borderWidth: 2
  //     },
  //   ]
  // }


  return (
    <div className='p-3 flex flex-wrap gap-3 w-full '>
      <div className='w-[48%] h-[500px] border rounded p-3 '>
        <Text size={20} >Chart</Text>
        <hr />
        {/* <LineChart data={first} /> */}
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