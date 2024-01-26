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
        position: 'absolute' ,
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

    <div style={{display: 'flex', flexDirection: 'column', gap: '30px', padding: '10px 10px', justifyContent: 'center', alignItems: 'center'}}>
        <Dropdown header={'Daily Provisional Production Figures'} children={
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                    <Input label={'Gross Oil Produced (BPD)'} />
                    <Input label={'Net Oil Produced (BPD)'} />
                    
                </div>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                <Input label={'BSW (BBL)'} />
                <Input label={'Gas Produced (MMSCF)'} />

                </div>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                   
                    <Input label={'Exported Gas (MMSCF)'} />
                    <Input label={'Flared Gas (MMSCF)'} />
                </div>
                <Button width={'100px'} onClick={()=> toast.success('Production Figures Uploaded Successfully')} >Save</Button>
            </div>
        } />
        <Dropdown header={'Well History'} 
        children={
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                  <Input label={'Gross Oil Produced (BPD)'} />
                  <Input label={'Net Oil Produced (BPD)'} />
                  
              </div>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

              </div>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                 
                  <Input label={'Exported Gas (MMSCF)'} />
                  <Input label={'Flared Gas (MMSCF)'} />
              </div>
              <Button width={'100px'} >Save</Button>
          </div>
      } />
        <Dropdown header={'Shipment'} 
        children={
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                  <Input label={'Gross Oil Produced (BPD)'} />
                  <Input label={'Net Oil Produced (BPD)'} />
                  
              </div>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
              <Input label={'BSW (BBL)'} />
              <Input label={'Gas Produced (MMSCF)'} />

              </div>
              <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                 
                  <Input label={'Exported Gas (MMSCF)'} />
                  <Input label={'Flared Gas (MMSCF)'} />
              </div>
              <Button width={'100px'} >Save</Button>
          </div>
      } />
        <Dropdown header={'HSE/Security'}  
          children={
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                    <Input label={'Gross Oil Produced (BPD)'} />
                    <Input label={'Net Oil Produced (BPD)'} />
                    
                </div>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                <Input label={'BSW (BBL)'} />
                <Input label={'Gas Produced (MMSCF)'} />

                </div>
                <div style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                   
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
            <div style={{display: 'flex', color: '#0F5582', justifyContent: 'flex-end', alignItems: 'flex-end',}} >
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
