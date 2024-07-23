import { Button } from 'Components'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { firebaseFunctions } from 'Services'
import handleError from 'Services/handleError'
import { closeModal } from 'Store/slices/modalSlice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import cvsToJson from 'util/cvsToJson'


const ImportUsers = () => {
  const [file, setFile] = useState({})
  const handleCsv = (e) => {
    // const file = e.target.files[0]
    setFile(e.target.files[0])
  }

  const dispatch = useDispatch()

  const upload = () => {
    cvsToJson(file, "user-template.csv", async (jsonData) => {
      // console.log(jsonData)
      try {
        await firebaseFunctions('createUsers', { users: jsonData })
        dispatch(closeModal())
      } catch (error) {
        handleError(error)

      }

      // const allFilled = (data, fields = []) => fields.every(field => data?.[field])
      // const listCompete = jsonData?.every(user => allFilled(user, ['firstName', 'lastName', 'email']))
      // console.log(listCompete)
      // const chechDuplicateEmails = (list = []) => {
      //   let alreadySeen = {}, res = false;
      //   list.forEach(function (str) {
      //     if (alreadySeen[String(str).toLowerCase()]) { res = true }
      //     else { alreadySeen[String(str).toLowerCase()] = true; }
      //   });
      //   return res
      // }
      // const hasDuplicateEmail = chechDuplicateEmails(jsonData?.map(data => data?.email))
      // console.log(hasDuplicateEmail)

    })
  }
  return (
    <div>
      <ConfirmModal onProceed={upload} message='' >
        <div className='flex border justify-center'>
          <input type="file" name="" id="" onChange={handleCsv} className='w-' accept=".csv,.xlsx,.xls" />
        </div>
        {/* <Button onClick={upload}>Proceed </Button> */}
      </ConfirmModal>
    </div>
  )
}

export default ImportUsers