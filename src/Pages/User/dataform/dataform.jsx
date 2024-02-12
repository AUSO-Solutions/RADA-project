import { Button, Input } from 'Components'
import Dropdown from 'Components/dropdown'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { BsXLg } from 'react-icons/bs'
import { toast } from 'react-toastify';


const DataForm = () => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #0F5582',
    boxShadow: 24,
    borderRadius: '5px',
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '10px 10px', justifyContent: 'center', alignItems: 'center' }}>
      <Dropdown header={'Production Volume'} children={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Input label={'Well ID)'} />
            <Input label={'Created Date'} />

          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Input label={'Basic Sediment and Water'} />
            <Input label={'Net Oil'} />

          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

            <Input label={'Produced Gas'} />
            <Input label={'Export Gas '} />
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

            <Input label={'Fuel Gas'} />
            <Input label={'Flare Gas '} />
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

            <Input label={'Condensate Produced'} />
            <Input label={'Loss '} />
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

            <Input label={'Water Gas Rate'} />
            <Input label={'Status '} />
          </div>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

            <Input label={'Updated Date'} />
            {/* <Input label={'Status '} /> */}
          </div>
          <Button width={'100px'} onClick={() => toast.success('Production Figures Uploaded Successfully')} >Save</Button>
        </div>
      } />

      <Dropdown header={'Cumulative Production'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Production Days Uptime'} />
              <Input label={'Choke Size'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Oil Rate'} />
              <Input label={'Gas Rate'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Water Rate'} />
              <Input label={'Basic Sediment and Water'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Gross Oil'} />
              <Input label={'Net Oil'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Cumulative Oil'} />
              <Input label={'Cumulative Gas'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Cumulative Water'} />
              <Input label={'Average Net Oil'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Average Gross Oil'} />
              <Input label={'Status'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Updated Date'} />
              {/* <Input label={'Status'} /> */}
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        } />


      <Dropdown header={'Well Flow'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Flowing Turbing Head Pressure THB'} />
              <Input label={'Flow Line Pressure'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Choke Size'} />
              <Input label={'Casing Head Pressure'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Manifold Head Pressure'} />
              <Input label={'Short In Tubing Head Pressure'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        } />


      <Dropdown header={'OFM Sys Configuration'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Module'} />
              <Input label={'Property'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Value'} />
              <Input label={'Status'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Updated Date'} />
              {/* <Input label={'Status'} /> */}
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Date Range'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Property'} />
              <Input label={'Value'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Field Prod'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Table Name'} />
              <Input label={'Field Name'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Field Property'} />
              <Input label={'Field Value'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Multipliers'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Metric 1'} />
              <Input label={'Metric 2'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'English'} />
              <Input label={'Factor'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>

            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Parser'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Type'} />
              <Input label={'Name'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Code'} />
              <Input label={'Definition'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Username'} />
              <Input label={'VAR Class'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Table Info'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                <Input label={'Well ID)'} />
                <Input label={'Created Date'} />

              </div>

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Table Name'} />
              <Input label={'Table Property'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Table Value'} />
              <Input label={'Status'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Updated Date'} />
              {/* <Input label={'Status'} /> */}
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Table Map'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Table Name'} />
              <Input label={'Field Name'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Source Table'} />
              <Input label={'Source Field'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'OFM Sys Units'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Metric'} />
              <Input label={'English'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Operation'} />
              <Input label={'Factor'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'Bottom Head Pressure'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Build Up Time'} />
              <Input label={'CP Grad'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Datum Pressure'} />
              <Input label={'DOB'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'FBHP'} />
              <Input label={'FBHT'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'FP Grad'} />
              <Input label={'GPI'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'BS & W'} />
              <Input label={'GOR'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Choke Size'} />
              <Input label={'Initial Reservoir Pressure'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Reservoir Bubble Point Pressure'} />
              <Input label={'THP'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'chp'} />
              <Input label={'FBHP'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'SBHP'} />
              <Input label={'Calculated Reservoir Pressure'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />


      <Dropdown header={'Deviation Data'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well ID)'} />
              <Input label={'Created Date'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Well Bore'} />
              <Input label={'MDAH FT'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'TVBDF FT'} />
              <Input label={'DY FT'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'DX FT'} />
              <Input label={'UNCL'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'AZM'} />
              <Input label={'Well UMI'} />
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Status'} />
              <Input label={'Updated Date'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />

      
      <Dropdown header={'Master'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'Monthly Production'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Annotation'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Annotation Config'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Analytical'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Case'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Configuration'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Entity'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Forecast'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Group'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Hist Production'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Hist Regression'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Hist Regression'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Limits'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Ratio'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Ratio Forecast'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Results'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data DCA Schedule'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Deviation'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Entity Color'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Fault'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Log'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Marker'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data Pattern'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data PVT'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data WBD Anno'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data WBD Equipment'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data WBD Header'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'OFM Data WBD View'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'PVT CMS'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'PVT DV'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'PVT SEP'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'PVT VISC'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'Sort Category'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Dropdown header={'Well Test'}
        children={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'Gross Oil Produced (BPD)'} />
              <Input label={'Net Oil Produced (BPD)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>

              <Input label={'Exported Gas (MMSCF)'} />
              <Input label={'Flared Gas (MMSCF)'} />
            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        }
      />
      <Button onClick={handleOpen} width={'150px'} >Done</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: 'flex', color: '#0F5582', justifyContent: 'flex-end', alignItems: 'flex-end', }} >
            <BsXLg onClick={handleClose} style={{ cursor: 'pointer', display: 'flex', color: '#0F5582', justifyContent: 'center', alignItems: 'center', }} />
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload successful
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Data has been uploaded and awaits validation.
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default DataForm
