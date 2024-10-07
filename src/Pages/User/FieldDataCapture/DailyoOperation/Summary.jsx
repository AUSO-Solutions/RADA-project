import RadaTable from 'Components/RadaTable'
import React, { useState } from 'react'
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Text from 'Components/Text';
import { Close } from '@mui/icons-material';
import RadioSelect from './RadioSelect';

ChartJS.register(ArcElement, Tooltip, Legend);



const Summary = () => {

  const [showChart, setShowChart] = useState(false);
  const switches = ['Oil/Condensate', 'Gas'];


  const data = {
    labels: ["Produced Gas", "Export Gas", "Flared Gas"],
    datasets: [
      {
        label: "Gas Distribution",
        data: [60, 30, 10],
        backgroundColor: [
          "#29A2CC",
          "#D31E1E",
          "#FFDE2E"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        padding: 50,
        labels: {
          font: {
            size: 12,
            family: "'Arial', sans-serif",
            weight: "normal",
          },
          color: "#333",
          boxWidth: 12,
          padding: 20,
        }
      },
    },

  };


  return (
    <div className='relative' >
      <div className='w-full flex flex-row justify-between px-10 mt-3' >
        <div onClick={() => setShowChart(!showChart)} className='w-[100px] h-[40px] bg-[#FAFAFA] cursor-pointer rounded-2xl border-2 flex items-center gap-2 justify-center' >
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
            { name: "Gross Liquid (bbls/day)" },
            { name: "BS&W (%)" },
            { name: "Net Oil (bbls/day)" },
            { name: "Produced Gas (mmscf)" },
            { name: "Export Gas (mmscf)" },
            { name: "Fuel Gas Consumed (mmscf)" },
            { name: "Flare Gas (mmscf)" },
            { name: "Condensate Produced (bbls)" },
            { name: "Barged Crude (bbls)" },
            { name: "Export Gas (BOE)" },
            { name: "Total bopd + BOE" },
            { name: "Condensate Shipped (bbls)" },
            { name: "Cumulative Offtake (bbls)" },

          ]} />


      </div>


      {showChart && (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', position: 'absolute', top: 0, right: 10, width: '45%', height: '90%', borderRadius: 5, boxShadow: '2px 1px 5px  #242424' }}>
          <div style={{ marginTop: 30, paddingRight: 20, paddingLeft: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text weight={700} size={'16px'} >Chart</Text>
            <Close style={{ cursor: 'pointer' }} onClick={() => setShowChart(false)} />
          </div>

          <div className=' ml-5 mt-5 '>
            <RadioSelect list={switches}
            // defaultValue={tables.find(table => searchParams.get('table') === table.replaceAll(' ', '-').toLowerCase()) || tables[0]} 
            // onChange={(value) => setSearchParams(prev => {
            //     prev.set('table', value.replaceAll(' ', '-').toLowerCase())
            //     return prev
            // })} 
            />
          </div>

          <div style={{ padding:90, display: 'flex', justifyContent: 'center', alignItems: 'center',  }} >
            <Pie data={data} options={options} />
          </div>

        </div>
      )}


    </div>
  )
}

export default Summary