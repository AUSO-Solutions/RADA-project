import { AttachFileOutlined } from '@mui/icons-material'
import { colors } from 'Assets'
import Text from 'Components/Text'
import React, {  } from 'react'
import { BsX } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { setFormdata } from 'Store/slices/formdataSlice'

const Attachment = ({ details }) => {
  // const [file, setFile] = useState(null)
  const formdata = useSelector(state => state?.formdata)
  const dispatch = useDispatch()

  return (
    <div>
      <div className='border p-4 rounded bg-[#FAFAFAFA] h-[200px]'>
        <Text className={'py-4'}>
          Broadcast to:

        </Text>
        <div>
          <Text>  {formdata?.selectedGroups?.map(group => group?.groupName)?.join(', ')}</Text>
        </div>

        Report Details : <br />
        <Text color={colors.rada_blue} weight={600}>{details}</Text>

      </div>
      <input type="file" name="" hidden id="fileIput" onChange={e => dispatch(setFormdata({ name: 'file', value: e.target.files[0] }))} />
      <div className='my-3'>
        {formdata?.file && <BsX size={20} onClick={() => dispatch(setFormdata({ name: 'file', value: null }))} />}

        {
          formdata?.file ?
            <div className='border  p-2 flex mb-3 cursror-pointer rounded items-center justify-between px-2'>
              <Text>{formdata?.file?.name}  </Text>
              <label htmlFor="fileIput">  <Text color={colors.rada_blue} className={'w-fit'}>  <AttachFileOutlined />
                Replace file</Text></label>
            </div>

            : <label htmlFor="fileIput"> <div className='border border-dashed p-2 flex  h-[100px] cursror-pointer rounded items-center justify-center'>

              <div>
                <AttachFileOutlined /> Attach File
              </div>

            </div>
            </label>

        }
      </div>


    </div >
  )
}

export default Attachment