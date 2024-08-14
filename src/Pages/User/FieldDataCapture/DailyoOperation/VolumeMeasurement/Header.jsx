import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RadioSelect from '../RadioSelect'
import RadaDatePicker from 'Components/Input/RadaDatePicker'
import { MdOutlineSettings } from 'react-icons/md'


const Header = ({onReportTypeChange=()=>null,onSettingsClick=()=>null,}) => {
    const setupData = useSelector(state => state.setup)

  const [showSettings, setShowSettings] = useState(false)
    const dispatch = useDispatch()
    // console.log(setupData?.reportTypes)
  
    const [currReport, setCurrReport] = useState(setupData?.reportTypes?.[0])
    useEffect(() => {
      dispatch(clearSetup({}))
    }, [dispatch])
    useEffect(()=>{
      setCurrReport(setupData?.reportTypes?.[0])
    },[setupData?.reportTypes])

    useEffect(()=>{
        onReportTypeChange(currReport)
    },[currReport])

    return (
        <div className='flex justify-between my-2 px-2 items-center'>
            <div className='flex gap-4 items-center'>
                <RadioSelect onChange={setCurrReport} defaultValue={setupData?.reportTypes?.[0]} list={setupData?.reportTypes} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
            </div>
            <div className='flex items-center gap-2 '>
                <Text className={'cursor-pointer'} onClick={() => setSetupTable(false)} color={colors.rada_blue}>View setups</Text>
                <RadaDatePicker />
                <div onClick={onSettingsClick} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
                    <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
                </div>
            </div>
        </div>
    )
}

export default Header