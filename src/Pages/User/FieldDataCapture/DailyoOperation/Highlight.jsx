import { Box } from '@mui/material'
import { Button } from 'Components'
import Text from 'Components/Text'
import React, { useState } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { openModal } from 'Store/slices/modalSlice'
import Editor from 'react-simple-wysiwyg';


const NoteBox = ({ onSave, highlightType, flowstation, captureData }) => {
    const prev = captureData[flowstation]?.highlight?.[highlightType]
    // console.log(captureData)
    const [html, setHtml] = useState(prev)
    const saveNote = () => {
        if (!html) {
            toast.error("Please provide a note")
            return
        }
        onSave(html, highlightType, flowstation)
    }
    return (
        <div className=' flex flex-col  '>
            <Editor value={html} onChange={(event) => setHtml(event.target.value)} />
            <Button className={'mt-2'} onClick={saveNote}>Save</Button>
        </div>
    )
}


const SelectFlowstation = ({ captureData, onSelect = () => null }) => {
    return (
        <Box sx={{ width: "400px" }}>
            <Text size={18} weight={600} color={'grey'}> Select Flowstation</Text><br />
            <div className='flex flex-col gap-2 '>
                {
                    Object.keys(captureData || {})?.map(flowstation => {
                        return <div onClick={() => onSelect(flowstation)} className='border rounded-[12px] cursor-pointer  w-full p-2 flex items-center justify-between'>
                            <Text>{flowstation}</Text> <BsChevronRight />
                        </div>
                    })
                }
            </div>
        </Box>
    )
}
const SelectHighlightType = ({ onSelect = () => null, flowstation }) => {

    const highlightTypes = ['production', 'maintenance', 'operation']
    return (
        <Box sx={{ width: "400px" }}>
            <Text size={18} weight={600} color={'grey'}> Select Highlight type for {flowstation}</Text><br />
            <div className='flex flex-col gap-2 '>
                {
                    highlightTypes.map(highlightType => {
                        return <div onClick={() => onSelect(highlightType, flowstation)} className='border rounded-[12px] cursor-pointer  !w-[100%] p-2 flex items-center justify-between'>
                            <Text className={'capitalize'}>{highlightType}</Text> <BsChevronRight />
                        </div>
                    })
                }
            </div>
        </Box>
    )
}

const Note = ({ title = "Highlight", onSave = () => null, captureData }) => {

    const dispatch = useDispatch()

    const save = (highlight, highlightType, flowstation) => {
        onSave({
            flowstation: flowstation,
            highlightType: highlightType,
            highlight: highlight
        })
    }

    const openNotes = (highlightType, flowstation) => {
        dispatch(openModal({ title: <><span className='capitalize'>{highlightType}</span> highlight for {flowstation} </>, component: <NoteBox highlightType={highlightType} flowstation={flowstation} onSave={save} captureData={captureData} /> }))
    }

    const openHighlights = (flowstation) => {
        dispatch(openModal({ title: "Highlight Type", component: <SelectHighlightType onSelect={openNotes} flowstation={flowstation} /> }))
    }

    const openNoteBox = () => {
        dispatch(openModal({
            title,
            component: <SelectFlowstation
                captureData={captureData}
                onSelect={openHighlights}
            />
        }))
    }
    return (
        <>
            <Button onClick={openNoteBox} className={''}>Add highlight</Button>

        </>
    )
}

export default Note