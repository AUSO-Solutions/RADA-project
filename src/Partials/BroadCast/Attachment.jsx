import { AttachFileOutlined } from '@mui/icons-material'
import { colors } from 'Assets'
import Text from 'Components/Text'
import React, { useState } from 'react'
import { BsX } from 'react-icons/bs'
import { useSelector } from 'react-redux'

const Attachment = () => {
  const [file, setFile] = useState(null)
  const formdata = useSelector(state => state?.formdata)
  return (
    <div>
      <div className='border p-4 rounded bg-[#FAFAFAFA] h-[200px]'>
        <Text className={'py-4'}>
          Broadcast to:

        </Text>
        <div>
          {formdata?.selectedGroups?.map(group => <Text> Petroleum Engineering</Text>)}
        </div>

        Report Details : <br />
        <Text color={colors.rada_blue} weight={600}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024</Text>

      </div>
      <input type="file" name="" hidden id="fileIput" onChange={e => setFile(e.target.files[0])} />
      <div className='my-3'>
        {file && <BsX size={20} onClick={() => setFile(null)} />}

        {
          file ?
            <div className='border  p-2 flex mb-3 cursror-pointer rounded items-center justify-between px-2'>
              <Text>{file?.name}  </Text>
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