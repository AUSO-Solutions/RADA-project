import { Input, RadaForm } from 'Components'
import Dropdown from 'Components/dropdown'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { BsXLg } from 'react-icons/bs'
// import { toast } from 'react-toastify';
import { forms } from './formFields';
import { useSelector } from 'react-redux';


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

  const state = useSelector(state => state.auth.user)


  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px',  justifyContent: 'center', alignItems: 'center' , overflow:'scroll'}}
>
      {Object.values(forms).map((form) => {
        return (
          <Dropdown header={form.name}>
            <RadaForm
              method={'post'}
              btnText={'Save'}
              btnClass={'px-5'}
              url={`${form.url}?email=${state.data.email}`}
              onSuccess={handleOpen}
            >

              <div className='flex flex-wrap justify-between'>
                {
                  form.fields.map(field => (
                    <div className={'!min-w-[47%]'}>
                      <Input {...field} />
                    </div>
                  ))
                }
              </div>

              {/* <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
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

              </div>
              <Button width={'100px'} onClick={() => toast.success('Production Figures Uploaded Successfully')} >Save</Button> */}
            </RadaForm>
          </Dropdown >
        )
      })}

      {/* <Dropdown header={'Production Volume'}>
        <RadaForm url={`/fields/create-production-volume-field?email=emmanueloludairo61@gmail.com`} style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Input label={'Well ID)'} name={'wellIdentity'} />
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

          </div>
          <Button width={'100px'} onClick={() => toast.success('Production Figures Uploaded Successfully')} >Save</Button>
        </RadaForm>
      </Dropdown >

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

            </div>
            <Button width={'100px'} >Save</Button>
          </div>
        } /> */}


      {/* <Dropdown header={'Well Flow'}
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
        } /> */}



      {/* <Button onClick={handleOpen} width={'150px'} >Done</Button> */}
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