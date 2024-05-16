import { Input, RadaForm } from 'Components'
import Dropdown from 'Components/dropdown'
import React, { useCallback, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { BsCheck, BsXLg } from 'react-icons/bs'
// import { toast } from 'react-toastify';
import { forms } from './formFields';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';


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
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

 
  const tabs = [
    'New field data',
    'Existing field data'
  ]
  // const handleFormChange = (index) => {
  //   const selectedTab = tabs[index]
  //   const page = (selectedTab?.replaceAll(' ', '-')?.toLowerCase())
  //   const link = page === 'existing-field-data' ? `?page=${page}&field-id=1` : `?page=${page}`
  //   navigate(pathname + link)
  // }
  const currentPage = useMemo(() => {
    const page = new URLSearchParams(search).get("page")?.replaceAll('-', ' ') || " "
    const fieldId = new URLSearchParams(search).get("field-id")?.replaceAll('-', ' ') || null
    const currTab_ = page[0].toUpperCase() + page.slice(1);
    const currTab = tabs.indexOf(currTab_)
    return {
      currTab, fieldId
    }
  }, [search])

  const { data: field } = useQuery(`/fields/get-field-by-id/${currentPage?.fieldId}`, { enabled: Boolean(parseInt(currentPage?.fieldId)) })

  const existing_form_data = useMemo(() => {

    const entries = Object.entries(field || {}) || []
    return { entries, field: field || {} }
  }, [field])


  const isExist = useCallback((key) => {
    return existing_form_data.field[key] || false
  }, [])
  const getDefaultValue = useCallback((key, innerKey) => {
    let value = ''

    if (field) {
      if (field[key]) {
        if (field[key][innerKey]) {
          value = field[key][innerKey]
        }
      }
    }
    return value

  }, [existing_form_data])

  return (

    <div
      style={{
        display: 'grid', gap: '30px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY:'auto'
        ,
        placeItems:'center'
        // height: "700px", 
      }}
      className=' w-full h-[600px] py-4'
    >
      {/* < div style={{ display: 'flex', gap: '20px', }} className='b'>
        {tabs.map((x, i) => <Tab className='!text-[white]' key={i} text={x} active={i === currentPage.currTab} onClick={() => handleFormChange(i)} />)}
      </ div> */}
      {Object.values(forms).map((form) => {
        return (
          <Dropdown header={<div className='flex gap-2 items-center'>{form.name} {isExist(form.key) && <BsCheck />} </div>}>
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
                      { }
                      <Input {...field} defaultValue={getDefaultValue(form.key, field.name)} />
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