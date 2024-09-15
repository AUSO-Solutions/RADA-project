import * as React from 'react';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function RadaDatePicker({onChange=()=>null,defaultValue,disabled}) {
  return (
   <>
   <input type="date" name="" className='border rounded px-2 py-2 outline-none' disabled={disabled} defaultValue={dayjs(defaultValue).format("YYYY-MM-DD")} id="" onChange={(e)=>onChange(e.target.value)} />
   <LocalizationProvider   dateAdapter={AdapterDayjs}>
      {/* <DemoContainer   sx={{p:0, height:'30px', bgcolor:'red'}} components={['DatePicker']}> */}
        {/* <DatePicker  sx={{p:0, height:'30px'}} label="Select Date" onChange={onChange} /> */}
      {/* </DemoContainer> */}
    </LocalizationProvider>
    </>
  );
}
