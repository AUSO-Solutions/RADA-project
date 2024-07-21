import RadaTable from 'Components/RadaTable'
import React from 'react'



const Summary = () => {

  return (
    <div>
      <div className='w-full flex flex-row justify-between px-10 mt-3' >
        <div className='w-[100px] h-[40px] bg-[#FAFAFA] rounded-2xl border-2 flex items-center gap-2 justify-center' >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19 19H5V5H19V19.1M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#4E4E4E" />
          </svg>

          Chart
        </div>
        <div className='border-2 border-[#FAFAFA] flex items-center justify-center px-3 rounded-lg' >27-June-2024</div>
      </div>

      <div className='mt-5' >
        <RadaTable noaction noNumbers noSearch headBgColor='#FAFAFA'
          // firebaseApi='getGroups'
          columns={[
            { name: 'Item', key: "name" },
            {
              name: 'Target',
            },
            {
              name: 'Actual',
            },
            {
              name: 'Remarks',
            },
          ]} 
          
          data={[
            {name:"Gross Liquid (bbls/day)"},
            {name:"BS&W (%)"},
            {name:"Net Oil (bbls/day)"},
            {name:"Produced Gas (mmscf)"},
            {name:"Export Gas (mmscf)"},
            {name:"Fuel Gas Consumed (mmscf)"},
            {name:"Flare Gas (mmscf)"},
            {name:"Condensate Produced (bbls)"},
            {name:"Barged Crude (bbls)"},
            {name:"Export Gas (BOE)"},
            {name:"Total bopd + BOE"},
            {name:"Condensate Shipped (bbls)"},
            {name:"Cumulative Offtake (bbls)"},

          ]}/>
      </div>


    </div>
  )
}

export default Summary