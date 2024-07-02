import { Button } from 'Components'
import React from 'react'
import cvsToJson from 'util/cvsToJson'


const ImportUsers = () => {
  const handleCsv =(e)=>{
    const file =  e.target.files[0]
    cvsToJson(file,"user-template.csv")

  }
  return (
    <div>
        <input type="file" name="" id=""  onChange={handleCsv}   accept=".csv,.xlsx,.xls"/> <br /><br />
        <Button>Proceed </Button>
    </div>
  )
}

export default ImportUsers