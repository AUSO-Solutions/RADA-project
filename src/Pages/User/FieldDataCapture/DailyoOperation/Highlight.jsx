import { Box } from '@mui/material'
import { Button } from 'Components'
import Text from 'Components/Text'
import React, { useEffect, useState } from 'react'
import { BsChevronRight, BsCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { openModal } from 'Store/slices/modalSlice'
import Editor from 'react-simple-wysiwyg';
import { ArrowBack } from '@mui/icons-material'
import { setDefaultHighlights, setHighlights } from 'Store/slices/highlightsSlice'


// const highlightStatics = {
//     production: { color: 'green' },
//     operation: { color: 'yellow' },
//     production: { color: 'blue' },
// }

const GoBack = ({ onBack = () => null }) => {
    return <><ArrowBack className='cursor-pointer absolute border !rounded-full shadow flex items-cennter justify-center top-2 b' onClick={onBack} /></>
}

const NoteBox = ({ onSave, onChange, highlightType, flowstation, captureData, onBack = () => null }) => {

    const { data: highlights } = useSelector(state => state.highlights)
    const prev = highlights?.[flowstation]?.[highlightType]
    const [html, setHtml] = useState(prev)
    const saveNote = () => {
        if (!html) {
            toast.error("Please provide a note")
            return
        }
        onSave(highlights)
    }
    return (
        <div className=' flex flex-col w-[]  '>
            <GoBack onBack={() => onBack(highlightType, flowstation, html)} />
            <Editor value={html} onChange={(event) => {
                const value = (event.target.value === '<br>') ? '' : event.target.value
                console.log(value)
                setHtml(value)
                onChange(value, highlightType, flowstation)
            }} />
            <Button className={'mt-2'} onClick={saveNote}>Save</Button>
        </div>
    )
}

const SelectFlowstation = ({ captureData, onSelect = () => null, }) => {
    const highlightTypes = ['production', 'maintenance', 'operation']
    const { data: highlights } = useSelector(state => state.highlights)

    return (
        <Box sx={{ width: "400px" }}>
            <Text size={18} weight={600} color={'grey'}> Select Flowstation</Text><br />
            <div className='flex flex-col gap-2 '>
                {
                    Object.keys(captureData || {})?.map(flowstation => {
                        return <div onClick={() => onSelect(flowstation)} className='border rounded-[12px] cursor-pointer  w-full p-2 flex items-center justify-between'>
                            <Text>{flowstation}</Text>
                            <div className='flex items-center'>
                                <Text weight={600} className={'tracking-tighter'}>
                                    {highlights?.[flowstation]?.production ? 'P ' : ''}
                                    {highlights?.[flowstation]?.maintenance ? 'M' : ''}
                                    {highlights?.[flowstation]?.operation ? ' O' : ''}
                                </Text>
                                <BsChevronRight size={18} />
                            </div>
                        </div>
                    })
                }
            </div>
        </Box>
    )
}
const SelectHighlightType = ({ onSelect = () => null, flowstation, onBack = () => null, captureData }) => {

    const highlightTypes = ['production', 'maintenance', 'operation']
    const { data: highlights } = useSelector(state => state.highlights)
    const prev = highlights?.[flowstation]

    return (
        <Box sx={{ width: "400px" }}>

            <GoBack onBack={() => onBack(flowstation)} />
            <Text size={18} weight={600} color={'grey'}> Select Highlight type for {flowstation}</Text><br />
            <div className='flex flex-col gap-2 '>
                {
                    highlightTypes.map(highlightType => {
                        return <div onClick={() => onSelect(highlightType, flowstation)} className='border rounded-[12px] cursor-pointer  !w-[100%] p-2 flex items-center justify-between'>
                            <Text className={'capitalize'}>{highlightType}  </Text>
                            <div className='flex items-center'>
                                <BsCircleFill size={10} color={prev?.[highlightType] ? 'green' : "white"} />
                                <BsChevronRight size={18} />
                            </div>
                        </div>
                    })
                }
            </div>
        </Box>
    )
}

const Note = ({ title = "Highlight", onChange = () => null, captureData, onSave = () => null }) => {

    const dispatch = useDispatch()

    useEffect(() => {
        const highlights = Object.fromEntries(Object.entries(captureData || {}).map(entry => [entry[0], entry[1]?.highlight]))
        dispatch(setDefaultHighlights(highlights))
        // console.log('--------')
    }, [captureData, dispatch])

    const change = (highlight, highlightType, flowstation) => {
        dispatch(setHighlights({
            flowstation: flowstation,
            highlightType: highlightType,
            highlight: highlight
        }))
        onChange({
            flowstation: flowstation,
            highlightType: highlightType,
            highlight: highlight
        })
    }

    const openNotes = (highlightType, flowstation) => {
        dispatch(openModal({
            title: <><span className='capitalize'>{highlightType}</span> highlight for {flowstation} </>,
            component: <NoteBox
                // highlights={highlights.current}
                highlightType={highlightType}
                flowstation={flowstation} onChange={change} captureData={captureData}
                onBack={(highlight) => openHighlights(flowstation)} onSave={onSave}
            />
        }))
    }

    const openHighlights = (flowstation) => {
        dispatch(openModal({
            title: "Highlight Type", component: <SelectHighlightType onSelect={openNotes} flowstation={flowstation} captureData={captureData}
                onBack={() => openNoteBox(flowstation)} />
        }))
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